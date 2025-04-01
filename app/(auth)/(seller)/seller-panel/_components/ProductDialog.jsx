"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { DialogTitle } from "@radix-ui/react-dialog";

const ProductDialog = ({ open, onOpenChange, onSubmit, initialData }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-2xl">
        <ProductForm onSubmit={onSubmit} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
