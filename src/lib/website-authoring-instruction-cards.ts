export type WebsiteAuthoringModule = {
  id: string;
  title: string;
  description: string;
};

export type WebsiteExpectedResult = {
  htmlIncludes?: string[];
  requiredTags?: string[];
  htmlLang?: string;
  metadata?: Array<{ charset?: string; name?: string; content?: string }>;
  images?: Array<{ srcIncludes?: string; srcFromUploadedImage?: boolean; alt?: string }>;
  uploadedFile?: { kind: "image" | "audio" | "video"; nameStartsWith?: string };
  uploadedPaths?: string[];
  links?: Array<{ text?: string; href?: string }>;
  containedTags?: Array<{ container: string; tag: string }>;
  containedText?: Array<{ container: string; text: string }>;
  containedLinks?: Array<{ container: string; text?: string; href?: string }>;
  linkedImages?: Array<{ href?: string; srcIncludes?: string; srcFromUploadedImage?: boolean; alt?: string }>;
  cssIncludes?: string[];
  tableHeaders?: string[];
  title?: string;
};

export type WebsiteAuthoringCard = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  scenario: string;
  supportDocument: string[];
  goal: string;
  steps: string[];
  starterHtml: string;
  starterCss: string;
  expected: WebsiteExpectedResult;
  teacherReview?: string[];
  points: number;
};

type CardDraft = Omit<WebsiteAuthoringCard, "moduleId" | "moduleTitle" | "starterCss" | "points"> & {
  starterCss?: string;
  points?: number;
};

type PracticeSpec = {
  slug: string;
  title: string;
  heading: string;
  paragraph: string;
  extraSupport?: string[];
  expected?: WebsiteExpectedResult;
  tags?: string[];
  points?: number;
};

export const websiteAuthoringModules: WebsiteAuthoringModule[] = [
  {
    id: "intro",
    title: "HTML Foundations",
    description: "Start from the document skeleton, then build headings, paragraphs, lists, sections, and comments."
  },
  {
    id: "text-media",
    title: "Text and Images",
    description: "Add Peak source text, uploaded images, alternative text, captions, and semantic media structure."
  },
  {
    id: "links-navigation",
    title: "Links and Navigation",
    description: "Create anchor links, internal page links, email links, bookmarks, and navigation menus."
  },
  {
    id: "tables",
    title: "HTML Tables",
    description: "Build tables from support data using rows, heading cells, data cells, captions, and scope."
  },
  {
    id: "css-layout",
    title: "CSS Layout",
    description: "Apply selectors, colours, spacing, borders, widths, simple layout, and responsive rules."
  },
  {
    id: "exam-build",
    title: "Exam Website Build",
    description: "Combine source text, structure, media, links, tables, CSS, preview checks, and evidence."
  },
  {
    id: "free-practice",
    title: "Free Practice",
    description: "Build any HTML/CSS page, upload activity files, preview it in the browser, and print or save as PDF."
  }
];

const blankHtml = "";

const baseCss = `body {
  font-family: Arial, sans-serif;
  color: #172026;
}
`;

const htmlShell = `<!doctype html>
<html>
  <head>
    <title>Peak Study Hub</title>
  </head>
  <body>

  </body>
</html>`;

const mainShell = `<!doctype html>
<html>
  <head>
    <title>Peak Study Hub</title>
  </head>
  <body>
    <main>

    </main>
  </body>
</html>`;

const apexStarterHtml = `<!doctype html>
<html>
  <head>
    <title>Peak Study Hub Open Day</title>
  </head>
  <body>
    <header>
      <h1>Peak Study Hub Open Day</h1>
      <p>Practical digital skills for confident learners.</p>
    </header>
    <main>
      <section id="welcome">
        <h2>Welcome</h2>
        <p>Peak Study Hub is preparing a student open day for families who want structured digital practice.</p>
      </section>
    </main>
  </body>
</html>`;

const apexPageHtml = `<!doctype html>
<html>
  <head>
    <title>Peak Study Hub Open Day</title>
  </head>
  <body>
    <header>
      <h1>Peak Study Hub Open Day</h1>
      <p>Practical digital skills for confident learners.</p>
    </header>
    <nav>
      <a href="index.html">Home</a>
      <a href="#sessions">Sessions</a>
      <a href="#register">Register</a>
    </nav>
    <main>
      <section id="sessions">
        <h2>Practice Sessions</h2>
        <p>Students rotate through short spreadsheet, document, and web design activities.</p>
      </section>
    </main>
  </body>
</html>`;

const apexPageWithFooterHtml = apexPageHtml.replace(
  "\n  </body>",
  "\n    <footer>\n\n    </footer>\n  </body>"
);

function insertIntoSessionsSection(markup: string) {
  return apexPageHtml.replace(
    "        <p>Students rotate through short spreadsheet, document, and web design activities.</p>\n      </section>",
    `        <p>Students rotate through short spreadsheet, document, and web design activities.</p>\n${markup}\n      </section>`
  );
}

const tableStarterHtml = `<!doctype html>
<html>
  <head>
    <title>Peak Workshop Timetable</title>
  </head>
  <body>
    <main>
      <h1>Peak Workshop Timetable</h1>
      <table>
        <tr>
          <th>Session</th>
          <th>Room</th>
          <th>Time</th>
        </tr>
        <tr>
          <td>Spreadsheet Sprint</td>
          <td>Lab 1</td>
          <td>09:30</td>
        </tr>
      </table>
    </main>
  </body>
</html>`;

const card = (moduleId: string, moduleTitle: string, item: CardDraft): WebsiteAuthoringCard => ({
  moduleId,
  moduleTitle,
  starterCss: baseCss,
  points: 20,
  ...item
});

const moduleCard = (moduleId: string, moduleTitle: string, item: CardDraft) => card(moduleId, moduleTitle, item);

function fullPagePractice(moduleId: string, moduleTitle: string, spec: PracticeSpec): WebsiteAuthoringCard {
  const tags = spec.tags || ["html", "head", "title", "body", "main", "h1", "p"];
  const expected = spec.expected ?? {};
  const practiceSteps = [
    "Create the full document structure first.",
    expected.links?.length ? "Add every required link exactly as listed in the support document." : "",
    expected.images?.length ? "Upload the required image file, then use the shown relative path in the img tag." : "",
    expected.tableHeaders?.length ? "Build the table with caption, heading row, and data rows from the support document." : "",
    expected.cssIncludes?.length ? "Open the CSS tab and add every required CSS selector/property listed in the support document." : "",
    "Add the required visible content from the support document.",
    "Check the preview, then check that every required tag is present in the code."
  ].filter(Boolean);

  return moduleCard(moduleId, moduleTitle, {
    id: `web-${moduleId}-${spec.slug}`,
    title: spec.title,
    scenario: "This practical task checks whether you can rebuild the skill without being given completed code.",
    supportDocument: [
      `Browser title: ${spec.heading}`,
      `Main heading: ${spec.heading}`,
      `Paragraph: ${spec.paragraph}`,
      `Required tags: ${tags.map((tag) => (tag.startsWith("<!--") ? tag : `<${tag}>`)).join(", ")}`,
      ...(spec.extraSupport || [])
    ],
    goal: `Build the required Peak page for ${spec.heading}.`,
    steps: practiceSteps,
    starterHtml: blankHtml,
    starterCss: expected.cssIncludes ? "" : baseCss,
    expected: {
      ...expected,
      requiredTags: expected.requiredTags ?? tags,
      htmlIncludes: ["<!doctype html>", spec.heading, spec.paragraph, ...(expected.htmlIncludes || [])],
      title: expected.title ?? spec.heading
    },
    teacherReview: spec.title.toLowerCase().includes("final") ? ["Check nesting, indentation, source accuracy, and whether the page would make clear evidence."] : undefined,
    points: spec.points || 45
  });
}

