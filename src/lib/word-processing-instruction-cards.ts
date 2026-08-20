export type WordProcessingModule = {
  id: string;
  title: string;
  description: string;
};

export type WordProcessingExpectedResult = {
  textIncludes?: string[];
  boldText?: string[];
  italicText?: string[];
  underlineText?: string[];
  alignments?: Array<{ text: string; value: "left" | "center" | "right" | "justify" }>;
  unorderedListItems?: string[];
  orderedListItems?: string[];
  table?: {
    headers?: string[];
    minRows?: number;
    minColumns?: number;
    sortedFirstColumn?: string[];
  };
};

export type WordProcessingInstructionCard = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  category: string;
  title: string;
  scenario: string;
  supportDocument: string[];
  goal: string;
  steps: string[];
  starterHtml: string;
  expected: WordProcessingExpectedResult;
  points: number;
};

export const wordProcessingModules: WordProcessingModule[] = [
  {
    id: "intro",
    title: "Document Basics",
    description: "Open a support document, enter original text, recognise paragraphs, and build simple document structure."
  },
  {
    id: "text-formatting",
    title: "Text Formatting",
    description: "Apply bold, italic, underline, headings, font emphasis, and clean title formatting."
  },
  {
    id: "paragraph-layout",
    title: "Paragraph Layout",
    description: "Practise alignment, justification, paragraph organisation, spacing decisions, and clear layout."
  },
  {
    id: "lists",
    title: "Lists",
    description: "Create bullet lists and numbered lists from support document instructions."
  },
  {
    id: "tables",
    title: "Tables",
    description: "Insert tables, enter data, format headings, and sort table information."
  },
  {
    id: "exam-editing",
    title: "Exam Editing",
    description: "Combine support text, formatting, lists, tables, and proofreading in short practical tasks."
  }
];

const blankDocument = `<p></p>`;

const clubNotice = [
  "Support document: School Activity Notice",
  "After-school clubs restart on Monday.",
  "Students should bring the correct kit.",
  "The notice must look formal enough for parents."
];

const libraryText = [
  "Support document: Library Update",
  "The library opens at 08:15 each morning.",
  "Students may borrow two books at a time.",
  "Quiet study is available during lunch."
];

const tableStarter = `
  <p>Activity register</p>
  <table>
    <tbody>
      <tr><td>Club</td><td>Teacher</td><td>Room</td></tr>
      <tr><td>Robotics</td><td>Mr Ade</td><td>ICT 2</td></tr>
      <tr><td>Art</td><td>Ms Green</td><td>A4</td></tr>
      <tr><td>Drama</td><td>Mrs Cole</td><td>Hall</td></tr>
    </tbody>
  </table>
`;

