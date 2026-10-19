import type { SpreadsheetInstructionCard } from "./spreadsheet-instruction-cards";

export const spreadsheetFormulaModules = [
  { id: "formula", title: "Basic Formulae", description: "Prepare a small worksheet, then add, subtract, multiply, and divide using cell references.", cards: [
    "enter-title", "enter-headings", "enter-items", "enter-numbers", "addition", "subtraction", "multiplication", "divide"
  ] },
  { id: "formula-totals", title: "Totals and Averages", description: "Use SUM and AVERAGE with prepared club data, one range at a time.", cards: [
    "sum-sold", "sum-sessions", "average-sold", "average-sessions"
  ] },
  { id: "formula-statistics", title: "Minimum, Maximum and Counting", description: "Find the smallest and largest values; distinguish COUNT from COUNTA.", cards: [
    "min-sold", "max-sold", "count-sold", "counta-items"
  ] },
  { id: "formula-references", title: "Copying and Cell References", description: "Use the fill handle, follow relative references, and keep a reference fixed with $.", cards: [
    "copy-average", "absolute-total", "task-absolute-discount"
  ] },
  { id: "formula-logic", title: "IF and Logical Tests", description: "Start with a two-way IF decision, copy it, then compare nested IF and IFS.", cards: [
    "if-simple", "if-copy", "nested-if", "ifs", "task-shop-if", "task-shop-nested-if"
  ] },
  { id: "formula-conditions", title: "Conditional Counting and Totals", description: "Use COUNTIF, SUMIF, and AVERAGEIF before applying them to a shop table.", cards: [
    "countif", "sumif", "averageif", "task-shop-countif", "task-shop-sumif"
  ] },
  { id: "formula-lookups", title: "Lookup Functions", description: "Build lookup tables and practise exact-match VLOOKUP, HLOOKUP, and XLOOKUP.", cards: [
    "lookup-table", "vlookup", "hlookup-table", "hlookup", "xlookup", "task-discount-lookup-table", "task-vlookup-discount"
  ] },
  { id: "formula-practice", title: "Formula Practice: School Shop", description: "Build a shop table, calculate revenue, fill down, and finish with a total and average.", cards: [
    "task-shop-source", "task-shop-first-revenue", "task-shop-copy-revenue", "task-shop-total-final", "task-shop-average"
  ] }
];

export function splitSpreadsheetFormulaCards(cards: SpreadsheetInstructionCard[]) {
  const remaining = new Map(cards.map(card => [card.id, card]));
  const grouped = spreadsheetFormulaModules.flatMap(module => module.cards.map(slug => {
    const id = "sheet-formula-" + slug;
    const card = remaining.get(id);
    if (!card) throw new Error("Missing or repeated formula exercise: " + id);
    remaining.delete(id);
    return { ...card, moduleId: module.id, moduleTitle: module.title };
  }));
  if (remaining.size) throw new Error("Ungrouped formula exercises: " + [...remaining.keys()].join(", "));
  return grouped;
}

export function getFormulaStarter(moduleId?: string): { cells: Array<[string, string | number]>; formulas: Array<[string, string]> } | undefined {
  if (!spreadsheetFormulaModules.some(module => module.id === moduleId)) return undefined;
  if (moduleId === "formula") return { cells: [], formulas: [] };
  if (moduleId === "formula-practice") return { cells: [["A1", "School Shop Revenue"]], formulas: [] };
  const cells: Array<[string, string | number]> = [
    ["A1", "Club Formula Practice"],
    ["A3", "Item"], ["B3", "Sold"], ["C3", "Sessions"], ["D3", "Sold per session"], ["E3", "Status"],
    ["A4", "Drama"], ["B4", 18], ["C4", 6],
    ["A5", "Robotics"], ["B5", 22], ["C5", 6],
    ["A6", "Coding"], ["B6", 16], ["C6", 5],
    ["A7", "Art"], ["B7", 20], ["C7", 5],
    ["A8", "Total"], ["A9", "Average"], ["A10", "Lowest"], ["A11", "Highest"]
  ];
  if (moduleId === "formula-logic" || moduleId === "formula-conditions") cells.push(
    ["A20", "Item"], ["B20", "Price"], ["C20", "Sold"], ["D20", "Revenue"],
    ["A21", "Pen"], ["B21", 1.5], ["C21", 28], ["D21", 42],
    ["A22", "Notebook"], ["B22", 3], ["C22", 14], ["D22", 42],
    ["A23", "Folder"], ["B23", 2], ["C23", 19], ["D23", 38]
  );
  if (moduleId === "formula-references") {
    cells.push(["A22", "Notebook"], ["B22", 3], ["H24", "Fixed discount rate"], ["H25", 0.15]);
    return { cells, formulas: [["D4", "=B4/C4"], ["B8", "=SUM(B4:B7)"]] };
  }
  return { cells, formulas: [] };
}
