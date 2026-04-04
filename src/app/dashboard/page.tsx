import { format } from "date-fns";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { WorkoutDatePicker } from "./WorkoutDatePicker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam
    ? (() => { const [y, m, d] = dateParam.split("-").map(Number); return new Date(y, m - 1, d); })()
    : new Date();

  const workouts = await getWorkoutsForDate(date);

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Date Picker */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-2 text-muted-foreground">
          Viewing workouts for
        </p>
        <WorkoutDatePicker date={date} />
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Workouts — {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No workouts logged for this date.
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{workout.name ?? "Untitled Workout"}</CardTitle>
                  {workout.startedAt && workout.completedAt && (
                    <CardDescription>
                      {format(workout.startedAt, "h:mm a")} –{" "}
                      {format(workout.completedAt, "h:mm a")}
                    </CardDescription>
                  )}
                </CardHeader>
                {workout.exerciseNames.length > 0 && (
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {workout.exerciseNames.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
