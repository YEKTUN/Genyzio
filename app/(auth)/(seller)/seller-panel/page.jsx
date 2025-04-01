"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts, deleteProduct, createProduct, updateProduct } from "@/components/redux/slice/ProductSlice";
import ProductGrid from "./_components/ProductGrid";
import ProductDialog from "./_components/ProductDialog";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/utils/AlertModal";
import { Button } from "@/components/ui/button";
import { useDecodedToken } from "@/components/utils/useDecodedToken";
import { useAuthGuard } from "@/components/utils/useAuthGuard";
import { clearCart } from "@/components/redux/slice/CartSlice";

const ProductPage = () => {
  const isLoading = useAuthGuard("/");
  const decoded = useDecodedToken();
  const router=useRouter()
  const dispatch = useDispatch();
  // if (isLoading) {
  //   return <div>Yükleniyor...</div>;
  // }
console.log(decoded);


  const [modalOpen, setModalOpen] = useState(false);
  const { productList, loading, error } = useSelector((state) => state.product);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

useEffect(() => {
  if (decoded?.id) {
    dispatch(fetchSellerProducts(decoded.id));
  }
}, [dispatch, decoded]);

  

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setOpen(true);
  };

  const handleSubmit = (data) => {
    const formData = new FormData();
  
    for (let key in data) {
      if (key === "images") {
        data.images.forEach((file) => formData.append("images", file));
      } else if (key === "existingImages") {
        data.existingImages.forEach((img) => formData.append("existingImages", img));
      } else {
        formData.append(key, data[key]);
      }
    }
  
    if (editProduct) {
      dispatch(updateProduct({ id: editProduct._id, updatedData: formData }));
    } else {
      dispatch(createProduct(formData));
    }
  
    setOpen(false);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      
      router.push("/seller-login");
    }, 1000);
    dispatch(clearCart())
    setModalOpen(true);
  };

  return (
    <div>
        <AlertModal
        message={error || "Successfull Logout"}
        type={error ? "failure" : "success"}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <ProductGrid products={productList} onDelete={handleDelete} onEdit={handleEdit} onAdd={handleAdd} />
      <ProductDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} initialData={editProduct} />
      <Button onClick={logout} variant={"destructive"} className={"absolute bottom-4 right-4 cursor-pointer bg-indigo-500 hover:bg-indigo-300 hover:text-black active:bg-indigo-700 "}>Logout</Button>
    </div>
  );
};

export default ProductPage;
