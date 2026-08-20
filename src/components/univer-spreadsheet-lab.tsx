"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CheckCircle2, ClipboardCheck, Sparkles } from "lucide-react";
import { validateSpreadsheetResult, type SpreadsheetResultFeedback } from "@/lib/spreadsheet-result-checker";
import { currentLabSpreadsheetCards, spreadsheetModules } from "@/lib/spreadsheet-instruction-cards";
import { Card, Pill, ProgressBar } from "./ui";

const starterWorkbook = {
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

type UniverApi = {
  getActiveWorkbook?: () => {
    save?: () => unknown;
    getSnapshot?: () => unknown;
  } | null;
};

export function UniverSpreadsheetLab() {
  const reactId = useId().replaceAll(":", "");
  const containerId = `univer-${reactId}`;
  const univerApiRef = useRef<UniverApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedback, setFeedback] = useState<SpreadsheetResultFeedback | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [ready, setReady] = useState(false);

  const card = currentLabSpreadsheetCards[activeIndex];
  const currentCardComplete = completed.includes(card.id);
  const progressValue = useMemo(() => (completed.length / currentLabSpreadsheetCards.length) * 100, [completed.length]);
  const availableModules = useMemo(
    () => spreadsheetModules.filter((module) => currentLabSpreadsheetCards.some((task) => (task.moduleId || task.category) === module.id)),
    []
  );
  const currentModuleId = card.moduleId || card.category;
  const currentModule = spreadsheetModules.find((module) => module.id === currentModuleId);
  const moduleCards = currentLabSpreadsheetCards.filter((task) => (task.moduleId || task.category) === currentModuleId);
  const completedModuleCards = moduleCards.filter((task) => completed.includes(task.id)).length;

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

      univerAPI.createWorkbook(starterWorkbook);
      univerApiRef.current = univerAPI;
      setReady(true);
    }

    bootUniver().catch(() => setReady(false));

    return () => {
      disposed = true;
    };
  }, [containerId]);

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
    }
  }

  function nextCard() {
    setFeedback(null);
    setActiveIndex((value) => (value + 1) % currentLabSpreadsheetCards.length);
  }

  function openModule(moduleId: string) {
    const moduleStartIndex = currentLabSpreadsheetCards.findIndex((task) => (task.moduleId || task.category) === moduleId);

    if (moduleStartIndex >= 0) {
      setFeedback(null);
      setActiveIndex(moduleStartIndex);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <Pill>{currentModule?.title || card.category}</Pill>
          <span className="text-sm font-semibold text-slate-500">
            {activeIndex + 1}/{currentLabSpreadsheetCards.length}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">Spreadsheet practice</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Follow the steps in the sheet, then check the final result.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {completed.length}/{currentLabSpreadsheetCards.length}
            </span>
          </div>
          <ProgressBar value={progressValue} />
        </div>

        <div className="mt-5 rounded-lg border border-line bg-white p-3">
          <p className="text-sm font-semibold text-ink">Modules</p>
          <div className="mt-3 grid gap-2">
            {availableModules.map((module) => {
              const moduleTasks = currentLabSpreadsheetCards.filter((task) => (task.moduleId || task.category) === module.id);
              const done = moduleTasks.filter((task) => completed.includes(task.id)).length;
              const isActive = module.id === currentModuleId;

              return (
                <button
                  key={module.id}
                  onClick={() => openModule(module.id)}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold ${
                    isActive ? "bg-ocean text-white" : "bg-mist text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{module.title}</span>
                  <span className={isActive ? "text-white/85" : "text-slate-500"}>{done}/{moduleTasks.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-line bg-mist p-4">
          <p className="text-sm font-semibold text-ocean">Module</p>
          <h2 className="mt-2 text-lg font-bold">{currentModule?.title || card.category}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{currentModule?.description}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">{completedModuleCards}/{moduleCards.length} tasks complete</p>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-mist p-4">
          <p className="text-sm font-semibold text-ocean">Goal</p>
          <h2 className="mt-2 text-xl font-bold">{card.studentGoal}</h2>
        </div>

        {card.scenario && (
          <div className="mt-5 rounded-lg border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">Scenario</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
          </div>
        )}

        <div className="mt-5 rounded-lg border border-line bg-white p-4">
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

        <div className="relative mt-5">
          {celebrating && (
            <div className="pointer-events-none absolute inset-x-0 -top-8 flex justify-center">
              <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 shadow-soft">+{card.marks * 10} points</span>
            </div>
          )}
          <button onClick={checkWork} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-3 py-3 text-sm font-semibold text-white hover:bg-leaf/90">
            {card.autoCheck ? <CheckCircle2 size={16} /> : <ClipboardCheck size={16} />}
            {card.autoCheck ? "Check my result" : "Show check guide"}
          </button>
          {!currentCardComplete && (
            <p className="mt-3 text-center text-sm text-slate-600">Complete this goal to unlock Next.</p>
          )}
        </div>

        {feedback && (
          <div
            className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${
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
                <span className="font-semibold">Command path:</span> {card.clickPath.join(" > ")}
              </p>
              <p>
                <span className="font-semibold">Expected result:</span> {card.expectedResult}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Sparkles size={16} className="text-amber" /> {points} points
          </span>
          <button
            onClick={nextCard}
            disabled={!currentCardComplete}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            Next
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-line bg-white px-4 py-3">
          <h2 className="font-semibold">Spreadsheet workspace</h2>
          <p className="text-sm text-slate-600">
            {ready ? "Use the embedded spreadsheet surface to practise the instruction." : "Loading spreadsheet engine..."}
          </p>
        </div>
        <div id={containerId} className="h-[720px] min-h-[640px] w-full bg-white" />
      </Card>
    </div>
  );
}
