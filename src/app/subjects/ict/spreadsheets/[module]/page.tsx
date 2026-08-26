import { notFound } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { UniverSpreadsheetLab } from "@/components/univer-spreadsheet-lab";
import { Card } from "@/components/ui";
import { getSpreadsheetCardsForModule, getSpreadsheetModule, spreadsheetModules } from "@/lib/spreadsheet-instruction-cards";

type SpreadsheetModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return spreadsheetModules.map((module) => ({ module: module.id }));
}

export default function SpreadsheetModulePage({ params }: SpreadsheetModulePageProps) {
  const module = getSpreadsheetModule(params.module);
  const cards = getSpreadsheetCardsForModule(params.module);

  if (!module || (params.module !== "free-practice" && cards.length === 0)) {
    notFound();
  }

  if (params.module === "layout") {
    return (
      <main className="bg-mist px-4 py-12 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-amber-100 text-amber-800">
            <Lock size={24} aria-hidden="true" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-amber-700">Upcoming</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Print and Layout is locked for now.</h1>
          <p className="mt-3 text-slate-600">
            This module will return when the print-area, orientation, margins, and page setup practice can be checked properly.
          </p>
          <Link href="/subjects/ict/spreadsheets" className="mt-6 inline-flex rounded-lg bg-ocean px-5 py-3 font-semibold text-white">
            Back to spreadsheet modules
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <UniverSpreadsheetLab moduleId={params.module} />
    </main>
  );
}
