import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/components/utils/axiosInstance';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrdersByUser = createAsyncThunk(
  'receipts/fetchOrdersByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/order/get-receipt-by-user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkoutAndGenerateReceipt = createAsyncThunk(
  'receipts/checkoutAndGenerateReceipt',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/order/checkout-and-generate-receipt/${userId}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(checkoutAndGenerateReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutAndGenerateReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(checkoutAndGenerateReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default receiptSlice.reducer;