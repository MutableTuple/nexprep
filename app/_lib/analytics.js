// app/_lib/analytics.js
//
// Thin wrapper around @next/third-parties' sendGAEvent — use this everywhere
// instead of importing sendGAEvent directly, so event shape stays consistent.
// No-ops (with a console warning from the underlying lib) if GoogleAnalytics
// hasn't mounted yet, e.g. NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set.
"use client";

import { sendGAEvent } from "@next/third-parties/google";

export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  sendGAEvent("event", name, params);
}
