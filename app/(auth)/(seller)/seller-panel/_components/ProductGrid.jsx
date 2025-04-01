"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductGrid({ products, onDelete, onEdit, onAdd }) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Ürünlerim</h2>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" /> Yeni Ürün Ekle
        </Button>
      </div>

      <Separator className="mb-6" />

      {products.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Henüz ürün eklemediniz.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="flex flex-col justify-between shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </CardHeader>
              <CardContent>
                {product.images.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {product.images.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                              alt={`product-image-${index}`}
                              className="h-40 w-full object-cover rounded-md"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className={"ml-5 cursor-pointer"} />
                    <CarouselNext className={"mr-5 cursor-pointer"}/>
                  </Carousel>
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg mb-3">
                    <span className="text-muted-foreground">Görsel yok</span>
                  </div>
                )}
                <p className="text-sm line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="text-sm text-muted-foreground">
                  Stok: {product.stock}
                </div>
                <div className="text-sm text-muted-foreground">
                  ₺{product.price}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                 className={"cursor-pointer"}
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="w-4 h-4 mr-1" /> Düzenle
                </Button>
                <Button
                className={"cursor-pointer"}
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
