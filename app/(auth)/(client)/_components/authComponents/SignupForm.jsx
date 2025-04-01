"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {useRouter,usePathname} from 'next/navigation'
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "@/components/redux/slice/AuthSlice";
import AlertModal from "@/components/utils/AlertModal";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Geçerli bir email girin.")
    .required("Email zorunludur."),
  username: Yup.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalı.")
    .required("Kullanıcı adı zorunludur."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakter olmalı.")
    .required("Şifre zorunludur."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor.")
    .required("Şifre tekrarı zorunludur."),
});

export default function SignupForm() {

  const router=useRouter()
  const pathname = usePathname();
  const { error,loading } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("");
const dispatch = useDispatch();
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
        registerUser({
          username: values.username,
          email: values.email,
          password: values.password,
          role: role,
        })
      ).unwrap(); // hata fırlatırsa catch'e düşer

      setTimeout(() => {
        if (role === "seller") {
          router.push("/seller-login");
          
        }else{

          router.push("/client-login"); // örnek yönlendirme
        }
      }, 1000);
      setModalOpen(true); // Modal aç
    } catch (err) {
      console.error("Kayıt Hatası:", error.error);
      setModalOpen(true); // Modal aç
    } finally {
      
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
       <AlertModal message={error||"Your account has been created successfully"} type={error?"failure":"success"} open={modalOpen} onOpenChange={setModalOpen} />
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
          <h2 className="text-2xl font-semibold mb-6 text-center">Create an Account</h2>
          <Formik
            initialValues={{
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block mb-1">Email address</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
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
                <div>
                  <label className="block mb-1">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 cursor-pointer active:scale-95 active:bg-orange-600"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </Button>
              </Form>
            )}
          </Formik>
           
                <p className="text-center text-sm mt-4">
                  Already have an account?{" "}
                  <Button variant={"link"} onClick={() => {
                     if (pathname.includes("seller")) {
                      router.push("/seller-login");
                    } else {
                      router.push("/client-login");
                    }
                  }}  className="text-orange-500 cursor-pointer">
                    Login
                  </Button>
                </p>
        </CardContent>
      </Card>
    </div>
  );
}
