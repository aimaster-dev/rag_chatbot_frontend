import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: false
};

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setactive: (state, action) => {
      state.item = action.payload;
    },
  },
});

export const { setactive } = activeSlice.actions;
export const selectactive = (state) => state.active.item;
export default activeSlice.reducer;
