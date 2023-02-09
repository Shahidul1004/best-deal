// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import searchProductOnDaraz from "@/search-helpers/daraz";
import type { NextApiRequest, NextApiResponse } from "next";

interface ExtendedNextApiRequest extends NextApiRequest {
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
}

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
  const darazProducts =await  searchProductOnDaraz(text)


  res.status(200).json({ data: darazProducts});
}
