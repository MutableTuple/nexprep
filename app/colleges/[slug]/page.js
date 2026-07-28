import { notFound } from "next/navigation";
import CollegeCutoffPage from "@/app/_components/Colleges/CollegeCutoffPage";
import {
  getAllCutoffColleges,
  getCutoffCollege,
  QUOTA_LABEL,
} from "@/app/_lib/cutoffs";

export function generateStaticParams() {
  return getAllCutoffColleges().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const college = getCutoffCollege(slug);
  if (!college) return {};

  const firstYear = college.years[0];
  const latestYear = college.years.at(-1);
  const top = college.programs[0];

  const title = `${college.name} Cutoff ${latestYear} — JoSAA Opening & Closing Ranks`;
  const description = top
    ? `${college.name} JoSAA closing ranks ${firstYear}–${latestYear} across ${college.programs.length} branches. ${top.branch} closed at ${top.trend[latestYear]?.[1]?.toLocaleString("en-IN") ?? "—"} in ${latestYear} (${QUOTA_LABEL[college.quota] ?? college.quota}, Open).`
    : `${college.name} JoSAA opening and closing ranks, ${firstYear}–${latestYear}.`;

  return {
    title,
    description,
    keywords: [
      `${college.name} cutoff`,
      `${college.name} closing rank`,
      `${college.name} JoSAA cutoff`,
      `${college.name} ${latestYear} cutoff`,
      "JoSAA opening closing rank",
    ],
    alternates: { canonical: `/colleges/${slug}` },
    openGraph: { title, description, url: `/colleges/${slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const college = getCutoffCollege(slug);
  if (!college) notFound();

  const latestYear = college.years.at(-1);
  const url = `https://rankgrind.com/colleges/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${college.name} JoSAA opening and closing ranks (${college.years[0]}–${latestYear})`,
    description: `Final-round JoSAA seat allotment opening and closing ranks for ${college.fullName}, covering ${college.programs.length} academic programs from ${college.years[0]} to ${latestYear}.`,
    url,
    temporalCoverage: `${college.years[0]}/${latestYear}`,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "Joint Seat Allocation Authority (JoSAA)",
      url: "https://josaa.nic.in",
    },
    publisher: {
      "@type": "Organization",
      name: "RankGrind",
      url: "https://rankgrind.com",
    },
    about: {
      "@type": "CollegeOrUniversity",
      name: college.fullName,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rankgrind.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Colleges",
        item: "https://rankgrind.com/colleges",
      },
      { "@type": "ListItem", position: 3, name: college.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CollegeCutoffPage college={college} />
    </>
  );
}
