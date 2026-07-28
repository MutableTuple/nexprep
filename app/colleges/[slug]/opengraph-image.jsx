import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";
import { getCutoffCollege, QUOTA_LABEL } from "@/app/_lib/cutoffs";

export const alt = "JoSAA cutoff ranks";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }) {
  const { slug } = await params;
  const college = getCutoffCollege(slug);

  if (!college) {
    return brandedOgImage({
      eyebrow: "Cutoffs",
      title: "JoSAA Opening & Closing Ranks",
      subtitle: "Official final-round seat allotment data",
    });
  }

  const latestYear = college.years.at(-1);
  const top = college.programs.find((p) => p.trend?.[latestYear]?.[1] != null);
  const quota = QUOTA_LABEL[college.quota] ?? college.quota;

  return brandedOgImage({
    eyebrow: `${college.type} · ${quota} quota`,
    title: `${college.name} Cutoffs`,
    subtitle: top
      ? `${top.branch} closed at ${top.trend[latestYear][1].toLocaleString(
          "en-IN",
        )} in ${latestYear} · ${college.programs.length} branches, ${
          college.years.length
        } years of JoSAA data`
      : `JoSAA closing ranks ${college.years[0]}–${latestYear}`,
  });
}
