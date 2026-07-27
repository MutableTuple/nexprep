import { ImageResponse } from "next/og";
import { getQuestionById } from "@/app/_lib/data-service";

export const alt = "RankGrind practice problem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DIFFICULTY_COLOR = {
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#ef4444",
};

export default async function Image({ params }) {
  const { id } = await params;
  const question = await getQuestionById(id).catch(() => null);

  const title = question?.title ?? "Practice Problem";
  const subject = question?.subject ?? "JEE";
  const chapter = question?.chapter ?? "";
  const difficulty = question?.difficulty ?? "Medium";
  const body = (question?.question ?? "").replace(/\s+/g, " ").slice(0, 160);

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

        <div style={{ display: "flex", gap: 12, marginTop: 48 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              color: "#0a0a0a",
              background: "#ffffff",
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {subject}
          </div>
          {chapter ? (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                color: "#e4e4e7",
                background: "rgba(255,255,255,0.08)",
                padding: "8px 20px",
                borderRadius: 999,
              }}
            >
              {chapter}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              color: "#0a0a0a",
              background: DIFFICULTY_COLOR[difficulty] ?? "#eab308",
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {difficulty}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 36,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {body ? (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a1a1aa",
              marginTop: 24,
              maxWidth: 980,
              lineHeight: 1.4,
            }}
          >
            {body}
            {body.length >= 160 ? "…" : ""}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
