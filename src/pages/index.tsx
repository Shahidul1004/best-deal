import Header from "@/components/header";
import SearchBox from "@/components/search/searchBox";

const Home = (): JSX.Element => {
  return (
    <>
      <Header />
      <SearchBox />
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
