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
    products: product[];
  }[];
};
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const text = req.body.searchText;

  // Read the .npy file into a Buffer
  // const dataArray = readNumpyFile("public/data.npy");

  const baseURL = `http://${req.headers.host}`;

  // const model = await tf.loadGraphModel(baseURL + "/model.json");
  // const model = await  tf.loadLayersModel('https://project350-model.s3.us-west-2.amazonaws.com/rakib_ahsan/model_2/model.json');
  // const model = await  tf.loadModel(baseURL + "/model.json");
  // const xx = await model.execute(dataArray.toJson)
  // const values = Array.from(xx.dataSync());
  // console.log(model);

  const promises: Promise<any>[] = [];

  // promises.push(searchProductOnDaraz(text));
  promises.push(searchProductOnPickaboo(text));
  // promises.push(searchProductOnRokomari(text));
  promises.push(searchProductOnChaldal(text));

  // promises.push(searchProductOnAjkerDeal(text));

  promises.push(searchProductOnClickBD(text));
  promises.push(searchProductOnOthoba(text));
  promises.push(searchProductOnPriyoShop(text));
  promises.push(searchProductOnShajgoj(text));
  promises.push(searchProductOnBanglaShoppers(text));

  const allProducts = await (
    await Promise.all(promises)
  ).reduce((acc, cur) => [...acc, ...cur], []);

  res.status(200).json({ data: allProducts });
}
