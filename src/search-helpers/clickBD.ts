import { productType, siteNames } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";

let error = "no";
const collectBatch = async (productName: string, pageIndex: number) => {
  const queryUrl = `https://www.clickbd.com/search?q=${productName.replace(
    " ",
    "%20"
  )}&page=${pageIndex}`;
  const products: productType[] = [];

  try {
    const res = await axios.get(queryUrl);
    const $ = cheerio.load(res.data);

    $("#view > .sh").each((index, elem) => {
      const img = $(elem).find("> a");
      if (img.length === 1) {
        const imgUrl = `https:${img.find("img").attr("src")}`;
        const lt = $(elem).find(".lt > h3 > a");
        const title = lt.text();
        const url = `https://www.clickbd.com${lt.attr("href")}`;
        const price = Number(
          $(elem).find(".rt > b > b").text().replace(",", "")
        );

        products.push({
          title,
          url,
          imgUrl,
          price,
          noOfRating: 0,
          ratingValue: 0,
          site: siteNames[siteNames.ClickBD],
        });
      }
    });
  } catch {
    error = "yes";
  }
  return products;
};

const getNoOfProducts = async (productName: string) => {
  try {
    const queryUrl = `https://www.clickbd.com/search?q=${productName.replace(
      " ",
      "%20"
    )}`;
    const res = await axios.get(queryUrl, { timeout: 60000 });
    const $ = cheerio.load(res.data);

    const pagin = $(".pagination").children("li");
    if (pagin.length === 0) return 0;
    const secLast = pagin[pagin.length - 2];
    return Number($(secLast).find("a").attr("href")!.split("page=")[1]);
  } catch {
    error = "yes";
    return 0;
  }
};

const searchProductOnClickBD = async (productName: string): Promise<any> => {
  console.log("in Clickbd");
  const stTime = new Date().getTime();

  const totalProduts = await getNoOfProducts(productName);
  const promises: Promise<productType[]>[] = [];

  for (let i = 0; i <= totalProduts; i += 30) {
    promises.push(collectBatch(productName, i));
    break;
  }
  const products = (await Promise.all(promises)).reduce(
    (ac, curr) => [...curr, ...ac],
    []
  );
  const elapsed = new Date().getTime() - stTime;
  console.log(
    `clickbd-->   prod: ${products.length}   time: ${elapsed}ms   APIs: ${
      promises.length
    }   perAPI: ${elapsed / promises.length}ms   ERROR?: ${error}`
  );
  return products;
};

export default searchProductOnClickBD;
