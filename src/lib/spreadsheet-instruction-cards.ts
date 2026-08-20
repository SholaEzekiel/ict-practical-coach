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

const generatedIntroSpecs = [
  ["B2", "Desk", "The form tutor wants a quick location marker in the second row."],
  ["D4", "Check", "The exams officer is checking whether students can move to a middle cell."],
  ["H2", "Right", "A club secretary wants you to practise moving across the worksheet."],
  ["A10", "Down", "The attendance officer wants you to practise moving down column A."],
  ["J5", "Target", "A teacher calls out a far cell reference to test your accuracy."],
  ["C8", "Row", "The class list uses lower rows, so you need to find row 8."],
  ["F6", "Column", "The PE sheet uses column F for notes."],
  ["K3", "Marker", "The office wants a marker near the right side of the sheet."],
  ["B12", "Late", "The tutor wants a note placed further down the worksheet."],
  ["E9", "Ready", "The spreadsheet task checks if you can combine column E and row 9."],
  ["G7", "Club", "A club organiser asks you to mark a cell in the middle of the grid."],
  ["L4", "End", "The coordinator wants you to practise finding a wider column."],
  ["C15", "Register", "The register has a note area lower down the worksheet."],
  ["I11", "House", "The house system sheet uses cells away from the first columns."],
  ["M6", "Point", "The admin team wants you to locate a cell beyond column L."],
  ["D14", "Task", "The teacher checks that row numbers are read correctly."],
  ["N2", "Far", "This task checks movement across many columns."],
  ["F16", "Finish", "The form sheet needs a marker in a lower row."],
  ["O8", "Wide", "The worksheet is wide, so you need to scroll or move across confidently."],
  ["H18", "Done", "The teacher wants you to practise a lower middle cell."]
] as const;

const generatedIntroSpreadsheetCards: SpreadsheetInstructionCard[] = generatedIntroSpecs.map(([cell, value, scenario], index) => ({
  id: `sheet-intro-cell-practice-${String(index + 1).padStart(2, "0")}`,
  moduleId: "intro",
  moduleTitle: "Introduction",
  category: "selection",
  skill: "Identify a cell",
  studentGoal: `Find cell ${cell}.`,
  scenario,
  studentSteps: [`Find column ${cell.replace(/\d+/g, "")}.`, `Find row ${cell.replace(/[A-Z]/gi, "")}.`, `Click ${cell}, type ${value}, and press Enter.`],
  supportedInCurrentLab: true,
  instruction: `Enter ${value} in cell ${cell}.`,
  meaning: `${cell} means column ${cell.replace(/\d+/g, "")}, row ${cell.replace(/[A-Z]/gi, "")}.`,
  clickPath: ["Worksheet grid", `Cell ${cell}`, `Type ${value}`],
  expectedSelection: cell,
  expectedAction: "enter-cell-value",
  expectedResult: `${cell} contains ${value}.`,
  autoCheck: { cells: [{ cell, value }] },
  commonMistakes: ["Using the wrong row", "Using the wrong column", "Typing into the heading instead of the cell"],
  feedback: {
    wrongSelection: `Click ${cell}.`,
    wrongTool: "This task is completed directly on the worksheet grid.",
    wrongResult: `${cell} should contain ${value}.`
  },
  hints: ["Read the column letter first.", "Read the row number second."],
  difficulty: "beginner",
  marks: 1
}));

const generatedRangeIntroCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-intro-range-row-001",
    studentGoal: "Enter three labels across one row.",
    scenario: "The science teacher needs three quick headings across a row for a mini experiment log.",
    cells: [["A20", "Test"], ["B20", "Result"], ["C20", "Comment"]]
  },
  {
    id: "sheet-intro-range-column-001",
    studentGoal: "Enter three labels down one column.",
    scenario: "The library assistant wants three book categories entered down a column.",
    cells: [["P2", "Fiction"], ["P3", "Non-fiction"], ["P4", "Reference"]]
  }
].map((task) => ({
  id: task.id,
  moduleId: "intro",
  moduleTitle: "Introduction",
  category: "selection",
  skill: "Use a cell range",
  studentGoal: task.studentGoal,
  scenario: task.scenario,
  studentSteps: task.cells.map(([cell, value]) => `Click ${cell}, type ${value}, then move to the next cell.`),
  supportedInCurrentLab: true,
  instruction: `Enter values in ${task.cells[0][0]}:${task.cells[task.cells.length - 1][0]}.`,
  meaning: "A range is a group of cells used together.",
  clickPath: ["Worksheet grid", "Cell range", "Type values"],
  expectedSelection: `${task.cells[0][0]}:${task.cells[task.cells.length - 1][0]}`,
  expectedAction: "enter-range-values",
  expectedResult: "The requested cells contain the correct values.",
  autoCheck: { cells: task.cells.map(([cell, value]) => ({ cell, value })) },
  commonMistakes: ["Typing values in the wrong direction", "Skipping a cell", "Starting in the wrong cell"],
  feedback: {
    wrongSelection: "Start in the first cell named in the task.",
    wrongTool: "This is direct data entry across a range.",
    wrongResult: "Each named cell should contain its requested value."
  },
  hints: ["Tab usually moves across.", "Enter usually moves down."],
  difficulty: "beginner",
  marks: 2
}));

const generatedDataEntrySpecs: Array<{
  id: string;
  goal: string;
  scenario: string;
  cells: Array<[string, string | number]>;
}> = [
  {
    id: "sheet-data-library-names-001",
    goal: "Enter library book categories.",
    scenario: "The librarian is preparing a borrowing summary and needs the categories entered before adding numbers.",
    cells: [["A22", "Fiction"], ["A23", "History"], ["A24", "Science"], ["A25", "Art"]]
  },
  {
    id: "sheet-data-library-values-001",
    goal: "Enter books borrowed.",
    scenario: "The librarian has counted how many books were borrowed in each category this week.",
    cells: [["B22", 34], ["B23", 18], ["B24", 26], ["B25", 12]]
  },
  {
    id: "sheet-data-canteen-items-001",
    goal: "Enter canteen item names.",
    scenario: "The canteen manager wants a simple list of items sold during break time.",
    cells: [["D20", "Sandwich"], ["D21", "Juice"], ["D22", "Fruit"], ["D23", "Water"]]
  },
  {
    id: "sheet-data-canteen-values-001",
    goal: "Enter canteen sales quantities.",
    scenario: "The canteen manager has counted the number of each item sold.",
    cells: [["E20", 45], ["E21", 38], ["E22", 24], ["E23", 52]]
  },
  {
    id: "sheet-data-house-names-001",
    goal: "Enter house names.",
    scenario: "The sports coordinator is preparing the inter-house points table.",
    cells: [["G20", "Red"], ["G21", "Blue"], ["G22", "Green"], ["G23", "Yellow"]]
  },
  {
    id: "sheet-data-house-values-001",
    goal: "Enter house points.",
    scenario: "The sports coordinator has received the final points from the referee.",
    cells: [["H20", 72], ["H21", 68], ["H22", 81], ["H23", 59]]
  },
  {
    id: "sheet-data-trip-headings-001",
    goal: "Enter trip register headings.",
    scenario: "The trip leader needs a small table for students going on a museum visit.",
    cells: [["J20", "Name"], ["K20", "Class"], ["L20", "Paid"]]
  },
  {
    id: "sheet-data-trip-row-001",
    goal: "Enter one trip register row.",
    scenario: "The first student has been added to the museum visit list.",
    cells: [["J21", "Amara"], ["K21", "10A"], ["L21", "Yes"]]
  },
  {
    id: "sheet-data-stock-headings-001",
    goal: "Enter stock table headings.",
    scenario: "The ICT technician is checking computer room stock.",
    cells: [["A28", "Item"], ["B28", "In stock"], ["C28", "Needed"]]
  },
  {
    id: "sheet-data-stock-row-001",
    goal: "Enter one stock row.",
    scenario: "The technician has counted spare keyboards.",
    cells: [["A29", "Keyboard"], ["B29", 14], ["C29", 20]]
  },
  {
    id: "sheet-data-weather-days-001",
    goal: "Enter weekday labels.",
    scenario: "A geography class is recording temperatures for a week.",
    cells: [["N20", "Mon"], ["O20", "Tue"], ["P20", "Wed"], ["Q20", "Thu"], ["R20", "Fri"]]
  },
  {
    id: "sheet-data-weather-values-001",
    goal: "Enter temperatures.",
    scenario: "The geography class has measured the daily temperatures.",
    cells: [["N21", 18], ["O21", 20], ["P21", 19], ["Q21", 21], ["R21", 17]]
  },
  {
    id: "sheet-data-budget-headings-001",
    goal: "Enter budget headings.",
    scenario: "The drama club is preparing a small event budget.",
    cells: [["D28", "Item"], ["E28", "Cost"], ["F28", "Paid"]]
  },
  {
    id: "sheet-data-budget-row-001",
    goal: "Enter one budget row.",
    scenario: "The drama club has bought poster paper for the performance.",
    cells: [["D29", "Posters"], ["E29", 12], ["F29", "Yes"]]
  },
  {
    id: "sheet-data-attendance-months-001",
    goal: "Enter month labels across a row.",
    scenario: "The office wants attendance headings for three months.",
    cells: [["H28", "Jan"], ["I28", "Feb"], ["J28", "Mar"]]
  },
  {
    id: "sheet-data-attendance-month-values-001",
    goal: "Enter monthly attendance totals.",
    scenario: "The office has total attendance figures for each month.",
    cells: [["H29", 410], ["I29", 398], ["J29", 425]]
  }
];

