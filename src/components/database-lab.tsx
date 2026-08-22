"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, FileInput, KeyRound, Link2, Rows3, Search, Tags } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { getDatabaseCardsForModule, getDatabaseModule, sourceTables } from "@/lib/database-instruction-cards";
import type { DatabaseCard, DatabaseExpectedResult, DatabaseTable } from "@/lib/database-instruction-cards";

type Feedback = {
  ok: boolean;
  messages: string[];
};

function cloneTable(table: DatabaseTable) {
  return {
    ...table,
    fields: table.fields.map((field) => ({ ...field })),
    rows: table.rows.map((row) => ({ ...row }))
  };
}

function validateDatabase(card: DatabaseCard, tables: DatabaseTable[], selectedTable: string, query: QueryState, report: ReportState): Feedback {
  const messages: string[] = [];
  const expected = card.expected;
  const allFields = tables.flatMap((table) => table.fields);
  const selected = tables.find((table) => table.name === selectedTable);

  expected.importedTables?.forEach((name) => {
    if (!tables.some((table) => table.name === name)) messages.push(`Import ${name}.csv.`);
  });
  if (expected.selectedTable && selectedTable !== expected.selectedTable) messages.push(`Select the ${expected.selectedTable} table.`);
  if (expected.primaryKey && !allFields.some((field) => field.name === expected.primaryKey && field.primary)) messages.push(`Set ${expected.primaryKey} as a primary key.`);
  Object.entries(expected.fieldTypes || {}).forEach(([name, type]) => {
    if (!allFields.some((field) => field.name === name && field.type === type)) messages.push(`Set ${name} to ${type}.`);
  });
  if (expected.relationship && query.relationship !== expected.relationship) messages.push(`Create the relationship using ${expected.relationship}.`);
  if (expected.queryField && query.field !== expected.queryField) messages.push(`Set the query field to ${expected.queryField}.`);
  if (expected.queryOperator && query.operator !== expected.queryOperator) messages.push(`Set the query operator to ${expected.queryOperator}.`);
  if (expected.queryValue && query.value !== expected.queryValue) messages.push(`Set the query value to ${expected.queryValue}.`);
  if (expected.queryJoin && query.join !== expected.queryJoin) messages.push(`Set the query join to ${expected.queryJoin}.`);
  if (expected.sortField && query.sortField !== expected.sortField) messages.push(`Sort by ${expected.sortField}.`);
  if (expected.sortDirection && query.sortDirection !== expected.sortDirection) messages.push(`Use ${expected.sortDirection} sort order.`);
  if (expected.reportTitle && report.title !== expected.reportTitle) messages.push(`Set the report title to ${expected.reportTitle}.`);
  expected.reportFields?.forEach((field) => {
    const fieldExists = selected?.fields.some((item) => item.name === field) || allFields.some((item) => item.name === field);
    if (!report.fields.includes(field) && !fieldExists) messages.push(`Make sure ${field} exists as a field.`);
    else if (!report.fields.includes(field) && expected.reportFields && expected.reportFields.length <= 4) messages.push(`Add ${field} to the report fields.`);
  });
  if (expected.labelField && report.labelField !== expected.labelField) messages.push(`Set the label field to ${expected.labelField}.`);

  return {
    ok: messages.length === 0,
    messages: messages.length ? messages : ["Good work. The database task matches the Apex final-result checks.", ...(card.teacherReview?.length ? ["Your teacher should now review design view, report layout, labels, and evidence screenshots."] : [])]
  };
}

type QueryState = {
  field: string;
  operator: string;
  value: string;
  join: "AND" | "OR";
  sortField: string;
  sortDirection: "Ascending" | "Descending";
  relationship: string;
};

type ReportState = {
  title: string;
  fields: string[];
  labelField: string;
};

const defaultQuery: QueryState = { field: "", operator: "equals", value: "", join: "AND", sortField: "", sortDirection: "Ascending", relationship: "" };
const defaultReport: ReportState = { title: "", fields: [], labelField: "" };

