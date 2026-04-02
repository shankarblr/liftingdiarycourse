import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, workoutExercises, exercises } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseName: exercises.name,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lt(workouts.startedAt, endOfDay)
      )
    );

  // Group exercises by workout
  const workoutMap = new Map<
    string,
    { id: string; name: string | null; startedAt: Date | null; completedAt: Date | null; exerciseNames: string[] }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exerciseNames: [],
      });
    }
    if (row.exerciseName) {
      workoutMap.get(row.workoutId)!.exerciseNames.push(row.exerciseName);
    }
  }

  return Array.from(workoutMap.values());
}

export async function createWorkout(name: string, startedAt: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();
  return workout;
}
