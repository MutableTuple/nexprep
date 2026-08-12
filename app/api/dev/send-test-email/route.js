// app/api/dev/send-test-email/route.js
//
// Dev-only helper for sending a real test email through Resend using each
// template's own PreviewProps sample data — same content you see in the
// react-email preview UI, actually delivered to an inbox. Blocked outside
// development so it can never be hit in production.
import { NextResponse } from "next/server";
import {
  sendDailyDigestEmail,
  sendBadgeUnlockedEmail,
  sendFriendRequestEmail,
  sendInactivityNudgeEmail,
  sendNewFollowerEmail,
  sendWeeklyStatsEmail,
} from "@/app/_lib/email";
import DailyDigest from "@/emails/DailyDigest";
import BadgeUnlocked from "@/emails/BadgeUnlocked";
import FriendRequest from "@/emails/FriendRequest";
import InactivityNudge from "@/emails/InactivityNudge";
import NewFollower from "@/emails/NewFollower";
import WeeklyStats from "@/emails/WeeklyStats";

const SENDERS = {
  dailyDigest: { send: sendDailyDigestEmail, props: DailyDigest.PreviewProps },
  badgeUnlocked: {
    send: sendBadgeUnlockedEmail,
    props: BadgeUnlocked.PreviewProps,
  },
  friendRequest: {
    send: sendFriendRequestEmail,
    props: FriendRequest.PreviewProps,
  },
  inactivityNudge: {
    send: sendInactivityNudgeEmail,
    props: InactivityNudge.PreviewProps,
  },
  newFollower: { send: sendNewFollowerEmail, props: NewFollower.PreviewProps },
  weeklyStats: { send: sendWeeklyStatsEmail, props: WeeklyStats.PreviewProps },
};

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 },
    );
  }

  const { to, template = "dailyDigest" } = await request.json();
  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to" email address' },
      { status: 400 },
    );
  }

  const entry = SENDERS[template];
  if (!entry) {
    return NextResponse.json(
      {
        error: `Unknown template "${template}". Use one of: ${Object.keys(SENDERS).join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    await entry.send(to, entry.props);
    return NextResponse.json({ sent: true, template, to });
  } catch (err) {
    console.error("Test email send failed:", err);
    return NextResponse.json(
      { error: err.message || "Send failed" },
      { status: 500 },
    );
  }
}
