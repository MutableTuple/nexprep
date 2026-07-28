import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "About RankGrind";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "",
    title: "About RankGrind",
    subtitle: "India's gamified JEE preparation platform",
  });
}
