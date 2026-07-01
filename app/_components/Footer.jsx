"use client";

import Link from "next/link";
import {
  Atom,
  Brain,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  Lock,
  Mail,
  Send,
  Shield,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// ─── Data ─────────────────────────────────────────────────────────────────────

const studyLinks = [
  { name: "Physics", href: "/physics" },
  { name: "Chemistry", href: "/chemistry" },
  { name: "Mathematics", href: "/mathematics" },
  { name: "NCERT Notes", href: "/ncert-notes" },
  { name: "Formula Sheets", href: "/formula-sheets" },
  { name: "Concept Maps", href: "/concept-maps" },
  { name: "Revision Notes", href: "/revision-notes" },
];

const examLinks = [
  { name: "JEE Main", href: "/jee-main" },
  { name: "JEE Advanced", href: "/jee-advanced" },
  { name: "Question Bank", href: "/question-bank" },
  { name: "Mock Tests", href: "/mock-tests" },
  { name: "Previous Year Papers", href: "/previous-year-papers" },
  { name: "Chapter Tests", href: "/chapter-tests" },
  { name: "Full Tests", href: "/full-tests" },
];

const resourceLinks = [
  { name: "Study Planner", href: "/study-planner" },
  { name: "AI Doubt Solver", href: "/doubt-solving" },
  { name: "Blog", href: "/blog" },
  { name: "Rank Predictor", href: "/rank-predictor" },
  { name: "College Predictor", href: "/college-predictor" },
  { name: "Cutoff Trends", href: "/cutoff-trends" },
  { name: "Exam Calendar", href: "/exam-calendar" },
];

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Sitemap", href: "/sitemap.xml" },
];

const seoKeywords = [
  "JEE Main 2026",
  "JEE Advanced",
  "JEE PYQs",
  "Physics Questions",
  "Chemistry Questions",
  "Maths Questions",
  "Mock Test",
  "NCERT Solutions",
  "Chapter Wise Tests",
  "Question Bank",
  "Study Planner",
  "JEE Preparation",
  "Formula Sheets",
  "JEE Notes",
  "College Predictor",
  "Rank Predictor",
];

const features = [
  {
    icon: Brain,
    title: "Personalized Learning",
    desc: "Adaptive AI that understands your strengths & weaknesses.",
  },
  {
    icon: Target,
    title: "Concept Mastery",
    desc: "Learn concepts instead of memorizing formulas.",
  },
  {
    icon: Zap,
    title: "Smart Practice",
    desc: "Thousands of AI-powered practice questions.",
  },
  {
    icon: Trophy,
    title: "Daily Challenges",
    desc: "Build consistency through XP, streaks and rewards.",
  },
];

const trustCards = [
  {
    icon: GraduationCap,
    title: "Built for JEE",
    desc: "Every feature is designed specifically for IIT aspirants.",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    desc: "Fast, reliable and designed for long study sessions.",
  },
  {
    icon: Atom,
    title: "AI Powered",
    desc: "Personalized recommendations for every student.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Your progress and data always stay secure.",
  },
];

const socials = [
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaXTwitter, href: "#", label: "X (Twitter)" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
  { name: "Sitemap", href: "/sitemap.xml" },
  { name: "Robots", href: "/robots.txt" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 sm:mb-6 text-sm sm:text-base font-semibold text-white">
        {title}
      </h3>
      <ul className="space-y-3 sm:space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group flex items-center text-xs sm:text-sm text-zinc-400 transition hover:text-white"
            >
              {link.name}
              <ChevronRight
                size={12}
                className="ml-1 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 shrink-0">
        <Icon size={16} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
          {desc}
        </p>
      </div>
    </div>
  );
}

function TrustCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="rounded-xl sm:rounded-2xl bg-white/5 p-3 sm:p-4 shrink-0">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
          {desc}
        </p>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Codédex",
    description:
      "India's next generation AI learning platform for JEE Main & Advanced aspirants.",
    url: "https://codedex.in",
    sameAs: [
      "https://youtube.com/@codedex",
      "https://instagram.com/codedex",
      "https://twitter.com/codedex",
      "https://linkedin.com/company/codedex",
    ],
    knowsAbout: [
      "JEE Main",
      "JEE Advanced",
      "IIT Preparation",
      "Physics",
      "Chemistry",
      "Mathematics",
    ],
  };

  return (
    <footer
      className="relative mt-16 sm:mt-24 lg:mt-40 border-t border-white/10 bg-[#090909] text-white"
      aria-label="Site footer"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Subtle bg glow — no large blur on mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* ── TOP CARD ── */}
        <div className="rounded-2xl sm:rounded-3xl lg:rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-5 sm:p-8 lg:p-14 backdrop-blur-xl">
          {/* Brand + Nav + Newsletter */}
          <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.2fr_2.5fr_1.3fr]">
            {/* Brand + features */}
            <div>
              <Link
                href="/"
                className="mb-6 sm:mb-8 flex items-center gap-3"
                aria-label="Codédex home"
              >
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white text-black shrink-0">
                  <Brain size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold leading-none">
                    Cod&#233;dex
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Learn. Practice. Master.
                  </p>
                </div>
              </Link>

              <p className="text-sm sm:text-base leading-7 sm:leading-8 text-zinc-400">
                India&apos;s next generation AI learning platform for JEE Main
                &amp; Advanced aspirants.
              </p>

              <div className="mt-7 sm:mt-10 space-y-4 sm:space-y-6">
                {features.map((item) => (
                  <Feature key={item.title} {...item} />
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <nav aria-label="Footer navigation">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-10">
                <FooterColumn title="Study" links={studyLinks} />
                <FooterColumn title="Exams" links={examLinks} />
                <FooterColumn title="Resources" links={resourceLinks} />
                <FooterColumn title="Company" links={companyLinks} />
              </div>
            </nav>

            {/* Newsletter */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                Stay Ahead.
                <br />
                Every Week.
              </h3>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-7 text-zinc-400">
                Join thousands of JEE aspirants receiving preparation tips and
                exam updates.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-10"
                    aria-hidden
                  />
                  <Input
                    id="footer-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="h-12 sm:h-14 pl-11 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:ring-0 rounded-xl sm:rounded-2xl"
                  />
                </div>

                <Button
                  type="button"
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-white text-black hover:bg-zinc-100 font-semibold gap-2 text-sm sm:text-base"
                >
                  Subscribe
                  <Send size={15} aria-hidden />
                </Button>

                <p className="text-xs text-zinc-500">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Trust cards */}
          <div className="mt-10 sm:mt-16 grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => (
              <TrustCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* ── SEO Keywords ── */}
        <div className="mt-12 sm:mt-16 lg:mt-24">
          <div className="flex items-center gap-2 sm:gap-3">
            <Compass size={16} className="text-zinc-400 shrink-0" aria-hidden />
            <h2 className="text-base sm:text-lg font-semibold">
              Popular Searches
            </h2>
          </div>
          <div
            className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3"
            role="list"
            aria-label="Popular search topics"
          >
            {seoKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/${keyword.toLowerCase().replace(/\s+/g, "-")}`}
                role="listitem"
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="my-10 sm:my-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden
        />

        {/* ── Bottom ── */}
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
              The Modern Platform for JEE Preparation
            </h2>
            <p className="mt-3 sm:mt-5 text-sm leading-7 sm:leading-8 text-zinc-400">
              Prepare for JEE Main and JEE Advanced with AI-powered practice,
              chapter-wise questions, previous year papers, adaptive mock tests,
              revision notes, formula sheets, concept maps, personalized study
              plans and detailed performance analytics.
            </p>
            <nav
              aria-label="Legal links"
              className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500"
            >
              {legalLinks.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="hover:text-white transition"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-6 sm:gap-8">
            <div
              className="flex gap-2 sm:gap-3"
              role="list"
              aria-label="Social media links"
            >
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  role="listitem"
                  aria-label={label}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/5"
                >
                  <Icon size={16} aria-hidden />
                </Link>
              ))}
            </div>
            <div className="text-xs sm:text-sm leading-6 sm:leading-7 text-zinc-500 lg:text-right">
              <p>&copy; {currentYear} Cod&#233;dex.</p>
              <p>Built with &#10084;&#65039; for every IIT Aspirant.</p>
            </div>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="mt-10 sm:mt-16 lg:mt-20 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-5">
            <div className="rounded-xl sm:rounded-2xl bg-white/5 p-2.5 sm:p-3 shrink-0">
              <FileText size={18} aria-hidden />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Disclaimer</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-8 text-zinc-500">
                Cod&#233;dex is an independent educational platform created to
                help students prepare for engineering entrance examinations. We
                are not affiliated with IIT, NTA, JoSAA, CBSE or any government
                organization. All trademarks belong to their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
