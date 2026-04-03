"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "./actions";
import type { Workout } from "@/db/schema";

interface EditWorkoutFormProps {
  workout: Workout;
}

export function EditWorkoutForm({ workout }: EditWorkoutFormProps) {
  const router = useRouter();
  const [name, setName] = useState(workout.name ?? "");
  const [startedAt, setStartedAt] = useState(() => {
    const d = workout.startedAt ? new Date(workout.startedAt) : new Date();
    return d.toISOString().slice(0, 16);
  });
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await updateWorkoutAction(workout.id, name, new Date(startedAt));
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          placeholder="e.g. Push Day"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startedAt">Started at</Label>
        <Input
          id="startedAt"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
