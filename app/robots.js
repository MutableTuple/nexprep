const SITE_URL = "https://rankgrind.com";

// Crawlers that fetch pages in order to CITE them in AI answers (ChatGPT
// Search, Perplexity, Claude, Google's AI surfaces). Allowing these is the
// point of GEO — block them and the site simply cannot appear as a source.
// Note these are distinct from pure training crawlers; this list is the
// citation/retrieval set, which is the one that drives referral traffic.
const AI_ANSWER_CRAWLERS = [
  "OAI-SearchBot", // ChatGPT Search citations
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "PerplexityBot", // Perplexity citations
  "Perplexity-User",
  "Claude-User", // Claude browsing on a user's behalf
  "Claude-SearchBot",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended",
  "CCBot", // Common Crawl — feeds many downstream models
  "GPTBot",
  "ClaudeBot",
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /login, /signup, /friends, /duel, /user/*/_dashboard and
        // /user/*/profile/edit-profile are intentionally NOT disallowed here —
        // they carry a per-page `noindex` meta tag instead. Blocking them via
        // robots.txt would stop crawlers from ever fetching the page, which
        // means they'd never see (and obey) that noindex directive.
        disallow: ["/auth/", "/api/"],
      },
      {
        userAgent: AI_ANSWER_CRAWLERS,
        allow: "/",
        disallow: ["/auth/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
