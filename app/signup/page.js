import React from "react";
import SignupPage from "../_components/SignupPage";

export const metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function page() {
  return <SignupPage />;
}
