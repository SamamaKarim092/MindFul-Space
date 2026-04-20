import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// This function acts as the "bouncer" for your application. It runs on the server (Edge runtime)
// BEFORE a page is even rendered or sent to the user's browser.
export async function updateSession(request: NextRequest) {
  // Skip proxy for API routes and static files
  const { pathname } = request.nextUrl;
  
  // We don't need to check authentication for serving images, CSS, or backend API routes.
  // Skipping these improves performance so the bouncer doesn't inspect every single tiny asset.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Create an initial response object. If the user session has changed (e.g., token refreshed),
  // we will attach new cookies to this response before sending it back to the browser.
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    // createServerClient tells Supabase how to read and write cookies on the server-side.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Read the current cookies coming from the browser
          getAll() {
            return request.cookies.getAll();
          },
          // If Supabase needs to save a new token (e.g., because it just refreshed an expired one),
          // it calls setAll to update the cookies on our response object going back to the browser.
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Calling getUser() securely checks with the Supabase API to verify the token.
    // IMPORTANT: If the access token is expired but a valid refresh token exists in the cookies,
    // getUser() will automatically get a new access token and trigger the setAll() cookie method above.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Route Protection: Define pages that require a user to be logged in
    const protectedPaths = ['/dashboard'];
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

    // If the page is protected and there is no verified user, kick them to the login screen.
    if (isProtectedPath && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages (you can't log in if you're already logged in!)
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some((path) =>
      pathname.startsWith(path)
    );

    // If they are on a login/signup path but already have a user session, bounce them to the dashboard.
    if (isAuthPath && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Finally, if none of the redirects triggered, let the request proceed to the intended page,
    // bringing along any newly refreshed cookies.
    return supabaseResponse;
  } catch (error) {
    // If there's an error with Supabase, just let the request pass through
    console.error('Proxy session error:', error);
    return NextResponse.next();
  }
}
