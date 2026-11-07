import { createClient } from "@supabase/supabase-js";

// Client for public reads (browser & server components)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwvcwgmxdgklxjbmhdxk.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client with ingest admin bypass if available
export function getServiceSupabase() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  return createClient(supabaseUrl, serviceKey);
}
