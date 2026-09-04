import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Laptop, Mail, MousePointerClick, SearchCheck } from "lucide-react";

const subjectLinks = [
  {
    title: "ICT Practical",
    description: "Spreadsheet modules are live, with word processing, database, presentation, and web-authoring practice next.",
    href: "/subjects/ict/spreadsheets",
    icon: Laptop
  },
  {
    title: "ICT Theory",
    description: "Recognition and understanding practice for ICT concepts, devices, and terminology.",
    href: "/subjects/ict/theory",
    icon: BookOpenCheck
  },
  {
    title: "Business",
    description: "Terminology, application, analysis, and evaluation practice for Business learners.",
    href: "/subjects/business",
    icon: BriefcaseBusiness
  }
];

const practiceSteps = [
  ["Understand", "Read the instruction and identify exactly what the task is asking.", SearchCheck],
  ["Attempt", "Complete the action inside a familiar practice interface.", MousePointerClick],
  ["Check", "Compare the final result and unlock the next goal when ready.", CheckCircle2]
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="border-b border-line bg-mist">
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Independent study practice provider</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight text-ink lg:text-6xl">
              Practice rooms for confident exam preparation.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650">
              Peak Study Hub helps students turn instructions into action through structured modules, familiar interfaces, clear goals, and result-focused checks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/subjects/ict/spreadsheets" className="inline-flex items-center gap-2 rounded-lg bg-ocean px-5 py-3 font-semibold text-white shadow-sm hover:bg-ocean/90">
                Start Practice <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/subjects" className="inline-flex items-center rounded-lg border border-line bg-white px-5 py-3 font-semibold text-ink hover:border-ocean">
                View Subjects
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="rounded-lg bg-ink p-5 text-white">
              <p className="text-sm font-semibold text-white/70">Peak study activity</p>
              <h2 className="mt-2 text-2xl font-bold">Practice that grows with each learner</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">Focused practical rooms, concise notes, and result checks for students preparing across subjects.</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-mist p-4">
                <p className="text-2xl font-bold text-ink">12k+</p>
                <p className="mt-1 text-slate-600">Platform visits</p>
              </div>
              <div className="rounded-lg bg-mist p-4">
                <p className="text-2xl font-bold text-ink">96%</p>
                <p className="mt-1 text-slate-600">Satisfied learners</p>
              </div>
              <div className="rounded-lg bg-mist p-4">
                <p className="text-2xl font-bold text-ink">3.8k</p>
                <p className="mt-1 text-slate-600">Practice sessions</p>
              </div>
              <div className="rounded-lg bg-mist p-4">
                <p className="text-2xl font-bold text-ink">2</p>
                <p className="mt-1 text-slate-600">Subjects supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Subjects</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Choose a study route</h2>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-ocean">
            Reach us <Mail size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {subjectLinks.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-soft">
              <Icon className="text-ocean" size={24} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 min-h-24 text-sm leading-6 text-slate-600">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                Open <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">How It Works</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">A clear practice loop</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {practiceSteps.map(([title, body, Icon]) => (
              <div key={title as string} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <Icon className="text-ocean" size={24} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-ink">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
