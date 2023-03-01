// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bnReviewClassification from "@/search-helpers/bnBERT";
import enReviewClassification from "@/search-helpers/enBERT";
import { cleanText, isEnglishAlphabet } from "@/search-helpers/search-utils";
import { reviewInfo } from "@/types";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: any;
  body: {
    site: string;
    url: string;
    title: string;
  };
}

type ResponseData = {
  data: reviewInfo;
};
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const stTime = new Date().getTime();
  const { site, url, title } = req.body;
  const myRegex = /i[0-9]+-s[0-9]+/;
  const temp = url.match(myRegex);
  let itemId: string = "";
  if (temp) {
    itemId = temp[0].split("-")[0].slice(1);
  }

  const reviews: string[] = [];

  const queryUrl = `https://my.daraz.com.bd/pdp/review/getReviewList?itemId=${itemId}&pageSize=10000&filter=0&sort=0&pageNo=0`;
  try {
    const response = await axios.get(queryUrl, { timeout: 60000 });
    if (response.status === 200) {
      const rev = response.data?.model?.items;
      if (rev && rev.length > 0) {
        rev.map((r: any) => {
          if (r?.reviewContent?.length > 0) reviews.push(r.reviewContent);
        });
      }
    }
  } catch {}

  const enReviews: { original: string; cleaned: string }[] = [];
  const bnReviews: { original: string; cleaned: string }[] = [];

  for (const review of reviews) {
    const cleaned = cleanText(review);
    const isEng = isEnglishAlphabet(cleaned.replaceAll(" ", ""));

    if (isEng) {
      enReviews.push({ original: review, cleaned: cleaned });
    } else {
      bnReviews.push({ original: review, cleaned: cleaned });
      // const lst = cleaned.split(" ");
      // const removeStop: string[] = [];
      // for (const word of lst) {
      //   if (!stop_words.includes(word)) removeStop.push(word);
      // }
      // bnReviews.push(removeStop.join(" "));
    }
  }

  console.log(enReviews.length, bnReviews.length);

  const result = (
    await Promise.all([
      enReviewClassification(enReviews),
      bnReviewClassification(bnReviews),
      // enReviewClassification(enReviews.slice(0, 3)),
      // bnReviewClassification(bnReviews.slice(0, 3)),
    ])
  ).reduce((acc, cur) => [...acc, ...cur], []);

  const enResult = result.filter((e) => e.type === "en");
  const bnResult = result.filter((e) => e.type === "bn");

  const predictions: reviewInfo = {
    url: url,
    title: title,
    status: "done",
    bn: bnResult.length,
    bnP: bnResult.reduce((acc, a) => acc + (a.class >= 0.5 ? 1 : 0), 0),
    bnN: bnResult.reduce((acc, a) => acc + (a.class < 0.5 ? 1 : 0), 0),
    en: enResult.length,
    enP: enResult.reduce((acc, a) => acc + (a.class >= 0.5 ? 1 : 0), 0),
    enN: enResult.reduce((acc, a) => acc + (a.class < 0.5 ? 1 : 0), 0),
    result: result.map((e) => {
      return {
        review: e.review,
        sentiment: e.class >= 0.5 ? "good" : "bad",
        type: e.type,
      };
    }),
  };

  res.status(200).json({ data: predictions });
}
