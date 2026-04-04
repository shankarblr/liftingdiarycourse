import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
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

export async function getWorkoutById(workoutId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      workoutExerciseId: workoutExercises.id,
      orderIndex: workoutExercises.orderIndex,
      exerciseName: exercises.name,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weightLbs: sets.weightLbs,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));

  if (rows.length === 0) return null;

  const first = rows[0];
  const exerciseMap = new Map<
    string,
    {
      workoutExerciseId: string;
      name: string;
      orderIndex: number;
      sets: { id: string; setNumber: number; reps: number | null; weightLbs: string | null }[];
    }
  >();

  for (const row of rows) {
    if (!row.workoutExerciseId || !row.exerciseName) continue;
    if (!exerciseMap.has(row.workoutExerciseId)) {
      exerciseMap.set(row.workoutExerciseId, {
        workoutExerciseId: row.workoutExerciseId,
        name: row.exerciseName,
        orderIndex: row.orderIndex ?? 0,
        sets: [],
      });
    }
    if (row.setId) {
      exerciseMap.get(row.workoutExerciseId)!.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        reps: row.reps,
        weightLbs: row.weightLbs,
      });
    }
  }

  const exerciseList = Array.from(exerciseMap.values()).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return {
    id: first.workoutId,
    name: first.workoutName,
    startedAt: first.startedAt,
    completedAt: first.completedAt,
    exercises: exerciseList,
  };
}
