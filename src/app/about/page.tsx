import { Card, Section } from "@/components/ui";

export default function AboutPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">About Peak Study Hub</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Peak Study Hub helps students build practical ICT skills, theory understanding, and examination confidence through structured study notes, guided examples, and skills-based practice.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-semibold">Learn by Doing</h2>
          <p className="mt-3 leading-7 text-slate-600">
            The platform turns learning instructions into active tasks so students can practise spreadsheet, database, document, presentation, web authoring, flowchart, and theory skills in a focused workspace.
          </p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Built for Classrooms</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Lessons are designed around clear goals, visible progress, immediate feedback, and teacher-friendly evidence so practice can support independent learning, revision, and classroom demonstrations.
          </p>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Exam Skills</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Activities focus on the ICT and business skills commonly required in international school assessments, including practical accuracy, decision making, terminology, and output preparation.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold">Independent Educational Resource</h2>
        <p className="mt-3 leading-7 text-slate-600">
          Peak Study Hub is an independent educational practice platform. Full legal and affiliation information is available on the Disclaimer page.
        </p>
      </Card>
    </Section>
  );
}
