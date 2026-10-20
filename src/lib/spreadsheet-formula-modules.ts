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
  { id: "formula-references", title: "Build a Table and Use References", description: "Start with a blank worksheet, build a stationery table, and see linked formula results update.", cards: [
    "reference-headings", "reference-data", "reference-link", "reference-cost", "reference-copy", "reference-update"
  ] },
  { id: "formula-copying", title: "Copying and Absolute References", description: "Use prepared club data to copy relative references and compare a value against a fixed total.", cards: [
    "copy-average", "absolute-total"
  ] },
  { id: "formula-discounts", title: "Fixed Discount References", description: "Use a prepared price and discount rate to practise an absolute reference.", cards: [
    "task-absolute-discount"
  ] },
  { id: "formula-logic", title: "IF and Logical Tests", description: "Start with a two-way IF decision, copy it, then compare nested IF and IFS.", cards: [
    "if-simple", "if-copy", "nested-if", "ifs"
  ] },
  { id: "formula-conditions", title: "Conditional Counting and Totals", description: "Use COUNTIF, SUMIF, and AVERAGEIF before applying them to a shop table.", cards: [
    "countif", "sumif", "averageif"
  ] },
  { id: "formula-shop-decisions", title: "Shop Decisions and Conditions", description: "Apply IF, nested IF, COUNTIF, and SUMIF to one prepared school-shop table.", cards: [
    "task-shop-if", "task-shop-nested-if", "task-shop-countif", "task-shop-sumif"
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
    const extraCopyChecks = id === "sheet-formula-if-copy" ? [
      { cell: "E4", formula: '=IF(B4>=20,"Good","Review")', value: "Review" },
      { cell: "E5", formula: '=IF(B5>=20,"Good","Review")', value: "Good" },
      { cell: "E6", formula: '=IF(B6>=20,"Good","Review")', value: "Review" }
    ] : id === "sheet-formula-task-shop-copy-revenue" ? [
      { cell: "D21", formula: "=B21*C21", value: 42 },
      { cell: "D22", formula: "=B22*C22", value: 42 }
    ] : [];
    return { ...card, moduleId: module.id, moduleTitle: module.title,
      autoCheck: { ...card.autoCheck, cells: [...card.autoCheck.cells, ...extraCopyChecks] }
    };
  }));
  if (remaining.size) throw new Error("Ungrouped formula exercises: " + [...remaining.keys()].join(", "));
  return grouped;
}

export function getFormulaStarter(moduleId?: string): { cells: Array<[string, string | number]>; formulas: Array<[string, string]> } | undefined {
  if (!spreadsheetFormulaModules.some(module => module.id === moduleId)) return undefined;
  if (moduleId === "formula") return { cells: [], formulas: [] };
  if (moduleId === "formula-references" || moduleId === "formula-lookups" || moduleId === "formula-practice") return { cells: [], formulas: [] };
  if (moduleId === "formula-discounts") return { cells: [
    ["A21", "Item"], ["B21", "Price"], ["A22", "Notebook"], ["B22", 3],
    ["H24", "Fixed discount rate"], ["H25", 0.15]
  ], formulas: [] };
  if (moduleId === "formula-shop-decisions") return { cells: [
    ["A20", "Item"], ["B20", "Price"], ["C20", "Sold"], ["D20", "Revenue"],
    ["A21", "Pen"], ["B21", 1.5], ["C21", 28], ["D21", 42],
    ["A22", "Notebook"], ["B22", 3], ["C22", 14], ["D22", 42],
    ["A23", "Folder"], ["B23", 2], ["C23", 19], ["D23", 38]
  ], formulas: [] };
  const cells: Array<[string, string | number]> = [
    ["A1", "Club Formula Practice"],
    ["A3", "Item"], ["B3", "Sold"], ["C3", "Sessions"], ["D3", "Sold per session"], ["E3", "Status"],
    ["A4", "Drama"], ["B4", 18], ["C4", 6],
    ["A5", "Robotics"], ["B5", 22], ["C5", 6],
    ["A6", "Coding"], ["B6", 16], ["C6", 5],
    ["A7", "Art"], ["B7", 20], ["C7", 5],
    ["A8", "Total"], ["A9", "Average"], ["A10", "Lowest"], ["A11", "Highest"]
  ];
  if (moduleId === "formula-copying") {
    return { cells: cells.filter(([cell]) => !["E3", "A9", "A10", "A11"].includes(cell)), formulas: [["D4", "=B4/C4"], ["B8", "=SUM(B4:B7)"]] };
  }
  const needed = moduleId === "formula-totals" ? /^(A[13456789]|[BC][34567])$/
    : moduleId === "formula-statistics" ? /^(A(?:[134567]|10|11)|B[34567])$/
    : moduleId === "formula-conditions" ? /^(A[134567]|B[34567])$/
    : /^(A[134567]|B[34567]|E3)$/;
  return { cells: cells.filter(([cell]) => needed.test(cell)), formulas: [] };
}
