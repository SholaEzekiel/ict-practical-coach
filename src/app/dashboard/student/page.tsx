import Link from "next/link";
import { Award, BookOpenCheck, Flame, Target } from "lucide-react";
import { Card, ProgressBar, Section } from "@/components/ui";
import { dashboardStats } from "@/lib/academy-data";

export default function StudentDashboardPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Student dashboard</p>
      <h1 className="mt-2 text-4xl font-bold">Your practical readiness</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-4">
        <Card><Target className="text-ocean" /><p className="mt-4 text-sm text-slate-600">Overall progress</p><p className="text-3xl font-bold">{dashboardStats.overallProgress}%</p><ProgressBar value={dashboardStats.overallProgress} /></Card>
        <Card><Flame className="text-coral" /><p className="mt-4 text-sm text-slate-600">Streak</p><p className="text-3xl font-bold">{dashboardStats.streak} days</p></Card>
        <Card><BookOpenCheck className="text-leaf" /><p className="mt-4 text-sm text-slate-600">Predicted grade band</p><p className="text-2xl font-bold">{dashboardStats.predictedGradeBand}</p></Card>
        <Card><Award className="text-amber" /><p className="mt-4 text-sm text-slate-600">Exam Confidence Score</p><p className="text-3xl font-bold">{dashboardStats.confidence}%</p></Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <h2 className="text-xl font-semibold">Recommended next practice</h2>
          <p className="mt-3 text-slate-600">{dashboardStats.recommended}</p>
          <Link href="/academies/spreadsheets/lessons/club-attendance" className="mt-5 inline-flex rounded-lg bg-ocean px-4 py-2 font-semibold text-white">Continue practice</Link>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Weak areas</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            {dashboardStats.weakAreas.map((area) => <li key={area}>• {area}</li>)}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
