import { notFound } from "next/navigation";
import { UniverSpreadsheetLab } from "@/components/univer-spreadsheet-lab";
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

  if (!module || cards.length === 0) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <UniverSpreadsheetLab moduleId={params.module} />
    </main>
  );
}
