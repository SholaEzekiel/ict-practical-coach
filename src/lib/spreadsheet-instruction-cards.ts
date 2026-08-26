export type SpreadsheetInstructionCard = {
  id: string;
  category:
    | "selection"
    | "data-entry"
    | "formatting"
    | "formula"
    | "chart"
    | "layout"
    | "data-tools";
  skill: string;
  moduleId?: string;
  moduleTitle?: string;
  studentGoal: string;
  scenario?: string;
  studentSteps: string[];
  supportedInCurrentLab: boolean;
  instruction: string;
  meaning: string;
  clickPath: string[];
  expectedSelection?: string;
  expectedAction: string;
  expectedResult: string;
  autoCheck: {
    cells: Array<{
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
        fontFamilyIncludes?: string[];
        fontSizeAtLeast?: number;
        wrapText?: boolean;
        border?: boolean;
        numberPatternIncludes?: string[];
      };
    }>;
    rows?: Array<{ row: number; minHeight?: number; maxHeight?: number }>;
    columns?: Array<{ column: string; minWidth?: number; maxWidth?: number }>;
  };
  chartCheck?: {
    type: "column" | "bar" | "pie";
    sourceRange: string;
    title: string;
    categoryLabel?: string;
    valueLabel?: string;
    legend?: boolean;
  };
  commonMistakes: string[];
  feedback: {
    wrongSelection?: string;
    wrongTool: string;
    wrongResult: string;
  };
  hints: string[];
  difficulty: "beginner" | "developing" | "confident";
  marks: number;
};

export const spreadsheetModules = [
  { id: "intro", title: "Introduction", description: "Cells, rows, columns, ranges, and confident movement around the worksheet." },
  { id: "data-entry", title: "Data Entry", description: "Typing labels, values, headings, and small tables accurately." },
  { id: "formatting", title: "Formatting", description: "Bold, italic, underline, alignment, number formats, fill colour, and readable tables." },
  { id: "formula", title: "Formulae", description: "Cell-reference formulae, SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF, SUMIF, AVERAGEIF, and lookups." },
  { id: "data-tools", title: "Data Tools", description: "Sorting, filtered views, searching, and preparing source data." },
  { id: "chart", title: "Charts", description: "Selecting chart data, chart titles, axis labels, and chart-ready source tables." },
  { id: "layout", title: "Print and Layout", description: "Print areas, row and column sizing, gridlines, and page layout preparation." },
  { id: "free-practice", title: "Free Practice", description: "Open spreadsheet workspace for importing, pasting, editing, downloading, and experimenting." }
];

function baseCard(partial: Omit<SpreadsheetInstructionCard, "supportedInCurrentLab" | "commonMistakes" | "hints" | "marks"> & Partial<Pick<SpreadsheetInstructionCard, "commonMistakes" | "hints" | "marks">>): SpreadsheetInstructionCard {
  return {
    supportedInCurrentLab: true,
    commonMistakes: ["Using the wrong cell", "Skipping a required value", "Typing extra spaces or text"],
    hints: ["Read the cell reference first.", "Check the formula bar before pressing Enter."],
    marks: 2,
    ...partial
  };
}

function entryCard(moduleId: string, id: string, goal: string, scenario: string, cells: Array<[string, string | number]>, difficulty: SpreadsheetInstructionCard["difficulty"] = "beginner") {
  const steps = cells.flatMap(([cell, value]) => [`Click ${cell}.`, `Type exactly "${value}".`, "Press Enter."]);
  return baseCard({
    id,
    moduleId,
    moduleTitle: moduleTitle(moduleId),
    category: moduleId === "intro" ? "selection" : "data-entry",
    skill: "Enter exact data",
    studentGoal: goal,
    scenario,
    studentSteps: steps,
    instruction: goal,
    meaning: "Each value must be entered in the exact cell named in the task.",
    clickPath: ["Worksheet grid", "Named cell", "Type value"],
    expectedSelection: cells.length === 1 ? cells[0][0] : `${cells[0][0]}:${cells[cells.length - 1][0]}`,
    expectedAction: "enter-values",
    expectedResult: cells.map(([cell, value]) => `${cell} shows ${value}`).join("; "),
    autoCheck: { cells: cells.map(([cell, value]) => ({ cell, value })) },
    feedback: {
      wrongSelection: "Use the exact cell references named in the steps.",
      wrongTool: "This is a direct worksheet entry task.",
      wrongResult: "Check every named cell. The answer is checked by cell reference, not by where it appears visually."
    },
    difficulty
  });
}

function formulaCard(id: string, goal: string, scenario: string, cell: string, formula: string, value: string | number, extraSteps: string[] = [], difficulty: SpreadsheetInstructionCard["difficulty"] = "developing") {
  return baseCard({
    id,
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: formula.replace(/^=/, "").split("(")[0] || "Formula",
    studentGoal: goal,
    scenario,
    studentSteps: [`Click ${cell}.`, `Type exactly "${formula}".`, "Press Enter.", ...extraSteps],
    instruction: goal,
    meaning: "A formula must start with = and use cell references so the result updates if source data changes.",
    clickPath: [`Cell ${cell}`, "Formula bar", `Type ${formula}`],
    expectedSelection: cell,
    expectedAction: "formula",
    expectedResult: `${cell} shows ${value} and contains the formula ${formula}.`,
    autoCheck: { cells: [{ cell, formula, value }] },
    commonMistakes: ["Typing the answer instead of a formula", "Using the wrong range", "Missing the equals sign"],
    feedback: {
      wrongSelection: `Place the formula in ${cell}.`,
      wrongTool: "Type the formula directly in the cell or in the formula bar.",
      wrongResult: `${cell} must contain ${formula}, not a manually typed result.`
    },
    hints: ["Formulae begin with =.", "Cell references are more useful than manually typed answers."],
    difficulty
  });
}

function formulaIncludesCard(id: string, goal: string, scenario: string, cell: string, formulaIncludes: string[], value: string | number, steps: string[], difficulty: SpreadsheetInstructionCard["difficulty"] = "confident") {
  return baseCard({
    id,
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: formulaIncludes[0],
    studentGoal: goal,
    scenario,
    studentSteps: steps,
    instruction: goal,
    meaning: "Use the named function and references to produce a result that changes with the worksheet data.",
    clickPath: [`Cell ${cell}`, "Formula bar", `Use ${formulaIncludes[0]}`],
    expectedSelection: cell,
    expectedAction: "formula",
    expectedResult: `${cell} shows ${value} using a formula.`,
    autoCheck: { cells: [{ cell, formulaIncludes, value }] },
    commonMistakes: ["Typing the displayed answer manually", "Using the wrong lookup range", "Leaving out exact match"],
    feedback: {
      wrongSelection: `Place the formula in ${cell}.`,
      wrongTool: `Use a ${formulaIncludes[0]} formula in the cell or formula bar.`,
      wrongResult: `${cell} must show ${value} using the required formula parts.`
    },
    hints: ["Check commas and brackets carefully.", "Use absolute references for fixed lookup tables."],
    difficulty
  });
}

function formatCardForModule(moduleId: string, id: string, goal: string, scenario: string, range: string, command: string, cells: SpreadsheetInstructionCard["autoCheck"]["cells"], difficulty: SpreadsheetInstructionCard["difficulty"] = "developing", extraChecks: Omit<SpreadsheetInstructionCard["autoCheck"], "cells"> = {}) {
  return baseCard({
    id,
    moduleId,
    moduleTitle: moduleTitle(moduleId),
    category: "formatting",
    skill: command,
    studentGoal: goal,
    scenario,
    studentSteps: [`Select ${range}.`, `Use the toolbar or three dots / More menu to choose ${command}.`, "Click Check my result."],
    instruction: goal,
    meaning: "Formatting changes how data is displayed without changing the underlying data.",
    clickPath: ["Toolbar", command],
    expectedSelection: range,
    expectedAction: command.toLowerCase().replace(/\s+/g, "-"),
    expectedResult: `${range} uses ${command}.`,
    autoCheck: { cells, ...extraChecks },
    commonMistakes: ["Selecting the wrong range", "Changing the value instead of formatting", "Applying the command to only one cell"],
    feedback: {
      wrongSelection: `Select ${range}.`,
      wrongTool: `Use ${command} from the toolbar or More menu.`,
      wrongResult: `The selected cells must visibly use ${command}.`
    },
    hints: ["Select the range first.", "If a toolbar button is hidden, open the three dots / More menu."],
    difficulty
  });
}

