import { Card, Section } from "@/components/ui";

const tiers = [
  ["Free", "Sample lessons, basic feedback, and academy browsing.", "£0"],
  ["Premium", "Saved progress, premium hints, bonus practice, and certificates.", "Future"],
  ["Schools", "Teacher dashboards, classroom tracking, and exportable reports.", "Future"]
];

export default function PricingPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Pricing</p>
      <h1 className="mt-2 text-4xl font-bold">Start studying free</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">This first version keeps ICT practice accessible immediately. Paid plans are structured for future subject expansion, progress saving, teacher tools, and optional extras.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {tiers.map(([name, body, price]) => (
          <Card key={name}>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="mt-4 text-3xl font-bold">{price}</p>
            <p className="mt-4 leading-6 text-slate-600">{body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
