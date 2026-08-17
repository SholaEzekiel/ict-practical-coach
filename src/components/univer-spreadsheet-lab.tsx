"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ClipboardCheck, Sparkles } from "lucide-react";
import { currentLabSpreadsheetCards } from "@/lib/spreadsheet-instruction-cards";
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
  const [checkGuideOpen, setCheckGuideOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const card = currentLabSpreadsheetCards[activeIndex];
  const progressValue = useMemo(() => ((activeIndex + 1) / currentLabSpreadsheetCards.length) * 100, [activeIndex]);

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

  function checkWork() {
    setCheckGuideOpen(true);
  }

  function nextCard() {
    setCheckGuideOpen(false);
    setActiveIndex((value) => (value + 1) % currentLabSpreadsheetCards.length);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <Pill>{card.category}</Pill>
          <span className="text-sm font-semibold text-slate-500">
            {activeIndex + 1}/{currentLabSpreadsheetCards.length}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">Spreadsheet practice</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Follow the steps in the sheet, then compare your result with the check guide.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Card</span>
            <span>
              {activeIndex + 1}/{currentLabSpreadsheetCards.length}
            </span>
          </div>
          <ProgressBar value={progressValue} />
        </div>

        <div className="mt-6 rounded-lg border border-line bg-mist p-4">
          <p className="text-sm font-semibold text-ocean">Goal</p>
          <h2 className="mt-2 text-xl font-bold">{card.studentGoal}</h2>
        </div>

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

        <div className="mt-5">
          <button onClick={checkWork} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-3 py-3 text-sm font-semibold text-white hover:bg-leaf/90">
            <ClipboardCheck size={16} /> Show check guide
          </button>
        </div>

        {checkGuideOpen && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6" role="status">
            <p className="font-semibold">Teacher check required.</p>
            <p className="mt-1 text-slate-700">
              Auto-checking is not connected for this command yet, so this card will not award points by itself.
            </p>
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
            <Sparkles size={16} className="text-amber" /> Points unlock after real auto-checking
          </span>
          <button onClick={nextCard} className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">
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