function formatCard(id: string, goal: string, scenario: string, range: string, command: string, cells: SpreadsheetInstructionCard["autoCheck"]["cells"], difficulty: SpreadsheetInstructionCard["difficulty"] = "developing", extraChecks: Omit<SpreadsheetInstructionCard["autoCheck"], "cells"> = {}) {
  return formatCardForModule("formatting", id, goal, scenario, range, command, cells, difficulty, extraChecks);
}

function formatTaskCard(args: {
  id: string;
  goal: string;
  scenario: string;
  setup: Array<[string, string | number]>;
  range: string;
  command: string;
  checks: SpreadsheetInstructionCard["autoCheck"]["cells"];
  difficulty?: SpreadsheetInstructionCard["difficulty"];
  extraChecks?: Omit<SpreadsheetInstructionCard["autoCheck"], "cells">;
  extraSteps?: string[];
}) {
  const setupSteps = args.setup.flatMap(([cell, value]) => [`Click ${cell}.`, `Type exactly "${value}".`, "Press Enter."]);
  return baseCard({
    id: args.id,
    moduleId: "formatting",
    moduleTitle: "Formatting",
    category: "formatting",
    skill: args.command,
    studentGoal: args.goal,
    scenario: args.scenario,
    studentSteps: [
      ...setupSteps,
      `Select ${args.range}.`,
      `Use the toolbar or three dots / More menu to choose ${args.command}.`,
      ...(args.extraSteps || []),
      "Click Check my result."
    ],
    instruction: args.goal,
    meaning: "First enter only the data needed for this task, then format the selected cells.",
    clickPath: ["Worksheet grid", "Named cells", "Toolbar", args.command],
    expectedSelection: args.range,
    expectedAction: args.command.toLowerCase().replace(/\s+/g, "-"),
    expectedResult: `${args.range} uses ${args.command}.`,
    autoCheck: { cells: args.checks, ...(args.extraChecks || {}) },
    commonMistakes: ["Formatting before entering the setup data", "Selecting the wrong range", "Changing the value instead of the format"],
    feedback: {
      wrongSelection: `Enter the setup data, then select ${args.range}.`,
      wrongTool: `Use ${args.command} from the toolbar or More menu.`,
      wrongResult: `Check the setup data and make sure ${args.range} visibly uses ${args.command}.`
    },
    hints: ["Do the setup cells first.", "Select the exact range before choosing the formatting command."],
    difficulty: args.difficulty || "developing"
  });
}

function moduleTitle(moduleId: string) {
  return spreadsheetModules.find((module) => module.id === moduleId)?.title || "Spreadsheets";
}

const introCells = [
  ["A1", "Start"], ["B2", "Desk"], ["C3", "Found"], ["D4", "Check"], ["E5", "Middle"],
  ["F6", "Column"], ["G7", "Club"], ["H8", "Row"], ["I9", "Ready"], ["J10", "Target"],
  ["K11", "Marker"], ["L12", "End"], ["A15", "Down"], ["C16", "Register"], ["E18", "Finish"],
  ["G20", "Note"], ["I22", "House"], ["L24", "Wide"], ["B26", "Lower"], ["D28", "Point"],
  ["F30", "Scroll"], ["H32", "Far"], ["J34", "Complete"], ["L36", "Last"], ["A40", "Done"]
] as const;

const introSpreadsheetCards = introCells.map(([cell, value], index) =>
  entryCard(
    "intro",
    `sheet-intro-cell-${String(index + 1).padStart(2, "0")}`,
    `Find cell ${cell}.`,
    index < 12 ? "Practise finding a cell by matching its column letter and row number." : "Practise scrolling down or across while staying inside the worksheet.",
    [[cell, value]],
  )
);

