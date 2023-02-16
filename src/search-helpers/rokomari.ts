import { productType, siteNames } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";

const collectBatch = async (productName: string, pageIndex: number) => {
  const queryUrl = `https://www.rokomari.com/search?term=${productName.replace(
    " ",
    "%20"
  )}&page=${pageIndex}`;
  const res = await axios.get(queryUrl);
  const $ = cheerio.load(res.data);
  const products: productType[] = [];
  $(".book-list-wrapper > a").each((index, elem) => {
    const url = "https://rokomari.com" + $(elem).attr("href");
    const imgUrl = $(elem).find(".book-img img").attr("src") || "";

    const des = $(elem).find(".book-text-area");
    const title = $(des).find(".book-title").text();
    const price = Number($(des).find(".book-price span").text().split(" ")[1]);
    const ratingSec = $(des).find(".rating-section");
    let ratingValue = 0;
    $(ratingSec)
      .find("i")
      .each((idx, el) => {
        const names = $(el).attr("class");
        if (names === "ion-ios-star") ratingValue += 1;
        else if (names === "ion-ios-star-half") ratingValue += 0.5;
        else if (names === "ion-ios-star-outline") ratingValue += 0;
        else {
          console.log(names);
        }
      });
    const noOfRating = Number(
      $(ratingSec).find("span").text().slice(1, -1) || 0
    );
    products.push({
      title,
      url,
      imgUrl,
      price,
      noOfRating,
      ratingValue,
      site: siteNames[siteNames.Rokomari],
    });
  });

  return products;
};

const getNoOfProducts = async (productName: string) => {
  const queryUrl = `https://www.rokomari.com/search?term=${productName.replace(
    " ",
    "%20"
  )}`;
  const res = await axios.get(queryUrl);
  const $ = cheerio.load(res.data);
  return (
    Number($(".browse__content--heading .row div p").text().split(" ")[6]) || 0
  );
};

const searchProductOnRokomari = async (productName: string): Promise<any> => {
  console.log("in rokomari");

  const stTime = new Date().getTime();
  const totalPage = (await getNoOfProducts(productName)) / 60 + 1;
  console.log(totalPage);

  const promises: Promise<productType[]>[] = [];

  for (let i = 1; i <= totalPage; i++) {
    promises.push(collectBatch(productName, i));
    // if (i > 5) break;
  }
  const products = (await Promise.all(promises)).reduce(
    (ac, curr) => [...curr, ...ac],
    []
  );
  console.log(new Date().getTime() - stTime);
  return products;
};

export default searchProductOnRokomari;
