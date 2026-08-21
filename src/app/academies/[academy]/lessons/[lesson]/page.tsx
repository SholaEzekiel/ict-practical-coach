import { notFound, redirect } from "next/navigation";
import { SpreadsheetWorkspace } from "@/components/spreadsheet-workspace";
import { Card, Section } from "@/components/ui";
import { academies } from "@/lib/academy-data";

export function generateStaticParams() {
  return academies.flatMap((academy) =>
    academy.lessons.filter((lesson) => lesson.available).map((lesson) => ({ academy: academy.slug, lesson: lesson.id }))
  );
}

export default function LessonPage({ params }: { params: { academy: string; lesson: string } }) {
  if (params.academy === "word-processing") redirect("/subjects/ict/word-processing/intro");
  if (params.academy === "website-authoring") redirect("/subjects/ict/website-authoring/intro");

  const academy = academies.find((item) => item.slug === params.academy);
  const lesson = academy?.lessons.find((item) => item.id === params.lesson);
  if (!academy || !lesson || !lesson.available) notFound();

  if (academy.slug === "spreadsheets" && lesson.id === "club-attendance") {
    return <Section className="max-w-[1500px]"><SpreadsheetWorkspace /></Section>;
  }

  return (
    <Section>
      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">{academy.title}</p>
        <h1 className="mt-2 text-3xl font-bold">{lesson.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">{lesson.description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-mist p-4">
            <h2 className="font-semibold">Introduction</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">A short original practice activity is ready for this academy.</p>
          </div>
          <div className="rounded-lg bg-mist p-4">
            <h2 className="font-semibold">Learning outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{academy.outcomes.join(", ")}.</p>
          </div>
          <div className="rounded-lg bg-mist p-4">
            <h2 className="font-semibold">Next build stage</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Interactive validation will be added after the Spreadsheet academy is complete.</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}
