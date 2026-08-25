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
        fontSizeAtLeast?: number;
        wrapText?: boolean;
        border?: boolean;
        numberPatternIncludes?: string[];
      };
    }>;
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

function formatCard(id: string, goal: string, scenario: string, range: string, command: string, cells: SpreadsheetInstructionCard["autoCheck"]["cells"], difficulty: SpreadsheetInstructionCard["difficulty"] = "developing") {
  return baseCard({
    id,
    moduleId: "formatting",
    moduleTitle: "Formatting",
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
    autoCheck: { cells },
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
  formatCard("sheet-format-title-bold", "Make the main title bold.", "The report title must stand out at the top of the sheet.", "A1", "Bold", [{ cell: "A1", value: "Club Attendance Summary", format: { bold: true } }], "beginner"),
  formatCard("sheet-format-title-centre", "Centre the title across the table.", "The title should sit neatly above the four-column table.", "A1:D1", "Merge & Centre", [{ cell: "A1", value: "Club Attendance Summary", format: { horizontalAlign: "center" } }]),
  formatCard("sheet-format-headings-bold", "Make the table headings bold.", "The reader should easily distinguish headings from values.", "A3:D3", "Bold", ["A3", "B3", "C3", "D3"].map((cell) => ({ cell, format: { bold: true } }))),
  formatCard("sheet-format-heading-fill", "Shade the heading row.", "A light background helps the heading row stand out.", "A3:D3", "Fill colour", ["A3", "B3", "C3", "D3"].map((cell) => ({ cell, format: { background: true } }))),
  formatCard("sheet-format-attendance-decimal", "Show attendance with two decimal places.", "The attendance officer wants consistent decimal formatting.", "B4:B7", "Two decimal places", ["B4", "B5", "B6", "B7"].map((cell) => ({ cell, format: { numberPatternIncludes: [".00", "0.00"] } }))),
  formatCard("sheet-format-session-number", "Show sessions as whole numbers.", "Session counts should not display decimal places.", "C4:C7", "Zero decimal places", ["C4", "C5", "C6", "C7"].map((cell) => ({ cell, format: { numberPatternIncludes: ["0"] } }))),
  formatCard("sheet-format-currency", "Format canteen sales values as currency.", "The canteen sales column should show money clearly.", "E15:E18", "Currency", ["E15", "E16", "E17", "E18"].map((cell) => ({ cell, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } }))),
  formatCard("sheet-format-percent", "Format completion values as percentages.", "The coordinator wants completion values shown with percent signs.", "H15:H18", "Percent style", ["H15", "H16", "H17", "H18"].map((cell) => ({ cell, format: { numberPatternIncludes: ["%"] } }))),
  formatCard("sheet-format-item-italic", "Italicise canteen item names.", "The canteen manager wants item names styled differently from numbers.", "D15:D18", "Italic", ["D15", "D16", "D17", "D18"].map((cell) => ({ cell, format: { italic: true } }))),
  formatCard("sheet-format-library-underline", "Underline library categories.", "The librarian wants category names emphasized.", "A15:A18", "Underline", ["A15", "A16", "A17", "A18"].map((cell) => ({ cell, format: { underline: true } }))),
  formatCard("sheet-format-paid-centre", "Centre the Paid value.", "The trip register should align Yes/No entries neatly.", "H25", "Centre align", [{ cell: "H25", value: "Yes", format: { horizontalAlign: "center" } }]),
  formatCard("sheet-format-stock-bold-needed", "Bold the needed stock values.", "The ICT technician wants target stock numbers to stand out.", "C25:C28", "Bold", ["C25", "C26", "C27", "C28"].map((cell) => ({ cell, format: { bold: true } }))),
  formatCard("sheet-format-wrap-stock", "Wrap the stock headings.", "The ICT technician wants long headings to stay inside their cells.", "A24:C24", "Wrap Text", ["A24", "B24", "C24"].map((cell) => ({ cell, format: { wrapText: true } }))),
  formatCard("sheet-format-border-club-table", "Add borders to the club table.", "The club report needs clear cell boundaries before printing.", "A3:D8", "Borders", ["A3", "D3", "A8", "D8"].map((cell) => ({ cell, format: { border: true } }))),
  formatCard("sheet-format-title-font-size", "Increase the title font size.", "The main title should be larger than the table text.", "A1", "Font size", [{ cell: "A1", value: "Club Attendance Summary", format: { fontSizeAtLeast: 14 } }]),
  formatCard("sheet-format-title-font-colour", "Change the title font colour.", "The title should have a different font colour from the table body.", "A1", "Font colour", [{ cell: "A1", value: "Club Attendance Summary", format: { fontColor: true } }]),
  formatCard("sheet-format-library-fill", "Shade the library headings.", "The librarian wants the category and borrowed headings separated from the values.", "A14:B14", "Fill colour", ["A14", "B14"].map((cell) => ({ cell, format: { background: true } }))),
  formatCard("sheet-format-stock-centre-numbers", "Centre the stock numbers.", "The stock table should align number entries neatly.", "B25:C28", "Centre align", ["B25", "C25", "B26", "C26", "B27", "C27", "B28", "C28"].map((cell) => ({ cell, format: { horizontalAlign: "center" } }))),
  formatCard("sheet-format-task-budget-entry-bold", "Create and bold a budget heading.", "The events team has sent a mini budget for formatting practice.", "A32:C32", "Bold", [{ cell: "A32", value: "Mini Budget", format: { bold: true } }, { cell: "B32", value: "Income", format: { bold: true } }, { cell: "C32", value: "Cost", format: { bold: true } }], "developing"),
  formatCard("sheet-format-task-budget-currency", "Format budget figures as currency.", "The budget values should clearly show money.", "B33:C35", "Currency", ["B33", "C33", "B34", "C34", "B35", "C35"].map((cell) => ({ cell, format: { numberPatternIncludes: ["$", "£", "₦", "€", "currency"] } })), "developing"),
  formatCard("sheet-format-task-register-fill", "Shade a register heading row.", "The attendance register needs a clear heading row.", "E32:G32", "Fill colour", ["E32", "F32", "G32"].map((cell) => ({ cell, format: { background: true } })), "developing"),
  formatCard("sheet-format-task-register-centre", "Centre Yes and No entries.", "The tutor wants the register responses aligned neatly.", "F33:G35", "Centre align", ["F33", "G33", "F34", "G34", "F35", "G35"].map((cell) => ({ cell, format: { horizontalAlign: "center" } })), "developing"),
  formatCard("sheet-format-task-reading-wrap", "Wrap reading log headings.", "The reading log has longer headings that must fit inside cells.", "I32:K32", "Wrap Text", ["I32", "J32", "K32"].map((cell) => ({ cell, format: { wrapText: true } })), "developing"),
  formatCard("sheet-format-task-reading-border", "Add borders to the reading log.", "The reading log should print as a clear table.", "I32:K35", "Borders", ["I32", "K32", "I35", "K35"].map((cell) => ({ cell, format: { border: true } })), "developing"),
  formatCard("sheet-format-task-schedule-font", "Increase the schedule title size.", "The club schedule title should stand out from the table.", "A40", "Font size", [{ cell: "A40", value: "Club Schedule", format: { fontSizeAtLeast: 14 } }], "developing"),
  formatCard("sheet-format-task-schedule-colour", "Change the schedule title colour.", "The title should use a different font colour from the table.", "A40", "Font colour", [{ cell: "A40", value: "Club Schedule", format: { fontColor: true } }], "developing"),
  formatCard("sheet-format-task-device-italic", "Italicise device names.", "The ICT technician wants device names styled differently from borrower names.", "E41:E43", "Italic", ["E41", "E42", "E43"].map((cell) => ({ cell, format: { italic: true } })), "developing"),
  formatCard("sheet-format-task-final-table", "Format the final practice table.", "Use several earlier formatting habits on one compact table.", "M40:O43", "Bold and fill", [{ cell: "M40", value: "Final Format Check", format: { bold: true, background: true } }, { cell: "M41", value: "Skill", format: { bold: true, background: true } }, { cell: "N41", value: "Done", format: { bold: true, background: true } }, { cell: "O41", value: "Score", format: { bold: true, background: true } }], "confident")
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
  entryCard("chart", "sheet-chart-source", "Create chart source data.", "Build the label and value range needed for a column chart.", [["A1", "Club"], ["B1", "Attendance"], ["A2", "Drama"], ["B2", 18], ["A3", "Robotics"], ["B3", 22], ["A4", "Coding"], ["B4", 16], ["A5", "Art"], ["B5", 20]], "developing"),
  entryCard("chart", "sheet-chart-title", "Add a chart title cell.", "Prepare the exact title that should be used on the chart.", [["D1", "Club Attendance Chart"]]),
  entryCard("chart", "sheet-chart-axis-labels", "Add chart axis label cells.", "Prepare labels for the category and value axes.", [["D3", "Club"], ["E3", "Attendance"]]),
  entryCard("chart", "sheet-chart-source-note", "Identify the chart source range.", "Record the exact source range so the chart can be checked.", [["D5", "A1:B5"]]),
  entryCard("chart", "sheet-chart-column-evidence", "Create a column chart evidence note.", "After creating a column chart from A1:B5, record the chart type used.", [["D7", "Column chart"]], "developing"),
  entryCard("chart", "sheet-chart-bar-evidence", "Create a bar chart evidence note.", "After changing or creating a bar chart from A1:B5, record the chart type used.", [["D8", "Bar chart"]], "developing"),
  entryCard("chart", "sheet-chart-pie-source", "Create pie chart source data.", "Prepare a smaller source range suitable for a pie chart.", [["A8", "Category"], ["B8", "Borrowed"], ["A9", "Fiction"], ["B9", 34], ["A10", "History"], ["B10", 18], ["A11", "Science"], ["B11", 26]]),
  entryCard("chart", "sheet-chart-pie-evidence", "Create a pie chart evidence note.", "After creating a pie chart from A8:B11, record the chart type used.", [["D10", "Pie chart"]], "developing"),
  entryCard("chart", "sheet-chart-data-labels-note", "Record that data labels are shown.", "After turning on data labels, record the label setting for checking.", [["D12", "Data labels shown"]], "developing")
];

const layoutCards = [
  entryCard("layout", "sheet-layout-title", "Create the print report title.", "Start a clean printable worksheet.", [["A1", "Printable Club Report"]]),
  entryCard("layout", "sheet-layout-table", "Enter the print table.", "Add a compact table for print layout practice.", [["A3", "Club"], ["B3", "Attendance"], ["A4", "Drama"], ["B4", 18], ["A5", "Robotics"], ["B5", 22], ["A6", "Coding"], ["B6", 16]], "developing"),
  entryCard("layout", "sheet-layout-print-area-note", "Record the print area.", "Use a note cell to confirm the print area used for the report.", [["D1", "Print area: A1:B6"]]),
  entryCard("layout", "sheet-layout-orientation-note", "Record landscape orientation.", "Set the page orientation to landscape, then record the setting.", [["D2", "Landscape"]]),
  entryCard("layout", "sheet-layout-gridlines-note", "Record printed gridlines.", "Turn on printed gridlines, then record the setting.", [["D3", "Print gridlines on"]]),
  entryCard("layout", "sheet-layout-fit-note", "Record fit-to-page setting.", "Set the sheet to fit one page wide, then record the setting.", [["D4", "Fit one page wide"]]),
  entryCard("layout", "sheet-layout-margins-note", "Record narrow margins.", "Set narrow margins, then record the setting.", [["D5", "Narrow margins"]]),
  formatCard("sheet-layout-bold-title", "Bold the print report title.", "The printed report title should stand out.", "A1", "Bold", [{ cell: "A1", value: "Printable Club Report", format: { bold: true } }]),
  formatCard("sheet-layout-title-height", "Increase the title font size for printing.", "The title should be easy to read on a printed report.", "A1", "Font size", [{ cell: "A1", value: "Printable Club Report", format: { fontSizeAtLeast: 14 } }]),
  formatCard("sheet-layout-table-borders", "Add borders to the printable table.", "The printed table needs clear boundaries.", "A3:B6", "Borders", ["A3", "B3", "A6", "B6"].map((cell) => ({ cell, format: { border: true } })))
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