const dataEntryCards = [
  entryCard("data-entry", "sheet-data-title", "Create the worksheet title.", "The activities coordinator needs a new club report from a blank sheet.", [["A1", "Club Attendance Summary"]]),
  entryCard("data-entry", "sheet-data-headings", "Enter the table headings.", "Add the headings before typing the records.", [["A3", "Club"], ["B3", "Attendance"], ["C3", "Sessions"], ["D3", "Average"]]),
  entryCard("data-entry", "sheet-data-club-names", "Add the club names.", "The school office has listed the clubs for the report.", [["A4", "Drama"], ["A5", "Robotics"], ["A6", "Coding"], ["A7", "Art"]]),
  entryCard("data-entry", "sheet-data-attendance", "Add the attendance numbers.", "Each club needs its attendance value entered beside its name.", [["B4", 18], ["B5", 22], ["B6", 16], ["B7", 20]]),
  entryCard("data-entry", "sheet-data-sessions", "Add the number of sessions.", "The activities coordinator also needs the number of sessions run by each club.", [["C4", 6], ["C5", 6], ["C6", 5], ["C7", 5]]),
  entryCard("data-entry", "sheet-data-total-label", "Add the total row label.", "Prepare the summary row before formula practice.", [["A8", "Total"]]),
  entryCard("data-entry", "sheet-data-library-title", "Create a library table title.", "A librarian is preparing a second small table below the club report.", [["A12", "Library Borrowing"]]),
  entryCard("data-entry", "sheet-data-library-headings", "Enter library table headings.", "The borrowing table needs clear columns.", [["A14", "Category"], ["B14", "Borrowed"]]),
  entryCard("data-entry", "sheet-data-library-categories", "Enter library categories.", "Type the category names down column A.", [["A15", "Fiction"], ["A16", "History"], ["A17", "Science"], ["A18", "Art"]]),
  entryCard("data-entry", "sheet-data-library-values", "Enter books borrowed.", "Type the borrowed-book counts beside each category.", [["B15", 34], ["B16", 18], ["B17", 26], ["B18", 12]]),
  entryCard("data-entry", "sheet-data-canteen-title", "Create a canteen sales table title.", "The canteen manager needs a small sales list.", [["D12", "Canteen Sales"]]),
  entryCard("data-entry", "sheet-data-canteen-headings", "Enter canteen table headings.", "The canteen list needs item and sold columns.", [["D14", "Item"], ["E14", "Sold"]]),
  entryCard("data-entry", "sheet-data-canteen-items", "Enter canteen item names.", "Type each item in its own cell.", [["D15", "Sandwich"], ["D16", "Juice"], ["D17", "Fruit"], ["D18", "Water"]]),
  entryCard("data-entry", "sheet-data-canteen-values", "Enter canteen sales numbers.", "Type the number sold beside each item.", [["E15", 45], ["E16", 38], ["E17", 24], ["E18", 52]]),
  entryCard("data-entry", "sheet-data-stock-title", "Create a stock table title.", "The ICT technician is preparing a stock check table.", [["A22", "ICT Stock Check"]]),
  entryCard("data-entry", "sheet-data-stock-headings", "Enter stock headings.", "The stock table needs three clear headings.", [["A24", "Item"], ["B24", "In stock"], ["C24", "Needed"]]),
  entryCard("data-entry", "sheet-data-stock-items", "Enter stock item names.", "Type each item down the first stock column.", [["A25", "Keyboard"], ["A26", "Mouse"], ["A27", "Monitor"], ["A28", "Cable"]]),
  entryCard("data-entry", "sheet-data-stock-values", "Enter stock numbers.", "Type the stock count and needed count for each item.", [["B25", 14], ["C25", 20], ["B26", 18], ["C26", 18], ["B27", 9], ["C27", 12], ["B28", 42], ["C28", 40]], "developing"),
  entryCard("data-entry", "sheet-data-trip-title", "Create a trip register title.", "The trip leader needs a small payment register.", [["F22", "Trip Register"]]),
  entryCard("data-entry", "sheet-data-trip-record", "Enter one trip-register record.", "Enter one learner record for the trip leader.", [["F24", "Name"], ["G24", "Class"], ["H24", "Paid"], ["F25", "Amara"], ["G25", "10A"], ["H25", "Yes"]], "developing"),
  entryCard("data-entry", "sheet-data-task-school-shop", "Build a school shop table.", "The finance assistant needs a clean source table for later calculations.", [["A32", "School Shop"], ["A34", "Item"], ["B34", "Price"], ["C34", "Sold"], ["A35", "Pen"], ["B35", 1.5], ["C35", 28], ["A36", "Notebook"], ["B36", 3], ["C36", 14], ["A37", "Folder"], ["B37", 2], ["C37", 19]], "developing"),
  entryCard("data-entry", "sheet-data-task-room-booking", "Build a room booking list.", "The admin office needs a list that can later be sorted by room or time.", [["E32", "Room Booking"], ["E34", "Room"], ["F34", "Teacher"], ["G34", "Time"], ["E35", "Lab 1"], ["F35", "Mr Ade"], ["G35", "09:00"], ["E36", "Lab 2"], ["F36", "Ms Chen"], ["G36", "10:30"], ["E37", "Hall"], ["F37", "Mrs Cole"], ["G37", "12:00"]], "developing"),
  entryCard("data-entry", "sheet-data-task-reading-log", "Build a reading log.", "The English teacher wants a short table showing pages read by three learners.", [["I32", "Reading Log"], ["I34", "Learner"], ["J34", "Book"], ["K34", "Pages"], ["I35", "Amina"], ["J35", "River Run"], ["K35", 42], ["I36", "Joel"], ["J36", "Sky Map"], ["K36", 38], ["I37", "Priya"], ["J37", "Code Club"], ["K37", 51]], "developing"),
  entryCard("data-entry", "sheet-data-task-attendance-register", "Build a lesson attendance register.", "The tutor needs a register that can later be formatted and counted.", [["A41", "Lesson Register"], ["A43", "Name"], ["B43", "Present"], ["C43", "Late"], ["A44", "Lina"], ["B44", "Yes"], ["C44", "No"], ["A45", "Omar"], ["B45", "Yes"], ["C45", "Yes"], ["A46", "Tariq"], ["B46", "No"], ["C46", "No"]], "developing"),
  entryCard("data-entry", "sheet-data-task-device-loan", "Build a device loan table.", "The ICT room needs a small table showing who borrowed each device.", [["E41", "Device Loan"], ["E43", "Device"], ["F43", "Borrower"], ["G43", "Returned"], ["E44", "Tablet"], ["F44", "Maya"], ["G44", "Yes"], ["E45", "Camera"], ["F45", "Ben"], ["G45", "No"], ["E46", "Laptop"], ["F46", "Sofia"], ["G46", "Yes"]], "developing"),
  entryCard("data-entry", "sheet-data-task-sports-points", "Build a sports points table.", "The PE department needs house points ready for ranking.", [["I41", "Sports Points"], ["I43", "House"], ["J43", "Points"], ["K43", "Position"], ["I44", "Red"], ["J44", 58], ["I45", "Blue"], ["J45", 64], ["I46", "Green"], ["J46", 49]], "developing"),
  entryCard("data-entry", "sheet-data-task-event-budget", "Build an event budget table.", "The events team needs income and cost figures entered accurately.", [["A50", "Event Budget"], ["A52", "Item"], ["B52", "Income"], ["C52", "Cost"], ["A53", "Tickets"], ["B53", 240], ["C53", 60], ["A54", "Refreshments"], ["B54", 90], ["C54", 45], ["A55", "Printing"], ["B55", 0], ["C55", 28]], "developing"),
  entryCard("data-entry", "sheet-data-task-homework-tracker", "Build a homework tracker.", "The form tutor wants a simple table to track submitted work.", [["E50", "Homework Tracker"], ["E52", "Student"], ["F52", "Task"], ["G52", "Submitted"], ["E53", "Nora"], ["F53", "Spreadsheet"], ["G53", "Yes"], ["E54", "Eli"], ["F54", "Database"], ["G54", "No"], ["E55", "Kai"], ["F55", "Website"], ["G55", "Yes"]], "developing"),
  entryCard("data-entry", "sheet-data-task-club-schedule", "Build a club schedule.", "The office wants a compact schedule students can read quickly.", [["I50", "Club Schedule"], ["I52", "Club"], ["J52", "Day"], ["K52", "Room"], ["I53", "Drama"], ["J53", "Monday"], ["K53", "Hall"], ["I54", "Robotics"], ["J54", "Tuesday"], ["K54", "Lab 1"], ["I55", "Art"], ["J55", "Friday"], ["K55", "Room 3"]], "developing"),
  entryCard("data-entry", "sheet-data-task-final-check", "Enter a final check note.", "Before moving to formatting, record that the connected data-entry tables are complete.", [["M50", "Data entry complete"], ["M51", "Ready for formatting"]], "developing")
];

