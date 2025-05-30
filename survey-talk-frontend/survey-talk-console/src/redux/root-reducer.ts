import { combineReducers } from 'redux';
import authReducer from './auth/auth.slice';
import uiReducer from './ui/ui.slice';
// Import các reducer khác nếu cần

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer
  // Các reducer khác
});

export default rootReducer;