import { Card, Section } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <Section>
      <h1 className="text-4xl font-bold">Privacy</h1>
      <Card className="mt-8">
        <h2 className="text-xl font-semibold">First version privacy position</h2>
        <p className="mt-3 leading-7 text-slate-600">This local prototype uses in-browser lesson state only. Future authentication, analytics, payments, adverts, and teacher features should add clear consent, data retention, and account controls before launch.</p>
      </Card>
    </Section>
  );
}
