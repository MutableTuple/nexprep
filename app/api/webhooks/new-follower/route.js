// app/api/webhooks/new-follower/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase-admin";
import { sendNewFollowerEmail } from "@/app/_lib/email";

export async function POST(request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const row = payload.record;

  // TODO: confirm these column names against your actual follows table
  const followerId = row?.follower_id;
  const followingId = row?.following_id;

  if (!followerId || !followingId) {
    return NextResponse.json({ skipped: true });
  }

  try {
    const [{ data: follower }, { data: followedAuth }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", followerId)
        .single(),
      supabaseAdmin.auth.admin.getUserById(followingId),
    ]);

    const recipientEmail = followedAuth?.user?.email;
    if (!recipientEmail) {
      return NextResponse.json({ skipped: "no recipient email" });
    }

    await sendNewFollowerEmail(recipientEmail, {
      recipientName: followedAuth.user.user_metadata?.full_name ?? "there",
      followerName: follower?.display_name || follower?.username || "Someone",
      followerUsername: follower?.username ?? "user",
      followerAvatarUrl: follower?.avatar_url ?? undefined,
      followerProfileUrl: `https://rankgrind.com/user/${follower?.username}/profile`,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("New follower webhook failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
