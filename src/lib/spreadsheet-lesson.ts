export type SpreadsheetTaskId = "title" | "headings" | "data" | "formula" | "format" | "chart";

export type SpreadsheetTask = {
  id: SpreadsheetTaskId;
  title: string;
  instruction: string;
  marks: number;
  expectedSelection?: string[];
  expectedAction: string;
  hints: string[];
};

export const spreadsheetLesson = {
  title: "Club attendance worksheet",
  scenario:
    "A school office needs a formatted spreadsheet showing club attendance. Complete the worksheet by entering data, applying formatting, using a formula, and presenting the result clearly.",
  marks: 18,
  skills: ["Cell selection", "Formatting", "Data entry", "SUM formula", "Number format", "Chart preparation"],
  tasks: [
    {
      id: "title",
      title: "Merge and centre the title",
      instruction: "Select A1:D1, enter Club Attendance Summary in A1, then use Merge and Centre.",
      marks: 3,
      expectedSelection: ["A1", "B1", "C1", "D1"],
      expectedAction: "merge-center",
      hints: ["Drag across A1 to D1 before pressing the merge control.", "The title text should be in A1 before merging."]
    },
    {
      id: "headings",
      title: "Apply bold headings",
      instruction: "Select A3:D3 and apply bold formatting to the column headings.",
      marks: 2,
      expectedSelection: ["A3", "B3", "C3", "D3"],
      expectedAction: "bold",
      hints: ["The heading row is row 3.", "Bold is a formatting action, not a data entry action."]
    },
    {
      id: "data",
      title: "Enter attendance values",
      instruction: "Enter Drama, Robotics, Coding and Art with attendance values 18, 22, 16 and 20 in rows 4 to 7.",
      marks: 4,
      expectedAction: "data-entry",
      hints: ["Use column A for club names and column B for attendance.", "Rows 4 to 7 hold the four club records."]
    },
    {
      id: "formula",
      title: "Use a SUM formula",
      instruction: "In B8, use a SUM formula to calculate the total attendance for B4:B7.",
      marks: 3,
      expectedSelection: ["B8"],
      expectedAction: "formula",
      hints: ["The formula should start with =.", "The required range is B4:B7."]
    },
    {
      id: "format",
      title: "Format to two decimal places",
      instruction: "Select B4:B8 and format the numbers to two decimal places.",
      marks: 3,
      expectedSelection: ["B4", "B5", "B6", "B7", "B8"],
      expectedAction: "two-decimals",
      hints: ["Include the total cell in your selection.", "Use the 0.00 control."]
    },
    {
      id: "chart",
      title: "Create a basic chart",
      instruction: "Select A4:B7 and create a simple bar chart for the club attendance data.",
      marks: 3,
      expectedSelection: ["A4", "A5", "A6", "A7", "B4", "B5", "B6", "B7"],
      expectedAction: "chart",
      hints: ["Select labels and values before creating the chart.", "Do not include the total row in the chart source."]
    }
  ] satisfies SpreadsheetTask[]
};

export const initialCells: Record<string, string> = {
  A1: "",
  A3: "Club",
  B3: "Attendance",
  C3: "Sessions",
  D3: "Average",
  A4: "",
  B4: "",
  A5: "",
  B5: "",
  A6: "",
  B6: "",
  A7: "",
  B7: "",
  A8: "Total",
  B8: ""
};