export const wordProcessingInstructionCards: WordProcessingInstructionCard[] = [
  {
    id: "wp-intro-title",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "intro",
    title: "Create the document title",
    scenario: "The school office needs a short parent notice prepared from the support document.",
    supportDocument: clubNotice,
    goal: "Type the title School Activity Notice at the top of the document.",
    steps: ["Click inside the blank document.", "Type School Activity Notice.", "Press Enter to start the next paragraph."],
    starterHtml: blankDocument,
    expected: { textIncludes: ["School Activity Notice"] },
    points: 10
  },
  {
    id: "wp-intro-copy-sentence",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "intro",
    title: "Enter a sentence from the support document",
    scenario: "A parent notice must include the opening sentence exactly.",
    supportDocument: clubNotice,
    goal: "Enter the first information sentence below the title.",
    steps: ["Click below the title.", "Type After-school clubs restart on Monday.", "Check the spelling and hyphen."],
    starterHtml: `<h2>School Activity Notice</h2><p></p>`,
    expected: { textIncludes: ["After-school clubs restart on Monday."] },
    points: 10
  },
  {
    id: "wp-intro-new-paragraph",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "intro",
    title: "Create separate paragraphs",
    scenario: "The notice should be easy to read, so each instruction needs its own paragraph.",
    supportDocument: clubNotice,
    goal: "Place two information sentences in separate paragraphs.",
    steps: ["Type After-school clubs restart on Monday.", "Press Enter.", "Type Students should bring the correct kit."],
    starterHtml: `<h2>School Activity Notice</h2><p></p>`,
    expected: { textIncludes: ["After-school clubs restart on Monday.", "Students should bring the correct kit."] },
    points: 10
  },
  {
    id: "wp-intro-library-title",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "intro",
    title: "Prepare a library update",
    scenario: "The librarian wants a short document created from the support information.",
    supportDocument: libraryText,
    goal: "Type the heading Library Update.",
    steps: ["Click at the start of the document.", "Type Library Update.", "Press Enter so the next text begins below it."],
    starterHtml: blankDocument,
    expected: { textIncludes: ["Library Update"] },
    points: 10
  },
  {
    id: "wp-intro-complete-notice",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "intro",
    title: "Build a short notice",
    scenario: "A teacher has asked for a short complete notice using three lines of source text.",
    supportDocument: clubNotice,
    goal: "Enter the title and both instruction sentences.",
    steps: ["Type School Activity Notice.", "On the next line, type After-school clubs restart on Monday.", "On the next line, type Students should bring the correct kit."],
    starterHtml: blankDocument,
    expected: { textIncludes: ["School Activity Notice", "After-school clubs restart on Monday.", "Students should bring the correct kit."] },
    points: 15
  },
  {
    id: "wp-format-bold-title",
    moduleId: "text-formatting",
    moduleTitle: "Text Formatting",
    category: "format",
    title: "Make the title bold",
    scenario: "The title must stand out from the rest of the notice.",
    supportDocument: clubNotice,
    goal: "Apply bold formatting to School Activity Notice.",
    steps: ["Select the title School Activity Notice.", "Click the B button on the toolbar.", "Check only the title is bold."],
    starterHtml: `<p>School Activity Notice</p><p>After-school clubs restart on Monday.</p>`,
    expected: { boldText: ["School Activity Notice"] },
    points: 15
  },
  {
    id: "wp-format-italic-note",
    moduleId: "text-formatting",
    moduleTitle: "Text Formatting",
    category: "format",
    title: "Italicise a note",
    scenario: "A small reminder needs to be shown as a note.",
    supportDocument: ["Support document: PE Reminder", "Reminder: bring trainers.", "The note should be less dominant than the main message."],
    goal: "Apply italic formatting to Reminder: bring trainers.",
    steps: ["Select Reminder: bring trainers.", "Click the I button on the toolbar.", "Leave the heading unchanged."],
    starterHtml: `<p>PE Club Notice</p><p>Reminder: bring trainers.</p>`,
    expected: { italicText: ["Reminder: bring trainers."] },
    points: 15
  },
  {
    id: "wp-format-underline-deadline",
    moduleId: "text-formatting",
    moduleTitle: "Text Formatting",
    category: "format",
    title: "Underline the deadline",
    scenario: "The deadline must be easy for parents to notice.",
    supportDocument: ["Support document: Consent Form", "Return forms by Friday.", "The deadline should be underlined."],
    goal: "Underline Return forms by Friday.",
    steps: ["Select Return forms by Friday.", "Click the underline button on the toolbar.", "Check the rest of the text is not underlined."],
    starterHtml: `<p>Consent Form</p><p>Return forms by Friday.</p>`,
    expected: { underlineText: ["Return forms by Friday."] },
    points: 15
  },
  {
    id: "wp-format-heading",
    moduleId: "text-formatting",
    moduleTitle: "Text Formatting",
    category: "format",
    title: "Apply heading style",
    scenario: "A report needs a clear heading before the body text.",
    supportDocument: libraryText,
    goal: "Change Library Update into a heading.",
    steps: ["Select Library Update.", "Choose Heading 1 from the toolbar.", "Check the title is larger than the paragraph text."],
    starterHtml: `<p>Library Update</p><p>The library opens at 08:15 each morning.</p>`,
    expected: { textIncludes: ["Library Update"], boldText: ["Library Update"] },
    points: 15
  },
  {
    id: "wp-layout-center-title",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Centre the title",
    scenario: "The document title should be centred across the top of the page.",
    supportDocument: clubNotice,
    goal: "Centre align the title School Activity Notice.",
    steps: ["Click inside the title line.", "Click the centre align button.", "Check the title sits in the middle of the document area."],
    starterHtml: `<p><strong>School Activity Notice</strong></p><p>After-school clubs restart on Monday.</p>`,
    expected: { alignments: [{ text: "School Activity Notice", value: "center" }] },
    points: 15
  },
  {
    id: "wp-layout-justify-paragraph",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Justify the body text",
    scenario: "A formal information sheet should have body text aligned neatly on both sides.",
    supportDocument: ["Support document: Information Sheet", "The sports hall will be used for practice after school. Students must arrive on time and bring the correct kit."],
    goal: "Justify the body paragraph.",
    steps: ["Click inside the long body paragraph.", "Click the justify button on the toolbar.", "Check the paragraph edges look even on both sides."],
    starterHtml: `<h2>Sports Hall Practice</h2><p>The sports hall will be used for practice after school. Students must arrive on time and bring the correct kit.</p>`,
    expected: { alignments: [{ text: "The sports hall will be used", value: "justify" }] },
    points: 15
  },
  {
    id: "wp-layout-right-reference",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Right align a reference",
    scenario: "The document reference should appear on the right like an office document.",
    supportDocument: ["Support document: Office Memo", "Reference: PE/24", "The reference should be right aligned."],
    goal: "Right align Reference: PE/24.",
    steps: ["Click inside Reference: PE/24.", "Click the right align button.", "Check it moves to the right side of the document."],
    starterHtml: `<p>Reference: PE/24</p><p>Sports day arrangements</p>`,
    expected: { alignments: [{ text: "Reference: PE/24", value: "right" }] },
    points: 15
  },
  {
    id: "wp-list-bullets",
    moduleId: "lists",
    moduleTitle: "Lists",
    category: "list",
    title: "Create a bullet list",
    scenario: "The teacher wants equipment listed clearly for students.",
    supportDocument: ["Support document: Equipment", "Bring: trainers, water bottle, notebook."],
    goal: "Create a bullet list with Trainers, Water bottle, and Notebook.",
    steps: ["Type Trainers, Water bottle, and Notebook on separate lines.", "Select the three lines.", "Click the bullet list button."],
    starterHtml: `<p>Equipment needed</p><p>Trainers</p><p>Water bottle</p><p>Notebook</p>`,
    expected: { unorderedListItems: ["Trainers", "Water bottle", "Notebook"] },
    points: 15
  },
  {
    id: "wp-list-numbered",
    moduleId: "lists",
    moduleTitle: "Lists",
    category: "list",
    title: "Create numbered instructions",
    scenario: "A help sheet must show steps in the correct order.",
    supportDocument: ["Support document: Login Steps", "Open the portal. Enter your username. Click Sign in."],
    goal: "Create a numbered list for the three login steps.",
    steps: ["Put each login instruction on a separate line.", "Select the three lines.", "Click the numbered list button."],
    starterHtml: `<p>Open the portal</p><p>Enter your username</p><p>Click Sign in</p>`,
    expected: { orderedListItems: ["Open the portal", "Enter your username", "Click Sign in"] },
    points: 15
  },
  {
    id: "wp-table-insert",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Insert a simple table",
    scenario: "A club register needs to be arranged in rows and columns.",
    supportDocument: ["Support document: Club Register", "Columns needed: Club, Teacher, Room."],
    goal: "Insert a table with the headings Club, Teacher, and Room.",
    steps: ["Click in the document.", "Click the table button.", "Replace the first row with Club, Teacher, and Room."],
    starterHtml: `<p>Club register</p>`,
    expected: { table: { headers: ["Club", "Teacher", "Room"], minRows: 2, minColumns: 3 } },
    points: 20
  },
  {
    id: "wp-table-bold-headings",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Bold the table headings",
    scenario: "The register headings should stand out clearly from the data.",
    supportDocument: ["Support document: Club Register", "Bold the heading row only."],
    goal: "Apply bold formatting to Club, Teacher, and Room in the table heading row.",
    steps: ["Select the first row of the table.", "Click the B button.", "Check the data rows are still normal text."],
    starterHtml: tableStarter,
    expected: { table: { headers: ["Club", "Teacher", "Room"], minRows: 4, minColumns: 3 }, boldText: ["Club", "Teacher", "Room"] },
    points: 20
  },
  {
    id: "wp-table-sort",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Sort a table alphabetically",
    scenario: "The activity register must be sorted by club name before it is printed.",
    supportDocument: ["Support document: Activity Register", "Sort the club names in ascending alphabetical order."],
    goal: "Sort the table so the first column reads Art, Drama, Robotics.",
    steps: ["Click inside the table.", "Click Sort A-Z on the toolbar.", "Check the club names are in alphabetical order."],
    starterHtml: tableStarter,
    expected: { table: { headers: ["Club", "Teacher", "Room"], sortedFirstColumn: ["Art", "Drama", "Robotics"] } },
    points: 20
  },
  {
    id: "wp-exam-combined-notice",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Format a parent notice",
    scenario: "This is a short exam-style task using a support document and several formatting instructions.",
    supportDocument: clubNotice,
    goal: "Create a formal parent notice with a centred bold title and justified body text.",
    steps: ["Make School Activity Notice bold and centred.", "Enter both support sentences below the title.", "Justify the body paragraph."],
    starterHtml: `<p>School Activity Notice</p><p>After-school clubs restart on Monday. Students should bring the correct kit.</p>`,
    expected: {
      textIncludes: ["After-school clubs restart on Monday.", "Students should bring the correct kit."],
      boldText: ["School Activity Notice"],
      alignments: [
        { text: "School Activity Notice", value: "center" },
        { text: "After-school clubs restart", value: "justify" }
      ]
    },
    points: 25
  }
];

