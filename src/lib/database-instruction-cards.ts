export type DatabaseModule = {
  id: string;
  title: string;
  description: string;
};

export type DatabaseExpectedResult = {
  importedTables?: string[];
  selectedTable?: string;
  fieldTypes?: Record<string, string>;
  primaryKey?: string;
  relationship?: string;
  queryField?: string;
  queryOperator?: string;
  queryValue?: string;
  queryJoin?: "AND" | "OR";
  sortField?: string;
  sortDirection?: "Ascending" | "Descending";
  reportTitle?: string;
  reportFields?: string[];
  labelField?: string;
};

export type DatabaseCard = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  scenario: string;
  supportDocument: string[];
  goal: string;
  steps: string[];
  expected: DatabaseExpectedResult;
  teacherReview?: string[];
  points: number;
};

export type DatabaseField = {
  name: string;
  type: string;
  primary: boolean;
};

export type DatabaseTable = {
  name: string;
  fields: DatabaseField[];
  rows: Record<string, string>[];
};

export const databaseModules: DatabaseModule[] = [
  { id: "intro", title: "Tables and Records", description: "Identify tables, fields, records, data types, and primary keys." },
  { id: "import-design", title: "Import and Table Design", description: "Import CSV-style source files, rename fields, set data types, and create keys." },
  { id: "queries", title: "Queries and Sorting", description: "Build criteria, AND/OR logic, date/value filters, and sorted query output." },
  { id: "reports-labels", title: "Reports and Labels", description: "Create report previews, choose fields, add titles, format output, and create labels." },
  { id: "exam-build", title: "Exam Database Build", description: "Complete a full original database task using import, query, report, labels, and evidence checks." }
];

export const sourceTables: DatabaseTable[] = [
  {
    name: "learners",
    fields: [
      { name: "LearnerID", type: "Number", primary: true },
      { name: "Name", type: "Text", primary: false },
      { name: "Group", type: "Text", primary: false },
      { name: "Target", type: "Text", primary: false }
    ],
    rows: [
      { LearnerID: "101", Name: "Amina Cole", Group: "Year 10", Target: "Spreadsheet" },
      { LearnerID: "102", Name: "Jon Bell", Group: "Year 11", Target: "Database" },
      { LearnerID: "103", Name: "Maya Stone", Group: "Year 10", Target: "Presentation" }
    ]
  },
  {
    name: "bookings",
    fields: [
      { name: "BookingID", type: "Number", primary: true },
      { name: "LearnerID", type: "Number", primary: false },
      { name: "Session", type: "Text", primary: false },
      { name: "Minutes", type: "Number", primary: false },
      { name: "Confirmed", type: "Boolean", primary: false }
    ],
    rows: [
      { BookingID: "501", LearnerID: "101", Session: "Spreadsheet", Minutes: "45", Confirmed: "Yes" },
      { BookingID: "502", LearnerID: "102", Session: "Database", Minutes: "60", Confirmed: "Yes" },
      { BookingID: "503", LearnerID: "103", Session: "Presentation", Minutes: "30", Confirmed: "No" }
    ]
  }
];

const support = [
  "Source file 1: learners.csv with LearnerID, Name, Group, Target",
  "Source file 2: bookings.csv with BookingID, LearnerID, Session, Minutes, Confirmed",
  "Relationship: learners.LearnerID to bookings.LearnerID",
  "Report title: Confirmed Apex Practice Sessions",
  "Label field: Name"
];

const card = (item: DatabaseCard) => item;

const introCards: DatabaseCard[] = [
  card({
    id: "db-intro-table",
    moduleId: "intro",
    moduleTitle: "Tables and Records",
    title: "Import the learners table",
    scenario: "Apex has a small learner list supplied as a CSV-style source file.",
    supportDocument: support,
    goal: "Import learners.csv as a database table.",
    steps: ["Open the Import panel.", "Click Import learners.csv.", "Check that the learners table appears in the table list."],
    expected: { importedTables: ["learners"], selectedTable: "learners" },
    points: 10
  }),
  card({
    id: "db-intro-fields",
    moduleId: "intro",
    moduleTitle: "Tables and Records",
    title: "Identify fields",
    scenario: "Students need to recognise that fields are the column headings in a table.",
    supportDocument: support,
    goal: "Select the learners table and check the LearnerID, Name, Group, and Target fields.",
    steps: ["Select learners.", "Look at the field design panel.", "Check each field name is present."],
    expected: { importedTables: ["learners"], selectedTable: "learners" },
    points: 10
  }),
  ...[
    ["db-intro-records", "View records", { importedTables: ["learners"], selectedTable: "learners" }],
    ["db-intro-key", "Set a primary key", { importedTables: ["learners"], selectedTable: "learners", primaryKey: "LearnerID" }],
    ["db-intro-number-type", "Set a number field", { importedTables: ["learners"], selectedTable: "learners", fieldTypes: { LearnerID: "Number" } }],
    ["db-intro-text-type", "Set text fields", { importedTables: ["learners"], selectedTable: "learners", fieldTypes: { Name: "Text", Group: "Text" } }]
  ].map(([id, title, expected]) => card({
    id: id as string,
    moduleId: "intro",
    moduleTitle: "Tables and Records",
    title: title as string,
    scenario: "Practise one database concept before combining the skills.",
    supportDocument: support,
    goal: title as string,
    steps: ["Import the learners source file if needed.", "Use the table list and field design panel.", "Check the field name, data type, or key setting."],
    expected: expected as DatabaseExpectedResult,
    points: 12
  }))
];

