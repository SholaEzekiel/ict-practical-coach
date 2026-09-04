import { Mail, MessageSquare, Send } from "lucide-react";
import { Card, Section } from "@/components/ui";

const contactOptions = [
  ["Email", "info@peakstudyhub.com", Mail],
  ["Platform enquiries", "Subjects, practice modules, and school support.", MessageSquare],
  ["Content requests", "Suggest a topic, module, or exam-skill practice area.", Send]
];

export default function ContactPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Reach Us</p>
      <h1 className="mt-3 text-4xl font-bold">Contact Peak Study Hub</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Use this page as the contact point for platform questions, subject requests, and future school or teacher enquiries.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {contactOptions.map(([title, body, Icon]) => (
          <Card key={title as string}>
            <Icon className="text-ocean" size={24} aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">{title as string}</h2>
            <p className="mt-2 leading-6 text-slate-600">{body as string}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
