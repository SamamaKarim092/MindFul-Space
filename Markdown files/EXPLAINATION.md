# Mental Health Sentiment Journal: Backend & Auth Explanation

## 1. Authentication and Authorization Flow

When a user first opens the website, the public homepage is shown by `page.tsx`. That page also checks whether the user is already signed in by using `useAuth()` from `context.tsx`. If the user already has a session, the page sends them to the dashboard instead of leaving them on the public home page.

When the user goes to the sign-in page and signs in, `context.tsx` handles the login action:

- If they use email/password, the `signIn()` function runs.
- If they use Google, the `signInWithGoogle()` function runs (using OAuth2).

Either way, the app asks Supabase to sign the user in. Supabase verifies the login and creates the session for that user. That session contains the access token, which is the **Bearer token**. In simple words, this token is like the user’s ID card. The app does not create it manually; Supabase gives it back after a successful sign-in.

After that, `context.tsx` stores the current user and session in the frontend auth state so the whole app can read it. That is why the user does not need to sign in again on every page.

### How the Frontend Talks to the Backend

When the app needs to call the backend, `fetcher.ts` reads the current Supabase session and automatically attaches the Bearer token to the request header. So the frontend says to the backend, _“this request belongs to this signed-in user.”_

Then the backend checks that token in `api.ts`. That file reads the **Authorization header**, verifies the Bearer token with Supabase, and then finds or creates the matching user in Prisma. This is the **authorization** part: the backend decides whether this user is allowed to use the protected route.

When the user creates, updates, or deletes something, `mutations.ts` runs. It uses `apiFetch()` to send the request with the token, and then `mutate()` refreshes the data so the UI shows the newest version.

The app-wide wrapper `layout.tsx` helps make this all work by providing `AuthProvider` to the whole app. That means every page inside the app can read the shared auth state through `useAuth()`.

### The Core Summary

- The user signs in through `context.tsx`
- Supabase creates the session and token
- `fetcher.ts` sends that token with requests
- `api.ts` verifies it on the backend
- `mutations.ts` keeps the UI updated after changes

**A quick note on storage:** The token is not just “saved on the cookie” by your code directly. Supabase manages the session, and the app reads that session through its auth helpers. The browser auth context keeps the signed-in state available, and the Supabase server/proxy helpers handle session validation across requests.

---

## 2. Example: Saving a Journal Entry

Imagine the user wants to save a new journal entry.

1. The user types something in the journal form and clicks save.
2. The frontend page does not send the request directly. It calls the helper in `fetcher.ts`.
3. That helper first asks Supabase, _“Does this user have a session?”_
4. If yes, Supabase gives back the access token.
5. The helper adds that token to the request header as `Authorization: Bearer ...`
6. Then it sends the request to the backend API route.
7. The backend receives the request and checks the token in `api.ts`.
8. If the token is valid, the backend knows the user is real and allowed.
9. Then the backend saves the journal entry in the database.
10. After that, the frontend updates the screen so the new entry appears.

**In simple words:**  
`fetcher.ts` carries the message from frontend to backend. The Bearer token is the ID card attached to that message. `auth/api.ts` checks the ID card, and then the backend does the real save or update work.

_“When Alice clicks Save Journal, the frontend uses fetcher.ts to send her request with her Bearer token, the backend checks it with auth/api.ts, and then the journal entry is saved.”_

---

## 3. The Full Step-by-Step Story

1. The user opens your website for the first time.
2. The homepage appears first.
3. The app checks whether the user is already signed in.
4. If the user is not signed in, they go to the sign-in page.
5. On the sign-in page, the user chooses a login method:
   - Email/password through `signIn()`
   - Google login through `signInWithGoogle()`
