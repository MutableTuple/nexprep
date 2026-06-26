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

// ── Sub-components ────────────────────────────────────────────────────────────

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-white">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group flex items-center text-sm text-zinc-400 transition hover:text-white"
            >
              {link.name}
              <ChevronRight
                size={14}
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
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shrink-0">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}

function TrustCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="rounded-2xl bg-white/5 p-4 shrink-0">
        <Icon size={22} aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // JSON-LD structured data for SEO
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
      className="relative mt-40 border-t border-white/10 bg-[#090909] text-white"
      aria-label="Site footer"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Background blur */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[180px]" />
      </div>

      <div className="relative mx-auto  px-6 py-24">
        {/* ── TOP CARD ── */}
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.015] p-10 backdrop-blur-xl lg:p-14">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_3fr_1.3fr]">
            {/* Brand + features */}
            <div>
              <Link
                href="/"
                className="mb-8 flex items-center gap-4"
                aria-label="Codédex home"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shrink-0">
                  <Brain size={30} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">
                    Cod&#233;dex
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Learn. Practice. Master.
                  </p>
                </div>
              </Link>

              <p className="max-w-sm leading-8 text-zinc-400">
                India&apos;s next generation AI learning platform for JEE Main
                &amp; Advanced aspirants. Master concepts, solve questions and
                improve every single day.
              </p>

              <div className="mt-10 space-y-6">
                {features.map((item) => (
                  <Feature key={item.title} {...item} />
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <nav aria-label="Footer navigation">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <FooterColumn title="Study" links={studyLinks} />
                <FooterColumn title="Exams" links={examLinks} />
                <FooterColumn title="Resources" links={resourceLinks} />
                <FooterColumn title="Company" links={companyLinks} />
              </div>
            </nav>

            {/* Newsletter */}
            <div>
              <h3 className="text-3xl font-bold leading-tight">
                Stay Ahead.
                <br />
                Every Week.
              </h3>
              <p className="mt-5 leading-7 text-zinc-400">
                Join thousands of JEE aspirants receiving preparation tips,
                strategy guides and exam updates directly in their inbox.
              </p>

              <div className="mt-8">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="footer-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-14 pr-5 text-white placeholder:text-zinc-500 outline-none transition focus:border-white/30 focus:ring-0"
                  />
                </div>
                <button
                  type="button"
                  className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white font-semibold text-black transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Subscribe
                  <Send size={17} aria-hidden="true" />
                </button>
                <p className="mt-4 text-sm text-zinc-500">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Trust cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => (
              <TrustCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* ── SEO KEYWORDS ── */}
        <div className="mt-24">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-zinc-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Popular Searches</h2>
          </div>
          <div
            className="mt-8 flex flex-wrap gap-3"
            role="list"
            aria-label="Popular search topics"
          >
            {seoKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/${keyword.toLowerCase().replace(/\s+/g, "-")}`}
                role="listitem"
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div
          className="my-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden="true"
        />

        {/* ── BOTTOM ── */}
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Left */}
          <div>
            <h2 className="text-lg font-semibold">
              The Modern Platform for JEE Preparation
            </h2>
            <p className="mt-5 max-w-full leading-8 text-zinc-400">
              Prepare for JEE Main and JEE Advanced with AI-powered practice,
              chapter-wise questions, previous year papers, adaptive mock tests,
              revision notes, formula sheets, concept maps, personalized study
              plans and detailed performance analytics. Our goal is to make IIT
              preparation smarter, more engaging and more effective for every
              student.
            </p>
            <nav
              aria-label="Legal links"
              className="mt-10 flex flex-wrap gap-4 text-sm text-zinc-500"
            >
              <Link
                href="/privacy-policy"
                className="hover:text-white transition"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
              <Link href="/blog" className="hover:text-white transition">
                Blog
              </Link>
              <Link href="/sitemap.xml" className="hover:text-white transition">
                Sitemap
              </Link>
              <Link href="/robots.txt" className="hover:text-white transition">
                Robots
              </Link>
            </nav>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start lg:items-end">
            <div
              className="flex gap-3"
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
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/5"
                >
                  <Icon size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-8 text-sm leading-7 text-zinc-500 lg:text-right">
              <p>&copy; {currentYear} Cod&#233;dex.</p>
              <p>Built with &#10084;&#65039; for every IIT Aspirant.</p>
            </div>
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.025] p-8">
          <div className="flex items-start gap-5">
            <div className="rounded-2xl bg-white/5 p-3 shrink-0">
              <FileText size={22} aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold">Disclaimer</h3>
              <p className="mt-3 leading-8 text-zinc-500">
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