const generatedDataEntryCards: SpreadsheetInstructionCard[] = generatedDataEntrySpecs.map((task) => ({
  id: task.id,
  moduleId: "data-entry",
  moduleTitle: "Data Entry",
  category: "data-entry",
  skill: "Enter data accurately",
  studentGoal: task.goal,
  scenario: task.scenario,
  studentSteps: task.cells.map(([cell, value]) => `Click ${cell}, type ${value}, then move to the next required cell.`),
  supportedInCurrentLab: true,
  instruction: task.goal,
  meaning: "Enter each item in the correct cell so the table can be used later.",
  clickPath: ["Worksheet grid", "Required cells"],
  expectedSelection: task.cells.length > 1 ? `${task.cells[0][0]}:${task.cells[task.cells.length - 1][0]}` : task.cells[0][0],
  expectedAction: "enter-values",
  expectedResult: "The requested cells contain the correct data.",
  autoCheck: { cells: task.cells.map(([cell, value]) => ({ cell, value })) },
  commonMistakes: ["Typing in the wrong cell", "Skipping a value", "Putting labels and numbers in the wrong columns"],
  feedback: {
    wrongSelection: "Use the exact cells named in the steps.",
    wrongTool: "This is direct data entry.",
    wrongResult: "Check each cell against the required value."
  },
  hints: ["Read the cell reference carefully.", "Use one cell for each value."],
  difficulty: "beginner",
  marks: 2
}));

