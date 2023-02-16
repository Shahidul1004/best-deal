import { productType, siteNames } from "@/types";
import axios from "axios";

const searchProductOnBanglaShoppers = async (
  productName: string
): Promise<any> => {
  console.log('bangla shopers');
  
  const queryUrl =
    "https://lbxv17z7k0-dsn.algolia.net/1/indexes/*/queries?x-algolia-application-id=LBXV17Z7K0&x-algolia-api-key=MGFhNTQ0NTAxMzljNGE3YjEyNGU0NTA4OTFjMjBmNGNjYjVlNWQ0MmEzOGI4YmJkNzAxNzMxNDFjZTRjNDc4NXRhZ0ZpbHRlcnM9";
  const { data } = await axios.post(queryUrl, {
    requests: [
      {
        indexName: "live_2021default_products",
        params: `hitsPerPage=10000&query=${productName.replace(
          " ",
          "%20"
        )}&page=0&maxValuesPerFacet=100`,
      },
    ],
  });

  const hits: unknown[] = data.results[0].hits;
  const products: productType[] = [];

  hits.map((prod: any) => {
    products.push({
      title: prod?.name || "",
      url: prod?.url || "",
      imgUrl: prod?.image_url || "",
      price: prod?.price?.BDT?.default || 0,
      noOfRating: 0,
      ratingValue: 0,
      site: siteNames[siteNames.BanglaShoppers]
    });
  });

  return products;
};

export default searchProductOnBanglaShoppers;
