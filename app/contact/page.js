import { Mail } from "lucide-react";
import ContactForm from "@/app/_components/Contact/ContactForm";

const TITLE = "Contact RankGrind";
const DESCRIPTION =
  "Get in touch with the RankGrind team — questions, feedback, or partnership inquiries.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contact" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Get in touch
          </h1>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed flex items-center gap-2">
            <Mail size={16} className="shrink-0" />
            Questions, feedback, or partnership inquiries — send us a message
            below.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
