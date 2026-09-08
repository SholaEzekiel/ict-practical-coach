import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessTheoryHub } from "@/components/business-theory-hub";
import { Pill, Section } from "@/components/ui";

export default function BusinessNotesPage() {
  return (
    <Section className="max-w-7xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>Business Notes</Pill>
          <h1 className="mt-4 text-4xl font-bold text-ink">Business revision notes</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Concise Business Studies notes, glossary, and knowledge-focused MCQ practice.
          </p>
        </div>
        <Link href="/subjects/business" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Business modules <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-8">
        <BusinessTheoryHub />
      </div>
    </Section>
  );
}
