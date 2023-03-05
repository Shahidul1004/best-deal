import { productType, siteNames } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import { validateProds } from "./search-utils";

const searchProductOnOthoba = async (productName: string): Promise<any> => {
  console.log("in Othoba");
  const stTime = new Date().getTime();
  let error = "no";

  const queryUrl = `https://www.othoba.com/src?q=${productName.replace(
    " ",
    "+"
  )}&pageSize=10000&minprice=NaN&maxprice=NaN`;
  const products: productType[] = [];

  try {
    const res = await axios.get(queryUrl, { timeout: 15000 });
    const $ = cheerio.load(res.data);
    $(".product-item").each((index, elem) => {
      const imgUrl =
        $(elem).find(".bs-quick-view > a > img").attr("data-src") || "";
      const prod = $(elem).find(".product-title > a");
      const title = prod.text();
      const url = `https://othoba.com${prod.attr("href")}`;
      const price = Number($(elem).find(".actual-price").text().split(" ")[1]);
      const noOfRating = Number(
        $(elem).find(".product-rating-box").attr("title")?.split(" ")[0]
      );
      const ratingValue =
        Number(
          $(elem)
            .find(".rating > div")
            .attr("style")
            ?.split(" ")[1]
            .replace("%", "")
        ) / 20;

      products.push({
        title,
        url,
        imgUrl,
        price,
        noOfRating,
        ratingValue,
        site: siteNames[siteNames.Othoba],
      });
    });
  } catch {
    error = "yes";
  }
  const validatedProds = validateProds(products);

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `othoba-->   prod: ${validatedProds.length}   time: ${elapsed}ms   APIs: 1   perAPI: ${elapsed}ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnOthoba;