const formattingCards = [
  formatTaskCard({
    id: "sheet-format-title-bold",
    goal: "Create a bold report title.",
    scenario: "Apex Study Hub needs a short attendance sheet with a clear title.",
    setup: [["A1", "Club Attendance Summary"]],
    range: "A1",
    command: "Bold",
    checks: [{ cell: "A1", value: "Club Attendance Summary", format: { bold: true } }],
    difficulty: "beginner"
  }),
  formatTaskCard({
    id: "sheet-format-title-merge-centre",
    goal: "Merge and centre a title.",
    scenario: "The title must sit above four columns without being repeated.",
    setup: [["A3", "Weekly Club Register"], ["A5", "Club"], ["B5", "Learners"], ["C5", "Sessions"], ["D5", "Average"]],
    range: "A3:D3",
    command: "Merge & Centre",
    checks: [{ cell: "A3", value: "Weekly Club Register", format: { horizontalAlign: "center" } }]
  }),
  formatTaskCard({
    id: "sheet-format-headings-bold",
    goal: "Make table headings bold.",
    scenario: "A small register needs headings that are easy to separate from the records.",
    setup: [["A7", "Name"], ["B7", "Class"], ["C7", "Paid"], ["A8", "Amara"], ["B8", "10A"], ["C8", "Yes"]],
    range: "A7:C7",
    command: "Bold",
    checks: ["A7", "B7", "C7"].map((cell) => ({ cell, format: { bold: true } }))
  }),
  formatTaskCard({
    id: "sheet-format-heading-fill",
    goal: "Shade a heading row.",
    scenario: "The office wants the heading row to stand out when the sheet is printed.",
    setup: [["A10", "Item"], ["B10", "Stock"], ["C10", "Needed"], ["A11", "Mouse"], ["B11", 18], ["C11", 20]],
    range: "A10:C10",
    command: "Fill colour",
    checks: ["A10", "B10", "C10"].map((cell) => ({ cell, format: { background: true } }))
  }),
  formatTaskCard({
    id: "sheet-format-title-font-family",
    goal: "Change the title font.",
    scenario: "The display title should use a standard sans-serif font.",
    setup: [["E1", "Apex Revision Timetable"]],
    range: "E1",
    command: "Font family",
    checks: [{ cell: "E1", value: "Apex Revision Timetable", format: { fontFamilyIncludes: ["arial", "calibri", "aptos"] } }]
  }),
  formatTaskCard({
    id: "sheet-format-title-font-size",
    goal: "Increase a title font size.",
    scenario: "A title should be visibly larger than the normal worksheet text.",
    setup: [["E3", "Homework Tracker"]],
    range: "E3",
    command: "Font size",
    checks: [{ cell: "E3", value: "Homework Tracker", format: { fontSizeAtLeast: 14 } }]
  }),
  formatTaskCard({
    id: "sheet-format-title-font-colour",
    goal: "Change a title font colour.",
    scenario: "The teacher wants the title to use a different text colour from the table.",
    setup: [["E5", "Device Loan List"]],
    range: "E5",
    command: "Font colour",
    checks: [{ cell: "E5", value: "Device Loan List", format: { fontColor: true } }]
  }),
  formatTaskCard({
    id: "sheet-format-note-italic",
    goal: "Italicise a note.",
    scenario: "A draft note should look different from the final table values.",
    setup: [["E7", "Check totals before printing"]],
    range: "E7",
    command: "Italic",
    checks: [{ cell: "E7", value: "Check totals before printing", format: { italic: true } }]
  }),
  formatTaskCard({
    id: "sheet-format-total-underline",
    goal: "Underline a total label.",
    scenario: "The final total row label should be emphasized.",
    setup: [["E9", "Total"], ["F9", 96]],
    range: "E9",
    command: "Underline",
    checks: [{ cell: "E9", value: "Total", format: { underline: true } }]
  }),
  formatTaskCard({
    id: "sheet-format-centre-short-values",
    goal: "Centre short values.",
    scenario: "Yes and No entries should line up neatly in their column.",
    setup: [["A14", "Learner"], ["B14", "Submitted"], ["A15", "Nora"], ["B15", "Yes"], ["A16", "Eli"], ["B16", "No"]],
    range: "B15:B16",
    command: "Centre align",
    checks: ["B15", "B16"].map((cell) => ({ cell, format: { horizontalAlign: "center" as const } }))
  }),
  formatTaskCard({
    id: "sheet-format-right-align-numbers",
    goal: "Right-align score values.",
    scenario: "Numeric scores should align to the right of their cells.",
    setup: [["D14", "House"], ["E14", "Points"], ["D15", "Red"], ["E15", 58], ["D16", "Blue"], ["E16", 64]],
    range: "E15:E16",
    command: "Right align",
    checks: ["E15", "E16"].map((cell) => ({ cell, format: { horizontalAlign: "right" as const } }))
  }),
  formatTaskCard({
    id: "sheet-format-two-decimals",
    goal: "Show values with two decimal places.",
    scenario: "Average scores should display consistently.",
    setup: [["A20", "Average"], ["A21", 18], ["A22", 22], ["A23", 16]],
    range: "A21:A23",
    command: "Two decimal places",
    checks: ["A21", "A22", "A23"].map((cell) => ({ cell, format: { numberPatternIncludes: [".00", "0.00"] } }))
  }),
  formatTaskCard({
    id: "sheet-format-zero-decimals",
    goal: "Show counts as whole numbers.",
    scenario: "Session counts should not show unnecessary decimal places.",
    setup: [["C20", "Sessions"], ["C21", 6], ["C22", 5], ["C23", 7]],
    range: "C21:C23",
    command: "Zero decimal places",
    checks: ["C21", "C22", "C23"].map((cell) => ({ cell, format: { numberPatternIncludes: ["0"] } }))
  }),
  formatTaskCard({
    id: "sheet-format-currency",
    goal: "Format prices as currency.",
    scenario: "The school shop price list should clearly show money.",
    setup: [["E20", "Item"], ["F20", "Price"], ["E21", "Pen"], ["F21", 1.5], ["E22", "Notebook"], ["F22", 3]],
    range: "F21:F22",
    command: "Currency",
    checks: ["F21", "F22"].map((cell) => ({ cell, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } }))
  }),
  formatTaskCard({
    id: "sheet-format-percent",
    goal: "Format completion values as percentages.",
    scenario: "Progress values should show percent signs.",
    setup: [["H20", "Task"], ["I20", "Complete"], ["H21", "Spreadsheet"], ["I21", 0.72], ["H22", "Database"], ["I22", 0.68]],
    range: "I21:I22",
    command: "Percent style",
    checks: ["I21", "I22"].map((cell) => ({ cell, format: { numberPatternIncludes: ["%"] } }))
  }),
  formatTaskCard({
    id: "sheet-format-wrap-text",
    goal: "Wrap long headings.",
    scenario: "Long headings must stay readable inside their cells.",
    setup: [["A27", "Student full name"], ["B27", "Homework submitted on time"], ["C27", "Teacher comment"], ["A28", "Maya"], ["B28", "Yes"], ["C28", "Good improvement"]],
    range: "A27:C27",
    command: "Wrap Text",
    checks: ["A27", "B27", "C27"].map((cell) => ({ cell, format: { wrapText: true } }))
  }),
  formatTaskCard({
    id: "sheet-format-borders",
    goal: "Add borders to a table.",
    scenario: "A short register should print with clear cell boundaries.",
    setup: [["E27", "Club"], ["F27", "Room"], ["E28", "Drama"], ["F28", "Hall"], ["E29", "Coding"], ["F29", "Lab 1"]],
    range: "E27:F29",
    command: "Borders",
    checks: ["E27", "F27", "E29", "F29"].map((cell) => ({ cell, format: { border: true } }))
  }),
  formatTaskCard({
    id: "sheet-format-row-height",
    goal: "Increase row height.",
    scenario: "The worksheet title row needs extra height for readability.",
    setup: [["A33", "Apex Study Hub Open Day"]],
    range: "Row 33",
    command: "Row height",
    checks: [{ cell: "A33", value: "Apex Study Hub Open Day" }],
    extraChecks: { rows: [{ row: 33, minHeight: 28 }] },
    extraSteps: ["Right-click row 33 or use the row menu, then increase the row height."]
  }),
  formatTaskCard({
    id: "sheet-format-column-width",
    goal: "Widen a column.",
    scenario: "The activity name should fit without being cut off.",
    setup: [["C33", "After-school robotics workshop"]],
    range: "Column C",
    command: "Column width",
    checks: [{ cell: "C33", value: "After-school robotics workshop" }],
    extraChecks: { columns: [{ column: "C", minWidth: 130 }] },
    extraSteps: ["Drag the boundary on the right of column C until the text fits."]
  }),
  formatTaskCard({
    id: "sheet-format-column-reduce",
    goal: "Reduce a column width.",
    scenario: "A short code column should not take too much space.",
    setup: [["E33", "Code"], ["E34", "A1"], ["E35", "B2"]],
    range: "Column E",
    command: "Column width",
    checks: [{ cell: "E33", value: "Code" }],
    extraChecks: { columns: [{ column: "E", maxWidth: 70 }] },
    extraSteps: ["Drag the boundary on the right of column E to make the column narrower."]
  }),
  formatTaskCard({
    id: "sheet-format-fill-and-font-colour",
    goal: "Use fill colour and font colour together.",
    scenario: "A warning label should be easy to notice.",
    setup: [["H33", "Deadline today"]],
    range: "H33",
    command: "Fill colour and font colour",
    checks: [{ cell: "H33", value: "Deadline today", format: { background: true, fontColor: true } }]
  }),
  formatTaskCard({
    id: "sheet-format-budget-heading",
    goal: "Format a budget heading row.",
    scenario: "The events team needs a mini budget table prepared for printing.",
    setup: [["A38", "Item"], ["B38", "Income"], ["C38", "Cost"], ["A39", "Tickets"], ["B39", 240], ["C39", 60], ["A40", "Printing"], ["B40", 0], ["C40", 28]],
    range: "A38:C38",
    command: "Bold and fill colour",
    checks: ["A38", "B38", "C38"].map((cell) => ({ cell, format: { bold: true, background: true } })),
    difficulty: "developing"
  }),
  formatTaskCard({
    id: "sheet-format-budget-currency",
    goal: "Format budget figures as currency.",
    scenario: "Income and cost values should show as money.",
    setup: [["A43", "Item"], ["B43", "Income"], ["C43", "Cost"], ["A44", "Tickets"], ["B44", 240], ["C44", 60], ["A45", "Printing"], ["B45", 0], ["C45", 28]],
    range: "B44:C45",
    command: "Currency",
    checks: ["B44", "C44", "B45", "C45"].map((cell) => ({ cell, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } })),
    difficulty: "developing"
  }),
  formatTaskCard({
    id: "sheet-format-register-combined",
    goal: "Format a register table.",
    scenario: "A teacher wants a small register with bold headings, shaded headings, and centred responses.",
    setup: [["E38", "Name"], ["F38", "Present"], ["G38", "Late"], ["E39", "Lina"], ["F39", "Yes"], ["G39", "No"], ["E40", "Omar"], ["F40", "Yes"], ["G40", "Yes"]],
    range: "E38:G40",
    command: "Bold, fill colour, and centre align",
    checks: [
      ...["E38", "F38", "G38"].map((cell) => ({ cell, format: { bold: true, background: true } })),
      ...["F39", "G39", "F40", "G40"].map((cell) => ({ cell, format: { horizontalAlign: "center" as const } }))
    ],
    difficulty: "developing",
    extraSteps: ["Bold and shade only the headings in E38:G38.", "Centre the Yes and No entries in F39:G40."]
  }),
  formatTaskCard({
    id: "sheet-format-reading-table",
    goal: "Format a reading log.",
    scenario: "A reading log needs wrapped headings and borders before it is shared.",
    setup: [["I38", "Learner name"], ["J38", "Book title"], ["K38", "Pages read this week"], ["I39", "Amina"], ["J39", "River Run"], ["K39", 42], ["I40", "Joel"], ["J40", "Sky Map"], ["K40", 38]],
    range: "I38:K40",
    command: "Wrap Text and Borders",
    checks: [
      ...["I38", "J38", "K38"].map((cell) => ({ cell, format: { wrapText: true } })),
      ...["I38", "K38", "I40", "K40"].map((cell) => ({ cell, format: { border: true } }))
    ],
    difficulty: "developing",
    extraSteps: ["Wrap the headings in I38:K38.", "Add borders to the whole table I38:K40."]
  }),
  formatTaskCard({
    id: "sheet-format-schedule-title",
    goal: "Format a schedule title.",
    scenario: "The club schedule title should look like a heading, not normal table text.",
    setup: [["A48", "Club Schedule"], ["A50", "Club"], ["B50", "Day"], ["C50", "Room"]],
    range: "A48:C48",
    command: "Merge & Centre, font size, and font colour",
    checks: [{ cell: "A48", value: "Club Schedule", format: { horizontalAlign: "center", fontSizeAtLeast: 14, fontColor: true } }],
    difficulty: "developing"
  }),
  formatTaskCard({
    id: "sheet-format-device-list",
    goal: "Format a device loan list.",
    scenario: "The ICT room wants device names styled and borrower details readable.",
    setup: [["E48", "Device Loan"], ["E50", "Device"], ["F50", "Borrower"], ["E51", "Tablet"], ["F51", "Maya"], ["E52", "Camera"], ["F52", "Ben"]],
    range: "E50:F52",
    command: "Bold headings and italic device names",
    checks: [
      { cell: "E50", value: "Device", format: { bold: true } },
      { cell: "F50", value: "Borrower", format: { bold: true } },
      { cell: "E51", value: "Tablet", format: { italic: true } },
      { cell: "E52", value: "Camera", format: { italic: true } }
    ],
    difficulty: "developing",
    extraSteps: ["Bold the headings in E50:F50.", "Italicise the device names in E51:E52."]
  }),
  formatTaskCard({
    id: "sheet-format-progress-table",
    goal: "Format a progress table.",
    scenario: "Course progress must show percentages and a clear heading row.",
    setup: [["H48", "Module"], ["I48", "Complete"], ["H49", "Spreadsheets"], ["I49", 0.75], ["H50", "Documents"], ["I50", 0.6]],
    range: "H48:I50",
    command: "Bold, fill colour, and Percent style",
    checks: [
      { cell: "H48", value: "Module", format: { bold: true, background: true } },
      { cell: "I48", value: "Complete", format: { bold: true, background: true } },
      { cell: "I49", value: 0.75, format: { numberPatternIncludes: ["%"] } },
      { cell: "I50", value: 0.6, format: { numberPatternIncludes: ["%"] } }
    ],
    difficulty: "developing",
    extraSteps: ["Bold and shade H48:I48.", "Format I49:I50 as percentages."]
  }),
  formatTaskCard({
    id: "sheet-format-final-attendance-report",
    goal: "Complete a formatted attendance report.",
    scenario: "This final formatting task combines the skills used across the module.",
    setup: [["A55", "Attendance Report"], ["A57", "Club"], ["B57", "Learners"], ["C57", "Budget"], ["D57", "Complete"], ["A58", "Drama"], ["B58", 18], ["C58", 45], ["D58", 0.8], ["A59", "Coding"], ["B59", 22], ["C59", 60], ["D59", 0.9]],
    range: "A55:D59",
    command: "Combined formatting",
    checks: [
      { cell: "A55", value: "Attendance Report", format: { horizontalAlign: "center", bold: true, fontSizeAtLeast: 14 } },
      ...["A57", "B57", "C57", "D57"].map((cell) => ({ cell, format: { bold: true, background: true, border: true } })),
      { cell: "C58", value: 45, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } },
      { cell: "C59", value: 60, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } },
      { cell: "D58", value: 0.8, format: { numberPatternIncludes: ["%"] } },
      { cell: "D59", value: 0.9, format: { numberPatternIncludes: ["%"] } }
    ],
    difficulty: "confident",
    extraSteps: ["Merge and centre A55:D55, then make the title bold and larger.", "Bold and shade A57:D57.", "Add borders to A57:D59.", "Format C58:C59 as currency and D58:D59 as percentages."]
  })
];

