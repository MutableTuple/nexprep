import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";
import { getChapterTaxonomy } from "@/app/_lib/data-service";

export const alt = "JEE Physics chapter practice questions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }) {
  const { chapter: chapterSlug } = await params;
  const chapters = await getChapterTaxonomy("Physics").catch(() => []);
  const match = chapters.find((c) => c.slug === chapterSlug);

  return brandedOgImage({
    eyebrow: "JEE Physics",
    title: match ? match.chapter : "Physics Practice Questions",
    subtitle: match
      ? `${match.count} practice question${match.count === 1 ? "" : "s"} with hints and step-by-step solutions`
      : "Chapter-wise practice with hints and step-by-step solutions",
  });
}
