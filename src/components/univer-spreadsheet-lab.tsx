"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BarChart3, CheckCircle2, ChevronDown, ChevronLeft, ClipboardCheck, Download, Eraser, FileUp, Lock, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
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

type ChartType = "column" | "bar" | "pie";
type ChartSettings = {
  type: ChartType;
  sourceRange: string;
  title: string;
  categoryLabel: string;
  valueLabel: string;
  legend: boolean;
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

function getStarterWorkbook(moduleId?: string) {
  if (moduleId === "formatting") return makeWorkbook("Formatting");
  if (moduleId === "free-practice") return makeWorkbook("Free Practice", [["A1", "Paste or import data to begin"]]);
  return makeWorkbook(getSpreadsheetModule(moduleId)?.title || "Spreadsheet Practice");
}

function normalise(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function cellAddress(rowIndex: number, columnIndex: number) {
  let column = "";
  let value = columnIndex + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }
  return `${column}${rowIndex + 1}`;
}

function parseRange(range: string) {
  const match = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i.exec(range.trim());
  if (!match) return null;
  const startColumn = colToIndex(match[1]);
  const startRow = Number(match[2]) - 1;
  const endColumn = colToIndex(match[3]);
  const endRow = Number(match[4]) - 1;
  return {
    startRow: Math.min(startRow, endRow),
    endRow: Math.max(startRow, endRow),
    startColumn: Math.min(startColumn, endColumn),
    endColumn: Math.max(startColumn, endColumn)
  };
}

function readSnapshotCell(snapshot: unknown, cell: string) {
  if (!snapshot || typeof snapshot !== "object") return undefined;
  const workbook = snapshot as { sheetOrder?: string[]; sheets?: Record<string, { cellData?: Record<string, Record<string, { v?: unknown }>> }> };
  const sheetId = workbook.sheetOrder?.[0] || Object.keys(workbook.sheets || {})[0];
  const sheet = sheetId ? workbook.sheets?.[sheetId] : undefined;
  const match = /^([A-Z]+)(\d+)$/i.exec(cell);
  if (!sheet?.cellData || !match) return undefined;
  return sheet.cellData[String(Number(match[2]) - 1)]?.[String(colToIndex(match[1]))]?.v;
}

function chartDataFromSnapshot(snapshot: unknown, sourceRange: string) {
  const range = parseRange(sourceRange);
  if (!range) return [];

  const rows = [];
  for (let row = range.startRow + 1; row <= range.endRow; row += 1) {
    const label = String(readSnapshotCell(snapshot, cellAddress(row, range.startColumn)) ?? "");
    const value = Number(readSnapshotCell(snapshot, cellAddress(row, range.startColumn + 1)) ?? 0);
    if (label && Number.isFinite(value)) rows.push({ label, value });
  }
  return rows;
}

function ChartPreview({ type, data }: { type: ChartType; data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const colours = ["#0f7490", "#2f855a", "#d97706", "#7c3aed", "#dc2626"];

  if (!data.length) {
    return <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-line bg-mist text-sm font-semibold text-slate-500">Enter data and refresh preview</div>;
  }

  if (type === "pie") {
    let current = 0;
    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
    const stops = data.map((item, index) => {
      const start = current;
      current += (item.value / total) * 100;
      return `${colours[index % colours.length]} ${start}% ${current}%`;
    });
    return (
      <div className="grid gap-4">
        <div className="mx-auto h-56 w-56 rounded-full border border-line" style={{ background: `conic-gradient(${stops.join(", ")})` }} />
        <ChartLegend data={data} colours={colours} />
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div className="space-y-3 rounded-lg border border-line bg-white p-4">
        {data.map((item, index) => (
          <div key={item.label} className="grid grid-cols-[80px_minmax(0,1fr)_42px] items-center gap-2 text-xs">
            <span className="truncate font-semibold">{item.label}</span>
            <span className="h-7 rounded-sm" style={{ width: `${Math.max(8, (item.value / max) * 100)}%`, backgroundColor: colours[index % colours.length] }} />
            <span className="text-right font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-64 items-end gap-3 rounded-lg border border-line bg-white p-4">
      {data.map((item, index) => (
        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <span className="w-full rounded-t-sm" style={{ height: `${Math.max(16, (item.value / max) * 190)}px`, backgroundColor: colours[index % colours.length] }} />
          <span className="max-w-full truncate text-xs font-semibold">{item.label}</span>
          <span className="text-xs text-slate-500">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ChartLegend({ data, colours }: { data: Array<{ label: string; value: number }>; colours: string[] }) {
  return (
    <div className="grid gap-2 text-xs">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: colours[index % colours.length] }} />
            <span className="truncate">{item.label}</span>
          </span>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
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
  const [previewVersion, setPreviewVersion] = useState(0);
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    type: "column",
    sourceRange: "A1:B5",
    title: "",
    categoryLabel: "",
    valueLabel: "",
    legend: false
  });

  const moduleCardsForRoute = useMemo(() => getSpreadsheetCardsForModule(moduleId), [moduleId]);
  const currentModule = getSpreadsheetModule(moduleId);
  const isFreePractice = moduleId === "free-practice";
  const isChartModule = moduleId === "chart";
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
    setPreviewVersion(0);
    setChartSettings({
      type: "column",
      sourceRange: "A1:B5",
      title: "",
      categoryLabel: "",
      valueLabel: "",
      legend: false
    });
  }, [moduleId]);

  useEffect(() => {
    if (!card?.chartCheck) return;
    setChartSettings({
      type: card.chartCheck.type,
      sourceRange: card.chartCheck.sourceRange,
      title: "",
      categoryLabel: "",
      valueLabel: "",
      legend: false
    });
  }, [card?.id, card?.chartCheck]);

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
    const currentSnapshot = snapshot();
    const result = validateSpreadsheetResult(card, currentSnapshot);

    if (result.isCorrect && card.chartCheck) {
      const chartError = validateChartSettings(card.chartCheck, chartSettings, currentSnapshot);
      if (chartError) {
        setFeedback({
          isCorrect: false,
          canAutoCheck: true,
          message: chartError,
          nextStep: card.feedback.wrongResult
        });
        return;
      }
    }

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

  const chartData = isChartModule ? chartDataFromSnapshot(snapshot(), chartSettings.sourceRange) : [];
  const gridClass = isChartModule
    ? `grid h-[calc(100vh-120px)] min-h-[720px] gap-4 ${instructionsOpen ? "xl:grid-cols-[360px_minmax(0,1fr)_360px]" : "xl:grid-cols-[72px_minmax(0,1fr)_360px]"}`
    : `grid h-[calc(100vh-120px)] min-h-[720px] gap-4 ${instructionsOpen ? "xl:grid-cols-[380px_minmax(0,1fr)]" : "xl:grid-cols-[72px_minmax(0,1fr)]"}`;

  function validateChartSettings(expected: NonNullable<typeof card>["chartCheck"], settings: ChartSettings, currentSnapshot: unknown) {
    if (!expected) return "";

    if (settings.type !== expected.type) return `The chart type should be ${expected.type}.`;
    if (normalise(settings.sourceRange) !== normalise(expected.sourceRange)) return `The source range should be ${expected.sourceRange}.`;
    if (normalise(settings.title) !== normalise(expected.title)) return `The chart title should be ${expected.title}.`;
    if (expected.categoryLabel && normalise(settings.categoryLabel) !== normalise(expected.categoryLabel)) return `The category label should be ${expected.categoryLabel}.`;
    if (expected.valueLabel && normalise(settings.valueLabel) !== normalise(expected.valueLabel)) return `The value label should be ${expected.valueLabel}.`;
    if (expected.legend && !settings.legend) return "Show legend should be turned on.";
    if (!chartDataFromSnapshot(currentSnapshot, settings.sourceRange).length) return "The source range should contain labels and numeric values.";

    return "";
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
    <div className={gridClass}>
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
            <div className="border-b border-line px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <Pill>{currentModule?.title || card.category}</Pill>
                <span className="text-sm font-semibold text-slate-500">{activeIndex + 1}/{moduleCardsForRoute.length}</span>
              </div>
              <h1 className="mt-2 text-lg font-bold">Spreadsheet practice</h1>
              <p className="mt-1 text-sm leading-5 text-slate-600">Complete each goal to unlock the next task.</p>
              <div className="mt-3">
                <div className="mb-1.5 flex justify-between text-sm">
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
                    <li key={`${step}-${index}`} className="flex min-w-0 gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span>
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{step}</span>
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

      {isChartModule && (
        <Card className="flex min-h-0 flex-col overflow-hidden p-0">
          <div className="border-b border-line bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-ocean" aria-hidden="true" />
              <h2 className="font-semibold">Chart practice</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">Choose data and create a visual interpretation.</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-3">
              <label className="text-sm font-bold">
                Chart type
                <select
                  value={chartSettings.type}
                  onChange={(event) => setChartSettings((current) => ({ ...current, type: event.target.value as ChartType }))}
                  className="mt-2 block w-full rounded-lg border border-line bg-white p-3"
                >
                  <option value="column">Column chart</option>
                  <option value="bar">Bar chart</option>
                  <option value="pie">Pie chart</option>
                </select>
              </label>
              <label className="text-sm font-bold">
                Source range
                <input
                  value={chartSettings.sourceRange}
                  onChange={(event) => setChartSettings((current) => ({ ...current, sourceRange: event.target.value.toUpperCase() }))}
                  className="mt-2 block w-full rounded-lg border border-line p-3"
                  placeholder="A1:B5"
                />
              </label>
              <label className="text-sm font-bold">
                Chart title
                <input
                  value={chartSettings.title}
                  onChange={(event) => setChartSettings((current) => ({ ...current, title: event.target.value }))}
                  className="mt-2 block w-full rounded-lg border border-line p-3"
                  placeholder="Club Attendance"
                />
              </label>
              <label className="text-sm font-bold">
                Category label
                <input
                  value={chartSettings.categoryLabel}
                  onChange={(event) => setChartSettings((current) => ({ ...current, categoryLabel: event.target.value }))}
                  className="mt-2 block w-full rounded-lg border border-line p-3"
                  placeholder="Club"
                />
              </label>
              <label className="text-sm font-bold">
                Value label
                <input
                  value={chartSettings.valueLabel}
                  onChange={(event) => setChartSettings((current) => ({ ...current, valueLabel: event.target.value }))}
                  className="mt-2 block w-full rounded-lg border border-line p-3"
                  placeholder="Attendance"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={chartSettings.legend}
                  onChange={(event) => setChartSettings((current) => ({ ...current, legend: event.target.checked }))}
                  className="h-4 w-4"
                />
                Show legend
              </label>
              <button
                type="button"
                onClick={() => setPreviewVersion((value) => value + 1)}
                className="rounded-lg bg-ocean px-3 py-3 text-sm font-semibold text-white hover:bg-ocean/90"
              >
                Refresh chart preview
              </button>
            </div>

            <div className="mt-5 rounded-lg border border-line bg-mist p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-ink">{chartSettings.title || "Untitled chart"}</p>
                <p className="text-xs text-slate-600">{chartSettings.sourceRange || "No source range"} {previewVersion > 0 ? "" : ""}</p>
              </div>
              <ChartPreview type={chartSettings.type} data={chartData} />
              {(chartSettings.categoryLabel || chartSettings.valueLabel) && (
                <p className="mt-3 text-xs text-slate-600">
                  {chartSettings.categoryLabel || "Category"} compared with {chartSettings.valueLabel || "Value"}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
