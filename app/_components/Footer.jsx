import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Geist_Mono } from "next/font/google";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-8 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
        {/* Logo & Copyright */}
        <div className="text-center md:text-left">
          <h2 className={`text-xl font-bold ${geistMono.className}`}>Genyzio</h2>
          <p className="text-sm text-gray-600">© 2025 Genyzio. Tüm hakları saklıdır.</p>
        </div>

        {/* Linkler */}
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary">Hakkımızda</Link>
          <Link href="/" className="text-gray-700 hover:text-primary">İletişim</Link>
          <Link href="/" className="text-gray-700 hover:text-primary">Gizlilik</Link>
        </div>

        {/* Sosyal Medya */}
        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" className="hover:text-blue-600">
            <Facebook />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500">
            <Instagram />
          </Link>
          <Link href="https://x.com" target="_blank" className="hover:text-sky-500">
            <Twitter />
          </Link>
        </div>
      </div>
    </footer>
  );
}
