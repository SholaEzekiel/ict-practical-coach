import Link from "next/link";
import { ArrowRight, Database, FileInput, KeyRound, MonitorPlay, Rows3, Search } from "lucide-react";
import { Pill, Section } from "@/components/ui";
import { databaseModules, getDatabaseCardsForModule } from "@/lib/database-instruction-cards";

const moduleIcons = {
  intro: Database,
  "import-design": FileInput,
  queries: Search,
  "reports-labels": Rows3,
  "exam-build": KeyRound,
  "free-practice": MonitorPlay
};

export default function DatabasesPage() {
  return (
    <Section className="max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>ICT Databases</Pill>
          <h1 className="mt-4 text-4xl font-bold">Database modules</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Learn Microsoft Access database processes through step-by-step guidance, exam-style knowledge checks, reports, labels, and print evidence habits.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {databaseModules.map((module) => {
          const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || Database;
          const tasks = getDatabaseCardsForModule(module.id);
          return (
            <Link key={module.id} href={`/subjects/ict/databases/${module.id}`} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-ocean"><Icon size={22} aria-hidden="true" /></span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{tasks.length} goals</span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-ink">{module.title}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{module.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">Database checks</span>
                <span className="inline-flex items-center gap-2 font-semibold text-ocean">Open <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
