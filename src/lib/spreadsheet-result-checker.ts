import type { SpreadsheetInstructionCard } from "./spreadsheet-instruction-cards";

type CellExpectation = {
  cell: string;
  value?: string | number;
  formula?: string;
  formulaIncludes?: string[];
};

type WorkbookSnapshot = {
  sheetOrder?: string[];
  sheets?: Record<string, { cellData?: Record<string, Record<string, { v?: unknown; f?: string | null }>> }>;
};

export type SpreadsheetResultFeedback = {
  isCorrect: boolean;
  canAutoCheck: boolean;
  message: string;
  nextStep: string;
};

function normaliseText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normaliseFormula(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, "").toUpperCase();
}

function a1ToIndexes(cell: string) {
  const match = /^([A-Z]+)(\d+)$/i.exec(cell.trim());
  if (!match) return null;

  const [, letters, rowText] = match;
  const columnIndex = letters
    .toUpperCase()
    .split("")
    .reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;

  return {
    rowIndex: Number(rowText) - 1,
    columnIndex
  };
}

function getActiveSheet(snapshot: WorkbookSnapshot) {
  const sheetId = snapshot.sheetOrder?.[0] || Object.keys(snapshot.sheets || {})[0];
  return sheetId ? snapshot.sheets?.[sheetId] : undefined;
}

function getCell(snapshot: WorkbookSnapshot, cell: string) {
  const indexes = a1ToIndexes(cell);
  const sheet = getActiveSheet(snapshot);

  if (!indexes || !sheet?.cellData) return undefined;

  return sheet.cellData[String(indexes.rowIndex)]?.[String(indexes.columnIndex)];
}

function cellMatches(snapshot: WorkbookSnapshot, expected: CellExpectation) {
  const actual = getCell(snapshot, expected.cell);

  if (expected.formula && normaliseFormula(actual?.f) !== normaliseFormula(expected.formula)) {
    return {
      ok: false,
      message: `${expected.cell} should contain the formula ${expected.formula}.`
    };
  }

  if (expected.formulaIncludes?.length) {
    const actualFormula = normaliseFormula(actual?.f);
    const missingFormulaPart = expected.formulaIncludes.find((part) => !actualFormula.includes(normaliseFormula(part)));

    if (missingFormulaPart) {
      return {
        ok: false,
        message: `${expected.cell} should contain a formula using ${missingFormulaPart}.`
      };
    }
  }

  if (expected.value !== undefined && normaliseText(actual?.v) !== normaliseText(expected.value)) {
    return {
      ok: false,
      message: `${expected.cell} should show ${expected.value}.`
    };
  }

  return { ok: true, message: "" };
}

export function validateSpreadsheetResult(card: SpreadsheetInstructionCard, snapshot: unknown): SpreadsheetResultFeedback {
  if (!card.autoCheck) {
    return {
      isCorrect: false,
      canAutoCheck: false,
      message: "Teacher check required.",
      nextStep: "This card teaches a tool path, but automatic result checking is not connected for this command yet."
    };
  }

  if (!snapshot || typeof snapshot !== "object") {
    return {
      isCorrect: false,
      canAutoCheck: true,
      message: "I could not read the spreadsheet yet.",
      nextStep: "Wait for the spreadsheet to finish loading, then try checking again."
    };
  }

  const workbookSnapshot = snapshot as WorkbookSnapshot;

  for (const expectedCell of card.autoCheck.cells) {
    const result = cellMatches(workbookSnapshot, expectedCell);

    if (!result.ok) {
      return {
        isCorrect: false,
        canAutoCheck: true,
        message: result.message,
        nextStep: card.feedback.wrongResult
      };
    }
  }

  return {
    isCorrect: true,
    canAutoCheck: true,
    message: "Correct result.",
    nextStep: "Your final spreadsheet result matches this task."
  };
}
