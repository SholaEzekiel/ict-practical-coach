"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { CheckCircle2, Eye, ListChecks } from "lucide-react";
import { validateSpreadsheetCard, type SpreadsheetCardAttempt } from "@/lib/spreadsheet-card-engine";
import { spreadsheetInstructionCards } from "@/lib/spreadsheet-instruction-cards";
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
        3: { 0: { v: "Drama" }, 1: { v: 18 }, 2: { v: 6 } },
        4: { 0: { v: "Robotics" }, 1: { v: 22 }, 2: { v: 6 } },
        5: { 0: { v: "Coding" }, 1: { v: 16 }, 2: { v: 5 } },
        6: { 0: { v: "Art" }, 1: { v: 20 }, 2: { v: 5 } },
        7: { 0: { v: "Total" } }
      }
    }
  }
};

export function UniverSpreadsheetLab() {
  const reactId = useId().replaceAll(":", "");
  const containerId = `univer-${reactId}`;
  const [activeIndex, setActiveIndex] = useState(0);
  const [attempt, setAttempt] = useState<SpreadsheetCardAttempt>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const card = spreadsheetInstructionCards[activeIndex];
  const feedback = useMemo(() => validateSpreadsheetCard(card, attempt), [attempt, card]);

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
      setReady(true);
    }

    bootUniver().catch(() => setReady(false));

    return () => {
      disposed = true;
    };
  }, [containerId]);

  function markToolPath() {
    setAttempt((current) => ({ ...current, clickedPath: card.clickPath }));
  }

  function markAction() {
    setAttempt((current) => ({
      ...current,
      selectedRange: card.expectedSelection || current.selectedRange,
      clickedPath: card.clickPath,
      action: card.expectedAction
    }));
  }

  function confirmResult() {
    setAttempt((current) => ({ ...current, resultConfirmed: true }));
    if (!completed.includes(card.id)) {
      setCompleted((current) => [...current, card.id]);
    }
  }

  function nextCard() {
    setAttempt({});
    setActiveIndex((value) => (value + 1) % spreadsheetInstructionCards.length);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <Pill>{card.category}</Pill>
          <span className="text-sm font-semibold text-slate-500">{activeIndex + 1}/{spreadsheetInstructionCards.length}</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">Spreadsheet instruction lab</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Practise one instruction at a time: understand it, find the command path, complete the action, then check the expected result.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Card progress</span>
            <span>{completed.length}/{spreadsheetInstructionCards.length}</span>
          </div>
          <ProgressBar value={(completed.length / spreadsheetInstructionCards.length) * 100} />
        </div>

        <div className="mt-6 rounded-lg border border-line bg-mist p-4">
          <p className="text-sm font-semibold text-ocean">{card.skill}</p>
          <h2 className="mt-2 font-semibold">{card.instruction}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{card.meaning}</p>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Where to click</p>
            <p className="mt-1 text-sm font-semibold text-ink">{card.clickPath.join(" > ")}</p>
          </div>
          {card.expectedSelection && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected selection</p>
              <p className="mt-1 text-sm font-semibold text-ink">{card.expectedSelection}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected result</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{card.expectedResult}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <button onClick={markToolPath} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold hover:border-ocean">
            <Eye size={16} /> I found the command path
          </button>
          <button onClick={markAction} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold hover:border-ocean">
            <ListChecks size={16} /> I completed the action
          </button>
          <button onClick={confirmResult} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-3 py-2 text-sm font-semibold text-white hover:bg-leaf/90">
            <CheckCircle2 size={16} /> Result matches
          </button>
        </div>

        <div className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${feedback.isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`} role="status">
          <p className="font-semibold">{feedback.message}</p>
          <p className="mt-1 text-slate-700">{feedback.nextStep}</p>
        </div>

        <button onClick={nextCard} className="mt-4 w-full rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">
          Next instruction
        </button>
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
