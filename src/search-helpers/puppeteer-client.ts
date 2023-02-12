import puppeteer, { Browser } from "puppeteer-core";
// import chromium from "chrome-aws-lambda";
declare global {
  var browser: Browser;
}

export const browser =
  global.browser || (await puppeteer.launch({ args: ["--no-sandbox"] , executablePath: '/usr/bin/chromium-browser'}));
if (process.env.NODE_ENV !== "production") {
  global.browser = browser;
}
