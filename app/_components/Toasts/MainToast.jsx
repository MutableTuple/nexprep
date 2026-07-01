// app/_components/MainToast.jsx
import { Toaster } from "@/components/ui/sonner";

export default function MainToast() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-border bg-card text-foreground shadow-lg text-sm font-medium",
          title: "font-semibold text-foreground",
          description: "text-muted-foreground text-xs mt-0.5",
          closeButton:
            "rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground",
          success: "border-green-200 dark:border-green-800",
          error: "border-red-200 dark:border-red-800",
          warning: "border-amber-200 dark:border-amber-800",
          info: "border-blue-200 dark:border-blue-800",
        },
      }}
    />
  );
}
