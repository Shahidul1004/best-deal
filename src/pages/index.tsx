import Header from "@/components/header";
import Leftbar from "@/components/leftbar";
import ProdViewer from "@/components/prodViewer";
import SearchBox from "@/components/search/searchBox";
import Topbar from "@/components/topbar";
import { productType, siteNames } from "@/types";
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<productType[]>([]);
  const [filteredProd, setFilteredProd] = useState<productType[]>([]);
  const [sortBy, setSortBy] = useState(0);
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [selectedSites, setSelectedSites] = useState(
    Object.keys(siteNames).filter((v) => isNaN(Number(v)))
  );
  useEffect(() => {
    const newFilter = products.filter(
      (a) =>
        selectedSites.includes(a.site) &&
        a.price >= minPrice &&
        a.price <= maxPrice &&
        a.ratingValue >= rating
    );
    setFilteredProd(newFilter);
  }, [sortBy, rating, minPrice, maxPrice, selectedSites, products]);

  const searchHandler = async (text: string) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchText: text }),
    };
    const response = await fetch(`api/`, requestOptions);
    if (response.status === 200) {
      const { data } = await response.json();
      setProducts(data);
    } else {
      console.log("something went wrong", response.status);
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
      <Header onSearch={searchHandler} />
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

export default Home;

const Container = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  overflowY: "auto",
});