import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/components/utils/axiosInstance";

// 🟢 Sepeti getir
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (userId) => {
      const res = await axiosInstance.get(`/cart/get-all/${userId}`);
      return res.data;
    }
  );
  

// ➕ Sepete ürün ekle
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, userId }) => {
    const res = await axiosInstance.post("/cart/add-to-cart", { productId, userId });
    return res.data;
  }
);

// ➖ Sepetten ürün çıkar
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, userId }) => {
    const res = await axiosInstance.post("/cart/remove-from-cart", { productId, userId });
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔽 GET CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        console.log("action.payload", action.payload.items);
        
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ➕ ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ➖ REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
