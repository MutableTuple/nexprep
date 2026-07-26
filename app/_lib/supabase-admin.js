// app/_lib/supabase-admin.js
//
// Server-only, never import from a "use client" file. The service role key
// bypasses RLS entirely — this is why it must never be NEXT_PUBLIC_ and
// never ship to the browser.
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
