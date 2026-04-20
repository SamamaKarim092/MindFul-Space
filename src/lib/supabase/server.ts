import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates the Supabase client specifically for the Backend (Server Components,
// Server Actions, or Next.js API route handlers in the app/api folder).
export async function createClient() {
  // Read the cookies sent from the user's browser in the incoming HTTP request.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Return all the cookies to Supabase so it can find the session/Bearer token.
        getAll() {
          return cookieStore.getAll();
        },
        // Attempt to update the cookies (e.g., if the user logged in, or a token refreshed).
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // React Server Components (RSCs) are often "read-only" and cannot set headers/cookies
            // after the response has already started rendering. If Supabase tries to refresh a token
            // here and fails, it's perfectly fine—because our proxy (middleware) has already
            // handled the token refresh and updated the browser's cookies before this code even ran!
          }
        },
      },
    }
  );
}
