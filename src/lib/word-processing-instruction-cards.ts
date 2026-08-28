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
  image?: {
    alt?: string;
    alignment?: "left" | "center" | "right";
  };
  columns?: 2 | 3;
  table?: {
    headers?: string[];
    minRows?: number;
    minColumns?: number;
    sortedFirstColumn?: string[];
    mergedFirstRowText?: string;
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
  teacherReview?: string[];
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

const showcaseSupport = [
  "Support document: Apex Practice Showcase",
  "The Apex practice showcase includes starter challenges, a skills lab, guided practice sessions, and a progress showcase.",
  "A photograph of a learner is available for the article.",
  "The final article should be clear enough for a community newsletter."
];

const typedStarter = `
  <p>Apex Practice Showcase</p>
  <p>The Apex practice showcase includes starter challenges, a skills lab, guided practice sessions, and a progress showcase.</p>
  <p>Visitors should check start times before arriving.</p>
`;

const extendedIntroSpecs = [
  ["wp-intro-showcase-title", "Create a showcase article title", "Type the article title from the support document.", "Apex Practice Showcase", showcaseSupport],
  ["wp-intro-cycle-audience", "Add the audience sentence", "Enter the sentence about the community newsletter.", "The final article should be clear enough for a community newsletter.", showcaseSupport],
  ["wp-intro-start-times", "Add the start time warning", "Enter the sentence about checking start times.", "Visitors should check start times before arriving.", showcaseSupport],
  ["wp-intro-learner-photo-note", "Add an image note", "Enter the sentence that explains the photograph.", "A photograph of a learner is available for the article.", showcaseSupport],
  ["wp-intro-charity-sessions", "Add the charity session detail", "Type the detail about guided practice sessions.", "Guided practice sessions are included in the showcase programme.", ["Support document: Apex Practice Showcase", "Guided practice sessions are included in the showcase programme."]],
  ["wp-intro-skills-zone", "Add the skills lab detail", "Type the sentence about the skills lab.", "The skills lab opens after the starter challenges.", ["Support document: Apex Practice Showcase", "The skills lab opens after the starter challenges."]],
  ["wp-intro-winners", "Add the progress showcase", "Type the progress showcase sentence.", "The progress showcase starts at 16:00.", ["Support document: Apex Practice Showcase", "The progress showcase starts at 16:00."]],
  ["wp-intro-safety", "Add a safety instruction", "Type the safety instruction.", "All learners must bring their login details.", ["Support document: Safety Notice", "All learners must bring their login details."]],
  ["wp-intro-meeting-point", "Add the meeting point", "Type the meeting point sentence.", "Meet at the information desk before the session.", ["Support document: Safety Notice", "Meet at the information desk before the session."]],
  ["wp-intro-results-heading", "Add a results heading", "Type the results heading.", "Practice Results Summary", ["Support document: Results", "Practice Results Summary"]],
  ["wp-intro-fastest-group", "Add a skill group", "Type the fastest race group.", "Advanced learners are the fastest group.", ["Support document: Skill Groups", "Advanced learners are the fastest group."]],
  ["wp-intro-slowest-group", "Add another skill group", "Type the slowest race group.", "Foundation learners start first.", ["Support document: Skill Groups", "Foundation learners start first."]]
].map(([id, title, goal, text, supportDocument]) => ({
  id,
  moduleId: "intro",
  moduleTitle: "Document Basics",
  category: "intro",
  title,
  scenario: "Use the support document to build accurate source text without changing the wording.",
  supportDocument: supportDocument as string[],
  goal,
  steps: ["Click in the correct place in the document.", "Use the support document to type the required text.", "Check spelling, capital letters, and punctuation."],
  starterHtml: blankDocument,
  expected: { textIncludes: [text as string] },
  points: 10
} as WordProcessingInstructionCard));

const extraFormattingSpecs = [
  ["wp-format-bold-showcase-title", "Apex Practice Showcase", "Make the article title bold.", typedStarter, "bold"],
  ["wp-format-italic-photo-note", "A photograph of a learner is available for the article.", "Italicise the photograph note.", `${typedStarter}<p>A photograph of a learner is available for the article.</p>`, "italic"],
  ["wp-format-underline-start-times", "Visitors should check start times before arriving.", "Underline the start time warning.", typedStarter, "underline"],
  ["wp-format-bold-winners", "progress showcase", "Make progress showcase bold.", typedStarter, "bold"],
  ["wp-format-italic-skills", "skills lab", "Italicise skills lab.", typedStarter, "italic"],
  ["wp-format-underline-login details", "All learners must bring their login details.", "Underline the login details instruction.", `<p>Safety Notice</p><p>All learners must bring their login details.</p>`, "underline"],
  ["wp-format-bold-results", "Practice Results Summary", "Make the results heading bold.", `<p>Practice Results Summary</p><p>Foundation learners start first.</p>`, "bold"],
  ["wp-format-bold-fastest", "Advanced learners", "Make Advanced learners bold.", `<p>Advanced learners are the fastest group.</p>`, "bold"],
  ["wp-format-italic-foundation", "Foundation learners", "Italicise Foundation learners.", `<p>Foundation learners start first.</p>`, "italic"],
  ["wp-format-underline-community", "community newsletter", "Underline community newsletter.", typedStarter, "underline"],
  ["wp-format-bold-information", "information desk", "Make information desk bold.", `<p>Meet at the information desk before the session.</p>`, "bold"],
  ["wp-format-italic-junior", "starter challenges", "Italicise starter challenges.", typedStarter, "italic"],
  ["wp-format-underline-final", "final article", "Underline final article.", `${typedStarter}<p>The final article should be clear enough for a community newsletter.</p>`, "underline"],
  ["wp-format-bold-charity", "guided practice sessions", "Make guided practice sessions bold.", typedStarter, "bold"],
  ["wp-format-italic-arriving", "before arriving", "Italicise before arriving.", typedStarter, "italic"]
].map(([id, text, goal, starterHtml, kind]) => ({
  id,
  moduleId: "text-formatting",
  moduleTitle: "Text Formatting",
  category: "format",
  title: goal,
  scenario: "An article has already been typed. Edit only the named word or phrase.",
  supportDocument: showcaseSupport,
  goal,
  steps: [`Find the phrase ${text} in the document.`, `Select only that phrase.`, `Apply ${kind} formatting from the toolbar.`],
  starterHtml,
  expected: kind === "bold" ? { boldText: [text as string] } : kind === "italic" ? { italicText: [text as string] } : { underlineText: [text as string] },
  points: 15
} as WordProcessingInstructionCard));

const extraLayoutCards: WordProcessingInstructionCard[] = [
  ...[
    ["wp-layout-center-showcase", "Apex Practice Showcase", "Centre the article title.", "center", typedStarter],
    ["wp-layout-justify-showcase-body", "The Apex practice showcase includes", "Justify the main article paragraph.", "justify", typedStarter],
    ["wp-layout-right-photo-credit", "Photo: Apex Study Hub", "Right align the photo credit.", "right", `${typedStarter}<p>Photo: Apex Study Hub</p>`],
    ["wp-layout-center-results", "Practice Results Summary", "Centre the results heading.", "center", `<p>Practice Results Summary</p><p>Foundation learners start first.</p>`],
    ["wp-layout-justify-safety", "All learners must bring their login details", "Justify the safety paragraph.", "justify", `<p>Safety Notice</p><p>All learners must bring their login details. Learners should follow marshal instructions throughout the event.</p>`],
    ["wp-layout-right-ref-showcase", "Reference: APX/26", "Right align the document reference.", "right", `<p>Reference: APX/26</p><p>Apex Practice Showcase</p>`],
    ["wp-layout-center-notice", "Safety Notice", "Centre the safety heading.", "center", `<p>Safety Notice</p><p>All learners must bring their login details.</p>`],
    ["wp-layout-justify-newsletter", "The final article should be clear", "Justify the newsletter paragraph.", "justify", `${typedStarter}<p>The final article should be clear enough for a community newsletter.</p>`],
    ["wp-layout-right-date-showcase", "Date: August 2026", "Right align the date.", "right", `<p>Date: August 2026</p><p>Apex Practice Showcase</p>`],
    ["wp-layout-center-awards", "Progress Showcase", "Centre the awards heading.", "center", `<p>Progress Showcase</p><p>The progress showcase starts at 16:00.</p>`]
  ].map(([id, text, goal, value, starterHtml]) => ({
    id,
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: goal,
    scenario: "The text is already typed. Practise arranging paragraphs for a clear printed document.",
    supportDocument: showcaseSupport,
    goal,
    steps: [`Click inside the paragraph containing ${text}.`, `Use the toolbar alignment button for ${value}.`, "Check the paragraph has moved to the correct position."],
    starterHtml,
    expected: { alignments: [{ text: text as string, value: value as "center" | "right" | "justify" }] },
    points: 15
  } as WordProcessingInstructionCard)),
  {
    id: "wp-layout-two-columns-showcase",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Apply two-column layout",
    scenario: "The community newsletter article should use two columns like a magazine page.",
    supportDocument: showcaseSupport,
    goal: "Apply two columns to the practice showcase article.",
    steps: ["Click inside the document.", "Click the two-column toolbar button.", "Check the article text flows into two columns."],
    starterHtml: `${typedStarter}<p>The final article should be clear enough for a community newsletter.</p>`,
    expected: { columns: 2 },
    points: 20
  },
  {
    id: "wp-layout-image-centre",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Insert and centre an image",
    scenario: "The article needs the study workspace image placed neatly below the title.",
    supportDocument: showcaseSupport,
    goal: "Insert the study image and centre it.",
    steps: ["Click below the title.", "Click the image toolbar button.", "Check the image is centred in the document."],
    starterHtml: `<h1>Apex Practice Showcase</h1><p>The Apex practice showcase includes starter challenges, a skills lab, guided practice sessions, and a progress showcase.</p>`,
    expected: { image: { alt: "apex study workspace", alignment: "center" } },
    points: 20
  },
  {
    id: "wp-layout-columns-with-image",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "layout",
    title: "Build a newsletter layout",
    scenario: "The finished article should combine a study image with a two-column body.",
    supportDocument: showcaseSupport,
    goal: "Insert the study image and apply two columns to the article.",
    steps: ["Insert the study image below the title.", "Click the two-column toolbar button.", "Check the article still reads clearly."],
    starterHtml: `<h1>Apex Practice Showcase</h1><p>The Apex practice showcase includes starter challenges, a skills lab, guided practice sessions, and a progress showcase. Visitors should check start times before arriving. The final article should be clear enough for a community newsletter.</p>`,
    expected: { image: { alt: "apex study workspace", alignment: "center" }, columns: 2 },
    points: 25
  }
];

const extraListSpecs = [
  ["wp-list-showcase-events", "Apex events", ["Starter challenges", "Skills lab", "Guided practice sessions", "Winners presentation"], "unordered"],
  ["wp-list-learner-checks", "Learner checks", ["Bring login details", "Check start time", "Meet at the information desk"], "ordered"],
  ["wp-list-source-files", "Source files", ["Apex article", "Study workspace image", "Race results"], "unordered"],
  ["wp-list-editing-order", "Editing order", ["Open the source document", "Format the title", "Insert the image", "Check the final document"], "ordered"],
  ["wp-list-newsletter-items", "Newsletter contents", ["Main article", "Results table", "Safety note"], "unordered"],
  ["wp-list-race-groups", "Skill groups", ["Foundation", "Intermediate", "Advanced"], "unordered"],
  ["wp-list-proofing", "Proofing checklist", ["Check spelling", "Check alignment", "Check table order"], "ordered"],
  ["wp-list-output", "Print output", ["Article", "Evidence document", "Final proof"], "ordered"],
  ["wp-list-volunteer", "Volunteer tasks", ["Set up signs", "Guide learners", "Record winners"], "unordered"],
  ["wp-list-safety", "Safety points", ["Login details", "Water", "Marshal instructions"], "unordered"],
  ["wp-list-import", "Import sequence", ["Open document", "Place image", "Resize image"], "ordered"],
  ["wp-list-table-plan", "Table plan", ["Category", "Winners", "Points"], "unordered"],
  ["wp-list-columns-plan", "Column plan", ["Title above columns", "Body in columns", "Image near title"], "ordered"],
  ["wp-list-final-checks", "Final checks", ["No missing text", "No broken image", "No unsorted table"], "unordered"],
  ["wp-list-reader-actions", "Reader actions", ["Read start time", "Find category", "Check winner"], "ordered"]
].map(([id, title, items, listType]) => ({
  id,
  moduleId: "lists",
  moduleTitle: "Lists",
  category: "list",
  title: `Format ${title.toString().toLowerCase()}`,
  scenario: "A document section is already typed as plain lines. Convert it into the correct list type.",
  supportDocument: [`Support document: ${title}`, ...(items as string[])],
  goal: `Turn ${title.toString().toLowerCase()} into ${listType === "ordered" ? "a numbered list" : "a bullet list"}.`,
  steps: ["Select the item lines under the heading.", `Click the ${listType === "ordered" ? "numbered list" : "bullet list"} toolbar button.`, "Check each item is on its own list line."],
  starterHtml: `<p>${title}</p>${(items as string[]).map((item) => `<p>${item}</p>`).join("")}`,
  expected: listType === "ordered" ? { orderedListItems: items as string[] } : { unorderedListItems: items as string[] },
  points: 15
} as WordProcessingInstructionCard));

const raceTableStarter = `
  <p>Race results</p>
  <table>
    <tbody>
      <tr><td>Category</td><td>Points</td><td>Notes</td></tr>
      <tr><td>Advanced</td><td>16</td><td>fastest</td></tr>
      <tr><td>Foundation</td><td>2</td><td>slowest</td></tr>
      <tr><td>Intermediate</td><td>6</td><td>second to last</td></tr>
    </tbody>
  </table>
`;

const extraTableCards: WordProcessingInstructionCard[] = [
  ...[
    ["wp-table-race-headers", "Race table headings", "Bold the race table headings.", raceTableStarter, ["Category", "Points", "Notes"]],
    ["wp-table-club-headers-extra", "Club table headings", "Bold the club table headings.", tableStarter, ["Club", "Teacher", "Room"]],
    ["wp-table-winner-headers", "Winners table headings", "Bold Winner, Category, and Time.", `<table><tbody><tr><td>Winner</td><td>Category</td><td>Time</td></tr><tr><td>Ana</td><td>Foundation</td><td>09:30</td></tr></tbody></table>`, ["Winner", "Category", "Time"]]
  ].map(([id, title, goal, starterHtml, headers]) => ({
    id,
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title,
    scenario: "The table has been typed. Format the heading row so it stands out.",
    supportDocument: ["Support document: Table Formatting", "Heading rows should be bold."],
    goal,
    steps: ["Select the first row of the table.", "Click the B button.", "Check only the headings are emphasised."],
    starterHtml,
    expected: { boldText: headers as string[], table: { headers: headers as string[], minRows: 2, minColumns: 3 } },
    points: 20
  } as WordProcessingInstructionCard)),
  ...[
    ["wp-table-sort-race-categories", "Sort skill groups", "Sort the category table alphabetically.", raceTableStarter, ["Intermediate", "Foundation", "Advanced"]],
    ["wp-table-sort-club-extra", "Sort clubs again", "Sort the club table alphabetically.", tableStarter, ["Art", "Drama", "Robotics"]],
    ["wp-table-sort-winners", "Sort winner names", "Sort the winners table alphabetically.", `<table><tbody><tr><td>Winner</td><td>Category</td><td>Time</td></tr><tr><td>Zara</td><td>Advanced</td><td>10:10</td></tr><tr><td>Ana</td><td>Foundation</td><td>09:30</td></tr><tr><td>Milo</td><td>Intermediate</td><td>09:50</td></tr></tbody></table>`, ["Ana", "Milo", "Zara"]]
  ].map(([id, title, goal, starterHtml, sortedFirstColumn]) => ({
    id,
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title,
    scenario: "The table data is present but not in the order requested by the examiner.",
    supportDocument: ["Support document: Sorting", "Sort the first column in ascending order."],
    goal,
    steps: ["Click inside the table.", "Click Sort A-Z.", "Check the first column is in ascending order."],
    starterHtml,
    expected: { table: { sortedFirstColumn: sortedFirstColumn as string[] } },
    points: 20
  } as WordProcessingInstructionCard)),
  ...[
    ["wp-table-add-foundation-row", "Add a Foundation row", "Add the Foundation race row to the table.", "Foundation", "2", "slowest"],
    ["wp-table-add-advanced-row", "Add a Advanced row", "Add the Advanced race row to the table.", "Advanced", "16", "fastest"],
    ["wp-table-add-block-row", "Add a Intermediate row", "Add the Intermediate race row to the table.", "Intermediate", "6", "second to last"],
    ["wp-table-add-winner-row", "Add a winner row", "Add Ana, Foundation, and 09:30 to the table.", "Ana", "Foundation", "09:30"],
    ["wp-table-add-learner-row", "Add a learner row", "Add Milo, Intermediate, and 09:50 to the table.", "Milo", "Intermediate", "09:50"],
    ["wp-table-add-advanced-winner", "Add the Advanced winner", "Add Zara, Advanced, and 10:10 to the table.", "Zara", "Advanced", "10:10"],
    ["wp-table-add-total-row", "Add the total row", "Add Total, 38, and all groups to the table.", "Total", "38", "all groups"],
    ["wp-table-add-start-time", "Add a start time", "Add Foundation, 09:00, and First start.", "Foundation", "09:00", "First start"]
  ].map(([id, title, goal, first, second, third]) => ({
    id,
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "table",
    title,
    scenario: "Use the support data to complete an existing table.",
    supportDocument: ["Support document: Practice Data", `${first} | ${second} | ${third}`],
    goal,
    steps: ["Click inside an empty table row.", "Enter the three pieces of support data into the row.", "Check the data is in separate cells."],
    starterHtml: `<table><tbody><tr><td>Category</td><td>Points</td><td>Notes</td></tr><tr><td></td><td></td><td></td></tr></tbody></table>`,
    expected: { textIncludes: [first as string, second as string, third as string], table: { minRows: 2, minColumns: 3 } },
    points: 20
  } as WordProcessingInstructionCard))
];

const extraExamCards: WordProcessingInstructionCard[] = [
  {
    id: "wp-exam-showcase-newsletter",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Build the Apex newsletter article",
    scenario: "This is a longer practical task modelled on a support-document workflow.",
    supportDocument: showcaseSupport,
    goal: "Create a bold centred title, insert the study image, and apply two columns.",
    steps: ["Format the title so it is bold and centred.", "Insert the study image below the title.", "Apply two columns to the article."],
    starterHtml: typedStarter,
    expected: { boldText: ["Apex Practice Showcase"], alignments: [{ text: "Apex Practice Showcase", value: "center" }], image: { alt: "apex study workspace", alignment: "center" }, columns: 2 },
    points: 30
  },
  {
    id: "wp-exam-race-results-table",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Format and sort practice results",
    scenario: "A results table has been imported from a CSV-style support file and needs final formatting.",
    supportDocument: ["Support document: Practice Results", "Sort by Category ascending.", "Make the heading row bold."],
    goal: "Make the table headings bold and sort the first column alphabetically.",
    steps: ["Bold the heading row.", "Click in the table.", "Sort the first column from A to Z."],
    starterHtml: raceTableStarter,
    expected: { boldText: ["Category", "Points", "Notes"], table: { headers: ["Category", "Points", "Notes"], sortedFirstColumn: ["Intermediate", "Foundation", "Advanced"] } },
    points: 30
  },
  {
    id: "wp-exam-safety-handout",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Prepare a safety handout",
    scenario: "A safety handout must combine a heading, a justified paragraph, and a bullet checklist.",
    supportDocument: ["Support document: Safety", "Heading: Learner Safety", "Items: Login details, Water, Marshal instructions"],
    goal: "Create a bold centred heading, justify the paragraph, and make the safety items a bullet list.",
    steps: ["Make the heading bold and centred.", "Justify the safety paragraph.", "Turn the three safety items into bullets."],
    starterHtml: `<p>Learner Safety</p><p>All learners must bring their login details. Learners should follow marshal instructions throughout the event.</p><p>Login details</p><p>Water</p><p>Marshal instructions</p>`,
    expected: {
      boldText: ["Learner Safety"],
      alignments: [{ text: "Learner Safety", value: "center" }, { text: "All learners must wear", value: "justify" }],
      unorderedListItems: ["Login details", "Water", "Marshal instructions"]
    },
    points: 30
  },
  {
    id: "wp-exam-proof-edit",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Edit an imported article",
    scenario: "The article is already typed, but the examiner has asked for several finishing changes.",
    supportDocument: ["Support document: Edit Notes", "Title should be bold.", "Photo note should be italic.", "Start time warning should be underlined."],
    goal: "Apply bold, italic, and underline to the correct parts of the existing article.",
    steps: ["Make the title bold.", "Italicise the photograph note.", "Underline the start time warning."],
    starterHtml: `${typedStarter}<p>A photograph of a learner is available for the article.</p>`,
    expected: {
      boldText: ["Apex Practice Showcase"],
      italicText: ["A photograph of a learner is available for the article."],
      underlineText: ["Visitors should check start times before arriving."]
    },
    points: 30
  },
  {
    id: "wp-exam-two-column-results",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Create a two-column results page",
    scenario: "A newsletter page must show article text and a sorted results table.",
    supportDocument: ["Support document: Newsletter Page", "Use two columns.", "Sort skill groups alphabetically."],
    goal: "Apply two columns and sort the results table.",
    steps: ["Click the two-column toolbar button.", "Click inside the results table.", "Click Sort A-Z."],
    starterHtml: `${typedStarter}${raceTableStarter}`,
    expected: { columns: 2, table: { sortedFirstColumn: ["Intermediate", "Foundation", "Advanced"] } },
    points: 30
  },
  {
    id: "wp-exam-image-and-caption",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Place an image with a caption",
    scenario: "The study image must be inserted and the caption must be included.",
    supportDocument: ["Support document: Image", "Caption: Learner on the practice workspace"],
    goal: "Insert the study image and add the caption text.",
    steps: ["Insert the study image.", "Type the caption below the image.", "Centre the image."],
    starterHtml: `<h1>Apex Practice Showcase</h1><p></p>`,
    expected: { image: { alt: "apex study workspace", alignment: "center" }, textIncludes: ["Learner on the practice workspace"] },
    points: 30
  },
  {
    id: "wp-exam-full-support-edit",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "Complete a support-document edit",
    scenario: "A prepared article needs the same mix of edits students often meet in practical papers.",
    supportDocument: showcaseSupport,
    goal: "Bold and centre the title, justify the article paragraph, insert the image, and underline the start time warning.",
    steps: ["Format the title.", "Justify the article paragraph.", "Insert the study image and underline the warning sentence."],
    starterHtml: typedStarter,
    expected: {
      boldText: ["Apex Practice Showcase"],
      underlineText: ["Visitors should check start times before arriving."],
      alignments: [{ text: "Apex Practice Showcase", value: "center" }, { text: "The Apex practice showcase includes", value: "justify" }],
      image: { alt: "apex study workspace", alignment: "center" }
    },
    points: 35
  },
  ...[
    ["wp-exam-final-list", "Create the final checklist", ["No missing text", "No broken image", "No unsorted table"], "unordered"],
    ["wp-exam-numbered-process", "Create the editing process", ["Open source", "Format document", "Check output"], "ordered"],
    ["wp-exam-bullet-events", "Create the events list", ["Starter challenges", "Skills lab", "Guided practice sessions"], "unordered"],
    ["wp-exam-numbered-proofing", "Create proofing steps", ["Read instructions", "Compare document", "Save final work"], "ordered"],
    ["wp-exam-bullet-files", "Create source file list", ["Apex document", "study image", "results data"], "unordered"],
    ["wp-exam-numbered-evidence", "Create evidence steps", ["Take screenshot", "Paste evidence", "Label step"], "ordered"],
    ["wp-exam-bullet-audience", "Create audience points", ["Parents", "Learners", "Visitors"], "unordered"],
    ["wp-exam-numbered-layout", "Create layout sequence", ["Place title", "Insert image", "Apply columns"], "ordered"],
    ["wp-exam-bullet-output", "Create output list", ["Newsletter", "Results table", "Safety note"], "unordered"]
  ].map(([id, title, items, listType]) => ({
    id,
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title,
    scenario: "A section of the final document needs to be converted into the correct list format.",
    supportDocument: [`Support document: ${title}`, ...(items as string[])],
    goal: `Format the section as ${listType === "ordered" ? "a numbered list" : "a bullet list"}.`,
    steps: ["Select the item lines.", `Click the ${listType === "ordered" ? "numbered list" : "bullet list"} button.`, "Check the list format is applied."],
    starterHtml: `<p>${title}</p>${(items as string[]).map((item) => `<p>${item}</p>`).join("")}`,
    expected: listType === "ordered" ? { orderedListItems: items as string[] } : { unorderedListItems: items as string[] },
    points: 25
  } as WordProcessingInstructionCard))
];

const stemStyleStarter = `
  <p>Apex Study Hub Skills Programme</p>
  <p>Innovations in Science Education</p>
  <p>working in teams</p>
  <p>solving practical problems</p>
  <p>developing own solutions</p>
  <p>Why is a digital skills approach to learning important?</p>
  <p>Digital skills learning helps students connect science, technology, engineering and mathematics to practical tasks. Students work with real problems and present their solutions clearly.</p>
  <p>Digital skills subjects</p>
  <table>
    <tbody>
      <tr><td>Subject Choices</td><td>Girls</td><td>Boys</td></tr>
      <tr><td>Chemistry</td><td>42</td><td>38</td></tr>
      <tr><td>Physics</td><td>36</td><td>44</td></tr>
      <tr><td>Computer Science</td><td>31</td><td>49</td></tr>
    </tbody>
  </table>
  <p>Will the gender disparity change as more practical projects are introduced?</p>
`;

const showcaseArticleStarter = `
  <p>Apex Practice Showcase</p>
  <p>We are delighted to announce the return of the Apex Practice Showcase this summer. The event will be held on Sunday 27 August 2023 and is open to all club members and visiting apex study workspaces.</p>
  <p>Practice Sessions</p>
  <p>All practice sessions start and finish at the lake. Learners must start within twenty minutes of the listed start time for their practice session.</p>
  <p>Registration and Participation</p>
  <p>Event registration and payment must be completed online prior to the showcase. Cash transactions cannot be accepted.</p>
  <p>Entertainment</p>
  <p>Activities will include:</p>
  <p>keyboard shortcuts for beginners</p>
  <p>file management mini lessons</p>
  <p>guided walks around the nature reserve</p>
  <p>professional shows with live editing demonstrations</p>
`;

const moduleExamChallengeCards: WordProcessingInstructionCard[] = [
  {
    id: "wp-intro-0417-source-document-challenge",
    moduleId: "intro",
    moduleTitle: "Document Basics",
    category: "exam",
    title: "0417 source document setup",
    scenario: "A practical paper gives you a prepared source document. Your first job is to open it, recognise the structure, and add the missing source text without changing the page setup.",
    supportDocument: [
      "Source file: Apex article",
      "Add the subtitle Practical skills for every learner below the title.",
      "Add the sentence: Entries close on 20 August or earlier if a practice session is fully subscribed.",
      "Teacher check: file saved with the correct name and format."
    ],
    goal: "Complete the missing subtitle and source sentence in the prepared document.",
    steps: [
      "Use the prepared document already open in the workspace.",
      "Add the subtitle below the main title.",
      "Add the missing entry deadline sentence in the registration section.",
      "Ask your teacher to review the save-name and file-format evidence."
    ],
    starterHtml: showcaseArticleStarter,
    expected: {
      textIncludes: ["Practical skills for every learner", "Entries close on 20 August or earlier if a practice session is fully subscribed."]
    },
    teacherReview: [
      "Confirm the student understands that the source document is edited, not recreated from advanced.",
      "Confirm the save-name/file-format evidence would be acceptable in an exam."
    ],
    points: 35
  },
  {
    id: "wp-format-0417-style-challenge",
    moduleId: "text-formatting",
    moduleTitle: "Text Formatting",
    category: "exam",
    title: "0417 style and title challenge",
    scenario: "The exam often asks students to modify named styles and apply them to precise text. Apex checks visible formatting, while your teacher checks the named style setup.",
    supportDocument: [
      "House style: title - sans-serif, 36 point, centre, bold, underlined.",
      "House style: subhead - sans-serif, 14 point, centre, all capitals, bold.",
      "Apply title formatting to Apex Study Hub Skills Programme.",
      "Apply subheading formatting to Why is a digital skills approach to learning important?"
    ],
    goal: "Format the title and one subheading to match a 0417-style house style.",
    steps: [
      "Select the title and apply bold, underline and centre alignment.",
      "Make the subheading bold and centre aligned.",
      "Teacher should review whether the student can explain how this would be done using named styles in Word."
    ],
    starterHtml: stemStyleStarter,
    expected: {
      boldText: ["Apex Study Hub Skills Programme", "Why is a digital skills approach to learning important?"],
      underlineText: ["Apex Study Hub Skills Programme"],
      alignments: [
        { text: "Apex Study Hub Skills Programme", value: "center" },
        { text: "Why is a digital skills approach", value: "center" }
      ]
    },
    teacherReview: [
      "Check the student understands named paragraph styles, not only manual formatting.",
      "Check the student can identify title, subtitle, and subheadings in a long document."
    ],
    points: 40
  },
  {
    id: "wp-layout-0417-columns-image-challenge",
    moduleId: "paragraph-layout",
    moduleTitle: "Paragraph Layout",
    category: "exam",
    title: "0417 columns and image challenge",
    scenario: "A common document-production task changes only part of a document into columns and places an image beside a specific paragraph.",
    supportDocument: [
      "Change from the subheading Practice Sessions onwards into two equal columns.",
      "Insert the study image near the paragraph beginning All practice sessions start...",
      "The image should be aligned neatly and text should sit around it in the final printout."
    ],
    goal: "Apply two columns and insert the study image into the Apex article.",
    steps: [
      "Click inside the document and apply the two-column layout.",
      "Place the cursor near the practice sessions paragraph and insert the study image.",
      "Teacher should review image wrapping, exact position, and column start point."
    ],
    starterHtml: showcaseArticleStarter,
    expected: {
      columns: 2,
      image: { alt: "apex study workspace", alignment: "center" }
    },
    teacherReview: [
      "Check that columns should begin at the requested subheading, not necessarily at the top of the document.",
      "Check image size, wrapping, and placement against the instruction."
    ],
    points: 40
  },
  {
    id: "wp-list-0417-bullet-style-challenge",
    moduleId: "lists",
    moduleTitle: "Lists",
    category: "exam",
    title: "0417 bullet style challenge",
    scenario: "The exam may ask for a specific bullet style to be applied to a selected range of plain text.",
    supportDocument: [
      "Apply the bullet style to the activity lines only.",
      "The list starts with keyboard shortcuts for beginners.",
      "The list ends with professional shows with live editing demonstrations.",
      "Teacher check: bullet shape and left-margin alignment."
    ],
    goal: "Turn the activity lines in the Apex article into a bullet list.",
    steps: [
      "Select the activity lines only.",
      "Click the bullet list button.",
      "Do not include the heading Activities will include:"
    ],
    starterHtml: showcaseArticleStarter,
    expected: {
      unorderedListItems: [
        "keyboard shortcuts for beginners",
        "file management mini lessons",
        "guided walks around the nature reserve",
        "professional shows with live editing demonstrations"
      ]
    },
    teacherReview: [
      "Check whether the correct range was selected.",
      "Check whether the bullet appearance and alignment match the requested style."
    ],
    points: 35
  },
  {
    id: "wp-table-0417-table-edit-challenge",
    moduleId: "tables",
    moduleTitle: "Tables",
    category: "exam",
    title: "0417 table edit challenge",
    scenario: "The exam often gives an existing table, then asks for a row insertion, merged heading row, centred text, and consistent table formatting.",
    supportDocument: [
      "Insert a new row above Chemistry.",
      "Enter Biology, 50 and 40.",
      "Merge and centre the first row of the table.",
      "Teacher check: table style, borders, spacing after table, and whether data fits without wrapping."
    ],
    goal: "Edit the digital skills table by adding Biology and merging the heading row.",
    steps: [
      "Add Biology, 50 and 40 above Chemistry.",
      "Use the merge toolbar button to merge the first table row.",
      "Check the first row text is centred and the Biology row is present."
    ],
    starterHtml: stemStyleStarter,
    expected: {
      textIncludes: ["Biology", "50", "40"],
      table: {
        headers: ["Chemistry", "Physics", "Computer Science"],
        minRows: 5,
        minColumns: 3,
        mergedFirstRowText: "Subject Choices Girls Boys"
      }
    },
    teacherReview: [
      "Check the Biology row is in the correct position above Chemistry.",
      "Check all printed gridlines/borders would show and no table data wraps.",
      "Check the 6-point space after the table."
    ],
    points: 45
  },
  {
    id: "wp-exam-0417-full-document-production",
    moduleId: "exam-editing",
    moduleTitle: "Exam Editing",
    category: "exam",
    title: "0417 full document production task",
    scenario: "This is the closest Word Processing task to the document-production part of Paper 2. It combines source document editing, house style, columns, table editing, image placement, and proofing.",
    supportDocument: [
      "Open the prepared Digital skills article.",
      "Format the title as bold, underlined and centred.",
      "Add the subtitle Innovations in Science Education.",
      "Apply bullets to the three teamwork lines.",
      "Apply two columns to the body section.",
      "Insert the study image near the paragraph beginning Will the gender disparity...",
      "Add Biology, 50 and 40 to the table and merge the first table row.",
      "Teacher check: footer/page numbers, named styles, image wrap, no widows/orphans, no split table/list."
    ],
    goal: "Complete a full 0417-style document production edit.",
    steps: [
      "Work through the support instructions as a full exam-style sequence.",
      "Use Apex checks for visible text, formatting, list, image, columns and table changes.",
      "Use the teacher-review list for the presentation details that require human judgement."
    ],
    starterHtml: stemStyleStarter,
    expected: {
      textIncludes: ["Innovations in Science Education", "Biology", "50", "40"],
      boldText: ["Apex Study Hub Skills Programme"],
      underlineText: ["Apex Study Hub Skills Programme"],
      alignments: [{ text: "Apex Study Hub Skills Programme", value: "center" }],
      unorderedListItems: ["working in teams", "solving practical problems", "developing own solutions"],
      columns: 2,
      image: { alt: "apex study workspace", alignment: "center" },
      table: {
        minRows: 5,
        minColumns: 3,
        mergedFirstRowText: "Subject Choices Girls Boys"
      }
    },
    teacherReview: [
      "Check footer contains automated page number and candidate details in the correct positions.",
      "Check named styles are created/modified and applied consistently.",
      "Check image size, reflection/wrap and alignment against the instruction.",
      "Check table/list are not split, columns align at the top, no widows/orphans, no blank pages."
    ],
    points: 70
  }
];

const rawWordProcessingCards = [
  ...wordProcessingInstructionCards,
  ...generatedIntroTasks,
  ...extendedIntroSpecs,
  ...generatedFormattingTasks,
  ...extraFormattingSpecs,
  ...generatedLayoutTasks,
  ...extraLayoutCards,
  ...generatedListTasks,
  ...extraListSpecs,
  ...generatedTableTasks,
  ...extraTableCards,
  ...generatedExamEditingTasks,
  ...extraExamCards,
  ...moduleExamChallengeCards
];

function removeCopyableTypingText(card: WordProcessingInstructionCard): WordProcessingInstructionCard {
  const protectedTexts = card.expected.textIncludes?.filter((text) => text.length > 12) || [];
  if (protectedTexts.length === 0) return card;

  return {
    ...card,
    steps: card.steps.map((step) => {
      if (!protectedTexts.some((text) => step.includes(text))) return step;
      if (step.toLowerCase().startsWith("on the next line")) return "On the next line, type the next required sentence from the support document.";
      return "Use the support document to type the required text in the correct place.";
    })
  };
}

function checkedRequirements(card: WordProcessingInstructionCard): string[] {
  const expected = card.expected;
  const requirements: string[] = [];

  if (expected.textIncludes?.length) requirements.push(`required text: ${expected.textIncludes.join("; ")}`);
  if (expected.boldText?.length) requirements.push(`bold text: ${expected.boldText.join("; ")}`);
  if (expected.italicText?.length) requirements.push(`italic text: ${expected.italicText.join("; ")}`);
  if (expected.underlineText?.length) requirements.push(`underlined text: ${expected.underlineText.join("; ")}`);
  if (expected.alignments?.length) {
    requirements.push(`alignment: ${expected.alignments.map((item) => `${item.text} -> ${item.value}`).join("; ")}`);
  }
  if (expected.unorderedListItems?.length) requirements.push(`bullet list items: ${expected.unorderedListItems.join("; ")}`);
  if (expected.orderedListItems?.length) requirements.push(`numbered list items: ${expected.orderedListItems.join("; ")}`);
  if (expected.image) {
    const imageAlignment = expected.image.alignment === "center" ? "centred" : expected.image.alignment ? `${expected.image.alignment} aligned` : "";
    requirements.push(`image: ${[
      expected.image.alt ? `alt text ${expected.image.alt}` : "",
      imageAlignment
    ].filter(Boolean).join(", ")}`);
  }
  if (expected.columns) requirements.push(`${expected.columns} columns`);
  if (expected.table) {
    requirements.push(`table: ${[
      expected.table.headers?.length ? `headers ${expected.table.headers.join(", ")}` : "",
      expected.table.minRows ? `at least ${expected.table.minRows} rows` : "",
      expected.table.minColumns ? `at least ${expected.table.minColumns} columns` : "",
      expected.table.sortedFirstColumn?.length ? `first column order ${expected.table.sortedFirstColumn.join(", ")}` : "",
      expected.table.mergedFirstRowText ? `merged first row ${expected.table.mergedFirstRowText}` : ""
    ].filter(Boolean).join("; ")}`);
  }

  return requirements.length ? [`Checked requirements: ${requirements.join(" | ")}`] : [];
}

function exposeCheckedRequirements(card: WordProcessingInstructionCard): WordProcessingInstructionCard {
  const additions = checkedRequirements(card).filter((line) => !card.supportDocument.includes(line));
  return additions.length ? { ...card, supportDocument: [...card.supportDocument, ...additions] } : card;
}

export const allWordProcessingInstructionCards = rawWordProcessingCards
  .map(exposeCheckedRequirements)
  .map(removeCopyableTypingText);

const moduleOrder = new Map(wordProcessingModules.map((module, index) => [module.id, index]));

export function getWordProcessingModule(moduleId?: string) {
  return wordProcessingModules.find((module) => module.id === moduleId);
}

export function getWordProcessingCardsForModule(moduleId?: string) {
  return allWordProcessingInstructionCards
    .filter((card) => !moduleId || card.moduleId === moduleId)
    .sort((first, second) => (moduleOrder.get(first.moduleId) ?? 99) - (moduleOrder.get(second.moduleId) ?? 99));
}


