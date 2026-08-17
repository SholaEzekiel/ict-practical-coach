import Link from "next/link";
import { ArrowRight, BadgeCheck, Brain, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { AcademyCard } from "@/components/academy-card";
import { SubjectCard } from "@/components/subject-card";
import { Card, Section } from "@/components/ui";
import { academies } from "@/lib/academy-data";
import { SHORT_DISCLAIMER } from "@/lib/constants";
import { hotSensePlan, subjects } from "@/lib/subject-data";

const features = [
  ["Instruction decoding", "Turns exam-style instructions into the action, tool, and expected result students need to recognise.", BadgeCheck],
  ["AI-style feedback", "Generates local examiner-style practice feedback with mark estimates and improvement tips.", Brain],
  ["Progress rewards", "Tracks XP, badges, confidence, weak areas, and milestone rewards.", Sparkles],
  ["Teacher-ready", "Includes mock classroom dashboards and export-ready progress structures.", LineChart]
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Independent IGCSE study and practical preparation hub</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Learn the instruction. Practise the action. Recognise the result.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650">
              Apex Study Hub helps students prepare for ICT practical work and theory through short instruction-led simulations, image recognition tasks, instant feedback, and subject roadmaps. Business practice is scaffolded next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/academies/spreadsheets/lessons/club-attendance" className="inline-flex items-center gap-2 rounded-lg bg-ocean px-5 py-3 font-semibold text-white shadow-sm hover:bg-ocean/90">
                Start ICT Practice <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/subjects" className="inline-flex items-center rounded-lg border border-line bg-white px-5 py-3 font-semibold text-ink hover:border-ocean">
                Explore Subjects
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-mist p-4 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-2">
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
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Study hub</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Subjects built around practice</h2>
          </div>
          <Link href="/subjects" className="inline-flex items-center gap-2 font-semibold text-ocean">
            View all <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {subjects.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">ICT practical academies</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">First interactive subject area</h2>
          </div>
          <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
            ICT roadmap <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {academies.map((academy) => <AcademyCard key={academy.slug} academy={academy} />)}
        </div>
      </Section>
      <Section className="pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <ShieldCheck className="text-leaf" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Legal-safe by design</h2>
            <p className="mt-2 leading-6 text-slate-600">{SHORT_DISCLAIMER}</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Pricing preview</h2>
            <p className="mt-2 leading-6 text-slate-600">Free sample lessons first, with future premium hints, teacher tools, school licences, and rewarded optional extras after milestones.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">HotSense plan</h2>
            <p className="mt-2 leading-6 text-slate-600">{hotSensePlan[2]}</p>
          </Card>
        </div>
      </Section>
    </>
  );
}
