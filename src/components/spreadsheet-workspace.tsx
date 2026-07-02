"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bold, CheckCircle2, Clock, Lightbulb, Merge, RotateCcw } from "lucide-react";
import { createMockExaminerFeedback } from "@/lib/ai-feedback";
import { initialCells, spreadsheetLesson, type SpreadsheetTask } from "@/lib/spreadsheet-lesson";
import { type SpreadsheetState, validateSpreadsheetTask } from "@/lib/workflow-validation";
import type { ValidationResult } from "@/lib/types";
import { Card, Pill, ProgressBar } from "./ui";

const cols = ["A", "B", "C", "D"];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];

function expandRange(start: string, end: string) {
  const startCol = cols.indexOf(start[0]);
  const endCol = cols.indexOf(end[0]);
  const startRow = Number(start.slice(1));
  const endRow = Number(end.slice(1));
  const cells: string[] = [];
  for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c += 1) {
    for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r += 1) {
      cells.push(`${cols[c]}${r}`);
    }
  }
  return cells;
}

export function SpreadsheetWorkspace() {
  const [cells, setCells] = useState<Record<string, string>>(initialCells);
  const [selectedCells, setSelectedCells] = useState<string[]>(["A1"]);
  const [anchor, setAnchor] = useState("A1");
  const [boldCells, setBoldCells] = useState<string[]>([]);
  const [mergedRanges, setMergedRanges] = useState<string[]>([]);
  const [centeredCells, setCenteredCells] = useState<string[]>([]);
  const [twoDecimalCells, setTwoDecimalCells] = useState<string[]>([]);
  const [chartCreated, setChartCreated] = useState(false);
  const [chartSource, setChartSource] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, ValidationResult>>({});
  const [lastAction, setLastAction] = useState("select");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const task = spreadsheetLesson.tasks[currentIndex];
  const completed = Object.values(results).filter((result) => result.isCorrect).length;
  const totalAwarded = Object.values(results).reduce((sum, result) => sum + result.marksAwarded, 0);
  const feedback = useMemo(() => createMockExaminerFeedback(Object.values(results)), [results]);

  const state: SpreadsheetState = {
    cells,
    boldCells,
    mergedRanges,
    centeredCells,
    twoDecimalCells,
    chartCreated,
    chartSource,
    selectedCells,
    lastAction,
    hintsUsed,
    attempts,
    secondsElapsed
  };

  function selectCell(cell: string, extend: boolean) {
    if (extend) {
      setSelectedCells(expandRange(anchor, cell));
    } else {
      setAnchor(cell);
      setSelectedCells([cell]);
    }
    setLastAction("select");
  }

  function updateCell(cell: string, value: string) {
    setCells((current) => ({ ...current, [cell]: value }));
    setLastAction(value.trim().startsWith("=") ? "formula" : "data-entry");
  }

  function applyBold() {
    setBoldCells((current) => Array.from(new Set([...current, ...selectedCells])));
    setLastAction("bold");
  }

  function mergeCenter() {
    setMergedRanges((current) => Array.from(new Set([...current, "A1:D1"])));
    setCenteredCells((current) => Array.from(new Set([...current, ...selectedCells])));
    setLastAction("merge-center");
  }

  function formatTwoDecimals() {
    setTwoDecimalCells((current) => Array.from(new Set([...current, ...selectedCells])));
    setLastAction("two-decimals");
  }

  function createChart() {
    setChartSource(selectedCells);
    setChartCreated(true);
    setLastAction("chart");
  }

  function checkTask(activeTask: SpreadsheetTask) {
    const result = validateSpreadsheetTask(activeTask, state);
    setAttempts((value) => value + 1);
    setResults((current) => ({ ...current, [activeTask.id]: result }));
    if (result.isCorrect && currentIndex < spreadsheetLesson.tasks.length - 1) {
      window.setTimeout(() => setCurrentIndex((value) => Math.min(value + 1, spreadsheetLesson.tasks.length - 1)), 550);
    }
  }

  function resetWorkspace() {
    setCells(initialCells);
    setSelectedCells(["A1"]);
    setAnchor("A1");
    setBoldCells([]);
    setMergedRanges([]);
    setCenteredCells([]);
    setTwoDecimalCells([]);
    setChartCreated(false);
    setChartSource([]);
    setResults({});
    setLastAction("select");
    setCurrentIndex(0);
    setHintsUsed(0);
    setAttempts(0);
    setSecondsElapsed(0);
  }

  return (
    <div className="workspace-grid">
      <Card className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <Pill>{task.marks} marks</Pill>
          <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Clock size={15} /> {Math.floor(secondsElapsed / 60)}:{String(secondsElapsed % 60).padStart(2, "0")}</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">{spreadsheetLesson.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{spreadsheetLesson.scenario}</p>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{completed}/{spreadsheetLesson.tasks.length}</span>
          </div>
          <ProgressBar value={(completed / spreadsheetLesson.tasks.length) * 100} />
        </div>
        <div className="mt-6 rounded-lg border border-line bg-mist p-4">
          <p className="text-sm font-semibold text-ocean">Current task</p>
          <h2 className="mt-2 font-semibold">{task.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{task.instruction}</p>
        </div>
        <button onClick={() => setHintsUsed((value) => value + 1)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold hover:border-ocean">
          <Lightbulb size={16} aria-hidden="true" /> Show hint
        </button>
        {hintsUsed > 0 && <p className="mt-3 text-sm leading-6 text-slate-600">{task.hints[Math.min(hintsUsed - 1, task.hints.length - 1)]}</p>}
      </Card>

      <Card className="overflow-hidden">
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-line pb-3">
          <button onClick={mergeCenter} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-ocean" title="Merge and centre selected cells">
            <Merge size={16} /> Merge
          </button>
          <button onClick={applyBold} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-ocean" title="Bold selected cells">
            <Bold size={16} /> Bold
          </button>
          <button onClick={formatTwoDecimals} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-ocean" title="Format selected numbers to two decimal places">
            0.00
          </button>
          <button onClick={createChart} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:border-ocean" title="Create chart from selected range">
            <BarChart3 size={16} /> Chart
          </button>
          <button onClick={() => checkTask(task)} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-leaf px-4 py-2 text-sm font-semibold text-white hover:bg-leaf/90">
            <CheckCircle2 size={16} /> Check
          </button>
          <button onClick={resetWorkspace} className="grid h-10 w-10 place-items-center rounded-lg border border-line" aria-label="Reset workspace">
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="overflow-auto">
          <div className="grid min-w-[640px]" style={{ gridTemplateColumns: "44px repeat(4, minmax(130px, 1fr))" }}>
            <div className="border border-line bg-slate-50" />
            {cols.map((col) => <div key={col} className="border border-line bg-slate-50 p-2 text-center text-sm font-semibold">{col}</div>)}
            {rows.map((row) => (
              <>
                <div key={`row-${row}`} className="border border-line bg-slate-50 p-2 text-center text-sm font-semibold">{row}</div>
                {cols.map((col) => {
                  const cell = `${col}${row}`;
                  const selected = selectedCells.includes(cell);
                  const displayValue = twoDecimalCells.includes(cell) && cells[cell] && !cells[cell].startsWith("=") && !Number.isNaN(Number(cells[cell])) ? Number(cells[cell]).toFixed(2) : cells[cell] || "";
                  return (
                    <input
                      key={cell}
                      aria-label={`Cell ${cell}`}
                      value={displayValue}
                      onChange={(event) => updateCell(cell, event.target.value)}
                      onClick={(event) => selectCell(cell, event.shiftKey)}
                      className={`h-11 border border-line px-2 text-sm ${selected ? "bg-cyan-50 ring-2 ring-ocean" : "bg-white"} ${boldCells.includes(cell) ? "font-bold" : ""} ${centeredCells.includes(cell) ? "text-center" : ""}`}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
        {chartCreated && (
          <div className="mt-5 rounded-lg border border-line bg-mist p-4">
            <h3 className="font-semibold">Chart preview</h3>
            <div className="mt-4 flex h-36 items-end gap-4">
              {["B4", "B5", "B6", "B7"].map((cell) => {
                const value = Number(cells[cell] || 0);
                return <div key={cell} className="w-12 rounded-t bg-ocean" style={{ height: `${Math.max(8, value * 4)}px` }} title={`${cell}: ${value}`} />;
              })}
            </div>
          </div>
        )}
      </Card>

      <Card className="h-fit">
        <h2 className="font-semibold">Feedback</h2>
        {results[task.id] ? (
          <div className="mt-3 rounded-lg border border-line bg-mist p-3 text-sm leading-6">
            <p className={results[task.id].isCorrect ? "font-semibold text-leaf" : "font-semibold text-coral"}>{results[task.id].feedbackMessage}</p>
            <p className="mt-2">Marks: {results[task.id].marksAwarded}/{results[task.id].marksAvailable}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-600">Check the task to receive immediate workflow feedback.</p>
        )}
        <div className="mt-5 border-t border-line pt-5">
          <h3 className="font-semibold">AI-generated examiner-style feedback</h3>
          <p className="mt-2 text-sm">Estimated mark: {feedback.predictedMark}</p>
          <p className="mt-1 text-sm">Practice grade prediction: {feedback.predictedGradeBand}</p>
          <p className="mt-1 text-sm">Exam Confidence Score: {Math.round(feedback.examConfidenceScore)}%</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{feedback.improvementTip}</p>
        </div>
        <div className="mt-5 border-t border-line pt-5">
          <h3 className="font-semibold">Rewards</h3>
          <p className="mt-2 text-sm text-slate-600">XP earned: {totalAwarded * 10}</p>
          <p className="mt-1 text-sm text-slate-600">Stars: {Math.floor(totalAwarded / 4)} / 4</p>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">Reserved space for optional milestone rewards, study resources, and future partner placements. No advert interrupts this lesson.</p>
        </div>
      </Card>
    </div>
  );
}
