// @ts-nocheck
import { Browser } from "puppeteer-core";
// import chromium from "chrome-aws-lambda";


let chrome = {};
let puppeteer;
let options = {}

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
  options = {
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  };
} else {
  puppeteer = require("puppeteer");
}



declare global {
  var browser: Browser;
}

export const browser =
  global.browser || await puppeteer.launch(options);
if (process.env.NODE_ENV !== "production") {
  global.browser = browser;
}
