import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "BITSAT Practice Questions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "Practice",
    title: "BITSAT Questions",
    subtitle: "Physics, Chemistry and Maths with hints and step-by-step solutions",
  });
}
