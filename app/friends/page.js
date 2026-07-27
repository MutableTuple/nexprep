import React from "react";
import FriendsPage from "../_components/Friends/FriendsPage";

export const metadata = {
  title: "Friends",
  robots: { index: false, follow: false },
};

export default function page() {
  return <FriendsPage />;
}
