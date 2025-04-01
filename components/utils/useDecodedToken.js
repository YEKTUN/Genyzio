"use client";

import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const useDecodedToken = () => {
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setDecoded(decodedToken);
        } catch (error) {
          console.error("Token çözümlenemedi:", error);
          setDecoded(null);
        }
      }
    }
  }, []);

  return decoded;
};
