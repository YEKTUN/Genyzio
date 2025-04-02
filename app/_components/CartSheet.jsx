"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import {
  addToCart,
  clearAllCart,
  fetchCart,
  removeFromCart,
} from "@/components/redux/slice/CartSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkoutAndGenerateReceipt } from "@/components/redux/slice/ReceiptSlice";

export default function CartSheet() {
  const decoded = useDecodedToken();
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (decoded) {
      dispatch(fetchCart(decoded.id));
    }
  }, [dispatch, decoded]);

  const handleAdd = (productId) => {
    dispatch(addToCart({ productId, userId: decoded.id }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId, userId: decoded.id }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart />
          {items && items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {items.length}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Sepetim</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 p-4">
          {decoded && items && items.length > 0 ? (
            <>
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 space-x-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${
                      item.product?.images?.[0] || ""
                    }`}
                    alt={item.product?.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">{item.product?.title}</p>
                    <p className="text-xs text-gray-500">
                      Adet: {item.quantity} | {item.product?.price}₺
                    </p>
                    {/* ➕ ➖ Butonlar */}
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleAdd(item.product._id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-6 font-semibold">
                <span>Toplam:</span>
                <span>{totalPrice}₺</span>
              </div>
              <Button
                onClick={async () => {
                  if (items.length === 0) {
                    toast.error("Sepetiniz boş, sipariş veremezsiniz.");
                    return;
                  }
                  try {
                    await dispatch(
                      checkoutAndGenerateReceipt(decoded.id)
                    ).unwrap();
                    await dispatch(clearAllCart(decoded.id))
                    toast.success("Siparişiniz başarıyla oluşturuldu.",{
                      duration: 1000,});
                  } catch (error) {
                    toast.error(
                      error?.message ||
                        "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",{
                          duration: 1000,}
                    );
                  }
                }}
                className="w-full mt-4 hover:bg-green-600 active:bg-green-300 active:text-black bg-green-800 text-white cursor-pointer"
              >
                SİPARİŞİ ONAYLA
              </Button>
            </>
          ) : (
            <p className="text-center text-sm">Sepetiniz boş</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