const generatedFormattingTasks: WordProcessingInstructionCard[] = [
  ["wp-format-bold-library", "Library Update", "Make the library heading bold.", `<p>Library Update</p><p>The library opens at 08:15 each morning.</p>`, "bold"],
  ["wp-format-bold-consent", "Consent Form Reminder", "Make the consent form heading bold.", `<p>Consent Form Reminder</p><p>Return forms by Friday.</p>`, "bold"],
  ["wp-format-italic-quiet", "Quiet study is available during lunch.", "Italicise the quiet study sentence.", `<p>Library Update</p><p>Quiet study is available during lunch.</p>`, "italic"],
  ["wp-format-underline-books", "Students may borrow two books at a time.", "Underline the borrowing rule.", `<p>Library Update</p><p>Students may borrow two books at a time.</p>`, "underline"]
].map(([id, text, goal, starterHtml, kind]) => ({
  id,
  moduleId: "text-formatting",
  moduleTitle: "Text Formatting",
  category: "format",
  title: goal,
  scenario: "Use the support document and apply the requested text emphasis only to the target text.",
  supportDocument: libraryText,
  goal,
  steps: [`Select ${text}.`, `Click the ${kind === "bold" ? "B" : kind === "italic" ? "I" : "underline"} button.`, "Check the target text has the correct emphasis."],
  starterHtml,
  expected: kind === "bold" ? { boldText: [text] } : kind === "italic" ? { italicText: [text] } : { underlineText: [text] },
  points: 15
} as WordProcessingInstructionCard));

