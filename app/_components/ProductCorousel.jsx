"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

const products = [
  { id: 1, name: "Ürün 1", image: "/image/Slide1.jpg" },
  { id: 2, name: "Ürün 2", image: "/image/Slide1.jpg" },
  { id: 3, name: "Ürün 3", image: "/image/Slide1.jpg" },
  { id: 4, name: "Ürün 4", image: "/image/Slide1.jpg" },
];

export default function ProductCarousel() {
    const plugin = React.useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));
  return (
    <div className="w-full  py-10 border-2 ">
      <Carousel className="w-full " plugins={[plugin.current]} opts={{ loop: false }}>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="w-full">
              <Card className="overflow-hidden border-none ">
                <CardContent className="p-2 flex flex-col items-center">
                  <img src={product.image} alt={product.name} className="h-[500px] w-[800px] object-cover  rounded-lg" />
               
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
       
      </Carousel>
    </div>
  );
}
