import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared branded OG image.
 *
 * Needed because Next.js metadata is shallow-merged: a page that defines its
 * own `openGraph` object REPLACES the root layout's, discarding the inherited
 * opengraph-image. A file-convention image co-located with the route survives
 * that, so each segment with custom openGraph metadata gets a thin
 * opengraph-image.jsx that calls this.
 */
export function brandedOgImage({ eyebrow, title, subtitle, accent = "#ffffff" }) {
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

        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              color: "#0a0a0a",
              background: accent,
              padding: "8px 20px",
              borderRadius: 999,
              marginTop: 48,
              alignSelf: "flex-start",
            }}
          >
            {eyebrow}
          </div>
        ) : (
          <div style={{ display: "flex", marginTop: 48 }} />
        )}

        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.15,
            marginTop: 28,
            maxWidth: 1020,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a1a1aa",
              marginTop: "auto",
              maxWidth: 1020,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    ),
    { ...OG_SIZE },
  );
}