const generatedIntroTasks: WordProcessingInstructionCard[] = [
  ["wp-intro-type-opening-hours", "Library opening hours", "Type the library opening sentence.", "The library opens at 08:15 each morning."],
  ["wp-intro-type-borrowing-rule", "Library borrowing rule", "Type the borrowing rule exactly.", "Students may borrow two books at a time."],
  ["wp-intro-type-quiet-study", "Quiet study note", "Type the quiet study sentence.", "Quiet study is available during lunch."],
  ["wp-intro-type-consent", "Consent reminder", "Type the consent reminder.", "Return forms by Friday."],
  ["wp-intro-type-reference", "Document reference", "Type the document reference.", "Reference: PE/24"]
].map(([id, title, goal, text]) => ({
  id,
  moduleId: "intro",
  moduleTitle: "Document Basics",
  category: "intro",
  title,
  scenario: "A short support document has been provided. Copy the required sentence accurately into the document.",
  supportDocument: libraryText,
  goal,
  steps: ["Click inside the document.", `Type ${text}`, "Check the capital letters and punctuation."],
  starterHtml: blankDocument,
  expected: { textIncludes: [text] },
  points: 10
} as WordProcessingInstructionCard));

const generatedLayoutTasks: WordProcessingInstructionCard[] = [
  ["wp-layout-center-library", "Library Update", "Centre the library title.", "center"],
  ["wp-layout-right-date", "Date: 12 March", "Right align the date.", "right"],
  ["wp-layout-justify-library", "Students may borrow two books at a time.", "Justify the borrowing rule paragraph.", "justify"],
  ["wp-layout-center-equipment", "Equipment needed", "Centre the equipment heading.", "center"]
].map(([id, text, goal, value]) => ({
  id,
  moduleId: "paragraph-layout",
  moduleTitle: "Paragraph Layout",
  category: "layout",
  title: goal,
  scenario: "Practise placing text correctly on the page before printing.",
  supportDocument: libraryText,
  goal,
  steps: [`Click inside ${text}.`, `Click the ${value} alignment button.`, "Check the line is positioned correctly."],
  starterHtml: `<p>${text}</p><p>The library opens at 08:15 each morning.</p>`,
  expected: { alignments: [{ text, value: value as "center" | "right" | "justify" }] },
  points: 15
} as WordProcessingInstructionCard));

