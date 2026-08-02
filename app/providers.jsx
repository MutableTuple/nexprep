"use client";

import { ThemeProvider } from "next-themes";
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
      <ThemeSync />
      <DuelChallengeListener />
      <BadgeUnlockProvider>{children}</BadgeUnlockProvider>
    </ThemeProvider>
  );
}
