import { createSlice } from "@reduxjs/toolkit";
import type { SurveyCommunityCard } from "../../core/types";
import { homeSurveysData } from "../../core/mockData/mockData";

export interface FakeDataInterface {
  FullName: string;
  MainImageUrl: string;
  Point: number;
  SuitYouBest: SurveyCommunityCard[];
  Xp: number;
  Level: number;
  MoneyInData: any;
  MoneyOutData: any;
}

const initialState: FakeDataInterface = {
  FullName: "",
  MainImageUrl: "",
  Point: 0,
  SuitYouBest: [],
  Xp: 0,
  Level: 0,
  MoneyInData: [],
  MoneyOutData: [],
};

const fakeSlice = createSlice({
  name: "fake",
  initialState,
  reducers: {
    setFakeData: (state, action) => {
      state.FullName = action.payload.FullName;
      state.MainImageUrl = action.payload.MainImageUrl;
      state.Point = action.payload.Point;
      state.Level = action.payload.Level;
      state.Xp = action.payload.Xp;
      state.SuitYouBest = action.payload.SuitYouBest;
      state.MoneyInData = action.payload.MoneyInData;
      state.MoneyOutData = action.payload.MoneyOutData;
    },
    clearFakeData: (state) => {
      state.FullName = "";
      state.MainImageUrl = "";
      state.Point = 0;
      state.Level = 0;
      state.Xp = 0;
      state.SuitYouBest = homeSurveysData.suitYouBest;
      state.MoneyInData = [];
      state.MoneyOutData = [];
    },
    updateFakeData: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (key in state) {
          state[key] = action.payload[key];
        }
      });
    },
  },
});

export const { setFakeData, clearFakeData, updateFakeData } = fakeSlice.actions;
export default fakeSlice.reducer;
