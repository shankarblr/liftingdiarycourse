"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1).max(100),
  startedAt: z.date(),
});

export async function updateWorkoutAction(
  workoutId: string,
  name: string,
  startedAt: Date
) {
  const parsed = updateWorkoutSchema.parse({ workoutId, name, startedAt });
  return updateWorkout(parsed.workoutId, parsed.name, parsed.startedAt);
}
