"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building2,
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  MailCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { showToast } from "../_lib/toast";
import { supabase } from "../_lib/supabase";
import {
  isUsernameAvailable,
  upsertProfileDetails,
} from "../_lib/data-service";

const EXAM_SUGGESTIONS = [
  "JEE Main",
  "JEE Advanced",
  "BITSAT",
  "VITEEE",
  "COMEDK UGET",
  "MHT CET",
  "KCET",
  "WBJEE",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: 2050 - CURRENT_YEAR + 1 },
  (_, i) => CURRENT_YEAR + i,
);

// ─── Password Rules ────────────────────────────────────────────────────────────

const RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
];

function slugifyUsername(name) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20) || "user"
  );
}

async function generateAvailableUsername(name) {
  const base = slugifyUsername(name);

  if (await isUsernameAvailable(base)) return base;

  for (let i = 0; i < 5; i++) {
    const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    if (await isUsernameAvailable(candidate)) return candidate;
  }

  // guaranteed-unique last resort if 5 random attempts all collided
  return `${base}${Date.now().toString(36).slice(-6)}`;
}

// generates a few real, availability-checked options instead of one guess
async function generateUsernameSuggestions(name, count = 3) {
  const base = slugifyUsername(name);
  const candidates = [
    base,
    `${base}${Math.floor(10 + Math.random() * 90)}`,
    `${base}_${Math.floor(1 + Math.random() * 9)}`,
  ];

  const available = [];
  for (const candidate of candidates) {
    if (available.length >= count) break;
    if (await isUsernameAvailable(candidate)) available.push(candidate);
  }

  let attempts = 0;
  while (available.length < count && attempts < 5) {
    const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    if (
      !available.includes(candidate) &&
      (await isUsernameAvailable(candidate))
    ) {
      available.push(candidate);
    }
    attempts++;
  }

  if (available.length === 0) {
    available.push(`${base}${Date.now().toString(36).slice(-6)}`);
  }

  return available;
}

// ─── Google Icon ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── PasswordStrength ──────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  if (!password) return null;
  const passed = RULES.filter((r) => r.test(password)).length;

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passed
                ? passed === 1
                  ? "bg-red-500"
                  : passed === 2
                    ? "bg-amber-500"
                    : "bg-green-500"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-1.5">
              {ok ? (
                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
              ) : (
                <XCircle size={12} className="text-muted-foreground shrink-0" />
              )}
              <span
                className={`text-[11px] ${ok ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SignupPage ────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [examTarget, setExamTarget] = useState("");
  const [examYear, setExamYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (!name.trim()) {
      setSuggestions([]);
      setSelectedUsername("");
      return;
    }

    let cancelled = false;
    setCheckingUsername(true);

    const timeout = setTimeout(async () => {
      try {
        const options = await generateUsernameSuggestions(name);
        if (cancelled) return;
        setSuggestions(options);
        setSelectedUsername(options[0]);
      } catch (err) {
        console.error("Username check failed:", err);
        if (!cancelled) {
          const fallback = slugifyUsername(name);
          setSuggestions([fallback]);
          setSelectedUsername(fallback);
        }
      } finally {
        if (!cancelled) setCheckingUsername(false);
      }
    }, 500); // debounce so we're not hitting the DB on every keystroke

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [name]);

  const allRulesPassed = RULES.every((r) => r.test(password));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast.error("Missing fields", "Please fill in all fields.");
      return;
    }
    if (!allRulesPassed) {
      showToast.error(
        "Weak password",
        "Please meet all password requirements.",
      );
      return;
    }
    setLoading(true);

    // reuse whatever was already checked/picked; only regenerate if the
    // debounce genuinely hasn't resolved yet (submitted within ~500ms)
    const username =
      selectedUsername || (await generateAvailableUsername(name));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      showToast.error("Signup failed", error.message);
      return;
    }

    // email confirmation disabled in Supabase → session comes back immediately
    if (data.session) {
      try {
        await upsertProfileDetails(data.user.id, {
          college: college.trim() || null,
          exam: examTarget || null,
          target_year: examYear ? parseInt(examYear, 10) : null,
        });
      } catch (err) {
        // don't block account creation over this — they can fill it in
        // later from their profile if it fails to save here
        console.error("Failed to save signup profile details:", err);
      }

      showToast.success(
        "Account created!",
        "Welcome to Rank Grind. Let's start solving.",
      );
      router.push("/problems");
      router.refresh();
      return;
    }

    setSentTo(email);
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setGoogleLoading(false);
      showToast.error("Google signup failed", error.message);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Brain size={20} />
            </div>
            <span className="text-xl tracking-tight">Rank Grind</span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 font-semibold"
            >
              BETA
            </Badge>
          </Link>
          {!sentTo && (
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Join thousands of JEE aspirants on Rank Grind
              </p>
            </div>
          )}
        </div>

        {sentTo ? (
          <Card className="bg-card border-border shadow-none rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MailCheck size={22} className="text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <strong>{sentTo}</strong>. Click
                it to activate your account, then log in.
              </p>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full rounded-xl mt-2">
                  Back to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Card */}
            <Card className="bg-card border-border shadow-none rounded-2xl">
              <CardContent className="p-6 flex flex-col gap-5">
                {/* Google */}
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl h-11 font-medium"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                  type="button"
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Arjun Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-11 rounded-xl bg-background"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Username suggestions */}
                  {name && (
                    <div className="flex flex-col gap-1.5 -mt-1">
                      <span className="text-[11px] text-muted-foreground pl-1">
                        {checkingUsername
                          ? "Finding available usernames..."
                          : "Pick a username"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {checkingUsername
                          ? Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-7 w-24 rounded-full bg-muted animate-pulse"
                              />
                            ))
                          : suggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setSelectedUsername(s)}
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                                  selectedUsername === s
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground",
                                )}
                              >
                                @{s}
                              </button>
                            ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground pl-1">
                        You can change this later in your profile.
                      </p>
                    </div>
                  )}

                  {/* College */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="college" className="text-sm font-medium">
                      College Name
                    </Label>
                    <div className="relative">
                      <Building2
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        id="college"
                        type="text"
                        placeholder="e.g. Delhi Public School"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="pl-9 h-11 rounded-xl bg-background"
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  {/* Target exam + exam year */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium flex items-center gap-1.5">
                        <Trophy size={13} className="text-muted-foreground" />
                        Target Exam
                      </Label>
                      <Select value={examTarget} onValueChange={setExamTarget}>
                        <SelectTrigger className="h-11 rounded-xl bg-background w-full">
                          <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXAM_SUGGESTIONS.map((exam) => (
                            <SelectItem key={exam} value={exam}>
                              {exam}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium flex items-center gap-1.5">
                        <Calendar size={13} className="text-muted-foreground" />
                        Exam Year
                      </Label>
                      <Select value={examYear} onValueChange={setExamYear}>
                        <SelectTrigger className="h-11 rounded-xl bg-background w-full">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {YEAR_OPTIONS.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-11 rounded-xl bg-background"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-10 h-11 rounded-xl bg-background"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    <PasswordStrength password={password} />
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By signing up you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-foreground font-medium hover:underline underline-offset-4"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-foreground font-medium hover:underline underline-offset-4"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl font-semibold gap-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Create account
                        <ArrowRight size={15} />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground hover:underline underline-offset-4 transition-colors"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
