import { Download, LineChart, Users } from "lucide-react";
import { Card, ProgressBar, Section } from "@/components/ui";
import { teacherStats } from "@/lib/academy-data";

export default function TeacherDashboardPage() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Teacher dashboard</p>
          <h1 className="mt-2 text-4xl font-bold">Class practical readiness</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 font-semibold"><Download size={17} /> Export report</button>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Card><Users className="text-ocean" /><p className="mt-4 text-sm text-slate-600">Classrooms</p><p className="text-3xl font-bold">{teacherStats.classrooms}</p></Card>
        <Card><Users className="text-leaf" /><p className="mt-4 text-sm text-slate-600">Students tracked</p><p className="text-3xl font-bold">{teacherStats.learners}</p></Card>
        <Card><LineChart className="text-amber" /><p className="mt-4 text-sm text-slate-600">Predicted readiness</p><p className="text-3xl font-bold">{teacherStats.averageReadiness}%</p><ProgressBar value={teacherStats.averageReadiness} /></Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">Weak topics</h2>
          <ul className="mt-3 space-y-2 text-slate-600">{teacherStats.weakTopics.map((topic) => <li key={topic}>• {topic}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <ul className="mt-3 space-y-2 text-slate-600">{teacherStats.recentActivity.map((item) => <li key={item}>• {item}</li>)}</ul>
        </Card>
      </div>
    </Section>
  );
}
