"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronLeft, ClipboardCheck, Download, Eraser, FileUp, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { validateSpreadsheetResult, type SpreadsheetResultFeedback } from "@/lib/spreadsheet-result-checker";
import { getSpreadsheetCardsForModule, getSpreadsheetModule } from "@/lib/spreadsheet-instruction-cards";
import { Card, Pill, ProgressBar } from "./ui";

type CellValue = string | number;
type CellData = Record<number, Record<number, { v?: CellValue; f?: string }>>;
type WorkbookSeed = {
  id: string;
  name: string;
  sheetOrder: string[];
  sheets: Record<string, { id: string; name: string; rowCount: number; columnCount: number; cellData: CellData }>;
};

type UniverApi = {
  createWorkbook?: (workbook: WorkbookSeed) => unknown;
  getActiveWorkbook?: () => {
    save?: () => unknown;
    getSnapshot?: () => unknown;
  } | null;
};

type UniverSpreadsheetLabProps = {
  moduleId?: string;
};

function colToIndex(column: string) {
  return column
    .toUpperCase()
    .split("")
    .reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function put(cells: CellData, cell: string, value: CellValue) {
  const match = /^([A-Z]+)(\d+)$/i.exec(cell);
  if (!match) return;
  const rowIndex = Number(match[2]) - 1;
  const columnIndex = colToIndex(match[1]);
  cells[rowIndex] ||= {};
  cells[rowIndex][columnIndex] = { v: value };
}

function makeWorkbook(name: string, cellEntries: Array<[string, CellValue]> = []): WorkbookSeed {
  const cellData: CellData = {};
  cellEntries.forEach(([cell, value]) => put(cellData, cell, value));

  return {
    id: `apex-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    sheetOrder: ["sheet-01"],
    sheets: {
      "sheet-01": {
        id: "sheet-01",
        name,
        rowCount: 60,
        columnCount: 18,
        cellData
      }
    }
  };
}

const formattingSeed: Array<[string, CellValue]> = [
  ["A1", "Club Attendance Summary"],
  ["A3", "Club"], ["B3", "Attendance"], ["C3", "Sessions"], ["D3", "Average"],
  ["A4", "Drama"], ["B4", 18], ["C4", 6], ["D4", 3],
  ["A5", "Robotics"], ["B5", 22], ["C5", 6], ["D5", 3.666666667],
  ["A6", "Coding"], ["B6", 16], ["C6", 5], ["D6", 3.2],
  ["A7", "Art"], ["B7", 20], ["C7", 5], ["D7", 4],
  ["A8", "Total"], ["B8", 76],
  ["A12", "Library Borrowing"], ["A14", "Category"], ["B14", "Borrowed"],
  ["A15", "Fiction"], ["B15", 34], ["A16", "History"], ["B16", 18], ["A17", "Science"], ["B17", 26], ["A18", "Art"], ["B18", 12],
  ["D12", "Canteen Sales"], ["D14", "Item"], ["E14", "Sold"],
  ["D15", "Sandwich"], ["E15", 45], ["D16", "Juice"], ["E16", 38], ["D17", "Fruit"], ["E17", 24], ["D18", "Water"], ["E18", 52],
  ["G14", "Completion"], ["H15", 0.72], ["H16", 0.68], ["H17", 0.81], ["H18", 0.59],
  ["F22", "Trip Register"], ["F24", "Name"], ["G24", "Class"], ["H24", "Paid"], ["F25", "Amara"], ["G25", "10A"], ["H25", "Yes"],
  ["A22", "ICT Stock Check"], ["A24", "Item"], ["B24", "In stock"], ["C24", "Needed"], ["A25", "Keyboard"], ["B25", 14], ["C25", 20], ["A26", "Mouse"], ["B26", 18], ["C26", 18], ["A27", "Monitor"], ["B27", 9], ["C27", 12], ["A28", "Cable"], ["B28", 42], ["C28", 40],
  ["A32", "Mini Budget"], ["B32", "Income"], ["C32", "Cost"], ["A33", "Tickets"], ["B33", 240], ["C33", 60], ["A34", "Refreshments"], ["B34", 90], ["C34", 45], ["A35", "Printing"], ["B35", 0], ["C35", 28],
  ["E32", "Name"], ["F32", "Present"], ["G32", "Late"], ["E33", "Lina"], ["F33", "Yes"], ["G33", "No"], ["E34", "Omar"], ["F34", "Yes"], ["G34", "Yes"], ["E35", "Tariq"], ["F35", "No"], ["G35", "No"],
  ["I32", "Learner"], ["J32", "Book title"], ["K32", "Pages read"], ["I33", "Amina"], ["J33", "River Run"], ["K33", 42], ["I34", "Joel"], ["J34", "Sky Map"], ["K34", 38], ["I35", "Priya"], ["J35", "Code Club"], ["K35", 51],
  ["A40", "Club Schedule"], ["A41", "Club"], ["B41", "Day"], ["C41", "Room"], ["A42", "Drama"], ["B42", "Monday"], ["C42", "Hall"], ["A43", "Robotics"], ["B43", "Tuesday"], ["C43", "Lab 1"],
  ["E40", "Device Loan"], ["E41", "Tablet"], ["F41", "Maya"], ["E42", "Camera"], ["F42", "Ben"], ["E43", "Laptop"], ["F43", "Sofia"],
  ["M40", "Final Format Check"], ["M41", "Skill"], ["N41", "Done"], ["O41", "Score"], ["M42", "Bold"], ["N42", "Yes"], ["O42", 2], ["M43", "Fill"], ["N43", "Yes"], ["O43", 2]
];

function getStarterWorkbook(moduleId?: string) {
  if (moduleId === "formatting") return makeWorkbook("Formatting", formattingSeed);
  if (moduleId === "free-practice") return makeWorkbook("Free Practice", [["A1", "Paste or import data to begin"]]);
  return makeWorkbook(getSpreadsheetModule(moduleId)?.title || "Spreadsheet Practice");
}

function parseCsv(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((row) => row.split(",").map((value) => value.trim()));
}

function workbookFromCsv(text: string) {
  const rows = parseCsv(text);
  const entries: Array<[string, CellValue]> = [];
  rows.slice(0, 60).forEach((row, rowIndex) => {
    row.slice(0, 18).forEach((value, columnIndex) => {
      if (!value) return;
      const column = String.fromCharCode(65 + columnIndex);
      const asNumber = Number(value);
      entries.push([`${column}${rowIndex + 1}`, Number.isFinite(asNumber) && value.match(/^-?\d+(\.\d+)?$/) ? asNumber : value]);
    });
  });
  return makeWorkbook("Imported Practice", entries);
}

function snapshotToCsv(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") return "";
  const workbook = snapshot as { sheetOrder?: string[]; sheets?: Record<string, { cellData?: Record<string, Record<string, { v?: unknown }>> }> };
  const sheetId = workbook.sheetOrder?.[0] || Object.keys(workbook.sheets || {})[0];
  const cellData = sheetId ? workbook.sheets?.[sheetId]?.cellData || {} : {};
  const rows: string[][] = [];
  for (let row = 0; row < 60; row += 1) {
    const values = [];
    for (let column = 0; column < 18; column += 1) {
      values.push(String(cellData[String(row)]?.[String(column)]?.v ?? ""));
    }
    rows.push(values);
  }
  while (rows.length && rows[rows.length - 1].every((value) => !value)) rows.pop();
  return rows.map((row) => row.map((value) => (value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value)).join(",")).join("\n");
}

export function UniverSpreadsheetLab({ moduleId }: UniverSpreadsheetLabProps) {
  const reactId = useId().replaceAll(":", "");
  const containerId = `univer-${reactId}`;
  const univerApiRef = useRef<UniverApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<SpreadsheetResultFeedback | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [ready, setReady] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [csvText, setCsvText] = useState("");

  const moduleCardsForRoute = useMemo(() => getSpreadsheetCardsForModule(moduleId), [moduleId]);
  const currentModule = getSpreadsheetModule(moduleId);
  const isFreePractice = moduleId === "free-practice";
  const card = moduleCardsForRoute[activeIndex];
  const currentCardComplete = card ? completed.includes(card.id) : false;
  const completedModuleCards = moduleCardsForRoute.filter((task) => completed.includes(task.id)).length;
  const progressValue = moduleCardsForRoute.length ? (completedModuleCards / moduleCardsForRoute.length) * 100 : 0;

  useEffect(() => {
    setActiveIndex(0);
    setFeedback(null);
    setCompleted([]);
    setPoints(0);
    setCsvText("");
  }, [moduleId]);

  useEffect(() => {
    let disposed = false;

    async function bootUniver() {
      const [{ createUniver, LocaleType, mergeLocales }, { UniverSheetsCorePreset }, locale] = await Promise.all([
        import("@univerjs/presets"),
        import("@univerjs/preset-sheets-core"),
        import("@univerjs/preset-sheets-core/locales/en-US")
      ]);

      if (disposed) return;

      const { univerAPI } = createUniver({
        locale: LocaleType.EN_US,
        locales: {
          [LocaleType.EN_US]: mergeLocales(locale.default)
        },
        presets: [
          UniverSheetsCorePreset({
            container: containerId
          })
        ]
      });

      univerAPI.createWorkbook(getStarterWorkbook(moduleId));
      univerApiRef.current = univerAPI;
      setReady(true);
    }

    bootUniver().catch(() => setReady(false));

    return () => {
      disposed = true;
    };
  }, [containerId, moduleId]);

  function snapshot() {
    const workbook = univerApiRef.current?.getActiveWorkbook?.();
    return workbook?.save?.() || workbook?.getSnapshot?.();
  }

  function loadWorkbook(workbook: WorkbookSeed) {
    univerApiRef.current?.createWorkbook?.(workbook);
  }

  function checkWork() {
    if (!card) return;
    const result = validateSpreadsheetResult(card, snapshot());
    setFeedback(result);

    if (result.isCorrect && !completed.includes(card.id)) {
      setCompleted((current) => [...current, card.id]);
      setPoints((value) => value + card.marks * 10);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 900);
    }
  }

  function previousCard() {
    setFeedback(null);
    setActiveIndex((value) => Math.max(value - 1, 0));
  }

  function nextCard() {
    setFeedback(null);
    setActiveIndex((value) => Math.min(value + 1, moduleCardsForRoute.length - 1));
  }

  function importCsv() {
    if (!csvText.trim()) return;
    const rows = parseCsv(csvText);
    if (rows.length > 60 || rows.some((row) => row.length > 18)) {
      setFeedback({
        isCorrect: false,
        canAutoCheck: true,
        message: "Imported data is too large for this practice grid.",
        nextStep: "Use no more than 60 rows and 18 columns, then import again."
      });
      return;
    }
    loadWorkbook(workbookFromCsv(csvText));
    setFeedback({
      isCorrect: true,
      canAutoCheck: true,
      message: "CSV data imported.",
      nextStep: "You can now edit, format, sort, or practise formulae freely."
    });
  }

  function downloadCsv() {
    const csv = snapshotToCsv(snapshot());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "apex-free-practice.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (isFreePractice) {
    return (
      <div className="grid h-[calc(100vh-120px)] min-h-[720px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="flex min-h-0 flex-col overflow-hidden p-0">
          <div className="border-b border-line p-4">
            <Pill>Free Practice</Pill>
            <h1 className="mt-3 text-xl font-bold">Spreadsheet free practice</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Import or paste data, practise freely, then download your work. This module does not affect lesson progress.</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <label className="text-sm font-bold text-ink" htmlFor="csv-input">Paste CSV data</label>
            <textarea
              id="csv-input"
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              placeholder={"Name,Score\nAmina,18\nDaniel,22"}
              className="mt-2 min-h-40 w-full rounded-lg border border-line p-3 text-sm outline-none focus:border-ocean"
            />
            {feedback && (
              <div className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${feedback.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`} role="status">
                <p className="font-semibold">{feedback.message}</p>
                <p className="mt-1 text-slate-700">{feedback.nextStep}</p>
              </div>
            )}
          </div>
          <div className="grid gap-3 border-t border-line bg-white p-4">
            <button onClick={importCsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-3 py-3 text-sm font-semibold text-white hover:bg-leaf/90">
              <FileUp size={16} /> Import CSV
            </button>
            <button onClick={() => loadWorkbook(getStarterWorkbook("free-practice"))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-3 text-sm font-semibold text-ink hover:border-ocean">
              <Eraser size={16} /> Clear worksheet
            </button>
            <button onClick={downloadCsv} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-3 py-3 text-sm font-semibold text-white">
              <Download size={16} /> Download CSV
            </button>
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
            <div>
              <h2 className="font-semibold">Spreadsheet workspace</h2>
              <p className="text-sm text-slate-600">{ready ? "Free Practice workspace" : "Loading spreadsheet engine..."}</p>
            </div>
            <Link href="/subjects/ict/spreadsheets" className="text-sm font-semibold text-ocean hover:underline">Modules</Link>
          </div>
          <div id={containerId} className="min-h-0 flex-1 bg-white" />
        </Card>
      </div>
    );
  }

  if (!card) {
    return (
      <Card>
        <h1 className="text-2xl font-bold">No spreadsheet goals found.</h1>
        <Link href="/subjects/ict/spreadsheets" className="mt-4 inline-flex font-semibold text-ocean">Back to modules</Link>
      </Card>
    );
  }

  return (
    <div className={`grid h-[calc(100vh-120px)] min-h-[720px] gap-4 ${instructionsOpen ? "xl:grid-cols-[380px_minmax(0,1fr)]" : "xl:grid-cols-[72px_minmax(0,1fr)]"}`}>
      <Card className="flex min-h-0 flex-col overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setInstructionsOpen((value) => !value)}
          className="flex items-center justify-between border-b border-line p-3 text-sm font-semibold text-ocean"
        >
          <span>{instructionsOpen ? "Hide guide" : "Guide"}</span>
          {instructionsOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        {instructionsOpen && (
          <>
            <div className="border-b border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <Pill>{currentModule?.title || card.category}</Pill>
                <span className="text-sm font-semibold text-slate-500">{activeIndex + 1}/{moduleCardsForRoute.length}</span>
              </div>
              <h1 className="mt-3 text-xl font-bold">Spreadsheet practice</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">Complete each goal to unlock the next task.</p>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Module progress</span>
                  <span>{completedModuleCards}/{moduleCardsForRoute.length}</span>
                </div>
                <ProgressBar value={progressValue} />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="rounded-lg border border-line bg-gradient-to-br from-mist to-white p-4">
                <p className="text-sm font-semibold text-ocean">Goal</p>
                <h2 className="mt-2 text-xl font-bold">{card.studentGoal}</h2>
                {card.scenario && <p className="mt-3 text-sm leading-6 text-slate-600">{card.scenario}</p>}
              </div>

              <div className="mt-4 rounded-lg border border-line bg-white p-4">
                <p className="text-sm font-semibold text-ink">Steps</p>
                <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                  {card.studentSteps.map((step, index) => (
                    <li key={`${step}-${index}`} className="flex gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {feedback && (
                <div className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${feedback.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`} role="status">
                  <p className="font-semibold">{feedback.message}</p>
                  <p className="mt-1 text-slate-700">{feedback.nextStep}</p>
                  <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-ocean">
                    <ChevronDown size={14} /> Expected: {card.expectedResult}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-line bg-white p-4">
              <div className="relative">
                {celebrating && (
                  <div className="pointer-events-none absolute inset-x-0 -top-8 flex justify-center">
                    <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 shadow-soft">+{card.marks * 10} points</span>
                  </div>
                )}
                <button onClick={checkWork} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-3 py-3 text-sm font-semibold text-white hover:bg-leaf/90">
                  {card.autoCheck ? <CheckCircle2 size={16} /> : <ClipboardCheck size={16} />}
                  Check my result
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Sparkles size={16} className="text-amber" /> {points} points
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={previousCard}
                    disabled={activeIndex === 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    onClick={nextCard}
                    disabled={activeIndex === moduleCardsForRoute.length - 1}
                    className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card className="flex min-h-0 flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
          <div>
            <h2 className="font-semibold">Spreadsheet workspace</h2>
            <p className="text-sm text-slate-600">{ready ? `${currentModule?.title || "Module"} workspace` : "Loading spreadsheet engine..."}</p>
          </div>
          <Link href="/subjects/ict/spreadsheets" className="text-sm font-semibold text-ocean hover:underline">Modules</Link>
        </div>
        <div id={containerId} className="min-h-0 flex-1 bg-white" />
      </Card>
    </div>
  );
}
