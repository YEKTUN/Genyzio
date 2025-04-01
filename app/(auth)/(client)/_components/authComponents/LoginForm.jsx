"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/components/redux/slice/AuthSlice";
import AlertModal from "@/components/utils/AlertModal";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import { jwtDecode } from "jwt-decode";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalı.")
    .required("Kullanıcı adı zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalı.")
    .required("Şifre zorunludur."),
});

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const decoded = useDecodedToken();

  const { error, loading } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    if (pathname.includes("seller")) {
      setRole("seller");
    } else {
      setRole("client");
    }
  }, [pathname]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        loginUser({
          username: values.username,
          password: values.password,
        })
      ).unwrap(); // hata olursa catch'e düşer

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      if (decoded?.role === "seller" && pathname.includes("client")) {
        alert("Seller hesabı ile client girişi yapamazsınız");
        localStorage.removeItem("token");
        return;
      }
      if (decoded?.role === "client" && pathname.includes("seller")) {
        alert("Client hesabı ile seller panele giriş yapamazsınız");
        localStorage.removeItem("token");
        return;
      }
      if (token) {
        if (decoded?.role === "seller") {
          router.push("/seller-panel");
        } else if (decoded?.role === "client") {
          router.push("/");
        }else {
          console.error("Role tanımlı değil");
        }
      
      }
      setModalOpen(true); // Modal aç
    } catch (err) {
      console.error("Giriş Hatası:", error);
      setModalOpen(true); // Modal aç
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <AlertModal
        message={error || "Successfull Login"}
        type={error ? "failure" : "success"}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <Card className="grid grid-cols-1 md:grid-cols-2 overflow-hidden w-full max-w-5xl rounded-2xl shadow-lg">
        <Image
          style={{ objectFit: "cover" }}
          src="/image/LoginPageImage.jpg"
          alt="Logo"
          width={5461}
          height={8192}
          className="w-[600px] h-[600px] object-cover rounded-2xl md:ml-5"
        />
        <CardContent className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome</h2>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block mb-1">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 cursor-pointer active:scale-95 active:bg-orange-600"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="flex items-center justify-center gap-4 mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
                    {
                      credential: credentialResponse.credential,
                      role: role,
                    }
                  );
                  localStorage.setItem("token", res.data.token);

                  const token = localStorage.getItem("token");
                  
                  if (token) {
                    const decoded = jwtDecode(token);
                    if (decoded?.role === "seller") {
                      router.push("/seller-panel");
                    } else if (decoded?.role === "client") {
                      router.push("/dashboard");
                    } else {
                      console.error("Role tanımlı değil");
                    }
                  }
                  console.log(res.data);
                  // token saklama
                } catch (err) {
                  console.error("Google login error", err);
                }
              }}
              onError={() => {
                console.log("Google login failed");
              }}
            />
          </div>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Button
              variant={"link"}
              onClick={() => {
                if (pathname.includes("seller")) {
                  router.push("/seller-signup");
                } else {
                  router.push("/client-signup");
                }
              }}
              className="text-orange-500 cursor-pointer"
            >
              Signup
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
