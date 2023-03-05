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
    const res = await axios.get(queryUrl, { timeout: 10000 });
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

  // const products: productType[] = [];

  const batch1 = collectBatch(productName, 0)
  // const batch2 = collectBatch(productName, 0)
  // const batch3 = collectBatch(productName, 0)
  // const batch4 = collectBatch(productName, 0)

  const products = (
    await Promise.all([batch1])
  ).reduce((ac, ar) => [...ac, ...ar], []);

  // products.push(collectBatch(productName, 0))


  // let index = 0;
  // let times = 0;
  // while (1) {
  //   const curr = await collectBatch(productName, index);
  //   products.push(...curr);
  //   times += 1;
  //   if (curr.length < 250 || error === "yes" || times >= 4) break;
  //   index += 250;
  // }
  const validatedProds = validateProds(
    products.filter((a) => !a.url.includes("/catalog/"))
  );

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `pickaboo-->   prod: ${
      validatedProds.length
    }   time: ${elapsed}ms   APIs: ${4}   perAPI: ${
      elapsed / 4
    }ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnPickaboo;
