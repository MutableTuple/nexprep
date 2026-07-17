const SITE_URL = "https://rankgrind.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/signup",
          "/auth/",
          "/user/*/profile/edit-profile",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
