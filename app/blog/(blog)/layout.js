import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import React from "react";

export default function layout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
