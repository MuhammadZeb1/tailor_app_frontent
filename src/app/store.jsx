import { configureStore } from '@reduxjs/toolkit';
import imageReducer from '../feathures/imageSlice';
import invoiceReducer from "../feathures/invoice/invoiceSlice";

export const store = configureStore({
  reducer: {
    images: imageReducer,
    invoice: invoiceReducer,
  },
});