const formulaDataCards = [
  entryCard("formula", "sheet-formula-enter-title", "Create the formula practice title.", "Start a clean formula worksheet by entering the title.", [["A1", "Formula Practice"]]),
  entryCard("formula", "sheet-formula-enter-headings", "Enter the formula table headings.", "The formula table needs labels before numbers are entered.", [["A3", "Item"], ["B3", "Sold"], ["C3", "Sessions"], ["D3", "Average"], ["E3", "Status"]]),
  entryCard("formula", "sheet-formula-enter-items", "Enter the item names.", "Type the source labels for the formula tasks.", [["A4", "Drama"], ["A5", "Robotics"], ["A6", "Coding"], ["A7", "Art"]]),
  entryCard("formula", "sheet-formula-enter-numbers", "Enter the source numbers.", "Type the values that the formulas will use.", [["B4", 18], ["C4", 6], ["B5", 22], ["C5", 6], ["B6", 16], ["C6", 5], ["B7", 20], ["C7", 5]], "developing")
];

const formulaCards = [
  ...formulaDataCards,
  formulaCard("sheet-formula-divide", "Calculate the first average.", "Divide sold values by sessions for Drama.", "D4", "=B4/C4", 3),
  formulaIncludesCard("sheet-formula-copy-average", "Copy the average formula down.", "Use the fill handle so each row calculates its own average.", "D7", ["B7/C7"], 4, ["Click D4.", "Point at the small fill handle at the bottom-right corner of D4.", "Drag the fill handle down to D7.", "Check that D5:D7 use their own row references."]),
  formulaCard("sheet-formula-sum-sold", "Calculate total sold.", "Use SUM to add all sold values.", "B8", "=SUM(B4:B7)", 76),
  formulaCard("sheet-formula-sum-sessions", "Calculate total sessions.", "Use SUM again with a different range.", "C8", "=SUM(C4:C7)", 22),
  formulaCard("sheet-formula-average-sold", "Calculate average sold.", "Use AVERAGE to find the mean sold value.", "B9", "=AVERAGE(B4:B7)", 19),
  formulaCard("sheet-formula-average-sessions", "Calculate average sessions.", "Practise AVERAGE with the sessions range.", "C9", "=AVERAGE(C4:C7)", 5.5),
  formulaCard("sheet-formula-min-sold", "Find the lowest sold value.", "Use MIN to return the smallest sold value.", "B10", "=MIN(B4:B7)", 16),
  formulaCard("sheet-formula-max-sold", "Find the highest sold value.", "Use MAX to return the largest sold value.", "B11", "=MAX(B4:B7)", 22),
  formulaCard("sheet-formula-count-sold", "Count numeric sold values.", "Use COUNT to count numbers in the sold column.", "B12", "=COUNT(B4:B7)", 4),
  formulaCard("sheet-formula-counta-items", "Count item names.", "Use COUNTA to count non-empty text labels.", "A12", "=COUNTA(A4:A7)", 4),
  formulaCard("sheet-formula-addition", "Add two source values.", "Practise addition using cell references.", "F4", "=B4+C4", 24),
  formulaCard("sheet-formula-subtraction", "Subtract sessions from sold.", "Practise subtraction using cell references.", "F5", "=B5-C5", 16),
  formulaCard("sheet-formula-multiplication", "Multiply sold by sessions.", "Practise multiplication using cell references.", "F6", "=B6*C6", 80),
  formulaCard("sheet-formula-absolute-total", "Use an absolute reference.", "Compare Drama sold against the total sold in B8.", "G4", "=B4/$B$8", 0.2368421053, ["The displayed value may be rounded."], "confident"),
  formulaIncludesCard("sheet-formula-countif", "Count items with sold values at least 20.", "COUNTIF counts cells that meet one condition.", "B14", ["COUNTIF", "B4:B7", ">=20"], 2, ["Click B14.", `Type exactly "=COUNTIF(B4:B7,">=20")".`, "Press Enter."]),
  formulaIncludesCard("sheet-formula-sumif", "Add sold values at least 20.", "SUMIF adds only cells that meet one condition.", "B15", ["SUMIF", "B4:B7", ">=20"], 42, ["Click B15.", `Type exactly "=SUMIF(B4:B7,">=20")".`, "Press Enter."]),
  formulaIncludesCard("sheet-formula-averageif", "Average sold values at least 18.", "AVERAGEIF averages only matching cells.", "B16", ["AVERAGEIF", "B4:B7", ">=18"], 20, ["Click B16.", `Type exactly "=AVERAGEIF(B4:B7,">=18")".`, "Press Enter."]),
  formulaIncludesCard("sheet-formula-if-simple", "Classify Drama as Good or Review.", "IF returns one result when a condition is true and another when it is false.", "E4", ["IF", "B4>=20", "Good", "Review"], "Review", ["Click E4.", `Type exactly "=IF(B4>=20,"Good","Review")".`, "Press Enter."]),
  formulaIncludesCard("sheet-formula-if-copy", "Copy the IF formula down.", "Use relative references so each row checks its own sold value.", "E7", ["IF", "B7>=20"], "Good", ["Click E4.", "Drag the fill handle down to E7.", "Check that E5 and E7 show Good, while E6 shows Review."]),
  formulaIncludesCard("sheet-formula-nested-if", "Classify Robotics with three levels.", "Nested IF can return more than two possible labels.", "H5", ["IF", "B5>=22", "Excellent", "B5>=18", "Good"], "Excellent", ["Click H5.", `Type exactly "=IF(B5>=22,"Excellent",IF(B5>=18,"Good","Review"))".`, "Press Enter."]),
  entryCard("formula", "sheet-formula-lookup-table", "Enter the lookup table.", "Create a small grade table before practising lookups.", [["J3", "Club"], ["K3", "Coach"], ["J4", "Drama"], ["K4", "Mr Lee"], ["J5", "Robotics"], ["K5", "Ms Patel"], ["J6", "Coding"], ["K6", "Mr Obi"], ["J7", "Art"], ["K7", "Mrs Green"]], "developing"),
  formulaIncludesCard("sheet-formula-vlookup", "Use VLOOKUP to return a coach.", "Look up the coach for Robotics using an exact match.", "L5", ["VLOOKUP", "Robotics", "$J$4:$K$7", "2", "FALSE"], "Ms Patel", ["Click L5.", `Type exactly "=VLOOKUP("Robotics",$J$4:$K$7,2,FALSE)".`, "Press Enter."], "confident"),
  entryCard("formula", "sheet-formula-hlookup-table", "Enter the horizontal lookup table.", "Create a small horizontal grade table before HLOOKUP.", [["J10", "Grade"], ["K10", "A"], ["L10", "B"], ["M10", "C"], ["J11", "Points"], ["K11", 80], ["L11", 65], ["M11", 50]], "developing"),
  formulaIncludesCard("sheet-formula-hlookup", "Use HLOOKUP to return points.", "Look across the top row for grade B and return the points beneath it.", "K13", ["HLOOKUP", "B", "$J$10:$M$11", "2", "FALSE"], 65, ["Click K13.", `Type exactly "=HLOOKUP("B",$J$10:$M$11,2,FALSE)".`, "Press Enter."], "confident")
  ,
  formulaIncludesCard("sheet-formula-xlookup", "Use XLOOKUP to return a coach.", "Practise a modern lookup using the club and coach columns.", "L6", ["XLOOKUP", "Coding", "$J$4:$J$7", "$K$4:$K$7"], "Mr Obi", ["Click L6.", `Type exactly "=XLOOKUP("Coding",$J$4:$J$7,$K$4:$K$7)".`, "Press Enter."], "confident"),
  formulaIncludesCard("sheet-formula-ifs", "Classify Art using IFS.", "Use IFS when more than one condition may be tested.", "H7", ["IFS", "B7>=22", "Excellent", "B7>=18", "Good", "TRUE", "Review"], "Good", ["Click H7.", `Type exactly "=IFS(B7>=22,"Excellent",B7>=18,"Good",TRUE,"Review")".`, "Press Enter."], "confident"),
  baseCard({
    id: "sheet-formula-task-shop-source",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "Task-in-task SUM",
    studentGoal: "Build a shop source table.",
    scenario: "The school shop wants to calculate revenue from three items.",
    studentSteps: ["Enter Item, Price, Sold, and Revenue headings in A20:D20.", "Enter Pen, Notebook, and Folder in A21:A23.", "Enter prices 1.5, 3, and 2 in B21:B23.", "Enter sold values 28, 14, and 19 in C21:C23."],
    instruction: "Build the shop source table.",
    meaning: "This combines accurate data entry with preparation for formula work.",
    clickPath: ["Worksheet grid", "Named cells", "Type values"],
    expectedSelection: "A20:D23",
    expectedAction: "task-in-task-source-data",
    expectedResult: "A20:D23 contains the source data needed for the next formula tasks.",
    autoCheck: { cells: [{ cell: "A20", value: "Item" }, { cell: "B20", value: "Price" }, { cell: "C20", value: "Sold" }, { cell: "D20", value: "Revenue" }, { cell: "A21", value: "Pen" }, { cell: "B21", value: 1.5 }, { cell: "C21", value: 28 }, { cell: "A22", value: "Notebook" }, { cell: "B22", value: 3 }, { cell: "C22", value: 14 }, { cell: "A23", value: "Folder" }, { cell: "B23", value: 2 }, { cell: "C23", value: 19 }] },
    feedback: { wrongSelection: "Use the exact cells A20:D23.", wrongTool: "This is a source-data entry task.", wrongResult: "Build the source table first; the formulas come in the following goals." },
    commonMistakes: ["Putting headings in the wrong row", "Skipping a price or sold value", "Typing text into numeric cells"],
    hints: ["Leave D21:D23 empty for the next formula tasks.", "The source table starts at A20."],
    difficulty: "confident",
    marks: 3
  }),
  formulaCard("sheet-formula-task-shop-first-revenue", "Calculate revenue for Pen.", "Use multiplication for the first shop item.", "D21", "=B21*C21", 42, [], "developing"),
  formulaIncludesCard("sheet-formula-task-shop-copy-revenue", "Copy revenue formulas down.", "Use relative references so each item calculates its own revenue.", "D23", ["B23*C23"], 38, ["Click D21.", "Drag the fill handle down to D23.", "Check that each revenue cell uses its own row."], "developing"),
  formulaCard("sheet-formula-task-shop-total-final", "Recalculate total shop revenue.", "Now that all revenue cells are complete, total the revenue column.", "D24", "=SUM(D21:D23)", 122, [], "developing"),
  formulaCard("sheet-formula-task-shop-average", "Calculate average revenue.", "The shop manager wants the mean revenue per item.", "D25", "=AVERAGE(D21:D23)", 40.6666666667, ["The displayed result may be rounded."], "developing"),
  formulaIncludesCard("sheet-formula-task-shop-countif", "Count items selling at least 20 units.", "Use COUNTIF on the Sold column.", "C25", ["COUNTIF", "C21:C23", ">=20"], 1, ["Click C25.", `Type exactly "=COUNTIF(C21:C23,">=20")".`, "Press Enter."], "developing"),
  formulaIncludesCard("sheet-formula-task-shop-sumif", "Total revenue for items selling at least 15 units.", "Use SUMIF with one range for sold values and another for revenue.", "D26", ["SUMIF", "C21:C23", ">=15", "D21:D23"], 80, ["Click D26.", `Type exactly "=SUMIF(C21:C23,">=15",D21:D23)".`, "Press Enter."], "confident"),
  formulaIncludesCard("sheet-formula-task-shop-if", "Classify Pen sales.", "Use IF to show whether Pen sold enough units.", "E21", ["IF", "C21>=20", "High", "Check"], "High", ["Click E21.", `Type exactly "=IF(C21>=20,"High","Check")".`, "Press Enter."], "developing"),
  formulaIncludesCard("sheet-formula-task-shop-nested-if", "Classify Folder sales with three levels.", "Use nested IF to produce a more detailed label.", "E23", ["IF", "C23>=25", "Excellent", "C23>=15", "Good"], "Good", ["Click E23.", `Type exactly "=IF(C23>=25,"Excellent",IF(C23>=15,"Good","Check"))".`, "Press Enter."], "confident"),
  entryCard("formula", "sheet-formula-task-discount-lookup-table", "Create a discount lookup table.", "Prepare a small table for a final lookup task.", [["G20", "Code"], ["H20", "Discount"], ["G21", "A"], ["H21", 0.1], ["G22", "B"], ["H22", 0.15], ["G23", "C"], ["H23", 0.2]], "developing"),
  formulaIncludesCard("sheet-formula-task-vlookup-discount", "Look up a discount rate.", "Use VLOOKUP to return the discount for code B.", "H25", ["VLOOKUP", "B", "$G$21:$H$23", "2", "FALSE"], 0.15, ["Click H25.", `Type exactly "=VLOOKUP("B",$G$21:$H$23,2,FALSE)".`, "Press Enter."], "confident"),
  formulaIncludesCard("sheet-formula-task-absolute-discount", "Apply an absolute discount reference.", "Calculate the discounted price for Notebook using the fixed rate in H25.", "F22", ["B22*(1-$H$25)"], 2.55, ["Click F22.", `Type exactly "=B22*(1-$H$25)".`, "Press Enter."], "confident")
];

