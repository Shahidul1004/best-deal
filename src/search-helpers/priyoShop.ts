import { productType, siteNames } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";

const searchProductOnPriyoShop = async (productName: string): Promise<any> => {
  console.log("in PriyoShop");

  const stTime = new Date().getTime();
  const queryUrl = `https://priyoshop.com/searchproduct?q=${productName.replace(
    " ",
    "+"
  )}`;
  const res = await axios.get(queryUrl);
  const $ = cheerio.load(res.data);
  const products: productType[] = [];
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
  console.log(new Date().getTime() - stTime);
  return products;
};

export default searchProductOnPriyoShop;
