"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BarChart3, CheckCircle2, ChevronDown, ChevronLeft, ClipboardCheck, Download, Eraser, FileUp, PanelLeftClose, PanelLeftOpen, Printer, Sparkles } from "lucide-react";
import { validateSpreadsheetResult, type SpreadsheetResultFeedback } from "@/lib/spreadsheet-result-checker";
import { getSpreadsheetCardsForModule, getSpreadsheetModule } from "@/lib/spreadsheet-instruction-cards";
import { PracticeTimer } from "@/components/practice-timer";
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
type PrintSettings = {
  orientation: "Portrait" | "Landscape";
  printArea: string;
  scaleWidth: "Auto" | "1 page";
  gridlines: boolean;
  headings: boolean;
  showFormulas: boolean;
  repeatRows: string;
  headerText: string;
  footerText: string;
};
type QuizScore = {
  correct: number;
  attempted: number;
};

const spreadsheetQuizScoreStorageKey = "peak-spreadsheet-quiz-scoreboard";

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
  if (moduleId === "layout") {
    return makeWorkbook("Print Layout", [
      ["A1", "Club"], ["B1", "Attendance"], ["C1", "Sessions"], ["D1", "Average"], ["E1", "Coach"], ["F1", "Room"],
      ["A2", "Drama"], ["B2", 18], ["C2", 6], ["D2", 3], ["E2", "Mr Lee"], ["F2", "Hall"],
      ["A3", "Robotics"], ["B3", 22], ["C3", 6], ["D3", 3.67], ["E3", "Ms Patel"], ["F3", "Lab 1"],
      ["A4", "Coding"], ["B4", 16], ["C4", 5], ["D4", 3.2], ["E4", "Mr Obi"], ["F4", "Lab 2"],
      ["A5", "Art"], ["B5", 20], ["C5", 5], ["D5", 4], ["E5", "Mrs Green"], ["F5", "Room 3"],
      ["A7", "Total"], ["B7", 76], ["C7", 22], ["D7", 3.45],
      ["A10", "Print notes"], ["A11", "Use print settings to control output evidence."], ["A12", "Check preview before saving PDF."]
    ]);
  }
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

