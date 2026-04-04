import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ workoutid: string }>;
}) {
  const { workoutid } = await params;
  const workout = await getWorkoutById(workoutid);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">
          {workout.name ?? "Untitled Workout"}
        </h1>
        <Button asChild variant="outline">
          <Link href={`/dashboard/workout/${workoutid}/edit`}>Edit</Link>
        </Button>
      </div>
      {workout.startedAt && (
        <p className="text-muted-foreground mb-8">
          {format(workout.startedAt, "do MMM yyyy")}
          {workout.completedAt && (
            <>
              {" · "}
              {format(workout.startedAt, "h:mm a")} –{" "}
              {format(workout.completedAt, "h:mm a")}
            </>
          )}
        </p>
      )}

      {workout.exercises.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No exercises logged for this workout.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <Card key={exercise.workoutExerciseId}>
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                {exercise.sets.length > 0 && (
                  <CardDescription>
                    {exercise.sets.length} set{exercise.sets.length !== 1 ? "s" : ""}
                  </CardDescription>
                )}
              </CardHeader>
              {exercise.sets.length > 0 && (
                <CardContent>
                  <div className="space-y-1">
                    {exercise.sets
                      .sort((a, b) => a.setNumber - b.setNumber)
                      .map((set) => (
                        <div
                          key={set.id}
                          className="flex items-center gap-4 text-sm"
                        >
                          <span className="text-muted-foreground w-12">
                            Set {set.setNumber}
                          </span>
                          <span>
                            {set.reps != null ? `${set.reps} reps` : "— reps"}
                          </span>
                          {set.weightLbs != null && (
                            <span className="text-muted-foreground">
                              @ {set.weightLbs} lbs
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
