import type { SpreadsheetInstructionCard } from "./spreadsheet-instruction-cards";

type CellExpectation = {
  cell: string;
  value?: string | number;
  formula?: string;
  formulaIncludes?: string[];
  format?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    horizontalAlign?: "left" | "center" | "right";
    background?: boolean;
    fontColor?: boolean;
    fontSizeAtLeast?: number;
    wrapText?: boolean;
    border?: boolean;
    numberPatternIncludes?: string[];
  };
};

type WorkbookSnapshot = {
  sheetOrder?: string[];
  sheets?: Record<string, { cellData?: Record<string, Record<string, { v?: unknown; f?: string | null; s?: unknown }>> }>;
  styles?: Record<string, unknown>;
  resources?: Array<{ name?: string; data?: string | Record<string, unknown> }>;
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

function nearlyEqual(actual: unknown, expected: number) {
  const numberValue = typeof actual === "number" ? actual : Number(String(actual ?? "").replace(/,/g, ""));
  return Number.isFinite(numberValue) && Math.abs(numberValue - expected) < 0.000001;
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

function readResourceStyles(snapshot: WorkbookSnapshot) {
  const resource = snapshot.resources?.find((item) => item.name?.toLowerCase().includes("style"));
  if (!resource?.data) return {};

  if (typeof resource.data === "string") {
    try {
      return JSON.parse(resource.data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return resource.data;
}

function resolveStyle(snapshot: WorkbookSnapshot, style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (typeof style === "object") return style as Record<string, unknown>;
  if (typeof style !== "string") return {};

  const direct = snapshot.styles?.[style];
  if (direct && typeof direct === "object") return direct as Record<string, unknown>;

  const resourceStyles = readResourceStyles(snapshot);
  const nested = resourceStyles[style];
  if (nested && typeof nested === "object") return nested as Record<string, unknown>;

  return {};
}

function styleValue(style: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (style[key] !== undefined) return style[key];
  }
  return undefined;
}

function hasTruthyStyle(style: Record<string, unknown>, keys: string[]) {
  const value = styleValue(style, keys);
  if (value === undefined || value === null || value === false) return false;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return String(value).toLowerCase() !== "false" && String(value) !== "0";
}

function formatMatches(snapshot: WorkbookSnapshot, expected: CellExpectation) {
  if (!expected.format) return { ok: true, message: "" };

  const actual = getCell(snapshot, expected.cell);
  const style = resolveStyle(snapshot, actual?.s);
  const format = expected.format;

  if (format.bold && !hasTruthyStyle(style, ["bl", "bold", "fontWeight"])) {
    return { ok: false, message: `${expected.cell} should be bold.` };
  }

  if (format.italic && !hasTruthyStyle(style, ["it", "italic", "fontStyle"])) {
    return { ok: false, message: `${expected.cell} should be italic.` };
  }

  if (format.underline && !hasTruthyStyle(style, ["ul", "underline", "textDecoration"])) {
    return { ok: false, message: `${expected.cell} should be underlined.` };
  }

  if (format.background && !hasTruthyStyle(style, ["bg", "background", "backgroundColor", "fill"])) {
    return { ok: false, message: `${expected.cell} should have a fill colour.` };
  }

  if (format.fontColor && !hasTruthyStyle(style, ["cl", "color", "fontColor"])) {
    return { ok: false, message: `${expected.cell} should have a font colour.` };
  }

  if (format.fontSizeAtLeast) {
    const rawSize = styleValue(style, ["fs", "fontSize", "font-size", "sz"]);
    const size = typeof rawSize === "number" ? rawSize : Number(rawSize);
    if (!Number.isFinite(size) || size < format.fontSizeAtLeast) {
      return { ok: false, message: `${expected.cell} should use a larger font size.` };
    }
  }

  if (format.wrapText && !hasTruthyStyle(style, ["tb", "wrap", "wrapText", "textWrap", "whiteSpace"])) {
    return { ok: false, message: `${expected.cell} should use wrapped text.` };
  }

  if (format.border && !hasTruthyStyle(style, ["bd", "border", "borders", "borderData"])) {
    return { ok: false, message: `${expected.cell} should have borders.` };
  }

  if (format.horizontalAlign) {
    const align = String(styleValue(style, ["ht", "horizontalAlign", "textAlign", "align"]) ?? "").toLowerCase();
    const expectedAlign = format.horizontalAlign.toLowerCase();
    const centerAliases = ["2", "center", "centre", "middle"];
    const matches = expectedAlign === "center" ? centerAliases.includes(align) : align.includes(expectedAlign);
    if (!matches) return { ok: false, message: `${expected.cell} should be ${format.horizontalAlign} aligned.` };
  }

  if (format.numberPatternIncludes?.length) {
    const numberFormat = String(styleValue(style, ["n", "numberFormat", "numFmt", "pattern", "format"]) ?? "").toLowerCase();
    const found = format.numberPatternIncludes.some((part) => numberFormat.includes(part.toLowerCase()));
    if (!found) return { ok: false, message: `${expected.cell} should use the requested number format.` };
  }

  return { ok: true, message: "" };
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

  if (expected.value !== undefined && typeof expected.value === "number" && !nearlyEqual(actual?.v, expected.value)) {
    return {
      ok: false,
      message: `${expected.cell} should show ${expected.value}.`
    };
  }

  if (expected.value !== undefined && typeof expected.value !== "number" && normaliseText(actual?.v) !== normaliseText(expected.value)) {
    return {
      ok: false,
      message: `${expected.cell} should show ${expected.value}.`
    };
  }

  const formatResult = formatMatches(snapshot, expected);
  if (!formatResult.ok) return formatResult;

  return { ok: true, message: "" };
}

export function validateSpreadsheetResult(card: SpreadsheetInstructionCard, snapshot: unknown): SpreadsheetResultFeedback {
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
