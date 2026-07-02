import type { SpreadsheetTask } from "./spreadsheet-lesson";
import type { ValidationResult } from "./types";

export type SpreadsheetState = {
  cells: Record<string, string>;
  boldCells: string[];
  mergedRanges: string[];
  centeredCells: string[];
  twoDecimalCells: string[];
  chartCreated: boolean;
  chartSource: string[];
  selectedCells: string[];
  lastAction: string;
  hintsUsed: number;
  attempts: number;
  secondsElapsed: number;
};

function sameCells(actual: string[], expected: string[] = []) {
  const a = [...actual].sort().join(",");
  const b = [...expected].sort().join(",");
  return a === b;
}

function hasValues(state: SpreadsheetState) {
  return (
    state.cells.A4?.trim().toLowerCase() === "drama" &&
    state.cells.B4 === "18" &&
    state.cells.A5?.trim().toLowerCase() === "robotics" &&
    state.cells.B5 === "22" &&
    state.cells.A6?.trim().toLowerCase() === "coding" &&
    state.cells.B6 === "16" &&
    state.cells.A7?.trim().toLowerCase() === "art" &&
    state.cells.B7 === "20"
  );
}

function formulaCorrect(value: string) {
  const normal = value.replace(/\s/g, "").toUpperCase();
  return normal === "=SUM(B4:B7)" || normal === "=B4+B5+B6+B7";
}

export function validateSpreadsheetTask(task: SpreadsheetTask, state: SpreadsheetState): ValidationResult {
  const selectionOk = task.expectedSelection ? sameCells(state.selectedCells, task.expectedSelection) : true;
  let resultOk = false;
  let mistakeType = selectionOk ? "result" : "selection";

  if (task.id === "title") {
    resultOk = state.cells.A1 === "Club Attendance Summary" && state.mergedRanges.includes("A1:D1") && ["A1", "B1", "C1", "D1"].every((cell) => state.centeredCells.includes(cell));
  }
  if (task.id === "headings") {
    resultOk = ["A3", "B3", "C3", "D3"].every((cell) => state.boldCells.includes(cell));
  }
  if (task.id === "data") {
    resultOk = hasValues(state);
  }
  if (task.id === "formula") {
    resultOk = formulaCorrect(state.cells.B8 || "");
  }
  if (task.id === "format") {
    resultOk = ["B4", "B5", "B6", "B7", "B8"].every((cell) => state.twoDecimalCells.includes(cell));
  }
  if (task.id === "chart") {
    resultOk = state.chartCreated && sameCells(state.chartSource, task.expectedSelection);
  }

  const actionOk = task.expectedAction === state.lastAction || (task.id === "formula" && formulaCorrect(state.cells.B8 || ""));
  const isCorrect = selectionOk && actionOk && resultOk;
  const marksAwarded = isCorrect ? task.marks : resultOk ? Math.max(1, task.marks - 1) : 0;

  if (!actionOk && selectionOk) mistakeType = "action";
  if (!resultOk && actionOk && selectionOk) mistakeType = "final result";

  return {
    isCorrect,
    marksAwarded,
    marksAvailable: task.marks,
    mistakeType: isCorrect ? "none" : mistakeType,
    feedbackMessage: isCorrect
      ? "Correct. Your workflow and final result match the task requirements."
      : `Check the ${mistakeType}. The task needs the correct range, command, and final worksheet result.`,
    correctionSteps: isCorrect
      ? ["Move to the next task."]
      : [
          task.expectedSelection ? `Select ${task.expectedSelection.join(", ")}.` : "Check the required cells in the instruction.",
          `Use the ${task.expectedAction.replace("-", " ")} action.`,
          "Review the worksheet result before checking again."
        ],
    examinerComment: isCorrect
      ? "The task would gain full credit in this practice mark scheme because the method and result are both clear."
      : "Some credit may be lost because the workflow evidence or final output is incomplete.",
    confidenceImpact: isCorrect ? 5 : -3
  };
}
