import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MousePointerClick, ShieldCheck } from "lucide-react";
import { AcademyCard } from "@/components/academy-card";
import { IctImageTrainer } from "@/components/ict-image-trainer";
import { Card, Pill, Section } from "@/components/ui";
import { academies } from "@/lib/academy-data";
import { FULL_DISCLAIMER } from "@/lib/constants";
import { hotSensePlan, ictSyllabusStrands, subjects } from "@/lib/subject-data";

export function generateStaticParams() {
  return subjects.map((subject) => ({ subject: subject.slug }));
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = subjects.find((item) => item.slug === params.subject);
  if (!subject) notFound();

  const isIct = subject.slug === "ict";

  return (
    <Section>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Pill className={subject.status === "Interactive MVP" ? "bg-emerald-50 text-leaf" : "bg-amber-50 text-amber"}>{subject.status}</Pill>
          <h1 className="mt-4 text-4xl font-bold text-ink">{subject.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{subject.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {subject.routes.map((route) => (
              <Link key={route.href} href={route.href} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 font-semibold hover:border-ocean">
                {route.label} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <Card className="lg:w-96">
          <h2 className="font-semibold">Practice loop</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            {subject.learningModel.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
          </ol>
        </Card>
      </div>

      {isIct ? (
        <>
          <div className="mt-10">
            <h2 className="text-2xl font-bold">ICT syllabus-led roadmap</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              This roadmap is based on the attached ICT syllabus structure. Content in the app remains original and focuses on the skills students need to recognise instructions, choose tools, perform actions, and check evidence.
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {ictSyllabusStrands.map((strand) => (
                <Card key={strand.title}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">{strand.title}</h3>
                    <Pill>Sections {strand.sections}</Pill>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">Skills</p>
                  <p className="mt-1 leading-6 text-slate-600">{strand.skills.join(", ")}.</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">Practice mode</p>
                  <p className="mt-1 leading-6 text-slate-600">{strand.practiceMode}.</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <IctImageTrainer />
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold">ICT practical academies</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {academies.map((academy) => <AcademyCard key={academy.slug} academy={academy} />)}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Card>
            <h2 className="text-xl font-semibold">Terminology trainer</h2>
            <p className="mt-3 leading-7 text-slate-600">Students will practise definitions, examples, and business-use explanations until key terms become familiar.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Application practice</h2>
            <p className="mt-3 leading-7 text-slate-600">Scenario prompts will ask learners to connect concepts to a business context instead of writing generic answers.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Evaluation builder</h2>
            <p className="mt-3 leading-7 text-slate-600">Students will learn to weigh options, justify choices, and build balanced conclusions for longer responses.</p>
          </Card>
        </div>
      )}

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card>
          <MousePointerClick className="text-ocean" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Instruction-to-interface training</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Lessons show an instruction, ask the student to choose or perform the action in a simulated application-style interface, then reveal the expected result and correction steps.
          </p>
        </Card>
        <Card>
          <ShieldCheck className="text-leaf" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold">Independent content</h2>
          <p className="mt-3 leading-7 text-slate-600">{FULL_DISCLAIMER}</p>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-semibold">HotSense approval gates</h2>
        <ul className="mt-3 space-y-2 leading-7 text-slate-600">
          {hotSensePlan.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </Card>
    </Section>
  );
}