const importCards: DatabaseCard[] = [
  ...[
    ["db-import-bookings", "Import the bookings table", { importedTables: ["learners", "bookings"], selectedTable: "bookings" }],
    ["db-import-booking-key", "Set BookingID as key", { importedTables: ["bookings"], selectedTable: "bookings", primaryKey: "BookingID" }],
    ["db-import-minutes-number", "Set Minutes as Number", { importedTables: ["bookings"], selectedTable: "bookings", fieldTypes: { Minutes: "Number" } }],
    ["db-import-confirmed-boolean", "Set Confirmed as Boolean", { importedTables: ["bookings"], selectedTable: "bookings", fieldTypes: { Confirmed: "Boolean" } }],
    ["db-import-relationship", "Create the table relationship", { importedTables: ["learners", "bookings"], relationship: "LearnerID" }]
  ].map(([id, title, expected]) => card({
    id: id as string,
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: title as string,
    scenario: "A second source file must connect learner details to practice bookings.",
    supportDocument: support,
    goal: title as string,
    steps: ["Import both source files where needed.", "Use field design to check keys and data types.", "Create the relationship using LearnerID."],
    expected: expected as DatabaseExpectedResult,
    points: 15
  }))
];

const queryCards: DatabaseCard[] = [
  ...[
    ["db-query-confirmed", "Find confirmed bookings", { importedTables: ["bookings"], queryField: "Confirmed", queryOperator: "equals", queryValue: "Yes" }],
    ["db-query-long", "Find long sessions", { importedTables: ["bookings"], queryField: "Minutes", queryOperator: "greater than", queryValue: "40" }],
    ["db-query-session", "Find database sessions", { importedTables: ["bookings"], queryField: "Session", queryOperator: "contains", queryValue: "Database" }],
    ["db-query-and", "Use AND criteria", { importedTables: ["bookings"], queryField: "Confirmed", queryOperator: "equals", queryValue: "Yes", queryJoin: "AND" }],
    ["db-query-sort", "Sort by session time", { importedTables: ["bookings"], sortField: "Minutes", sortDirection: "Descending" }]
  ].map(([id, title, expected]) => card({
    id: id as string,
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: title as string,
    scenario: "A database practical task usually asks students to extract only the records that match criteria.",
    supportDocument: support,
    goal: title as string,
    steps: ["Open the Query panel.", "Choose the field, operator, and value.", "Apply sort order if the task asks for it."],
    expected: expected as DatabaseExpectedResult,
    points: 15
  }))
];

const reportCards: DatabaseCard[] = [
  ...[
    ["db-report-title", "Create a report title", { reportTitle: "Confirmed Apex Practice Sessions" }],
    ["db-report-fields", "Choose report fields", { reportFields: ["Name", "Session", "Minutes", "Confirmed"] }],
    ["db-report-sort", "Sort report output", { sortField: "Name", sortDirection: "Ascending" }],
    ["db-label-name", "Create name labels", { labelField: "Name" }]
  ].map(([id, title, expected]) => card({
    id: id as string,
    moduleId: "reports-labels",
    moduleTitle: "Reports and Labels",
    title: title as string,
    scenario: "The final output must be readable and contain only the requested fields.",
    supportDocument: support,
    goal: title as string,
    steps: ["Open the Report or Labels panel.", "Choose only the fields requested.", "Check the title and output preview."],
    expected: expected as DatabaseExpectedResult,
    teacherReview: ["Teacher should check report layout, full field visibility, page orientation, and evidence screenshots."],
    points: 15
  }))
];

const examCards: DatabaseCard[] = [
  card({
    id: "db-exam-apex-bookings",
    moduleId: "exam-build",
    moduleTitle: "Exam Database Build",
    title: "Apex bookings database build",
    scenario: "Complete an original 0417-style database task using imported tables, field design, a relationship, query criteria, report output, labels, and evidence checks.",
    supportDocument: support,
    goal: "Build the Apex practice bookings database.",
    steps: ["Import learners.csv and bookings.csv.", "Set keys, data types, and the LearnerID relationship.", "Query confirmed bookings, sort the output, create a report, and create labels."],
    expected: {
      importedTables: ["learners", "bookings"],
      primaryKey: "BookingID",
      fieldTypes: { Minutes: "Number", Confirmed: "Boolean" },
      relationship: "LearnerID",
      queryField: "Confirmed",
      queryOperator: "equals",
      queryValue: "Yes",
      reportTitle: "Confirmed Apex Practice Sessions",
      reportFields: ["Name", "Session", "Minutes", "Confirmed"],
      labelField: "Name"
    },
    teacherReview: ["Check source import, data types, keys, relationship evidence, query design, report formatting, labels, and screenshots."],
    points: 80
  })
];

const allCards = [...introCards, ...importCards, ...queryCards, ...reportCards, ...examCards];

export function getDatabaseModule(moduleId?: string) {
  return databaseModules.find((module) => module.id === moduleId);
}

export function getDatabaseCardsForModule(moduleId?: string) {
  return allCards.filter((card) => !moduleId || card.moduleId === moduleId);
}
