import { productType, siteNames } from "@/types";
import axios from "axios";
import { validateProds } from "./search-utils";

let error = "no";
const collectBatch = async (productName: string, itemIndex: number) => {
  const queryUrl = `https://searchserverapi.com/getresults?api_key=6W7Z0N7U0T&q=${productName.replace(
    " ",
    "%20"
  )}&queryCorrection=true&suggestions=true&maxResults=250&categories=true&restrictBy[visibility]=3|4&facets=true&restrictBy[category_ids]=&startIndex=${itemIndex}&&`;
  const products: productType[] = [];

  try {
    const res = await axios.get(queryUrl, { timeout: 60000 });
    const data: any[] = res.data.items;
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
  } catch {
    error = "yes";
  }

  return products;
};

const searchProductOnPickaboo = async (productName: string): Promise<any> => {
  console.log("in pickaboo");
  const stTime = new Date().getTime();

  const products: productType[] = [];
  let index = 0;
  let times = 0;
  while (1) {
    const curr = await collectBatch(productName, index);
    products.push(...curr);
    times += 1;
    if (curr.length < 250 || error === "yes") break;
    index += 250;
  }
  const validatedProds = validateProds(products);

  console.log("pickaboo needs to be optimized!!");
  const elapsed = new Date().getTime() - stTime;
  console.log(
    `pickaboo-->   prod: ${
      validatedProds.length
    }   time: ${elapsed}ms   APIs: ${times}   perAPI: ${
      elapsed / times
    }ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnPickaboo;
