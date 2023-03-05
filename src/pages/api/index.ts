// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import searchProductOnDaraz from "@/search-helpers/daraz";
import searchProductOnPickaboo from "@/search-helpers/pickaboo";
import searchProductOnRokomari from "@/search-helpers/rokomari";
import searchProductOnChaldal from "@/search-helpers/chaldal";
import searchProductOnAjkerDeal from "@/search-helpers/ajkerdeal";
import searchProductOnClickBD from "@/search-helpers/clickBD";
import searchProductOnOthoba from "@/search-helpers/othoba";
import searchProductOnPriyoShop from "@/search-helpers/priyoShop";
import searchProductOnShajgoj from "@/search-helpers/shajgoj";
import searchProductOnBanglaShoppers from "@/search-helpers/banglaShoppers";
import { productType } from "@/types";

interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: any;
  body: {
    searchText: string;
  };
}

type ResponseData = {
  data: productType[];
};
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const stTime = new Date().getTime();
  const text = req.body.searchText;

  const promises: Promise<productType[]>[] = [];

  promises.push(searchProductOnDaraz(text));
  promises.push(searchProductOnPickaboo(text));
  promises.push(searchProductOnRokomari(text));
  promises.push(searchProductOnChaldal(text));

  promises.push(searchProductOnAjkerDeal(text));

  promises.push(searchProductOnClickBD(text));
  promises.push(searchProductOnOthoba(text));
  promises.push(searchProductOnPriyoShop(text));
  promises.push(searchProductOnShajgoj(text));
  promises.push(searchProductOnBanglaShoppers(text));

  const allProducts = await (
    await Promise.all(promises)
  ).reduce((acc, cur) => [...acc, ...cur], []);

  console.log("DONE!!!");
  const elapsed = new Date().getTime() - stTime;
  console.log(`elapsed time ${elapsed}ms`);

  res.status(200).json({ data: allProducts });
}
