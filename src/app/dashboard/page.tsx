"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Morning Strength Session",
    exercises: ["Squat", "Bench Press", "Deadlift"],
    duration: "52 min",
  },
  {
    id: 2,
    name: "Upper Body Hypertrophy",
    exercises: ["Overhead Press", "Pull-ups", "Dumbbell Row"],
    duration: "45 min",
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Date Picker */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-2 text-muted-foreground">
          Viewing workouts for
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-64 justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Workouts — {format(date, "do MMM yyyy")}
        </h2>

        {MOCK_WORKOUTS.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No workouts logged for this date.
            </CardContent>
          </Card>
        ) : (
          MOCK_WORKOUTS.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>{workout.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {workout.exercises.map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
