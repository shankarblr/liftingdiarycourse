import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core';

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sets = pgTable('sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutExerciseId: uuid('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weightLbs: numeric('weight_lbs', { precision: 6, scale: 2 }),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
