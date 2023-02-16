import { productType, siteNames } from "@/types";
import axios from "axios";

const searchProductOnShajgoj = async (productName: string): Promise<any> => {
  console.log("in shajgoj");

  const queryUrl = "https://search.shajgoj.com";
  const { data } = await axios.post(queryUrl, {
    requests: [
      {
        params: `query=${productName.replace(
          " ",
          "%20"
        )}&hitsPerPage=10000&maxValuesPerFacet=100&page=0&distinct=true`,
      },
    ],
  });

  const hits: unknown[] = data.results[0].hits;
  const products: productType[] = [];

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

  return products;
};

export default searchProductOnShajgoj;
