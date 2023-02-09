import { Browser } from "puppeteer";
import chromium from "chrome-aws-lambda";
declare global {
  var browser: Browser;
}

export const browser =
  global.browser ||
  (await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  }));
if (process.env.NODE_ENV !== "production") {
  global.browser = browser;
}