const generatedFormattingCards: SpreadsheetInstructionCard[] = [
  ["sheet-format-title-merge-002", "Merge the event title.", "The school office wants the event title to stretch neatly across the table.", "A1:D1", "Merge & Centre"],
  ["sheet-format-main-heading-bold-002", "Make the main heading bold.", "The head teacher wants the main title to stand out clearly.", "A1", "Bold"],
  ["sheet-format-headings-bold-002", "Bold the stock table headings.", "The ICT technician wants table headings to stand out from the stock rows.", "A28:C28", "Bold"],
  ["sheet-format-budget-currency-002", "Format budget costs as currency.", "The drama club wants the event cost column to show money clearly.", "E29:E29", "Currency"],
  ["sheet-format-attendance-decimal-002", "Show attendance with one decimal place.", "The attendance officer wants consistent decimal formatting.", "H29:J29", "One decimal place"],
  ["sheet-format-weather-fill-002", "Shade the weather headings.", "The geography teacher wants the weekday headings separated from values.", "N20:R20", "Fill colour"],
  ["sheet-format-trip-wrap-002", "Wrap trip register headings.", "The trip leader wants long headings to fit inside their cells.", "J20:L20", "Wrap Text"],
  ["sheet-format-stock-column-width-002", "Widen the item column.", "The technician wants item names to be fully visible.", "A:A", "Column width"],
  ["sheet-format-title-font-size-002", "Increase the title font size.", "The report title needs to be more visible at the top of the worksheet.", "A1", "Font size"],
  ["sheet-format-title-centre-002", "Centre the title text.", "The title should sit neatly in the middle of its title area.", "A1:D1", "Centre align"],
  ["sheet-format-house-colour-002", "Apply fill colour to house headings.", "The sports coordinator wants house labels to stand out.", "G20:H20", "Fill colour"],
  ["sheet-format-canteen-italic-002", "Italicise canteen item names.", "The canteen manager wants item names styled differently from quantities.", "D20:D23", "Italic"],
  ["sheet-format-library-underline-002", "Underline library categories.", "The librarian wants category names emphasized.", "A22:A25", "Underline"],
  ["sheet-format-budget-paid-centre-002", "Centre the Paid column.", "The drama club wants Yes/No values aligned neatly.", "F29:F29", "Centre align"],
  ["sheet-format-stock-needed-bold-002", "Bold the Needed value.", "The technician wants the target stock number to stand out.", "C29", "Bold"],
  ["sheet-format-trip-row-fill-002", "Shade the first trip row.", "The trip leader wants the first entered student row highlighted.", "J21:L21", "Fill colour"],
  ["sheet-format-weather-values-decimal-002", "Format temperatures with one decimal place.", "The geography teacher wants temperatures displayed consistently.", "N21:R21", "One decimal place"],
  ["sheet-format-house-points-number-002", "Format house points as whole numbers.", "The sports coordinator wants no decimal places for points.", "H20:H23", "Zero decimal places"],
  ["sheet-format-budget-cost-bold-002", "Bold the budget cost.", "The drama club wants the cost figure easy to spot.", "E29", "Bold"],
  ["sheet-format-gridlines-print-002", "Prepare gridlines for printing.", "The office wants the table boundaries to show when printed.", "Worksheet", "Print gridlines"],
  ["sheet-format-row-height-title-002", "Increase the title row height.", "The report title needs breathing room above the table.", "Row 1", "Row height"],
  ["sheet-format-library-column-width-002", "Widen the category column.", "The librarian wants longer category names fully visible.", "A:A", "Column width"],
  ["sheet-format-data-border-002", "Add borders around the small table.", "The teacher wants the data area clearly boxed.", "A3:D8", "Borders"],
  ["sheet-format-percentage-002", "Format completion values as percentages.", "The head of year wants completion values to show as percentages.", "M20:M23", "Percentage"],
  ["sheet-format-font-colour-002", "Change the title font colour.", "The report needs a title colour that distinguishes it from the table.", "A1", "Font colour"]
].map(([id, goal, scenario, range, command]) => ({
  id,
  moduleId: "formatting",
  moduleTitle: "Formatting",
  category: "formatting",
  skill: command,
  studentGoal: goal,
  scenario,
  studentSteps: [`Select ${range}.`, `Use the toolbar or three dots / More menu to choose ${command}.`, "Check that the selected cells show the requested formatting."],
  supportedInCurrentLab: true,
  instruction: `${goal} in ${range}.`,
  meaning: "Formatting changes how data is displayed without changing the meaning of the data.",
  clickPath: ["Toolbar", command],
  expectedSelection: range,
  expectedAction: command.toLowerCase().replace(/\s+/g, "-"),
  expectedResult: `${range} uses ${command}.`,
  commonMistakes: ["Selecting the wrong range", "Changing values instead of formatting", "Using a similar but incorrect command"],
  feedback: {
    wrongSelection: `Select ${range}.`,
    wrongTool: `Use ${command}.`,
    wrongResult: `The selected range should show ${command}.`
  },
  hints: ["Select before formatting.", "Use More if the command is hidden."],
  difficulty: "developing",
  marks: 2
}));

