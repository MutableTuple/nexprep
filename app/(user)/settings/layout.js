"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Spinner } from "@/app/_components/Spinner";
import { useUser } from "@/app/_lib/AuthProvider";

const TABS = [
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/study", label: "Study" },
  { href: "/settings/privacy", label: "Privacy" },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-extrabold">Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Manage your notifications, appearance, and study preferences.
      </p>

      <nav className="mb-8 flex gap-1 border-b">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === tab.href
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {userLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size={32} />
        </div>
      ) : !user ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          Sign in to manage your settings.
        </p>
      ) : (
        children
      )}
    </div>
  );
}
