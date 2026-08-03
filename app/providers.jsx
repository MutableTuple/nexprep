"use client";

import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import DuelChallengeListener from "./_components/DuelChallengeListener";
import BadgeUnlockProvider from "./_components/BadgeUnlockProvider";
import { useThemeSync } from "./_lib/use-theme-sync";

// Needs to live inside <ThemeProvider> since useThemeSync calls useTheme().
function ThemeSync() {
  useThemeSync();
  return null;
}

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <NextTopLoader color="#fbbf24" showSpinner={false} height={3} />
      <ThemeSync />
      <DuelChallengeListener />
      <BadgeUnlockProvider>{children}</BadgeUnlockProvider>
    </ThemeProvider>
  );
}