6. If Google is used, Supabase handles the OAuth2 login flow.
7. If email/password is used, Supabase checks the email and password.
8. If login is successful, Supabase creates the session and gives back the access token.
9. `context.tsx` stores the user and session in shared auth state.
10. `useAuth()` lets any page read that shared login state.
11. If the user is already logged in, the app redirects them to another page using `router.push()`.
12. When the frontend sends a request to the backend, `apiFetch()` automatically adds the Bearer token to the request header.
13. The backend receives the request, and `auth/api.ts` checks the token with Supabase.
14. If the token is valid, the backend allows the request and uses Prisma to read or save data in the database.
15. If the user creates, updates, or deletes something, `mutations.ts` sends the request and then refreshes the screen with `mutate()` so the new data appears.

### One short way to remember it:

- **`context.tsx`** = keeps login state
- **`useAuth()`** = reads login state
- **`signIn()` / `signInWithGoogle()`** = logs the user in
- **`apiFetch()`** = sends requests with the token
- **`auth/api.ts`** = checks the token on the backend
- **`mutations.ts`** = updates data and refreshes the UI

---

## 4. Token Expiration and Refresh Flow

Supabase access tokens do not last forever. They usually expire after an hour for security reasons.

If the user stays on the website for a long time and the access token expires, Supabase's browser client can usually **refresh the session** in the background as long as the refresh token is still valid. That means the user does not normally need to sign in again just because the access token expired.

In this project, `fetcher.ts` asks Supabase for the current session before sending a request. If Supabase has already refreshed the session, `fetcher.ts` gets the new access token and sends it in the Authorization header.

If the refresh token is also expired or the session is no longer valid, then the backend can reject the request with an unauthorized error and the app may need to send the user back to the sign-in page.

**The simple idea is:**
`access token expires` -> `Supabase refreshes the session` -> `fetcher.ts gets a new token` -> `backend accepts the request`

**If refreshing fails:**
`access token expires` -> `no valid session` -> `backend rejects the request` -> `user signs in again`

### The Lifecycle of the Tokens

Here is the exact lifecycle of what happens to those two tokens from the moment you log in:

- **The Login:** You log in. Supabase gives you Access Token #1 and Refresh Token #1.
- **The Usage:** For the next 59 minutes, `fetcher.ts` attaches Access Token #1 to every request you send to your backend. The Refresh Token just sits quietly in the background.
- **The Expiration:** At the 60-minute mark, Access Token #1 expires. It is now useless.
- **The Swap:** The next time your app tries to do something, the Supabase client realizes the Access Token is dead. Without asking the user to do anything, it takes Refresh Token #1 and secretly sends it to Supabase.
- **The Renewal:** Supabase verifies the Refresh Token, and sends back Access Token #2 (and often a brand new Refresh Token #2 for extra security).
- **The Continuation:** Your app immediately attaches Access Token #2 to the request, and the user's journal entry saves successfully. The user never even knew their token expired!

This dual-token system is the industry standard for almost all modern web and mobile applications. It is exactly how apps like Instagram or Spotify keep you logged in for months at a time without compromising the security of your actual requests.

---

## 5. Server-Side Rendering (SSR) vs. Client-Side State

`useAuth()` runs in the browser because it reads React auth state on the client. That means the homepage can first load, and then the client checks whether the user is logged in.

In this project, that can still cause a very small **flicker** on the public homepage because the page itself waits for `useAuth()` and then redirects with `router.push()`.

For protected routes, the project uses `src/proxy.ts`, which runs on the server **before** the page is shown. It uses Supabase cookies through `src/lib/supabase/proxy.ts` and checks the session with `supabase.auth.getUser()`.

That means if the user is already signed in and tries to open protected pages like `/dashboard`, the server can redirect them before the page fully loads.

**The simple difference is:**

- **Client-side state:** The browser checks login after the page starts loading.
- **Server-side proxy:** The server checks login before the page is shown.

**In this project:**

- The public homepage can use client-side auth and may have a small loading flicker.
- The dashboard and login protection are handled by the server proxy _before_ the page loads.

If you want to remove the flicker completely for a page, the redirect needs to happen on the server instead of waiting for the client.
