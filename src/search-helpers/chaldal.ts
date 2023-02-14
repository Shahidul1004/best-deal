import { productType } from "@/types";
import axios from "axios";

const searchProductOnChaldal = async (productName: string): Promise<any> => {
  console.log("in chaldal");
  const stTime = new Date().getTime();

  const queryUrl = `https://catalog.chaldal.com/searchOld`;
  const { data } = await axios.post(queryUrl, {
    apiKey: "e964fc2d51064efa97e94db7c64bf3d044279d4ed0ad4bdd9dce89fecc9156f0",
    storeId: 1,
    warehouseId: 8,
    pageSize: 10000000,
    currentPageIndex: 0,
    metropolitanAreaId: 1,
    query: `${productName.replace(" ", "%20")}`,
    productVariantId: -1,
    canSeeOutOfStock: "true",
    filters: [],
    maxOutOfStockCount: { case: "Some", fields: [5] },
  });

  const products: productType[] = [];

  data.hits.map((el: any) => {
    const title = el.name;
    const url = "https://chaldal.com/" + el.slug;
    const imgUrl = el.picturesUrls[0] || "";
    const price = el.price;
    const noOfRating = 0;
    const ratingValue = 0;
    products.push({ title, url, imgUrl, price, noOfRating, ratingValue });
  });

  return products;
};

export default searchProductOnChaldal;