const extraFormulaCards: SpreadsheetInstructionCard[] = [
  {
    id: "sheet-formula-count-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "COUNT function",
    studentGoal: "Count numeric attendance values.",
    scenario: "The office wants to know how many numeric attendance entries are in the club table before checking totals.",
    studentSteps: ["Click B15.", "Type =COUNT(B4:B7).", "Press Enter.", "Check that the result counts only the numeric cells."],
    supportedInCurrentLab: true,
    instruction: "Use COUNT to count numeric values in B4:B7.",
    meaning: "COUNT returns how many cells in a range contain numbers.",
    clickPath: ["Cell B15", "Formula bar", "Type COUNT formula"],
    expectedSelection: "B15",
    expectedAction: "formula-count",
    expectedResult: "B15 displays 4.",
    autoCheck: { cells: [{ cell: "B15", formula: "=COUNT(B4:B7)", value: 4 }] },
    commonMistakes: ["Using COUNTA instead of COUNT", "Counting the label column", "Typing the answer manually"],
    feedback: {
      wrongSelection: "Place the COUNT result in B15.",
      wrongTool: "Use COUNT for numeric entries.",
      wrongResult: "B15 should use =COUNT(B4:B7) and display 4."
    },
    hints: ["COUNT checks numbers.", "Do not include headings."],
    difficulty: "developing",
    marks: 2
  },
  {
    id: "sheet-formula-counta-001",
    moduleId: "formula",
    moduleTitle: "Formulae",
    category: "formula",
    skill: "COUNTA function",
    studentGoal: "Count club name entries.",
    scenario: "The PE department wants to count how many club labels have been entered in the table.",
    studentSteps: ["Click A12.", "Type =COUNTA(A4:A7).", "Press Enter.", "Check that the result counts the club names."],
    supportedInCurrentLab: true,
    instruction: "Use COUNTA to count entries in A4:A7.",
    meaning: "COUNTA counts cells that are not empty, including text labels.",
    clickPath: ["Cell A12", "Formula bar", "Type COUNTA formula"],
    expectedSelection: "A12",
    expectedAction: "formula-counta",
    expectedResult: "A12 displays 4.",
    autoCheck: { cells: [{ cell: "A12", formula: "=COUNTA(A4:A7)", value: 4 }] },
    commonMistakes: ["Using COUNT for text cells", "Including the heading", "Typing the answer manually"],
    feedback: {
      wrongSelection: "Place the COUNTA result in A12.",
      wrongTool: "Use COUNTA for text or non-empty entries.",
      wrongResult: "A12 should use =COUNTA(A4:A7) and display 4."
    },
    hints: ["COUNTA counts non-empty cells.", "Text labels can be counted with COUNTA."],
    difficulty: "developing",
    marks: 2
  }
];

const generatedDataToolCards: SpreadsheetInstructionCard[] = [
  ["sheet-data-tool-sort-club-002", "Sort club names alphabetically.", "The activities coordinator wants club names arranged from A to Z.", "A3:D7", "Sort A to Z"],
  ["sheet-data-tool-sort-attendance-desc-002", "Sort attendance from highest to lowest.", "The PE teacher wants the most popular club at the top.", "A3:D7", "Sort largest to smallest"],
  ["sheet-data-tool-sort-sessions-002", "Sort clubs by sessions.", "The deputy head wants clubs with fewer sessions shown first.", "A3:D7", "Sort smallest to largest"],
  ["sheet-data-tool-filter-attendance-002", "Filter clubs above 18 attendance.", "The school wants to show only clubs that reached more than 18 pupils.", "A3:D7", "Number filter greater than 18"],
  ["sheet-data-tool-filter-session-002", "Filter clubs with 6 sessions.", "The activities leader wants to view clubs that ran six sessions.", "A3:D7", "Filter equals 6"],
  ["sheet-data-tool-search-robotics-002", "Find Robotics in the table.", "The teacher wants to locate the Robotics record quickly.", "A3:D7", "Find"],
  ["sheet-data-tool-search-total-002", "Find the Total row.", "The office wants to check where the total summary appears.", "A1:D12", "Find"],
  ["sheet-data-tool-clear-filter-002", "Clear the active filter.", "The teacher needs all records visible again after filtering.", "A3:D7", "Clear filter"],
  ["sheet-data-tool-sort-library-002", "Sort library categories alphabetically.", "The librarian wants categories in alphabetical order.", "A22:B25", "Sort A to Z"],
  ["sheet-data-tool-filter-library-002", "Filter borrowed books above 20.", "The librarian wants to see only popular categories.", "A22:B25", "Number filter greater than 20"],
  ["sheet-data-tool-sort-house-002", "Sort house points descending.", "The sports coordinator wants the winning house first.", "G20:H23", "Sort largest to smallest"],
  ["sheet-data-tool-filter-paid-002", "Filter paid trip records.", "The trip leader wants to see only students who have paid.", "J20:L21", "Filter equals Yes"],
  ["sheet-data-tool-remove-filter-002", "Show all records again.", "The office has finished checking and wants the full table back.", "J20:L21", "Clear filter"]
].map(([id, goal, scenario, range, command]) => ({
  id,
  moduleId: "data-tools",
  moduleTitle: "Data Tools",
  category: "data-tools",
  skill: command,
  studentGoal: goal,
  scenario,
  studentSteps: [`Select ${range}.`, `Open the Data tools or the column filter menu.`, `Choose ${command}.`, "Check that the table shows the requested order or records."],
  supportedInCurrentLab: true,
  instruction: `${goal} using ${range}.`,
  meaning: "Data tools help you reorder, narrow down, or find records without manually rewriting the table.",
  clickPath: ["Data", command],
  expectedSelection: range,
  expectedAction: command.toLowerCase().replace(/\s+/g, "-"),
  expectedResult: `${range} has been changed using ${command}.`,
  commonMistakes: ["Selecting only one column", "Including the total row", "Deleting records instead of filtering"],
  feedback: {
    wrongSelection: `Select the full table range ${range}.`,
    wrongTool: `Use ${command}.`,
    wrongResult: "The table should show the requested records or order."
  },
  hints: ["Select the whole table.", "Do not include summary totals unless asked."],
  difficulty: "developing",
  marks: 3
}));

