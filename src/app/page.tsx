import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, Laptop } from "lucide-react";

const subjectLinks = [
  {
    title: "ICT Practical",
    description: "Practise spreadsheet, document, database, presentation, and web-authoring tasks.",
    href: "/subjects/ict/spreadsheets",
    icon: Laptop
  },
  {
    title: "ICT Theory",
    description: "Build confidence with ICT concepts, components, and exam-style understanding.",
    href: "/subjects/ict/theory",
    icon: BookOpenCheck
  },
  {
    title: "Business",
    description: "Practise key terms, application, analysis, and evaluation skills.",
    href: "/subjects/business",
    icon: BriefcaseBusiness
  }
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Independent study practice provider</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Apex Study Hub
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-650">
            Simple practice spaces for students who need to understand the instruction, complete the task, and check the result.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {subjectLinks.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-soft">
              <Icon className="text-ocean" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
              <p className="mt-2 min-h-20 text-sm leading-6 text-slate-600">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                Open <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
