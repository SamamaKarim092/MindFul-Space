import { createBrowserClient } from '@supabase/ssr';

// NEXT_PUBLIC_ variables are safely exposed to the browser/frontend.
// They tell the frontend exactly which Supabase project to connect to.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A helper function to verify that our project actually has the required environment variables.
// This prevents the frontend from crashing unexpectedly if the .env file is missing or misconfigured.
export function hasSupabaseBrowserEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// This function creates and configures the Supabase client specifically for the frontend (the browser).
// Using @supabase/ssr's createBrowserClient ensures that Supabase automatically knows how to 
// manage sessions (the Bearer tokens) and seamlessly read/write them to the browser's cookies.
export function createClient() {
  if (!hasSupabaseBrowserEnv()) {
    return null;
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  );
}