function readSnapshotCellDisplay(snapshot: unknown, rowIndex: number, columnIndex: number, showFormulas = false) {
  if (!snapshot || typeof snapshot !== "object") return "";
  const workbook = snapshot as { sheetOrder?: string[]; sheets?: Record<string, { cellData?: Record<string, Record<string, { v?: unknown; f?: unknown }>> }> };
  const sheetId = workbook.sheetOrder?.[0] || Object.keys(workbook.sheets || {})[0];
  const cell = sheetId ? workbook.sheets?.[sheetId]?.cellData?.[String(rowIndex)]?.[String(columnIndex)] : undefined;
  return String((showFormulas && cell?.f ? `=${cell.f}` : cell?.v) ?? "");
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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character] || character));
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
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    orientation: "Portrait",
    printArea: "",
    scaleWidth: "Auto",
    gridlines: false,
    headings: false,
    showFormulas: false,
    repeatRows: "",
    headerText: "",
    footerText: ""
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizScore>>({});

  const moduleCardsForRoute = useMemo(() => getSpreadsheetCardsForModule(moduleId), [moduleId]);
  const currentModule = getSpreadsheetModule(moduleId);
  const isFreePractice = moduleId === "free-practice";
  const isChartModule = moduleId === "chart";
  const isLayoutModule = moduleId === "layout";
  const card = moduleCardsForRoute[activeIndex];
  const currentCardComplete = card ? completed.includes(card.id) : false;
  const completedModuleCards = moduleCardsForRoute.filter((task) => completed.includes(task.id)).length;
  const progressValue = moduleCardsForRoute.length ? (completedModuleCards / moduleCardsForRoute.length) * 100 : 0;
  const quizScore = quizAttempts[moduleId || "spreadsheets"] || { correct: 0, attempted: 0 };
  const quizAccuracy = quizScore.attempted ? Math.round((quizScore.correct / quizScore.attempted) * 100) : 0;

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
    setPrintSettings({
      orientation: "Portrait",
      printArea: "",
      scaleWidth: "Auto",
      gridlines: false,
      headings: false,
      showFormulas: false,
      repeatRows: "",
      headerText: "",
      footerText: ""
    });
  }, [moduleId]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(spreadsheetQuizScoreStorageKey);
      if (saved) setQuizAttempts(JSON.parse(saved) as Record<string, QuizScore>);
    } catch {
      window.localStorage.removeItem(spreadsheetQuizScoreStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(spreadsheetQuizScoreStorageKey, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

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

    if (card.quiz) {
      const selectedAnswer = quizAnswers[card.id];
      const isCorrect = selectedAnswer === card.quiz.correctIndex;
      const result = {
        isCorrect,
        canAutoCheck: true,
        message: isCorrect ? "Correct answer." : "That answer is not correct yet.",
        nextStep: isCorrect ? card.quiz.feedback : "Review the study steps, then choose the option that matches the print instruction."
      };

      setFeedback(result);

      if (isCorrect && !completed.includes(card.id)) {
        setCompleted((current) => [...current, card.id]);
        setPoints((value) => value + card.marks * 10);
        setCelebrating(true);
        window.setTimeout(() => setCelebrating(false), 900);
      }
      return;
    }

    const currentSnapshot = snapshot();
    const result = validateSpreadsheetResult(card, currentSnapshot);

    if (result.isCorrect && card.printCheck) {
      const printError = validatePrintSettings(card.printCheck, printSettings);
      if (printError) {
        setFeedback({
          isCorrect: false,
          canAutoCheck: true,
          message: printError,
          nextStep: card.feedback.wrongResult
        });
        return;
      }
    }

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

  function chooseQuizAnswer(answerIndex: number) {
    if (!card?.quiz || quizAnswers[card.id] !== undefined) return;
    const scoreKey = moduleId || "spreadsheets";
    setQuizAnswers((answers) => ({ ...answers, [card.id]: answerIndex }));
    setQuizAttempts((scores) => {
      const current = scores[scoreKey] || { correct: 0, attempted: 0 };
      return {
        ...scores,
        [scoreKey]: {
          correct: current.correct + (answerIndex === card.quiz!.correctIndex ? 1 : 0),
          attempted: current.attempted + 1
        }
      };
    });
  }

  function previousCard() {
    setFeedback(null);
    setActiveIndex((value) => Math.max(value - 1, 0));
  }

  function nextCard() {
    if (!currentCardComplete || activeIndex === moduleCardsForRoute.length - 1) return;
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
    link.download = "peak-free-practice.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function openPrintPreview() {
    const currentSnapshot = snapshot();
    const selectedRange = parseRange(printSettings.printArea || "A1:F12") || { startRow: 0, endRow: 11, startColumn: 0, endColumn: 5 };
    const rows = [];

    for (let row = selectedRange.startRow; row <= selectedRange.endRow; row += 1) {
      const cells = [];
      for (let column = selectedRange.startColumn; column <= selectedRange.endColumn; column += 1) {
        cells.push(readSnapshotCellDisplay(currentSnapshot, row, column, printSettings.showFormulas));
      }
      rows.push(cells);
    }

    const columnCount = Math.max(...rows.map((row) => row.length), 1);
    const headingRow = printSettings.headings
      ? `<tr><th></th>${Array.from({ length: columnCount }, (_, index) => `<th>${escapeHtml(cellAddress(0, selectedRange.startColumn + index).replace(/\d+$/, ""))}</th>`).join("")}</tr>`
      : "";
    const bodyRows = rows.map((row, rowIndex) => (
      `<tr>${printSettings.headings ? `<th>${selectedRange.startRow + rowIndex + 1}</th>` : ""}${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )).join("");
    const preview = window.open("", "peak-study-spreadsheet-print", "width=1100,height=800");

    if (!preview) {
      setFeedback({
        isCorrect: false,
        canAutoCheck: true,
        message: "The print preview was blocked by the browser.",
        nextStep: "Allow pop-ups for this site, then open the print preview again."
      });
      return;
    }

    preview.document.write(`<!doctype html>
      <html>
        <head>
          <title>Spreadsheet print preview</title>
          <style>
            @page { size: A4 ${printSettings.orientation.toLowerCase()}; margin: 14mm; }
            * { box-sizing: border-box; }
            body { margin: 0; background: #eef2f7; color: #111827; font-family: Arial, sans-serif; }
            .toolbar { position: sticky; top: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 18px; background: #0f172a; color: #fff; }
            .toolbar button { border: 0; border-radius: 8px; background: #0f7490; color: #fff; cursor: pointer; font-weight: 700; padding: 10px 14px; }
            .sheet { width: ${printSettings.orientation === "Landscape" ? "297mm" : "210mm"}; min-height: ${printSettings.orientation === "Landscape" ? "210mm" : "297mm"}; margin: 18px auto; background: #fff; padding: 18mm; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.15); }
            .sheet-header, .sheet-footer { min-height: 24px; color: #334155; font-size: 12px; }
            .sheet-footer { margin-top: 16px; text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; ${printSettings.scaleWidth === "1 page" ? "table-layout: fixed;" : ""} }
            th, td { border: ${printSettings.gridlines || printSettings.headings ? "1px solid #94a3b8" : "1px solid transparent"}; min-width: 42px; padding: 6px 8px; text-align: left; vertical-align: top; word-break: break-word; }
            th { background: #f1f5f9; font-weight: 700; }
            @media print {
              body { background: #fff; }
              .toolbar { display: none; }
              .sheet { width: auto; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <strong>Spreadsheet print preview</strong>
            <button type="button" onclick="window.print()">Print / Save as PDF</button>
          </div>
          <main class="sheet">
            <div class="sheet-header">${escapeHtml(printSettings.headerText || "Peak Study Hub")}</div>
            <table aria-label="Spreadsheet print area">
              <thead>${headingRow}</thead>
              <tbody>${bodyRows}</tbody>
            </table>
            <div class="sheet-footer">${escapeHtml(printSettings.footerText || "Page 1")}</div>
          </main>
        </body>
      </html>`);
    preview.document.close();
  }

  const chartData = isChartModule ? chartDataFromSnapshot(snapshot(), chartSettings.sourceRange) : [];
  const gridClass = isChartModule
    ? `grid gap-4 lg:h-[calc(100svh-120px)] lg:min-h-[640px] ${instructionsOpen ? "lg:grid-cols-[340px_minmax(0,1fr)_320px]" : "lg:grid-cols-[72px_minmax(0,1fr)_320px]"}`
    : isLayoutModule
      ? `grid gap-4 lg:h-[calc(100svh-120px)] lg:min-h-[640px] ${instructionsOpen ? "lg:grid-cols-[340px_minmax(0,1fr)_300px]" : "lg:grid-cols-[72px_minmax(0,1fr)_300px]"}`
      : `grid gap-4 lg:h-[calc(100svh-120px)] lg:min-h-[640px] ${instructionsOpen ? "lg:grid-cols-[360px_minmax(0,1fr)]" : "lg:grid-cols-[72px_minmax(0,1fr)]"}`;

  function validatePrintSettings(expected: NonNullable<typeof card>["printCheck"], settings: PrintSettings) {
    if (!expected) return "";
    const same = (actual: string, target: string) => normalise(actual) === normalise(target);

    if (expected.orientation && settings.orientation !== expected.orientation) return `Orientation should be ${expected.orientation}.`;
    if (expected.printArea && !same(settings.printArea, expected.printArea)) return `Print area should be ${expected.printArea}.`;
    if (expected.scaleWidth && settings.scaleWidth !== expected.scaleWidth) return `Width should be set to ${expected.scaleWidth}.`;
    if (expected.gridlines !== undefined && settings.gridlines !== expected.gridlines) return expected.gridlines ? "Printed gridlines should be turned on." : "Printed gridlines should be turned off.";
    if (expected.headings !== undefined && settings.headings !== expected.headings) return expected.headings ? "Row and column headings should be turned on." : "Row and column headings should be turned off.";
    if (expected.showFormulas !== undefined && settings.showFormulas !== expected.showFormulas) return expected.showFormulas ? "Show formulas should be turned on." : "Show formulas should be turned off.";
    if (expected.repeatRows && !same(settings.repeatRows, expected.repeatRows)) return `Rows to repeat at top should be ${expected.repeatRows}.`;
    if (expected.headerText && !normalise(settings.headerText).includes(normalise(expected.headerText))) return `Header text should include ${expected.headerText}.`;
    if (expected.footerText && !normalise(settings.footerText).includes(normalise(expected.footerText))) return `Footer text should include ${expected.footerText}.`;

    return "";
  }

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
      <div className="grid gap-4 lg:h-[calc(100svh-120px)] lg:min-h-[640px] lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="flex min-h-[560px] flex-col overflow-hidden p-0 lg:min-h-0">
          <div className="border-b border-line p-4">
            <Pill>Free Practice</Pill>
            <h1 className="mt-3 text-xl font-bold">Spreadsheet free practice</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Import or paste data, practise freely, then download your work. This module does not affect lesson progress.</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <PracticeTimer compact />
            <div className="mt-4">
            <label className="text-sm font-bold text-ink" htmlFor="csv-input">Paste CSV data</label>
            <textarea
              id="csv-input"
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              placeholder={"Name,Score\nAmina,18\nDaniel,22"}
              className="mt-2 min-h-40 w-full rounded-lg border border-line p-3 text-sm outline-none focus:border-ocean"
            />
            </div>
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

        <Card className="flex min-h-[560px] flex-col overflow-hidden p-0 lg:min-h-0">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
            <div>
              <h2 className="font-semibold">Spreadsheet workspace</h2>
              <p className="text-sm text-slate-600">{ready ? "Free Practice workspace" : "Loading spreadsheet engine..."}</p>
            </div>
            <Link href="/subjects/ict/spreadsheets" className="text-sm font-semibold text-ocean hover:underline">Modules</Link>
          </div>
          <div id={containerId} className="min-h-0 flex-1 overflow-auto bg-white" />
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
      <Card className="flex min-h-[560px] flex-col overflow-hidden p-0 lg:min-h-0">
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

              {card.quiz && (
                <div className="mt-4 rounded-lg border border-line bg-white p-4">
                  <div className="mb-4 rounded-lg border border-line bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-ink">Scoreboard</p>
                      <button
                        type="button"
                        onClick={() => setQuizAttempts((scores) => ({ ...scores, [moduleId || "spreadsheets"]: { correct: 0, attempted: 0 } }))}
                        className="text-xs font-bold text-ocean hover:text-ocean/80"
                      >
                        Reset module score
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md bg-white p-2">
                        <p className="text-lg font-black text-ocean">{quizScore.correct}</p>
                        <p className="text-[11px] font-semibold text-slate-600">Correct</p>
                      </div>
                      <div className="rounded-md bg-white p-2">
                        <p className="text-lg font-black text-ink">{quizScore.attempted}</p>
                        <p className="text-[11px] font-semibold text-slate-600">Answered</p>
                      </div>
                      <div className="rounded-md bg-white p-2">
                        <p className="text-lg font-black text-leaf">{quizAccuracy}%</p>
                        <p className="text-[11px] font-semibold text-slate-600">Accuracy</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-ink">Knowledge check</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.quiz.question}</p>
                  <div className="mt-3 grid gap-2">
                    {card.quiz.options.map((option, index) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm font-semibold ${quizAnswers[card.id] === index ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-slate-700"}`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${card.id}`}
                          checked={quizAnswers[card.id] === index}
                          onChange={() => chooseQuizAnswer(index)}
                          disabled={quizAnswers[card.id] !== undefined}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                  {card.autoCheck || card.quiz ? <CheckCircle2 size={16} /> : <ClipboardCheck size={16} />}
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
                    disabled={!currentCardComplete || activeIndex === moduleCardsForRoute.length - 1}
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

      <Card className="flex min-h-[560px] flex-col overflow-hidden p-0 lg:min-h-0">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
          <div>
            <h2 className="font-semibold">Spreadsheet workspace</h2>
            <p className="text-sm text-slate-600">{ready ? `${currentModule?.title || "Module"} workspace` : "Loading spreadsheet engine..."}</p>
          </div>
          <Link href="/subjects/ict/spreadsheets" className="text-sm font-semibold text-ocean hover:underline">Modules</Link>
        </div>
        <div id={containerId} className="min-h-0 flex-1 overflow-auto bg-white" />
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

      {isLayoutModule && (
        <Card className="flex min-h-0 flex-col overflow-hidden p-0">
          <div className="border-b border-line bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <Printer size={18} className="text-ocean" aria-hidden="true" />
              <h2 className="font-semibold">Print setup</h2>
            </div>
            <p className="mt-1 text-sm text-slate-600">Prepare the worksheet for print or PDF evidence.</p>
            <button
              type="button"
              onClick={openPrintPreview}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ocean px-3 py-2.5 text-sm font-semibold text-white hover:bg-ocean/90"
            >
              <Printer size={16} aria-hidden="true" />
              Open print preview
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-3">
              <label className="text-sm font-bold">
                Orientation
                <select
                  value={printSettings.orientation}
                  onChange={(event) => setPrintSettings((current) => ({ ...current, orientation: event.target.value as PrintSettings["orientation"] }))}
                  className="mt-2 block w-full rounded-lg border border-line bg-white p-3"
                >
                  <option>Portrait</option>
                  <option>Landscape</option>
                </select>
              </label>
              <label className="text-sm font-bold">
                Print area
                <input value={printSettings.printArea} onChange={(event) => setPrintSettings((current) => ({ ...current, printArea: event.target.value.toUpperCase() }))} className="mt-2 block w-full rounded-lg border border-line p-3" placeholder="A1:F12" />
              </label>
              <label className="text-sm font-bold">
                Width
                <select
                  value={printSettings.scaleWidth}
                  onChange={(event) => setPrintSettings((current) => ({ ...current, scaleWidth: event.target.value as PrintSettings["scaleWidth"] }))}
                  className="mt-2 block w-full rounded-lg border border-line bg-white p-3"
                >
                  <option>Auto</option>
                  <option>1 page</option>
                </select>
              </label>
              <div className="grid gap-2 rounded-lg border border-line bg-white p-3">
                <label className="inline-flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={printSettings.gridlines} onChange={(event) => setPrintSettings((current) => ({ ...current, gridlines: event.target.checked }))} className="h-4 w-4" />
                  Print gridlines
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={printSettings.headings} onChange={(event) => setPrintSettings((current) => ({ ...current, headings: event.target.checked }))} className="h-4 w-4" />
                  Print headings
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={printSettings.showFormulas} onChange={(event) => setPrintSettings((current) => ({ ...current, showFormulas: event.target.checked }))} className="h-4 w-4" />
                  Show formulas
                </label>
              </div>
              <label className="text-sm font-bold">
                Rows to repeat at top
                <input value={printSettings.repeatRows} onChange={(event) => setPrintSettings((current) => ({ ...current, repeatRows: event.target.value }))} className="mt-2 block w-full rounded-lg border border-line p-3" placeholder="$1:$1" />
              </label>
              <label className="text-sm font-bold">
                Header
                <input value={printSettings.headerText} onChange={(event) => setPrintSettings((current) => ({ ...current, headerText: event.target.value }))} className="mt-2 block w-full rounded-lg border border-line p-3" placeholder="Peak Study Hub" />
              </label>
              <label className="text-sm font-bold">
                Footer
                <input value={printSettings.footerText} onChange={(event) => setPrintSettings((current) => ({ ...current, footerText: event.target.value }))} className="mt-2 block w-full rounded-lg border border-line p-3" placeholder="Page 1" />
              </label>
            </div>

            <div className="mt-5 rounded-lg border border-line bg-mist p-4">
              <p className="text-sm font-bold text-ink">Preview settings</p>
              <dl className="mt-3 grid gap-2 text-xs text-slate-700">
                <div className="flex justify-between gap-3"><dt>Orientation</dt><dd className="font-bold">{printSettings.orientation}</dd></div>
                <div className="flex justify-between gap-3"><dt>Area</dt><dd className="font-bold">{printSettings.printArea || "Not set"}</dd></div>
                <div className="flex justify-between gap-3"><dt>Width</dt><dd className="font-bold">{printSettings.scaleWidth}</dd></div>
                <div className="flex justify-between gap-3"><dt>Gridlines</dt><dd className="font-bold">{printSettings.gridlines ? "On" : "Off"}</dd></div>
                <div className="flex justify-between gap-3"><dt>Headings</dt><dd className="font-bold">{printSettings.headings ? "On" : "Off"}</dd></div>
                <div className="flex justify-between gap-3"><dt>Formulas</dt><dd className="font-bold">{printSettings.showFormulas ? "Shown" : "Hidden"}</dd></div>
              </dl>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
