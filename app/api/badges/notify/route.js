// app/api/badges/notify/route.js
//
// Called client-side (BadgeUnlockProvider) the moment a new badge is
// detected, right after the same solve action that earned it. The actual
// award decision always happened server-side already (award_stat_badges /
// award_duel_badges triggers) — this route only decides whether to email
// about it, and is safe to call with an untrusted userId/badgeSlug because
// every step below is verified against the database, not trusted from the
// request body.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase-admin";
import { sendBadgeUnlockedEmail } from "@/app/_lib/email";
import { BADGE_CATALOG } from "@/app/_lib/badges";

const SITE_URL = "https://rankgrind.com";

export async function POST(request) {
  const { userId, badgeSlug } = await request.json();
  if (!userId || !badgeSlug) {
    return NextResponse.json(
      { error: "Missing userId or badgeSlug" },
      { status: 400 },
    );
  }

  const badgeMeta = BADGE_CATALOG.find((b) => b.slug === badgeSlug);
  if (!badgeMeta) {
    return NextResponse.json({ skipped: "unknown badge" });
  }

  // Atomic claim: only proceeds if this exact (user, badge) row exists AND
  // hasn't been emailed yet. Makes the endpoint safe against a client lying
  // about userId/badgeSlug — if the row doesn't genuinely exist, or was
  // already claimed, this returns nothing and we stop here.
  const { data: claimed, error: claimError } = await supabaseAdmin
    .from("user_badges")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("badge_slug", badgeSlug)
    .is("email_sent_at", null)
    .select()
    .maybeSingle();

  if (claimError) {
    console.error("Failed to claim badge notification:", claimError);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json({ skipped: true });
  }

  try {
    const [{ data: authUser }, { data: profile }, { data: prefs }] =
      await Promise.all([
        supabaseAdmin.auth.admin.getUserById(userId),
        supabaseAdmin
          .from("profiles")
          .select("display_name, username")
          .eq("id", userId)
          .maybeSingle(),
        supabaseAdmin
          .from("user_preferences")
          .select("email_notifications")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

    if (prefs?.email_notifications === false) {
      return NextResponse.json({ skipped: "email notifications disabled" });
    }

    const email = authUser?.user?.email;
    if (!email) {
      return NextResponse.json({ skipped: "no recipient email" });
    }

    await sendBadgeUnlockedEmail(email, {
      userName:
        profile?.display_name ||
        profile?.username ||
        authUser.user.user_metadata?.full_name ||
        "there",
      badgeName: badgeMeta.name,
      badgeDesc: badgeMeta.desc,
      badgeTier: badgeMeta.tier,
      profileUrl: profile?.username
        ? `${SITE_URL}/user/${profile.username}/profile`
        : `${SITE_URL}/problems`,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Badge unlock email failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
