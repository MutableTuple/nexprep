// app/api/cron/weekly-stats/route.js
//
// Triggered once a week by Vercel Cron (see vercel.json). Sends every
// user a recap: questions solved, accuracy, XP earned, and current streak
// over the trailing 7 days.
import { NextResponse } from "next/server";
import { sendWeeklyStatsEmail } from "@/app/_lib/email";
import { listAllUsers, fetchInChunks, chunk } from "@/app/_lib/cron-helpers";

const SITE_URL = "https://rankgrind.com";
const LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000;
const SEND_CHUNK_SIZE = 10; // keep Resend request bursts small
const SEND_CHUNK_DELAY_MS = 500;

function formatDateRange(since, until) {
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(since)} – ${fmt(until)}`;
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const since = new Date(now.getTime() - LOOKBACK_MS);
  const dateRangeLabel = formatDateRange(since, now);

  const authUsers = await listAllUsers();
  const allRecipients = authUsers
    .filter((u) => !!u.email)
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name ?? "there",
    }));

  if (allRecipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 });
  }

  // Same email_notifications gate the daily digest respects.
  const prefRows = await fetchInChunks(
    "user_preferences",
    "user_id",
    allRecipients.map((r) => r.id),
    "user_id, email_notifications",
  );
  const optedOutIds = new Set(
    prefRows
      .filter((p) => p.email_notifications === false)
      .map((p) => p.user_id),
  );
  const recipients = allRecipients.filter((r) => !optedOutIds.has(r.id));

  if (recipients.length === 0) {
    return NextResponse.json({
      sent: 0,
      failed: 0,
      total: allRecipients.length,
      optedOut: optedOutIds.size,
    });
  }

  const ids = recipients.map((r) => r.id);

  const [solvedRows, statsRows] = await Promise.all([
    fetchInChunks(
      "solved_questions",
      "user_id",
      ids,
      "user_id, is_correct, xp_earned, time_taken, solved_at",
    ).then((rows) => rows.filter((r) => r.solved_at >= since.toISOString())),
    fetchInChunks("user_stats", "user_id", ids, "user_id, streak"),
  ]);

  const streakByUser = new Map(
    statsRows.map((s) => [s.user_id, s.streak ?? 0]),
  );

  // Per-user weekly aggregates — time_taken is null for inline-card solves
  // (no timer there), so timedCount tracks how many rows actually had a
  // duration, letting the email hide the time stat rather than lowball it.
  const statsByUser = new Map();
  for (const row of solvedRows) {
    const entry = statsByUser.get(row.user_id) ?? {
      solved: 0,
      correct: 0,
      xp: 0,
      timeSeconds: 0,
      timedCount: 0,
    };
    entry.solved += 1;
    if (row.is_correct) entry.correct += 1;
    entry.xp += row.xp_earned ?? 0;
    if (row.time_taken != null) {
      entry.timeSeconds += row.time_taken;
      entry.timedCount += 1;
    }
    statsByUser.set(row.user_id, entry);
  }

  let sent = 0;
  let failed = 0;

  for (const batch of chunk(recipients, SEND_CHUNK_SIZE)) {
    const results = await Promise.allSettled(
      batch.map((r) => {
        const s = statsByUser.get(r.id) ?? {
          solved: 0,
          correct: 0,
          xp: 0,
          timeSeconds: 0,
          timedCount: 0,
        };
        return sendWeeklyStatsEmail(r.email, {
          userName: r.name,
          dateRangeLabel,
          questionsSolved: s.solved,
          accuracyPct:
            s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : null,
          xpEarned: s.xp,
          currentStreak: streakByUser.get(r.id) ?? 0,
          timeSpentMinutes:
            s.timedCount > 0 ? Math.round(s.timeSeconds / 60) : null,
          problemsUrl: `${SITE_URL}/problems`,
        });
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled") sent += 1;
      else {
        failed += 1;
        console.error("Weekly stats send failed:", result.reason);
      }
    }

    if (batch.length === SEND_CHUNK_SIZE) {
      await new Promise((res) => setTimeout(res, SEND_CHUNK_DELAY_MS));
    }
  }

  return NextResponse.json({
    sent,
    failed,
    total: allRecipients.length,
    optedOut: optedOutIds.size,
  });
}
