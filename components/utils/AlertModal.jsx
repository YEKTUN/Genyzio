"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AlertModal = ({ message, open, onOpenChange,type}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
 
      <AlertDialogContent className={`${type==="success"? "bg-green-500":"bg-red-500"}`}>
        <AlertDialogHeader>
          <AlertDialogDescription className={"text-white"}>{message}</AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
