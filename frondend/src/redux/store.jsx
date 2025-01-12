import { configureStore } from '@reduxjs/toolkit';
import reportReducer from './bagian/Laporan';

const store = configureStore({
  reducer: {
    report: reportReducer,
  },
});

export default store;
