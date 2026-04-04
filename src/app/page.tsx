import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
            Your personal gym companion
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Track every lift.<br />Own your progress.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
            Lifting Diary helps you log workouts, track personal records, and
            see how far you&apos;ve come — all in one place.
          </p>
        </div>
        <SignUpButton mode="modal">
          <Button size="lg" className="rounded-full px-8 h-11 text-sm">
            Start for free
          </Button>
        </SignUpButton>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Log Workouts</CardTitle>
              <CardDescription>
                Record sets, reps, and weights with a clean, distraction-free
                interface built for the gym floor.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track PRs</CardTitle>
              <CardDescription>
                Automatically surface your personal records and celebrate every
                new milestone you hit.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>See Progress</CardTitle>
              <CardDescription>
                Charts and history that show your strength gains over weeks,
                months, and years.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
