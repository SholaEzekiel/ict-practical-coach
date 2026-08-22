import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BusinessTheoryHub } from "@/components/business-theory-hub";
import { IctImageTrainer } from "@/components/ict-image-trainer";
import { Card, Pill, Section } from "@/components/ui";
import { businessPracticeAreas, ictPracticeAreas, subjects } from "@/lib/subject-data";

export function generateStaticParams() {
  return subjects.map((subject) => ({ subject: subject.slug }));
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = subjects.find((item) => item.slug === params.subject);
  if (!subject) notFound();

  const isIct = subject.slug === "ict";
  const areas = isIct ? ictPracticeAreas : businessPracticeAreas;

  if (!isIct) {
    return (
      <Section className="max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Pill>Business</Pill>
            <h1 className="mt-4 text-4xl font-bold text-ink">Business revision notes</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Short modular notes and glossary quizzes for quick revision.
            </p>
          </div>
          <Link href="/subjects" className="inline-flex items-center gap-2 font-semibold text-ocean">
            All subjects <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8">
          <BusinessTheoryHub />
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>Subject</Pill>
          <h1 className="mt-4 text-4xl font-bold text-ink">{subject.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{subject.summary}</p>
        </div>
        <Link href="/subjects" className="inline-flex items-center gap-2 font-semibold text-ocean">
          All subjects <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <Card key={area.title} className="flex flex-col">
            <h2 className="text-xl font-semibold">{area.title}</h2>
            <p className="mt-3 flex-1 leading-7 text-slate-600">{area.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.actions.map((action) => <Pill key={action}>{action}</Pill>)}
            </div>
            {"href" in area && area.href ? (
              <Link href={area.href} className="mt-5 inline-flex items-center gap-2 font-semibold text-ocean">
                Start <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ) : (
              <span className="mt-5 text-sm font-semibold text-slate-500">Practice builder ready for syllabus upload</span>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.7fr_1fr]">
        <Card>
          <h2 className="text-xl font-semibold">How practice works</h2>
          <ol className="mt-3 space-y-2 leading-7 text-slate-600">
            {subject.learningModel.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
          </ol>
        </Card>
        {isIct ? <IctImageTrainer /> : <BusinessTheoryHub />}
      </div>
    </Section>
  );
}
