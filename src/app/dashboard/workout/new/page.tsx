import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewWorkoutForm } from "./NewWorkoutForm";

export default function NewWorkoutPage() {
  return (
    <div className="container mx-auto max-w-lg py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">New Workout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Workout details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </div>
  );
}
