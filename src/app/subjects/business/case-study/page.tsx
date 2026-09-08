import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessCaseStudyHub } from "@/components/business-case-study-hub";
import { Pill, Section } from "@/components/ui";

export default function BusinessCaseStudyPage() {
  return (
    <Section className="max-w-[1500px]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>Business Case Study Practice</Pill>
          <h1 className="mt-4 text-4xl font-bold text-ink">Application, analysis, and evaluation practice</h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
            Work through Business case studies by identifying applied evidence, developed reasoning, and justified evaluation.
          </p>
        </div>
        <Link href="/subjects/business" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Business modules <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-8">
        <BusinessCaseStudyHub />
      </div>
    </Section>
  );
}
