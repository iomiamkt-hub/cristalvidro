import { createClient } from "@supabase/supabase-js";

// Server client — no Database generic to avoid JSONB type inference issues.
// Each service explicitly types its query results with local interfaces.
export function createServerClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
