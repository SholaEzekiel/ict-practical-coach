export type WebsiteAuthoringModule = {
  id: string;
  title: string;
  description: string;
};

export type WebsiteExpectedResult = {
  htmlIncludes?: string[];
  requiredTags?: string[];
  images?: Array<{ srcIncludes?: string; alt?: string }>;
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
    ["web-intro-section", "Create a section", "Use a section element for a related group of content.", "section"],
    ["web-intro-h2", "Add a section heading", "Use h2 for the Practice Sessions section heading.", "h2"],
    ["web-intro-second-paragraph", "Add source text to the section", "Add the practice sessions paragraph inside the section.", "p"],
    ["web-intro-header", "Add a page header", "Use header to group the page heading and subtitle.", "header"],
    ["web-intro-footer", "Add a simple footer", "Use footer for the copyright line.", "footer"],
    ["web-intro-comment", "Add an HTML comment", "Use a comment to label the main content area.", "<!-- main content -->"]
  ].map(([id, title, goal, tag]) => card({
    id,
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title,
    scenario: "Practise one building block before moving to full page tasks.",
    supportDocument: introSupport,
    goal,
    steps: ["Read the required element in the goal.", "Find the correct place in the HTML.", "Add the tag and text, then check the preview."],
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
    ["web-media-add-image", "Insert an image", "Use /assets/apex-study-card.svg as the image source.", "Apex study practice card"],
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
      "Image source: /assets/apex-study-card.svg",
      "Alternative text: Apex study practice card",
      "Caption: Guided practice workspace",
      "Section heading: Visual preview"
    ],
    goal,
    steps: ["Find the correct place inside main.", "Add or edit the required image-related element.", "Check the preview and the attribute spelling."],
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
    supportDocument: ["Use the Apex image, alt text, caption, and a section heading called Visual preview."],
    goal: "Create a complete image block using section, figure, img, and figcaption.",
    steps: ["Create a section called Visual preview.", "Inside it, add a figure.", "Inside figure, add the image and figcaption."],
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
      "Image source: /assets/apex-study-card.svg",
      "Alternative text: Apex practice feature card",
      "Caption: Students practise one skill at a time."
    ],
    goal: "Build a page with a heading, figure, image, and caption from scratch.",
    steps: [
      "Create the standard HTML document structure.",
      "Add the heading inside main.",
      "Add figure, img, and figcaption using the support document."
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
      "Image source: /assets/apex-study-card.svg",
      "Alternative text: Independent study practice card",
      "Caption: Learners review the task before asking for help."
    ],
    goal: "Add a new section with an image and caption.",
    steps: [
      "Find the main element.",
      "After the welcome section, add a new section with the heading.",
      "Inside the section, add figure, img, and figcaption."
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
    ["web-link-image", "Create an image asset link", "Image file", "/assets/apex-study-card.svg"]
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
      "Use /assets/apex-study-card.svg for each image.",
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
  <img src="/assets/apex-study-card.svg" alt="Apex study practice card">
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
  <img src="/assets/apex-study-card.svg" alt="Apex study practice card">
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
        <tr><td>1</td><td><img src="/assets/apex-study-card.svg" alt="Amara practice card"></td><td>Amara</td><td>92</td></tr>
        <tr><td>2</td><td><img src="/assets/apex-study-card.svg" alt="Daniel practice card"></td><td>Daniel</td><td>88</td></tr>
        <tr><td>3</td><td><img src="/assets/apex-study-card.svg" alt="Sofia practice card"></td><td>Sofia</td><td>84</td></tr>
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
    supportDocument: ["Use the Apex page brief and assets.", "Check your browser preview after editing."],
    goal: `Complete the ${name} part of the page.`,
    steps: ["Read the support document.", "Edit the HTML or CSS.", "Check the preview and use teacher review for presentation."],
    starterHtml: apexPageHtml,
    starterCss: baseCss,
    expected: expected as WebsiteExpectedResult,
    teacherReview: ["Check that the result would satisfy practical-paper style and evidence requirements."],
    points: 25
  }))
];

const allCards = [
  ...introCards,
  ...textMediaCards,
  ...linkCards,
  ...tableCards,
  ...cssCards,
  ...examCards
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
