// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";

import readNumpyFile from "read-npy-file";
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

interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: any;
  body: {
    searchText: string;
  };
}

type product = {
  title: string;
  url: string;
  imageUrl: string;
  price: number;
  rating: number;
};

type ResponseData = {
  data: {
    site: string;
    products: product[];
  }[];
};
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData | any>
) {
  const text = req.body.searchText;

  // Read the .npy file into a Buffer
  // const dataArray = readNumpyFile("public/data.npy");

  const baseURL = `http://${req.headers.host}`;

  // const model = await tf.loadGraphModel(baseURL + "/model.json");
  // const model = await  tf.loadLayersModel(baseURL + "/model.json");
  // const xx = await model.execute(dataArray.toJson)
  // const values = Array.from(xx.dataSync());
  // console.log(xx);

  // const darazProducts =await  searchProductOnDaraz(text)
  // const pickabooProducts = await searchProductOnPickaboo(text);
  // const rokomariProducts = await searchProductOnRokomari(text);
  // const chaldalProducts = await searchProductOnChaldal(text);
  // const ajkerDealProducts = await searchProductOnAjkerDeal(text)
  // const clickBDProducts = await searchProductOnClickBD(text)
  // const othobaProducts = await searchProductOnOthoba(text)
  // const priyoShopProducts = await searchProductOnPriyoShop(text)
  // const shajgojProducts = await searchProductOnShajgoj(text);
  const banglaShoppersProducts = await searchProductOnBanglaShoppers(text);

  res.status(200).json({ data: banglaShoppersProducts });
}
