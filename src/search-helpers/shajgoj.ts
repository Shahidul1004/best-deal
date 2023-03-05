import { productType, siteNames } from "@/types";
import axios from "axios";
import { validateProds } from "./search-utils";

const searchProductOnShajgoj = async (productName: string): Promise<any> => {
  console.log("in shajgoj");
  const stTime = new Date().getTime();
  let error = "no";

  const products: productType[] = [];
  const queryUrl = "https://search.shajgoj.com";

  try {
    const { data } = await axios.post(
      queryUrl,
      {
        requests: [
          {
            params: `query=${productName.replace(
              " ",
              "%20"
            )}&hitsPerPage=10000&maxValuesPerFacet=100&page=0&distinct=true`,
          },
        ],
      },
      { timeout: 15000 }
    );

    const hits: unknown[] = data.results[0].hits;
    hits.map((prod: any) => {
      products.push({
        title: prod.post_title || "",
        url: prod.permalink || "",
        imgUrl: prod.images.shop_catalog.url || "",
        price: prod.price,
        noOfRating: prod.rating_count || 0,
        ratingValue: prod.average_rating || 0,
        site: siteNames[siteNames.Shajgoj],
      });
    });
  } catch {
    error = "yes";
  }
  const validatedProds = validateProds(products);

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `shajgoj-->   prod: ${validatedProds.length}   time: ${elapsed}ms   APIs: 1   perAPI: ${elapsed}ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnShajgoj;
