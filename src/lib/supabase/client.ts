import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Browser client — safe to use in "use client" components
// Uses the public anon key; respects RLS policies
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
