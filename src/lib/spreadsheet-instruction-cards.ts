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
  instruction: string;
  meaning: string;
  clickPath: string[];
  expectedSelection?: string;
  expectedAction: string;
  expectedResult: string;
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

export const spreadsheetInstructionCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-selection-range-001",
    category: "selection",
    skill: "Select a cell range",
    instruction: "Select cells A1:D1.",
    meaning: "Highlight every cell from A1 across to D1 before applying a command.",
    clickPath: ["Worksheet grid", "Cell A1", "Drag to D1"],
    expectedSelection: "A1:D1",
    expectedAction: "drag-select-range",
    expectedResult: "A1, B1, C1, and D1 are selected as one continuous range.",
    commonMistakes: ["Selecting only A1", "Selecting A1:D2", "Clicking the column header instead of the cell range"],
    feedback: {
      wrongSelection: "Start in A1 and drag horizontally until D1 is included.",
      wrongTool: "This task is done directly on the worksheet grid.",
      wrongResult: "The highlighted border should cover A1:D1 only."
    },
    hints: ["Start at the first cell in the instruction.", "Drag to the final cell named in the range."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-format-merge-centre-001",
    category: "formatting",
    skill: "Merge and centre",
    instruction: "Merge and centre the title across cells A1:D1.",
    meaning: "Turn A1:D1 into one title area and centre the title text across the merged range.",
    clickPath: ["Home", "Alignment", "Merge & Centre"],
    expectedSelection: "A1:D1",
    expectedAction: "merge-centre",
    expectedResult: "A1:D1 is merged and the title appears centred across the range.",
    commonMistakes: ["Only selecting A1", "Using centre alignment without merging", "Merging the wrong row"],
    feedback: {
      wrongSelection: "Select A1:D1 before choosing the merge command.",
      wrongTool: "Look in the Alignment group on the Home tab.",
      wrongResult: "The cells should become one wide title area with centred text."
    },
    hints: ["Select the full title range first.", "The command belongs with alignment controls."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-format-bold-001",
    category: "formatting",
    skill: "Bold formatting",
    instruction: "Apply bold formatting to the headings in A3:D3.",
    meaning: "Make the heading row stand out by applying bold text to each heading cell.",
    clickPath: ["Home", "Font", "Bold"],
    expectedSelection: "A3:D3",
    expectedAction: "bold",
    expectedResult: "The text in A3, B3, C3, and D3 is bold.",
    commonMistakes: ["Selecting the data row", "Using fill colour instead of bold", "Only bolding one heading"],
    feedback: {
      wrongSelection: "Select the full heading row A3:D3.",
      wrongTool: "Bold is in the Font group on the Home tab.",
      wrongResult: "All four heading cells should use bold text."
    },
    hints: ["Headings are usually at the top of a table.", "Use B, not fill colour."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-data-labels-001",
    category: "data-entry",
    skill: "Enter text labels",
    instruction: "Enter the club names in cells A4:A7.",
    meaning: "Type the category labels down the first column of the data table.",
    clickPath: ["Worksheet grid", "Column A data cells"],
    expectedSelection: "A4:A7",
    expectedAction: "enter-labels",
    expectedResult: "A4:A7 contains the four club names in the requested order.",
    commonMistakes: ["Typing labels across a row", "Missing one label", "Entering labels in column B"],
    feedback: {
      wrongSelection: "Use A4:A7 for the club labels.",
      wrongTool: "This is a direct data entry task.",
      wrongResult: "Each club name should be in its own cell down column A."
    },
    hints: ["Column A usually holds labels.", "Move down one row after each label."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-data-values-001",
    category: "data-entry",
    skill: "Enter numeric values",
    instruction: "Enter the attendance values in cells B4:B7.",
    meaning: "Type the numbers beside the matching labels so they can be used in calculations.",
    clickPath: ["Worksheet grid", "Column B data cells"],
    expectedSelection: "B4:B7",
    expectedAction: "enter-values",
    expectedResult: "B4:B7 contains numeric attendance values.",
    commonMistakes: ["Typing numbers as headings", "Putting numbers in column C", "Including text with the numbers"],
    feedback: {
      wrongSelection: "Use B4:B7 for the numeric values.",
      wrongTool: "This is a direct data entry task.",
      wrongResult: "The values should be numbers so formulae can calculate them."
    },
    hints: ["Column B sits next to the club labels.", "Keep numeric values as numbers only."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-formula-sum-001",
    category: "formula",
    skill: "SUM function",
    instruction: "In B8, calculate the total of B4:B7 using SUM.",
    meaning: "Use a function to add all attendance values in the range.",
    clickPath: ["Cell B8", "Formula bar", "Type =SUM(B4:B7)"],
    expectedSelection: "B8",
    expectedAction: "formula-sum",
    expectedResult: "B8 displays the total of the values in B4:B7.",
    commonMistakes: ["Missing the equals sign", "Using the wrong range", "Typing the answer instead of a formula"],
    feedback: {
      wrongSelection: "The total should be calculated in B8.",
      wrongTool: "Enter the formula in the cell or formula bar.",
      wrongResult: "Use =SUM(B4:B7) so the total updates if values change."
    },
    hints: ["Formulae begin with =.", "SUM adds a range of cells."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-formula-average-001",
    category: "formula",
    skill: "AVERAGE function",
    instruction: "Calculate the average of B4:B7 in B9.",
    meaning: "Use a function to find the mean value of the attendance figures.",
    clickPath: ["Cell B9", "Formula bar", "Type =AVERAGE(B4:B7)"],
    expectedSelection: "B9",
    expectedAction: "formula-average",
    expectedResult: "B9 displays the average value for B4:B7.",
    commonMistakes: ["Using SUM instead of AVERAGE", "Including the total cell", "Using B4:B8"],
    feedback: {
      wrongSelection: "Place the average in B9.",
      wrongTool: "Enter the AVERAGE formula in the cell or formula bar.",
      wrongResult: "Do not include the total row when calculating the average."
    },
    hints: ["Average means mean.", "Use only the raw data values."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-formula-max-001",
    category: "formula",
    skill: "MAX function",
    instruction: "Find the highest attendance value from B4:B7.",
    meaning: "Use MAX to return the largest number in the selected range.",
    clickPath: ["Target result cell", "Formula bar", "Type =MAX(B4:B7)"],
    expectedSelection: "Result cell",
    expectedAction: "formula-max",
    expectedResult: "The result cell displays the largest attendance value.",
    commonMistakes: ["Using MIN", "Typing the largest value manually", "Including text labels"],
    feedback: {
      wrongSelection: "Choose the result cell requested by the task.",
      wrongTool: "Use the formula bar or type directly into the result cell.",
      wrongResult: "MAX should check B4:B7 and return the largest number."
    },
    hints: ["MAX means maximum.", "The function needs a numeric range."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-formula-min-001",
    category: "formula",
    skill: "MIN function",
    instruction: "Find the lowest attendance value from B4:B7.",
    meaning: "Use MIN to return the smallest number in the selected range.",
    clickPath: ["Target result cell", "Formula bar", "Type =MIN(B4:B7)"],
    expectedSelection: "Result cell",
    expectedAction: "formula-min",
    expectedResult: "The result cell displays the smallest attendance value.",
    commonMistakes: ["Using MAX", "Typing the answer manually", "Selecting the label column"],
    feedback: {
      wrongSelection: "Choose the result cell requested by the task.",
      wrongTool: "Use the formula bar or type directly into the result cell.",
      wrongResult: "MIN should check B4:B7 and return the smallest number."
    },
    hints: ["MIN means minimum.", "Use the data range, not the label range."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-format-decimals-001",
    category: "formatting",
    skill: "Decimal places",
    instruction: "Format B4:B8 to two decimal places.",
    meaning: "Display all selected numeric values with exactly two digits after the decimal point.",
    clickPath: ["Home", "Number", "Decimal places"],
    expectedSelection: "B4:B8",
    expectedAction: "format-two-decimals",
    expectedResult: "The selected numbers display like 18.00 and 76.00.",
    commonMistakes: ["Formatting only B4:B7", "Changing the values manually", "Using percentage format"],
    feedback: {
      wrongSelection: "Include the total cell B8 as well as B4:B7.",
      wrongTool: "Use the Number group on the Home tab.",
      wrongResult: "The display should show two decimal places without changing the underlying values."
    },
    hints: ["Number formatting changes appearance.", "Include the total row if the instruction says B4:B8."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-format-currency-001",
    category: "formatting",
    skill: "Currency format",
    instruction: "Format C4:C8 as currency.",
    meaning: "Show the selected numeric values with a currency symbol and suitable decimal places.",
    clickPath: ["Home", "Number", "Currency"],
    expectedSelection: "C4:C8",
    expectedAction: "format-currency",
    expectedResult: "C4:C8 displays currency formatting consistently.",
    commonMistakes: ["Typing currency symbols manually", "Formatting the wrong column", "Using percentage"],
    feedback: {
      wrongSelection: "Select the currency values in C4:C8.",
      wrongTool: "Currency formatting is in the Number group.",
      wrongResult: "The values should display with a currency symbol using a format command."
    },
    hints: ["Use formatting, not manual typing.", "Look in Number controls."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-format-percent-001",
    category: "formatting",
    skill: "Percentage format",
    instruction: "Format D4:D8 as percentages.",
    meaning: "Display selected decimal values as percentages.",
    clickPath: ["Home", "Number", "Percent style"],
    expectedSelection: "D4:D8",
    expectedAction: "format-percentage",
    expectedResult: "D4:D8 displays values using percentage symbols.",
    commonMistakes: ["Multiplying by 100 manually", "Using currency", "Selecting only one cell"],
    feedback: {
      wrongSelection: "Select all percentage values in D4:D8.",
      wrongTool: "Use Percent style in the Number group.",
      wrongResult: "The values should display as percentages using a format command."
    },
    hints: ["Percentage is a number format.", "Do not type the % sign into every cell."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-format-fill-001",
    category: "formatting",
    skill: "Cell fill colour",
    instruction: "Apply a light fill colour to A3:D3.",
    meaning: "Shade the heading row to separate it visually from the data.",
    clickPath: ["Home", "Font", "Fill colour"],
    expectedSelection: "A3:D3",
    expectedAction: "fill-colour",
    expectedResult: "The heading row has a consistent light background colour.",
    commonMistakes: ["Changing font colour instead of fill", "Shading only one heading", "Using a dark unreadable colour"],
    feedback: {
      wrongSelection: "Select the complete heading row A3:D3.",
      wrongTool: "Fill colour is usually grouped with font styling tools.",
      wrongResult: "The fill should help readability without hiding the text."
    },
    hints: ["Fill colour changes cell background.", "Use a readable light shade."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-format-wrap-001",
    category: "formatting",
    skill: "Wrap text",
    instruction: "Wrap the heading text in A3:D3.",
    meaning: "Allow long headings to appear on multiple lines inside their cells.",
    clickPath: ["Home", "Alignment", "Wrap Text"],
    expectedSelection: "A3:D3",
    expectedAction: "wrap-text",
    expectedResult: "Long headings remain visible inside their cells.",
    commonMistakes: ["Widening columns only", "Wrapping data cells instead of headings", "Merging headings"],
    feedback: {
      wrongSelection: "Select the heading cells A3:D3.",
      wrongTool: "Wrap Text is in the Alignment group.",
      wrongResult: "The text should fit inside the selected cells on multiple lines if needed."
    },
    hints: ["Wrapping controls how text fits inside a cell.", "Look near alignment controls."],
    difficulty: "developing",
    marks: 1
  },
  {
    id: "sheet-layout-column-width-001",
    category: "layout",
    skill: "Column width",
    instruction: "Adjust column A so all club names are fully visible.",
    meaning: "Make the label column wide enough to show the complete text.",
    clickPath: ["Column A boundary", "Drag or auto-fit"],
    expectedSelection: "Column A",
    expectedAction: "adjust-column-width",
    expectedResult: "All labels in column A can be read without being cut off.",
    commonMistakes: ["Changing row height", "Widening the wrong column", "Leaving text hidden"],
    feedback: {
      wrongSelection: "Adjust column A, where the labels are stored.",
      wrongTool: "Use the column boundary or column width command.",
      wrongResult: "The full label text should be visible."
    },
    hints: ["Column width controls horizontal space.", "Auto-fit is acceptable if available."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-layout-row-height-001",
    category: "layout",
    skill: "Row height",
    instruction: "Increase the height of row 1 so the title is clearly visible.",
    meaning: "Give the title row more vertical space.",
    clickPath: ["Row 1 boundary", "Drag or row height command"],
    expectedSelection: "Row 1",
    expectedAction: "adjust-row-height",
    expectedResult: "The title row has enough height for clear presentation.",
    commonMistakes: ["Changing column width", "Adjusting the wrong row", "Making the row too small"],
    feedback: {
      wrongSelection: "Adjust row 1, where the title is located.",
      wrongTool: "Use the row boundary or row height command.",
      wrongResult: "The title should be easy to read and not cramped."
    },
    hints: ["Rows control vertical space.", "Use the row number boundary."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-data-sort-001",
    category: "data-tools",
    skill: "Sort ascending",
    instruction: "Sort the club data by attendance in ascending order.",
    meaning: "Reorder the data so the smallest attendance value appears first.",
    clickPath: ["Select data table", "Data", "Sort ascending"],
    expectedSelection: "A4:D7",
    expectedAction: "sort-ascending",
    expectedResult: "Rows are ordered from lowest attendance to highest attendance while each row stays together.",
    commonMistakes: ["Sorting only the attendance column", "Sorting descending", "Including the total row"],
    feedback: {
      wrongSelection: "Select the full data rows but do not include the total row.",
      wrongTool: "Sort commands are usually on the Data tab.",
      wrongResult: "Each club row must stay intact after sorting."
    },
    hints: ["Sort the whole table, not one column.", "Ascending means smallest to largest."],
    difficulty: "developing",
    marks: 3
  },
  {
    id: "sheet-data-filter-001",
    category: "data-tools",
    skill: "Filter data",
    instruction: "Show only clubs with attendance greater than 18.",
    meaning: "Use a filter/search condition to display records matching the rule.",
    clickPath: ["Select table headings", "Data", "Filter", "Number filter greater than 18"],
    expectedSelection: "A3:D7",
    expectedAction: "filter-greater-than",
    expectedResult: "Only rows with attendance above 18 remain visible.",
    commonMistakes: ["Using greater than or equal to", "Filtering the wrong column", "Deleting rows instead of filtering"],
    feedback: {
      wrongSelection: "Apply the filter to the table including headings.",
      wrongTool: "Use filtering tools rather than deleting data.",
      wrongResult: "Rows should be hidden or shown by the filter condition."
    },
    hints: ["The condition uses the attendance column.", "Greater than 18 does not include 18."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-chart-bar-001",
    category: "chart",
    skill: "Create a bar chart",
    instruction: "Create a bar chart from A4:B7.",
    meaning: "Use the club labels and attendance values to make a visual comparison chart.",
    clickPath: ["Select A4:B7", "Insert", "Chart", "Bar chart"],
    expectedSelection: "A4:B7",
    expectedAction: "insert-bar-chart",
    expectedResult: "A bar chart displays each club and its attendance value.",
    commonMistakes: ["Including the total row", "Selecting only numbers", "Choosing an unsuitable chart type"],
    feedback: {
      wrongSelection: "Select labels and values, but not the total row.",
      wrongTool: "Charts are normally inserted from the Insert tab.",
      wrongResult: "The chart should compare club attendance clearly."
    },
    hints: ["Charts need labels and values.", "Do not include summary totals in the source range."],
    difficulty: "developing",
    marks: 3
  },
  {
    id: "sheet-chart-title-001",
    category: "chart",
    skill: "Chart title",
    instruction: "Add the chart title Club Attendance.",
    meaning: "Label the chart so the reader knows what the chart shows.",
    clickPath: ["Select chart", "Chart tools", "Chart title"],
    expectedSelection: "Chart",
    expectedAction: "add-chart-title",
    expectedResult: "The chart title reads Club Attendance.",
    commonMistakes: ["Adding a worksheet title instead", "Misspelling the chart title", "Leaving the default title"],
    feedback: {
      wrongSelection: "Select the chart before editing its title.",
      wrongTool: "Use chart title controls, not a worksheet cell.",
      wrongResult: "The title should match the requested wording."
    },
    hints: ["Click the chart first.", "Edit the title element on the chart."],
    difficulty: "developing",
    marks: 1
  },
  {
    id: "sheet-chart-axis-label-001",
    category: "chart",
    skill: "Axis title",
    instruction: "Add the value axis title Attendance.",
    meaning: "Label the numeric axis so the scale is clear.",
    clickPath: ["Select chart", "Chart tools", "Axis titles", "Value axis"],
    expectedSelection: "Chart",
    expectedAction: "add-value-axis-title",
    expectedResult: "The value axis is labelled Attendance.",
    commonMistakes: ["Labelling the category axis", "Adding a chart title only", "Using the wrong wording"],
    feedback: {
      wrongSelection: "Select the chart before adding an axis title.",
      wrongTool: "Use axis title controls in chart tools.",
      wrongResult: "The numeric axis should be labelled Attendance."
    },
    hints: ["Value axis means numeric axis.", "Use the exact requested label."],
    difficulty: "confident",
    marks: 2
  },
  {
    id: "sheet-layout-print-area-001",
    category: "layout",
    skill: "Print area",
    instruction: "Set the print area to A1:D8.",
    meaning: "Limit printing to the completed worksheet area.",
    clickPath: ["Select A1:D8", "Page Layout", "Print Area", "Set Print Area"],
    expectedSelection: "A1:D8",
    expectedAction: "set-print-area",
    expectedResult: "Only A1:D8 is set to print.",
    commonMistakes: ["Including blank rows", "Selecting only the chart", "Using page orientation instead"],
    feedback: {
      wrongSelection: "Select the exact area A1:D8.",
      wrongTool: "Print Area is normally in page layout controls.",
      wrongResult: "The print area should cover the completed worksheet only."
    },
    hints: ["Select before setting the print area.", "Look under page layout controls."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-layout-orientation-001",
    category: "layout",
    skill: "Page orientation",
    instruction: "Set the worksheet to landscape orientation.",
    meaning: "Prepare the page so it prints wider than it is tall.",
    clickPath: ["Page Layout", "Orientation", "Landscape"],
    expectedAction: "set-landscape",
    expectedResult: "The worksheet page orientation is landscape.",
    commonMistakes: ["Changing margins only", "Choosing portrait", "Changing chart layout instead"],
    feedback: {
      wrongTool: "Orientation is a page layout setting.",
      wrongResult: "Landscape means the page is wider than it is tall."
    },
    hints: ["This is a print/page setup task.", "Landscape is the wide page option."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-layout-gridlines-001",
    category: "layout",
    skill: "Gridlines for printing",
    instruction: "Show gridlines when printing the worksheet.",
    meaning: "Make cell boundaries appear on the printed output.",
    clickPath: ["Page Layout", "Sheet options", "Gridlines", "Print"],
    expectedAction: "print-gridlines",
    expectedResult: "Gridlines are enabled for print output.",
    commonMistakes: ["Changing screen view only", "Adding borders manually", "Hiding gridlines"],
    feedback: {
      wrongTool: "Use the gridlines print option in page layout controls.",
      wrongResult: "The print settings should include gridlines."
    },
    hints: ["This is about printing, not just screen display.", "Look for sheet options."],
    difficulty: "confident",
    marks: 2
  },
  {
    id: "sheet-formula-relative-copy-001",
    category: "formula",
    skill: "Copy relative formula",
    instruction: "Copy the formula in E4 down to E7.",
    meaning: "Replicate the formula so each row calculates using its own row values.",
    clickPath: ["Select E4", "Fill handle", "Drag to E7"],
    expectedSelection: "E4:E7",
    expectedAction: "fill-formula-down",
    expectedResult: "E5:E7 contain adjusted copies of the formula from E4.",
    commonMistakes: ["Copying the value only", "Dragging to the wrong row", "Breaking relative references"],
    feedback: {
      wrongSelection: "Fill from E4 down to E7.",
      wrongTool: "Use copy/fill so relative references update.",
      wrongResult: "Each copied formula should refer to its own row."
    },
    hints: ["The fill handle copies patterns and formulae.", "Relative references change by row."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-if-001",
    category: "formula",
    skill: "IF function",
    instruction: "Use IF to display Good when attendance is at least 20, otherwise Review.",
    meaning: "Create a decision formula that returns different text based on a condition.",
    clickPath: ["Result cell", "Formula bar", "Type IF formula"],
    expectedAction: "formula-if",
    expectedResult: "Rows with attendance of 20 or more show Good; other rows show Review.",
    commonMistakes: ["Using greater than instead of at least", "Reversing the two outputs", "Missing quotation marks around text"],
    feedback: {
      wrongTool: "Enter an IF formula in the result cell.",
      wrongResult: "At least 20 means greater than or equal to 20."
    },
    hints: ["IF checks a condition.", "Text results need quotation marks in most spreadsheet formulae."],
    difficulty: "confident",
    marks: 3
  }
];

export function getSpreadsheetCard(id: string) {
  return spreadsheetInstructionCards.find((card) => card.id === id);
}

export const firstSpreadsheetCard = spreadsheetInstructionCards[0];
