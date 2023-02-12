// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import searchProductOnDaraz from "@/search-helpers/daraz";
import searchProductOnPickaboo from "@/search-helpers/pickaboo";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
import { useRouter } from "next/router";
// const MODEL_URL = "/public/model.json";

import readNumpyFile from "read-npy-file";
// import chromium from "chrome-aws-lambda";
// import Chromium from "chrome-aws-lambda";
const fs = require("fs");

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

  // Convert the Buffer into a numpy array
  // const array = numpy.frombuffer(buffer);

  // Use the numpy array
  // const arr = dataArray.toArray();

  // const baseURL = `http://${req.headers.host}`;

  // const model = await tf.loadGraphModel(baseURL + "/model.json");
  // const model = await  tf.loadLayersModel("publicmodel.json");
  // const cat = document.getElementById('cat')!;
  // const xx = await model.execute(dataArray.toJson)
  // const values = Array.from(xx.dataSync());
  // console.log(xx);
  // console.log(xx);

  console.log(process.env.AWS_LAMBDA_FUNCTION_VERSION);
  
  const darazProducts =await  searchProductOnDaraz(text)
  const pickabooProducts = await searchProductOnPickaboo(text);

  res.status(200).json({ data: darazProducts });
}
