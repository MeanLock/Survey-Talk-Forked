import { combineReducers } from "redux";
import authReducer from "./auth/authSlice";
import uiReducer from "./ui/uiSlice";
import fakeReducer from "./fake/fakeSlice";
// Import các reducer khác nếu cần

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  fake: fakeReducer,
  // Các reducer khác
});

export default rootReducer;
