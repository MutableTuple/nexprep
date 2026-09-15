"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

// Primary nav is the strongest structural signal Google uses when picking
// sitelinks, so the indexable, high-intent destinations belong here — not
// only the in-app features. (/duel is noindex and can never be chosen as a
// sitelink regardless of its position here; Mock Tests is still a
// coming-soon stub, so it is demoted to the footer rather than occupying a
// primary slot.)
const links = [
  { name: "Problems", href: "/problems" },
  { name: "Predictor", href: "/college-predictor" },
  { name: "Percentile", href: "/percentile-to-rank" },
  { name: "Colleges", href: "/colleges" },
  { name: "Duel", href: "/duel" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Simulators", href: "/simulators" },
  { name: "Millennium Problems", href: "/millennium-prize-problems" },
  { name: "Blog", href: "/blog" },
];

function NavLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // default to dark logo until mounted to avoid a hydration mismatch/flash
  const src =
    !mounted || resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-white.png";

  return (
    <div className="flex  items-center justify-center rounded-lg text-primary-foreground">
      <img src={src} className="w-14" alt="rankgrind.com logo" />
    </div>
  );
}

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
          <NavLogo />
          <span className="text-base tracking-tight">rankgrind.com</span>
        </Link>

        {/* Desktop nav */}
        {/* Desktop nav switches on at xl, not lg: the header row is capped at
            max-w-7xl, so it's the container width that matters, not the
            viewport. Logo+badge (~221px) and auth buttons (~222px) plus 8 nav
            items don't fit inside that at lg, which shrinks each
            NavigationMenuItem below its content width and wraps labels
            mid-word. whitespace-nowrap + shrink-0 are a hard backstop against
            that regardless of item count. Tablets/small-laptops get the
            sheet menu instead. */}
        <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList className="gap-1">
            {links.map((link) => (
              <NavigationMenuItem key={link.name} className="shrink-0">
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
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
        <div className="hidden xl:flex items-center gap-2">
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
        <div className="flex items-center gap-1 xl:hidden">
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
                    <NavLogo />
                    <span className="text-base tracking-tight">
                      rankgrind.com
                    </span>
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
