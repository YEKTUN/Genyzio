"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "@/components/redux/slice/ProductSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import { addToCart } from "@/components/redux/slice/CartSlice";

export default function ProductDetail() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const decoded = useDecodedToken();
  const productId = searchParams.get("productId");
  console.log("productId", productId);

  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (loading) return <p>Yükleniyor...</p>;

  if (!selectedProduct) return <p>Ürün bulunamadı...</p>;

  return (
    <div className="max-w-4xl flex flex-col justify-center items-center mx-auto p-6">
      {/* Ürün Görselleri */}
      {selectedProduct?.images?.length > 1 ? (
        <div className="relative">
          <Carousel className="w-full h-96 mb-4">
            <CarouselContent>
              {selectedProduct.images.map((img, index) => (
                <CarouselItem key={index} className="flex justify-center ">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + img}
                    alt={selectedProduct.title}
                    width={500} 
                    height={2000}
                    className="h-96 object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        selectedProduct?.images?.[0] && (
          <img
            src={process.env.NEXT_PUBLIC_API_URL + selectedProduct.images[0]}
            alt={selectedProduct.title}
            className="w-[500px] h-[500px]  object-cover rounded-lg mb-4"
          />
        )
      )}

      <div className="space-y-3">
        {/* Başlık */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {selectedProduct.title}
        </h1>

        {/* Açıklama */}
        <p className="text-base text-gray-600 leading-relaxed">
          {selectedProduct.description}
        </p>

        {/* Fiyat */}
        <p className="text-2xl font-semibold text-primary">
          {selectedProduct.price}₺
        </p>

        {/* Kategori */}
        <p className="text-sm text-gray-500">
          Kategori:{" "}
          <span className="font-medium text-gray-700">
            {selectedProduct.category}
          </span>
        </p>

        {/* Diğer Bilgiler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-black">
          <p>
            <span className="font-semibold">Stok:</span> {selectedProduct.stock}
          </p>
          <p>
            <span className="font-semibold">Satıcı:</span>{" "}
            {selectedProduct.seller.username}
          </p>
          <p>
            <span className="font-semibold">Marka:</span>{" "}
            {selectedProduct.brand}
          </p>
        </div>
      </div>

      <Button
        onClick={() => {
          if (!decoded) {
            {
              toast.error("Sepete ekleme yapabilmek icin oturum acmalısınız ", {
                duration: 1000,
              });
            }
          }
          if (decoded && decoded.role === "seller") {
            toast.error("Sepete ekleme yapabilmek müşteri olmalısınız ", {
              duration: 1000,
            });
          }

          if (decoded.role === "client") {
            dispatch(
              addToCart({ productId: selectedProduct._id, userId: decoded.id })
            ).unwrap();
            toast.success("Ürün sepete eklendi", {
              duration: 1000,
            });
          }
        }}
        className="w-full mt-4 cursor-pointer"
      >
        Sepete Ekle
      </Button>
    </div>
  );
}
