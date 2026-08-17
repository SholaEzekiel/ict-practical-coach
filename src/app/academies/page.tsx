import { AcademyCard } from "@/components/academy-card";
import { Section } from "@/components/ui";
import { academies } from "@/lib/academy-data";

export default function AcademiesPage() {
  return (
    <Section>
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean">ICT academies</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Choose an ICT practical skill area</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        These ICT academies sit inside Apex Study Hub. Each academy has an introduction, learning outcomes, original practical lessons, checkpoints, milestones, assessment routes, and progress tracking.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {academies.map((academy) => <AcademyCard key={academy.slug} academy={academy} />)}
      </div>
    </Section>
  );
}