export function DatabaseLab({ moduleId }: { moduleId?: string }) {
  const cards = useMemo(() => getDatabaseCardsForModule(moduleId), [moduleId]);
  const module = getDatabaseModule(moduleId) || getDatabaseModule(cards[0]?.moduleId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [panel, setPanel] = useState<"import" | "design" | "query" | "report" | "labels">("import");
  const [query, setQuery] = useState<QueryState>(defaultQuery);
  const [report, setReport] = useState<ReportState>(defaultReport);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const card = cards[activeIndex];
  const selected = tables.find((table) => table.name === selectedTable) || tables[0];
  const fields = selected?.fields || [];
  const currentComplete = card ? completed.includes(card.id) : false;
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;

  function importTable(name: string) {
    const source = sourceTables.find((table) => table.name === name);
    if (!source) return;
    setTables((items) => items.some((table) => table.name === name) ? items : [...items, cloneTable(source)]);
    setSelectedTable(name);
    setPanel("design");
  }

  function updateField(fieldName: string, patch: Partial<{ type: string; primary: boolean }>) {
    setTables((items) => items.map((table) => table.name !== selectedTable ? table : {
      ...table,
      fields: table.fields.map((field) => field.name === fieldName ? { ...field, ...patch } : patch.primary ? { ...field, primary: false } : field)
    }));
  }

  function toggleReportField(name: string) {
    setReport((current) => ({ ...current, fields: current.fields.includes(name) ? current.fields.filter((field) => field !== name) : [...current.fields, name] }));
  }

  function checkWork() {
    if (!card) return;
    const result = validateDatabase(card, tables, selectedTable, query, report);
    setFeedback(result);
    if (result.ok) setCompleted((items) => items.includes(card.id) ? items : [...items, card.id]);
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    setActiveIndex((index) => index + 1);
    setFeedback(null);
  }

  if (!card) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line p-5">
          <Link href="/subjects/ict/databases" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
            <ArrowLeft size={16} aria-hidden="true" /> Database modules
          </Link>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
            <span className="text-sm font-semibold text-slate-600">{activeIndex + 1}/{cards.length}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{card.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
          <div className="mt-4"><div className="mb-2 flex justify-between text-sm font-medium"><span>Progress</span><span>{completed.length}/{cards.length}</span></div><ProgressBar value={progress} /></div>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <section className="rounded-lg border border-line bg-mist p-4"><p className="text-xs font-bold uppercase tracking-wide text-ocean">Goal</p><h2 className="mt-2 text-xl font-bold leading-8">{card.goal}</h2></section>
          <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Support document</h3><div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{card.supportDocument.map((line) => <p key={line}>{line}</p>)}</div></section>
          <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Steps</h3><ol className="mt-3 space-y-3">{card.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol></section>
          {card.teacherReview && <section className="rounded-lg border border-sky-200 bg-sky-50 p-4"><h3 className="font-bold">Teacher review</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">{card.teacherReview.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {feedback && <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3><ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">{feedback.messages.map((message) => <li key={message}>{message}</li>)}</ul></section>}
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-5">
          <button type="button" onClick={checkWork} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90"><CheckCircle2 size={18} aria-hidden="true" /> Check final result</button>
          <button type="button" onClick={nextCard} disabled={!currentComplete || activeIndex === cards.length - 1} className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Next</button>
        </div>
      </aside>

      <section className="grid min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="border-r border-line bg-slate-50 p-4">
          <h2 className="flex items-center gap-2 font-bold"><Database size={18} /> Database objects</h2>
          <div className="mt-4 space-y-2">
            {["import", "design", "query", "report", "labels"].map((item) => (
              <button key={item} type="button" onClick={() => setPanel(item as typeof panel)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-bold capitalize ${panel === item ? "bg-ocean text-white" : "bg-white text-slate-700 hover:bg-mist"}`}>{item.replace("-", " ")}</button>
            ))}
          </div>
          <h3 className="mt-6 text-sm font-bold text-slate-600">Tables</h3>
          <div className="mt-2 space-y-2">
            {tables.length === 0 && <p className="rounded-lg border border-dashed border-line bg-white p-3 text-sm text-slate-500">No tables imported yet.</p>}
            {tables.map((table) => <button key={table.name} type="button" onClick={() => setSelectedTable(table.name)} className={`block w-full rounded-lg border p-3 text-left text-sm font-bold ${selectedTable === table.name ? "border-ocean bg-white text-ocean" : "border-line bg-white text-ink"}`}>{table.name}</button>)}
          </div>
        </div>

        <div className="min-h-0 overflow-auto p-5">
          {panel === "import" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><FileInput size={20} /> Import source files</h2><p className="mt-2 text-slate-600">Use the supplied Apex CSV-style files.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{sourceTables.map((table) => <button key={table.name} type="button" onClick={() => importTable(table.name)} className="rounded-lg border border-line bg-mist p-5 text-left hover:border-ocean"><p className="font-bold">{table.name}.csv</p><p className="mt-2 text-sm text-slate-600">{table.fields.map((field) => field.name).join(", ")}</p></button>)}</div></section>}

          {panel === "design" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><KeyRound size={20} /> Field design</h2>{selected ? <div className="mt-5 overflow-hidden rounded-lg border border-line"><table className="w-full text-sm"><thead className="bg-mist text-left"><tr><th className="p-3">Field name</th><th className="p-3">Data type</th><th className="p-3">Primary key</th></tr></thead><tbody>{fields.map((field) => <tr key={field.name} className="border-t border-line"><td className="p-3 font-bold">{field.name}</td><td className="p-3"><select value={field.type} onChange={(event) => updateField(field.name, { type: event.target.value })} className="rounded-md border border-line px-2 py-1"><option>Text</option><option>Number</option><option>Date/Time</option><option>Boolean</option><option>Currency</option></select></td><td className="p-3"><input type="radio" checked={field.primary} onChange={() => updateField(field.name, { primary: true })} /></td></tr>)}</tbody></table></div> : <p className="mt-5 text-slate-600">Import and select a table first.</p>}</section>}

          {panel === "query" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><Search size={20} /> Query builder</h2><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><label className="text-sm font-bold">Field<select value={query.field} onChange={(event) => setQuery({ ...query, field: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option value="">Choose field</option>{tables.flatMap((table) => table.fields).map((field) => <option key={`${field.name}-${field.type}`}>{field.name}</option>)}</select></label><label className="text-sm font-bold">Operator<select value={query.operator} onChange={(event) => setQuery({ ...query, operator: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>equals</option><option>contains</option><option>greater than</option><option>less than</option></select></label><label className="text-sm font-bold">Value<input value={query.value} onChange={(event) => setQuery({ ...query, value: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3" /></label><label className="text-sm font-bold">Join<select value={query.join} onChange={(event) => setQuery({ ...query, join: event.target.value as QueryState["join"] })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>AND</option><option>OR</option></select></label><label className="text-sm font-bold">Sort field<input value={query.sortField} onChange={(event) => setQuery({ ...query, sortField: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3" /></label><label className="text-sm font-bold">Sort direction<select value={query.sortDirection} onChange={(event) => setQuery({ ...query, sortDirection: event.target.value as QueryState["sortDirection"] })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>Ascending</option><option>Descending</option></select></label></div><label className="mt-4 block text-sm font-bold">Relationship field<input value={query.relationship} onChange={(event) => setQuery({ ...query, relationship: event.target.value })} className="mt-2 block w-full max-w-md rounded-lg border border-line p-3" placeholder="LearnerID" /></label></section>}

          {panel === "report" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><Rows3 size={20} /> Report preview</h2><label className="mt-5 block text-sm font-bold">Report title<input value={report.title} onChange={(event) => setReport({ ...report, title: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3" /></label><div className="mt-5 grid gap-3 md:grid-cols-3">{tables.flatMap((table) => table.fields).map((field) => <label key={`${field.name}-report`} className="rounded-lg border border-line p-3 text-sm font-bold"><input type="checkbox" checked={report.fields.includes(field.name)} onChange={() => toggleReportField(field.name)} className="mr-2" />{field.name}</label>)}</div><div className="mt-6 rounded-lg border border-line bg-white p-5"><h3 className="text-lg font-bold">{report.title || "Untitled report"}</h3><p className="mt-2 text-sm text-slate-600">Fields: {report.fields.join(", ") || "none selected"}</p></div></section>}

          {panel === "labels" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><Tags size={20} /> Labels</h2><label className="mt-5 block max-w-md text-sm font-bold">Label field<select value={report.labelField} onChange={(event) => setReport({ ...report, labelField: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option value="">Choose field</option>{tables.flatMap((table) => table.fields).map((field) => <option key={`${field.name}-label`}>{field.name}</option>)}</select></label><div className="mt-6 grid gap-3 md:grid-cols-3">{(selected?.rows || []).map((row, index) => <div key={index} className="rounded-lg border border-dashed border-line bg-mist p-4 text-sm font-bold">{report.labelField ? row[report.labelField] || report.labelField : "Label preview"}</div>)}</div></section>}

          <div className="mt-8 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-slate-700">
            <p className="flex items-center gap-2 font-bold text-ink"><Link2 size={16} /> Exam habit</p>
            <p className="mt-1">Final database evidence often needs design view, query criteria, report layout, and labels. Apex checks the result, then the teacher confirms presentation and evidence.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
