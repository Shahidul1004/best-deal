import { productType } from "@/types";
import { browser } from "./puppeteer-client";

const collectProduct = async (
  producturl: string,
  id: number
): Promise<productType[]> => {
  const page = await browser.newPage();
  try {
    // await page.setRequestInterception(true);
    // page.on("request", (request) => {
    //   if (request.resourceType() === "image") request.abort();
    //   else request.continue();
    // });
    await page.goto(producturl, {
      // waitUntil: "networkidle2",
      timeout: 0,
    });
  } catch {
    return [];
  }

  // "script"
  // "image" 
  // "document" 
  // "stylesheet" 
  // "media" 
  // "font" 
  // "texttrack" 
  // "xhr" 
  // "fetch" 
  // "prefetch" 
  // "eventsource" 
  // "websocket" 
  // "manifest" 
  // "signedexchange" 
  // "ping" 
  // "cspviolationreport" 
  // "preflight" 
  // "other"

  const products: productType[] = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div.gridItem--Yd0sa")).map(
      (el) => {
        const title = el.querySelector("div.title--wFj93 a")?.textContent || "";
        const url =
          el.querySelector("div.mainPic--ehOdr a")?.getAttribute("href") || "";
        const imgUrl =
          el
            .querySelector("div.mainPic--ehOdr img.image--WOyuZ")
            ?.getAttribute("src") || "";
        const price = Number(
          el
            .querySelector("div.price--NVB62 span")
            ?.textContent?.split(" ")[1]
            ?.replace(",", "")
        );
        const ratingValue = Array.from(
          el.querySelectorAll("div.rating--ZI3Ol span i")
        )
          .map((el) => +el.classList[1].split("-")[1])
          .reduce((a, c) => a + c / 10, 0);
        const noOfRating = Number(
          el.querySelector(".rating__review--ygkUy")?.textContent?.slice(1, -1)
        );

        return {
          title,
          url,
          imgUrl,
          price,
          ratingValue,
          noOfRating,
        };
      }
    );
  });
  return products;
};

const searchProductOnDaraz = async (productName: string): Promise<any> => {
  const queryUrl = `https://www.daraz.com.bd/catalog/?q=${productName.replace(
    " ",
    "+"
  )}`;
  const stTime = new Date().getTime();

  const productsRec = collectProduct(queryUrl, 0);
  const productsAsc = collectProduct(queryUrl + "&sort=priceasc", 1);
  const productsDesc = collectProduct(queryUrl + "&sort=pricedesc", 2);

  const products = (
    await Promise.all([productsRec, productsAsc, productsDesc])
  ).reduce((ac, ar) => [...ac, ...ar], []);

  console.log(new Date().getTime() - stTime);
  return products;
};

export default searchProductOnDaraz;
