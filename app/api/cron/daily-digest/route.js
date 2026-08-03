// app/api/cron/daily-digest/route.js
//
// Triggered once a day by Vercel Cron (see vercel.json). Builds and sends
// the combined daily-digest email to every registered user: today's
// question, streak status, pending/recent duels, and friend activity.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase-admin";
import { getQuestionOfTheDay } from "@/app/_lib/data-service";
import { sendDailyDigestEmail } from "@/app/_lib/email";

const SITE_URL = "https://rankgrind.com";
const LOOKBACK_MS = 24 * 60 * 60 * 1000; // rolling 24h window, not calendar-day —
// simpler than timezone-bucketing a once-a-day cron across an IST userbase.
const SEND_CHUNK_SIZE = 10; // keep Resend request bursts small
const SEND_CHUNK_DELAY_MS = 500;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function listAllUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return users;
}

async function fetchInChunks(table, column, ids, select) {
  const rows = [];
  for (const idChunk of chunk(ids, 200)) {
    if (idChunk.length === 0) continue;
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .in(column, idChunk);
    if (error) throw error;
    rows.push(...(data ?? []));
  }
  return rows;
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - LOOKBACK_MS).toISOString();

  const [question, authUsers] = await Promise.all([
    getQuestionOfTheDay(),
    listAllUsers(),
  ]);

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

  const prefRows = await fetchInChunks(
    "user_preferences",
    "user_id",
    allRecipients.map((r) => r.id),
    "user_id, email_notifications",
  );
  // No row for a user means they've never touched the setting — the column
  // default is true, so absence must mean "send", not "opted out".
  const optedOutIds = new Set(
    prefRows.filter((p) => p.email_notifications === false).map((p) => p.user_id),
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

  const [
    statsRows,
    solvedRows,
    invitesRaw,
    resultsRaw,
    friendReqRaw,
    followRows,
  ] = await Promise.all([
    fetchInChunks("user_stats", "user_id", ids, "user_id, streak"),
    fetchInChunks(
      "solved_questions",
      "user_id",
      ids,
      "user_id, solved_at",
    ).then((rows) => rows.filter((r) => r.solved_at >= since)),
    fetchInChunks(
      "duels",
      "player2_id",
      ids,
      "id, player1_id, player2_id, status",
    ).then((rows) => rows.filter((r) => r.status === "waiting")),
    Promise.all([
      fetchInChunks(
        "duels",
        "player1_id",
        ids,
        "id, player1_id, player2_id, status, winner_id, ended_at",
      ),
      fetchInChunks(
        "duels",
        "player2_id",
        ids,
        "id, player1_id, player2_id, status, winner_id, ended_at",
      ),
    ]).then(([asP1, asP2]) => {
      const seen = new Map();
      for (const d of [...asP1, ...asP2]) {
        if (d.status === "completed" && d.ended_at >= since) {
          seen.set(d.id, d);
        }
      }
      return [...seen.values()];
    }),
    fetchInChunks(
      "friendships",
      "receiver_id",
      ids,
      "id, sender_id, receiver_id, status, created_at",
    ).then((rows) =>
      rows.filter((r) => r.status === "pending" && r.created_at >= since),
    ),
    fetchInChunks(
      "follows",
      "followed_id",
      ids,
      "followed_id, created_at",
    ).then((rows) => rows.filter((r) => r.created_at >= since)),
  ]);

  // Batch-resolve display names for everyone referenced as an "other party"
  // (duel opponents, friend-request senders) in a single profiles query.
  const otherPartyIds = new Set();
  for (const d of invitesRaw) otherPartyIds.add(d.player1_id);
  for (const d of resultsRaw) {
    otherPartyIds.add(d.player1_id);
    otherPartyIds.add(d.player2_id);
  }
  for (const f of friendReqRaw) otherPartyIds.add(f.sender_id);

  const profileRows = await fetchInChunks(
    "profiles",
    "id",
    [...otherPartyIds],
    "id, display_name, username",
  );
  const nameById = new Map(
    profileRows.map((p) => [p.id, p.display_name || p.username || "Someone"]),
  );

  const streakByUser = new Map(statsRows.map((s) => [s.user_id, s.streak ?? 0]));
  const solvedTodaySet = new Set(solvedRows.map((r) => r.user_id));

  const invitesByUser = new Map();
  for (const d of invitesRaw) {
    const list = invitesByUser.get(d.player2_id) ?? [];
    list.push({ id: d.id, opponentName: nameById.get(d.player1_id) ?? "Someone" });
    invitesByUser.set(d.player2_id, list);
  }

  const resultsByUser = new Map();
  for (const d of resultsRaw) {
    for (const [selfId, oppId] of [
      [d.player1_id, d.player2_id],
      [d.player2_id, d.player1_id],
    ]) {
      if (!ids.includes(selfId)) continue;
      const outcome = !d.winner_id ? "tied" : d.winner_id === selfId ? "won" : "lost";
      const list = resultsByUser.get(selfId) ?? [];
      list.push({ opponentName: nameById.get(oppId) ?? "Someone", outcome });
      resultsByUser.set(selfId, list);
    }
  }

  const friendReqByUser = new Map();
  for (const f of friendReqRaw) {
    const list = friendReqByUser.get(f.receiver_id) ?? [];
    list.push({ senderName: nameById.get(f.sender_id) ?? "Someone" });
    friendReqByUser.set(f.receiver_id, list);
  }

  const followerCountByUser = new Map();
  for (const f of followRows) {
    followerCountByUser.set(
      f.followed_id,
      (followerCountByUser.get(f.followed_id) ?? 0) + 1,
    );
  }

  let sent = 0;
  let failed = 0;

  for (const batch of chunk(recipients, SEND_CHUNK_SIZE)) {
    const results = await Promise.allSettled(
      batch.map((r) =>
        sendDailyDigestEmail(r.email, {
          userName: r.name,
          subject: question?.subject,
          topic: question?.title,
          difficulty: question?.difficulty,
          xp: question?.xp,
          questionUrl: `${SITE_URL}/question-of-the-day`,
          questionText: question?.question,
          options: question?.options,
          questionType: question?.questionType,
          streak: streakByUser.get(r.id) ?? 0,
          solvedToday: solvedTodaySet.has(r.id),
          duelInvites: invitesByUser.get(r.id) ?? [],
          duelResults: resultsByUser.get(r.id) ?? [],
          duelsUrl: `${SITE_URL}/duel`,
          friendRequests: friendReqByUser.get(r.id) ?? [],
          newFollowersCount: followerCountByUser.get(r.id) ?? 0,
          friendsUrl: `${SITE_URL}/friends`,
        }),
      ),
    );

    for (const result of results) {
      if (result.status === "fulfilled") sent += 1;
      else {
        failed += 1;
        console.error("Daily digest send failed:", result.reason);
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