const generatedListTasks: WordProcessingInstructionCard[] = [
  ["wp-list-clubs", "Clubs available", ["Drama", "Robotics", "Coding"], "unordered"],
  ["wp-list-rules", "Library rules", ["Arrive quietly", "Choose a book", "Return books on time"], "ordered"],
  ["wp-list-equipment-extra", "Trip equipment", ["Lunch", "Water", "Notebook"], "unordered"],
  ["wp-list-login-extra", "Portal steps", ["Open the website", "Enter details", "Submit"], "ordered"]
].map(([id, title, items, listType]) => ({
  id,
  moduleId: "lists",
  moduleTitle: "Lists",
  category: "list",
  title: `Create ${listType === "ordered" ? "a numbered" : "a bullet"} list`,
  scenario: "The support document contains items that must be presented as a clear list.",
  supportDocument: [`Support document: ${title}`, ...(items as string[])],
  goal: `Turn the ${title.toString().toLowerCase()} items into ${listType === "ordered" ? "a numbered list" : "a bullet list"}.`,
  steps: ["Put each item on its own line.", "Select all the item lines.", `Click the ${listType === "ordered" ? "numbered" : "bullet"} list button.`],
  starterHtml: `<p>${title}</p>${(items as string[]).map((item) => `<p>${item}</p>`).join("")}`,
  expected: listType === "ordered" ? { orderedListItems: items as string[] } : { unorderedListItems: items as string[] },
  points: 15
} as WordProcessingInstructionCard));

const generatedTableTasks: WordProcessingInstructionCard[] = [
  {
    id: "wp-table-add-art-room",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Complete a table row",
    scenario: "The activity register has one missing detail from the support document.",
    supportDocument: ["Support document: Activity Register", "Art club uses room A4."],
    goal: "Make sure the table contains Art, Ms Green, and A4.",
    steps: ["Click in the Art row.", "Check the teacher is Ms Green.", "Enter A4 in the room cell if it is missing."],
    starterHtml: tableStarter,
    expected: { textIncludes: ["Art", "Ms Green", "A4"], table: { headers: ["Club", "Teacher", "Room"], minRows: 4, minColumns: 3 } },
    points: 15
  },
  {
    id: "wp-table-add-coding-row",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Add a new table record",
    scenario: "A new club has been approved and must be included in the register.",
    supportDocument: ["Support document: New club", "Club: Coding", "Teacher: Ms Khan", "Room: ICT 1"],
    goal: "Add Coding, Ms Khan, and ICT 1 to the table.",
    steps: ["Click in an empty row or insert a row.", "Enter Coding in the first column.", "Enter Ms Khan and ICT 1 in the next columns."],
    starterHtml: tableStarter,
    expected: { textIncludes: ["Coding", "Ms Khan", "ICT 1"], table: { headers: ["Club", "Teacher", "Room"], minRows: 5, minColumns: 3 } },
    points: 20
  },
  {
    id: "wp-table-sort-expanded",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title: "Sort an expanded table",
    scenario: "The register must be sorted after a new club has been added.",
    supportDocument: ["Support document: Activity Register", "Sort the club names into ascending order."],
    goal: "Sort the first column so the table begins Art, Coding, Drama, Robotics.",
    steps: ["Add Coding, Ms Khan, and ICT 1 if it is missing.", "Click inside the table.", "Click Sort A-Z."],
    starterHtml: `
      <p>Activity register</p>
      <table>
        <tbody>
          <tr><td>Club</td><td>Teacher</td><td>Room</td></tr>
          <tr><td>Robotics</td><td>Mr Ade</td><td>ICT 2</td></tr>
          <tr><td>Art</td><td>Ms Green</td><td>A4</td></tr>
          <tr><td>Coding</td><td>Ms Khan</td><td>ICT 1</td></tr>
          <tr><td>Drama</td><td>Mrs Cole</td><td>Hall</td></tr>
        </tbody>
      </table>
    `,
    expected: { table: { headers: ["Club", "Teacher", "Room"], sortedFirstColumn: ["Art", "Coding", "Drama", "Robotics"] } },
    points: 20
  }
];

