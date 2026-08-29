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
  knowledgeCheck?: string;
};

export type DatabaseQuiz = {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
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
  accessPath?: string[];
  quiz?: DatabaseQuiz;
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
  { id: "intro", title: "Access Foundations", description: "Learn tables, fields, records, data types, primary keys, and relationships as Microsoft Access processes." },
  { id: "import-design", title: "Import and Table Design", description: "Follow Access ribbon paths for CSV import, design view, data types, keys, validation, masks, and integrity." },
  { id: "queries", title: "Queries and Sorting", description: "Learn criteria rows, AND/OR logic, wildcards, calculated fields, parameters, dates, and sorting." },
  { id: "reports-labels", title: "Reports, Labels and Print", description: "Prepare report output, grouping, totals, visibility, labels, landscape fit, and export/print evidence." },
  { id: "exam-build", title: "Exam Database Build", description: "Use mixed knowledge checks to recognise the correct Access process for common 0417 database tasks." },
  { id: "free-practice", title: "Free Practice", description: "Open the database workspace for importing CSV files, trying query/report controls, and printing evidence." }
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

const knowledgeCards: DatabaseCard[] = [
  card({
    id: "db-access-import-csv",
    moduleId: "intro",
    moduleTitle: "Access Foundations",
    title: "Import CSV data",
    scenario: "A 0417 database task often begins by importing a CSV source file into Microsoft Access.",
    supportDocument: ["Exam instruction: Import N26_CUST.csv and use the first row as field names.", "The first row contains headings such as Customer_ID, Join_Date, and Fees.", "If the first row is not treated as field names, those headings become an incorrect data record."],
    goal: "Learn the Access steps for importing a CSV file with field names.",
    steps: ["Open Access and choose External Data.", "Select New Data Source > From File > Text File.", "Browse to the CSV file and choose the import option.", "Tick First Row Contains Field Names, then finish the import."],
    accessPath: ["External Data", "New Data Source", "From File", "Text File"],
    quiz: { question: "What setting prevents CSV headings from being imported as ordinary records?", options: ["Append a copy of records", "First Row Contains Field Names", "Set Indexed to Yes", "Enforce validation constraints"], correctIndex: 1, feedback: "Correct. Access uses the first row to name the fields instead of importing it as data." },
    expected: { knowledgeCheck: "mcq_1" },
    points: 10
  }),
  card({
    id: "db-access-records-fields",
    moduleId: "intro",
    moduleTitle: "Access Foundations",
    title: "Recognise records and fields",
    scenario: "Students need to understand the language used in database tasks before using Design View.",
    supportDocument: ["A field is one category of data, like Customer_ID or Fees.", "A record is one complete row about one customer, product, learner, or booking.", "Access tables store records in rows and fields in columns."],
    goal: "Identify the difference between a field and a record.",
    steps: ["Open the imported table.", "Read the column headings as fields.", "Read each complete row as one record.", "Use this vocabulary when checking later task instructions."],
    accessPath: ["Table", "Datasheet View", "Fields", "Records"],
    quiz: { question: "In an Access table, what is a field?", options: ["One complete row of data", "A database password", "A column/category of data", "A printed report footer"], correctIndex: 2, feedback: "Correct. A field is a column/category such as Fees, Country, or Join_Date." },
    expected: { knowledgeCheck: "mcq_records_fields" },
    points: 10
  }),
  card({
    id: "db-access-primary-key",
    moduleId: "intro",
    moduleTitle: "Access Foundations",
    title: "Set a primary key",
    scenario: "Many exam tasks ask students to identify the unique field used to identify each record.",
    supportDocument: ["A primary key must uniquely identify each record.", "It should not be blank and should not repeat.", "Common examples include Customer_ID, BookingID, or StudentID."],
    goal: "Learn the Access steps for assigning a primary key.",
    steps: ["Open the table in Design View.", "Select the unique ID field row.", "Click the Primary Key icon on the ribbon.", "Save the table design."],
    accessPath: ["Table", "Design View", "Primary Key"],
    quiz: { question: "What rule applies to a primary key?", options: ["It must be the longest text field", "It must contain unique non-empty values", "It must always be currency", "It must be hidden before printing"], correctIndex: 1, feedback: "Correct. A primary key identifies each record uniquely and cannot be blank." },
    expected: { knowledgeCheck: "mcq_3" },
    points: 10
  }),
  card({
    id: "db-access-text-number-types",
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: "Choose text and number types",
    scenario: "Access data types control how values are stored, sorted, searched, and calculated.",
    supportDocument: ["Use Number or Currency only for values that will be calculated.", "Use Short Text for values with leading zeros or symbols, such as phone numbers or product codes.", "Wrong data types can damage imported data."],
    goal: "Decide when to use Short Text instead of Number.",
    steps: ["Open the table in Design View.", "Find the field that looks numeric but is really an identifier.", "Set identifiers and phone numbers to Short Text.", "Use Number/Currency only for real calculations."],
    accessPath: ["Table", "Design View", "Data Type"],
    quiz: { question: "Why store international phone numbers such as +34600 as Short Text?", options: ["Text automatically fixes spelling", "Number fields can reject + and remove leading zeros", "Text always sorts fastest", "Number fields cannot be indexed"], correctIndex: 1, feedback: "Correct. Phone numbers are identifiers, not calculation values." },
    expected: { knowledgeCheck: "mcq_2" },
    points: 10
  }),
  card({
    id: "db-access-date-currency",
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: "Map Date and Currency fields",
    scenario: "Exam source files may include fields that must be corrected after import.",
    supportDocument: ["Join_Date should use Date/Time.", "Fees or Order_Value should use Currency.", "Use Design View to inspect and correct each field type."],
    goal: "Learn how to cast imported fields to Date/Time and Currency.",
    steps: ["Right-click the table and open Design View.", "Set Join_Date to Date/Time.", "Set Fees to Currency.", "Save the table design before continuing."],
    accessPath: ["Table", "Design View", "Data Type"],
    quiz: { question: "Where do you change Join_Date to Date/Time and Fees to Currency?", options: ["Report Print Preview", "Table Design View", "Navigation Pane only", "Relationship Edit box"], correctIndex: 1, feedback: "Correct. Data types are changed in table Design View." },
    expected: { knowledgeCheck: "mcq_date_currency" },
    points: 10
  }),
  card({
    id: "db-access-relationship",
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: "Create a relationship",
    scenario: "Related tables must be linked so records can be queried and reported together.",
    supportDocument: ["A one-to-many link connects a parent primary key to a child foreign key.", "Example: learners.LearnerID connects to bookings.LearnerID.", "The Relationships window is found under Database Tools."],
    goal: "Learn the Access steps for creating a one-to-many relationship.",
    steps: ["Click Database Tools > Relationships.", "Add both tables to the relationship window.", "Drag the parent primary key to the matching child foreign key.", "Click Create and save the relationship."],
    accessPath: ["Database Tools", "Relationships", "Drag key field", "Create"],
    quiz: { question: "How do you form a standard one-to-many table relationship?", options: ["Connect parent primary key to child foreign key", "Connect two unrelated text labels", "Delete the matching child field", "Export both tables as PDFs"], correctIndex: 0, feedback: "Correct. The parent key links to the matching child foreign key." },
    expected: { knowledgeCheck: "mcq_4" },
    points: 10
  }),
  card({
    id: "db-access-referential-integrity",
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: "Enforce referential integrity",
    scenario: "Referential integrity protects linked tables from orphan child records.",
    supportDocument: ["An orphan record is a child record without a matching parent record.", "Access can enforce this rule in the Edit Relationships dialog.", "This is important for reliable exam query and report output."],
    goal: "Learn how to turn on referential integrity.",
    steps: ["Open Database Tools > Relationships.", "Double-click the relationship line.", "Tick Enforce Referential Integrity.", "Click OK and save the relationship layout."],
    accessPath: ["Database Tools", "Relationships", "Edit Relationships", "Enforce Referential Integrity"],
    quiz: { question: "What does Enforce Referential Integrity prevent?", options: ["Using more than one index", "Orphan child records without a matching parent key", "Printing landscape reports", "Using text criteria"], correctIndex: 1, feedback: "Correct. It stops child records that do not match a parent key." },
    expected: { knowledgeCheck: "mcq_11" },
    points: 10
  }),
  card({
    id: "db-access-validation-rule",
    moduleId: "import-design",
    moduleTitle: "Import and Table Design",
    title: "Use a validation rule",
    scenario: "Validation rules stop invalid values entering a table field.",
    supportDocument: ["Use validation rules for allowed ranges, such as scores from 0 to 50.", "The rule is set in field properties in Design View.", "A clear validation text helps users understand mistakes."],
    goal: "Recognise the correct validation rule for a numeric range.",
    steps: ["Open the table in Design View.", "Select the numeric field.", "Use the Validation Rule property.", "Enter a rule such as >=0 AND <=50."],
    accessPath: ["Table", "Design View", "Field Properties", "Validation Rule"],
    quiz: { question: "Which rule restricts a numeric score field from 0 to 50 inclusive?", options: ["0 OR 50", ">=0 AND <=50", "Between and", "Limit(0, 50)"], correctIndex: 1, feedback: "Correct. The two comparisons define the lower and upper boundaries." },
    expected: { knowledgeCheck: "mcq_16" },
    points: 10
  }),
  card({
    id: "db-access-and-criteria",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Use AND criteria",
    scenario: "An Access query can require more than one condition to be true.",
    supportDocument: ["Criteria on the same horizontal row are treated as AND.", "Example: Country = Spain and Value > 500.", "Use Query Design to place criteria under the correct fields."],
    goal: "Learn how AND criteria are arranged in Access Query Design.",
    steps: ["Click Create > Query Design.", "Add the required table.", "Type Spain under Country and >500 under Value on the same Criteria row.", "Click Run to view matching records."],
    accessPath: ["Create", "Query Design", "Criteria row", "Run"],
    quiz: { question: "How do you specify an AND condition in an Access query grid?", options: ["Type AND in the field name", "Place criteria on different rows", "Place criteria on the same horizontal row", "Use the report footer"], correctIndex: 2, feedback: "Correct. Same-row criteria are processed as AND." },
    expected: { knowledgeCheck: "mcq_5" },
    points: 10
  }),
  card({
    id: "db-access-or-criteria",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Use OR criteria",
    scenario: "Some tasks ask for records matching one condition or another.",
    supportDocument: ["Alternative criteria go on separate vertical rows.", "Example: City is Madrid OR Barcelona.", "Use the Criteria row and the Or row in Query Design."],
    goal: "Learn how OR criteria are arranged in Access Query Design.",
    steps: ["Open Query Design.", "Under City, type Madrid on the Criteria row.", "Type Barcelona on the Or row underneath.", "Run the query and check both cities are included."],
    accessPath: ["Create", "Query Design", "Criteria row", "Or row"],
    quiz: { question: "How are OR conditions structured in an Access query?", options: ["Separated by a comma on one line", "Placed on separate vertical rows", "Typed into the table title", "Only possible in reports"], correctIndex: 1, feedback: "Correct. Separate criteria rows create OR logic." },
    expected: { knowledgeCheck: "mcq_12" },
    points: 10
  }),
  card({
    id: "db-access-wildcard",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Use a wildcard search",
    scenario: "Wildcard searches find text that starts, ends, or contains a pattern.",
    supportDocument: ["Use Like with an asterisk wildcard for unknown text.", "Like \"C*\" finds values starting with C.", "Like \"*club*\" finds values containing club."],
    goal: "Recognise the correct wildcard criterion.",
    steps: ["Open the query in Design View.", "Find the text field in the grid.", "Type Like \"C*\" in the Criteria row.", "Run the query to show matching records."],
    accessPath: ["Query Design", "Criteria", "Like", "Run"],
    quiz: { question: "Which criterion extracts items starting with S followed by any text?", options: ["= S?", "Like S*", "Like \"S*\"", "== [S]"], correctIndex: 2, feedback: "Correct. The quoted asterisk wildcard matches any following characters." },
    expected: { knowledgeCheck: "mcq_6" },
    points: 10
  }),
  card({
    id: "db-access-calculated-field",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Create a calculated field",
    scenario: "Access queries can calculate new values from existing fields.",
    supportDocument: ["Calculated fields use a field name, colon, then expression.", "Example: Total_Cost: [Units] * [Price]", "Square brackets identify existing field names."],
    goal: "Learn the syntax for a calculated field.",
    steps: ["Open Query Design.", "Click an empty Field cell in the query grid.", "Type Total_Cost: [Units] * [Price].", "Run the query and format the result as Currency if required."],
    accessPath: ["Query Design", "Field cell", "Expression", "Run"],
    quiz: { question: "What is the correct syntax for a custom calculated query field?", options: ["FieldName = [A] * [B]", "FieldName: [A] * [B]", "[A] * [B] AS FieldName", "Calculate(FieldName, [A]*[B])"], correctIndex: 1, feedback: "Correct. Access uses an alias, colon, then expression." },
    expected: { knowledgeCheck: "mcq_7" },
    points: 10
  }),
  card({
    id: "db-access-date-math",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Calculate elapsed days",
    scenario: "Date calculations can be used to find time elapsed between two fields.",
    supportDocument: ["Subtracting one Date/Time field from another returns elapsed days.", "Example: Days_Active: [End_Date] - [Start_Date]", "The result can be used in query output or reports."],
    goal: "Understand how Access handles date subtraction.",
    steps: ["Open Query Design.", "Add a new calculated field.", "Type Days_Active: [End_Date] - [Start_Date].", "Run the query and check the result is a number of days."],
    accessPath: ["Query Design", "Calculated field", "Date fields", "Run"],
    quiz: { question: "What value type results from subtracting two Date/Time fields?", options: ["A second date text string", "An integer representing elapsed days", "A currency value", "A relationship error"], correctIndex: 1, feedback: "Correct. Access returns the number of days between the dates." },
    expected: { knowledgeCheck: "mcq_13" },
    points: 10
  }),
  card({
    id: "db-access-parameter-query",
    moduleId: "queries",
    moduleTitle: "Queries and Sorting",
    title: "Use a parameter prompt",
    scenario: "Parameter queries ask the user for a value when the query runs.",
    supportDocument: ["Square brackets can create a prompt.", "Example: [Enter Value Here:] in the Criteria row.", "The prompt text should tell the user what to type."],
    goal: "Recognise Access parameter prompt syntax.",
    steps: ["Open Query Design.", "Choose the field to filter.", "In Criteria, type a prompt in square brackets.", "Run the query and enter the requested value."],
    accessPath: ["Query Design", "Criteria", "Square brackets", "Run"],
    quiz: { question: "Which syntax creates an Access runtime criteria prompt?", options: ["Prompt: \"Enter Value\"", "[Enter Value Here:]", "(Enter Value Here)", "Criteria.Request(Value)"], correctIndex: 1, feedback: "Correct. Text inside square brackets becomes a parameter prompt." },
    expected: { knowledgeCheck: "mcq_18" },
    points: 10
  }),
  card({
    id: "db-access-multi-sort",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Apply multi-level sorting",
    scenario: "Reports often need more than one sort level before printing.",
    supportDocument: ["Use the Group, Sort, and Total pane in Report Design/Layout tools.", "Example: Last_Name ascending, Date descending.", "Sort order affects how printed records are grouped and read."],
    goal: "Learn where multi-level report sorting is configured.",
    steps: ["Open the report in Design View or Layout View.", "Open Group, Sort, and Total.", "Add Last_Name as Ascending.", "Add Date as Descending below it."],
    accessPath: ["Report Design", "Group, Sort, and Total", "Ascending", "Descending"],
    quiz: { question: "Where are multi-level report sorts configured?", options: ["Inside table validation properties", "Inside the Group, Sort, and Total pane", "Inside macro click triggers", "Inside Page Setup margins"], correctIndex: 1, feedback: "Correct. Report sorting is controlled in the report design tools." },
    expected: { knowledgeCheck: "mcq_8" },
    points: 10
  }),
  card({
    id: "db-access-report-sum",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Add a report footer total",
    scenario: "A printed Access report may need a total or summary at the bottom.",
    supportDocument: ["Use a text box in the Report Footer section.", "Summary expressions begin with equals.", "Example: =Sum([Order_Value])"],
    goal: "Recognise the correct footer aggregate expression.",
    steps: ["Open the report in Design View.", "Add a text box in the Report Footer.", "Set the Control Source to =Sum([Order_Value]).", "Preview the report output."],
    accessPath: ["Report Design", "Report Footer", "Text Box", "Control Source"],
    quiz: { question: "Which expression displays a complete report total?", options: ["Sum([Value])", "=Sum([Value])", "Total: Sum(Value)", "=Total(Value)"], correctIndex: 1, feedback: "Correct. Report calculation expressions begin with equals." },
    expected: { knowledgeCheck: "mcq_9" },
    points: 10
  }),
  card({
    id: "db-access-landscape-fit",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Fix landscape report output",
    scenario: "A report must print clearly without clipped values or hash marks.",
    supportDocument: ["Use Print Preview to check orientation and width.", "Choose Landscape for wide reports.", "If values show ###, widen the control or column in Layout View."],
    goal: "Learn how to fix a wide report before printing.",
    steps: ["Open Print Preview and choose Landscape.", "Switch to Layout View if data is clipped.", "Resize narrow columns or controls.", "Preview again and confirm no ### symbols remain."],
    accessPath: ["Print Preview", "Landscape", "Layout View", "Resize columns"],
    quiz: { question: "What do ### symbols usually mean on a printed Access report?", options: ["A broken relationship", "A value is truncated because the control is too narrow", "Missing primary data rows", "Invalid import format"], correctIndex: 1, feedback: "Correct. Widen the field/control so the value can display." },
    expected: { knowledgeCheck: "mcq_10" },
    points: 10
  }),
  card({
    id: "db-access-report-group",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Group report data",
    scenario: "Grouping makes long reports easier to read by separating records under headings.",
    supportDocument: ["Report grouping is normally set in the Report Wizard or design grouping tools.", "Example: group records by Department first.", "Grouped output should show records under each group heading."],
    goal: "Learn how to create a report grouping level.",
    steps: ["Start the Report Wizard or open Report Design.", "Choose the field to group by, such as Department.", "Add it as a grouping level.", "Complete the report and preview the grouped output."],
    accessPath: ["Report Wizard", "Grouping Levels", "Department", "Preview"],
    quiz: { question: "What happens when a field is used as a report grouping level?", options: ["The field is hidden from the report", "Matching records appear under separate group headings", "The table field becomes a button", "The database exports automatically"], correctIndex: 1, feedback: "Correct. Grouping organises matching records under group headers." },
    expected: { knowledgeCheck: "mcq_14" },
    points: 10
  }),
  card({
    id: "db-access-field-visibility",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Hide fields in final reports",
    scenario: "Some system ID fields are needed for relationships but should not appear in the final printed report.",
    supportDocument: ["Do not delete fields from the source table just to hide them on a report.", "Use the selected control's Format properties.", "Set Visible to No for fields that should not print."],
    goal: "Learn the safe way to hide an ID field in a report.",
    steps: ["Open the report in Design View.", "Select the ID field control.", "Open Property Sheet > Format.", "Set Visible to No and preview the report."],
    accessPath: ["Report Design", "Property Sheet", "Format", "Visible: No"],
    quiz: { question: "How can you hide an ID field in a final report without deleting source data?", options: ["Delete the field from the table", "Set the report control Visible property to No", "Change the text to white", "Put the field in criteria brackets"], correctIndex: 1, feedback: "Correct. The report control can be hidden while source data remains intact." },
    expected: { knowledgeCheck: "mcq_15" },
    points: 10
  }),
  card({
    id: "db-access-export-rtf",
    moduleId: "reports-labels",
    moduleTitle: "Reports, Labels and Print",
    title: "Export report evidence",
    scenario: "Some database tasks ask for report output that can be opened in a word processor.",
    supportDocument: ["Rich Text Format can preserve report structures for word processing.", "PDF is useful for fixed final output.", "Choose the export type required by the exam instruction."],
    goal: "Recognise the report export format for word processing.",
    steps: ["Open the report output.", "Choose External Data or Export options.", "Select the required output format.", "Save the exported evidence file."],
    accessPath: ["Report", "External Data", "Export", "RTF/PDF"],
    quiz: { question: "Which format preserves report structure for word processing programs?", options: [".exe", ".rtf", ".sys", ".wav"], correctIndex: 1, feedback: "Correct. RTF is the Rich Text Format used by word processors." },
    expected: { knowledgeCheck: "mcq_19" },
    points: 10
  }),
  card({
    id: "db-access-final-mixed",
    moduleId: "exam-build",
    moduleTitle: "Exam Database Build",
    title: "Final mixed Access process check",
    scenario: "A final exam-style database task combines import, design, relationships, queries, reports, print settings, and evidence.",
    supportDocument: ["Sequence: import source files, check field types, set keys, create relationships, build queries, prepare reports, print/export evidence.", "Use the question wording to decide whether you need Query Design, Report Design, Print Preview, or Relationships."],
    goal: "Choose the correct first Access area for a relationship task.",
    steps: ["Read the exam instruction carefully.", "Identify whether the task is about source data, query criteria, report output, or relationships.", "Choose the Access ribbon area that matches the task.", "Use the MCQ to confirm the correct process."],
    accessPath: ["Read instruction", "Identify task type", "Choose Access area", "Complete evidence"],
    quiz: { question: "An exam asks you to link Customer_ID in Customers to Customer_ID in Orders. Where should you go first?", options: ["Print Preview", "Database Tools > Relationships", "Report Footer", "External Data > PDF"], correctIndex: 1, feedback: "Correct. Table links are created from the Relationships window." },
    expected: { knowledgeCheck: "mcq_final_relationship" },
    teacherReview: ["Teacher can still check actual Microsoft Access screenshots, printouts, report layout, and exported evidence."],
    points: 20
  }),
  card({
    id: "db-free-practice",
    moduleId: "free-practice",
    moduleTitle: "Free Practice",
    title: "Free Practice workspace",
    scenario: "Use the database workspace to try imports, fields, queries, report previews, labels, and printing without a guided lock.",
    supportDocument: support,
    goal: "Practise database workspace tools freely.",
    steps: ["Import an Apex source table or your own CSV.", "Try field design, query, report, form, and labels panels.", "Use the Print button on report, form, or label views for evidence."],
    expected: {},
    points: 0
  })
];

const allCards = knowledgeCards;

export function getDatabaseModule(moduleId?: string) {
  return databaseModules.find((module) => module.id === moduleId);
}

export function getDatabaseCardsForModule(moduleId?: string) {
  return allCards.filter((card) => !moduleId || card.moduleId === moduleId);
}
