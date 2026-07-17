import { getAllQuestionIds } from "@/app/_lib/data-service";
import { getAllPosts } from "@/app/_data/posts";

const SITE_URL = "https://rankgrind.com";

const STATIC_ROUTES = [
  { route: "", changeFrequency: "daily", priority: 1 },
  { route: "/problems", changeFrequency: "daily", priority: 0.9 },
  { route: "/physics", changeFrequency: "weekly", priority: 0.8 },
  { route: "/chemistry", changeFrequency: "weekly", priority: 0.8 },
  { route: "/maths", changeFrequency: "weekly", priority: 0.8 },
  { route: "/leaderboard", changeFrequency: "daily", priority: 0.6 },
  { route: "/mock-tests", changeFrequency: "weekly", priority: 0.5 },
  { route: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { route: "/question-of-the-day", changeFrequency: "daily", priority: 0.8 },
];

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(
    ({ route, changeFrequency, priority }) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  let questionEntries = [];
  try {
    const ids = await getAllQuestionIds();
    questionEntries = ids.map(({ id, problemname }) => ({
      url: `${SITE_URL}/problems/solve/${problemname}/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Failed to build question sitemap entries:", err);
  }

  const blogEntries = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...questionEntries, ...blogEntries];
}
