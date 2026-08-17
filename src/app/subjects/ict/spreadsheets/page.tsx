import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UniverSpreadsheetLab } from "@/components/univer-spreadsheet-lab";
import { Pill, Section } from "@/components/ui";

export default function IctSpreadsheetsPage() {
  return (
    <Section className="max-w-[1600px]">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>ICT Spreadsheets</Pill>
          <h1 className="mt-4 text-4xl font-bold">Instruction-led spreadsheet practice</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Pick a short task, follow the steps, try it in the spreadsheet, and check your work.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <UniverSpreadsheetLab />
    </Section>
  );
}
