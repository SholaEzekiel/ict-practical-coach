import { SubjectCard } from "@/components/subject-card";
import { Card, Section } from "@/components/ui";
import { hotSensePlan, subjects } from "@/lib/subject-data";

export default function SubjectsPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Subjects</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Apex Study Hub subjects</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        The hub starts with ICT and expands to Business. Each subject is organised around short practice loops: instruction, attempted action, expected result, feedback, and next step.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {subjects.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}
      </div>
      <Card className="mt-8">
        <h2 className="text-xl font-semibold">HotSense learning plan</h2>
        <ul className="mt-3 space-y-2 leading-7 text-slate-600">
          {hotSensePlan.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </Card>
    </Section>
  );
}
