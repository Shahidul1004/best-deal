export type productType = {
  title: string;
  url: string;
  imgUrl: string;
  price: number;
  noOfRating: number;
  ratingValue: number;
  site: string;
};

export enum siteNames {
  "Daraz",
  "Pickaboo",
  "Rokomari",
  "Chaldal",
  "AjkerDeal",
  "ClickBD",
  "Othoba",
  "PriyoShop",
  "Shajgoj",
  "BanglaShoppers",
}

export type statusType = "waiting" | "pending" | "done" | "error";

export type reviewInfo = {
  url: string;
  title: string;
  status: statusType;
  bn: number;
  bnP: number;
  bnN: number;
  en: number;
  enP: number;
  enN: number;
  result: {
    review: string;
    sentiment: string;
    type: string;
  }[];
};

export type resultType = { review: string; class: number; type: string };

export type reviewDataType = {
  title: string;
  reviews: { review: string; sentiment: string; type: string }[];
};
