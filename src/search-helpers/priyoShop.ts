import { productType, siteNames } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import { validateProds } from "./search-utils";

const searchProductOnPriyoShop = async (productName: string): Promise<any> => {
  console.log("in PriyoShop");
  const stTime = new Date().getTime();
  let error = "no";

  const queryUrl = `https://priyoshop.com/searchproduct?q=${productName.replace(
    " ",
    "+"
  )}`;
  const products: productType[] = [];
  try {
    const res = await axios.get(queryUrl, { timeout: 15000 });
    const $ = cheerio.load(res.data);
    $(".product-item").each((index, elem) => {
      const imgUrl = $(elem).find("> .picture img").attr("src") || "";
      const prod = $(elem).find(".product-title > a");
      const title = prod.text();
      const url = `https://priyoshop.com${prod.attr("href")}`;
      const price = Number($(elem).find(".actual-price").text().split(" ")[1]);

      products.push({
        title,
        url,
        imgUrl,
        price,
        noOfRating: 0,
        ratingValue: 0,
        site: siteNames[siteNames.PriyoShop],
      });
    });
  } catch {
    error = "yes";
  }
  const validatedProds = validateProds(products);

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `priyoshop-->   prod: ${validatedProds.length}   time: ${elapsed}ms   APIs: 1   perAPI: ${elapsed}ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnPriyoShop;
