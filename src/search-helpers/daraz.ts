import { siteNames } from "@/types";
import { browser } from "./puppeteer-client";
import { validateProds } from "./search-utils";

let error = "no";

const collectProduct = async (producturl: string): Promise<any[]> => {
  const page = await browser.newPage();
  const products: any[] = [];
  try {
    await page.goto(producturl, {
      timeout: 5000,
    });
  } catch {}

  try {
    const product: any[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.gridItem--Yd0sa")).map(
        (el) => {
          const title =
            el.querySelector("div.title--wFj93 a")?.textContent || "";
          const url =
            el.querySelector("div.mainPic--ehOdr a")?.getAttribute("href") ||
            "";
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
            el
              .querySelector(".rating__review--ygkUy")
              ?.textContent?.slice(1, -1)
          );

          return {
            title,
            url: url.startsWith("//") ? url.slice(2) : url,
            imgUrl,
            price,
            ratingValue,
            noOfRating,
          };
        }
      );
    });
    product.map((e) => {
      products.push({ ...e, site: siteNames[siteNames.Daraz] });
    });
  } catch {
    error = "yes";
  }
  page.close();
  return products;
};

const searchProductOnDaraz = async (productName: string): Promise<any> => {
  console.log("in daraz");
  const stTime = new Date().getTime();

  const queryUrl = `https://www.daraz.com.bd/catalog/?q=${productName.replace(
    " ",
    "+"
  )}`;

  const productsRec = collectProduct(queryUrl);
  const productsAsc = collectProduct(queryUrl + "&sort=priceasc");
  const productsDesc = collectProduct(queryUrl + "&sort=pricedesc");

  const products = (
    await Promise.all([productsRec, productsAsc, productsDesc])
  ).reduce((ac, ar) => [...ac, ...ar], []);
  const validatedProds = validateProds(products);

  const elapsed = new Date().getTime() - stTime;
  console.log(
    `daraz-->   prod: ${
      validatedProds.length
    }   time: ${elapsed}ms   APIs: 3   perAPI: ${
      elapsed / 3
    }ms   ERROR?: ${error}`
  );
  return validatedProds;
};

export default searchProductOnDaraz;
