import React, { Children } from "react";
import Navbar from "../_components/Navbar";
import Hero from "../_components/Hero";
import Footer from "../_components/Footer";
import ProblemScreen from "../_components/Problems/ProblemScreen";

export default function layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
