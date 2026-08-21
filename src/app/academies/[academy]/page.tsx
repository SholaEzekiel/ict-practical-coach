import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { Card, Pill, Section } from "@/components/ui";
import { academies } from "@/lib/academy-data";

export function generateStaticParams() {
  return academies.map((academy) => ({ academy: academy.slug }));
}

export default function AcademyPage({ params }: { params: { academy: string } }) {
  if (params.academy === "word-processing") redirect("/subjects/ict/word-processing");
  if (params.academy === "website-authoring") redirect("/subjects/ict/website-authoring");

  const academy = academies.find((item) => item.slug === params.academy);
  if (!academy) notFound();
  const Icon = academy.icon;

  return (
    <Section>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <span className={`grid h-12 w-12 place-items-center rounded-lg ${academy.color} text-white`}>
            <Icon size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-4xl font-bold text-ink">{academy.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{academy.summary}</p>
        </div>
        <Card className="md:w-80">
          <h2 className="font-semibold">Learning outcomes</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {academy.outcomes.map((outcome) => <li key={outcome}>• {outcome}</li>)}
          </ul>
        </Card>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {academy.lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <Pill>{lesson.level}</Pill>
              <span className="text-sm text-slate-500">{lesson.duration}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{lesson.title}</h2>
            <p className="mt-2 flex-1 leading-6 text-slate-600">{lesson.description}</p>
            <p className="mt-4 text-sm font-semibold text-slate-700">{lesson.marks} marks</p>
            {lesson.available ? (
              <Link href={`/academies/${academy.slug}/lessons/${lesson.id}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-ocean">
                Start lesson <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ) : (
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Lock size={16} aria-hidden="true" /> Structured placeholder
              </span>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
