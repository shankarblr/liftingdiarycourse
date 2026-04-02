# Data Fetching

## Rule: Server Components Only

**ALL data fetching in this app must be done via Server Components.**

Do NOT fetch data via:
- Route handlers (`/app/api/`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library

The only correct pattern is to fetch data in a Server Component and pass it down as props.

```tsx
// ✅ CORRECT — fetch in a Server Component
export default async function WorkoutsPage() {
  const workouts = await getWorkoutsForUser(userId);
  return <WorkoutList workouts={workouts} />;
}

// ❌ WRONG — do not fetch in a Client Component
"use client";
export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => { fetch("/api/workouts").then(...) }, []);
}
```

---

## Rule: All Database Queries via `/data` Helper Functions

Never write database queries inline in a component or page. All queries must live in helper functions under the `/data` directory.

```
src/
  data/
    workouts.ts     # getWorkoutsForUser, getWorkoutById, etc.
    exercises.ts    # getExercisesForUser, etc.
```

### Helper functions must use Drizzle ORM — never raw SQL.

```ts
// ✅ CORRECT — Drizzle ORM query
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// ❌ WRONG — raw SQL
export async function getWorkoutsForUser(userId: string) {
  return db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
}
```

---

## Rule: Users Must Only Access Their Own Data

**Every query must be scoped to the authenticated user's ID.** This is a hard security requirement — no exceptions.

Always:
1. Retrieve the current user's ID from the session inside the helper function (or pass it in explicitly).
2. Filter every query with a `WHERE userId = currentUserId` clause via Drizzle's `eq`.
3. Never trust a user-supplied ID without verifying it matches the session user.

```ts
// ✅ CORRECT — always scope to the authenticated user
export async function getWorkoutById(workoutId: string, userId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));

  return result[0] ?? null;
}

// ❌ WRONG — no user scoping, any user can access any record
export async function getWorkoutById(workoutId: string) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId));
}
```

If the record does not belong to the requesting user, return `null` or throw — do not return another user's data.
