// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import enReviewClassification from "@/search-helpers/enBERT";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: any;
  body: {
    site: string;
    url: string;
  };
}

type predictionResult = {
  bn: number;
  bnN: number;
  bnP: number;
  en: number;
  enN: number;
  enP: number;
};

type ResponseData = {
  data: predictionResult;
};
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const stTime = new Date().getTime();
  const { site, url } = req.body;
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

  const enResult = await enReviewClassification(reviews);
  const predictions: predictionResult = {
    bn: 0,
    bnN: 0,
    bnP: 0,
    en: enResult.length,
    enP: enResult.reduce((acc, a) => (acc + a.class === 1 ? 1 : 0), 0),
    enN: enResult.reduce((acc, a) => (acc + a.class === 0 ? 1 : 0), 0),
  };

  res.status(200).json({ data: predictions });
}
