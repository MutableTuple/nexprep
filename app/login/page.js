import React from "react";
import LoginPage from "../_components/LoginPage";

export const metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function page() {
  return <LoginPage />;
}
