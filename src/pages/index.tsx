import Header from "@/components/header";
import Leftbar from "@/components/leftbar";
import Pagination from "@/components/pagination";
import ProdViewer from "@/components/prodViewer";
import Topbar from "@/components/topbar";
import { Context } from "@/context";
import { productType, reviewInfo, siteNames } from "@/types";
import { Box, styled } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";

const Home = (): JSX.Element => {
  const [inputText, setInputText] = useState<string>("");
  const [products, setProducts] = useState<productType[]>([]);
  const [filteredProd, setFilteredProd] = useState<productType[]>([]);
  const [sortBy, setSortBy] = useState(0);
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [selectedSites, setSelectedSites] = useState(
    Object.keys(siteNames).filter((v) => isNaN(Number(v)))
  );
  const [pageNo, setPageNo] = useState(0);
  const [reviewInfo, setReviewInfo] = useState<reviewInfo[]>([]);
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
    setFilteredProd(newFilter);
    setPageNo(0);
  }, [sortBy, rating, minPrice, maxPrice, selectedSites, products]);

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
      const currProds = filteredProd.slice(pageNo * 10, pageNo * 10 + 10);
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
            },
            {
              signal: controller.signal,
            }
          );
          if (res.status === 200) {
            prevTaskUrl.current = "";
            const { bn, bnN, bnP, en, enN, enP } = res.data;
            console.log("-------->", res.data);

            const reviewIndex = reviewInfo.findIndex(
              (a) => a.url === shouldFetch[0].url
            );
            if (reviewIndex !== -1) {
              setReviewInfo((prev) => {
                const temp = [...prev];
                temp[reviewIndex] = {
                  status: "done",
                  url: reviewInfo[reviewIndex].url,
                  bn,
                  bnN,
                  bnP,
                  en,
                  enN,
                  enP,
                };
                return temp;
              });
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
  }, [pageNo, filteredProd, reviewInfo]);

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
            acc.push({ url: d?.url, status: "waiting" });
            return acc;
          }
          return acc;
        },
        []
      );
      setReviewInfo(newReviewInfo);
      setProducts(data);
      setInputText("");
      context.changeLoadingState(false);
    } else {
      console.log("something went wrong", response.status);
      context.changeLoadingState(false);
    }
  };

  const changeRatingHandler = (newRating: number) => {
    setRating((prevRating) => {
      if (prevRating === newRating) return 0;
      return newRating;
    });
  };

  const changeMinPriceHandler = (newPrice: number) => {
    setMinPrice(newPrice);
  };
  const changeMaxPriceHandler = (newPrice: number) => {
    setMaxPrice(newPrice);
  };
  const changeSelectedSiteHandler = (siteName: string) => {
    setSelectedSites((prevSites) => {
      const temp = [...prevSites];
      const index = temp.indexOf(siteName);
      if (index === -1) temp.push(siteName);
      else temp.splice(index, 1);
      return temp;
    });
  };

  return (
    <>
      <Header
        onSearch={searchHandler}
        inputText={inputText}
        changeText={setInputText}
      />
      <Topbar
        totalItems={filteredProd.length}
        sortBy={sortBy}
        changeSortBy={(newVal: number) => {
          setSortBy(newVal);
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
          pageIndex={pageNo}
          reviews={reviewInfo}
        />
      </Container>
      <Pagination
        totalPages={Math.ceil(filteredProd.length / 10)}
        selectedPageIndex={pageNo}
        changeSelectedPageIndex={setPageNo}
      />
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
