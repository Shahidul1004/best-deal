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
  status: statusType;
  bn?: number;
  bnP?: number;
  bnN?: number;
  en?: number;
  enP?: number;
  enN?: number;
};
