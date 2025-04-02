"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

import { Slider } from "@/components/ui/slider";
import {
  fetchFilteredProducts,
  fetchPaginatedProducts,
  fetchRandomProducts,
} from "@/components/redux/slice/ProductSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart, fetchCart } from "@/components/redux/slice/CartSlice";
import { useDecodedToken } from "@/components/utils/useDecodedToken";

export default function ProductFilterPage() {
  const [price, setPrice] = useState([0, 15000]);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const router = useRouter();
  const decoded = useDecodedToken();

  const dispatch = useDispatch();
  const { productList, loading, error, totalProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (
      !search &&
      !category &&
      sort === "" &&
      price[0] === 0 &&
      price[1] === 1000
    ) {
      dispatch(
        fetchPaginatedProducts({ page: currentPage, limit: productsPerPage })
      );
    } else {
      handleFilter();
    }
  }, [dispatch, currentPage]);

  const handleFilter = () => {
    const filters = {
      search,
      category,
      minPrice: price[0],
      maxPrice: price[1],
      sort,
      page: currentPage,
      limit: productsPerPage,
    };
    dispatch(fetchFilteredProducts(filters));
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setPrice([0, 1000]);
    setCurrentPage(1);
    dispatch(fetchPaginatedProducts({ page: 1, limit: productsPerPage }));
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="max-w-7xl border-2 mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sol Filtre Paneli */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filtrele</h2>

        <Input
          placeholder="Ürün adı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="mb-4">
          <label className="text-sm font-medium">
            Fiyat: {price[0]}₺ - {price[1]}₺
          </label>
          <Slider
            min={0}
            max={20000}
            step={200}
            value={price}
            onValueChange={(value) => setPrice(value)}
            className={"mt-3"}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={"mb-4"}>
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

        <Select value={sort} onValueChange={setSort} className="mt-4">
          <SelectTrigger>
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Yeniden Eskiye</SelectItem>
            <SelectItem value="oldest">Eskiden Yeniye</SelectItem>
            <SelectItem value="price-asc">Fiyat Artan</SelectItem>
            <SelectItem value="price-desc">Fiyat Azalan</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <Button
            onClick={() => {
              setCurrentPage(1);
              handleFilter();
            }}
            className="mt-4 w-full cursor-pointer hover:bg-gray-900 active:bg-gray-700"
          >
            Filtrele
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="mt-2 w-full cursor-pointer hover:bg-gray-300 active:bg-gray-100"
          >
            Sıfırla
          </Button>
        </div>
      </div>

      {/* Sağ Ürün Listesi */}
      <div className="col-span-1 md:col-span-3 overflow-auto">
        {loading && <p>Yükleniyor...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg hover:shadow-md transition flex flex-col justify-between"
            >
            <div>
            <Link
                href={`/product/${encodeURIComponent(
                  product.title.toLowerCase().replace(/\s+/g, "-")
                )}?productId=${product._id}`}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              </Link>
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-primary font-bold">{product.price}₺</p>
            </div>
              <Button
                onClick={() => {
                  if (!decoded) {
                    {
                      toast.error(
                        "Sepete ekleme yapabilmek icin oturum acmalısınız ",
                        {
                          duration: 1000,
                        }
                      );
                    }
                  }
                  if (decoded && decoded.role === "seller") {
                    toast.error(
                      "Sepete ekleme yapabilmek müşteri olmalısınız ",
                      {
                        duration: 1000,
                      }
                    );
                  }

                  if (decoded.role === "client") {
                    dispatch(
                      addToCart({ productId: product._id, userId: decoded.id })
                    ).unwrap();
                    toast.success("Ürün sepete eklendi", {
                      duration: 1000,
                    });
                  }
                }}
                className="w-full mt-4 cursor-pointer "
              >
                Sepete Ekle
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem className="cursor-pointer">
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50 "
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
