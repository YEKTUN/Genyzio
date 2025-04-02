"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfileImage,
  getUserInfo,
} from "@/components/redux/slice/AuthSlice";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDecodedToken } from "@/components/utils/useDecodedToken";

const Profile = () => {
  const dispatch = useDispatch();
  const decoded = useDecodedToken();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef();

  useEffect(() => {
    if (decoded) {
      dispatch(getUserInfo(decoded.id));
    }
  }, [decoded, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && decoded) {
      dispatch(updateProfileImage({ userId: decoded.id, file }));
    }
  };

  if (!user) {
    return (
      <p className="text-center text-gray-500">
        Kullanıcı bilgisi yükleniyor...
      </p>
    );
  }

  return (
    <div className="max-w-2xl h-[510px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profilim</h1>

      <div className="flex items-center gap-4">
        <img
          src={
            user?.profileImage
              ? user?.profileImage.startsWith("http")
                ? user?.profileImage // Google görsel linki
                : `${process.env.NEXT_PUBLIC_API_URL}${user?.profileImage}` // Local resim
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt="Profil"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{user?.username}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current.click()}
          >
            Profil Resmi Değiştir
          </Button>
        </div>
      </div>
      {decoded?.role === "client" ? (
        <Link href="/orders">
          <Button className="flex items-center gap-2 cursor-pointer">
            Siparişlerime Git
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Link href="/seller-panel">
          <Button className="flex items-center gap-2 cursor-pointer">
            Panele Git
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Profile;
