import NotificationSettings from "@/app/_components/Settings/NotificationSettings";

export const metadata = {
  title: "Notification Settings",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NotificationSettings />;
}
