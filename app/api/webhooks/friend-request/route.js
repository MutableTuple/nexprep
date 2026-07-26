// app/api/webhooks/friend-request/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase-admin";
import { sendFriendRequestEmail } from "@/app/_lib/email";

export async function POST(request) {
  // shared secret so random requests can't trigger emails by hitting this URL
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const row = payload.record; // Supabase sends the inserted row as `record`

  if (!row || row.status !== "pending") {
    return NextResponse.json({ skipped: true });
  }

  try {
    const [{ data: sender }, { data: receiverAuth }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("display_name, username, avatar_url")
        .eq("id", row.sender_id)
        .single(),
      supabaseAdmin.auth.admin.getUserById(row.receiver_id),
    ]);

    const receiverEmail = receiverAuth?.user?.email;
    if (!receiverEmail) {
      return NextResponse.json({ skipped: "no receiver email" });
    }

    await sendFriendRequestEmail(receiverEmail, {
      recipientName: receiverAuth.user.user_metadata?.full_name ?? "there",
      senderName: sender?.display_name || sender?.username || "Someone",
      senderUsername: sender?.username ?? "user",
      senderAvatarUrl: sender?.avatar_url ?? undefined,
      acceptUrl: "https://rankgrind.com/friends",
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Friend request webhook failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
