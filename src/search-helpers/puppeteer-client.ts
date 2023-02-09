import puppeteer, { Browser } from "puppeteer";
declare global {
  var browser: Browser;
}

export const browser =
  global.browser ||
  (await puppeteer.launch());
if (process.env.NODE_ENV !== "production") {
  global.browser = browser;
}
