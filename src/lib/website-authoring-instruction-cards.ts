export type WebsiteAuthoringModule = {
  id: string;
  title: string;
  description: string;
};

export type WebsiteExpectedResult = {
  htmlIncludes?: string[];
  requiredTags?: string[];
  images?: Array<{ srcIncludes?: string; alt?: string }>;
  uploadedPaths?: string[];
  links?: Array<{ text?: string; href?: string }>;
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

export const websiteAuthoringModules: WebsiteAuthoringModule[] = [
  {
    id: "intro",
    title: "HTML Foundations",
    description: "Start from the document skeleton, then build headings, paragraphs, lists, sections, and comments."
  },
  {
    id: "text-media",
    title: "Text and Images",
    description: "Add original Apex source text, images, alternative text, captions, and semantic media structure."
  },
  {
    id: "links-navigation",
    title: "Links and Navigation",
    description: "Create anchor links, internal page links, email links, and navigation menus."
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
    description: "Combine source text, structure, media, links, tables, CSS, preview checks, and teacher-reviewed evidence."
  }
];

const blankHtml = "";

const htmlShell = `<!doctype html>
<html>
  <head>
    <title>Apex Study Hub</title>
  </head>
  <body>

  </body>
</html>`;

const mainShell = `<!doctype html>
<html>
  <head>
    <title>Apex Study Hub</title>
  </head>
  <body>
    <main>

    </main>
  </body>
</html>`;

const apexStarterHtml = `<!doctype html>
<html>
  <head>
    <title>Apex Study Hub Open Day</title>
  </head>
  <body>
    <header>
      <h1>Apex Study Hub Open Day</h1>
    </header>
    <main>
      <section id="welcome">
        <h2>Welcome</h2>
        <p>Apex Study Hub is preparing a student open day for families who want structured digital practice.</p>
      </section>
    </main>
  </body>
</html>`;

const apexPageHtml = `<!doctype html>
<html>
  <head>
    <title>Apex Study Hub Open Day</title>
  </head>
  <body>
    <header>
      <h1>Apex Study Hub Open Day</h1>
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

const tableStarterHtml = `<!doctype html>
<html>
  <head>
    <title>Apex Workshop Timetable</title>
  </head>
  <body>
    <main>
      <h1>Apex Workshop Timetable</h1>
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

const baseCss = `body {
  font-family: Arial, sans-serif;
  color: #172026;
}
`;

const card = (item: WebsiteAuthoringCard) => item;

const moduleCard = (moduleId: string, moduleTitle: string, item: CardDraft): WebsiteAuthoringCard => card({
  moduleId,
  moduleTitle,
  starterCss: baseCss,
  points: 20,
  ...item
});

const introSupport = [
  "Project brief: Apex Study Hub Open Day",
  "Page heading: Apex Study Hub Open Day",
  "Subtitle: Practical digital skills for confident learners.",
  "Section heading: Practice Sessions",
  "Paragraph: Students rotate through short spreadsheet, document, and web design activities."
];

const introCards: WebsiteAuthoringCard[] = [
  card({
    id: "web-intro-doctype",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Start an HTML document",
    scenario: "A new Apex page needs the correct opening instruction so the browser treats it as modern HTML.",
    supportDocument: ["Required first line: <!doctype html>"],
    goal: "Type the doctype declaration at the top of the HTML editor.",
    steps: ["Click in the HTML editor.", "Place the cursor on the first line.", "Type <!doctype html> exactly."],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: { htmlIncludes: ["<!doctype html>"] },
    points: 10
  }),
  card({
    id: "web-intro-html-tags",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add the html element",
    scenario: "The page now needs one root element to contain everything in the document.",
    supportDocument: ["Opening tag: <html>", "Closing tag: </html>"],
    goal: "Create the html element below the doctype.",
    steps: ["Keep <!doctype html> on the first line.", "Type an opening <html> tag below it.", "Type a closing </html> tag after a blank line."],
    starterHtml: "<!doctype html>\n",
    starterCss: baseCss,
    expected: { requiredTags: ["html"], htmlIncludes: ["<!doctype html>"] },
    points: 10
  }),
  card({
    id: "web-intro-head-body",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add head and body",
    scenario: "A browser needs hidden page information in head and visible page content in body.",
    supportDocument: ["The head stores page information.", "The body stores visible page content."],
    goal: "Add head and body elements inside html.",
    steps: ["Click between <html> and </html>.", "Add a <head></head> pair first.", "Add a <body></body> pair after the head."],
    starterHtml: "<!doctype html>\n<html>\n\n</html>",
    starterCss: baseCss,
    expected: { requiredTags: ["head", "body"] },
    points: 10
  }),
  card({
    id: "web-intro-title-element",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Set the browser tab title",
    scenario: "The browser tab should identify the Apex page before students add visible content.",
    supportDocument: ["Browser tab title: Apex Study Hub Open Day"],
    goal: "Add a title element inside head.",
    steps: ["Find the head element.", "Inside head, type <title>Apex Study Hub Open Day</title>.", "Check that title is not placed inside body."],
    starterHtml: "<!doctype html>\n<html>\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>",
    starterCss: baseCss,
    expected: { requiredTags: ["title"], title: "Apex Study Hub Open Day", htmlIncludes: ["Apex Study Hub Open Day"] },
    points: 10
  }),
  card({
    id: "web-intro-main-element",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add the main content area",
    scenario: "The page needs a clear main area for the important content.",
    supportDocument: ["Use <main> for the main content on the page."],
    goal: "Add a main element inside body.",
    steps: ["Find the body element.", "Click between <body> and </body>.", "Type <main></main> inside the body."],
    starterHtml: htmlShell,
    starterCss: baseCss,
    expected: { requiredTags: ["main"] },
    points: 10
  }),
  card({
    id: "web-intro-h1-heading",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add the main heading",
    scenario: "Now that the page structure is ready, add the page's main visible heading.",
    supportDocument: introSupport,
    goal: "Add Apex Study Hub Open Day as an h1 heading inside main.",
    steps: ["Find the main element.", "Click between <main> and </main>.", "Type <h1>Apex Study Hub Open Day</h1>."],
    starterHtml: mainShell,
    starterCss: baseCss,
    expected: { requiredTags: ["h1"], htmlIncludes: ["Apex Study Hub Open Day"] },
    points: 10
  }),
  card({
    id: "web-intro-paragraph",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add a paragraph",
    scenario: "A heading introduces the page, but a paragraph gives readers the first useful information.",
    supportDocument: introSupport,
    goal: "Add the subtitle as a paragraph below the h1 heading.",
    steps: ["Find the h1 heading.", "On the next line, add a p element.", "Place the subtitle text between <p> and </p>."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <h1>Apex Study Hub Open Day</h1>\n\n    </main>"),
    starterCss: baseCss,
    expected: { requiredTags: ["p"], htmlIncludes: ["Practical digital skills for confident learners."] },
    points: 10
  }),
  card({
    id: "web-intro-visible-page-repeat",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Build a visible page again",
    scenario: "Apex needs a second simple page. Repeating the visible structure helps you type headings and paragraphs from memory.",
    supportDocument: [
      "Page title: Apex Practice Club",
      "Main heading: Apex Practice Club",
      "Paragraph: Students meet every Friday to improve practical ICT skills."
    ],
    goal: "Build a complete simple page with a heading and paragraph from a blank editor.",
    steps: [
      "Start with the doctype, html, head, title, body, and main structure.",
      "Add the main heading inside main.",
      "Add the paragraph below the heading and check the preview."
    ],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "p"],
      htmlIncludes: ["<!doctype html>", "Apex Practice Club", "Students meet every Friday to improve practical ICT skills."],
      title: "Apex Practice Club"
    },
    points: 20
  }),
  card({
    id: "web-intro-notice-repeat",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Build a study notice",
    scenario: "The same structure is now needed for a different Apex notice, so you practise without copying the previous words.",
    supportDocument: [
      "Page title: Apex Study Notice",
      "Main heading: Revision Clinic",
      "Paragraph: Bring your workbook and complete one practical task before leaving."
    ],
    goal: "Create another visible HTML page from a clean start.",
    steps: [
      "Create the standard HTML document structure.",
      "Set the title in the head.",
      "Add the heading and paragraph inside main."
    ],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "p"],
      htmlIncludes: ["<!doctype html>", "Revision Clinic", "Bring your workbook and complete one practical task before leaving."],
      title: "Apex Study Notice"
    },
    points: 20
  }),
  ...[
    ["web-intro-section", "Create a section", "Use a section element for a related group of content.", "section", "Inside main, wrap the Practice Sessions heading and paragraph in <section></section>."],
    ["web-intro-h2", "Add a section heading", "Use h2 for the Practice Sessions section heading.", "h2", "Inside the section, type <h2>Practice Sessions</h2> before the paragraph."],
    ["web-intro-second-paragraph", "Add source text to the section", "Add the practice sessions paragraph inside the section.", "p", "Below the h2, type the Practice Sessions paragraph inside <p></p>."],
    ["web-intro-header", "Add a page header", "Use header to group the page heading and subtitle.", "header", "Move or place the h1 and subtitle paragraph inside <header></header>."],
    ["web-intro-footer", "Add a simple footer", "Use footer for the copyright line.", "footer", "Before </body>, add <footer>Apex Study Hub practice page</footer>."],
    ["web-intro-comment", "Add an HTML comment", "Use a comment to label the main content area.", "<!-- main content -->", "Above the main element, type <!-- main content -->."]
  ].map(([id, title, goal, tag, action]) => card({
    id,
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title,
    scenario: "Practise one building block before moving to full page tasks.",
    supportDocument: introSupport,
    goal,
    steps: ["Use the existing Apex page as your starting file.", action, "Check that the source has the correct opening and closing tags."],
    starterHtml: apexStarterHtml,
    starterCss: baseCss,
    expected: tag.startsWith("<!--") ? { htmlIncludes: [tag] } : { requiredTags: [tag] },
    points: 10
  })),
  card({
    id: "web-intro-foundation-challenge",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Build the page foundation",
    scenario: "This checkpoint combines the first skills: doctype, html, head, title, body, main, heading, and paragraph.",
    supportDocument: introSupport,
    goal: "Build a basic Apex page from a blank editor.",
    steps: ["Start with <!doctype html>.", "Add html, head, title, body, and main.", "Inside main, add the h1 and subtitle paragraph from the brief."],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "p"],
      htmlIncludes: ["<!doctype html>", "Apex Study Hub Open Day", "Practical digital skills for confident learners."],
      title: "Apex Study Hub Open Day"
    },
    teacherReview: ["Check indentation and tag nesting so the student can explain the structure."],
    points: 25
  })
];

const textMediaCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-media-add-image", "Insert an image", "Upload apex-study-card.svg and use images/apex-study-card.svg as the image source.", "Apex study practice card"],
    ["web-media-alt-text", "Add alternative text", "Set the alt attribute to Apex study practice card.", "Apex study practice card"],
    ["web-media-caption", "Add an image caption", "Add the caption Guided practice workspace.", "Guided practice workspace"],
    ["web-media-figure", "Use a figure element", "Wrap the image and caption in a figure element.", "figure"],
    ["web-media-figcaption", "Use a figcaption element", "Place the caption inside figcaption.", "figcaption"],
    ["web-media-width", "Prepare the image for styling", "Add a class called hero-image to the image.", "hero-image"],
    ["web-media-second-section", "Add an image section", "Create a section for the image area.", "Visual preview"]
  ].map(([id, title, goal, requiredText]) => card({
    id,
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title,
    scenario: "The Apex web page needs a clear image area with useful text for users and screen readers.",
    supportDocument: [
      "Upload file: apex-study-card.svg",
      "Use this relative path: images/apex-study-card.svg",
      "Alternative text: Apex study practice card",
      "Caption: Guided practice workspace",
      "Section heading: Visual preview"
    ],
    goal,
    steps: ["Use Add activity file to upload the supplied image.", "Place the image block inside main, below the session text.", "Add or edit the image element using the shown relative path."],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: goal.includes("figure") ? ["figure"] : goal.includes("figcaption") ? ["figcaption"] : goal.includes("section") ? ["section", "h2"] : ["img"],
      images: goal.includes("image source") || goal.includes("alt") ? [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }] : undefined,
      htmlIncludes: requiredText === "figure" || requiredText === "figcaption" ? undefined : [requiredText]
    },
    points: 15
  })),
  card({
    id: "web-media-challenge",
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title: "Build the media block",
    scenario: "A practical task may ask for a supplied image, meaningful alt text, and a caption in a suitable place.",
    supportDocument: ["Upload file: apex-study-card.svg", "Use this relative path: images/apex-study-card.svg", "Use the Apex image, alt text, caption, and a section heading called Visual preview."],
    goal: "Create a complete image block using section, figure, img, and figcaption.",
    steps: ["Upload the supplied image and note the relative path.", "Create a section called Visual preview.", "Inside figure, add the image path, alt text, and figcaption."],
    starterHtml: apexPageHtml,
    starterCss: `${baseCss}\n.hero-image {\n  max-width: 320px;\n}\n`,
    expected: {
      requiredTags: ["section", "figure", "img", "figcaption"],
      images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }],
      htmlIncludes: ["Visual preview", "Guided practice workspace"]
    },
    teacherReview: ["Check that the image is relevant, proportionally sized, and not distorted."],
    points: 30
  }),
  card({
    id: "web-media-profile-repeat",
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title: "Build an image profile block",
    scenario: "Apex wants a small feature block for the practice hub. Build the image structure again from a clean editor.",
    supportDocument: [
      "Page title: Apex Practice Feature",
      "Heading: Practice of the Week",
      "Upload file: apex-study-card.svg",
      "Use this relative path: images/apex-study-card.svg",
      "Alternative text: Apex practice feature card",
      "Caption: Students practise one skill at a time."
    ],
    goal: "Build a page with a heading, figure, image, and caption from scratch.",
    steps: [
      "Create the standard HTML document structure.",
      "Add the heading inside main.",
      "Upload the image, then add figure, img, and figcaption using the support document."
    ],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "figure", "img", "figcaption"],
      images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex practice feature card" }],
      htmlIncludes: ["Practice of the Week", "Students practise one skill at a time."],
      title: "Apex Practice Feature"
    },
    points: 35
  }),
  card({
    id: "web-media-section-repeat",
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title: "Create a second media section",
    scenario: "Students should recognise that the same image pattern can be reused for another section.",
    supportDocument: [
      "Section heading: Independent Study",
      "Upload file: apex-study-card.svg",
      "Use this relative path: images/apex-study-card.svg",
      "Alternative text: Independent study practice card",
      "Caption: Learners review the task before asking for help."
    ],
    goal: "Add a new section with an image and caption.",
    steps: [
      "Find the main element.",
      "After the welcome section, add a new section with the heading.",
      "Upload the image, then add figure, img, and figcaption."
    ],
    starterHtml: apexStarterHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["section", "figure", "img", "figcaption"],
      images: [{ srcIncludes: "apex-study-card.svg", alt: "Independent study practice card" }],
      htmlIncludes: ["Independent Study", "Learners review the task before asking for help."]
    },
    points: 25
  })
];

const linkCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-link-home", "Create a Home link", "Home", "index.html"],
    ["web-link-practice", "Create a Practice link", "Practice", "practice.html"],
    ["web-link-sessions", "Create a Sessions section link", "Sessions", "#sessions"],
    ["web-link-register", "Create a Register section link", "Register", "#register"],
    ["web-link-contact", "Create a Contact link", "Contact", "contact.html"],
    ["web-link-email", "Create an email link", "Email Apex", "mailto:hello@apexstudyhub.example"],
    ["web-link-image", "Create an image file link", "Image file", "images/apex-study-card.svg"]
  ].map(([id, title, text, href]) => card({
    id,
    moduleId: "links-navigation",
    moduleTitle: "Links and Navigation",
    title,
    scenario: "The page needs links that send students to the correct page, section, or contact target.",
    supportDocument: [`Link text: ${text}`, `Target: ${href}`],
    goal: title,
    steps: ["Find or add the nav element.", "Create an a element with the required link text.", "Set href to the exact target shown in the brief."],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: { requiredTags: ["a"], links: [{ text, href }] },
    points: 15
  })),
  card({
    id: "web-link-navigation-challenge",
    moduleId: "links-navigation",
    moduleTitle: "Links and Navigation",
    title: "Build a navigation menu",
    scenario: "Apex needs a simple menu that links to the home page and two sections on the same page.",
    supportDocument: ["Menu: Home, Sessions, Register", "Targets: index.html, #sessions, #register"],
    goal: "Create a three-link navigation menu.",
    steps: ["Use nav for the menu container.", "Add three a elements.", "Check each href target matches the brief."],
    starterHtml: apexStarterHtml.replace("</main>", `  <section id="register"><h2>Register</h2></section>\n    </main>`),
    starterCss: baseCss,
    expected: {
      requiredTags: ["nav", "a"],
      links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }]
    },
    teacherReview: ["Check menu order, readability, and that internal links point to existing section ids."],
    points: 30
  })
];

const tableTasks: Array<[string, string, string[]]> = [
    ["web-table-element", "Create a table element", ["table"]],
    ["web-table-row", "Add a table row", ["tr"]],
    ["web-table-headings", "Add heading cells", ["Session", "Room", "Time"]],
    ["web-table-first-row", "Add the first data row", ["Spreadsheet Sprint", "Lab 1", "09:30"]],
    ["web-table-second-row", "Add the second data row", ["Document Design", "Lab 2", "10:15"]],
    ["web-table-third-row", "Add the third data row", ["Website Starter", "Lab 3", "11:00"]],
    ["web-table-caption", "Add a table caption", ["Apex workshop timetable"]],
    ["web-table-scope", "Add scope to heading cells", ["scope=\"col\""]]
  ];

const tableCards: WebsiteAuthoringCard[] = [
  ...tableTasks.map(([id, title, values]) => card({
    id,
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title,
    scenario: "Workshop data must be presented in a clear HTML table.",
    supportDocument: [
      "Headers: Session, Room, Time",
      "Rows: Spreadsheet Sprint/Lab 1/09:30; Document Design/Lab 2/10:15; Website Starter/Lab 3/11:00"
    ],
    goal: title,
    steps: ["Find the table area or create one inside main.", "Use tr for each row.", "Use th for headings and td for normal data."],
    starterHtml: title.includes("Create") ? apexStarterHtml : tableStarterHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: values.length === 1 && ["table", "tr"].includes(values[0]) ? [values[0]] : ["table", "tr"],
      tableHeaders: title.includes("heading") ? values : undefined,
      htmlIncludes: values
    },
    points: 15
  })),
  card({
    id: "web-table-build-challenge",
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title: "Build the workshop table",
    scenario: "This task mirrors exam table work without using a real exam source.",
    supportDocument: ["Create a table with headings Session, Room, Time and three data rows from the Apex workshop timetable."],
    goal: "Build a complete table with headings, data rows, and a caption.",
    steps: ["Use table, caption, tr, th, and td.", "Enter all three workshop rows.", "Check headings are th cells, not ordinary td cells."],
    starterHtml: apexStarterHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["table", "caption", "tr", "th", "td"],
      tableHeaders: ["Session", "Room", "Time"],
      htmlIncludes: ["Spreadsheet Sprint", "Document Design", "Website Starter"]
    },
    teacherReview: ["Check the table is readable and semantically correct."],
    points: 35
  }),
  card({
    id: "web-table-top-players",
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title: "Build a top players table",
    scenario: "Apex wants students to present ranked information in a clear table, not as loose text.",
    supportDocument: [
      "Caption: Top practice players",
      "Headers: Rank, Player, Score",
      "Rows: 1/Amara/92; 2/Daniel/88; 3/Sofia/84; 4/Noah/81; 5/Lina/79"
    ],
    goal: "Build a five-row ranking table from a blank editor.",
    steps: [
      "Create the standard HTML document structure.",
      "Inside main, add a heading and a table with a caption.",
      "Use th for headings and td for the five player rows."
    ],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "table", "caption", "tr", "th", "td"],
      tableHeaders: ["Rank", "Player", "Score"],
      htmlIncludes: ["Top practice players", "Amara", "Daniel", "Sofia", "Noah", "Lina"]
    },
    points: 40
  }),
  card({
    id: "web-table-top-players-images",
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title: "Build a players table with images",
    scenario: "A harder table can include images, text, and numbers in the same structure.",
    supportDocument: [
      "Caption: Apex player gallery",
      "Headers: Rank, Image, Player, Score",
      "Upload file: apex-study-card.svg",
      "Use images/apex-study-card.svg for each image.",
      "Alt text examples: Amara practice card, Daniel practice card, Sofia practice card, Noah practice card, Lina practice card"
    ],
    goal: "Create a table of five players with an image in each row.",
    steps: [
      "Start from a clean HTML document.",
      "Build a table with the four headings shown.",
      "Add five rows, including an img element with useful alt text in each row."
    ],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "table", "caption", "tr", "th", "td", "img"],
      tableHeaders: ["Rank", "Image", "Player", "Score"],
      images: [
        { srcIncludes: "apex-study-card.svg", alt: "Amara practice card" },
        { srcIncludes: "apex-study-card.svg", alt: "Daniel practice card" },
        { srcIncludes: "apex-study-card.svg", alt: "Sofia practice card" },
        { srcIncludes: "apex-study-card.svg", alt: "Noah practice card" },
        { srcIncludes: "apex-study-card.svg", alt: "Lina practice card" }
      ],
      htmlIncludes: ["Apex player gallery", "Amara", "Daniel", "Sofia", "Noah", "Lina"]
    },
    teacherReview: ["Check that images are inside the correct table cells and each image has meaningful alt text."],
    points: 50
  })
];

const cssCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-css-body-font", "Set the body font", "body", "font-family"],
    ["web-css-body-background", "Set the page background", "body", "background"],
    ["web-css-main-width", "Set the main page width", "main", "max-width"],
    ["web-css-heading-color", "Style the main heading colour", "h1", "color"],
    ["web-css-nav-display", "Arrange the navigation", "nav", "display"],
    ["web-css-nav-gap", "Space the navigation links", "nav", "gap"],
    ["web-css-section-padding", "Add section padding", "section", "padding"],
    ["web-css-image-width", "Control image width", "img", "max-width"],
    ["web-css-table-border", "Add table borders", "table", "border"],
    ["web-css-cell-padding", "Add cell padding", "td", "padding"],
    ["web-css-media-query", "Add a responsive media query", "@media", "max-width"]
  ].map(([id, title, selector, property]) => card({
    id,
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title,
    scenario: "The HTML is present. Use CSS selectors and properties to control the visual layout.",
    supportDocument: [`Selector: ${selector}`, `Property: ${property}`],
    goal: title,
    steps: ["Open the CSS tab.", "Find or create the selector shown in the brief.", "Add the requested CSS property with a sensible value."],
    starterHtml: `${apexPageHtml}
<figure>
  <img src="images/apex-study-card.svg" alt="Apex study practice card">
  <figcaption>Guided practice workspace</figcaption>
</figure>
${tableStarterHtml}`,
    starterCss: baseCss,
    expected: { cssIncludes: [selector, property] },
    points: 15
  })),
  card({
    id: "web-css-house-style-challenge",
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title: "Apply the Apex house style",
    scenario: "A practical website task usually needs a consistent style across text, navigation, images, and tables.",
    supportDocument: ["Use a readable sans-serif font.", "Constrain the main content width.", "Add spacing to sections.", "Make images responsive.", "Add visible table borders."],
    goal: "Apply a consistent CSS house style to the Apex page.",
    steps: ["Style body and main.", "Style nav and section spacing.", "Style images and tables so the preview is readable."],
    starterHtml: `${apexPageHtml}
<figure>
  <img src="images/apex-study-card.svg" alt="Apex study practice card">
  <figcaption>Guided practice workspace</figcaption>
</figure>
${tableStarterHtml}`,
    starterCss: baseCss,
    expected: { cssIncludes: ["body", "font-family", "main", "max-width", "section", "padding", "img", "max-width", "table", "border"] },
    teacherReview: ["Check colour contrast, spacing, consistency, and suitability for the target audience."],
    points: 35
  }),
  card({
    id: "web-css-table-style-repeat",
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title: "Style the ranking table",
    scenario: "A finished table should be easier to read after CSS is applied.",
    supportDocument: [
      "Style table borders.",
      "Add padding to th and td.",
      "Give th a background colour.",
      "Set img max-width so images do not dominate the table."
    ],
    goal: "Apply CSS to make the player table readable.",
    steps: [
      "Open the CSS tab.",
      "Add rules for table, th, td, and img.",
      "Check the preview shows clear borders, spacing, and controlled image sizes."
    ],
    starterHtml: `<!doctype html>
<html>
  <head>
    <title>Apex Player Gallery</title>
  </head>
  <body>
    <main>
      <h1>Apex Player Gallery</h1>
      <table>
        <caption>Apex player gallery</caption>
        <tr><th>Rank</th><th>Image</th><th>Player</th><th>Score</th></tr>
        <tr><td>1</td><td><img src="images/apex-study-card.svg" alt="Amara practice card"></td><td>Amara</td><td>92</td></tr>
        <tr><td>2</td><td><img src="images/apex-study-card.svg" alt="Daniel practice card"></td><td>Daniel</td><td>88</td></tr>
        <tr><td>3</td><td><img src="images/apex-study-card.svg" alt="Sofia practice card"></td><td>Sofia</td><td>84</td></tr>
      </table>
    </main>
  </body>
</html>`,
    starterCss: baseCss,
    expected: { cssIncludes: ["table", "border", "th", "background", "td", "padding", "img", "max-width"] },
    teacherReview: ["Check that table content is readable and images are not distorted."],
    points: 35
  }),
  card({
    id: "web-css-page-repeat",
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title: "Style a fresh page from scratch",
    scenario: "This final CSS repetition checks that students can style a different Apex page, not only the first example.",
    supportDocument: [
      "Use body font-family.",
      "Use main max-width.",
      "Use section padding.",
      "Use h1 color.",
      "Use a border on the notice box."
    ],
    goal: "Create a simple page and apply the requested CSS styles.",
    steps: [
      "Build a page with h1, section, h2, and paragraph in HTML.",
      "Open CSS and add the listed selectors and properties.",
      "Check that the preview visibly changes."
    ],
    starterHtml: blankHtml,
    starterCss: "",
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "section", "h2", "p"],
      cssIncludes: ["body", "font-family", "main", "max-width", "section", "padding", "h1", "color", "border"],
      htmlIncludes: ["Apex", "Practice"]
    },
    teacherReview: ["Check that the student can explain which CSS rule changed which part of the page."],
    points: 45
  })
];

const examCards: WebsiteAuthoringCard[] = [
  card({
    id: "web-exam-apex-homepage",
    moduleId: "exam-build",
    moduleTitle: "Exam Website Build",
    title: "Apex homepage build",
    scenario: "This final task combines the main website authoring skills in an original Apex project.",
    supportDocument: [
      "Create a homepage for Apex Study Hub Open Day.",
      "Include title, heading, subtitle, navigation, sessions section, image block, workshop table, and register section.",
      "Apply CSS for readable font, page width, image width, navigation spacing, section padding, and table borders.",
      "Teacher check: file names, relative paths, browser preview, spelling, audience suitability, and evidence screenshots."
    ],
    goal: "Build a complete Apex-style web page from the brief.",
    steps: ["Build the HTML document structure.", "Add source text, links, image block, and table.", "Apply the CSS house style.", "Use teacher review for file/path/evidence checks."],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "h2", "nav", "a", "figure", "img", "figcaption", "table", "tr", "th", "td"],
      htmlIncludes: ["Apex Study Hub Open Day", "Practical digital skills", "Practice Sessions", "Register", "Session", "Room", "Time"],
      images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }],
      links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }],
      cssIncludes: ["font-family", "max-width", "border"]
    },
    teacherReview: [
      "Check file names and relative paths match the task brief.",
      "Check the page works in a browser and image paths are not broken.",
      "Check layout, contrast, spelling, and suitability for students and parents."
    ],
    points: 70
  }),
  ...[
    ["source structure", { requiredTags: ["main", "h1", "section"], htmlIncludes: ["Apex Study Hub Open Day"] }],
    ["image evidence", { images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }] }],
    ["navigation evidence", { links: [{ text: "Home", href: "index.html" }] }],
    ["table evidence", { requiredTags: ["table"], htmlIncludes: ["Session"] }],
    ["css evidence", { cssIncludes: ["body", "font-family"] }]
  ].map(([name, expected]) => card({
    id: `web-exam-${String(name).replaceAll(" ", "-")}`,
    moduleId: "exam-build",
    moduleTitle: "Exam Website Build",
    title: `Exam practice: ${name}`,
    scenario: "Practise one part of the final website build before attempting the full Apex homepage task.",
    supportDocument: ["Use the Apex page brief and any activity files supplied for this task.", "Check your browser preview after editing."],
    goal: `Complete the ${name} part of the page.`,
    steps: ["Read the support document.", "Edit the HTML or CSS.", "Check the preview and use teacher review for presentation."],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: expected as unknown as WebsiteExpectedResult,
    teacherReview: ["Check that the result would satisfy practical-paper style and evidence requirements."],
    points: 25
  }))
];

const cleanPracticeTopics = [
  ["coding-league", "Apex Coding League", "Students compete by building small pages from memory."],
  ["revision-breakfast", "Revision Breakfast", "Families receive quick guidance before morning lessons."],
  ["digital-skills-fair", "Digital Skills Fair", "Learners visit stations for web, document, spreadsheet, and database practice."],
  ["homework-clinic", "Homework Clinic", "Tutors help students correct practical work before submission."],
  ["study-sprint", "Study Sprint", "A short challenge helps students practise accurate code under time pressure."],
  ["ict-help-desk", "ICT Help Desk", "Students report problems and receive simple step-by-step support."],
  ["parent-demo-day", "Parent Demo Day", "Parents see how Apex practical lessons build confidence."],
  ["exam-warm-up", "Exam Warm-up", "Students complete one focused task before a full practice paper."],
  ["keyboard-club", "Keyboard Club", "Learners improve accuracy by typing short structured pages."],
  ["spreadsheet-challenge", "Spreadsheet Challenge", "A table of scores shows which teams completed spreadsheet tasks."],
  ["document-design-club", "Document Design Club", "Students improve layout, readability, and professional formatting."],
  ["website-showcase", "Website Showcase", "A showcase page presents student-built websites and feedback."],
  ["data-detective", "Data Detective", "Learners compare information and present findings clearly."],
  ["media-workshop", "Media Workshop", "Students use images, captions, and alternative text responsibly."],
  ["accessibility-check", "Accessibility Check", "A short checklist reminds students to make pages readable for everyone."]
] as const;

