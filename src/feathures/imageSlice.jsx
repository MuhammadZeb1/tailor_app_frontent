import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api"; // path to your api.js

// Async thunk to fetch images
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/images"); // replace with your backend route
      console.log("clg", response.data.rows);
      return response.data.rows;

    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    rows: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
       console.log("clg",action.payload)
        state.rows = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default imagesSlice.reducer;
