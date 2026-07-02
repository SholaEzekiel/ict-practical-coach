import { Card, Section } from "@/components/ui";
import { FULL_DISCLAIMER } from "@/lib/constants";

export default function AboutPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">About ICT Practical Coach</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">ICT Practical Coach is designed to help students practise document production, spreadsheets, databases, presentations, website authoring, and theory revision through original skills-based activities.</p>
      <Card className="mt-8">
        <h2 className="text-xl font-semibold">Independent platform disclaimer</h2>
        <p className="mt-3 leading-7 text-slate-600">{FULL_DISCLAIMER}</p>
      </Card>
    </Section>
  );
}
