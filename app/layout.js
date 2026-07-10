// app/layout.jsx
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./_components/Footer";
import MainToast from "./_components/Toasts/MainToast";
import "katex/dist/katex.min.css";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
import { AuthProvider } from "./_lib/AuthProvider";
import { createClient } from "./_lib/supabase-server";
import Navbar from "./_components/Navbar";

export const metadata = {
  title: "JEE Platform",
  description: "India's most gamified JEE preparation platform",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AuthProvider initialUser={user}>
          <Providers>
            <Navbar />
            {children} <MainToast />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