const generatedChartCards: SpreadsheetInstructionCard[] = [
  ["sheet-chart-attendance-column-002", "Create a column chart for attendance.", "The PE teacher wants a visual comparison of club attendance.", "A4:B7", "Column chart"],
  ["sheet-chart-attendance-bar-002", "Create a bar chart for attendance.", "The head teacher wants a horizontal comparison chart.", "A4:B7", "Bar chart"],
  ["sheet-chart-library-pie-002", "Create a pie chart for book categories.", "The librarian wants to show the share of borrowed books by category.", "A22:B25", "Pie chart"],
  ["sheet-chart-house-column-002", "Create a column chart for house points.", "The sports coordinator wants to compare house scores.", "G20:H23", "Column chart"],
  ["sheet-chart-weather-line-002", "Create a line chart for temperatures.", "The geography class wants to show temperature changes across the week.", "N20:R21", "Line chart"],
  ["sheet-chart-title-attendance-002", "Add the chart title Club Attendance.", "The teacher wants the chart title to explain the data clearly.", "Chart", "Chart title"],
  ["sheet-chart-title-library-002", "Add the chart title Book Borrowing.", "The librarian wants a clear title for the borrowing chart.", "Chart", "Chart title"],
  ["sheet-chart-axis-attendance-002", "Add Attendance as the value axis title.", "The chart needs a label for the numbers shown.", "Chart", "Value axis title"],
  ["sheet-chart-axis-club-002", "Add Club as the category axis title.", "The chart needs a label for the club names.", "Chart", "Category axis title"],
  ["sheet-chart-legend-right-002", "Move the legend to the right.", "The report needs a neat chart layout for printing.", "Chart", "Legend position"],
  ["sheet-chart-data-labels-002", "Show data labels on the chart.", "The teacher wants exact values visible on the chart.", "Chart", "Data labels"],
  ["sheet-chart-change-type-002", "Change the chart to a bar chart.", "The first chart type was not suitable, so it needs changing.", "Chart", "Change chart type"]
].map(([id, goal, scenario, range, command]) => ({
  id,
  moduleId: "chart",
  moduleTitle: "Charts",
  category: "chart",
  skill: command,
  studentGoal: goal,
  scenario,
  studentSteps: [`Select ${range}.`, "Open Insert or chart tools.", `Choose ${command}.`, "Check that the chart matches the requested data and label."],
  supportedInCurrentLab: true,
  instruction: `${goal} using ${range}.`,
  meaning: "Charts turn data into a visual comparison.",
  clickPath: ["Insert", "Chart", command],
  expectedSelection: range,
  expectedAction: command.toLowerCase().replace(/\s+/g, "-"),
  expectedResult: `${command} is applied to ${range}.`,
  commonMistakes: ["Selecting only numbers", "Including totals", "Using an unsuitable chart type"],
  feedback: {
    wrongSelection: `Use ${range}.`,
    wrongTool: `Choose ${command}.`,
    wrongResult: "The chart should match the requested source data and label."
  },
  hints: ["Charts need labels and values.", "Avoid total rows unless the task asks for them."],
  difficulty: "developing",
  marks: 3
}));

