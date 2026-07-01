// lib/toast.js  ← use this everywhere instead of importing sonner directly
import { toast } from "sonner";

export const showToast = {
  success: (title, description) => toast.success(title, { description }),

  error: (title, description) => toast.error(title, { description }),

  info: (title, description) => toast(title, { description }),

  warning: (title, description) => toast.warning(title, { description }),

  xp: (amount, title = "XP Earned!") =>
    toast.success(title, {
      description: `+${amount} XP added to your profile`,
      icon: "⚡",
      duration: 3000,
    }),

  streak: (days) =>
    toast.success("Streak Extended!", {
      description: `You're on a ${days}-day streak. Keep going!`,
      icon: "🔥",
      duration: 4000,
    }),

  correct: (xp) =>
    toast.success("Correct Answer!", {
      description: `+${xp} XP earned`,
      icon: "✅",
      duration: 3000,
    }),

  wrong: () =>
    toast.error("Incorrect", {
      description: "Review the explanation and try the next one.",
      icon: "❌",
      duration: 3000,
    }),

  bookmarked: (saved) =>
    toast(saved ? "Bookmarked" : "Bookmark removed", {
      icon: saved ? "🔖" : "📄",
      duration: 2000,
    }),
};
