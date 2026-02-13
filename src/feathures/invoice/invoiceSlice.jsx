import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

/* ================= THUNKS ================= */

export const createInvoice = createAsyncThunk(
  "invoice/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/invoices", data);
      return res.data; // This now includes the auto-generated invoiceNumber
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  "invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/invoices");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/invoices/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/invoices/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= SLICE ================= */

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    currentInvoice: null, // Holds the most recently created/selected invoice
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetInvoiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentInvoice = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentInvoice = action.payload; // Store the specific invoice returned
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* READ */
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })

      /* UPDATE */
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.success = true;
        state.currentInvoice = action.payload;
        const index = state.invoices.findIndex((inv) => inv._id === action.payload._id);
        if (index !== -1) state.invoices[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
      });
  },
});

export const { resetInvoiceState } = invoiceSlice.actions;
export default invoiceSlice.reducer;