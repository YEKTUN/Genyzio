"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuthGuard = (redirectTo) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(redirectTo);
    } else {
      setIsLoading(false);
    }
  }, []);

  return isLoading;
};
