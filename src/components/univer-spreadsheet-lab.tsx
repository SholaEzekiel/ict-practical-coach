"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react";
import { validateSpreadsheetResult, type SpreadsheetResultFeedback } from "@/lib/spreadsheet-result-checker";
import { getSpreadsheetCardsForModule, getSpreadsheetModule } from "@/lib/spreadsheet-instruction-cards";
import { Card, Pill, ProgressBar } from "./ui";

const blankWorkbook = {
  id: "apex-spreadsheet-lab",
  name: "Apex Spreadsheet Lab",
  sheetOrder: ["sheet-01"],
  sheets: {
    "sheet-01": {
      id: "sheet-01",
      name: "Club Attendance",
      rowCount: 40,
      columnCount: 12,
      cellData: {
        0: { 0: { v: "Club Attendance Summary" } },
        2: {
          0: { v: "Club" },
          1: { v: "Attendance" },
          2: { v: "Sessions" },
          3: { v: "Average" }
        },
        7: { 0: { v: "Total" } }
      }
    }
  }
};

const formulaWorkbook = {
  ...blankWorkbook,
  sheets: {
    "sheet-01": {
      ...blankWorkbook.sheets["sheet-01"],
      cellData: {
        0: { 0: { v: "Club Attendance Summary" } },
        2: {
          0: { v: "Club" },
          1: { v: "Attendance" },
          2: { v: "Sessions" },
          3: { v: "Average" }
        },
        3: { 0: { v: "Drama" }, 1: { v: 18 }, 2: { v: 6 } },
        4: { 0: { v: "Robotics" }, 1: { v: 22 }, 2: { v: 6 } },
        5: { 0: { v: "Coding" }, 1: { v: 16 }, 2: { v: 5 } },
        6: { 0: { v: "Art" }, 1: { v: 20 }, 2: { v: 5 } },
        7: { 0: { v: "Total" } }
      }
    }
  }
};

type UniverApi = {
  getActiveWorkbook?: () => {
    save?: () => unknown;
    getSnapshot?: () => unknown;
  } | null;
};

type UniverSpreadsheetLabProps = {
  moduleId?: string;
};

function getStarterWorkbook(moduleId?: string) {
  if (moduleId === "formula") return formulaWorkbook;
  return blankWorkbook;
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

  const moduleCardsForRoute = useMemo(() => getSpreadsheetCardsForModule(moduleId), [moduleId]);
  const card = moduleCardsForRoute[activeIndex];
  const currentCardComplete = completed.includes(card.id);
  const progressValue = useMemo(() => (completed.length / moduleCardsForRoute.length) * 100, [completed.length, moduleCardsForRoute.length]);
  const currentModuleId = card.moduleId || card.category;
  const currentModule = getSpreadsheetModule(currentModuleId);
  const completedModuleCards = moduleCardsForRoute.filter((task) => completed.includes(task.id)).length;

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

  function checkWork() {
    const workbook = univerApiRef.current?.getActiveWorkbook?.();
    const snapshot = workbook?.save?.() || workbook?.getSnapshot?.();
    const result = validateSpreadsheetResult(card, snapshot);

    setFeedback(result);

    if (result.isCorrect && !completed.includes(card.id)) {
      setCompleted((current) => [...current, card.id]);
      setPoints((value) => value + card.marks * 10);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 900);
    } else if (!card.autoCheck && !completed.includes(card.id)) {
      setCompleted((current) => [...current, card.id]);
    }
  }

  function nextCard() {
    setFeedback(null);
    setActiveIndex((value) => Math.min(value + 1, moduleCardsForRoute.length - 1));
  }

  return (
    <div className="grid h-[calc(100vh-120px)] min-h-[720px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Card className="flex min-h-0 flex-col overflow-hidden p-0">
        <div className="border-b border-line p-4">
          <div className="flex items-center justify-between gap-3">
            <Pill>{currentModule?.title || card.category}</Pill>
            <span className="text-sm font-semibold text-slate-500">
              {activeIndex + 1}/{moduleCardsForRoute.length}
            </span>
          </div>
          <h1 className="mt-3 text-xl font-bold">Spreadsheet practice</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Complete each goal to unlock the next task.</p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span>Module progress</span>
              <span>{completed.length}/{moduleCardsForRoute.length}</span>
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
                <li key={step} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {feedback && (
            <div
              className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${
                feedback.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
              }`}
              role="status"
            >
              <p className="font-semibold">{feedback.message}</p>
              <p className="mt-1 text-slate-700">{feedback.nextStep}</p>
              <div className="mt-3 space-y-2">
                {card.expectedSelection && (
                  <p>
                    <span className="font-semibold">Selection:</span> {card.expectedSelection}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Expected result:</span> {card.expectedResult}
                </p>
              </div>
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
              {card.autoCheck ? "Check my result" : "Show check guide"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sparkles size={16} className="text-amber" /> {points} points
            </span>
            <button
              onClick={nextCard}
              disabled={!currentCardComplete || activeIndex === moduleCardsForRoute.length - 1}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            >
              Next
            </button>
          </div>
          {!currentCardComplete && <p className="mt-3 text-center text-xs text-slate-500">Complete this goal to unlock Next.</p>}
        </div>
      </Card>

      <Card className="flex min-h-0 flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3">
          <div>
            <h2 className="font-semibold">Spreadsheet workspace</h2>
            <p className="text-sm text-slate-600">
              {ready ? `${currentModule?.title || "Module"} workspace` : "Loading spreadsheet engine..."}
            </p>
          </div>
          <Link href="/subjects/ict/spreadsheets" className="text-sm font-semibold text-ocean hover:underline">
            Modules
          </Link>
        </div>
        <div id={containerId} className="min-h-0 flex-1 bg-white" />
      </Card>
    </div>
  );
}
