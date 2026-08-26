import Link from "next/link";
import { ArrowRight, BarChart3, FileSpreadsheet, Filter, FunctionSquare, Grid2X2, Lock, PenLine, Printer, Rows3 } from "lucide-react";
import { Pill, Section } from "@/components/ui";
import { getSpreadsheetCardsForModule, spreadsheetModules } from "@/lib/spreadsheet-instruction-cards";

const moduleIcons = {
  intro: Grid2X2,
  "data-entry": PenLine,
  formatting: Rows3,
  formula: FunctionSquare,
  "data-tools": Filter,
  chart: BarChart3,
  layout: Printer
};

export default function IctSpreadsheetsPage() {
  return (
    <Section className="max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>ICT Spreadsheets</Pill>
          <h1 className="mt-4 text-4xl font-bold">Spreadsheet modules</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Choose one module, practise in a focused spreadsheet room, and unlock the next task only after the goal is achieved.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {spreadsheetModules.map((module) => {
          const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || FileSpreadsheet;
          const tasks = getSpreadsheetCardsForModule(module.id);
          const autoChecked = tasks.filter((task) => task.autoCheck).length;
          const locked = module.id === "layout";
          const cardContent = (
            <>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-ocean">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${locked ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                  {locked && <Lock size={13} aria-hidden="true" />}
                  {locked ? "Upcoming" : `${tasks.length} goals`}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-ink">{module.title}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{locked ? "This module is visible in the learning map, but locked while print and page setup tools are being prepared." : module.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">{locked ? "Locked" : `${autoChecked} auto-check`}</span>
                <span className={`inline-flex items-center gap-2 font-semibold ${locked ? "text-slate-400" : "text-ocean"}`}>
                  {locked ? "Coming soon" : "Open"} {!locked && <ArrowRight size={16} aria-hidden="true" />}
                </span>
              </div>
            </>
          );

          if (locked) {
            return <div key={module.id} className="rounded-lg border border-line bg-white/75 p-5 opacity-90 shadow-sm">{cardContent}</div>;
          }

          return <Link key={module.id} href={`/subjects/ict/spreadsheets/${module.id}`} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-soft">{cardContent}</Link>;
        })}
      </div>
    </Section>
  );
}
