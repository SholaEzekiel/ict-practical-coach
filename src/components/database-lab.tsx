"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, FileDown, FileInput, KeyRound, Link2, PanelLeftClose, PanelLeftOpen, Printer, Rows3, Search, Tags } from "lucide-react";
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

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function inferType(values: string[]) {
  const clean = values.filter(Boolean);
  if (clean.length && clean.every((value) => ["yes", "no", "true", "false"].includes(value.toLowerCase()))) return "Boolean";
  if (clean.length && clean.every((value) => !Number.isNaN(Number(value)))) return "Number";
  if (clean.length && clean.every((value) => !Number.isNaN(Date.parse(value)))) return "Date/Time";
  return "Text";
}

function tableFromCsv(name: string, text: string): DatabaseTable | null {
  const rows = parseCsv(text);
  const headers = rows[0]?.map((header, index) => header || `Field${index + 1}`);
  if (!headers?.length) return null;
  const dataRows = rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
  return {
    name,
    fields: headers.map((header, index) => ({
      name: header,
      type: inferType(dataRows.map((row) => row[header])),
      primary: index === 0
    })),
    rows: dataRows
  };
}

function compareValue(rawValue: string, operator: string, expected: string) {
  const value = rawValue || "";
  if (!expected) return true;
  if (operator === "contains") return value.toLowerCase().includes(expected.toLowerCase());
  if (operator === "greater than") return Number(value) > Number(expected);
  if (operator === "less than") return Number(value) < Number(expected);
  return value.toLowerCase() === expected.toLowerCase();
}

