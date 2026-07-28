"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/app/_lib/toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast.success(
        "Message sent",
        "We'll get back to you as soon as we can.",
      );
      setForm({ name: "", email: "", message: "" });
    } catch {
      showToast.error("Couldn't send message", "Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <Input
        required
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <Textarea
        required
        rows={5}
        maxLength={5000}
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
      />
      <Button type="submit" disabled={submitting} className="gap-2 self-start">
        {submitting ? "Sending..." : "Send message"}
        <Send size={15} aria-hidden />
      </Button>
    </form>
  );
}
