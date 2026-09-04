import { Card, Section } from "@/components/ui";
import { FULL_DISCLAIMER } from "@/lib/constants";

export default function AboutPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">About Peak Study Hub</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Peak Study Hub is designed to help students practise ICT practical skills, theory recognition, and future Business exam responses through original skills-based activities.</p>
      <Card className="mt-8">
        <h2 className="text-xl font-semibold">Independent platform disclaimer</h2>
        <p className="mt-3 leading-7 text-slate-600">{FULL_DISCLAIMER}</p>
      </Card>
    </Section>
  );
}
