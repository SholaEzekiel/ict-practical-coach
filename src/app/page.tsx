import Link from "next/link";
import { ArrowRight, CheckCircle2, MousePointerClick, SearchCheck } from "lucide-react";
import { SubjectCard } from "@/components/subject-card";
import { Card, Section } from "@/components/ui";
import { SHORT_DISCLAIMER } from "@/lib/constants";
import { subjects } from "@/lib/subject-data";

const features = [
  ["Read the instruction", "Students learn what a task is really asking them to do.", SearchCheck],
  ["Attempt the action", "They practise choosing the right tool, command, setting, or response.", MousePointerClick],
  ["Check the result", "They compare their answer with the expected output and improve.", CheckCircle2]
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Independent study practice provider</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Practice that teaches students what to do next.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650">
              Apex Study Hub helps students turn instructions into confident action. Start with ICT and Business, then practise through clear tasks, familiar interfaces, feedback, and expected results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/subjects" className="inline-flex items-center gap-2 rounded-lg bg-ocean px-5 py-3 font-semibold text-white shadow-sm hover:bg-ocean/90">
                Choose a Subject <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/subjects/ict" className="inline-flex items-center rounded-lg border border-line bg-white px-5 py-3 font-semibold text-ink hover:border-ocean">
                Open ICT
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-mist p-4 shadow-soft">
            <div className="grid gap-3">
              {features.map(([title, body, Icon]) => (
                <Card key={title as string} className="shadow-none">
                  <Icon className="text-ocean" size={23} aria-hidden="true" />
                  <h2 className="mt-4 font-semibold text-ink">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body as string}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Available now</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Choose a subject</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {subjects.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <h2 className="text-xl font-semibold">Built for expansion</h2>
            <p className="mt-2 leading-6 text-slate-600">Apex can later grow into more subjects, structured courses, teacher tools, saved progress, and a full learning management layer without crowding the current student experience.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Independent platform</h2>
            <p className="mt-2 leading-6 text-slate-600">{SHORT_DISCLAIMER}</p>
          </Card>
        </div>
      </Section>
    </>
  );
}
