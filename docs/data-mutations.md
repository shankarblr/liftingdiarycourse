# Data Mutations

## Rule: All Database Mutations via `/data` Helper Functions

Never write database mutation calls inline in a component, page, or server action. All inserts, updates, and deletes must live in helper functions under the `src/data/` directory.

```
src/
  data/
    workouts.ts     # createWorkout, updateWorkout, deleteWorkout, etc.
    exercises.ts    # createExercise, deleteExercise, etc.
```

### Helper functions must use Drizzle ORM — never raw SQL.

```ts
// ✅ CORRECT — Drizzle ORM mutation
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, name: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name })
    .returning();
  return workout;
}

export async function deleteWorkout(workoutId: string, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

// ❌ WRONG — raw SQL
export async function createWorkout(userId: string, name: string) {
  return db.execute(sql`INSERT INTO workouts (user_id, name) VALUES (${userId}, ${name})`);
}
```

---

## Rule: All Mutations Must Be Scoped to the Authenticated User

Every insert, update, and delete must enforce ownership. This is a hard security requirement — no exceptions.

- On **insert**: always set `userId` from the authenticated session — never from user input.
- On **update/delete**: always include a `WHERE userId = currentUserId` clause via Drizzle's `eq` so a user cannot mutate another user's records.

```ts
// ✅ CORRECT — userId comes from auth(), not from the caller
import { auth } from "@clerk/nextjs/server";

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

// ❌ WRONG — no ownership check; any user can delete any record
export async function deleteWorkout(workoutId: string) {
  await db.delete(workouts).where(eq(workouts.id, workoutId));
}
```

---

## Rule: All Mutations Must Be Triggered via Server Actions

**ALL data mutations must be performed via Next.js Server Actions.** Do not mutate data via:

- Route handlers (`/app/api/`)
- Client-side `fetch` calls
- `useEffect`

---

## Rule: Server Actions Live in Colocated `actions.ts` Files

Server actions must be defined in a file named `actions.ts` colocated with the page or feature that uses them — not in a shared global file.

```
src/app/
  workouts/
    [id]/
      page.tsx
      actions.ts    # ✅ server actions for this route
  dashboard/
    page.tsx
    actions.ts      # ✅ server actions for this route
```

Every `actions.ts` file must begin with the `"use server"` directive.

```ts
"use server";

// actions defined here
```

---

## Rule: Server Action Parameters Must Be Typed — No `FormData`

All server action parameters must have explicit TypeScript types. `FormData` is forbidden as a parameter type.

```ts
// ✅ CORRECT — explicit typed parameters
export async function createWorkout(name: string, startedAt: Date) { ... }

// ❌ WRONG — FormData parameter
export async function createWorkout(formData: FormData) { ... }
```

---

## Rule: Server Actions Must Validate Arguments with Zod

Every server action must validate all arguments using [Zod](https://zod.dev/) before performing any work. Never trust caller-supplied values without parsing them first.

```ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  startedAt: z.date(),
});

export async function createWorkoutAction(name: string, startedAt: Date) {
  const parsed = createWorkoutSchema.parse({ name, startedAt });
  return createWorkout(parsed.name, parsed.startedAt);
}
```

Use `schema.parse(...)` (throws on invalid input) rather than `schema.safeParse(...)` unless you need to return structured validation errors to the UI.

---

## Rule: Never Call `redirect()` Inside a Server Action

Do not use Next.js's `redirect()` inside a server action. Redirects must be handled client-side after the server action resolves.

```ts
// ❌ WRONG — redirect inside a server action
"use server";
import { redirect } from "next/navigation";

export async function createWorkoutAction(name: string, startedAt: Date) {
  await createWorkout(name, startedAt);
  redirect("/dashboard"); // ← forbidden
}

// ✅ CORRECT — return from the action, redirect client-side
"use server";
export async function createWorkoutAction(name: string, startedAt: Date) {
  return createWorkout(name, startedAt);
}
```

```tsx
// ✅ CORRECT — redirect in the Client Component after the action resolves
"use client";
import { useRouter } from "next/navigation";

export function NewWorkoutForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createWorkoutAction(name, new Date(startedAt));
    router.push("/dashboard");
  }
}
```

---

## Summary: Full Mutation Flow

```
UI (Client Component)
  → calls server action in colocated actions.ts
    → validates args with Zod
      → calls /data helper function
        → executes Drizzle ORM query scoped to authenticated userId
```

No step in this chain may be skipped.