const generatedLayoutCards: SpreadsheetInstructionCard[] = [
  ["sheet-layout-print-area-table-002", "Set the print area to A1:D8.", "The office only wants the main attendance table to print.", "A1:D8", "Set print area"],
  ["sheet-layout-landscape-002", "Set the worksheet to landscape.", "The report is too wide for portrait printing.", "Worksheet", "Landscape orientation"],
  ["sheet-layout-portrait-002", "Set the worksheet to portrait.", "The teacher wants a narrow report printed upright.", "Worksheet", "Portrait orientation"],
  ["sheet-layout-gridlines-002", "Turn on printed gridlines.", "The printed table should show cell boundaries.", "Worksheet", "Print gridlines"],
  ["sheet-layout-no-gridlines-002", "Turn off printed gridlines.", "The final report needs a cleaner printed look.", "Worksheet", "Hide print gridlines"],
  ["sheet-layout-column-a-width-002", "Widen column A.", "The club names should be fully visible before printing.", "Column A", "Column width"],
  ["sheet-layout-column-d-width-002", "Widen column D.", "The average heading needs more space.", "Column D", "Column width"],
  ["sheet-layout-row-1-height-002", "Increase row 1 height.", "The title row needs more space for presentation.", "Row 1", "Row height"],
  ["sheet-layout-fit-one-page-002", "Fit the sheet to one page wide.", "The report should print neatly across one page.", "Worksheet", "Fit to one page wide"],
  ["sheet-layout-margins-narrow-002", "Set narrow margins.", "The table needs more space on the printed page.", "Worksheet", "Narrow margins"]
].map(([id, goal, scenario, range, command]) => ({
  id,
  moduleId: "layout",
  moduleTitle: "Print and Layout",
  category: "layout",
  skill: command,
  studentGoal: goal,
  scenario,
  studentSteps: [`Select or open ${range}.`, "Open the page layout or row/column controls.", `Choose ${command}.`, "Check that the page or sheet layout matches the instruction."],
  supportedInCurrentLab: true,
  instruction: goal,
  meaning: "Layout controls prepare the spreadsheet for reading and printing.",
  clickPath: ["Page Layout", command],
  expectedSelection: range,
  expectedAction: command.toLowerCase().replace(/\s+/g, "-"),
  expectedResult: `${command} has been applied.`,
  commonMistakes: ["Changing the wrong row or column", "Changing screen view instead of print settings", "Selecting too much data"],
  feedback: {
    wrongSelection: `Use ${range}.`,
    wrongTool: `Choose ${command}.`,
    wrongResult: "The layout should match the print or display instruction."
  },
  hints: ["Print settings are usually under page layout.", "Row and column sizes use row/column boundaries."],
  difficulty: "developing",
  marks: 2
}));

export const allSpreadsheetInstructionCards = [
  ...introSpreadsheetCards,
  ...generatedIntroSpreadsheetCards,
  ...generatedRangeIntroCards,
  ...spreadsheetInstructionCards,
  ...expansionSpreadsheetCards,
  ...generatedDataEntryCards,
  ...extraFormulaCards,
  ...generatedFormattingCards,
  ...generatedDataToolCards,
  ...generatedChartCards,
  ...generatedLayoutCards
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
  const cards = allSpreadsheetInstructionCards
    .filter((card) => !moduleId || (card.moduleId || card.category) === moduleId)
    .sort((first, second) => moduleSortIndex(first) - moduleSortIndex(second));

  return cards;
}
