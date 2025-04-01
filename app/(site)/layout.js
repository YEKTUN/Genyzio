import React from "react";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import { Toaster } from "sonner";

const SiteLayout = ({ children }) => {
  return <div>
    <Navbar />
    {children}
    <Toaster richColors position="top-right" />
    <Footer /></div>;
};

export default SiteLayout;
