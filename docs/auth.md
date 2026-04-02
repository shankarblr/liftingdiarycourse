# Authentication

## Auth Provider: Clerk

**This app uses [Clerk](https://clerk.com/) for all authentication.**

Do NOT implement custom auth, sessions, JWTs, or any other auth mechanism. Clerk handles everything — sign up, sign in, session management, and user identity.

---

## Rule: Get the Current User from Clerk — Never from Props or Params

Always retrieve the authenticated user's ID using Clerk's server-side helper inside Server Components and data helper functions.

```ts
// ✅ CORRECT — get userId from Clerk in a Server Component or data helper
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsForUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// ❌ WRONG — do not accept userId as a caller-supplied parameter without verification
export async function getWorkoutsForUser(userId: string) { ... }
```

---

## Rule: Protect Pages with Clerk Middleware

All authenticated routes must be protected via Clerk middleware (`middleware.ts` at the project root). Do not manually check auth state inside page components.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

---

## Rule: Use Clerk Components for Sign In / Sign Up UI

Use Clerk's pre-built components for all auth UI — do not build custom sign-in or sign-up forms.

```tsx
// ✅ CORRECT — use Clerk's built-in components
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

Available Clerk UI components: `<SignIn />`, `<SignUp />`, `<UserButton />`, `<UserProfile />`.

---

## Rule: Never Expose Clerk Secret Keys

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — safe to use client-side
- `CLERK_SECRET_KEY` — server-side only, never referenced in Client Components or passed to the browser

---

## Rule: Unauthenticated Access Must Throw or Redirect

If a Server Component or data helper detects no active session, it must either throw an error or redirect — never silently return data or render protected UI.

```ts
// ✅ CORRECT
const { userId } = await auth();
if (!userId) redirect("/sign-in");

// ❌ WRONG — silently continues with no user
const { userId } = await auth();
// (no check — proceeds as if authenticated)
```
