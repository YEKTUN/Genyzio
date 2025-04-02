"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByUser } from "@/components/redux/slice/ReceiptSlice";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const decoded = useDecodedToken();
  const { orders, loading, error } = useSelector((state) => state.receipt);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (decoded) {
      dispatch(fetchOrdersByUser(decoded.id));
    }
  }, [dispatch, decoded]);

  const handleDownload = (order) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `receipt_${order._id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={`max-w-3xl ${orders.length <3 ? "h-[510px]" : ""}  mx-auto p-4 space-y-4`}>
      <h2 className="text-xl font-semibold mb-4">Sipariş Geçmişiniz</h2>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">Hata: {error}</p>}

      {orders.length === 0 && !loading ? (
        <p className="text-sm text-gray-500">Hiç siparişiniz bulunmamaktadır.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4 space-y-2 relative">
              <p className="text-sm font-medium">
                Sipariş Tarihi: {new Date(order.receipt.date).toLocaleDateString()}
              </p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.product?.images?.[0] || ""}`}
                      alt={item.product?.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div className="flex-1 text-sm">
                      <p>{item.product?.title}</p>
                      <p className="text-xs text-gray-500">
                        Adet: {item.quantity} | {item.product?.price}₺
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {item.product?.price * item.quantity}₺
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Toplam:</span>
                <span>{order.totalPrice}₺</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FileText className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fiş Detayı</DialogTitle>
                  </DialogHeader>
                  <pre className="bg-gray-100 p-2 rounded text-xs max-h-60 overflow-auto">
                    {JSON.stringify(selectedOrder?.receipt, null, 2)}
                  </pre>
                  <Button
                    variant="outline"
                    className="mt-2 flex gap-2"
                    onClick={() => handleDownload(selectedOrder)}
                  >
                    <Download className="w-4 h-4" /> JSON olarak indir
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
