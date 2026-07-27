const SITE_URL = "https://rankgrind.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /login, /signup, /friends, /duel, /user/*/_dashboard, and
        // /user/*/profile/edit-profile are intentionally NOT disallowed here —
        // they carry a per-page `noindex` meta tag instead. Blocking them via
        // robots.txt would stop crawlers from ever fetching the page, which
        // means they'd never see (and obey) that noindex directive.
        disallow: ["/auth/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
