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

export default function ProductDetail() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  console.log("productId", productId);
  

  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  if (loading) return <p>Yükleniyor...</p>;

  if (!selectedProduct) return <p>Ürün bulunamadı...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Ürün Görselleri */}
      {selectedProduct?.images?.length > 1 ? (
        <div className="relative">
          <Carousel className="w-full h-96 mb-4">
            <CarouselContent>
              {selectedProduct.images.map((img, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + img}
                    alt={selectedProduct.title}
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
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
        )
      )}

      {/* Ürün Bilgileri */}
      <h1 className="text-2xl font-bold mb-2">{selectedProduct.title}</h1>
      <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
      <p className="text-primary font-bold text-xl mb-2">{selectedProduct.price}₺</p>
      <p className="text-sm text-gray-500">Kategori: {selectedProduct.category}</p>
    </div>
  );
}
