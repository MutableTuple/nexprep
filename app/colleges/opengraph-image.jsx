import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "Engineering Colleges in India";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "Reference",
    title: "Engineering Colleges in India",
    subtitle: "JoSAA opening and closing ranks for 97 institutes, branch by branch",
  });
}
