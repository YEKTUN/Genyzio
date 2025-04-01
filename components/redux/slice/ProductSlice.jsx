import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance"; // kendi yoluna göre değiştir
import axios from "axios";

// GET - Ürünleri getir
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/product/get-all-product");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ürünler getirilemedi"
      );
    }
  }
);
export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (sellerId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/product/seller-products/${sellerId}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Seller ürünleri getirilemedi"
      );
    }
  }
);

// POST - Ürün ekle
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/product/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ürün eklenemedi"
      );
    }
  }
);

// DELETE - Ürün sil
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/product/delete/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ürün silinemedi"
      );
    }
  }
);

// PUT - Ürün güncelle
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/update/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ürün güncellenemedi"
      );
    }
  }
);
export const fetchFilteredProducts = createAsyncThunk(
  "product/fetchFilteredProducts",
  async (filters) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/filtered?${query}`);
    const data = await res.json();
    return data;
  }
);
export const fetchPaginatedProducts = createAsyncThunk(
  "product/fetchPaginatedProducts",
  async ({ page, limit }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/paginated?page=${page}&limit=${limit}`
    );
    const data = await res.json();
    return data;
  }
);
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/get-by-id/${id}`
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ürün getirilemedi"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    productList: [],
    selectedProduct: null, // 🔥 Detay sayfası için
    loading: false,
    error: null,
    totalProducts:0 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload; // → ekstra bir state açıyoruz
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.products;
        state.totalProducts = action.payload.total;
      })
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productList.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = state.productList.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = state.productList.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.products;
        state.totalProducts = action.payload.total;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
