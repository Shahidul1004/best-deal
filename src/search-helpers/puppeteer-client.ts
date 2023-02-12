import puppeteer, { Browser } from "puppeteer";
import chromium from "chrome-aws-lambda";
declare global {
  var browser: Browser;
}

export const browser =
  global.browser || (await puppeteer.launch({ args: ["--no-sandbox"] }));
if (process.env.NODE_ENV !== "production") {
  global.browser = browser;
}
