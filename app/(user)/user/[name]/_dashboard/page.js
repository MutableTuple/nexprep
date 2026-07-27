import AnalyticsScreen from "@/app/_components/Dashboard";
import React from "react";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function page() {
  return <AnalyticsScreen />;
}
