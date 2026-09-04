import { SubjectCard } from "@/components/subject-card";
import { Card, Section } from "@/components/ui";
import { subjects } from "@/lib/subject-data";

export default function SubjectsPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Subjects</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Peak Study Hub subjects</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Choose the subject you want to practise. Each subject is organised around short loops: instruction, attempt, expected result, feedback, and next step.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {subjects.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}
      </div>
      <Card className="mt-8">
        <h2 className="text-xl font-semibold">How the hub grows</h2>
        <p className="mt-3 leading-7 text-slate-600">
          The current subjects are ICT and Business. The same structure can later support more subjects, saved learner progress, classrooms, teacher tools, and a complete learning management system.
        </p>
      </Card>
    </Section>
  );
}