const introGuidedSupplement = [
  ["web-intro-h3-subheading", "Use a smaller heading", "A section sometimes needs a heading below h2.", ["Add an h3 heading that says Morning tasks."], { requiredTags: ["h3"], htmlIncludes: ["Morning tasks"] }],
  ["web-intro-h4-subheading", "Use an h4 heading", "Long pages need lower-level headings for smaller groups.", ["Add an h4 heading that says Teacher checks."], { requiredTags: ["h4"], htmlIncludes: ["Teacher checks"] }],
  ["web-intro-line-break", "Add a line break", "Some addresses need a controlled line break.", ["Add a br element between Apex Study Hub and Online Practice."], { requiredTags: ["br"], htmlIncludes: ["Apex Study Hub", "Online Practice"] }],
  ["web-intro-horizontal-rule", "Add a horizontal rule", "A divider can separate two visible sections.", ["Add an hr element below the welcome paragraph."], { requiredTags: ["hr"] }],
  ["web-intro-strong", "Make key text important", "Important words should use meaningful HTML, not only visual style.", ["Wrap the words practical ICT in a strong element."], { requiredTags: ["strong"], htmlIncludes: ["practical ICT"] }],
  ["web-intro-emphasis", "Emphasise a short phrase", "Some phrases need emphasis for meaning.", ["Wrap the words one skill at a time in an em element."], { requiredTags: ["em"], htmlIncludes: ["one skill at a time"] }],
  ["web-intro-div", "Create a generic container", "A div can group content when no stronger semantic element fits.", ["Add a div with the text Practice card."], { requiredTags: ["div"], htmlIncludes: ["Practice card"] }],
  ["web-intro-span", "Create an inline text container", "A span can mark a small part of a sentence.", ["Wrap the word focused in a span element."], { requiredTags: ["span"], htmlIncludes: ["focused"] }],
  ["web-intro-unordered-list", "Build a bullet list", "Short items can be easier to read as a list.", ["Create a ul list with Spreadsheet, Documents, and Websites."], { requiredTags: ["ul", "li"], htmlIncludes: ["Spreadsheet", "Documents", "Websites"] }],
  ["web-intro-ordered-list", "Build a numbered list", "Steps should be coded as an ordered list.", ["Create an ol list with Read, Edit, Check."], { requiredTags: ["ol", "li"], htmlIncludes: ["Read", "Edit", "Check"] }],
  ["web-intro-nested-list", "Build a nested list", "A nested list shows detail under a main item.", ["Create a list where ICT contains Spreadsheet and Web Authoring as nested items."], { requiredTags: ["ul", "li"], htmlIncludes: ["ICT", "Spreadsheet", "Web Authoring"] }],
  ["web-intro-comment-second", "Add a developer comment", "Comments help organise a source file without appearing in the browser.", ["Add the comment <!-- Apex page content --> above main."], { htmlIncludes: ["<!-- Apex page content -->"] }],
  ["web-intro-meta-charset", "Add the character set", "You now know visible body content. Metadata is different: it belongs in head and helps the browser understand the page.", ["Add <meta charset=\"UTF-8\"> inside head."], { requiredTags: ["meta"], htmlIncludes: ["charset=\"UTF-8\""] }],
  ["web-intro-meta-viewport", "Add the viewport setting", "A responsive page also needs viewport metadata inside head so phone and tablet browsers scale it correctly.", ["Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> inside head."], { requiredTags: ["meta"], htmlIncludes: ["viewport", "width=device-width"] }]
] as const;

function introSupplementSteps(id: string, providedSteps: readonly string[]) {
  if (id.includes("meta")) {
    return ["Find the head element near the top of the document.", ...providedSteps, "Check that this code is inside head, not inside body."];
  }
  if (id.includes("list")) {
    return ["Find the main content area.", ...providedSteps, "Check that each item is inside its own li element."];
  }
  if (id.includes("line-break")) {
    return ["Find the address-style text area in main.", ...providedSteps, "Use br only for the line break, not for spacing out sections."];
  }
  if (id.includes("comment")) {
    return ["Find the line above main.", ...providedSteps, "Check that the comment does not appear in the browser preview."];
  }
  return ["Find the visible content inside main.", ...providedSteps, "Check that the new element appears in the correct section of the preview."];
}

const introSupplementCards: WebsiteAuthoringCard[] = [
  ...introGuidedSupplement.map(([id, title, scenario, steps, expected]) => moduleCard("intro", "HTML Foundations", {
    id,
    title,
    scenario,
    supportDocument: ["Current file: index.html", "Project: Apex Study Hub Open Day", scenario],
    goal: title,
    steps: introSupplementSteps(id, steps),
    starterHtml: apexStarterHtml,
    expected: expected as unknown as WebsiteExpectedResult,
    points: 15
  })),
  ...cleanPracticeTopics.map(([slug, topic, sentence]) => moduleCard("intro", "HTML Foundations", {
    id: `web-intro-clean-${slug}`,
    title: `Clean Sheet Practice: ${topic} page`,
    scenario: "Build the full page structure from a blank editor so the HTML foundation becomes familiar.",
    supportDocument: [`Page title: ${topic}`, `Heading: ${topic}`, `Paragraph: ${sentence}`],
    goal: `Create a complete HTML page for ${topic}.`,
    steps: ["Start with the doctype.", "Add html, head, meta charset, meta viewport, title, body, and main.", "Inside main, add the heading and paragraph from the support document."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "meta", "title", "body", "main", "h1", "p"],
      htmlIncludes: ["<!doctype html>", topic, sentence, "charset=\"UTF-8\"", "viewport"],
      title: topic
    },
    points: 35
  }))
];

