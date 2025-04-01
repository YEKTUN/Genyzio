"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import axiosInstance from "@/components/utils/axiosInstance";
import { useDecodedToken } from "@/components/utils/useDecodedToken";

const ProductForm = ({ onSubmit, initialData }) => {
  const decoded = useDecodedToken();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    brand: "",
    status: "active",
    seller: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // input reset için
  useEffect(() => {
    if (decoded) {
      setFormData((prev) => ({
        ...prev,
        seller: decoded?.id,
      }));
    }
  }, [decoded]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: [],
      });
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files);
      setFormData({ ...formData, images: selectedFiles });
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedPreviews);

    // input sıfırla
    setFileInputKey(Date.now());
  };

  const handleRemoveExisting = async (index) => {
    const imageToDelete = existingImages[index];
    try {
      await axiosInstance.delete(`/product/delete-image/${initialData._id}`, {
        data: { imagePath: imageToDelete },
      });
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);

      // input sıfırla
      setFileInputKey(Date.now());
    } catch (err) {
      console.error("Görsel silinemedi", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, existingImages });
  };

  return (
    <Card className="shadow-md h-[650px] overflow-y-scroll">
      <CardHeader>
        <CardTitle>
          {initialData ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 space-y-5 ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fiyat</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Stok</Label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori Seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Elektronik</SelectItem>
                  <SelectItem value="clothing">Giyim</SelectItem>
                  <SelectItem value="home">Ev Ürünleri</SelectItem>
                  <SelectItem value="books">Kitap</SelectItem>
                  <SelectItem value="sports">Spor</SelectItem>
                  <SelectItem value="toys">Oyuncak</SelectItem>
                  <SelectItem value="accessories">Aksesuar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marka</Label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                
                </SelectContent>
              </Select>
            </div>

            {/* Görseller Alanı */}
            <div className="space-y-2">
              <Label>Görseller</Label>
              <Input
                key={fileInputKey}
                type="file"
                name="images"
                onChange={handleChange}
                multiple
                accept="image/*"
              />

              {/* Mevcut Görseller */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Mevcut Görseller
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${src}`}
                          alt={`existing-${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => handleRemoveExisting(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yeni Eklenen Görseller */}
              {imagePreviews.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Yeni Eklenen Görseller
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            {initialData ? "Güncelle" : "Kaydet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
