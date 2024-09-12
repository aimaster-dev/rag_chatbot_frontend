import { configureStore } from '@reduxjs/toolkit';
import activeSlice from './activeSlice';

const store = configureStore({
  reducer: {
    active: activeSlice,
  },
});

export default store;