function validateDatabase(card: DatabaseCard, tables: DatabaseTable[], selectedTable: string, query: QueryState, report: ReportState, quizAnswer?: number): Feedback {
  const messages: string[] = [];
  const expected = card.expected;
  const allFields = tables.flatMap((table) => table.fields);
  const selected = tables.find((table) => table.name === selectedTable);

  if (card.quiz && quizAnswer !== card.quiz.correctIndex) {
    messages.push("Choose the correct knowledge-check answer.");
  }

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

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function DatabaseLab({ moduleId }: { moduleId?: string }) {
  const cards = useMemo(() => getDatabaseCardsForModule(moduleId), [moduleId]);
  const module = getDatabaseModule(moduleId) || getDatabaseModule(cards[0]?.moduleId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [panel, setPanel] = useState<"import" | "design" | "query" | "report" | "form" | "labels">("import");
  const [query, setQuery] = useState<QueryState>(defaultQuery);
  const [report, setReport] = useState<ReportState>(defaultReport);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mode, setMode] = useState<"study" | "practice">("study");
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const card = cards[activeIndex];
  const selected = tables.find((table) => table.name === selectedTable) || tables[0];
  const fields = selected?.fields || [];
  const currentComplete = card ? completed.includes(card.id) : false;
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;
  const queryRows = useMemo(() => {
    const rows = selected?.rows || [];
    const filtered = query.field ? rows.filter((row) => compareValue(row[query.field], query.operator, query.value)) : rows;
    const sorted = [...filtered];
    if (query.sortField) {
      sorted.sort((first, second) => {
        const firstValue = first[query.sortField] || "";
        const secondValue = second[query.sortField] || "";
        const result = Number.isNaN(Number(firstValue)) || Number.isNaN(Number(secondValue))
          ? firstValue.localeCompare(secondValue)
          : Number(firstValue) - Number(secondValue);
        return query.sortDirection === "Descending" ? -result : result;
      });
    }
    return sorted;
  }, [query, selected]);

  const sqlPreview = selected
    ? `SELECT ${report.fields.length ? report.fields.join(", ") : "*"} FROM ${selected.name}${query.field ? ` WHERE ${query.field} ${query.operator} "${query.value}"` : ""}${query.sortField ? ` ORDER BY ${query.sortField} ${query.sortDirection === "Descending" ? "DESC" : "ASC"}` : ""};`
    : "Import or select a table to generate a query.";

  function importTable(name: string) {
    const source = sourceTables.find((table) => table.name === name);
    if (!source) return;
    setTables((items) => items.some((table) => table.name === name) ? items : [...items, cloneTable(source)]);
    setSelectedTable(name);
    setPanel("design");
  }

  async function importCsvFile(file: File) {
    const text = await file.text();
    const name = file.name.replace(/\.csv$/i, "").replace(/[^a-z0-9_ -]/gi, "").trim() || "imported_table";
    const table = tableFromCsv(name, text);
    if (!table) return;
    setTables((items) => [...items.filter((item) => item.name !== table.name), table]);
    setSelectedTable(table.name);
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

  function printCurrentPanel() {
    window.print();
  }

  function rowsToTableHtml(rows: Record<string, string>[], headings: string[]) {
    const headerHtml = headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("");
    const bodyHtml = rows.map((row) => `<tr>${headings.map((heading) => `<td>${escapeHtml(row[heading] || "")}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
  }

  function openPdfEvidence(title: string, bodyHtml: string) {
    const preview = window.open("", "apex-database-pdf-evidence");
    if (!preview) return;

    preview.document.open();
    preview.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body{margin:0;background:#eef3f7;color:#14212b;font-family:Arial,Helvetica,sans-serif}
      .toolbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;background:#fff;border-bottom:1px solid #d9e2ea}
      .toolbar button{border:0;border-radius:8px;background:#0f6f8c;color:#fff;padding:10px 16px;font-weight:700;cursor:pointer}
      main{max-width:1100px;margin:28px auto;background:#fff;padding:32px;box-shadow:0 20px 60px rgba(15,23,42,.16)}
      h1{margin:0 0 18px;font-size:24px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{border:1px solid #9ca3af;padding:8px 10px;text-align:left;vertical-align:top}
      th{background:#eef3f7}
      .label-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      .label{border:1px dashed #9ca3af;padding:18px;min-height:60px;font-weight:700}
      @media print{body{background:white}.toolbar{display:none}main{box-shadow:none;margin:0;max-width:none;padding:0}}
    </style>
  </head>
  <body>
    <div class="toolbar"><strong>Apex database evidence</strong><button type="button" onclick="window.print()">Print / Save as PDF</button></div>
    <main><h1>${escapeHtml(title)}</h1>${bodyHtml}</main>
  </body>
</html>`);
    preview.document.close();
  }

  function openCurrentEvidence() {
    const tableHeadings = fields.map((field) => field.name);
    if (panel === "labels") {
      const labels = queryRows.map((row) => `<div class="label">${escapeHtml(report.labelField ? row[report.labelField] || "" : "Label preview")}</div>`).join("");
      openPdfEvidence("Database labels", `<div class="label-grid">${labels}</div>`);
      return;
    }

    if (panel === "form") {
      const forms = queryRows.map((row, index) => `<section><h2>${escapeHtml(selected?.name || "Record")} ${index + 1}</h2>${rowsToTableHtml([row], tableHeadings)}</section>`).join("");
      openPdfEvidence("Database record forms", forms || "<p>No records available.</p>");
      return;
    }

    if (panel === "report") {
      const headings = report.fields.length ? report.fields : tableHeadings;
      openPdfEvidence(report.title || "Database report", rowsToTableHtml(queryRows, headings));
      return;
    }

    if (panel === "query") {
      openPdfEvidence("Database query output", `<p><strong>Query:</strong> ${escapeHtml(sqlPreview)}</p>${rowsToTableHtml(queryRows, tableHeadings)}`);
      return;
    }

    openPdfEvidence(selected ? `${selected.name} table evidence` : "Database evidence", selected ? rowsToTableHtml(selected.rows, tableHeadings) : "<p>No table selected.</p>");
  }

  function checkWork() {
    if (!card) return;
    const result = validateDatabase(card, tables, selectedTable, query, report, quizAnswers[card.id]);
    setFeedback(result);
    if (result.ok) setCompleted((items) => items.includes(card.id) ? items : [...items, card.id]);
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    setActiveIndex((index) => index + 1);
    setFeedback(null);
  }

  if (!card) return null;

  const layoutClass = instructionsOpen
    ? "mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[420px_minmax(0,1fr)]"
    : "mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[72px_minmax(0,1fr)]";

  return (
    <div className={layoutClass}>
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        {instructionsOpen ? (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <button type="button" onClick={() => setInstructionsOpen(false)} className="inline-flex items-center gap-2 text-sm font-bold text-ocean">
                <PanelLeftClose size={17} /> Collapse Instructions
              </button>
            </div>
            <div className="border-b border-line p-5">
              <Link href="/subjects/ict/databases" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                <ArrowLeft size={16} aria-hidden="true" /> Database modules
              </Link>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
                <span className="text-sm font-semibold text-slate-600">{activeIndex + 1}/{cards.length}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                <button type="button" onClick={() => setMode("study")} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === "study" ? "bg-white text-ocean shadow-sm" : "text-slate-600"}`}>Study</button>
                <button type="button" onClick={() => setMode("practice")} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === "practice" ? "bg-white text-ocean shadow-sm" : "text-slate-600"}`}>Practice</button>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-ink">{card.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
              <div className="mt-4"><div className="mb-2 flex justify-between text-sm font-medium"><span>Progress</span><span>{completed.length}/{cards.length}</span></div><ProgressBar value={progress} /></div>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              {mode === "study" ? (
                <>
                  <section className="rounded-lg border border-line bg-mist p-4"><p className="text-xs font-bold uppercase tracking-wide text-ocean">Study focus</p><h2 className="mt-2 text-xl font-bold leading-8">{card.goal}</h2></section>
                  {card.accessPath && <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Access path</h3><div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-ocean">{card.accessPath.map((item, index) => <span key={`${item}-${index}`} className="inline-flex items-center gap-2"><span className="rounded-md bg-mist px-2 py-1">{item}</span>{index < card.accessPath!.length - 1 && <span className="text-slate-400">&gt;</span>}</span>)}</div></section>}
                  <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Support document</h3><div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{card.supportDocument.map((line) => <p key={line}>{line}</p>)}</div></section>
                  <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Steps</h3><ol className="mt-3 space-y-3">{card.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol></section>
                  {card.quiz && (
                    <section className="rounded-lg border border-line bg-white p-4">
                      <h3 className="font-bold">Knowledge check</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{card.quiz.question}</p>
                      <div className="mt-3 space-y-2">
                        {card.quiz.options.map((option, index) => (
                          <label key={option} className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm font-semibold ${quizAnswers[card.id] === index ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-slate-700"}`}>
                            <input type="radio" name={`quiz-${card.id}`} checked={quizAnswers[card.id] === index} onChange={() => setQuizAnswers((answers) => ({ ...answers, [card.id]: index }))} />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      {feedback?.ok && quizAnswers[card.id] === card.quiz.correctIndex && <p className="mt-3 text-sm font-semibold text-emerald-700">{card.quiz.feedback}</p>}
                    </section>
                  )}
                </>
              ) : (
                <>
                  <section className="rounded-lg border border-line bg-mist p-4"><p className="text-xs font-bold uppercase tracking-wide text-ocean">Practice focus</p><h2 className="mt-2 text-xl font-bold leading-8">Use the database workspace to try this process.</h2></section>
                  <section className="rounded-lg border border-line bg-white p-4"><h3 className="font-bold">Workspace guide</h3><ol className="mt-3 space-y-3">{["Choose the matching workspace panel on the right.", "Try the import, design, query, report, form, or label controls.", "Use Save PDF evidence when you need printable output.", "Return to Study mode to answer the knowledge check and unlock Next."].map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol></section>
                </>
              )}
              {card.teacherReview && <section className="rounded-lg border border-sky-200 bg-sky-50 p-4"><h3 className="font-bold">Teacher review</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">{card.teacherReview.map((item) => <li key={item}>{item}</li>)}</ul></section>}
              {feedback && <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3><ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">{feedback.messages.map((message) => <li key={message}>{message}</li>)}</ul></section>}
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-5">
              <button type="button" onClick={checkWork} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90"><CheckCircle2 size={18} aria-hidden="true" /> Check final result</button>
              <button type="button" onClick={nextCard} disabled={!currentComplete || activeIndex === cards.length - 1} className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Next</button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setInstructionsOpen(true)} className="flex h-full items-center justify-center text-ocean" title="Show Instructions">
            <PanelLeftOpen size={22} />
          </button>
        )}
      </aside>

      <section className="grid min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="border-r border-line bg-slate-50 p-4">
          <h2 className="flex items-center gap-2 font-bold"><Database size={18} /> Database objects</h2>
          <div className="mt-4 space-y-2">
            {["import", "design", "query", "report", "form", "labels"].map((item) => (
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
          {panel === "import" && <section><h2 className="flex items-center gap-2 text-xl font-bold"><FileInput size={20} /> Import source files</h2><p className="mt-2 text-slate-600">Import a real CSV file, or load an Apex practice source file.</p><label className="mt-5 block rounded-lg border border-dashed border-ocean bg-mist p-5 text-sm font-bold text-ocean"><input type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && importCsvFile(event.target.files[0])} className="sr-only" />Click to import a CSV file from your computer</label><div className="mt-5 grid gap-4 md:grid-cols-2">{sourceTables.map((table) => <button key={table.name} type="button" onClick={() => importTable(table.name)} className="rounded-lg border border-line bg-white p-5 text-left hover:border-ocean"><p className="font-bold">{table.name}.csv</p><p className="mt-2 text-sm text-slate-600">{table.fields.map((field) => field.name).join(", ")}</p></button>)}</div></section>}

          {panel === "design" && <section><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><KeyRound size={20} /> Field design</h2><button type="button" onClick={openCurrentEvidence} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"><FileDown size={16} /> Save PDF evidence</button></div>{selected ? <div className="mt-5 max-h-[calc(100vh-320px)] overflow-auto rounded-lg border border-line"><table className="w-full min-w-[680px] text-sm"><thead className="sticky top-0 bg-mist text-left"><tr><th className="p-3">Field name</th><th className="p-3">Data type</th><th className="p-3">Primary key</th></tr></thead><tbody>{fields.map((field) => <tr key={field.name} className="border-t border-line"><td className="p-3 font-bold">{field.name}</td><td className="p-3"><select value={field.type} onChange={(event) => updateField(field.name, { type: event.target.value })} className="rounded-md border border-line px-2 py-1"><option>Text</option><option>Number</option><option>Date/Time</option><option>Boolean</option><option>Currency</option></select></td><td className="p-3"><input type="radio" checked={field.primary} onChange={() => updateField(field.name, { primary: true })} /></td></tr>)}</tbody></table></div> : <p className="mt-5 text-slate-600">Import and select a table first.</p>}</section>}

          {panel === "query" && <section><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Search size={20} /> Query builder</h2><button type="button" onClick={openCurrentEvidence} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"><FileDown size={16} /> Save PDF evidence</button></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><label className="text-sm font-bold">Field<select value={query.field} onChange={(event) => setQuery({ ...query, field: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option value="">Choose field</option>{fields.map((field) => <option key={`${field.name}-${field.type}`}>{field.name}</option>)}</select></label><label className="text-sm font-bold">Operator<select value={query.operator} onChange={(event) => setQuery({ ...query, operator: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>equals</option><option>contains</option><option>greater than</option><option>less than</option></select></label><label className="text-sm font-bold">Value<input value={query.value} onChange={(event) => setQuery({ ...query, value: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3" /></label><label className="text-sm font-bold">Join<select value={query.join} onChange={(event) => setQuery({ ...query, join: event.target.value as QueryState["join"] })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>AND</option><option>OR</option></select></label><label className="text-sm font-bold">Sort field<select value={query.sortField} onChange={(event) => setQuery({ ...query, sortField: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option value="">No sort</option>{fields.map((field) => <option key={`${field.name}-sort`}>{field.name}</option>)}</select></label><label className="text-sm font-bold">Sort direction<select value={query.sortDirection} onChange={(event) => setQuery({ ...query, sortDirection: event.target.value as QueryState["sortDirection"] })} className="mt-2 block w-full rounded-lg border border-line p-3"><option>Ascending</option><option>Descending</option></select></label></div><label className="mt-4 block text-sm font-bold">Relationship field<input value={query.relationship} onChange={(event) => setQuery({ ...query, relationship: event.target.value })} className="mt-2 block w-full max-w-md rounded-lg border border-line p-3" placeholder="LearnerID" /></label><div className="mt-5 rounded-lg border border-line bg-mist p-4"><p className="text-sm font-bold text-ink">Generated query</p><code className="mt-2 block overflow-x-auto whitespace-pre-wrap text-sm text-slate-700">{sqlPreview}</code></div><div className="mt-5 max-h-[calc(100vh-520px)] min-h-[220px] overflow-auto rounded-lg border border-line"><table className="w-full min-w-[760px] text-sm"><thead className="sticky top-0 bg-mist text-left"><tr>{fields.map((field) => <th key={field.name} className="p-3">{field.name}</th>)}</tr></thead><tbody>{queryRows.map((row, index) => <tr key={index} className="border-t border-line">{fields.map((field) => <td key={field.name} className="p-3">{row[field.name]}</td>)}</tr>)}</tbody></table></div></section>}

          {panel === "report" && <section><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Rows3 size={20} /> Report preview</h2><div className="flex gap-2"><button type="button" onClick={openCurrentEvidence} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"><FileDown size={16} /> Save PDF evidence</button><button type="button" onClick={printCurrentPanel} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink"><Printer size={16} /> Print page</button></div></div><label className="mt-5 block text-sm font-bold">Report title<input value={report.title} onChange={(event) => setReport({ ...report, title: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3" /></label><div className="mt-5 grid gap-3 md:grid-cols-3">{fields.map((field) => <label key={`${field.name}-report`} className="rounded-lg border border-line p-3 text-sm font-bold"><input type="checkbox" checked={report.fields.includes(field.name)} onChange={() => toggleReportField(field.name)} className="mr-2" />{field.name}</label>)}</div><div className="mt-6 max-h-[calc(100vh-480px)] min-h-[260px] overflow-auto rounded-lg border border-line bg-white p-5"><h3 className="text-lg font-bold">{report.title || "Untitled report"}</h3><table className="mt-4 w-full min-w-[720px] text-sm"><thead className="sticky top-0"><tr>{(report.fields.length ? report.fields : fields.map((field) => field.name)).map((field) => <th key={field} className="border border-line bg-mist p-2 text-left">{field}</th>)}</tr></thead><tbody>{queryRows.map((row, index) => <tr key={index}>{(report.fields.length ? report.fields : fields.map((field) => field.name)).map((field) => <td key={field} className="border border-line p-2">{row[field]}</td>)}</tr>)}</tbody></table></div></section>}

          {panel === "form" && <section><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Rows3 size={20} /> Record form</h2><div className="flex gap-2"><button type="button" onClick={openCurrentEvidence} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"><FileDown size={16} /> Save PDF evidence</button><button type="button" onClick={printCurrentPanel} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink"><Printer size={16} /> Print page</button></div></div><p className="mt-2 text-slate-600">Preview the selected table as printable data-entry forms.</p><div className="mt-5 max-h-[calc(100vh-330px)] overflow-auto pr-2"><div className="grid min-w-[720px] gap-4 md:grid-cols-2">{queryRows.map((row, index) => <article key={index} className="rounded-lg border border-line bg-white p-5 shadow-sm"><h3 className="font-bold">{selected?.name || "Record"} {index + 1}</h3><dl className="mt-4 space-y-3">{fields.map((field) => <div key={field.name} className="grid grid-cols-[140px_1fr] gap-3 border-b border-line pb-2 text-sm"><dt className="font-bold text-slate-600">{field.name}</dt><dd>{row[field.name]}</dd></div>)}</dl></article>)}</div></div></section>}

          {panel === "labels" && <section><div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-bold"><Tags size={20} /> Labels</h2><div className="flex gap-2"><button type="button" onClick={openCurrentEvidence} className="inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"><FileDown size={16} /> Save PDF evidence</button><button type="button" onClick={printCurrentPanel} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink"><Printer size={16} /> Print page</button></div></div><label className="mt-5 block max-w-md text-sm font-bold">Label field<select value={report.labelField} onChange={(event) => setReport({ ...report, labelField: event.target.value })} className="mt-2 block w-full rounded-lg border border-line p-3"><option value="">Choose field</option>{fields.map((field) => <option key={`${field.name}-label`}>{field.name}</option>)}</select></label><div className="mt-6 max-h-[calc(100vh-350px)] overflow-auto pr-2"><div className="grid min-w-[720px] gap-3 md:grid-cols-3">{queryRows.map((row, index) => <div key={index} className="rounded-lg border border-dashed border-line bg-mist p-4 text-sm font-bold">{report.labelField ? row[report.labelField] || report.labelField : "Label preview"}</div>)}</div></div></section>}

          <div className="mt-8 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-slate-700">
            <p className="flex items-center gap-2 font-bold text-ink"><Link2 size={16} /> Exam habit</p>
            <p className="mt-1">Final Access evidence often needs import settings, Design View, query criteria, report layout, labels, print preview, and exported output. Apex checks the process knowledge, then the teacher confirms the real Microsoft Access evidence.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
