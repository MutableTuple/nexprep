import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "JEE Chemistry Practice Questions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "Chemistry",
    title: "JEE Chemistry Questions",
    subtitle: "Chapter-wise practice with hints and step-by-step solutions",
  });
}
