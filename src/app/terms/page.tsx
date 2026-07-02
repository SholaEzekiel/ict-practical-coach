import { Card, Section } from "@/components/ui";
import { FULL_DISCLAIMER } from "@/lib/constants";

export default function TermsPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">Terms</h1>
      <div className="mt-8 grid gap-5">
        <Card><h2 className="text-xl font-semibold">Use of practice materials</h2><p className="mt-3 leading-7 text-slate-600">All tasks, datasets, feedback, and assessments in this app are original educational materials for learning and revision.</p></Card>
        <Card><h2 className="text-xl font-semibold">Independent platform disclaimer</h2><p className="mt-3 leading-7 text-slate-600">{FULL_DISCLAIMER}</p></Card>
      </div>
    </Section>
  );
}