const dataToolCards = [
  entryCard("data-tools", "sheet-tools-source-table", "Build the sortable source table.", "Create a small table before using data tools.", [["A1", "Club"], ["B1", "Attendance"], ["C1", "Sessions"], ["A2", "Drama"], ["B2", 18], ["C2", 6], ["A3", "Robotics"], ["B3", 22], ["C3", 6], ["A4", "Coding"], ["B4", 16], ["C4", 5], ["A5", "Art"], ["B5", 20], ["C5", 5]], "developing"),
  baseCard({
    id: "sheet-tools-sort-club",
    moduleId: "data-tools",
    moduleTitle: "Data Tools",
    category: "data-tools",
    skill: "Sort A to Z",
    studentGoal: "Sort club names alphabetically.",
    scenario: "The activities coordinator wants clubs arranged from A to Z.",
    studentSteps: ["Select A1:C5.", "Open Data or the column menu.", "Choose Sort A to Z using the Club column.", "Check that Art is first and Robotics is last."],
    instruction: "Sort A1:C5 by Club from A to Z.",
    meaning: "Sorting reorders full records. Select all columns in the table so row data stays together.",
    clickPath: ["Data", "Sort", "A to Z"],
    expectedSelection: "A1:C5",
    expectedAction: "sort-az",
    expectedResult: "A2:A5 shows Art, Coding, Drama, Robotics.",
    autoCheck: { cells: [{ cell: "A2", value: "Art" }, { cell: "A3", value: "Coding" }, { cell: "A4", value: "Drama" }, { cell: "A5", value: "Robotics" }] },
    commonMistakes: ["Sorting only column A", "Including blank rows", "Sorting in descending order"],
    feedback: { wrongSelection: "Select the full table A1:C5.", wrongTool: "Use Sort A to Z.", wrongResult: "After sorting, column A should read Art, Coding, Drama, Robotics." },
    hints: ["Keep rows together by selecting the full table."],
    difficulty: "developing"
  }),
  entryCard("data-tools", "sheet-tools-filter-copy", "Create a filtered-results area.", "Instead of hiding rows in this early lab, copy records with attendance at least 20 into a visible results area.", [["E1", "Club"], ["F1", "Attendance"], ["E2", "Art"], ["F2", 20], ["E3", "Robotics"], ["F3", 22]], "developing"),
  baseCard({
    id: "sheet-tools-sort-attendance-desc",
    moduleId: "data-tools",
    moduleTitle: "Data Tools",
    category: "data-tools",
    skill: "Sort largest to smallest",
    studentGoal: "Sort attendance from highest to lowest.",
    scenario: "The activities coordinator wants the highest-attendance clubs listed first.",
    studentSteps: ["Select A1:C5.", "Open Data or the column menu.", "Choose Sort largest to smallest using the Attendance column.", "Check that Robotics is first and Coding is last."],
    instruction: "Sort A1:C5 by Attendance from largest to smallest.",
    meaning: "Sort the full records so the values and labels stay together.",
    clickPath: ["Data", "Sort", "Largest to smallest"],
    expectedSelection: "A1:C5",
    expectedAction: "sort-desc",
    expectedResult: "A2:A5 shows Robotics, Art, Drama, Coding.",
    autoCheck: { cells: [{ cell: "A2", value: "Robotics" }, { cell: "B2", value: 22 }, { cell: "A5", value: "Coding" }, { cell: "B5", value: 16 }] },
    commonMistakes: ["Sorting only column B", "Sorting smallest first", "Including blank rows"],
    feedback: { wrongSelection: "Select the full table A1:C5.", wrongTool: "Use Sort largest to smallest.", wrongResult: "After sorting, Robotics should be first and Coding should be last." },
    hints: ["Select all columns in the table before sorting."],
    difficulty: "developing"
  }),
  entryCard("data-tools", "sheet-tools-filter-equals-copy", "Create a sessions filter result.", "Copy clubs with exactly 6 sessions into a clear results area.", [["E6", "Club"], ["F6", "Sessions"], ["E7", "Drama"], ["F7", 6], ["E8", "Robotics"], ["F8", 6]], "developing"),
  entryCard("data-tools", "sheet-tools-clear-filter-note", "Record that all records are visible again.", "After practising filtered results, record the full source range that should remain available.", [["H4", "All records visible"], ["H5", "A1:C5"]], "beginner"),
  entryCard("data-tools", "sheet-tools-find-marker", "Mark the Robotics record.", "Practise finding a record and recording the found value.", [["H1", "Found"], ["H2", "Robotics"]], "beginner")
];

