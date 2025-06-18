import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: {
    Id: string | null;
    RoleId: string | null;
    FullName?: string;
    Balance?: number;
    IsVerified?: boolean;
    Xp?: number;
    Level?: number;
    IsFilterSurveyRequired?: boolean;
    LastFilterSurveyTakenAt?: string | null;
    MainImageUrl: string | null;
    Profile: any;
  } | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user; // Lưu toàn bộ thông tin user
    },
    clearAuthToken: (state) => {
      state.token = null;
      state.user = null;
    },
    updateAuthUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setAuthToken, clearAuthToken, updateAuthUser } =
  authSlice.actions;
export default authSlice.reducer;
