import Header from "@/components/header";
import Leftbar from "@/components/leftbar";
import ProdViewer from "@/components/prodViewer";
import Topbar from "@/components/topbar";
import { productType, siteNames } from "@/types";
import { Box, styled } from "@mui/material";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

const SearchPage = ({ data }: { data: productType[] }): JSX.Element => {
  const [filteredProd, setFilteredProd] = useState<productType[]>([]);
  const [sortBy, setSortBy] = useState(0);
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [selectedSites, setSelectedSites] = useState(
    Object.keys(siteNames).filter((v) => isNaN(Number(v)))
  );

  useEffect(() => {
    const newFilter = data.filter(
      (a) =>
        selectedSites.includes(a.site) &&
        a.price >= minPrice &&
        a.price <= maxPrice &&
        a.ratingValue >= rating
    );
    setFilteredProd(newFilter);
  }, [sortBy, rating, minPrice, maxPrice, selectedSites, data]);

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

  console.log("prods", filteredProd.length);
  console.log("sort By", sortBy);
  console.log("rating", rating);
  console.log("min - max price", minPrice, maxPrice);
  console.log("sites", selectedSites.length, selectedSites);

  return (
    <>
      {/* <Header /> */}

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

        <ProdViewer items={filteredProd} />
      </Container>
    </>
  );
};

export default SearchPage;

const Container = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  overflowY: "auto",
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const text = context.query.product as string;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchText: text.trim()?.toLowerCase() }),
  };
  const response = await fetch(`${process.env.BASE_URL}/api/`, requestOptions);
  const { data } = await response.json();
  return {
    props: {
      data,
    },
  };
};
