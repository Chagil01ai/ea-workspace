// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Optional: warn in dev if env vars missing
  // eslint-disable-next-line no-console
  console.warn("Supabase URL or anon key is not set. Auth will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
