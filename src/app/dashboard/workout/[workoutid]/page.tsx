import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./EditWorkoutForm";

interface EditWorkoutPageProps {
  params: Promise<{ workoutid: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { workoutid } = await params;
  const workout = await getWorkoutById(workoutid);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-lg py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Workout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workout details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm workout={workout} />
        </CardContent>
      </Card>
    </div>
  );
}
