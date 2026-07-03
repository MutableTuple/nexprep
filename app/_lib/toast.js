// lib/toast.js  ← use this everywhere instead of importing sonner directly
import { toast } from "sonner";

// Solid fills via the `style` prop — sonner's documented way to override a
// single toast's look — instead of classNames + !important fighting
// sonner's own generated styles. Colors match the app's existing palette
// (orange = streak/flame, amber = XP/zap, green = correct, red = wrong,
// blue = bookmarks), one shade deeper than the UI badges elsewhere so white
// text stays readable on a solid fill.
const PALETTE = {
  amber: "#d97706",
  orange: "#ea580c",
  green: "#16a34a",
  red: "#dc2626",
  blue: "#2563eb",
};

function themed(title, { description, icon, duration = 3000, bg }) {
  return toast(title, {
    description,
    icon,
    duration,
    position: "bottom-right",
    // capped width so it never overflows a phone screen; sonner itself
    // switches corner toasts to a bottom, near-full-width layout on small
    // viewports automatically, this just guards the in-between sizes
    className:
      "!rounded-2xl !border-0 !shadow-lg !max-w-[calc(100vw-2rem)] sm:!max-w-sm",
    style: {
      background: bg,
      color: "#ffffff",
    },
    classNames: {
      title: "!font-bold",
      description: "!text-white/90",
      icon: "!text-lg",
    },
  });
}

export const showToast = {
  success: (title, description) =>
    toast.success(title, { description, position: "bottom-right" }),

  error: (title, description) =>
    toast.error(title, { description, position: "bottom-right" }),

  info: (title, description) =>
    toast(title, { description, position: "bottom-right" }),

  warning: (title, description) =>
    toast.warning(title, { description, position: "bottom-right" }),

  xp: (amount, title = "XP Earned!") =>
    themed(title, {
      description: `+${amount} XP added to your profile`,
      icon: "⚡",
      duration: 3000,
      bg: PALETTE.amber,
    }),

  streak: (days) =>
    themed("Streak Extended!", {
      description: `You're on a ${days}-day streak. Keep going!`,
      icon: "🔥",
      duration: 4000,
      bg: PALETTE.orange,
    }),

  correct: (xp) =>
    themed("Correct Answer!", {
      description: `+${xp} XP earned`,
      icon: "✅",
      duration: 3000,
      bg: PALETTE.green,
    }),

  wrong: () =>
    themed("Incorrect", {
      description: "Review the explanation and try the next one.",
      icon: "❌",
      duration: 3000,
      bg: PALETTE.red,
    }),

  bookmarked: (saved) =>
    themed(saved ? "Bookmarked" : "Bookmark removed", {
      icon: saved ? "🔖" : "📄",
      duration: 2000,
      bg: PALETTE.blue,
    }),
};