const chartCards = [
  chartCard("sheet-chart-attendance-column", "Create a column chart for club attendance.", "The activities lead wants to compare clubs quickly, so the chart should make the tallest attendance values easy to spot.", [["A1", "Club"], ["B1", "Attendance"], ["A2", "Drama"], ["B2", 18], ["A3", "Robotics"], ["B3", 22], ["A4", "Coding"], ["B4", 16], ["A5", "Art"], ["B5", 20]], "column", "A1:B5", "Club Attendance", "Club", "Attendance"),
  chartCard("sheet-chart-borrowing-bar", "Create a bar chart for library borrowing.", "A librarian wants to compare borrowing by category using horizontal bars.", [["D1", "Category"], ["E1", "Borrowed"], ["D2", "Fiction"], ["E2", 34], ["D3", "History"], ["E3", 18], ["D4", "Science"], ["E4", 26], ["D5", "Art"], ["E5", 12]], "bar", "D1:E5", "Books Borrowed", "Category", "Borrowed"),
  chartCard("sheet-chart-budget-pie", "Create a pie chart for budget share.", "The event team wants to see which cost takes the largest part of the budget.", [["A8", "Cost"], ["B8", "Amount"], ["A9", "Printing"], ["B9", 28], ["A10", "Refreshments"], ["B10", 45], ["A11", "Prizes"], ["B11", 37]], "pie", "A8:B11", "Budget Share"),
  chartCard("sheet-chart-sales-column", "Create a column chart for shop sales.", "The school shop manager wants to identify the strongest selling item at a glance.", [["D8", "Item"], ["E8", "Sold"], ["D9", "Pen"], ["E9", 28], ["D10", "Notebook"], ["E10", 14], ["D11", "Folder"], ["E11", 19], ["D12", "Ruler"], ["E12", 22]], "column", "D8:E12", "School Shop Sales", "Item", "Sold"),
  chartCard("sheet-chart-progress-bar", "Create a bar chart for module completion.", "The tutor wants to compare completion rates across practice modules.", [["A15", "Module"], ["B15", "Complete"], ["A16", "Spreadsheet"], ["B16", 75], ["A17", "Documents"], ["B17", 60], ["A18", "Web"], ["B18", 45]], "bar", "A15:B18", "Module Completion", "Module", "Complete"),
  chartCard("sheet-chart-attendance-pie", "Create a pie chart for attendance share.", "The coordinator wants to see how each club contributes to total attendance.", [["D15", "Club"], ["E15", "Attendance"], ["D16", "Drama"], ["E16", 18], ["D17", "Robotics"], ["E17", 22], ["D18", "Coding"], ["E18", 16], ["D19", "Art"], ["E19", 20]], "pie", "D15:E19", "Attendance Share"),
  chartCard("sheet-chart-sessions-column-labels", "Create a labelled column chart for sessions.", "The head of activities wants the chart to explain what the axes mean.", [["A22", "Club"], ["B22", "Sessions"], ["A23", "Drama"], ["B23", 6], ["A24", "Robotics"], ["B24", 6], ["A25", "Coding"], ["B25", 5], ["A26", "Art"], ["B26", 5]], "column", "A22:B26", "Club Sessions", "Club", "Sessions", true),
  chartCard("sheet-chart-house-points-bar", "Create a bar chart for house points.", "The PE department wants students to identify the leading house from a chart.", [["D22", "House"], ["E22", "Points"], ["D23", "Red"], ["E23", 58], ["D24", "Blue"], ["E24", 64], ["D25", "Green"], ["E25", 49], ["D26", "Yellow"], ["E26", 53]], "bar", "D22:E26", "House Points", "House", "Points", true),
  chartCard("sheet-chart-final-choice", "Choose a suitable chart for revision attendance.", "This final task checks that data can be turned into a chart that helps a reader interpret the pattern.", [["A30", "Day"], ["B30", "Learners"], ["A31", "Monday"], ["B31", 24], ["A32", "Tuesday"], ["B32", 31], ["A33", "Wednesday"], ["B33", 18], ["A34", "Thursday"], ["B34", 27]], "column", "A30:B34", "Revision Attendance", "Day", "Learners", true)
];

