import { productType, siteNames } from "@/types";
import axios from "axios";
import * as https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
axios.defaults.httpsAgent = httpsAgent;

const collectBatch = async (productName: string, index: number) => {
  const queryUrl = "https://search.ajkerdeal.com/search";
  const res = await axios.post(queryUrl, {
    keyword: productName,
    from: index,
    priceLowerLim: 0,
    priceUpperLim: 9999999,
  });

  const products: productType[] = [];
  res.data.Products.map((prod: any) => {
    const t: string = (prod.DealTitle as string).trim();
    const tUrl: string[] = [];
    for (let i = 0; i < t.length; i++) {
      if ((t[i] >= "a" && t[i] <= "z") || (t[i] >= "A" && t[i] <= "Z")) {
        tUrl.push(t[i]);
      } else {
        tUrl.push("-");
      }
    }

    products.push({
      title: prod.DealTitle || "",
      url:
        `https://ajkerdeal.com/product/${prod.DealId}/${tUrl.join("")}` || "",
      imgUrl: prod.ImageLink || "",
      price: Number(prod.DealDiscountPrice),
      ratingValue: 0,
      noOfRating: 0,
      site: siteNames[siteNames.AjkerDeal],
    });
  });
  return products;
};

const getNoOfProducts = async (productName: string, index: number) => {
  const queryUrl = "https://search.ajkerdeal.com/search";

  const res = await axios.post(queryUrl, {
    keyword: productName,
    from: index,
    priceLowerLim: 0,
    priceUpperLim: 9999999,
  });
  return res.data.Total || 0;
};

const searchProductOnAjkerDeal = async (productName: string): Promise<any> => {
  console.log("in ajkerDeal");

  const stTime = new Date().getTime();
  const totalProduts = await getNoOfProducts(productName, 0);

  const promises: Promise<productType[]>[] = [];

  for (let i = 0; i <= totalProduts; i += 10) {
    promises.push(collectBatch(productName, i));
  }
  const products = (await Promise.all(promises)).reduce(
    (ac, curr) => [...curr, ...ac],
    []
  );
  console.log(new Date().getTime() - stTime);
  return products;
};

export default searchProductOnAjkerDeal;
