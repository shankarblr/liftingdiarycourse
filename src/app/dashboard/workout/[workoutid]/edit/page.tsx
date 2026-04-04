import { notFound } from "next/navigation";

import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "../EditWorkoutForm";

export default async function EditWorkoutPage({
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
      <h1 className="text-3xl font-bold mb-8">Edit Workout</h1>
      <EditWorkoutForm workout={workout} />
    </div>
  );
}
