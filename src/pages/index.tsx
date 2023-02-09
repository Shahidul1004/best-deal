import Layout from "@/components/layout";
import SearchBox from "@/components/search/searchBox";
import { useEffect, useRef, useState } from "react";

const Home = (): JSX.Element => {
  return (
    <Layout>
      <SearchBox />
    </Layout>
  );
};

export default Home;

export async function getServerSideProps() {
  console.log(process.env.BASE_URL)
  return {
    props: {
    },
  };
}