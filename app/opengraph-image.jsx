import { ImageResponse } from "next/og";

export const alt =
  "rankgrind.com — India's Most Gamified JEE Preparation Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #18181b 60%, #0a0a0a 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
            color: "#0a0a0a",
          }}
        >
          R
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
          rankgrind.com
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 900,
        }}
      >
        Crack JEE with Daily Practice &amp; XP
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#a1a1aa",
          marginTop: 28,
          textAlign: "center",
        }}
      >
        Physics · Chemistry · Maths — AI-powered practice, streaks &amp;
        leaderboards
      </div>
    </div>,
    { ...size },
  );
}