function chartCard(
  id: string,
  goal: string,
  scenario: string,
  cells: Array<[string, string | number]>,
  type: NonNullable<SpreadsheetInstructionCard["chartCheck"]>["type"],
  sourceRange: string,
  title: string,
  categoryLabel?: string,
  valueLabel?: string,
  legend = false
) {
  return baseCard({
    id,
    moduleId: "chart",
    moduleTitle: "Charts",
    category: "chart",
    skill: `${type} chart`,
    studentGoal: goal,
    scenario,
    studentSteps: [
      ...cells.flatMap(([cell, value]) => [`Click ${cell}.`, `Type exactly "${value}".`, "Press Enter."]),
      `In the chart panel, set Chart type to ${type}.`,
      `Set Source range to ${sourceRange}.`,
      `Set Chart title to ${title}.`,
      ...(categoryLabel ? [`Set Category label to ${categoryLabel}.`] : []),
      ...(valueLabel ? [`Set Value label to ${valueLabel}.`] : []),
      ...(legend ? ["Turn on Show legend."] : []),
      "Click Check my result."
    ],
    instruction: goal,
    meaning: "A chart turns worksheet values into a visual comparison so patterns are easier to interpret.",
    clickPath: ["Worksheet grid", "Chart practice panel", "Chart type", "Source range", "Generate preview"],
    expectedSelection: sourceRange,
    expectedAction: `${type}-chart`,
    expectedResult: `${title} is shown as a ${type} chart using ${sourceRange}.`,
    autoCheck: { cells: cells.map(([cell, value]) => ({ cell, value })) },
    chartCheck: { type, sourceRange, title, categoryLabel, valueLabel, legend },
    commonMistakes: ["Selecting only the values without labels", "Choosing a chart type that does not fit the question", "Leaving the chart title too vague"],
    feedback: {
      wrongSelection: `Use ${sourceRange} as the chart source range.`,
      wrongTool: `Choose a ${type} chart in the chart practice panel.`,
      wrongResult: `The chart panel must use ${type}, ${sourceRange}, and the title ${title}.`
    },
    hints: ["Use labels and values together.", "Column and bar charts compare categories; pie charts show parts of a whole."],
    difficulty: "developing",
    marks: 3
  });
}

const layoutCards = [
  entryCard("layout", "sheet-layout-title", "Create the print report title.", "Start a clean printable worksheet.", [["A1", "Printable Club Report"]]),
  entryCard("layout", "sheet-layout-table", "Enter the print table.", "Add a compact table for print layout practice.", [["A3", "Club"], ["B3", "Attendance"], ["A4", "Drama"], ["B4", 18], ["A5", "Robotics"], ["B5", 22], ["A6", "Coding"], ["B6", 16]], "developing"),
  entryCard("layout", "sheet-layout-print-area-note", "Record the print area.", "Use a note cell to confirm the print area used for the report.", [["D1", "Print area: A1:B6"]]),
  entryCard("layout", "sheet-layout-orientation-note", "Record landscape orientation.", "Set the page orientation to landscape, then record the setting.", [["D2", "Landscape"]]),
  entryCard("layout", "sheet-layout-gridlines-note", "Record printed gridlines.", "Turn on printed gridlines, then record the setting.", [["D3", "Print gridlines on"]]),
  entryCard("layout", "sheet-layout-fit-note", "Record fit-to-page setting.", "Set the sheet to fit one page wide, then record the setting.", [["D4", "Fit one page wide"]]),
  entryCard("layout", "sheet-layout-margins-note", "Record narrow margins.", "Set narrow margins, then record the setting.", [["D5", "Narrow margins"]]),
  formatCardForModule("layout", "sheet-layout-bold-title", "Bold the print report title.", "The printed report title should stand out.", "A1", "Bold", [{ cell: "A1", value: "Printable Club Report", format: { bold: true } }]),
  formatCardForModule("layout", "sheet-layout-title-height", "Increase the title font size for printing.", "The title should be easy to read on a printed report.", "A1", "Font size", [{ cell: "A1", value: "Printable Club Report", format: { fontSizeAtLeast: 14 } }]),
  formatCardForModule("layout", "sheet-layout-table-borders", "Add borders to the printable table.", "The printed table needs clear boundaries.", "A3:B6", "Borders", ["A3", "B3", "A6", "B6"].map((cell) => ({ cell, format: { border: true } })))
];

export const allSpreadsheetInstructionCards: SpreadsheetInstructionCard[] = [
  ...introSpreadsheetCards,
  ...dataEntryCards,
  ...formattingCards,
  ...formulaCards,
  ...dataToolCards,
  ...chartCards,
  ...layoutCards
];

const moduleOrder = new Map(spreadsheetModules.map((module, index) => [module.id, index]));

function moduleSortIndex(card: SpreadsheetInstructionCard) {
  return moduleOrder.get(card.moduleId || card.category) ?? spreadsheetModules.length;
}

export function getSpreadsheetCard(id: string) {
  return allSpreadsheetInstructionCards.find((card) => card.id === id);
}

export const firstSpreadsheetCard = allSpreadsheetInstructionCards[0];

export const currentLabSpreadsheetCards = allSpreadsheetInstructionCards
  .filter((card) => card.supportedInCurrentLab && card.autoCheck)
  .sort((first, second) => moduleSortIndex(first) - moduleSortIndex(second));

export function getSpreadsheetModule(moduleId?: string) {
  return spreadsheetModules.find((module) => module.id === moduleId);
}

export function getSpreadsheetCardsForModule(moduleId?: string) {
  if (moduleId === "free-practice") return [];
  return allSpreadsheetInstructionCards
    .filter((card) => !moduleId || (card.moduleId || card.category) === moduleId)
    .sort((first, second) => moduleSortIndex(first) - moduleSortIndex(second));
}
