import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IctTheoryHub } from "@/components/ict-theory-hub";
import { Pill, Section } from "@/components/ui";

export default function IctTheoryPage() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Pill>ICT Theory</Pill>
          <h1 className="mt-4 text-4xl font-bold">Recognise, explain, apply</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Master ICT skills for international exams through structured notes, visual study cards, glossary checks, and multiple-choice practice.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10">
        <IctTheoryHub />
      </div>
    </Section>
  );
}
