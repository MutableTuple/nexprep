import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "Contact RankGrind";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "",
    title: "Contact RankGrind",
    subtitle: "Questions, feedback or partnership enquiries",
  });
}
