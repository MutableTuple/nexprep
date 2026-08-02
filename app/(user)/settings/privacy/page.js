import PrivacySettings from "@/app/_components/Settings/PrivacySettings";

export const metadata = {
  title: "Privacy Settings",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrivacySettings />;
}
