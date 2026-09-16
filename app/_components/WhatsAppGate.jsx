"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Phone, Loader2, Sparkles } from "lucide-react";
import { useUser } from "../_lib/AuthProvider";
import { supabase } from "../_lib/supabase";
import { upsertProfileDetails } from "../_lib/data-service";
import { showToast } from "../_lib/toast";

// Gate that catches every logged-in user without a WhatsApp number and
// pops a modal asking for one. Fires app-wide because it's mounted in
// the root layout — most importantly, it catches Google-OAuth users
// (who skipped the signup form entirely) on their first authed page
// load.
//
// The dialog is intentionally non-dismissible: the whole point is to
// collect the number before the user goes deep into the product. They
// can opt out of the daily blast by unchecking the checkbox, but the
// number itself is required.
//
// Skipped routes: auth flows and legal pages where popping this modal
// would be worse than just letting the user finish what they came for.

const SKIP_ROUTES = new Set([
  "/login",
  "/signup",
  "/auth/callback",
  "/privacy",
  "/terms",
]);

export default function WhatsAppGate() {
  const { user, loading: authLoading } = useUser();
  const pathname = usePathname();

  const [needsNumber, setNeedsNumber] = useState(false);
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [saving, setSaving] = useState(false);

  // Once we know who the user is, look up their profile row and decide
  // whether to show the gate. Re-run whenever the user changes (login,
  // logout, or profile update elsewhere).
  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (authLoading) return;
      if (!user) {
        setNeedsNumber(false);
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("whatsapp_number")
          .eq("id", user.id)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          // Table read failure shouldn't hard-block the app — better to
          // let the user through and try again next navigation.
          console.error("WhatsAppGate profile lookup failed:", error);
          setNeedsNumber(false);
        } else {
          setNeedsNumber(!data?.whatsapp_number);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const phoneDigits = phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
  const phoneValid = /^[6-9]\d{9}$/.test(phoneDigits);

  async function save() {
    if (!phoneValid || !user) return;
    setSaving(true);
    try {
      await upsertProfileDetails(user.id, {
        whatsapp_number: `+91${phoneDigits}`,
        whatsapp_daily_opt_in: optIn,
      });
      showToast.success(
        "Saved!",
        optIn
          ? "You'll get your first JEE question on WhatsApp tomorrow morning."
          : "WhatsApp number saved.",
      );
      setNeedsNumber(false);
    } catch (err) {
      // Duplicate-number collisions surface as unique-violation — surface
      // that specifically so the user can correct their input instead of
      // being told a generic "save failed".
      const msg = String(err?.message ?? err);
      if (msg.includes("unique") || msg.includes("duplicate")) {
        showToast.error(
          "Already in use",
          "That number is linked to another account.",
        );
      } else {
        showToast.error("Could not save", msg);
      }
    } finally {
      setSaving(false);
    }
  }

  // Suppression: don't render while auth or the profile lookup is in
  // flight, when there's no user, when the number's already set, or on
  // routes where the modal would be actively harmful (login, callback).
  if (authLoading || checking) return null;
  if (!user || !needsNumber) return null;
  if (SKIP_ROUTES.has(pathname)) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] !max-w-md rounded-2xl p-0 overflow-hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-3">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <MessageCircle size={22} className="text-emerald-500" />
          </div>
          <DialogTitle className="text-center text-lg">
            One last thing —
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-orange-500" />
            <span>
              Get <b className="text-foreground">1 free JEE question daily</b>{" "}
              on WhatsApp
            </span>
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <ul className="text-[12px] text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>Handpicked question every morning — 60-sec solve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>Streak reminders so you never break your chain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>Reply STOP anytime to unsubscribe</span>
            </li>
          </ul>

          <div>
            <label
              htmlFor="wa-phone"
              className="text-xs font-medium text-foreground"
            >
              WhatsApp number
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-muted-foreground pointer-events-none">
                <Phone size={14} />
                +91
              </span>
              <Input
                id="wa-phone"
                type="tel"
                inputMode="numeric"
                placeholder="98123 45678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-16 h-11 rounded-xl bg-background"
                autoComplete="tel-national"
                maxLength={15}
                aria-invalid={phone && !phoneValid}
                autoFocus
              />
            </div>
            {phone && !phoneValid && (
              <p className="text-[11px] text-red-500 mt-1">
                Enter a valid 10-digit Indian mobile number.
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-0.5 rounded accent-emerald-500"
            />
            <span className="text-[11px] text-muted-foreground leading-snug">
              Yes, send me the daily question and streak reminders.
              (Uncheck if you only want the number saved for account recovery.)
            </span>
          </label>

          <Button
            onClick={save}
            disabled={!phoneValid || saving}
            className="w-full h-11 rounded-xl font-semibold gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Save number & continue"
            )}
          </Button>
          <p className="text-[10.5px] text-center text-muted-foreground">
            By continuing you agree to receive messages from RankGrind on
            WhatsApp. See{" "}
            <a
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              our privacy policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
