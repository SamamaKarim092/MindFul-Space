------------------- Authentication and Authorization Flow   ------------------


When a user first opens the website, the public homepage is shown by page.tsx. That page also checks whether the user is already signed in by using useAuth() from context.tsx. If the user already has a session, the page sends them to the dashboard instead of leaving them on the public home page.

When the user goes to the sign-in page and signs in, context.tsx handles the login action. If they use email/password, the signIn() function runs. If they use Google, the signInWithGoogle() function runs. Either way, the app asks Supabase to sign the user in.

Supabase then verifies the login and creates the session for that user. That session contains the access token, which is the Bearer token. In simple words, this token is like the user’s ID card. The app does not create it manually. Supabase gives it back after a successful sign-in.

After that, context.tsx stores the current user and session in the frontend auth state so the whole app can read it. That is why the user does not need to sign in again on every page.

When the app needs to call the backend, fetcher.ts reads the current Supabase session and automatically attaches the Bearer token to the request header. So the frontend says to the backend, “this request belongs to this signed-in user.”

Then the backend checks that token in api.ts. That file reads the Authorization header, verifies the Bearer token with Supabase, and then finds or creates the matching user in Prisma. This is the authorization part: the backend decides whether this user is allowed to use the protected route.

When the user creates, updates, or deletes something, mutations.ts runs. It uses apiFetch() to send the request with the token, and then mutate() refreshes the data so the UI shows the newest version.

The app-wide wrapper layout.tsx helps make this all work by providing AuthProvider to the whole app. That means every page inside the app can read the shared auth state through useAuth().

If I put it in one very simple sentence:

the user signs in through context.tsx,
Supabase creates the session and token,
fetcher.ts sends that token with requests,
api.ts verifies it on the backend,
and mutations.ts keeps the UI updated after changes.
One important correction to your sentence: the token is not just “saved on the cookie” by your code in a direct way. In this project, Supabase manages the session, and the app reads that session through its auth helpers. The browser auth context keeps the signed-in state available, and the Supabase server/proxy helpers can help with session handling across requests.




Imagine the user wants to save a new journal entry.

The user types something in the journal form and clicks save.
The frontend page does not send the request directly.
It calls the helper in fetcher.ts.
That helper first asks Supabase, “Does this user have a session?”
If yes, Supabase gives back the access token.
The helper adds that token to the request header as Authorization: Bearer ...
Then it sends the request to the backend API route.
The backend receives the request and checks the token in api.ts.
If the token is valid, the backend knows the user is real and allowed.
Then the backend saves the journal entry in the database.
After that, the frontend updates the screen so the new entry appears.
So in simple words:

fetcher.ts carries the message from frontend to backend
the Bearer token is the ID card attached to that message
auth/api.ts checks the ID card
the backend does the real save or update work
A short example sentence:

“When Alice clicks Save Journal, the frontend uses fetcher.ts to send her request with her Bearer token, the backend checks it with auth/api.ts, and then the journal entry is saved.”
If you want, I can also explain the same flow for login instead of journal