import { productType, siteNames } from "@/types";
import axios from "axios";
import { validateProds } from "./search-utils";

const searchProductOnBanglaShoppers = async (
  productName: string
): Promise<productType[]> => {
  console.log("in banglashopers");
  const stTime = new Date().getTime();
  let error = "no";

  const products: productType[] = [];
  const queryUrl =
    "https://lbxv17z7k0-dsn.algolia.net/1/indexes/*/queries?x-algolia-application-id=LBXV17Z7K0&x-algolia-api-key=MGFhNTQ0NTAxMzljNGE3YjEyNGU0NTA4OTFjMjBmNGNjYjVlNWQ0MmEzOGI4YmJkNzAxNzMxNDFjZTRjNDc4NXRhZ0ZpbHRlcnM9";
  try {
    const { data } = await axios.post(
      queryUrl,
      {
        requests: [
          {
            indexName: "live_2021default_products",
            params: `hitsPerPage=10000&query=${productName.replace(
              " ",
              "%20"
            )}&page=0&maxValuesPerFacet=100`,
          },
        ],
      },
      { timeout: 15000 }
    );
    const hits: unknown[] = data.results[0].hits;
    hits.map((prod: any) => {
      products.push({
        title: prod.name || "",
        url: prod.url || "",
        imgUrl: prod.image_url || "",
        price: prod.price.BDT.default || 0,
        noOfRating: 0,
        ratingValue: 0,
        site: siteNames[siteNames.BanglaShoppers],
      });
    });
  } catch {
    error = "yes";
  }
  const validatedProds = validateProds(products);

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `banglaShoppers-->   prod: ${validatedProds.length}   time: ${elapsed}ms   APIs: 1   perAPI: ${elapsed}ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnBanglaShoppers;
