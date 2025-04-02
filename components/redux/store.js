import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slice/AuthSlice"
import productReducer from "./slice/ProductSlice"
import cartReducer from "./slice/CartSlice"
import receiptReducer from "./slice/ReceiptSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product:productReducer,
    cart:cartReducer,
    receipt:receiptReducer,
   
  },
})