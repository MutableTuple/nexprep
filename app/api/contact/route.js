import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "rankgrind.com <notifications@rankgrind.com>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const { name, email, message } = await request.json();

  if (
    !name?.trim() ||
    !email?.trim() ||
    !message?.trim() ||
    !EMAIL_RE.test(email) ||
    message.length > 5000
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.error("CONTACT_EMAIL env var is not set — contact form can't deliver messages.");
    return Response.json({ error: "Contact form not configured" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