const introCards: WebsiteAuthoringCard[] = [
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-doctype",
    title: "Start an HTML document",
    scenario: "A browser needs a doctype before it reads the page as modern HTML.",
    supportDocument: ["Required first line: <!doctype html>"],
    goal: "Type the doctype declaration at the top of the HTML editor.",
    steps: ["Click in the HTML editor.", "Place the cursor on line 1.", "Type <!doctype html> exactly."],
    starterHtml: blankHtml,
    expected: { htmlIncludes: ["<!doctype html>"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-html",
    title: "Add the html element",
    scenario: "The html element is the root container for the whole page.",
    supportDocument: ["Opening tag: <html>", "Closing tag: </html>"],
    goal: "Create the html element below the doctype.",
    steps: ["Keep <!doctype html> on line 1.", "Type <html> below it.", "Type </html> after a blank line."],
    starterHtml: "<!doctype html>\n",
    expected: { requiredTags: ["html"], htmlIncludes: ["<!doctype html>"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-head-body",
    title: "Add head and body",
    scenario: "The head stores page information. The body stores visible page content.",
    supportDocument: ["Head tag pair: <head></head>", "Body tag pair: <body></body>"],
    goal: "Add head and body elements inside html.",
    steps: ["Click between <html> and </html>.", "Add <head></head> first.", "Add <body></body> after the head."],
    starterHtml: "<!doctype html>\n<html>\n\n</html>",
    expected: { requiredTags: ["head", "body"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-title",
    title: "Set the browser tab title",
    scenario: "The title element names the page in the browser tab.",
    supportDocument: ["Browser title: Peak Study Hub Open Day"],
    goal: "Add a title element inside head.",
    steps: ["Find the head element.", "Inside head, type <title>Peak Study Hub Open Day</title>.", "Keep title out of body."],
    starterHtml: "<!doctype html>\n<html>\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>",
    expected: { requiredTags: ["title"], htmlIncludes: ["Peak Study Hub Open Day"], title: "Peak Study Hub Open Day" },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-main",
    title: "Add the main content area",
    scenario: "The main element marks the important content on the page.",
    supportDocument: ["Use <main> inside the body."],
    goal: "Add a main element inside body.",
    steps: ["Find the body element.", "Click between <body> and </body>.", "Type <main></main>."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["main"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-h1",
    title: "Add the main heading",
    scenario: "The h1 element is the main visible heading of the page.",
    supportDocument: ["Main heading: Peak Study Hub Open Day"],
    goal: "Add Peak Study Hub Open Day as an h1 heading inside main.",
    steps: ["Find the main element.", "Click between <main> and </main>.", "Type <h1>Peak Study Hub Open Day</h1>."],
    starterHtml: mainShell,
    expected: { requiredTags: ["h1"], htmlIncludes: ["Peak Study Hub Open Day"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-p",
    title: "Add a paragraph",
    scenario: "The p element stores normal paragraph text.",
    supportDocument: ["Subtitle: Practical digital skills for confident learners."],
    goal: "Add the subtitle as a paragraph below the h1 heading.",
    steps: ["Find the h1 heading.", "On the next line, type a p element.", "Place the subtitle between <p> and </p>."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <h1>Peak Study Hub Open Day</h1>\n\n    </main>"),
    expected: { requiredTags: ["p"], htmlIncludes: ["Practical digital skills for confident learners."] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-section",
    title: "Group related content with section",
    scenario: "A section groups one topic and normally has its own heading.",
    supportDocument: ["Section heading: Practice Sessions"],
    goal: "Add a section element with an h2 heading inside main.",
    steps: ["Find the main element.", "Inside main, type <section></section>.", "Inside section, add <h2>Practice Sessions</h2>."],
    starterHtml: mainShell,
    expected: { requiredTags: ["section", "h2"], htmlIncludes: ["Practice Sessions"] },
    points: 15
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-header-footer",
    title: "Add header and footer",
    scenario: "Header and footer organise the start and end of a page.",
    supportDocument: ["Header text: Peak Study Hub Open Day", "Footer text: Peak Study Hub practice page"],
    goal: "Add header and footer elements to the page.",
    steps: ["Add a header before main.", "Place the h1 inside header.", "Add a footer before </body> with the footer text."],
    starterHtml: mainShell,
    expected: { requiredTags: ["header", "footer", "h1"], htmlIncludes: ["Peak Study Hub Open Day", "Peak Study Hub practice page"] },
    points: 15
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-comment",
    title: "Add an HTML comment",
    scenario: "A comment explains source code and is not shown on the web page.",
    supportDocument: ["Comment text: main content"],
    goal: "Add <!-- main content --> above the main element.",
    steps: ["Find the opening <main> tag.", "Click on the line above it.", "Type <!-- main content -->."],
    starterHtml: apexStarterHtml,
    expected: { htmlIncludes: ["<!-- main content -->"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-h3-h4",
    title: "Use h3 and h4 headings",
    scenario: "Lower-level headings organise smaller groups of content.",
    supportDocument: ["h3 text: Morning group", "h4 text: Teacher checks"],
    goal: "Add an h3 and h4 inside the welcome section.",
    steps: ["Find the welcome section.", "Below the h2, add <h3>Morning group</h3>.", "Below the paragraph, add <h4>Teacher checks</h4>."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["h3", "h4"], htmlIncludes: ["Morning group", "Teacher checks"] },
    points: 15
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-ul",
    title: "Create an unordered list",
    scenario: "An unordered list shows items where order is not important.",
    supportDocument: ["List items: Workbook, Calculator, Pen"],
    goal: "Add an unordered list of equipment items.",
    steps: ["Find the main element.", "Add <ul></ul> below the paragraph.", "Inside ul, add three li items: Workbook, Calculator, and Pen."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["ul", "li"], htmlIncludes: ["Workbook", "Calculator", "Pen"] },
    points: 15
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-ol",
    title: "Create an ordered list",
    scenario: "An ordered list shows steps that must be followed in sequence.",
    supportDocument: ["Steps: Open the page, Check the preview, Submit evidence"],
    goal: "Add an ordered list of three checking steps.",
    steps: ["Find the main element.", "Add <ol></ol> below the paragraph.", "Inside ol, add three li items in the order shown."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["ol", "li"], htmlIncludes: ["Open the page", "Check the preview", "Submit evidence"] },
    points: 15
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-meta-charset",
    title: "Declare the character set",
    scenario: "Character-set metadata tells the browser how to read letters, numbers, and symbols correctly. Metadata belongs inside head because it describes the page rather than appearing on it.",
    supportDocument: ["Metadata location: inside <head>", "Character set: UTF-8", "Element to create: <meta charset=\"UTF-8\">"],
    goal: "Add UTF-8 character-set metadata inside head.",
    steps: ["Find the opening and closing head tags.", "On a new line inside head, add a meta element.", "Give it the charset attribute with the value UTF-8."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["meta"], metadata: [{ charset: "UTF-8" }] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-meta-language",
    title: "Identify the page language",
    scenario: "The lang attribute identifies the page language for browsers, screen readers, and search tools. It belongs on the opening html tag.",
    supportDocument: ["Page language: English", "Language code: en", "Change the opening tag to <html lang=\"en\">"],
    goal: "Set English as the language of the HTML document.",
    steps: ["Find the opening html tag below the doctype.", "Add the lang attribute inside that opening tag.", "Use en as its value; do not add lang to body."],
    starterHtml: htmlShell,
    expected: { htmlLang: "en" },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-meta-viewport-name",
    title: "Name the viewport metadata",
    scenario: "A viewport meta element gives the browser instructions for displaying the page on different screen sizes. The name attribute identifies which browser setting the metadata controls.",
    supportDocument: ["Metadata location: inside <head>", "Attribute to add: name", "Attribute value: viewport"],
    goal: "Change the empty meta element into viewport metadata.",
    steps: ["Find <meta> inside head.", "Inside that tag, add name=\"viewport\".", "Leave the meta element inside head; its display instructions will be added in the next tasks."],
    starterHtml: htmlShell.replace("    <title>", "    <meta>\n    <title>"),
    expected: { requiredTags: ["meta"], metadata: [{ name: "viewport" }] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-meta-device-width",
    title: "Match the page to device width",
    scenario: "The content attribute stores the viewport instructions. width=device-width tells the browser to make the page viewport match the width of the student's device.",
    supportDocument: ["Meta name: viewport", "Attribute to add: content", "First content instruction: width=device-width"],
    goal: "Add the device-width instruction to the viewport metadata.",
    steps: ["Find <meta name=\"viewport\"> inside head.", "Add a content attribute to the same meta element.", "Set its value to width=device-width."],
    starterHtml: htmlShell.replace("    <title>", "    <meta name=\"viewport\">\n    <title>"),
    expected: { requiredTags: ["meta"], metadata: [{ name: "viewport", content: "width=device-width" }] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-meta-initial-scale",
    title: "Set the initial page scale",
    scenario: "initial-scale=1.0 tells the browser to open the page at its normal starting zoom. It is a second instruction in the same viewport content value.",
    supportDocument: ["Existing instruction: width=device-width", "Second instruction: initial-scale=1.0", "Separate the instructions with a comma"],
    goal: "Add the initial-scale instruction to the viewport metadata.",
    steps: ["Find the viewport meta element inside head.", "After width=device-width, type a comma and a space.", "Add initial-scale=1.0 inside the same content value."],
    starterHtml: htmlShell.replace("    <title>", "    <meta name=\"viewport\" content=\"width=device-width\">\n    <title>"),
    expected: { requiredTags: ["meta"], metadata: [{ name: "viewport", content: "width=device-width, initial-scale=1.0" }] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-metadata",
    title: "Consolidate page metadata",
    scenario: "A complete head can combine character encoding and responsive viewport instructions, while the html tag identifies the page language.",
    supportDocument: ["Language: en on the opening html tag", "Inside head: UTF-8 character-set metadata", "Inside head: viewport metadata using width=device-width and initial-scale=1.0"],
    goal: "Combine the language, charset, and complete viewport settings.",
    steps: ["Add lang=\"en\" to the opening html tag.", "Inside head, add <meta charset=\"UTF-8\">.", "Below it, add the viewport meta element with both content instructions practised earlier."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["meta"], htmlLang: "en", metadata: [{ charset: "UTF-8" }, { name: "viewport", content: "width=device-width, initial-scale=1.0" }] },
    points: 20
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-basic",
    title: "Milestone 1: Create the document frame",
    scenario: "Create the non-visible frame for a simple Staff Notice webpage before adding the letter itself.",
    supportDocument: ["First line: <!doctype html>", "Root element: html", "Page-information area: head", "Browser-tab title: Staff Notice"],
    goal: "Build the doctype, html, head, and title foundation.",
    steps: ["Add the doctype on line 1 and create the html element below it.", "Inside html, create head.", "Inside head, set the title to Staff Notice."],
    starterHtml: blankHtml,
    expected: { requiredTags: ["html", "head", "title"], htmlIncludes: ["<!doctype html>"], title: "Staff Notice" },
    points: 20
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-structured",
    title: "Milestone 2: Add the staff message",
    scenario: "Continue the Staff Notice webpage by adding the visible title and the first paragraph of the message.",
    supportDocument: ["Visible content belongs inside body.", "Inside body, create main.", "Main heading in h1: Message to Staff", "Paragraph below it: Please remember that the staff meeting begins at 3:30 pm on Friday."],
    goal: "Add body, main, the notice heading, and its paragraph.",
    steps: ["Inside html, add body after head.", "Inside body, create main and place an h1 inside it.", "Below the h1, add the supplied sentence in a p element."],
    starterHtml: `<!doctype html>\n<html>\n  <head>\n    <title>Staff Notice</title>\n  </head>\n\n</html>`,
    expected: {
      requiredTags: ["body", "main", "h1", "p"],
      htmlIncludes: ["Message to Staff", "Please remember that the staff meeting begins at 3:30 pm on Friday."],
      containedTags: [{ container: "body", tag: "main" }, { container: "main", tag: "h1" }, { container: "main", tag: "p" }],
      containedText: [{ container: "h1", text: "Message to Staff" }, { container: "main p", text: "Please remember that the staff meeting begins at 3:30 pm on Friday." }]
    },
    points: 20
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-headings",
    title: "Milestone 3: Organise the notice",
    scenario: "Give the Staff Notice clear page regions and add a separate section for preparation details.",
    supportDocument: ["Move the h1 into header.", "Keep the meeting paragraph inside main.", "Inside main, add a section with h2 text: Before the meeting", "Section paragraph: Bring your progress notes and one question.", "Footer text: School Office"],
    goal: "Organise the notice with header, main, section, h2, and footer.",
    steps: ["Create header before main and place the existing h1 inside it.", "Inside main, keep the meeting paragraph and add a section below it.", "Put the supplied h2 and paragraph inside section, then add footer after main."],
    starterHtml: `<!doctype html>\n<html>\n  <head>\n    <title>Staff Notice</title>\n  </head>\n  <body>\n    <h1>Message to Staff</h1>\n    <main>\n      <p>Please remember that the staff meeting begins at 3:30 pm on Friday.</p>\n    </main>\n  </body>\n</html>`,
    expected: {
      requiredTags: ["header", "main", "section", "h1", "h2", "p", "footer"],
      htmlIncludes: ["Before the meeting", "Bring your progress notes and one question.", "School Office"],
      containedTags: [{ container: "header", tag: "h1" }, { container: "main", tag: "section" }, { container: "section", tag: "h2" }, { container: "section", tag: "p" }],
      containedText: [{ container: "section h2", text: "Before the meeting" }, { container: "section p", text: "Bring your progress notes and one question." }, { container: "footer", text: "School Office" }]
    },
    points: 25
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-event",
    title: "Milestone 4: Add two useful lists",
    scenario: "Extend the Staff Notice with an equipment list where order is unimportant and an arrival checklist where order matters.",
    supportDocument: ["Under h2 Staff should bring, add an unordered list: Progress notes; Pen; Staff ID", "Under h2 On arrival, add an ordered list: Sign in; Collect the agenda; Take a seat"],
    goal: "Use ul for equipment and ol for ordered arrival steps.",
    steps: ["Inside main, add an h2 followed by a ul with the three equipment li items.", "Below it, add a second h2 followed by an ol.", "Add the three arrival li items in the supplied order."],
    starterHtml: `<!doctype html>\n<html>\n  <head><title>Staff Notice</title></head>\n  <body>\n    <main>\n      <h1>Message to Staff</h1>\n      <p>Please remember that the staff meeting begins at 3:30 pm on Friday.</p>\n    </main>\n  </body>\n</html>`,
    expected: {
      requiredTags: ["ul", "ol", "li"],
      htmlIncludes: ["Staff should bring", "Progress notes", "Pen", "Staff ID", "On arrival", "Sign in", "Collect the agenda", "Take a seat"],
      containedTags: [{ container: "main", tag: "ul" }, { container: "main", tag: "ol" }, { container: "ul", tag: "li" }, { container: "ol", tag: "li" }]
    },
    points: 25
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-clinic",
    title: "Consolidation 1: Build a student support page",
    scenario: "Build a complete small webpage for students who need help with practical work, using the document and content structures already practised.",
    supportDocument: ["Browser title: Student Support", "Main heading in h1: Practical Support Desk", "Introductory paragraph: Ask for help after checking your instructions and preview.", "Section heading in h2: What to bring", "Section paragraph: Bring your workbook and a screenshot of the problem."],
    goal: "Combine the document frame with a clear heading, paragraph, and section.",
    steps: ["Build doctype, html, head, title, and body.", "Inside body, create main with the supplied h1 and introductory paragraph.", "Below the paragraph, create section containing the supplied h2 and second paragraph."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "section", "h1", "h2", "p"],
      htmlIncludes: ["<!doctype html>", "Practical Support Desk", "Ask for help after checking your instructions and preview.", "What to bring", "Bring your workbook and a screenshot of the problem."],
      title: "Student Support",
      containedTags: [{ container: "body", tag: "main" }, { container: "main", tag: "h1" }, { container: "main", tag: "section" }, { container: "section", tag: "h2" }, { container: "section", tag: "p" }]
    },
    points: 40
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-support",
    title: "Consolidation 2: Build a revision checklist",
    scenario: "Build a revision webpage that combines page regions, explanatory text, and the two list types already practised.",
    supportDocument: ["Browser title and h1: Revision Checklist", "Header contains h1.", "Main paragraph: Complete these checks before submitting your work.", "Unordered list: Spelling; File name; Page preview", "Ordered list: Save the file; Open the preview; Submit evidence", "Footer text: ICT Department"],
    goal: "Combine structure, page regions, text, and both list types.",
    steps: ["Build the document frame and place h1 inside header.", "Inside main, add the supplied paragraph, then the ul and ol with their li items.", "Add the supplied footer after main."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "title", "body", "header", "main", "h1", "p", "ul", "ol", "li", "footer"],
      htmlIncludes: ["<!doctype html>", "Complete these checks before submitting your work.", "Spelling", "File name", "Page preview", "Save the file", "Open the preview", "Submit evidence", "ICT Department"],
      title: "Revision Checklist",
      containedTags: [{ container: "header", tag: "h1" }, { container: "body", tag: "main" }, { container: "main", tag: "ul" }, { container: "main", tag: "ol" }]
    },
    points: 50
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-practice-final",
    title: "Final foundation build: Staff training page",
    scenario: "Create a complete responsive Staff Training webpage from a clear content brief. This final task combines only skills practised earlier in this module.",
    supportDocument: ["Language: en", "Inside head: UTF-8 charset, complete responsive viewport, and title Staff Training", "Above main: comment main training content", "Header h1: Staff Training", "Main paragraph: Training begins in Room 4 at 9:00 am on Monday.", "Section h2: Preparation", "Unordered list: Staff ID; Notebook; Laptop", "Footer: School Office"],
    goal: "Build the complete staff training page from the supplied brief.",
    steps: ["Build the document frame, metadata, browser title, and language setting.", "Inside body, create header, the required comment, and main with its paragraph and preparation section.", "Inside section add the h2 and unordered list, then place the footer after main."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "meta", "title", "body", "header", "main", "section", "h1", "h2", "p", "ul", "li", "footer"],
      htmlIncludes: ["<!doctype html>", "<!-- main training content -->", "Training begins in Room 4 at 9:00 am on Monday.", "Preparation", "Staff ID", "Notebook", "Laptop", "School Office"],
      title: "Staff Training",
      htmlLang: "en",
      metadata: [{ charset: "UTF-8" }, { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
      containedTags: [{ container: "header", tag: "h1" }, { container: "body", tag: "main" }, { container: "main", tag: "section" }, { container: "section", tag: "h2" }, { container: "section", tag: "ul" }, { container: "ul", tag: "li" }],
      containedText: [{ container: "header h1", text: "Staff Training" }, { container: "footer", text: "School Office" }]
    },
    points: 70
  })
];

function mediaPractice(slug: string, title: string, heading: string, alt: string, caption: string): WebsiteAuthoringCard {
  return fullPagePractice("text-media", "Text and Images", {
    slug,
    title,
    heading,
    paragraph: "Peak students use media to understand practical tasks before building their own pages.",
    extraSupport: ["Choose an image and make its filename begin with student-activity before uploading it.", "Use the relative image path shown after upload.", `Alternative text: ${alt}`, `Caption: ${caption}`],
    tags: ["html", "head", "title", "body", "header", "main", "section", "h1", "p", "figure", "img", "figcaption"],
    expected: { uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt }], htmlIncludes: [caption] },
    points: 55
  });
}

const textMediaCards: WebsiteAuthoringCard[] = [
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-upload",
    title: "Upload an activity image",
    scenario: "Web authors give image files meaningful names before uploading and using them in HTML.",
    supportDocument: ["Choose a JPG, PNG, WEBP, GIF, AVIF, or SVG image from your device.", "Before uploading, make its filename begin with student-activity. Keep its existing file extension.", "The editor will display the image's relative path after upload."],
    goal: "Upload an image whose filename begins with student-activity.",
    steps: ["Choose an image on your device and rename it so the filename begins with student-activity.", "Click Add activity file and select the renamed image.", "Read the relative path displayed under the button."],
    starterHtml: apexPageHtml,
    expected: { uploadedFile: { kind: "image", nameStartsWith: "student-activity" } },
    points: 10
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-img",
    title: "Insert an image",
    scenario: "The img element displays an uploaded image when src points to the correct relative path.",
    supportDocument: ["Use the exact relative path displayed after uploading your student-activity image."],
    goal: "Add an img element using the uploaded image path.",
    steps: ["Upload your student-activity image first.", "Inside main, add an img element.", "Copy the displayed relative path into its src attribute and check that the preview shows your image."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["img"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true }] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-alt",
    title: "Add alternative text",
    scenario: "The alt attribute describes an image for users who cannot see it.",
    supportDocument: ["Upload your student-activity image if needed.", "Use its displayed relative path.", "Alternative text: Peak study practice card"],
    goal: "Set the image alt text to Peak study practice card.",
    steps: ["Upload your student-activity image if it is not already listed.", "Find the img element and place the displayed path in src.", "Add alt=\"Peak study practice card\" in the same img tag."],
    starterHtml: insertIntoSessionsSection(`        <img src="">`),
    expected: { requiredTags: ["img"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak study practice card" }] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-figure",
    title: "Group the image with figure",
    scenario: "The figure element groups media with its caption.",
    supportDocument: ["Upload your student-activity image if needed and use its displayed path.", "Use <figure> around the image."],
    goal: "Wrap the image in a figure element.",
    steps: ["Upload your student-activity image if it is not already listed.", "Find the img element and place the displayed path in src.", "Place <figure> before it and </figure> after it."],
    starterHtml: insertIntoSessionsSection(`        <img src="" alt="Peak study practice card">`),
    expected: { requiredTags: ["figure", "img"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak study practice card" }] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-figcaption",
    title: "Add a caption",
    scenario: "The figcaption element explains the image.",
    supportDocument: ["Upload your student-activity image if needed and use its displayed path.", "Caption: Guided practice workspace"],
    goal: "Add Guided practice workspace inside figcaption.",
    steps: ["Upload your student-activity image if it is not already listed and place its displayed path in src.", "Find the figure element.", "Below the img, type <figcaption>Guided practice workspace</figcaption> and keep it inside figure."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="" alt="Peak study practice card">
        </figure>`),
    expected: { requiredTags: ["figure", "img", "figcaption"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak study practice card" }], htmlIncludes: ["Guided practice workspace"] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-size",
    title: "Set image size attributes",
    scenario: "Width and height attributes reserve space for an image and help avoid layout jumps.",
    supportDocument: ["Upload your student-activity image if needed and use its displayed path.", "Width: 320", "Height: 180"],
    goal: "Add width and height attributes to the img element.",
    steps: ["Upload your student-activity image if it is not already listed and place its displayed path in src.", "Find the img tag.", "Add width=\"320\" and height=\"180\" while keeping the alt text."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="" alt="Peak study practice card">
          <figcaption>Guided practice workspace</figcaption>
        </figure>`),
    expected: { requiredTags: ["img"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak study practice card" }], htmlIncludes: ["width=\"320\"", "height=\"180\""] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-section",
    title: "Create a media section",
    scenario: "Media should sit inside a clear section with a heading.",
    supportDocument: ["Upload your student-activity image if needed and use its displayed path.", "Section heading: Visual preview", "Caption: Guided practice workspace"],
    goal: "Create a section containing h2, figure, img, and figcaption.",
    steps: ["Upload your student-activity image if it is not already listed and place its displayed path in src.", "Inside main, add a section with <h2>Visual preview</h2>.", "Move or add the figure inside the section."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="" alt="Peak study practice card">
          <figcaption>Guided practice workspace</figcaption>
        </figure>`),
    expected: { requiredTags: ["section", "h2", "figure", "img", "figcaption"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak study practice card" }], htmlIncludes: ["Visual preview", "Guided practice workspace"] },
    points: 20
  }),
  mediaPractice("practice-card", "Practical Task 1: Build an image card", "Peak Study Practice Feature", "Peak practice feature card", "Students practise one skill at a time."),
  mediaPractice("practice-gallery", "Practical Task 2: Build a gallery section", "Peak Gallery", "Peak Study gallery practice card", "Learners review examples before attempting a task."),
  mediaPractice("practice-news", "Practical Task 3: Build a news media page", "Peak News Update", "Peak Study news image", "The image supports the news paragraph."),
  mediaPractice("practice-course", "Practical Task 4: Build a course media page", "Peak Course Preview", "Peak Study course preview image", "The preview helps students choose a practice room."),
  mediaPractice("practice-revision", "Practical Task 5: Build a revision media page", "Peak Revision Image", "Peak Study revision image", "The image gives context for the revision task."),
  mediaPractice("practice-accessible", "Practical Task 6: Build an accessible media page", "Peak Accessible Media", "Peak Study accessible practice image", "Useful captions and alt text make pages clearer."),
  mediaPractice("practice-final", "Practical Task 7: Final text and image build", "Peak Media Evidence", "Peak Study media evidence card", "The evidence image supports the written page content.")
];

function navPractice(slug: string, title: string, heading: string, links: Array<{ text: string; href: string }>): WebsiteAuthoringCard {
  return fullPagePractice("links-navigation", "Links and Navigation", {
    slug,
    title,
    heading,
    paragraph: "Peak Study learners use navigation links to move between practice pages.",
    extraSupport: links.map((link) => `Link: ${link.text} -> ${link.href}`),
    tags: ["html", "head", "title", "body", "header", "nav", "a", "main", "h1", "p"],
    expected: { links },
    points: 50
  });
}

const linksNavigationCards: WebsiteAuthoringCard[] = [
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-basic",
    title: "Create a basic link",
    scenario: "The a element creates a hyperlink.",
    supportDocument: ["Link text: Home", "Href: index.html"],
    goal: "Add a Home link to index.html.",
    steps: ["Find the nav element.", "Type <a href=\"index.html\">Home</a> inside nav.", "Check that the link text appears in the preview."],
    starterHtml: apexStarterHtml.replace("<main>", "<nav>\n\n    </nav>\n    <main>"),
    expected: { requiredTags: ["a"], links: [{ text: "Home", href: "index.html" }] },
    points: 10
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-nav",
    title: "Create a navigation area",
    scenario: "The nav element groups important page links.",
    supportDocument: ["Navigation link: Home -> index.html"],
    goal: "Place the Home link inside a nav element.",
    steps: ["Add <nav></nav> after header.", "Inside nav, add the Home link.", "Keep nav outside main."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["nav", "a"], links: [{ text: "Home", href: "index.html" }] },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-target",
    title: "Create a bookmark target",
    scenario: "An id attribute marks a place on the page that a link can jump to.",
    supportDocument: ["Target id: sessions"],
    goal: "Add id=\"sessions\" to the Practice Sessions section.",
    steps: ["Find the section for Practice Sessions.", "Change the opening section tag to <section id=\"sessions\">.", "Do not add the id to the h2."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["section"], htmlIncludes: ["id=\"sessions\""] },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-bookmark",
    title: "Link to a page section",
    scenario: "A link beginning with # jumps to an id on the same page.",
    supportDocument: ["Link text: Sessions", "Href: #sessions"],
    goal: "Add a Sessions link that jumps to #sessions.",
    steps: ["Find the nav element.", "Add <a href=\"#sessions\">Sessions</a>.", "Check that the href includes the # symbol."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["a"], links: [{ text: "Sessions", href: "#sessions" }] },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-email",
    title: "Create an email link",
    scenario: "A mailto link opens an email program for the user.",
    supportDocument: ["Link text: Email Peak Study", "Href: mailto:hello@peakstudyhub.example"],
    goal: "Add an email link to the footer.",
    steps: ["Find the footer before </body>.", "Inside footer, type <a href=\"mailto:hello@peakstudyhub.example\">Email Peak Study</a>.", "Check the href starts with mailto:."],
    starterHtml: apexPageWithFooterHtml,
    expected: {
      requiredTags: ["a", "footer"],
      links: [{ text: "Email Peak Study", href: "mailto:hello@peakstudyhub.example" }],
      containedLinks: [{ container: "footer", text: "Email Peak Study", href: "mailto:hello@peakstudyhub.example" }]
    },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-new-tab",
    title: "Open a link in a new tab",
    scenario: "The target attribute can open a link in a new browser tab.",
    supportDocument: ["Link text: Peak Study guide", "Href: https://www.peakstudyhub.com/subjects/ict/website-authoring", "Attribute: target=\"_blank\""],
    goal: "Add a guide link that opens in a new tab.",
    steps: ["Find the nav or footer.", "Add the link with the correct href.", "Add target=\"_blank\" inside the opening a tag."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["a"], links: [{ text: "Peak Study guide", href: "https://www.peakstudyhub.com/subjects/ict/website-authoring" }], htmlIncludes: ["target=\"_blank\""] },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-image",
    title: "Use an image as a link",
    scenario: "An img element can sit inside an a element to make the image clickable.",
    supportDocument: ["Choose an image whose filename begins with student-activity and upload it.", "Use the relative path displayed after upload.", "Href: index.html", "Alt text: Peak Study home card"],
    goal: "Create a linked image that returns to index.html.",
    steps: ["Upload your student-activity image first.", "Create an a element with href=\"index.html\".", "Place an img element inside the link, use the displayed path in src, and add alt=\"Peak Study home card\"."],
    starterHtml: apexPageHtml,
    expected: {
      requiredTags: ["a", "img"],
      uploadedFile: { kind: "image", nameStartsWith: "student-activity" },
      links: [{ href: "index.html" }],
      images: [{ srcFromUploadedImage: true, alt: "Peak Study home card" }],
      linkedImages: [{ href: "index.html", srcFromUploadedImage: true, alt: "Peak Study home card" }]
    },
    points: 20
  }),
  navPractice("practice-three-links", "Practical Task 1: Build three page links", "Peak Study Link Practice", [{ text: "Home", href: "index.html" }, { text: "ICT", href: "ict.html" }, { text: "Business", href: "business.html" }]),
  navPractice("practice-bookmarks", "Practical Task 2: Build bookmark navigation", "Peak Study Bookmark Page", [{ text: "Top", href: "#top" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }]),
  navPractice("practice-footer-links", "Practical Task 3: Build footer links", "Peak Study Footer Links", [{ text: "Contact", href: "contact.html" }, { text: "Privacy", href: "privacy.html" }, { text: "Email Peak Study", href: "mailto:hello@peakstudyhub.example" }]),
  navPractice("practice-folder-links", "Practical Task 4: Build folder links", "Peak Study Resource Page", [{ text: "Student guide", href: "docs/student-guide.html" }, { text: "Practice file", href: "files/practice.csv" }, { text: "Main index", href: "../index.html" }]),
  navPractice("practice-action-links", "Practical Task 5: Build action links", "Peak Action Links", [{ text: "Start practice", href: "start.html" }, { text: "View modules", href: "modules.html" }, { text: "Ask for help", href: "help.html" }]),
  navPractice("practice-link-list", "Practical Task 6: Build a link list", "Peak Link List", [{ text: "Spreadsheets", href: "spreadsheets.html" }, { text: "Documents", href: "documents.html" }, { text: "Web authoring", href: "web-authoring.html" }]),
  navPractice("practice-final", "Practical Task 7: Final navigation build", "Peak Study Navigation Evidence", [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }, { text: "Email Peak Study", href: "mailto:hello@peakstudyhub.example" }])
];

function tablePractice(slug: string, title: string, heading: string, headers: string[]): WebsiteAuthoringCard {
  return fullPagePractice("tables", "HTML Tables", {
    slug,
    title,
    heading,
    paragraph: "The table should present the source data clearly.",
    extraSupport: ["Caption: Peak comparison table", `Headers: ${headers.join(", ")}`, "Use <tr> rows, <th> headings, and <td> data cells.", "Rows: Plan/Ready/Green; Practice/In progress/Amber; Review/Needed/Red"],
    tags: ["html", "head", "title", "body", "main", "h1", "p", "table", "caption", "tr", "th", "td"],
    expected: { tableHeaders: headers, htmlIncludes: ["Peak comparison table", "Plan", "Practice", "Review"] },
    points: 55
  });
}

const tableCards: WebsiteAuthoringCard[] = [
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-table",
    title: "Create a table element",
    scenario: "The table element contains all rows and cells.",
    supportDocument: ["Use <table></table> inside main."],
    goal: "Add a table element below the page heading.",
    steps: ["Find the main element.", "Below the h1, type <table></table>.", "Keep the table inside main."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <h1>Peak Workshop Timetable</h1>\n\n    </main>"),
    expected: { requiredTags: ["table"] },
    points: 10
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-row",
    title: "Add a table row",
    scenario: "The tr element creates one row in a table.",
    supportDocument: ["Add one row inside the table."],
    goal: "Add a tr element inside the table.",
    steps: ["Find the table element.", "Click between <table> and </table>.", "Type <tr></tr>."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <table>\n\n      </table>\n    </main>"),
    expected: { requiredTags: ["table", "tr"] },
    points: 10
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-th",
    title: "Add heading cells",
    scenario: "The th element is used for table headings.",
    supportDocument: ["Headings: Session, Room, Time"],
    goal: "Add three th cells in the first row.",
    steps: ["Find the first tr inside the table.", "Inside it, add th cells.", "Use Session, Room, and Time as the headings."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <table>\n        <tr>\n\n        </tr>\n      </table>\n    </main>"),
    expected: { requiredTags: ["table", "tr", "th"], tableHeaders: ["Session", "Room", "Time"] },
    points: 15
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-td",
    title: "Add data cells",
    scenario: "The td element stores ordinary table data.",
    supportDocument: ["First row: Spreadsheet Sprint, Lab 1, 09:30"],
    goal: "Add a data row using td cells.",
    steps: ["Inside the table, add a new tr below the heading row.", "Inside the new row, add three td cells.", "Type the first row values in the same order as the headings."],
    starterHtml: tableStarterHtml.replace("<tr>\n          <td>Spreadsheet Sprint</td>\n          <td>Lab 1</td>\n          <td>09:30</td>\n        </tr>", ""),
    expected: { requiredTags: ["table", "tr", "td"], htmlIncludes: ["Spreadsheet Sprint", "Lab 1", "09:30"] },
    points: 15
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-caption",
    title: "Add a table caption",
    scenario: "A caption gives the table a clear title.",
    supportDocument: ["Caption: Peak workshop times"],
    goal: "Add a caption directly inside the table.",
    steps: ["Find the opening table tag.", "On the next line, type <caption>Peak workshop times</caption>.", "Keep the caption before the first tr."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["caption"], htmlIncludes: ["Peak workshop times"] },
    points: 15
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-scope",
    title: "Add scope to heading cells",
    scenario: "The scope attribute helps identify whether a heading describes a row or column.",
    supportDocument: ["Use scope=\"col\" on each heading cell."],
    goal: "Add scope=\"col\" to the Session, Room, and Time th tags.",
    steps: ["Find each th tag in the heading row.", "Add scope=\"col\" inside each opening th tag.", "Check that the heading text remains unchanged."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["th"], htmlIncludes: ["scope=\"col\"", "Session", "Room", "Time"] },
    points: 20
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-colspan",
    title: "Use colspan",
    scenario: "The colspan attribute lets one cell stretch across more than one column.",
    supportDocument: ["Title cell text: Peak Weekly Scores", "Attribute: colspan=\"3\""],
    goal: "Add a title row that spans three columns.",
    steps: ["Add a new row at the top of the table.", "Inside it, add one th cell with colspan=\"3\".", "Type Peak Weekly Scores inside the spanning heading cell."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["table", "tr", "th"], htmlIncludes: ["colspan=\"3\"", "Peak Weekly Scores"] },
    points: 20
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-rowspan",
    title: "Use rowspan",
    scenario: "The rowspan attribute lets one cell extend vertically through more than one row.",
    supportDocument: ["Activity cell text: Spreadsheet Sprint", "Attribute: rowspan=\"2\""],
    goal: "Make one activity cell span two timetable rows.",
    steps: ["Find the first Spreadsheet Sprint td opening tag.", "Add rowspan=\"2\" inside that opening td tag.", "Add a second data row for another room and time, without repeating the activity cell."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["table", "tr", "td"], htmlIncludes: ["rowspan=\"2\"", "Spreadsheet Sprint"] },
    points: 20
  }),
  moduleCard("tables", "HTML Tables", {
    id: "web-tables-spans-review",
    title: "Practise row and column spans together",
    scenario: "A clear timetable can use colspan for a title row and rowspan for a repeated activity.",
    supportDocument: ["Title: Peak Workshop Programme", "Use colspan=\"3\" on the title heading", "Use rowspan=\"2\" on the Spreadsheet Sprint activity cell"],
    goal: "Use colspan and rowspan correctly in one table.",
    steps: ["Add a title row containing one th with colspan=\"3\".", "Type Peak Workshop Programme in that heading.", "Add rowspan=\"2\" to the Spreadsheet Sprint td cell.", "Add the second room-and-time row without duplicating Spreadsheet Sprint."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["table", "tr", "th", "td"], htmlIncludes: ["colspan=\"3\"", "rowspan=\"2\"", "Peak Workshop Programme", "Spreadsheet Sprint"] },
    points: 25
  }),
  tablePractice("practice-basic", "Practical Task 1: Build a timetable", "Peak Workshop Timetable", ["Session", "Room", "Time"]),
  tablePractice("practice-scores", "Practical Task 2: Build a scores table", "Peak Weekly Scores", ["Rank", "Learner", "Score"]),
  tablePractice("practice-comparison", "Practical Task 3: Build a comparison table", "Peak Option Comparison", ["Feature", "Basic", "Premium"]),
  tablePractice("practice-register", "Practical Task 4: Build a register table", "Peak Register", ["Name", "Class", "Present"]),
  tablePractice("practice-equipment", "Practical Task 5: Build an equipment table", "Peak Equipment List", ["Item", "Quantity", "Needed"]),
  tablePractice("practice-feedback", "Practical Task 6: Build a feedback table", "Peak Feedback Summary", ["Area", "Rating", "Action"]),
  tablePractice("practice-final", "Practical Task 7: Final table build", "Peak Table Evidence", ["Activity", "Room", "Time"])
];

type GuidedCssSpec = {
  id: string;
  title: string;
  selector: string;
  property: string;
  value: string;
  explanation: string;
  starterHtml?: string;
  starterCss?: string;
};

function guidedCssCard(spec: GuidedCssSpec): WebsiteAuthoringCard {
  return moduleCard("css-layout", "CSS Layout", {
    id: spec.id,
    title: spec.title,
    scenario: spec.explanation,
    supportDocument: [
      `Selector: ${spec.selector} - chooses the element to style.`,
      `Property: ${spec.property} - identifies what will change.`,
      `Value: ${spec.value} - states how it will change.`,
      `Complete declaration: ${spec.property}: ${spec.value};`
    ],
    goal: `Use CSS to apply ${spec.property}: ${spec.value}; to ${spec.selector}.`,
    steps: [
      "Open the CSS tab. Do not type this rule in the HTML tab.",
      `Type ${spec.selector}, then add an opening { and a closing } brace.`,
      `Between the braces, type ${spec.property}: ${spec.value};`,
      "Read the rule as: select the element, change the property, use the stated value.",
      "Check the visual preview and identify the change before checking the result."
    ],
    starterHtml: spec.starterHtml || apexPageHtml,
    starterCss: spec.starterCss || "",
    expected: { cssIncludes: [spec.selector, spec.property, spec.value] },
    points: 15
  });
}

function cssPractice(
  slug: string,
  title: string,
  heading: string,
  cssParts: string[],
  purpose: string,
  starterHtml = apexPageHtml
): WebsiteAuthoringCard {
  return moduleCard("css-layout", "CSS Layout", {
    id: `web-css-layout-${slug}`,
    title,
    scenario: purpose,
    supportDocument: [
      `Page heading already supplied in HTML: ${heading}`,
      `CSS selectors, properties, and values to use: ${cssParts.join(", ")}`,
      "Work only in the CSS tab unless the task specifically tells you to add a class or id in HTML.",
      "After each rule, check which visible element changed and why."
    ],
    goal: `Style the supplied ${heading} page using the listed CSS requirements.`,
    steps: [
      "Preview the supplied HTML before adding CSS so you know its starting appearance.",
      "Open the CSS tab and create one rule at a time.",
      "For each rule, type the selector first, then place property: value; declarations between braces.",
      "Preview after every rule. If the expected element does not change, check the selector and punctuation.",
      "Use Check final result only after every listed CSS requirement is present."
    ],
    starterHtml: starterHtml.split("Peak Study Hub Open Day").join(heading),
    starterCss: "",
    expected: { cssIncludes: cssParts },
    points: 40
  });
}

const cssCards: WebsiteAuthoringCard[] = [
  guidedCssCard({
    id: "web-css-rule-anatomy",
    title: "Build your first CSS rule",
    selector: "p",
    property: "color",
    value: "#334155",
    explanation: "A CSS rule has a selector and a declaration. The selector chooses an element; the property and value describe the visual change."
  }),
  guidedCssCard({
    id: "web-css-background",
    title: "Set the page background",
    selector: "body",
    property: "background-color",
    value: "#f1f5f9",
    explanation: "background-color fills the area behind an element. Styling body changes the background behind the whole visible page."
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-style",
    title: "Recognise internal CSS",
    scenario: "CSS can be written in a style element inside head. In this practice app, later tasks use the separate CSS tab so the HTML structure and CSS rules remain easy to inspect.",
    supportDocument: ["Required tag: <style></style>", "Place style inside head, not body.", "Code between <style> and </style> is CSS, not visible page text."],
    goal: "Add a style element inside head.",
    steps: ["Stay on the HTML tab for this task.", "Find </head>, which closes the page-information area.", "Add <style></style> immediately before </head>.", "Do not place the style element inside body; body contains visible page content.", "Check the result, then notice where internal CSS belongs in a complete document."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["style"] },
    points: 10
  }),
  guidedCssCard({
    id: "web-css-body",
    title: "Style the body",
    selector: "body",
    property: "font-family",
    value: "Arial, sans-serif",
    explanation: "A rule for body can give all visible text a consistent typeface. The second font is a fallback if Arial is unavailable."
  }),
  guidedCssCard({
    id: "web-css-color",
    title: "Change heading colour",
    selector: "h1",
    property: "color",
    value: "#0f6f8c",
    explanation: "The color property changes the foreground colour of text. A hexadecimal value beginning with # identifies the exact colour."
  }),
  guidedCssCard({
    id: "web-css-font-size",
    title: "Change heading size",
    selector: "h1",
    property: "font-size",
    value: "32px",
    explanation: "font-size controls the size of text. px is a fixed screen unit, so 32px makes the main heading clearly larger than paragraph text."
  }),
  guidedCssCard({
    id: "web-css-line-height",
    title: "Improve paragraph readability",
    selector: "p",
    property: "line-height",
    value: "1.6",
    explanation: "line-height controls the vertical space between lines of text. A unit-free value scales with the paragraph's font size."
  }),
  guidedCssCard({
    id: "web-css-text-align",
    title: "Align the main heading",
    selector: "h1",
    property: "text-align",
    value: "center",
    explanation: "text-align controls the horizontal alignment of inline content inside an element. Here it centres the h1 text within its available width."
  }),
  guidedCssCard({
    id: "web-css-padding",
    title: "Add space inside a section",
    selector: "section",
    property: "padding",
    value: "20px",
    explanation: "Padding creates space inside the border, between the section edge and its content. It does not separate the section from neighbouring elements."
  }),
  guidedCssCard({
    id: "web-css-margin",
    title: "Add space outside a section",
    selector: "section",
    property: "margin",
    value: "24px 0",
    explanation: "Margin creates space outside an element's border. The first value sets top and bottom margin; the second sets left and right margin."
  }),
  guidedCssCard({
    id: "web-css-border",
    title: "Draw a section border",
    selector: "section",
    property: "border",
    value: "2px solid #0f6f8c",
    explanation: "The border shorthand combines width, line style, and colour. The border appears between the element's padding and margin."
  }),
  guidedCssCard({
    id: "web-css-radius",
    title: "Round the section corners",
    selector: "section",
    property: "border-radius",
    value: "6px",
    explanation: "border-radius rounds an element's corners. It changes the shape of the border without changing the content or spacing."
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-class",
    title: "Use a class selector",
    scenario: "A class lets CSS target selected elements without changing every element of the same tag type. A class name is added in HTML and selected with a full stop in CSS.",
    supportDocument: ["HTML: <section class=\"notice-card\">", "CSS selector: .notice-card", "The full stop belongs only in the CSS selector."],
    goal: "Add class=\"notice-card\" to a section and style .notice-card.",
    steps: ["In the HTML tab, add class=\"notice-card\" to the opening section tag.", "Do not add the full stop to the HTML class value.", "Open the CSS tab and create a .notice-card rule; the full stop tells CSS to find that class.", "Add padding: 20px; between the braces.", "Preview and confirm that only the selected section gains inner spacing."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { htmlIncludes: ["class=\"notice-card\""], cssIncludes: [".notice-card", "padding"] },
    points: 20
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-id",
    title: "Use an id selector",
    scenario: "An id identifies one unique element on a page. CSS selects an id by placing # before the id name.",
    supportDocument: ["HTML: <header id=\"hero\">", "CSS selector: #hero", "Use a class for repeated styling and an id for one unique element."],
    goal: "Add id=\"hero\" to the header and style #hero.",
    steps: ["In the HTML tab, find the opening header tag.", "Change it to <header id=\"hero\"> without changing the closing tag.", "Open the CSS tab and add a #hero rule.", "Add background-color: #e0f2fe; inside the rule.", "Preview and confirm that the unique header is targeted."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { htmlIncludes: ["id=\"hero\""], cssIncludes: ["#hero", "background-color", "#e0f2fe"] },
    points: 20
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-box",
    title: "Combine the CSS box model",
    scenario: "Every element is treated as a box. Content sits in the centre, padding adds inner space, border draws the edge, and margin adds outer space.",
    supportDocument: ["Inside to outside: content -> padding -> border -> margin", "section padding: 20px", "section border: 2px solid #0f6f8c", "section margin: 24px 0"],
    goal: "Combine padding, border, and margin in one section rule.",
    steps: ["Open the CSS tab and create a section rule.", "Add padding: 20px; to create space inside the section.", "Add border: 2px solid #0f6f8c; to make the section edge visible.", "Add margin: 24px 0; to separate the section from nearby content.", "Preview and point out the inner padding and outer margin before checking."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["section", "margin", "padding", "border"] },
    points: 20
  }),
  guidedCssCard({
    id: "web-css-width",
    title: "Limit the content width",
    selector: "main",
    property: "max-width",
    value: "900px",
    explanation: "max-width prevents content from becoming too wide on large screens while still allowing it to shrink on narrower screens."
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-flex",
    title: "Use flex layout",
    scenario: "display: flex changes how the direct children of an element are arranged. On nav, the links become flexible items in a row; gap adds consistent space between them.",
    supportDocument: ["Parent selector: nav", "First declaration: display: flex;", "Second declaration: gap: 16px;", "The nav is the flex container; its links are flex items."],
    goal: "Style the nav element with flex layout.",
    steps: ["Preview the navigation before styling it.", "Open CSS and create a nav rule.", "Add display: flex; to arrange the direct child links in a row.", "Add gap: 16px; to create equal space between links.", "Preview again and explain which element is the container and which elements are the items."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["nav", "display", "flex", "gap", "16px"] },
    points: 20
  }),
  guidedCssCard({
    id: "web-css-link-decoration",
    title: "Remove link underlines",
    selector: "nav a",
    property: "text-decoration",
    value: "none",
    explanation: "A descendant selector uses a space. nav a selects links inside nav without changing links elsewhere on the page."
  }),
  guidedCssCard({
    id: "web-css-hover",
    title: "Add a link hover state",
    selector: "nav a:hover",
    property: "color",
    value: "#d97706",
    explanation: ":hover is a pseudo-class. The rule applies only while the pointer is over a navigation link, giving the user interaction feedback."
  }),
  cssPractice("practice-colour", "Milestone 1: Combine colours and type", "Peak Colour Practice", ["body", "font-family", "background-color", "h1", "color", "font-size"], "Combine the first text and colour properties on a supplied page. Keep each selector in its own clear rule."),
  cssPractice("practice-spacing", "Milestone 2: Build a readable content width", "Peak Spacing Practice", ["main", "max-width", "margin", "section", "padding"], "Limit long lines and use the box model to create readable space around the page content."),
  cssPractice("practice-nav", "Milestone 3: Style navigation", "Peak Navigation Style", ["nav", "display", "flex", "gap", "nav a", "text-decoration", "nav a:hover"], "Turn the existing navigation into a clear row of links and add visible feedback when a user points to a link."),
  cssPractice("practice-card", "Milestone 4: Style a content card", "Peak Card Style", [".notice-card", "border", "padding", "border-radius", "box-shadow"], "Apply several box properties to one selected section so it reads as a distinct information card.", apexPageHtml.replace('<section id="sessions">', '<section id="sessions" class="notice-card">')),
  cssPractice("practice-image", "Milestone 5: Make an image responsive", "Peak Image Style", ["img", "max-width", "100%", "height", "auto", "border-radius"], "Use max-width and automatic height so an image can shrink with its container without being stretched. The practice image is already supplied in HTML; this task changes only its CSS.", insertIntoSessionsSection('        <img src="/icon.svg" alt="Peak Study Hub practice icon">')),
  cssPractice("practice-table", "Milestone 6: Style a data table", "Peak Table Style", ["table", "border-collapse", "th", "td", "border", "padding"], "Make table data easier to scan by joining adjacent borders and adding space inside heading and data cells.", tableStarterHtml),
  fullPagePractice("css-layout", "CSS Layout", {
    slug: "practice-final",
    title: "Final CSS build: Style a complete practice page",
    heading: "Peak CSS Evidence",
    paragraph: "Peak students practise the page, then check the browser preview.",
    extraSupport: [
      "Link: Start practice -> practice.html",
      "CSS requirements: body font-family and background-color; main max-width and centred margin; nav flex and gap; section padding and border; h1 color; nav link hover colour."
    ],
    tags: ["html", "head", "title", "body", "header", "nav", "a", "main", "section", "h1", "p"],
    expected: {
      links: [{ text: "Start practice", href: "practice.html" }],
      cssIncludes: ["body", "font-family", "background-color", "main", "max-width", "margin", "nav", "display", "flex", "gap", "section", "padding", "border", "h1", "color", "nav a:hover"]
    },
    points: 70
  })
];

function examPractice(slug: string, title: string, heading: string): WebsiteAuthoringCard {
  return fullPagePractice("exam-build", "Exam Website Build", {
    slug,
    title,
    heading,
    paragraph: "Practical digital skills for confident learners.",
    extraSupport: [
      "Navigation: Home/index.html, Sessions/#sessions, Register/#register, Contact/contact.html",
      "Choose an image and make its filename begin with student-activity before uploading it.",
      "Use the relative image path displayed after upload.",
      `Image alt text: ${heading} practice image`,
      "Table caption: Peak session timetable",
      "Table headings: Activity, Room, Time",
      "Rows: Spreadsheet/Lab 1/09:00; Documents/Lab 2/10:00; Websites/Lab 3/11:00",
      "CSS: body font-family, main max-width, nav display flex, section padding, img max-width, table border"
    ],
    tags: ["html", "head", "meta", "title", "body", "header", "nav", "a", "main", "section", "h1", "h2", "p", "figure", "img", "figcaption", "table", "caption", "tr", "th", "td", "footer"],
    expected: {
      links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }, { text: "Contact", href: "contact.html" }],
      uploadedFile: { kind: "image", nameStartsWith: "student-activity" },
      images: [{ srcFromUploadedImage: true, alt: `${heading} practice image` }],
      tableHeaders: ["Activity", "Room", "Time"],
      metadata: [{ charset: "UTF-8" }, { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
      htmlIncludes: ["Peak session timetable", "Spreadsheet", "Documents", "Websites"],
      cssIncludes: ["body", "font-family", "main", "max-width", "nav", "display", "flex", "section", "padding", "img", "max-width", "table", "border"]
    },
    points: 90
  });
}

const examBuildCards: WebsiteAuthoringCard[] = [
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-read-brief",
    title: "Identify the page requirements",
    scenario: "Before building, identify title, headings, links, media, table data, and styles from the support document.",
    supportDocument: ["Project: Peak Study Hub Open Day", "Required parts: title, heading, subtitle, nav links, image, table, footer, CSS."],
    goal: "Add an HTML comment listing the required page parts.",
    steps: ["Read the support document.", "At the top of body, add a short HTML comment.", "Include title, links, image, table, and CSS in the comment."],
    starterHtml: htmlShell,
    expected: { htmlIncludes: ["<!--", "title", "links", "image", "table", "CSS"] },
    points: 15
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-metadata",
    title: "Prepare the document metadata",
    scenario: "Apply the metadata skills practised in HTML Foundations to prepare the Open Day page before adding visible content.",
    supportDocument: ["All three elements belong inside head.", "UTF-8 tells the browser how to read characters.", "The viewport must match device width and start at normal scale.", "Browser-tab title: Peak Study Hub Open Day"],
    goal: "Consolidate the known charset, viewport, and title settings inside head.",
    steps: ["Inside head, add UTF-8 character-set metadata.", "Below it, add viewport metadata with width=device-width and initial-scale=1.0.", "Set the title element to Peak Study Hub Open Day."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["meta", "title"], metadata: [{ charset: "UTF-8" }, { name: "viewport", content: "width=device-width, initial-scale=1.0" }], title: "Peak Study Hub Open Day" },
    points: 20
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-frame",
    title: "Build the page frame",
    scenario: "A longer page is easier to complete when header, nav, main, sections, and footer are planned first.",
    supportDocument: ["Required frame: header, nav, main, two sections, footer", "Section ids: sessions and register"],
    goal: "Create the structural frame of the page.",
    steps: ["Add header, nav, main, and footer inside body.", "Inside main, add two section elements.", "Give the sections id=\"sessions\" and id=\"register\"."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["header", "nav", "main", "section", "footer"], htmlIncludes: ["id=\"sessions\"", "id=\"register\""] },
    points: 25
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-navigation",
    title: "Add navigation links",
    scenario: "Exam-style pages often require internal and file links to be accurate.",
    supportDocument: ["Home -> index.html", "Sessions -> #sessions", "Register -> #register", "Contact -> contact.html"],
    goal: "Add the four required navigation links.",
    steps: ["Find nav.", "Add each link in the order shown.", "Check each href exactly matches the support document."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["nav", "a"], links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }, { text: "Contact", href: "contact.html" }] },
    points: 25
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-media",
    title: "Add accessible media",
    scenario: "Images need upload, src, alt text, and caption so they work online and remain accessible.",
    supportDocument: ["Choose an image whose filename begins with student-activity and upload it.", "Use the relative path displayed after upload.", "Alt text: Peak Study open day practice image", "Caption: Students practise before the final check."],
    goal: "Add a figure with image and caption.",
    steps: ["Upload the image.", "Add figure, img, and figcaption inside main.", "Use the uploaded path and exact alt text."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["figure", "img", "figcaption"], uploadedFile: { kind: "image", nameStartsWith: "student-activity" }, images: [{ srcFromUploadedImage: true, alt: "Peak Study open day practice image" }], htmlIncludes: ["Students practise before the final check."] },
    points: 30
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-table",
    title: "Add source data as a table",
    scenario: "Tabular source data must be converted into table, caption, rows, headings, and data cells.",
    supportDocument: ["Caption: Peak session timetable", "Headings: Activity, Room, Time", "Use <tr> rows, <th> headings, and <td> data cells.", "Rows: Spreadsheet/Lab 1/09:00; Documents/Lab 2/10:00; Websites/Lab 3/11:00"],
    goal: "Add the timetable table to the sessions section.",
    steps: ["Find the sessions section.", "Add table and caption.", "Add heading row and three data rows using th and td."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["table", "caption", "tr", "th", "td"], tableHeaders: ["Activity", "Room", "Time"], htmlIncludes: ["Peak session timetable", "Spreadsheet", "Documents", "Websites"] },
    points: 30
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-css",
    title: "Apply final CSS",
    scenario: "The final page needs a readable house style without damaging its HTML structure.",
    supportDocument: ["CSS required: body font-family, main max-width, nav display flex, section padding, img max-width, table border"],
    goal: "Add the required final CSS rules.",
    steps: ["Open the CSS tab.", "Add rules for body, main, nav, section, img, and table.", "Check that the browser preview remains readable."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["body", "font-family", "main", "max-width", "nav", "display", "flex", "section", "padding", "img", "max-width", "table", "border"] },
    points: 30
  }),
  examPractice("practice-open-day", "Practical Task 1: Build an open day page", "Peak Open Day"),
  examPractice("practice-clinic", "Practical Task 2: Build a clinic page", "Peak ICT Clinic"),
  examPractice("practice-showcase", "Practical Task 3: Build a showcase page", "Peak Skills Showcase"),
  examPractice("practice-register", "Practical Task 4: Build a register page", "Peak Registration Day"),
  examPractice("practice-timetable", "Practical Task 5: Build a timetable page", "Peak Practical Timetable"),
  examPractice("practice-evidence", "Practical Task 6: Build an evidence page", "Peak Evidence Page"),
  examPractice("practice-final", "Practical Task 7: Final exam-style website", "Peak Final Website")
];

const allCards = [
  ...introCards,
  ...textMediaCards,
  ...linksNavigationCards,
  ...tableCards,
  ...cssCards,
  ...examBuildCards,
  moduleCard("free-practice", "Free Practice", {
    id: "web-free-practice",
    title: "Free Practice workspace",
    scenario: "Use the full web authoring workspace without a guided validation target.",
    supportDocument: [
      "Create your own HTML and CSS.",
      "Use Add activity file for images, audio, or video, then use the shown relative path in your code.",
      "Use Preview to open the page in a browser tab, then print or save it as PDF."
    ],
    goal: "Build, preview, and print your own web page.",
    steps: [
      "Use the HTML and CSS tabs to create any practice page.",
      "Upload any media files you want to include.",
      "Click Preview to inspect the page in a browser and use Print / Save as PDF when ready."
    ],
    starterHtml: `<!doctype html>
<html>
  <head>
    <title>Free Practice Page</title>
  </head>
  <body>
    <main>
      <h1>Free Practice Page</h1>
      <p>Build your own page here.</p>
    </main>
  </body>
</html>`,
    expected: {},
    points: 0
  })
];

const moduleOrder = new Map(websiteAuthoringModules.map((module, index) => [module.id, index]));

export function getWebsiteAuthoringModule(moduleId?: string) {
  return websiteAuthoringModules.find((module) => module.id === moduleId);
}

export function getWebsiteAuthoringCardsForModule(moduleId?: string) {
  return allCards
    .filter((item) => !moduleId || item.moduleId === moduleId)
    .sort((first, second) => (moduleOrder.get(first.moduleId) ?? 99) - (moduleOrder.get(second.moduleId) ?? 99));
}
