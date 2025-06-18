import { createSlice } from "@reduxjs/toolkit";
import type { SurveyCommunityCard } from "../../core/types";
import { homeSurveysData } from "../../core/mockData/mockData";

export interface FakeDataInterface {
  Point: number;
  SuitYouBest: SurveyCommunityCard[];
  Xp: number;
  Level: number;
  MoneyInData: any;
  MoneyOutData: any;
}

const initialState: FakeDataInterface = {
  Point: 100000,
  SuitYouBest: homeSurveysData.suitYouBest,
  Xp: 350,
  Level: 3,
  MoneyInData: [
    { Id: 1, Amount: 20000, CreatedAt: "16/06/2025 - 18:02:21", StatusId: 1 },
    { Id: 2, Amount: 10000, CreatedAt: "16/06/2025 - 18:05:00", StatusId: 1 },
    { Id: 3, Amount: 10000, CreatedAt: "16/06/2025 - 18:12:24", StatusId: 1 },
    { Id: 4, Amount: 10000, CreatedAt: "16/06/2025 - 18:38:32", StatusId: 1 },
    { Id: 5, Amount: 10000, CreatedAt: "16/06/2025 - 18:45:57", StatusId: 1 },
    { Id: 6, Amount: 10000, CreatedAt: "16/06/2025 - 18:50:11", StatusId: 1 },
    { Id: 7, Amount: 10000, CreatedAt: "16/06/2025 - 19:00:45", StatusId: 1 },
    { Id: 8, Amount: 10000, CreatedAt: "16/06/2025 - 19:15:30", StatusId: 1 },
    { Id: 9, Amount: 10000, CreatedAt: "16/06/2025 - 19:24:46", StatusId: 1 },
  ],
  MoneyOutData: [
    {
      Id: 1,
      Amount: 50000,
      CreatedAt: "16/06/2025 - 20:23:44",
      AccountId: "089 689 3636",
      BankName: "MB Bank - Ngân Hàng Quân Đội VN",
      StatusId: 1,
      SuccessAt: "16/06/2025 - 20:23:44",
    },
  ],
};

const fakeSlice = createSlice({
  name: "fake",
  initialState,
  reducers: {
    setFakeData: (state, action) => {
      state.Point = action.payload.Point;
      state.Level = action.payload.Level;
      state.Xp = action.payload.Xp;
      state.SuitYouBest = action.payload.SuitYouBest;
      state.MoneyInData = action.payload.MoneyInData;
      state.MoneyOutData = action.payload.MoneyOutData;
    },
    clearFakeData: (state) => {
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
