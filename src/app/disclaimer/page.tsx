import { Card, Section } from "@/components/ui";
import { FULL_DISCLAIMER } from "@/lib/constants";

export default function DisclaimerPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">Disclaimer</h1>
      <Card className="mt-8">
        <p className="leading-7 text-slate-600">{FULL_DISCLAIMER}</p>
      </Card>
    </Section>
  );
}
