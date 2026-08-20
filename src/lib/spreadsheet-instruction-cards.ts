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
  autoCheck?: {
    cells: Array<{
      cell: string;
      value?: string | number;
      formula?: string;
      formulaIncludes?: string[];
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

export const spreadsheetInstructionCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-selection-range-001",
    category: "selection",
    skill: "Select a cell range",
    studentGoal: "Highlight the title cells.",
    studentSteps: ["Click the title cell A1.", "Hold the mouse button and drag right until D1 is included.", "Release only when the name box shows A1:D1 or the blue border covers A1:D1."],
    supportedInCurrentLab: true,
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
    studentGoal: "Create one centred title area.",
    studentSteps: ["Select A1:D1, starting from the title in A1.", "Look along the toolbar for Merge cells. If you cannot see it, click the three dots / More button on the toolbar.", "Choose Merge & Centre, or type Merge in the command search if the More menu gives you a search box.", "Check that the title sits in one wide centred area across A1:D1."],
    supportedInCurrentLab: true,
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
    studentGoal: "Make the table headings stand out.",
    studentSteps: ["Select the heading row A3:D3.", "Click the B button on the toolbar.", "If B is hidden, click the three dots / More button and choose Bold.", "Check that Club, Attendance, Sessions, and Average are all bold."],
    supportedInCurrentLab: true,
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
    studentGoal: "Add the club names.",
    studentSteps: ["Click A4.", "Type Drama and press Enter.", "Type Robotics in A5, Coding in A6, and Art in A7.", "Check that the names run down column A, not across the row."],
    supportedInCurrentLab: true,
    instruction: "Enter the club names in cells A4:A7.",
    meaning: "Type the category labels down the first column of the data table.",
    clickPath: ["Worksheet grid", "Column A data cells"],
    expectedSelection: "A4:A7",
    expectedAction: "enter-labels",
    expectedResult: "A4:A7 contains the four club names in the requested order.",
    autoCheck: {
      cells: [
        { cell: "A4", value: "Drama" },
        { cell: "A5", value: "Robotics" },
        { cell: "A6", value: "Coding" },
        { cell: "A7", value: "Art" }
      ]
    },
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
    studentGoal: "Add the attendance numbers.",
    studentSteps: ["Click B4.", "Type 18 and press Enter.", "Type 22 in B5, 16 in B6, and 20 in B7.", "Check that each value is a number beside the correct club."],
    supportedInCurrentLab: true,
    instruction: "Enter the attendance values in cells B4:B7.",
    meaning: "Type the numbers beside the matching labels so they can be used in calculations.",
    clickPath: ["Worksheet grid", "Column B data cells"],
    expectedSelection: "B4:B7",
    expectedAction: "enter-values",
    expectedResult: "B4:B7 contains numeric attendance values.",
    autoCheck: {
      cells: [
        { cell: "B4", value: 18 },
        { cell: "B5", value: 22 },
        { cell: "B6", value: 16 },
        { cell: "B7", value: 20 }
      ]
    },
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
    studentGoal: "Calculate the total attendance.",
    studentSteps: ["Click B8 beside the Total label.", "Type =SUM(B4:B7) directly in the cell or formula bar.", "Press Enter.", "Check that B8 calculates the total from B4:B7."],
    supportedInCurrentLab: true,
    instruction: "In B8, calculate the total of B4:B7 using SUM.",
    meaning: "Use a function to add all attendance values in the range.",
    clickPath: ["Cell B8", "Formula bar", "Type =SUM(B4:B7)"],
    expectedSelection: "B8",
    expectedAction: "formula-sum",
    expectedResult: "B8 displays the total of the values in B4:B7.",
    autoCheck: {
      cells: [{ cell: "B8", formula: "=SUM(B4:B7)", value: 76 }]
    },
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
    studentGoal: "Calculate the average attendance.",
    studentSteps: ["Click B9, the empty cell below the total.", "Type =AVERAGE(B4:B7) directly in the cell or formula bar.", "Press Enter.", "Check that B9 shows the mean of the four attendance values."],
    supportedInCurrentLab: true,
    instruction: "Calculate the average of B4:B7 in B9.",
    meaning: "Use a function to find the mean value of the attendance figures.",
    clickPath: ["Cell B9", "Formula bar", "Type =AVERAGE(B4:B7)"],
    expectedSelection: "B9",
    expectedAction: "formula-average",
    expectedResult: "B9 displays the average value for B4:B7.",
    autoCheck: {
      cells: [{ cell: "B9", formula: "=AVERAGE(B4:B7)", value: 19 }]
    },
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
    studentGoal: "Find the highest attendance.",
    studentSteps: ["Click the result cell your teacher gives you, or use B10 for practice.", "Type =MAX(B4:B7).", "Press Enter.", "Check that the answer is the highest attendance value."],
    supportedInCurrentLab: true,
    instruction: "Find the highest attendance value from B4:B7.",
    meaning: "Use MAX to return the largest number in the selected range.",
    clickPath: ["Target result cell", "Formula bar", "Type =MAX(B4:B7)"],
    expectedSelection: "B10",
    expectedAction: "formula-max",
    expectedResult: "The result cell displays the largest attendance value.",
    autoCheck: {
      cells: [{ cell: "B10", formula: "=MAX(B4:B7)", value: 22 }]
    },
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
    studentGoal: "Find the lowest attendance.",
    studentSteps: ["Click the result cell your teacher gives you, or use B11 for practice.", "Type =MIN(B4:B7).", "Press Enter.", "Check that the answer is the lowest attendance value."],
    supportedInCurrentLab: true,
    instruction: "Find the lowest attendance value from B4:B7.",
    meaning: "Use MIN to return the smallest number in the selected range.",
    clickPath: ["Target result cell", "Formula bar", "Type =MIN(B4:B7)"],
    expectedSelection: "B11",
    expectedAction: "formula-min",
    expectedResult: "The result cell displays the smallest attendance value.",
    autoCheck: {
      cells: [{ cell: "B11", formula: "=MIN(B4:B7)", value: 16 }]
    },
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
    studentGoal: "Show the attendance values with two decimal places.",
    studentSteps: ["Select B4:B8.", "Find the number format controls on the toolbar. If they are hidden, click the three dots / More button.", "Use the increase/decrease decimal controls until the values show two decimal places.", "Check that values display like 18.00."],
    supportedInCurrentLab: true,
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
    studentGoal: "Format values as currency.",
    studentSteps: ["Select C4:C8.", "Open the number format dropdown on the toolbar.", "If Currency is hidden, click the three dots / More button and search or choose Currency.", "Check that the selected values show a currency symbol."],
    supportedInCurrentLab: true,
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
    studentGoal: "Format values as percentages.",
    studentSteps: ["Select D4:D8.", "Click the percent button on the toolbar if it is visible.", "If it is hidden, click the three dots / More button and choose Percent.", "Check that the selected values display with percent signs."],
    supportedInCurrentLab: true,
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
    studentGoal: "Shade the heading row.",
    studentSteps: ["Select A3:D3.", "Find the fill colour / paint bucket control on the toolbar.", "If it is hidden, click the three dots / More button and search for Fill colour.", "Choose a light colour so the headings remain readable."],
    supportedInCurrentLab: true,
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
    studentGoal: "Make long headings fit inside their cells.",
    studentSteps: ["Select A3:D3.", "Open the alignment controls on the toolbar.", "If Wrap Text is hidden, click the three dots / More button and search for Wrap.", "Turn Wrap Text on and check that long headings stay inside their cells."],
    supportedInCurrentLab: true,
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
    studentGoal: "Make column A wide enough to read.",
    studentSteps: ["Move the pointer to the line between the A and B column headings.", "When the resize cursor appears, drag to the right.", "Stop when every club name in column A is fully visible."],
    supportedInCurrentLab: true,
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
    studentGoal: "Make the title row taller.",
    studentSteps: ["Move the pointer to the line between row 1 and row 2.", "When the resize cursor appears, drag down slightly.", "Stop when the title row has enough height to look clear."],
    supportedInCurrentLab: true,
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
    studentGoal: "Sort the clubs from lowest to highest attendance.",
    studentSteps: ["Select the full data table A4:D7.", "Open the sort controls.", "Choose ascending order for Attendance."],
    supportedInCurrentLab: false,
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
    studentGoal: "Show only clubs above 18 attendance.",
    studentSteps: ["Select the table with headings A3:D7.", "Turn on filters.", "Filter Attendance to values greater than 18."],
    supportedInCurrentLab: false,
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
    studentGoal: "Create a chart that compares attendance.",
    studentSteps: ["Select A4:B7.", "Open chart tools.", "Choose a bar chart."],
    supportedInCurrentLab: false,
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
    studentGoal: "Add a clear chart title.",
    studentSteps: ["Click the chart.", "Click the chart title.", "Type Club Attendance."],
    supportedInCurrentLab: false,
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
    studentGoal: "Label the chart value axis.",
    studentSteps: ["Click the chart.", "Open axis title controls.", "Set the value axis title to Attendance."],
    supportedInCurrentLab: false,
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
    studentGoal: "Choose the part of the sheet to print.",
    studentSteps: ["Select A1:D8.", "Open page layout controls.", "Set the selected cells as the print area."],
    supportedInCurrentLab: false,
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
    studentGoal: "Set the sheet to print sideways.",
    studentSteps: ["Open page layout controls.", "Find Orientation.", "Choose Landscape."],
    supportedInCurrentLab: false,
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
    studentGoal: "Print the sheet with gridlines.",
    studentSteps: ["Open page layout controls.", "Find gridline print settings.", "Turn print gridlines on."],
    supportedInCurrentLab: false,
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
    studentGoal: "Copy a formula down the column.",
    studentSteps: ["Click E4 after a formula has been entered there.", "Point at the small fill handle at the bottom-right corner of E4.", "Drag the fill handle down to E7.", "Check that E5, E6, and E7 contain copied formulae for their own rows."],
    supportedInCurrentLab: true,
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
    studentGoal: "Use a formula to show Good or Review.",
    studentSteps: ["Click the result cell your teacher gives you, or use E4 for practice.", "Type an IF formula that checks the attendance cell in the same row.", "Use Good when the attendance is at least 20 and Review otherwise.", "Press Enter and check the word matches the attendance value."],
    supportedInCurrentLab: true,
    instruction: "Use IF to display Good when attendance is at least 20, otherwise Review.",
    meaning: "Create a decision formula that returns different text based on a condition.",
    clickPath: ["Result cell", "Formula bar", "Type IF formula"],
    expectedSelection: "E4",
    expectedAction: "formula-if",
    expectedResult: "Rows with attendance of 20 or more show Good; other rows show Review.",
    autoCheck: {
      cells: [{ cell: "E4", value: "Review", formulaIncludes: ["IF", "B4", ">=20"] }]
    },
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

export const spreadsheetModules = [
  {
    id: "intro",
    title: "Introduction",
    description: "Cells, rows, columns, ranges, and simple movement."
  },
  {
    id: "data-entry",
    title: "Data Entry",
    description: "Typing labels, values, headings, and small tables accurately."
  },
  {
    id: "formatting",
    title: "Formatting",
    description: "Fonts, alignment, merge, number formats, rows, columns, and gridlines."
  },
  {
    id: "formula",
    title: "Formulae",
    description: "SUM, AVERAGE, MIN, MAX, IF, SUMIF, COUNTIF, AVERAGEIF, lookup, and rounding."
  },
  {
    id: "data-tools",
    title: "Data Tools",
    description: "Sorting, filtering, searching, and preparing source data."
  },
  {
    id: "chart",
    title: "Charts",
    description: "Creating charts and adding titles, labels, and suitable chart choices."
  },
  {
    id: "layout",
    title: "Print and Layout",
    description: "Print area, orientation, gridlines, row height, and column width."
  }
];

const introSpreadsheetCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-intro-cell-a1-001",
    moduleId: "intro",
    moduleTitle: "Introduction",
    category: "selection",
    skill: "Identify a cell",
    studentGoal: "Show that you can find cell A1.",
    scenario: "The school office is preparing a simple register sheet. Before entering data, you need to prove you can find the first cell on the worksheet.",
    studentSteps: ["Click cell A1.", "Type Start.", "Press Enter and check that Start is in A1."],
    supportedInCurrentLab: true,
    instruction: "Enter Start in cell A1.",
    meaning: "A1 means column A, row 1.",
    clickPath: ["Worksheet grid", "Cell A1", "Type Start"],
    expectedSelection: "A1",
    expectedAction: "enter-cell-value",
    expectedResult: "Cell A1 contains Start.",
    autoCheck: { cells: [{ cell: "A1", value: "Start" }] },
    commonMistakes: ["Typing into B1", "Typing into A2", "Clicking the column heading instead of the cell"],
    feedback: {
      wrongSelection: "Click the cell where column A and row 1 meet.",
      wrongTool: "This task is completed directly on the worksheet grid.",
      wrongResult: "A1 should contain Start."
    },
    hints: ["Columns use letters.", "Rows use numbers."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-intro-cell-c3-001",
    moduleId: "intro",
    moduleTitle: "Introduction",
    category: "selection",
    skill: "Identify a cell",
    studentGoal: "Find a cell by column and row.",
    scenario: "A teacher asks you to place a marker in a specific location so the table can be checked later.",
    studentSteps: ["Find column C.", "Find row 3.", "Click the cell where column C and row 3 meet.", "Type Found and press Enter."],
    supportedInCurrentLab: true,
    instruction: "Enter Found in cell C3.",
    meaning: "C3 is the cell at column C and row 3.",
    clickPath: ["Worksheet grid", "Cell C3", "Type Found"],
    expectedSelection: "C3",
    expectedAction: "enter-cell-value",
    expectedResult: "Cell C3 contains Found.",
    autoCheck: { cells: [{ cell: "C3", value: "Found" }] },
    commonMistakes: ["Using row C", "Using column 3", "Typing into C4"],
    feedback: {
      wrongSelection: "Use column C and row 3 together.",
      wrongTool: "This task is completed directly on the worksheet grid.",
      wrongResult: "C3 should contain Found."
    },
    hints: ["Read the column letter first.", "Read the row number second."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-intro-row-label-001",
    moduleId: "intro",
    moduleTitle: "Introduction",
    category: "selection",
    skill: "Recognise a row",
    studentGoal: "Use a row correctly.",
    scenario: "The class tutor wants row 2 reserved for a short note before the table begins.",
    studentSteps: ["Click A2.", "Type Tutor note.", "Press Enter."],
    supportedInCurrentLab: true,
    instruction: "Enter Tutor note in A2.",
    meaning: "Row 2 is the second horizontal line of cells.",
    clickPath: ["Worksheet grid", "Cell A2", "Type Tutor note"],
    expectedSelection: "A2",
    expectedAction: "enter-cell-value",
    expectedResult: "A2 contains Tutor note.",
    autoCheck: { cells: [{ cell: "A2", value: "Tutor note" }] },
    commonMistakes: ["Typing into B2", "Typing into A1", "Selecting the whole row instead of the cell"],
    feedback: {
      wrongSelection: "Click A2 on the second row.",
      wrongTool: "This task is completed directly on the worksheet grid.",
      wrongResult: "A2 should contain Tutor note."
    },
    hints: ["Rows go across.", "A2 is in column A."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-intro-column-label-001",
    moduleId: "intro",
    moduleTitle: "Introduction",
    category: "selection",
    skill: "Recognise a column",
    studentGoal: "Use a column correctly.",
    scenario: "The PE department wants column F reserved for quick comments.",
    studentSteps: ["Click F1.", "Type Comment.", "Press Enter."],
    supportedInCurrentLab: true,
    instruction: "Enter Comment in F1.",
    meaning: "Column F is the vertical set of cells under the letter F.",
    clickPath: ["Worksheet grid", "Cell F1", "Type Comment"],
    expectedSelection: "F1",
    expectedAction: "enter-cell-value",
    expectedResult: "F1 contains Comment.",
    autoCheck: { cells: [{ cell: "F1", value: "Comment" }] },
    commonMistakes: ["Typing into E1", "Typing into F2", "Looking for a row named F"],
    feedback: {
      wrongSelection: "Use the column headed F.",
      wrongTool: "This task is completed directly on the worksheet grid.",
      wrongResult: "F1 should contain Comment."
    },
    hints: ["Columns go down.", "The column label is a letter."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-intro-range-copy-001",
    moduleId: "intro",
    moduleTitle: "Introduction",
    category: "selection",
    skill: "Use a small range",
    studentGoal: "Fill a short range across a row.",
    scenario: "A club coordinator wants three quick status cells across the top of the sheet.",
    studentSteps: ["Click G1.", "Type One and press Tab.", "Type Two and press Tab.", "Type Three and press Enter."],
    supportedInCurrentLab: true,
    instruction: "Enter One, Two, and Three across G1:I1.",
    meaning: "A range can run across a row from one cell to another.",
    clickPath: ["Worksheet grid", "Cells G1:I1"],
    expectedSelection: "G1:I1",
    expectedAction: "enter-row-values",
    expectedResult: "G1:I1 contains One, Two, and Three.",
    autoCheck: { cells: [{ cell: "G1", value: "One" }, { cell: "H1", value: "Two" }, { cell: "I1", value: "Three" }] },
    commonMistakes: ["Entering values down a column", "Skipping H1", "Starting in G2"],
    feedback: {
      wrongSelection: "Start at G1 and move across the row.",
      wrongTool: "Use direct data entry.",
      wrongResult: "G1, H1, and I1 should each contain one value."
    },
    hints: ["Tab moves across.", "Enter usually moves down."],
    difficulty: "beginner",
    marks: 2
  }
];

const expansionSpreadsheetCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-data-sessions-001",
    moduleId: "data-entry",
    moduleTitle: "Data Entry",
    category: "data-entry",
    skill: "Enter numeric values",
    studentGoal: "Add the number of sessions.",
    scenario: "The activities coordinator has counted how many sessions each club ran this term and needs the figures entered beside the attendance data.",
    studentSteps: ["Click C4.", "Type 6 and press Enter.", "Type 6 in C5, 5 in C6, and 5 in C7.", "Check that all four session values are in column C."],
    supportedInCurrentLab: true,
    instruction: "Enter the session values in C4:C7.",
    meaning: "Numeric values should be entered into the correct column so they can be used in calculations.",
    clickPath: ["Worksheet grid", "Column C data cells"],
    expectedSelection: "C4:C7",
    expectedAction: "enter-values",
    expectedResult: "C4:C7 contains the session values 6, 6, 5, and 5.",
    autoCheck: { cells: [{ cell: "C4", value: 6 }, { cell: "C5", value: 6 }, { cell: "C6", value: 5 }, { cell: "C7", value: 5 }] },
    commonMistakes: ["Typing the numbers in column B", "Entering text with the numbers", "Missing one row"],
    feedback: {
      wrongSelection: "Use C4:C7 for the sessions.",
      wrongTool: "This is direct data entry.",
      wrongResult: "Column C should contain 6, 6, 5, and 5."
    },
    hints: ["Sessions are in column C.", "Use one number per row."],
    difficulty: "beginner",
    marks: 2
  },
  {
    id: "sheet-data-average-heading-001",
    moduleId: "data-entry",
    moduleTitle: "Data Entry",
    category: "data-entry",
    skill: "Enter a heading",
    studentGoal: "Add a heading for average attendance.",
    scenario: "The head teacher wants a separate column where the average per session will be calculated.",
    studentSteps: ["Click D3.", "Type Average per session.", "Press Enter."],
    supportedInCurrentLab: true,
    instruction: "Enter Average per session in D3.",
    meaning: "Headings explain what each column is used for.",
    clickPath: ["Worksheet grid", "Cell D3"],
    expectedSelection: "D3",
    expectedAction: "enter-heading",
    expectedResult: "D3 contains Average per session.",
    autoCheck: { cells: [{ cell: "D3", value: "Average per session" }] },
    commonMistakes: ["Typing in D4", "Changing the wrong heading", "Leaving the heading too vague"],
    feedback: {
      wrongSelection: "Use D3 for the heading.",
      wrongTool: "Type the heading directly into the cell.",
      wrongResult: "D3 should read Average per session."
    },
    hints: ["Headings sit above the data.", "Use the exact wording."],
    difficulty: "beginner",
    marks: 1
  },
  {
    id: "sheet-formula-average-per-session-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "Division formula",
    studentGoal: "Calculate attendance per session.",
    scenario: "The PE teacher needs to compare clubs fairly by dividing attendance by the number of sessions.",
    studentSteps: ["Click D4.", "Type =B4/C4.", "Press Enter.", "Check that D4 shows the average attendance per session for Drama."],
    supportedInCurrentLab: true,
    instruction: "In D4, divide attendance by sessions.",
    meaning: "A division formula can calculate an average per event or session.",
    clickPath: ["Cell D4", "Formula bar", "Type =B4/C4"],
    expectedSelection: "D4",
    expectedAction: "formula-division",
    expectedResult: "D4 displays the result of B4 divided by C4.",
    autoCheck: { cells: [{ cell: "D4", formula: "=B4/C4", value: 3 }] },
    commonMistakes: ["Typing the answer only", "Using C4/B4", "Forgetting the equals sign"],
    feedback: {
      wrongSelection: "Place the formula in D4.",
      wrongTool: "Type the formula in the cell or formula bar.",
      wrongResult: "D4 should use =B4/C4."
    },
    hints: ["Formulae begin with =.", "Use / for division."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-formula-countif-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "COUNTIF function",
    studentGoal: "Count clubs with high attendance.",
    scenario: "The deputy head wants to know how many clubs reached at least 20 pupils.",
    studentSteps: ["Click B12.", "Type =COUNTIF(B4:B7,\">=20\").", "Press Enter.", "Check that the result counts only clubs with 20 or more attendance."],
    supportedInCurrentLab: true,
    instruction: "Use COUNTIF to count values in B4:B7 that are at least 20.",
    meaning: "COUNTIF counts cells that meet a condition.",
    clickPath: ["Cell B12", "Formula bar", "Type COUNTIF formula"],
    expectedSelection: "B12",
    expectedAction: "formula-countif",
    expectedResult: "B12 displays the number of clubs with attendance of at least 20.",
    autoCheck: { cells: [{ cell: "B12", formulaIncludes: ["COUNTIF", "B4:B7", ">=20"], value: 2 }] },
    commonMistakes: ["Using greater than 20 instead of at least 20", "Counting the wrong range", "Using SUMIF"],
    feedback: {
      wrongSelection: "Place the COUNTIF result in B12.",
      wrongTool: "Use COUNTIF for counting cells that match a condition.",
      wrongResult: "The formula should count B4:B7 values that are at least 20."
    },
    hints: ["At least means >=.", "COUNTIF has a range and a condition."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-sumif-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "SUMIF function",
    studentGoal: "Total only high attendance values.",
    scenario: "The PE department wants the combined attendance for clubs that reached 20 or more pupils.",
    studentSteps: ["Click B13.", "Type =SUMIF(B4:B7,\">=20\",B4:B7).", "Press Enter.", "Check that only values at least 20 are added."],
    supportedInCurrentLab: true,
    instruction: "Use SUMIF to add attendance values that are at least 20.",
    meaning: "SUMIF adds values only when they meet a condition.",
    clickPath: ["Cell B13", "Formula bar", "Type SUMIF formula"],
    expectedSelection: "B13",
    expectedAction: "formula-sumif",
    expectedResult: "B13 displays the total of attendance values 20 or above.",
    autoCheck: { cells: [{ cell: "B13", formulaIncludes: ["SUMIF", "B4:B7", ">=20"], value: 42 }] },
    commonMistakes: ["Using SUM for all values", "Using the wrong condition", "Adding text labels"],
    feedback: {
      wrongSelection: "Place the SUMIF result in B13.",
      wrongTool: "Use SUMIF for conditional totals.",
      wrongResult: "The formula should add only attendance values at least 20."
    },
    hints: ["SUMIF uses a range and a condition.", "At least 20 includes 20."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-averageif-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "AVERAGEIF function",
    studentGoal: "Average only high attendance values.",
    scenario: "The coordinator wants the average attendance for clubs that met the target of 18 or more pupils.",
    studentSteps: ["Click B14.", "Type =AVERAGEIF(B4:B7,\">=18\",B4:B7).", "Press Enter.", "Check that the average ignores clubs below 18."],
    supportedInCurrentLab: true,
    instruction: "Use AVERAGEIF to average attendance values that are at least 18.",
    meaning: "AVERAGEIF finds the mean of values that meet a condition.",
    clickPath: ["Cell B14", "Formula bar", "Type AVERAGEIF formula"],
    expectedSelection: "B14",
    expectedAction: "formula-averageif",
    expectedResult: "B14 displays the average of attendance values 18 or above.",
    autoCheck: { cells: [{ cell: "B14", formulaIncludes: ["AVERAGEIF", "B4:B7", ">=18"], value: 20 }] },
    commonMistakes: ["Including 16 in the average", "Using AVERAGE only", "Using the wrong condition"],
    feedback: {
      wrongSelection: "Place the AVERAGEIF result in B14.",
      wrongTool: "Use AVERAGEIF for conditional averages.",
      wrongResult: "The formula should average only values at least 18."
    },
    hints: ["Average means mean.", "AVERAGEIF needs a range and a condition."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-vlookup-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "VLOOKUP function",
    studentGoal: "Look up Robotics attendance.",
    scenario: "A teacher asks for the attendance value for one club without manually scanning the table.",
    studentSteps: ["Click E5.", "Type =VLOOKUP(\"Robotics\",A4:B7,2,FALSE).", "Press Enter.", "Check that the result shows the Robotics attendance."],
    supportedInCurrentLab: true,
    instruction: "Use VLOOKUP to return the attendance for Robotics.",
    meaning: "VLOOKUP searches the first column of a table and returns a matching value from another column.",
    clickPath: ["Cell E5", "Formula bar", "Type VLOOKUP formula"],
    expectedSelection: "E5",
    expectedAction: "formula-vlookup",
    expectedResult: "E5 displays 22.",
    autoCheck: { cells: [{ cell: "E5", formulaIncludes: ["VLOOKUP", "ROBOTICS", "A4:B7"], value: 22 }] },
    commonMistakes: ["Looking up the wrong club", "Using the wrong column number", "Leaving out FALSE"],
    feedback: {
      wrongSelection: "Place the VLOOKUP result in E5.",
      wrongTool: "Use VLOOKUP for a vertical table lookup.",
      wrongResult: "E5 should return the Robotics attendance value, 22."
    },
    hints: ["The club names are in the first column of A4:B7.", "Attendance is the second column of the lookup range."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-xlookup-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "XLOOKUP function",
    studentGoal: "Use XLOOKUP to find Art attendance.",
    scenario: "The head of year wants a quicker modern lookup formula to return the attendance for Art.",
    studentSteps: ["Click E6.", "Type =XLOOKUP(\"Art\",A4:A7,B4:B7).", "Press Enter.", "Check that the result shows the Art attendance."],
    supportedInCurrentLab: true,
    instruction: "Use XLOOKUP to return the attendance for Art.",
    meaning: "XLOOKUP searches one range and returns the matching value from another range.",
    clickPath: ["Cell E6", "Formula bar", "Type XLOOKUP formula"],
    expectedSelection: "E6",
    expectedAction: "formula-xlookup",
    expectedResult: "E6 displays 20.",
    autoCheck: { cells: [{ cell: "E6", formulaIncludes: ["XLOOKUP", "ART", "A4:A7", "B4:B7"], value: 20 }] },
    commonMistakes: ["Using the return range first", "Looking up the wrong club", "Typing the answer manually"],
    feedback: {
      wrongSelection: "Place the XLOOKUP result in E6.",
      wrongTool: "Use XLOOKUP for a modern lookup between two ranges.",
      wrongResult: "E6 should return the Art attendance value, 20."
    },
    hints: ["The lookup range contains club names.", "The return range contains attendance values."],
    difficulty: "confident",
    marks: 3
  },
  {
    id: "sheet-formula-ifs-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "IFS function",
    studentGoal: "Classify a club using IFS.",
    scenario: "The school wants a quick rating beside a club: Excellent for 22 or more, Good for 20 or more, and Review for the rest.",
    studentSteps: ["Click E7.", "Type =IFS(B5>=22,\"Excellent\",B5>=20,\"Good\",TRUE,\"Review\").", "Press Enter.", "Check that Robotics is classified as Excellent."],
    supportedInCurrentLab: true,
    instruction: "Use IFS to classify the Robotics attendance value in B5.",
    meaning: "IFS checks conditions in order and returns the first matching result.",
    clickPath: ["Cell E7", "Formula bar", "Type IFS formula"],
    expectedSelection: "E7",
    expectedAction: "formula-ifs",
    expectedResult: "E7 displays Excellent.",
    autoCheck: { cells: [{ cell: "E7", formulaIncludes: ["IFS", "B5>=22", "EXCELLENT", "B5>=20", "GOOD"], value: "Excellent" }] },
    commonMistakes: ["Putting the conditions in the wrong order", "Missing TRUE for the final case", "Using B4 instead of B5"],
    feedback: {
      wrongSelection: "Place the IFS result in E7.",
      wrongTool: "Use IFS for several conditions.",
      wrongResult: "E7 should classify Robotics as Excellent."
    },
    hints: ["IFS reads conditions from left to right.", "Put the highest condition first."],
    difficulty: "confident",
    marks: 3
  }
];

export const allSpreadsheetInstructionCards = [
  ...introSpreadsheetCards,
  ...spreadsheetInstructionCards,
  ...expansionSpreadsheetCards
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
