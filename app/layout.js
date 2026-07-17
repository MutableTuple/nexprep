// app/layout.jsx
import { Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./_components/Footer";
import MainToast from "./_components/Toasts/MainToast";
import "katex/dist/katex.min.css";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
import { AuthProvider } from "./_lib/AuthProvider";
import { createClient } from "./_lib/supabase-server";
import Navbar from "./_components/Navbar";

const SITE_URL = "https://rankgrind.com";
const SITE_NAME = "rankgrind.com";
const SITE_TITLE =
  "rankgrind.com — India's Most Gamified JEE Preparation Platform";
const SITE_DESCRIPTION =
  "Prepare for JEE Main & Advanced with AI-powered practice questions, chapter-wise tests, previous year papers, mock tests, and gamified XP & streak tracking.";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | rankgrind.com",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "JEE Main",
    "JEE Advanced",
    "JEE preparation",
    "JEE Physics questions",
    "JEE Chemistry questions",
    "JEE Maths questions",
    "JEE mock test",
    "IIT JEE practice",
    "JEE question bank",
    "JEE previous year papers",
  ],
  authors: [{ name: "rankgrind.com" }],
  creator: "rankgrind.com",
  publisher: "rankgrind.com",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // image comes from app/opengraph-image.jsx (Next.js picks it up
    // automatically) — no need to list a static file here
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/site.webmanifest",
  // TODO: add your Google Search Console property for this domain and
  // paste the real verification code it gives you, e.g.:
  // verification: { google: "abc123..." },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/problems?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider initialUser={user}>
          <Providers>
            <Navbar />
            {children} <MainToast />
          </Providers>
        </AuthProvider>
        <Footer />
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
