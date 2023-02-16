import { productType, siteNames } from "@/types";
import axios from "axios";

const collectBatch = async (productName: string, itemIndex: number) => {
  const queryUrl = `https://searchserverapi.com/getresults?api_key=6W7Z0N7U0T&q=${productName.replace(
    " ",
    "%20"
  )}&queryCorrection=true&suggestions=true&maxResults=250&categories=true&restrictBy[visibility]=3|4&facets=true&restrictBy[category_ids]=&startIndex=${itemIndex}&&`;
  const res = await axios.get(queryUrl);
  const data: any[] = res.data.items;
  const products: productType[] = [];
  data.forEach((element) => {
    products.push({
      title: element?.title || "",
      url: element?.link || "",
      imgUrl: element?.image_link || "",
      price: Number(element?.price),
      ratingValue: Number(element?.reviews_average_score),
      noOfRating: Number(element?.total_reviews),
      site: siteNames[siteNames.Pickaboo],
    });
  });
  return products;
};

const searchProductOnPickaboo = async (productName: string): Promise<any> => {
  console.log("in pickaboo");

  const stTime = new Date().getTime();
  const products: productType[] = [];
  let index = 0;
  while (1) {
    const curr = await collectBatch(productName, index);
    products.push(...curr);
    if (curr.length < 250) break;
    index += 250;
  }
  console.log(new Date().getTime() - stTime);
  return products;
};

export default searchProductOnPickaboo;