const mediaGuidedSupplement = [
  ["img-width-attribute", "Set image width", "Add width=\"320\" to the Apex image.", { requiredTags: ["img"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }], htmlIncludes: ["width=\"320\""] }],
  ["img-height-attribute", "Set image height", "Add height=\"200\" to the Apex image.", { requiredTags: ["img"], htmlIncludes: ["height=\"200\""] }],
  ["img-class", "Add an image class", "Add class=\"feature-image\" to the image.", { requiredTags: ["img"], htmlIncludes: ["class=\"feature-image\""] }],
  ["image-inside-link", "Make an image a link", "Wrap the image in a link to index.html.", { requiredTags: ["a", "img"], links: [{ href: "index.html" }], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }] }],
  ["caption-detail", "Improve the caption", "Change the caption to Guided web practice at Apex.", { requiredTags: ["figcaption"], htmlIncludes: ["Guided web practice at Apex"] }],
  ["media-source-section", "Add a source paragraph", "Add a paragraph that says Source image supplied by Apex Study Hub.", { requiredTags: ["p"], htmlIncludes: ["Source image supplied by Apex Study Hub"] }],
  ["media-two-images", "Add a second image", "Add a second Apex image with alt text Apex support document card.", { requiredTags: ["img"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex support document card" }] }],
  ["media-image-list", "Place image notes in a list", "Add a list with Image source, Alternative text, and Caption.", { requiredTags: ["ul", "li"], htmlIncludes: ["Image source", "Alternative text", "Caption"] }],
  ["media-audio", "Add audio controls", "Upload apex-intro.mp3 and add an audio element with controls using media/apex-intro.mp3.", { requiredTags: ["audio", "source"], htmlIncludes: ["controls", "media/apex-intro.mp3"], uploadedPaths: ["media/apex-intro.mp3"] }],
  ["media-video", "Add video controls", "Upload apex-tour.mp4 and add a video element with controls using media/apex-tour.mp4.", { requiredTags: ["video", "source"], htmlIncludes: ["controls", "media/apex-tour.mp4"], uploadedPaths: ["media/apex-tour.mp4"] }],
  ["media-fallback", "Add media fallback text", "Add fallback text that says Your browser cannot play this Apex media.", { htmlIncludes: ["Your browser cannot play this Apex media"] }],
  ["media-absolute-image", "Use an absolute image path example", "Add an image with src=\"https://example.com/apex-practice.png\" and useful alt text.", { requiredTags: ["img"], images: [{ srcIncludes: "https://example.com/apex-practice.png", alt: "Apex online practice preview" }] }],
  ["media-relative-path", "Use a relative image path", "Add an image source images/apex-card.png with alt text Apex card from images folder.", { requiredTags: ["img"], images: [{ srcIncludes: "images/apex-card.png", alt: "Apex card from images folder" }] }],
  ["media-table-image", "Put an image in a table", "Add a table with an image in one data cell.", { requiredTags: ["table", "tr", "td", "img"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex table image" }] }],
  ["media-figure-class", "Class the figure", "Add class=\"media-card\" to the figure element.", { requiredTags: ["figure"], htmlIncludes: ["class=\"media-card\""] }],
  ["media-accessibility-note", "Add an accessibility note", "Add the sentence Every image must have meaningful alternative text.", { htmlIncludes: ["Every image must have meaningful alternative text."] }],
  ["media-thumbnail-list", "Create a media checklist", "Create an ordered list with Choose image, Add alt text, Check size.", { requiredTags: ["ol", "li"], htmlIncludes: ["Choose image", "Add alt text", "Check size"] }],
  ["media-credit-comment", "Add a media comment", "Add the comment <!-- media block starts here -->.", { htmlIncludes: ["<!-- media block starts here -->"] }],
  ["media-gallery-heading", "Add a gallery heading", "Add an h2 heading called Apex image gallery.", { requiredTags: ["h2"], htmlIncludes: ["Apex image gallery"] }],
  ["media-gallery-paragraph", "Add gallery explanation", "Add a paragraph saying Images help users understand the activity before reading the full details.", { requiredTags: ["p"], htmlIncludes: ["Images help users understand the activity before reading the full details."] }]
] as const;

const mediaCleanTopics = cleanPracticeTopics.map(([slug, topic, sentence]) => moduleCard("text-media", "Text and Images", {
  id: `web-media-clean-${slug}`,
  title: `Clean Sheet Practice: ${topic} media page`,
  scenario: "Create a visible media block from a blank editor using semantic image elements.",
  supportDocument: [`Page title: ${topic} Media`, `Heading: ${topic}`, `Paragraph: ${sentence}`, "Upload file: apex-study-card.svg", "Use this relative path: images/apex-study-card.svg", `Alt text: ${topic} practice image`, `Caption: ${topic} preview card`],
  goal: `Build a media page for ${topic}.`,
  steps: ["Create the full HTML document structure.", "Upload the image file and use its relative path.", "Add figure, img, and figcaption with the supplied source, alt text, and caption."],
  starterHtml: blankHtml,
  expected: {
    requiredTags: ["html", "head", "title", "body", "main", "h1", "p", "figure", "img", "figcaption"],
    images: [{ srcIncludes: "apex-study-card.svg", alt: `${topic} practice image` }],
    htmlIncludes: ["<!doctype html>", topic, sentence, `${topic} preview card`],
    title: `${topic} Media`
  },
  points: 40
}));

const mediaSupplementCards: WebsiteAuthoringCard[] = [
  ...mediaGuidedSupplement.map(([slug, title, instruction, expected]) => moduleCard("text-media", "Text and Images", {
    id: `web-media-${slug}`,
    title,
    scenario: "The page uses media to make information clearer, but the HTML must still be accessible.",
    supportDocument: ["Upload file: apex-study-card.svg", "Use this relative path when an image is required: images/apex-study-card.svg", instruction],
    goal: title,
    steps: ["Find the image or media area in main.", instruction, "Check the preview and spelling of attributes."],
    starterHtml: `${apexPageHtml}
<figure>
  <img src="images/apex-study-card.svg" alt="Apex study practice card">
  <figcaption>Guided practice workspace</figcaption>
</figure>`,
    expected: expected as unknown as WebsiteExpectedResult,
    points: 20
  })),
  ...mediaCleanTopics
];

const linkGuidedSupplement = [
  ["external-new-tab", "Open an external link in a new tab", "Apex guide", "https://example.com/apex-guide", "target=\"_blank\""],
  ["relative-about", "Create a relative About page link", "About Apex", "about.html", ""],
  ["relative-folder", "Link to a file in a folder", "Student guide", "docs/student-guide.html", ""],
  ["download-file", "Link to a practice file", "Download practice file", "files/practice.csv", ""],
  ["same-page-top", "Create a Back to top link", "Back to top", "#top", ""],
  ["same-page-help", "Create a Help bookmark link", "Help", "#help", ""],
  ["mailto-subject", "Create an email link with a subject", "Email support", "mailto:hello@apexstudyhub.example?subject=Website%20help", ""],
  ["image-link-home", "Use an image as a home link", "", "index.html", ""],
  ["footer-privacy", "Create a privacy link", "Privacy", "privacy.html", ""],
  ["nav-lessons", "Create a lessons link", "Lessons", "lessons.html", ""],
  ["nav-practice", "Create a practice link", "Practice room", "practice-room.html", ""],
  ["bookmark-create", "Create a target section id", "Jump to checklist", "#checklist", "id=\"checklist\""],
  ["link-title", "Add a title attribute to a link", "Start revision", "revision.html", "title=\"Start revision\""],
  ["phone-link", "Create a phone link example", "Call Apex", "tel:+440000000000", ""],
  ["relative-parent", "Link to a parent folder page", "Main index", "../index.html", ""],
  ["link-list", "Create links inside a list", "ICT", "ict.html", ""],
  ["multi-nav-home", "Add Home to a multi-link nav", "Home", "index.html", ""],
  ["multi-nav-business", "Add Business to a multi-link nav", "Business", "business.html", ""],
  ["multi-nav-ict", "Add ICT to a multi-link nav", "ICT", "ict.html", ""],
  ["button-style-link", "Create a classed call-to-action link", "Start practice", "start.html", "class=\"button-link\""],
  ["footer-contact", "Create a footer contact link", "Contact Apex", "contact.html", ""],
  ["asset-link", "Link to an uploaded image file", "Open card image", "images/apex-study-card.svg", ""]
] as const;

const linkSupplementCards: WebsiteAuthoringCard[] = [
  ...linkGuidedSupplement.map(([slug, title, text, href, extra]) => moduleCard("links-navigation", "Links and Navigation", {
    id: `web-link-${slug}`,
    title,
    scenario: "Navigation must take users to the right place without confusing the page structure.",
    supportDocument: [`Link text: ${text || "Image link only"}`, `Href: ${href}`, extra ? `Extra attribute: ${extra}` : "No extra attribute required."],
    goal: title,
    steps: [
      text ? `Type the link text as ${text}.` : "Select or add the image that will become the clickable link.",
      `Set the href attribute to ${href}.`,
      extra ? `Add the extra attribute ${extra}.` : "Check that no extra attribute has been added unless the brief asks for it."
    ],
    starterHtml: apexPageHtml,
    expected: {
      requiredTags: ["a"],
      links: text ? [{ text, href }] : [{ href }],
      htmlIncludes: extra ? [extra] : undefined
    },
    points: 20
  })),
  ...cleanPracticeTopics.map(([slug, topic, sentence]) => moduleCard("links-navigation", "Links and Navigation", {
    id: `web-link-clean-${slug}`,
    title: `Clean Sheet Practice: ${topic} navigation page`,
    scenario: "Build a small page and navigation menu from a blank editor.",
    supportDocument: [`Title and heading: ${topic}`, `Paragraph: ${sentence}`, "Links: Home/index.html, Details/details.html, Contact/contact.html"],
    goal: `Create a three-link navigation page for ${topic}.`,
    steps: ["Create the full HTML document structure.", "Add a nav element with the three links.", "Add main content with the heading and paragraph."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "title", "body", "nav", "a", "main", "h1", "p"],
      links: [{ text: "Home", href: "index.html" }, { text: "Details", href: "details.html" }, { text: "Contact", href: "contact.html" }],
      htmlIncludes: ["<!doctype html>", topic, sentence],
      title: topic
    },
    points: 40
  }))
];

const tableGuidedSupplement = [
  ["caption-top-five", "Add a ranking table caption", ["Top five Apex learners"], ["caption"]],
  ["table-player-headings", "Create player table headings", ["Rank", "Learner", "Score"], ["table", "tr", "th"]],
  ["table-player-row-one", "Add the first player row", ["1", "Amara", "92"], ["table", "tr", "td"]],
  ["table-player-row-two", "Add the second player row", ["2", "Daniel", "88"], ["table", "tr", "td"]],
  ["table-player-row-three", "Add the third player row", ["3", "Sofia", "84"], ["table", "tr", "td"]],
  ["table-colspan-title", "Use colspan for a table title", ["colspan=\"3\"", "Apex Weekly Scores"], ["table", "th"]],
  ["table-rowspan-label", "Use rowspan for a repeated label", ["rowspan=\"2\"", "Morning"], ["table", "td"]],
  ["table-product-comparison", "Build comparison headings", ["Feature", "Basic", "Premium"], ["table", "th"]],
  ["table-event-schedule", "Build schedule headings", ["Activity", "Location", "Start"], ["table", "th"]],
  ["table-travel-planner", "Build travel headings", ["Destination", "Transport", "Cost"], ["table", "th"]],
  ["table-image-cell", "Add an image cell", ["Apex table image"], ["table", "td", "img"]],
  ["table-link-cell", "Add a link in a table cell", ["Open guide"], ["table", "td", "a"]],
  ["table-border-css", "Add CSS table borders", ["table", "border"], ["table"]],
  ["table-cell-padding-css", "Add CSS cell padding", ["td", "padding"], ["table"]],
  ["table-header-bg-css", "Style table headings", ["th", "background"], ["table"]],
  ["table-width-css", "Set table width", ["table", "width"], ["table"]],
  ["table-align-css", "Align table text", ["text-align"], ["table"]],
  ["table-nested-text", "Add heading text above a table", ["Apex comparison data"], ["h2", "table"]],
  ["table-summary-paragraph", "Add a summary below a table", ["Use the table to compare the options."], ["p", "table"]]
] as const;

const tableSupplementCards: WebsiteAuthoringCard[] = [
  ...tableGuidedSupplement.map(([slug, title, values, tags]) => moduleCard("tables", "HTML Tables", {
    id: `web-${slug}`,
    title,
    scenario: "Tables convert raw data into rows and columns so users can compare information quickly.",
    supportDocument: values.map((value) => `Required: ${value}`),
    goal: title,
    steps: [
      title.includes("CSS") || values.some((value) => ["border", "padding", "background", "width", "text-align"].includes(value))
        ? "Open the CSS tab and find or create the table-related selector."
        : "Find the existing table, or create a table inside main if there is not one yet.",
      values.length > 1 ? `Add these required values: ${values.join(", ")}.` : `Add ${values[0]} in the correct table position.`,
      "Check that rows, headings, and data cells are nested inside the table correctly."
    ],
    starterHtml: tableStarterHtml,
    starterCss: baseCss,
    expected: {
      requiredTags: [...tags],
      tableHeaders: title.includes("heading") || title.includes("Headings") ? [...values] : undefined,
      htmlIncludes: values.some((value) => value.includes("\"")) ? [...values] : values.filter((value) => !["table", "border", "td", "padding", "th", "background", "width", "text-align"].includes(value)),
      cssIncludes: values.some((value) => ["border", "padding", "background", "width", "text-align"].includes(value)) ? [...values] : undefined
    },
    points: 20
  })),
  ...cleanPracticeTopics.map(([slug, topic]) => moduleCard("tables", "HTML Tables", {
    id: `web-table-clean-${slug}`,
    title: `Clean Sheet Practice: ${topic} data table`,
    scenario: "Build a complete table from a blank editor so the pattern becomes automatic.",
    supportDocument: [`Page title: ${topic} Table`, `Heading: ${topic} Table`, "Caption: Apex comparison table", "Headers: Item, Detail, Status", "Rows: Plan/Ready/Green; Practice/In progress/Amber; Review/Needed/Red"],
    goal: `Create a complete data table for ${topic}.`,
    steps: ["Create the full HTML document structure.", "Inside main, add a heading and table with caption.", "Use tr, th, and td for all headings and rows."],
    starterHtml: blankHtml,
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "h1", "table", "caption", "tr", "th", "td"],
      tableHeaders: ["Item", "Detail", "Status"],
      htmlIncludes: ["<!doctype html>", "Apex comparison table", "Plan", "Practice", "Review"],
      title: `${topic} Table`
    },
    points: 45
  }))
];

const cssGuidedSupplement = [
  ["inline-style", "Use inline CSS once", "Add style=\"color: #0f6f8c\" to the h1.", { htmlIncludes: ["style=\"color: #0f6f8c\""] }],
  ["internal-style", "Add internal CSS", "Add a style element inside head.", { requiredTags: ["style"], htmlIncludes: ["<style"] }],
  ["external-link", "Link an external stylesheet", "Add <link rel=\"stylesheet\" href=\"styles.css\"> inside head.", { requiredTags: ["link"], htmlIncludes: ["rel=\"stylesheet\"", "href=\"styles.css\""] }],
  ["class-selector", "Use a class selector", "Add class=\"notice-card\" in HTML and .notice-card in CSS.", { htmlIncludes: ["class=\"notice-card\""], cssIncludes: [".notice-card"] }],
  ["id-selector", "Use an id selector", "Add id=\"hero\" in HTML and #hero in CSS.", { htmlIncludes: ["id=\"hero\""], cssIncludes: ["#hero"] }],
  ["css-comment", "Add a CSS comment", "Add /* Apex layout styles */ in CSS.", { cssIncludes: ["/* Apex layout styles */"] }],
  ["margin", "Set margins", "Use margin in a CSS rule.", { cssIncludes: ["margin"] }],
  ["border-radius", "Round a box slightly", "Use border-radius in a CSS rule.", { cssIncludes: ["border-radius"] }],
  ["box-shadow", "Add a subtle shadow", "Use box-shadow in a CSS rule.", { cssIncludes: ["box-shadow"] }],
  ["line-height", "Improve line height", "Use line-height for body or p text.", { cssIncludes: ["line-height"] }],
  ["font-size", "Change font size", "Use font-size in a CSS rule.", { cssIncludes: ["font-size"] }],
  ["font-weight", "Change font weight", "Use font-weight in a CSS rule.", { cssIncludes: ["font-weight"] }],
  ["link-hover", "Add a hover selector", "Use a:hover in CSS.", { cssIncludes: ["a:hover"] }],
  ["grid-layout", "Use a grid layout", "Use display: grid in CSS.", { cssIncludes: ["display", "grid"] }],
  ["flex-layout", "Use a flex layout", "Use display: flex in CSS.", { cssIncludes: ["display", "flex"] }],
  ["responsive-width", "Add responsive image sizing", "Use max-width: 100% for images.", { cssIncludes: ["img", "max-width", "100%"] }]
] as const;

const cssSupplementCards: WebsiteAuthoringCard[] = [
  ...cssGuidedSupplement.map(([slug, title, instruction, expected]) => moduleCard("css-layout", "CSS Layout", {
    id: `web-css-${slug}`,
    title,
    scenario: "CSS controls presentation while HTML keeps the page structure meaningful.",
    supportDocument: [instruction],
    goal: title,
    steps: [
      instruction.includes("HTML") || instruction.includes("class=") || instruction.includes("id=") || instruction.includes("<")
        ? "Make the required HTML change first."
        : "Open the CSS tab.",
      instruction,
      "Check the browser preview and confirm the page structure has not been damaged."
    ],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: expected as unknown as WebsiteExpectedResult,
    points: 20
  })),
  ...cleanPracticeTopics.map(([slug, topic, sentence]) => moduleCard("css-layout", "CSS Layout", {
    id: `web-css-clean-${slug}`,
    title: `Clean Sheet Practice: ${topic} styled page`,
    scenario: "Start with a blank editor, then build both the HTML and CSS for a small Apex page.",
    supportDocument: [`Title and heading: ${topic}`, `Paragraph: ${sentence}`, "CSS must style body font, main width, h1 colour, section padding, and link hover."],
    goal: `Build and style a complete page for ${topic}.`,
    steps: ["Create the full HTML document with main, section, h1, p, and a link.", "Open the CSS tab.", "Add body, main, h1, section, and a:hover rules."],
    starterHtml: blankHtml,
    starterCss: "",
    expected: {
      requiredTags: ["html", "head", "title", "body", "main", "section", "h1", "p", "a"],
      htmlIncludes: ["<!doctype html>", topic, sentence],
      links: [{ text: "Start practice", href: "practice.html" }],
      cssIncludes: ["body", "font-family", "main", "max-width", "h1", "color", "section", "padding", "a:hover"],
      title: topic
    },
    points: 50
  }))
];

const examGuidedSupplement = [
  "Check source text placement",
  "Build header and navigation",
  "Create the welcome section",
  "Create the sessions section",
  "Create the register section",
  "Add a support image",
  "Add meaningful alt text",
  "Add an image caption",
  "Create a timetable table",
  "Use a caption on the timetable",
  "Add table heading cells",
  "Add table data rows",
  "Create internal bookmark links",
  "Create a contact email link",
  "Link to an external stylesheet",
  "Apply body font styling",
  "Apply main width styling",
  "Style navigation links",
  "Style section spacing",
  "Style images responsively",
  "Style table borders",
  "Add a footer",
  "Add HTML comments for evidence",
  "Prepare final browser preview"
] as const;

const examSupplementCards: WebsiteAuthoringCard[] = [
  ...examGuidedSupplement.map((title, index) => moduleCard("exam-build", "Exam Website Build", {
    id: `web-exam-guided-${index + 1}`,
    title: `Exam build step: ${title}`,
    scenario: "Practise one part of a longer practical website task before attempting the full clean build.",
    supportDocument: ["Project: Apex Study Hub Open Day", "Improve the named part of the current page. Upload apex-study-card.svg first when the step needs an image."],
    goal: title,
    steps: [
      `Focus only on this part of the build: ${title}.`,
      index >= 5 && index < 8 ? "Upload the supplied image before adding or editing image code." : "Use the current Apex source as the working file.",
      index >= 15 && index < 21 ? "Open the CSS tab and add the required style rule." : "Edit the matching HTML section and keep the rest of the page intact."
    ],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: index < 5
      ? { requiredTags: ["header", "nav", "main", "section"], htmlIncludes: ["Apex Study Hub Open Day", "Practice Sessions"] }
      : index < 8
        ? { requiredTags: ["figure", "img", "figcaption"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }] }
        : index < 12
          ? { requiredTags: ["table", "caption", "tr", "th", "td"], tableHeaders: ["Session", "Room", "Time"] }
          : index < 15
            ? { requiredTags: ["a"], links: [{ text: "Home", href: "index.html" }] }
            : index < 21
              ? { cssIncludes: ["body", "font-family", "main", "max-width", "section", "padding"] }
              : { requiredTags: ["footer"], htmlIncludes: ["Apex"] },
    teacherReview: ["Check that this part fits the overall page and evidence requirements."],
    points: 30
  })),
  ...cleanPracticeTopics.map(([slug, topic, sentence]) => moduleCard("exam-build", "Exam Website Build", {
    id: `web-exam-clean-${slug}`,
    title: `Clean Sheet Practice: ${topic} mini-site`,
    scenario: "This is a fuller exam-style practice: build a small page from source notes and finish it with CSS.",
    supportDocument: [
      `Site title: ${topic}`,
      `Heading: ${topic}`,
      `Intro: ${sentence}`,
      "Navigation: Home/index.html, Sessions/#sessions, Contact/contact.html",
      "Table headings: Activity, Room, Time",
      "Rows: Coding/Lab 1/09:00; Documents/Lab 2/10:00; Websites/Lab 3/11:00",
      "Upload file: apex-study-card.svg",
      "Use this relative path: images/apex-study-card.svg",
      `Alt text: ${topic} website image`,
      "CSS: body font-family, main max-width, nav display flex, section padding, img max-width, table border"
    ],
    goal: `Build a complete Apex mini-site page for ${topic}.`,
    steps: ["Create the full HTML document from a blank editor.", "Add navigation, sections, image block, table, and footer.", "Open CSS and apply the listed house style."],
    starterHtml: blankHtml,
    starterCss: "",
    expected: {
      requiredTags: ["html", "head", "title", "body", "header", "nav", "a", "main", "section", "h1", "p", "figure", "img", "figcaption", "table", "caption", "tr", "th", "td", "footer"],
      links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Contact", href: "contact.html" }],
      images: [{ srcIncludes: "apex-study-card.svg", alt: `${topic} website image` }],
      tableHeaders: ["Activity", "Room", "Time"],
      htmlIncludes: ["<!doctype html>", topic, sentence, "Coding", "Documents", "Websites"],
      cssIncludes: ["body", "font-family", "main", "max-width", "nav", "display", "flex", "section", "padding", "img", "max-width", "table", "border"],
      title: topic
    },
    teacherReview: ["Check page suitability, source accuracy, layout, and that evidence screenshots would be clear."],
    points: 80
  }))
];

const allCards = [
  ...introCards,
  ...introSupplementCards,
  ...textMediaCards,
  ...mediaSupplementCards,
  ...linkCards,
  ...linkSupplementCards,
  ...tableCards,
  ...tableSupplementCards,
  ...cssCards,
  ...cssSupplementCards,
  ...examCards,
  ...examSupplementCards
];

const moduleOrder = new Map(websiteAuthoringModules.map((module, index) => [module.id, index]));

export function getWebsiteAuthoringModule(moduleId?: string) {
  return websiteAuthoringModules.find((module) => module.id === moduleId);
}

export function getWebsiteAuthoringCardsForModule(moduleId?: string) {
  return allCards
    .filter((card) => !moduleId || card.moduleId === moduleId)
    .sort((first, second) => (moduleOrder.get(first.moduleId) ?? 99) - (moduleOrder.get(second.moduleId) ?? 99));
}
