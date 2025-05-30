
import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  sidebarShow: boolean;
  theme: string;
}

const initialState: UiState = {
  sidebarShow: true,
  theme: '123',
} ;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUi: (state, action) => {
      alert('setUi action called');
      return { ...state, ...action.payload };
    },
  },
});

export const { setUi } = uiSlice.actions;
export default uiSlice.reducer;