const generatedExamEditingTasks: WordProcessingInstructionCard[] = [
  {
    id: "wp-exam-library-update",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Format a library update",
    scenario: "Prepare a short information sheet from the support document.",
    supportDocument: libraryText,
    goal: "Create a centred bold title and include the two library rules.",
    steps: ["Make Library Update bold and centred.", "Enter the opening time sentence.", "Enter the borrowing rule sentence."],
    starterHtml: `<p>Library Update</p><p>The library opens at 08:15 each morning.</p><p>Students may borrow two books at a time.</p>`,
    expected: {
      textIncludes: ["The library opens at 08:15 each morning.", "Students may borrow two books at a time."],
      boldText: ["Library Update"],
      alignments: [{ text: "Library Update", value: "center" }]
    },
    points: 25
  },
  {
    id: "wp-exam-equipment-list",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Create a formatted equipment list",
    scenario: "A trip organiser wants a short handout with a clear list.",
    supportDocument: ["Support document: Trip Handout", "Title: Trip Equipment", "Items: Lunch, Water, Notebook"],
    goal: "Make the title bold and turn Lunch, Water, and Notebook into a bullet list.",
    steps: ["Make Trip Equipment bold.", "Put Lunch, Water, and Notebook on separate lines.", "Select the item lines and click the bullet list button."],
    starterHtml: `<p>Trip Equipment</p><p>Lunch</p><p>Water</p><p>Notebook</p>`,
    expected: { boldText: ["Trip Equipment"], unorderedListItems: ["Lunch", "Water", "Notebook"] },
    points: 25
  },
  {
    id: "wp-exam-table-register",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Prepare a sorted register",
    scenario: "A short register must be formatted and sorted before printing.",
    supportDocument: ["Support document: Activity Register", "Sort clubs alphabetically.", "Make table headings bold."],
    goal: "Sort the club table and make Club, Teacher, and Room bold.",
    steps: ["Select the table heading row and click B.", "Click inside the table.", "Click Sort A-Z."],
    starterHtml: tableStarter,
    expected: {
      boldText: ["Club", "Teacher", "Room"],
      table: { headers: ["Club", "Teacher", "Room"], sortedFirstColumn: ["Art", "Drama", "Robotics"] }
    },
    points: 25
  }
];

export const allWordProcessingInstructionCards = [
  ...wordProcessingInstructionCards,
  ...generatedIntroTasks,
  ...generatedFormattingTasks,
  ...generatedLayoutTasks,
  ...generatedListTasks,
  ...generatedTableTasks,
  ...generatedExamEditingTasks
];

const moduleOrder = new Map(wordProcessingModules.map((module, index) => [module.id, index]));

export function getWordProcessingModule(moduleId?: string) {
  return wordProcessingModules.find((module) => module.id === moduleId);
}

export function getWordProcessingCardsForModule(moduleId?: string) {
  return allWordProcessingInstructionCards
    .filter((card) => !moduleId || card.moduleId === moduleId)
    .sort((first, second) => (moduleOrder.get(first.moduleId) ?? 99) - (moduleOrder.get(second.moduleId) ?? 99));
}
