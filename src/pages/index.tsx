import Header from "@/components/header";
import Leftbar from "@/components/leftbar";
import Pagination from "@/components/pagination";
import ProdViewer from "@/components/prodViewer";
import Topbar from "@/components/topbar";
import { Context } from "@/context";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateStates } from "@/redux/reducer";
import { productType, reviewInfo, siteNames } from "@/types";
import { Box, styled, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    rating,
    searched,
    filteredProd,
    maxPrice,
    minPrice,
    pageNo,
    products,
    reviewInfo,
    sortBy,
    selectedSites,
  } = useAppSelector((state) => state.state);
  const [inputText, setInputText] = useState<string>("");
  const prevAbortController = useRef(new AbortController());
  const prevTaskUrl = useRef("");
  const context = useContext(Context);
  useEffect(() => {
    const newFilter = products.filter(
      (a) =>
        selectedSites.includes(a.site) &&
        a.price >= minPrice &&
        a.price <= maxPrice &&
        a.ratingValue >= rating
    );

    let cmp = (a: productType, b: productType) => {
      return (
        b.ratingValue * 10 + b.noOfRating - (a.ratingValue * 10 + a.noOfRating)
      );
    };

    if (sortBy === 1) {
      cmp = (a: productType, b: productType) => {
        return a.price - b.price;
      };
    } else if (sortBy === 2) {
      cmp = (a: productType, b: productType) => {
        return b.price - a.price;
      };
    }

    const sorted = newFilter.sort(cmp);
    let isSame = filteredProd.length === sorted.length;
    if (isSame) {
      for (let i = 0; i < sorted.length; i++) {
        if (filteredProd[i].url !== sorted[i].url) {
          isSame = false;
          break;
        }
      }
    }

    if (!isSame) dispatch(updateStates({ filteredProd: sorted, pageNo: 1 }));
  }, [sortBy, rating, minPrice, maxPrice, selectedSites, products, dispatch]);

  useEffect(() => {
    if (prevTaskUrl.current.length > 0) {
      prevTaskUrl.current = "";
      try {
        prevAbortController.current.abort();
      } catch {
        console.log("prev controller aborted");
      }
    }
    (async () => {
      const currProds = filteredProd.slice(
        (pageNo - 1) * 10,
        (pageNo - 1) * 10 + 10
      );
      let shouldFetch: productType[] = [];

      for (const prod of currProds) {
        if (prod.site === siteNames[siteNames.Daraz]) {
          const currentStatus = reviewInfo.find(
            (a) => a.url === prod.url
          )?.status;
          if (
            currentStatus &&
            (currentStatus === "waiting" || currentStatus === "pending")
          ) {
            shouldFetch.push(prod);
            break;
          }
        }
      }

      // shouldFetch.length = 0;

      if (shouldFetch.length > 0) {
        const controller = new AbortController();
        prevAbortController.current = controller;
        prevTaskUrl.current = shouldFetch[0].url;
        try {
          console.log("api initiated");

          const res = await axios.post(
            "api/review",
            {
              site: shouldFetch[0].site,
              url: shouldFetch[0].url,
              title: shouldFetch[0].title,
            },
            {
              signal: controller.signal,
            }
          );
          if (res.status === 200) {
            prevTaskUrl.current = "";
            const { url, status, bn, bnN, bnP, en, enN, enP, result } =
              res.data.data;
            console.log("-------->", res.data.data);

            const reviewIndex = reviewInfo.findIndex(
              (a) => a.url === shouldFetch[0].url
            );
            if (reviewIndex !== -1) {
              const temp = [...reviewInfo];
              temp[reviewIndex] = {
                status: "done",
                url: reviewInfo[reviewIndex].url,
                title: reviewInfo[reviewIndex].title,
                bn,
                bnN,
                bnP,
                en,
                enN,
                enP,
                result,
              };
              dispatch(
                updateStates({
                  reviewInfo: temp,
                })
              );
            }
          }
        } catch (error: any) {
          prevTaskUrl.current = "";
          if (error?.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.log("Error:", error);
          }
        }
      }
    })();
    return () => {
      console.log(prevTaskUrl.current);
    };
  }, [pageNo, filteredProd, reviewInfo, dispatch]);

  const searchHandler = async (text: string) => {
    context.changeLoadingState(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchText: text }),
    };
    const response = await fetch(`api/`, requestOptions);
    if (response.status === 200) {
      const { data } = await response.json();
      const newReviewInfo: reviewInfo[] = data.reduce(
        (acc: reviewInfo[], d: productType) => {
          if (d?.site === siteNames[siteNames.Daraz]) {
            acc.push({
              url: d?.url,
              title: d?.title,
              status: "waiting",
              bn: 0,
              bnN: 0,
              bnP: 0,
              en: 0,
              enN: 0,
              enP: 0,
              result: [],
            });
            return acc;
          }
          return acc;
        },
        []
      );
      dispatch(
        updateStates({
          searched: true,
          reviewInfo: newReviewInfo,
          products: data,
          sortBy: 0,
          rating: 0,
          minPrice: 0,
          maxPrice: 1000000000,
          selectedSites: Object.keys(siteNames).filter((v) => isNaN(Number(v))),
          pageNo: 1,
        })
      );
      setInputText("");
      context.changeLoadingState(false);
    } else {
      dispatch(updateStates({ searched: true }));
      console.log("something went wrong", response.status);
      context.changeLoadingState(false);
    }
  };

  const changeRatingHandler = (newRating: number) => {
    if (rating === newRating) dispatch(updateStates({ rating: 0 }));
    else dispatch(updateStates({ rating: newRating }));
  };

  const changeMinPriceHandler = (newPrice: number) => {
    dispatch(updateStates({ minPrice: newPrice }));
  };
  const changeMaxPriceHandler = (newPrice: number) => {
    dispatch(updateStates({ maxPrice: newPrice }));
  };
  const changeSelectedSiteHandler = (siteName: string) => {
    const temp = [...selectedSites];
    const index = temp.indexOf(siteName);
    if (index === -1) temp.push(siteName);
    else temp.splice(index, 1);
    dispatch(updateStates({ selectedSites: temp }));
  };
  const changePageNoHandler = (newPage: number) => {
    dispatch(updateStates({ pageNo: newPage + 1 }));
  };

  return (
    <>
      <Header
        onSearch={searchHandler}
        inputText={inputText}
        changeText={setInputText}
      />
      {searched === false ? (
        <Box
          sx={{
            width: `${context.screenWidth >= 1360 ? "1360px" : "850px"}`,
            height: "calc(100% - 200px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "36px",
              color: "#8080807d",
            }}
          >
            Discover your best deal
          </Typography>
        </Box>
      ) : (
        <>
          <Topbar
            totalItems={filteredProd.length}
            sortBy={sortBy}
            changeSortBy={(newVal: number) => {
              dispatch(updateStates({ sortBy: newVal }));
            }}
          />
          <Container>
            <Leftbar
              prodMinRating={rating}
              changeProdMinRating={changeRatingHandler}
              changeProdMinPrice={changeMinPriceHandler}
              changeProdMaxPrice={changeMaxPriceHandler}
              selectedSiteNames={selectedSites}
              changeSelectedSites={changeSelectedSiteHandler}
            />

            <ProdViewer
              items={filteredProd}
              pageIndex={pageNo - 1}
              reviews={reviewInfo}
            />
          </Container>
          <Pagination
            totalPages={Math.ceil(filteredProd.length / 10)}
            selectedPageIndex={pageNo - 1}
            changeSelectedPageIndex={changePageNoHandler}
          />
        </>
      )}
      {context.isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: "70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Backdrop
            sx={{
              position: "relative",
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: context.screenWidth >= 1360 ? "1360px" : "850px",
              height: "calc(100vh - 70px)",
            }}
            open={context.isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      )}
    </>
  );
};

export default Home;

const Container = styled(Box)({
  width: "100%",
  height: "calc(100% - 200px)",
  display: "flex",
  overflow: "hidden",
  overflowY: "auto",
});
