import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

// Next.js 16 uses 'proxy' instead of 'middleware'
// This file acts as the "Front Door Checkpoint" for the entire Next.js application.
// Whenever a user requests a URL, Next.js runs this function FIRST before anything else.
export default async function proxy(request: NextRequest) {
  // We take the incoming request and pass it to our "Bouncer" (updateSession)
  // located in src/lib/supabase/proxy.ts, which checks the cookies and protects the routes.
  return await updateSession(request);
}

// The 'config' object tells Next.js exactly WHICH routes should trigger this checkpoint.
export const config = {
  matcher: [
    /*
     * This complex regex says: "Run the checkpoint on EVERY route, EXCEPT:"
     * - _next/static (static JS/CSS files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (like .svg, .png, .jpg)
     * 
     * Why? We don't need to check database authentication just to load a static logo
     * or a CSS file. Skipping these makes the website load lightning fast!
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
