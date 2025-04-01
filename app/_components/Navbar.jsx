"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import { Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import CartSheet from "./CartSheet";
import { useDispatch } from "react-redux";
import { clearCart } from "@/components/redux/slice/CartSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Navbar() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const decoded = useDecodedToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(decoded);
  }, [decoded]);

  // Debounce ile 0.5s içinde yazmayı bitirince arama
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length >= 1) {
        try {
          const query = new URLSearchParams({ search: searchTerm }).toString();
          const token = localStorage.getItem("token"); // Token'ı al
  
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product/search?${query}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "", // Token varsa gönder
              },
            }
          );
          const data = await res.json();
          console.log("data", data);
  
          setSearchResults(data.products);
          setOpen(true);
        } catch (err) {
          console.error("Arama hatası", err);
        }
      } else {
        setOpen(false);
        setSearchResults([]);
      }
    }, 500);
  
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    dispatch(clearCart());
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 shadow-md bg-white">
      <div className={`text-2xl font-bold ${geistMono.className}`}>Genyzio</div>

      <div className="flex gap-6">
        <Link href="/">Anasayfa</Link>
        <Link href="/product">Ürünler</Link>
      </div>

      {/* 🔍 Arama */}
      <div className="hidden md:flex items-center gap-2 relative">
        {/* modal={false} ekledik, popover açılınca input odağını kaybetmez */}
        <Popover open={open} onOpenChange={setOpen} modal={false}>
          <PopoverTrigger asChild>
            <div className="flex items-center border rounded px-2">
              <Search className="w-4 h-4 mr-2" />
              <Input
                placeholder="Ürün ara..."
                className="w-64 border-none focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0">
            <Command>
              <CommandList>
                {searchResults?.length > 0 ? (
                  searchResults?.map((product) => (
                    <CommandItem
                      key={product._id}
                      onSelect={() => {
                        window.location.href = `/product/${encodeURIComponent(
                          product.title.toLowerCase().replace(/\s+/g, "-")
                        )}?productId=${product._id}`;
                      }}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${
                          product?.images?.[0] || ""
                        }`}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm">{product.title}</p>
                        <p className="text-xs text-gray-500">
                          {product.price}₺
                        </p>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <p className="text-center text-sm p-2">Sonuç bulunamadı</p>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Sağ Menü */}
      <div className="flex items-center gap-4">
        <CartSheet />
        <DropdownMenu>
          <DropdownMenuTrigger className="border-1 rounded-full p-1 hover:bg-gray-300 cursor-pointer active:bg-gray-200">
            <User />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user ? (
              <>
                <DropdownMenuItem>
                  <Link href="/profile">Profilim</Link>
                </DropdownMenuItem>
                {user.role === "seller" ? (
                  <DropdownMenuItem>
                    <Link href="/seller-panel">Panel</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <Link href="/orders">Siparişlerim</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>Çıkış Yap</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <Link href="/seller-login">Satıcı Girişi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/client-login">Müşteri Girişi</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
