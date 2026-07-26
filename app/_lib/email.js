// app/_lib/email.js
//
// Server-only. Never import this from a "use client" component — it reads
// RESEND_API_KEY directly (not NEXT_PUBLIC_) and renders React Email
// templates to HTML, both of which only work in server code (route
// handlers, server actions, cron endpoints).

import { Resend } from "resend";
import DailyQuestion from "@/emails/DailyQuestion";
import FriendRequest from "@/emails/FriendRequest";
import InactivityNudge from "@/emails/InactivityNudge";
import NewFollower from "@/emails/NewFollower";

const resend = new Resend(process.env.RESEND_API_KEY);

// must match a domain verified in the Resend dashboard (step 1 from earlier)
const FROM = "rankgrind.com <notifications@rankgrind.com>";

async function send({ to, subject, react }) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw error;
  }

  return data;
}

export async function sendDailyQuestionEmail(to, props) {
  return send({
    to,
    subject: `🔥 Today's ${props.subject} question is up`,
    react: <DailyQuestion {...props} />,
  });
}

export async function sendFriendRequestEmail(to, props) {
  return send({
    to,
    subject: `${props.senderName} sent you a friend request`,
    react: <FriendRequest {...props} />,
  });
}

export async function sendInactivityNudgeEmail(to, props) {
  return send({
    to,
    subject: "We miss you — come solve a question",
    react: <InactivityNudge {...props} />,
  });
}

export async function sendNewFollowerEmail(to, props) {
  return send({
    to,
    subject: `${props.followerName} started following you`,
    react: <NewFollower {...props} />,
  });
}
