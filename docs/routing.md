# Routing

## Rule: All App Routes Live Under `/dashboard`

Every page in this application must be nested under the `/dashboard` route prefix. Do not create top-level pages for app functionality.

```
✅ /dashboard
✅ /dashboard/workout/[workoutId]
✅ /dashboard/settings

❌ /workouts
❌ /profile
```

---

## Rule: Protect `/dashboard` Routes via Next.js Middleware

All `/dashboard` routes must be protected by Clerk middleware in `src/middleware.ts`. Do not manually check auth state inside page components — the middleware handles it.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

Unauthenticated users who attempt to access any `/dashboard` route will be automatically redirected to sign-in by Clerk.

---

## Rule: Public Routes Are Sign-In and Sign-Up Only

The only public routes are Clerk's auth pages. Everything else is protected.

```ts
// ✅ Public routes
/sign-in
/sign-up

// ✅ Protected — all app routes
/dashboard
/dashboard/**
```

---

## Rule: Do Not Duplicate Auth Checks in Page Components

Because the middleware protects all `/dashboard` routes, page components do not need to manually redirect unauthenticated users. The middleware handles it before the page renders.

Data helpers must still scope queries to the authenticated `userId` (see `docs/data-fetching.md` and `docs/auth.md`), but pages themselves should not contain redundant auth redirect logic.
