import React from "react";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
}
