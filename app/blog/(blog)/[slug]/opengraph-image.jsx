import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/app/_data/posts";

export const alt = "RankGrind Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "RankGrind Blog";
  const category = post?.category ?? "RankGrind Blog";
  const author = post?.author ?? "Rank Grind Team";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #18181b 60%, #0a0a0a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            R
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
            rankgrind.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#0a0a0a",
            background: "#ffffff",
            padding: "8px 20px",
            borderRadius: 999,
            marginTop: 48,
            alignSelf: "flex-start",
          }}
        >
          {category}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 32,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#a1a1aa",
            marginTop: "auto",
          }}
        >
          By {author}
        </div>
      </div>
    ),
    { ...size },
  );
}
