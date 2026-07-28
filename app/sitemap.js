import { getAllQuestionIds, getChapterTaxonomy } from "@/app/_lib/data-service";
import { getAllPosts } from "@/app/_data/posts";
import { getAllCutoffColleges } from "@/app/_lib/cutoffs";

const CHAPTER_SUBJECTS = [
  { subject: "Physics", slug: "physics" },
  { subject: "Chemistry", slug: "chemistry" },
  { subject: "Mathematics", slug: "maths" },
];

const SITE_URL = "https://rankgrind.com";

const STATIC_ROUTES = [
  { route: "", changeFrequency: "daily", priority: 1 },
  { route: "/problems", changeFrequency: "daily", priority: 0.9 },
  { route: "/physics", changeFrequency: "weekly", priority: 0.8 },
  { route: "/chemistry", changeFrequency: "weekly", priority: 0.8 },
  { route: "/maths", changeFrequency: "weekly", priority: 0.8 },
  { route: "/jee-main", changeFrequency: "weekly", priority: 0.8 },
  { route: "/jee-advanced", changeFrequency: "weekly", priority: 0.8 },
  { route: "/bitsat", changeFrequency: "weekly", priority: 0.7 },
  { route: "/leaderboard", changeFrequency: "daily", priority: 0.6 },
  { route: "/mock-tests", changeFrequency: "weekly", priority: 0.5 },
  { route: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { route: "/colleges", changeFrequency: "monthly", priority: 0.7 },
  { route: "/college-predictor", changeFrequency: "monthly", priority: 0.8 },
  { route: "/about", changeFrequency: "monthly", priority: 0.4 },
  { route: "/contact", changeFrequency: "monthly", priority: 0.3 },
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

  let chapterEntries = [];
  try {
    const chaptersBySubject = await Promise.all(
      CHAPTER_SUBJECTS.map(({ subject }) => getChapterTaxonomy(subject)),
    );
    chapterEntries = chaptersBySubject.flatMap((chapters, i) =>
      chapters.map((c) => ({
        url: `${SITE_URL}/${CHAPTER_SUBJECTS[i].slug}/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    );
  } catch (err) {
    console.error("Failed to build chapter sitemap entries:", err);
  }

  const collegeEntries = getAllCutoffColleges().map((c) => ({
    url: `${SITE_URL}/colleges/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...questionEntries,
    ...blogEntries,
    ...chapterEntries,
    ...collegeEntries,
  ];
}
