"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Brain, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import TimeLeftJeeChart from "./TimeLeftJeeChart";
import NotificationsDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { useUser } from "../_lib/AuthProvider";

const links = [
  { name: "Problems", href: "/problems" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Mock Tests", href: "/mock-tests" },
  { name: "Blog", href: "/blog" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  function toggle(e) {
    const newTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => setTheme(newTheme));

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxR}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

// Single source of truth for "what does the auth-dependent slot look like
// right now" — loading / logged-in / logged-out are three genuinely
// different states, so this always branches on all three explicitly rather
// than treating "no user yet" as "logged out" anywhere in this file.
function AuthSlot({ loading, user, loadingFallback, loggedIn, loggedOut }) {
  if (loading) return loadingFallback;
  return user ? loggedIn : loggedOut;
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain size={16} />
          </div>
          <span className="text-base tracking-tight">rankgrind.com</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 font-semibold hidden sm:inline-flex"
          >
            BETA
          </Badge>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {links.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <AuthSlot
            loading={loading}
            user={user}
            loadingFallback={
              <div className="h-8 w-[168px] rounded-lg bg-muted animate-pulse" />
            }
            loggedIn={
              <>
                <TimeLeftJeeChart />
                <NotificationsDropdown />
                <ProfileDropdown user={user} />
              </>
            }
            loggedOut={
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="gap-1.5" asChild>
                  <Link href="/signup">
                    Get Started
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </>
            }
          />
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <AuthSlot
            loading={loading}
            user={user}
            loadingFallback={
              <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
            }
            loggedIn={<NotificationsDropdown />}
            loggedOut={null}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 sm:w-80 flex flex-col p-0"
            >
              <SheetHeader className="px-6 pt-6 pb-4">
                <SheetTitle asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2.5 font-bold text-foreground w-fit"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Brain size={16} />
                    </div>
                    Cod&#233;dex
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <Separator />

              <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <Separator />

              <div className="flex flex-col gap-2 px-4 py-4">
                <AuthSlot
                  loading={loading}
                  user={user}
                  loadingFallback={
                    <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
                  }
                  loggedIn={
                    <>
                      <TimeLeftJeeChart />
                      <div className="flex items-center gap-2">
                        <ProfileDropdown user={user} />
                        <span className="text-sm font-medium text-foreground">
                          {user?.user_metadata?.full_name ||
                            user?.email?.split("@")[0]}
                        </span>
                      </div>
                    </>
                  }
                  loggedOut={
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button className="w-full gap-1.5" asChild>
                        <Link href="/signup">
                          Get Started
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    </>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
