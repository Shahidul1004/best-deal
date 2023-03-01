import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { productType, reviewInfo, siteNames } from "@/types";

interface appState {
  searched: boolean;
  products: productType[];
  filteredProd: productType[];
  sortBy: number;
  rating: number;
  minPrice: number;
  maxPrice: number;
  selectedSites: string[];
  pageNo: number;
  reviewInfo: reviewInfo[];
}

const initialState: appState = {
  searched: false,
  products: [],
  filteredProd: [],
  sortBy: 0,
  rating: 0,
  minPrice: 0,
  maxPrice: 1000000000,
  selectedSites: Object.keys(siteNames).filter((v) => isNaN(Number(v))),
  pageNo: 1,
  reviewInfo: [],
};

type payload = {
  searched?: boolean;
  products?: productType[];
  filteredProd?: productType[];
  sortBy?: number;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  selectedSites?: string[];
  pageNo?: number;
  reviewInfo?: reviewInfo[];
};

export const counterSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    updateStates: (state, action: PayloadAction<payload>) => {
      state.searched = action.payload.searched ?? state.searched;
      state.products = action.payload.products || state.products;
      state.filteredProd = action.payload.filteredProd || state.filteredProd;
      state.sortBy = action.payload.sortBy ?? state.sortBy;
      state.rating = action.payload.rating ?? state.rating;
      state.minPrice = action.payload.minPrice ?? state.minPrice;
      state.maxPrice = action.payload.maxPrice ?? state.maxPrice;
      state.selectedSites = action.payload.selectedSites ?? state.selectedSites;
      state.pageNo = action.payload.pageNo || state.pageNo;
      state.reviewInfo = action.payload.reviewInfo ?? state.reviewInfo;
    },
  },
});

export const { updateStates } = counterSlice.actions;

export default counterSlice.reducer;
