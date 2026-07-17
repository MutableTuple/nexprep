"use client";

import { ThemeProvider } from "next-themes";
import DuelChallengeListener from "./_components/DuelChallengeListener";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <DuelChallengeListener />
      {children}
    </ThemeProvider>
  );
}
