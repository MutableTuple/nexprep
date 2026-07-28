import {
  brandedOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/app/_lib/og-image";

export const alt = "JEE College Predictor";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return brandedOgImage({
    eyebrow: "Free tool",
    title: "JEE College Predictor",
    subtitle: "Match your rank against official JoSAA closing ranks for IITs, NITs, IIITs and GFTIs",
  });
}
