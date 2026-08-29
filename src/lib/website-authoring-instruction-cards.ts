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
  containedLinks?: Array<{ container: string; text?: string; href?: string }>;
  linkedImages?: Array<{ href?: string; srcIncludes?: string; alt?: string }>;
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
    description: "Add Apex source text, uploaded images, alternative text, captions, and semantic media structure."
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
      <p>Practical digital skills for confident learners.</p>
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
    goal: `Build the required Apex page for ${spec.heading}.`,
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
    supportDocument: ["Browser title: Apex Study Hub Open Day"],
    goal: "Add a title element inside head.",
    steps: ["Find the head element.", "Inside head, type <title>Apex Study Hub Open Day</title>.", "Keep title out of body."],
    starterHtml: "<!doctype html>\n<html>\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>",
    expected: { requiredTags: ["title"], htmlIncludes: ["Apex Study Hub Open Day"], title: "Apex Study Hub Open Day" },
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
    supportDocument: ["Main heading: Apex Study Hub Open Day"],
    goal: "Add Apex Study Hub Open Day as an h1 heading inside main.",
    steps: ["Find the main element.", "Click between <main> and </main>.", "Type <h1>Apex Study Hub Open Day</h1>."],
    starterHtml: mainShell,
    expected: { requiredTags: ["h1"], htmlIncludes: ["Apex Study Hub Open Day"] },
    points: 10
  }),
  moduleCard("intro", "HTML Foundations", {
    id: "web-intro-p",
    title: "Add a paragraph",
    scenario: "The p element stores normal paragraph text.",
    supportDocument: ["Subtitle: Practical digital skills for confident learners."],
    goal: "Add the subtitle as a paragraph below the h1 heading.",
    steps: ["Find the h1 heading.", "On the next line, type a p element.", "Place the subtitle between <p> and </p>."],
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <h1>Apex Study Hub Open Day</h1>\n\n    </main>"),
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
    supportDocument: ["Header text: Apex Study Hub Open Day", "Footer text: Apex Study Hub practice page"],
    goal: "Add header and footer elements to the page.",
    steps: ["Add a header before main.", "Place the h1 inside header.", "Add a footer before </body> with the footer text."],
    starterHtml: mainShell,
    expected: { requiredTags: ["header", "footer", "h1"], htmlIncludes: ["Apex Study Hub Open Day", "Apex Study Hub practice page"] },
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
    id: "web-intro-metadata",
    title: "Add page metadata",
    scenario: "Metadata belongs in head after the student understands the visible page structure.",
    supportDocument: ["Required charset: <meta charset=\"UTF-8\">", "Required viewport: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">", "Language attribute: <html lang=\"en\">"],
    goal: "Add charset, viewport, and lang metadata.",
    steps: ["Change <html> to <html lang=\"en\">.", "Add the charset meta tag inside head.", "Add the viewport meta tag inside head."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["meta"], htmlIncludes: ["<html lang=\"en\">", "charset=\"UTF-8\"", "name=\"viewport\"", "width=device-width"] },
    points: 20
  }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-basic", title: "Practical Task 1: Build a basic page", heading: "Apex Practice Club", paragraph: "Students meet every Friday to improve practical ICT skills." }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-structured", title: "Practical Task 2: Build a structured page", heading: "Apex Study Notice", paragraph: "Bring your workbook and complete one practical task before leaving.", tags: ["html", "head", "title", "body", "header", "main", "section", "h1", "h2", "p", "footer"] }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-headings", title: "Practical Task 3: Build a heading hierarchy", heading: "Apex Skills Morning", paragraph: "Teachers check headings, paragraphs, sections, and page structure.", tags: ["html", "head", "title", "body", "main", "section", "h1", "h2", "h3", "h4", "p"] }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-event", title: "Practical Task 4: Build an event page", heading: "Apex Revision Day", paragraph: "Families can visit the practical rooms and see student work.", tags: ["html", "head", "title", "body", "header", "main", "section", "h1", "h2", "p", "footer"] }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-clinic", title: "Practical Task 5: Build a clinic page", heading: "Apex Coding Clinic", paragraph: "Students practise tags in short steps before building a full page." }),
  fullPagePractice("intro", "HTML Foundations", { slug: "practice-support", title: "Practical Task 6: Build a support page", heading: "Apex Support Desk", paragraph: "Ask for help after checking the preview and source code." }),
  fullPagePractice("intro", "HTML Foundations", {
    slug: "practice-final",
    title: "Practical Task 7: Final foundation build",
    heading: "Apex Foundation Check",
    paragraph: "A complete page uses structure, headings, text, comments, and metadata.",
    tags: ["html", "head", "meta", "title", "body", "header", "main", "section", "h1", "h2", "h4", "p", "footer"],
    expected: { htmlIncludes: ["<html lang=\"en\">", "charset=\"UTF-8\"", "name=\"viewport\"", "<!--"] },
    points: 70
  })
];

function mediaPractice(slug: string, title: string, heading: string, alt: string, caption: string): WebsiteAuthoringCard {
  return fullPagePractice("text-media", "Text and Images", {
    slug,
    title,
    heading,
    paragraph: "Apex students use media to understand practical tasks before building their own pages.",
    extraSupport: ["Upload file: apex-study-card.svg", "Use the shown relative image path after upload.", `Alternative text: ${alt}`, `Caption: ${caption}`],
    tags: ["html", "head", "title", "body", "header", "main", "section", "h1", "p", "figure", "img", "figcaption"],
    expected: { uploadedPaths: ["images/apex-study-card.svg"], images: [{ srcIncludes: "apex-study-card.svg", alt }], htmlIncludes: [caption] },
    points: 55
  });
}

const textMediaCards: WebsiteAuthoringCard[] = [
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-upload",
    title: "Upload an activity image",
    scenario: "Online students must upload their own activity file before using it in HTML.",
    supportDocument: ["Upload file: apex-study-card.svg", "The editor will show a relative path such as images/apex-study-card.svg."],
    goal: "Upload apex-study-card.svg using Add activity file.",
    steps: ["Click Add activity file.", "Choose apex-study-card.svg from the practice files.", "Read the relative path shown under the button."],
    starterHtml: apexPageHtml,
    expected: { uploadedPaths: ["images/apex-study-card.svg"] },
    points: 10
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-img",
    title: "Insert an image",
    scenario: "The img element displays an uploaded image when src points to the correct relative path.",
    supportDocument: ["Image path after upload: images/apex-study-card.svg"],
    goal: "Add an img element using the uploaded image path.",
    steps: ["Upload the image file first.", "Inside main, add <img src=\"images/apex-study-card.svg\">.", "Check that the preview shows the image."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["img"], images: [{ srcIncludes: "apex-study-card.svg" }], uploadedPaths: ["images/apex-study-card.svg"] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-alt",
    title: "Add alternative text",
    scenario: "The alt attribute describes an image for users who cannot see it.",
    supportDocument: ["Upload file if needed: apex-study-card.svg", "Image path: images/apex-study-card.svg", "Alternative text: Apex study practice card"],
    goal: "Set the image alt text to Apex study practice card.",
    steps: ["Upload the image file if it is not already listed.", "Find the img element.", "Add alt=\"Apex study practice card\" and keep src in the same img tag."],
    starterHtml: insertIntoSessionsSection(`        <img src="images/apex-study-card.svg">`),
    expected: { requiredTags: ["img"], uploadedPaths: ["images/apex-study-card.svg"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex study practice card" }] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-figure",
    title: "Group the image with figure",
    scenario: "The figure element groups media with its caption.",
    supportDocument: ["Upload file if needed: apex-study-card.svg", "Use <figure> around the image."],
    goal: "Wrap the image in a figure element.",
    steps: ["Upload the image file if it is not already listed.", "Find the img element.", "Place <figure> before it and </figure> after it."],
    starterHtml: insertIntoSessionsSection(`        <img src="images/apex-study-card.svg" alt="Apex study practice card">`),
    expected: { requiredTags: ["figure", "img"], uploadedPaths: ["images/apex-study-card.svg"] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-figcaption",
    title: "Add a caption",
    scenario: "The figcaption element explains the image.",
    supportDocument: ["Upload file if needed: apex-study-card.svg", "Caption: Guided practice workspace"],
    goal: "Add Guided practice workspace inside figcaption.",
    steps: ["Upload the image file if it is not already listed.", "Find the figure element.", "Below the img, type <figcaption>Guided practice workspace</figcaption> and keep it inside figure."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="images/apex-study-card.svg" alt="Apex study practice card">
        </figure>`),
    expected: { requiredTags: ["figure", "img", "figcaption"], uploadedPaths: ["images/apex-study-card.svg"], htmlIncludes: ["Guided practice workspace"] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-size",
    title: "Set image size attributes",
    scenario: "Width and height attributes reserve space for an image and help avoid layout jumps.",
    supportDocument: ["Upload file if needed: apex-study-card.svg", "Width: 320", "Height: 180"],
    goal: "Add width and height attributes to the img element.",
    steps: ["Upload the image file if it is not already listed.", "Find the img tag.", "Add width=\"320\" and height=\"180\" while keeping the alt text."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="images/apex-study-card.svg" alt="Apex study practice card">
          <figcaption>Guided practice workspace</figcaption>
        </figure>`),
    expected: { requiredTags: ["img"], uploadedPaths: ["images/apex-study-card.svg"], htmlIncludes: ["width=\"320\"", "height=\"180\""] },
    points: 15
  }),
  moduleCard("text-media", "Text and Images", {
    id: "web-text-media-section",
    title: "Create a media section",
    scenario: "Media should sit inside a clear section with a heading.",
    supportDocument: ["Upload file if needed: apex-study-card.svg", "Section heading: Visual preview", "Caption: Guided practice workspace"],
    goal: "Create a section containing h2, figure, img, and figcaption.",
    steps: ["Upload the image file if it is not already listed.", "Inside main, add a section with <h2>Visual preview</h2>.", "Move or add the figure inside the section."],
    starterHtml: insertIntoSessionsSection(`        <figure>
          <img src="images/apex-study-card.svg" alt="Apex study practice card">
          <figcaption>Guided practice workspace</figcaption>
        </figure>`),
    expected: { requiredTags: ["section", "h2", "figure", "img", "figcaption"], uploadedPaths: ["images/apex-study-card.svg"], htmlIncludes: ["Visual preview", "Guided practice workspace"] },
    points: 20
  }),
  mediaPractice("practice-card", "Practical Task 1: Build an image card", "Apex Practice Feature", "Apex practice feature card", "Students practise one skill at a time."),
  mediaPractice("practice-gallery", "Practical Task 2: Build a gallery section", "Apex Gallery", "Apex gallery practice card", "Learners review examples before attempting a task."),
  mediaPractice("practice-news", "Practical Task 3: Build a news media page", "Apex News Update", "Apex news image", "The image supports the news paragraph."),
  mediaPractice("practice-course", "Practical Task 4: Build a course media page", "Apex Course Preview", "Apex course preview image", "The preview helps students choose a practice room."),
  mediaPractice("practice-revision", "Practical Task 5: Build a revision media page", "Apex Revision Image", "Apex revision image", "The image gives context for the revision task."),
  mediaPractice("practice-accessible", "Practical Task 6: Build an accessible media page", "Apex Accessible Media", "Apex accessible practice image", "Useful captions and alt text make pages clearer."),
  mediaPractice("practice-final", "Practical Task 7: Final text and image build", "Apex Media Evidence", "Apex media evidence card", "The evidence image supports the written page content.")
];

function navPractice(slug: string, title: string, heading: string, links: Array<{ text: string; href: string }>): WebsiteAuthoringCard {
  return fullPagePractice("links-navigation", "Links and Navigation", {
    slug,
    title,
    heading,
    paragraph: "Apex learners use navigation links to move between practice pages.",
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
    supportDocument: ["Link text: Email Apex", "Href: mailto:hello@apexstudyhub.example"],
    goal: "Add an email link to the footer.",
    steps: ["Find the footer before </body>.", "Inside footer, type <a href=\"mailto:hello@apexstudyhub.example\">Email Apex</a>.", "Check the href starts with mailto:."],
    starterHtml: apexPageWithFooterHtml,
    expected: {
      requiredTags: ["a", "footer"],
      links: [{ text: "Email Apex", href: "mailto:hello@apexstudyhub.example" }],
      containedLinks: [{ container: "footer", text: "Email Apex", href: "mailto:hello@apexstudyhub.example" }]
    },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-new-tab",
    title: "Open a link in a new tab",
    scenario: "The target attribute can open a link in a new browser tab.",
    supportDocument: ["Link text: Apex guide", "Href: https://example.com/apex-guide", "Attribute: target=\"_blank\""],
    goal: "Add a guide link that opens in a new tab.",
    steps: ["Find the nav or footer.", "Add the link with the correct href.", "Add target=\"_blank\" inside the opening a tag."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["a"], links: [{ text: "Apex guide", href: "https://example.com/apex-guide" }], htmlIncludes: ["target=\"_blank\""] },
    points: 15
  }),
  moduleCard("links-navigation", "Links and Navigation", {
    id: "web-links-image",
    title: "Use an image as a link",
    scenario: "An img element can sit inside an a element to make the image clickable.",
    supportDocument: ["Upload file: apex-study-card.svg", "Href: index.html", "Image path: images/apex-study-card.svg", "Alt text: Apex home card"],
    goal: "Create a linked image that returns to index.html.",
    steps: ["Upload apex-study-card.svg first.", "Create an a element with href=\"index.html\".", "Place <img src=\"images/apex-study-card.svg\" alt=\"Apex home card\"> inside the link."],
    starterHtml: apexPageHtml,
    expected: {
      requiredTags: ["a", "img"],
      uploadedPaths: ["images/apex-study-card.svg"],
      links: [{ href: "index.html" }],
      images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex home card" }],
      linkedImages: [{ href: "index.html", srcIncludes: "apex-study-card.svg", alt: "Apex home card" }]
    },
    points: 20
  }),
  navPractice("practice-three-links", "Practical Task 1: Build three page links", "Apex Link Practice", [{ text: "Home", href: "index.html" }, { text: "ICT", href: "ict.html" }, { text: "Business", href: "business.html" }]),
  navPractice("practice-bookmarks", "Practical Task 2: Build bookmark navigation", "Apex Bookmark Page", [{ text: "Top", href: "#top" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }]),
  navPractice("practice-footer-links", "Practical Task 3: Build footer links", "Apex Footer Links", [{ text: "Contact", href: "contact.html" }, { text: "Privacy", href: "privacy.html" }, { text: "Email Apex", href: "mailto:hello@apexstudyhub.example" }]),
  navPractice("practice-folder-links", "Practical Task 4: Build folder links", "Apex Resource Page", [{ text: "Student guide", href: "docs/student-guide.html" }, { text: "Practice file", href: "files/practice.csv" }, { text: "Main index", href: "../index.html" }]),
  navPractice("practice-action-links", "Practical Task 5: Build action links", "Apex Action Links", [{ text: "Start practice", href: "start.html" }, { text: "View modules", href: "modules.html" }, { text: "Ask for help", href: "help.html" }]),
  navPractice("practice-link-list", "Practical Task 6: Build a link list", "Apex Link List", [{ text: "Spreadsheets", href: "spreadsheets.html" }, { text: "Documents", href: "documents.html" }, { text: "Web authoring", href: "web-authoring.html" }]),
  navPractice("practice-final", "Practical Task 7: Final navigation build", "Apex Navigation Evidence", [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }, { text: "Email Apex", href: "mailto:hello@apexstudyhub.example" }])
];

function tablePractice(slug: string, title: string, heading: string, headers: string[]): WebsiteAuthoringCard {
  return fullPagePractice("tables", "HTML Tables", {
    slug,
    title,
    heading,
    paragraph: "The table should present the source data clearly.",
    extraSupport: ["Caption: Apex comparison table", `Headers: ${headers.join(", ")}`, "Use <tr> rows, <th> headings, and <td> data cells.", "Rows: Plan/Ready/Green; Practice/In progress/Amber; Review/Needed/Red"],
    tags: ["html", "head", "title", "body", "main", "h1", "p", "table", "caption", "tr", "th", "td"],
    expected: { tableHeaders: headers, htmlIncludes: ["Apex comparison table", "Plan", "Practice", "Review"] },
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
    starterHtml: mainShell.replace("\n\n    </main>", "\n      <h1>Apex Workshop Timetable</h1>\n\n    </main>"),
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
    supportDocument: ["Caption: Apex workshop times"],
    goal: "Add a caption directly inside the table.",
    steps: ["Find the opening table tag.", "On the next line, type <caption>Apex workshop times</caption>.", "Keep the caption before the first tr."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["caption"], htmlIncludes: ["Apex workshop times"] },
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
    supportDocument: ["Title cell text: Apex Weekly Scores", "Attribute: colspan=\"3\""],
    goal: "Add a title row that spans three columns.",
    steps: ["Add a new row at the top of the table.", "Inside it, add one th cell with colspan=\"3\".", "Type Apex Weekly Scores inside the spanning heading cell."],
    starterHtml: tableStarterHtml,
    expected: { requiredTags: ["table", "tr", "th"], htmlIncludes: ["colspan=\"3\"", "Apex Weekly Scores"] },
    points: 20
  }),
  tablePractice("practice-basic", "Practical Task 1: Build a timetable", "Apex Workshop Timetable", ["Session", "Room", "Time"]),
  tablePractice("practice-scores", "Practical Task 2: Build a scores table", "Apex Weekly Scores", ["Rank", "Learner", "Score"]),
  tablePractice("practice-comparison", "Practical Task 3: Build a comparison table", "Apex Option Comparison", ["Feature", "Basic", "Premium"]),
  tablePractice("practice-register", "Practical Task 4: Build a register table", "Apex Register", ["Name", "Class", "Present"]),
  tablePractice("practice-equipment", "Practical Task 5: Build an equipment table", "Apex Equipment List", ["Item", "Quantity", "Needed"]),
  tablePractice("practice-feedback", "Practical Task 6: Build a feedback table", "Apex Feedback Summary", ["Area", "Rating", "Action"]),
  tablePractice("practice-final", "Practical Task 7: Final table build", "Apex Table Evidence", ["Activity", "Room", "Time"])
];

function cssPractice(slug: string, title: string, heading: string, cssParts: string[]): WebsiteAuthoringCard {
  return fullPagePractice("css-layout", "CSS Layout", {
    slug,
    title,
    heading,
    paragraph: "Apex students practise the page, then check the browser preview.",
    extraSupport: ["Link: Start practice -> practice.html", `CSS requirements: ${cssParts.join(", ")}`],
    tags: ["html", "head", "title", "body", "header", "nav", "a", "main", "section", "h1", "p"],
    expected: { links: [{ text: "Start practice", href: "practice.html" }], cssIncludes: cssParts },
    points: 60
  });
}

const cssCards: WebsiteAuthoringCard[] = [
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-style",
    title: "Add internal CSS",
    scenario: "The style element holds CSS inside the head of an HTML document.",
    supportDocument: ["Required tag: <style></style>", "Place it inside head."],
    goal: "Add a style element inside head.",
    steps: ["Find the head element.", "Add <style></style> before </head>.", "Keep CSS code inside the style element."],
    starterHtml: apexStarterHtml,
    expected: { requiredTags: ["style"] },
    points: 10
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-body",
    title: "Style the body",
    scenario: "The body selector can apply a font or background to the whole visible page.",
    supportDocument: ["CSS selector: body", "Property: font-family"],
    goal: "Add a body CSS rule with font-family.",
    steps: ["Open the CSS tab.", "Type a body selector.", "Add a font-family property inside the rule."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["body", "font-family"] },
    points: 15
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-color",
    title: "Change heading colour",
    scenario: "The color property changes text colour.",
    supportDocument: ["Selector: h1", "Property: color", "Colour: #0f6f8c"],
    goal: "Style h1 text with the Apex blue colour.",
    steps: ["Open the CSS tab.", "Create an h1 rule.", "Add color: #0f6f8c; inside the rule."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["h1", "color", "#0f6f8c"] },
    points: 15
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-class",
    title: "Use a class selector",
    scenario: "A class lets CSS target selected elements without changing every tag of the same type.",
    supportDocument: ["HTML class: notice-card", "CSS selector: .notice-card"],
    goal: "Add class=\"notice-card\" to a section and style .notice-card.",
    steps: ["Add class=\"notice-card\" to the welcome section.", "Open CSS and create a .notice-card rule.", "Add padding inside the rule."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { htmlIncludes: ["class=\"notice-card\""], cssIncludes: [".notice-card", "padding"] },
    points: 20
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-id",
    title: "Use an id selector",
    scenario: "An id selector targets one unique element.",
    supportDocument: ["HTML id: hero", "CSS selector: #hero"],
    goal: "Add id=\"hero\" to the header and style #hero.",
    steps: ["Find the header tag.", "Change it to <header id=\"hero\">.", "Open CSS and add a #hero rule."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { htmlIncludes: ["id=\"hero\""], cssIncludes: ["#hero"] },
    points: 20
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-box",
    title: "Add spacing and borders",
    scenario: "Margin, padding, and border control spacing around and inside boxes.",
    supportDocument: ["Properties: margin, padding, border"],
    goal: "Add margin, padding, and border to the section rule.",
    steps: ["Open the CSS tab.", "Create or find a section rule.", "Add margin, padding, and border properties."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["section", "margin", "padding", "border"] },
    points: 20
  }),
  moduleCard("css-layout", "CSS Layout", {
    id: "web-css-flex",
    title: "Use flex layout",
    scenario: "Flex layout places navigation links neatly in a row.",
    supportDocument: ["Selector: nav", "Properties: display, gap", "Value: flex"],
    goal: "Style the nav element with flex layout.",
    steps: ["Open CSS.", "Create a nav rule.", "Add display: flex; and gap."],
    starterHtml: apexPageHtml,
    starterCss: "",
    expected: { cssIncludes: ["nav", "display", "flex", "gap"] },
    points: 20
  }),
  cssPractice("practice-colour", "Practical Task 1: Style colours", "Apex Colour Practice", ["body", "font-family", "h1", "color", "section", "background"]),
  cssPractice("practice-spacing", "Practical Task 2: Style spacing", "Apex Spacing Practice", ["main", "max-width", "section", "padding", "margin"]),
  cssPractice("practice-nav", "Practical Task 3: Style navigation", "Apex Navigation Style", ["nav", "display", "flex", "gap", "a", "text-decoration"]),
  cssPractice("practice-card", "Practical Task 4: Style a content card", "Apex Card Style", [".notice-card", "border", "padding", "border-radius", "box-shadow"]),
  cssPractice("practice-image", "Practical Task 5: Style responsive images", "Apex Image Style", ["img", "max-width", "height", "border-radius"]),
  cssPractice("practice-table", "Practical Task 6: Style a table", "Apex Table Style", ["table", "border-collapse", "th", "td", "border", "padding"]),
  cssPractice("practice-final", "Practical Task 7: Final CSS layout build", "Apex CSS Evidence", ["body", "font-family", "main", "max-width", "nav", "display", "flex", "section", "padding", "h1", "color", "a:hover"])
];

function examPractice(slug: string, title: string, heading: string): WebsiteAuthoringCard {
  return fullPagePractice("exam-build", "Exam Website Build", {
    slug,
    title,
    heading,
    paragraph: "Practical digital skills for confident learners.",
    extraSupport: [
      "Navigation: Home/index.html, Sessions/#sessions, Register/#register, Contact/contact.html",
      "Image file to upload: apex-study-card.svg",
      "Image path after upload: images/apex-study-card.svg",
      `Image alt text: ${heading} practice image`,
      "Table caption: Apex session timetable",
      "Table headings: Activity, Room, Time",
      "Rows: Spreadsheet/Lab 1/09:00; Documents/Lab 2/10:00; Websites/Lab 3/11:00",
      "CSS: body font-family, main max-width, nav display flex, section padding, img max-width, table border"
    ],
    tags: ["html", "head", "meta", "title", "body", "header", "nav", "a", "main", "section", "h1", "h2", "p", "figure", "img", "figcaption", "table", "caption", "tr", "th", "td", "footer"],
    expected: {
      links: [{ text: "Home", href: "index.html" }, { text: "Sessions", href: "#sessions" }, { text: "Register", href: "#register" }, { text: "Contact", href: "contact.html" }],
      uploadedPaths: ["images/apex-study-card.svg"],
      images: [{ srcIncludes: "apex-study-card.svg", alt: `${heading} practice image` }],
      tableHeaders: ["Activity", "Room", "Time"],
      htmlIncludes: ["charset=\"UTF-8\"", "name=\"viewport\"", "Apex session timetable", "Spreadsheet", "Documents", "Websites"],
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
    supportDocument: ["Project: Apex Study Hub Open Day", "Required parts: title, heading, subtitle, nav links, image, table, footer, CSS."],
    goal: "Add an HTML comment listing the required page parts.",
    steps: ["Read the support document.", "At the top of body, add a short HTML comment.", "Include title, links, image, table, and CSS in the comment."],
    starterHtml: htmlShell,
    expected: { htmlIncludes: ["<!--", "title", "links", "image", "table", "CSS"] },
    points: 15
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-metadata",
    title: "Prepare the document metadata",
    scenario: "The final build starts with reliable document setup before visible content.",
    supportDocument: ["Use charset UTF-8, viewport, and title: Apex Study Hub Open Day"],
    goal: "Set up head with charset, viewport, and title.",
    steps: ["Find the head element.", "Add charset and viewport meta tags.", "Set the title to Apex Study Hub Open Day."],
    starterHtml: htmlShell,
    expected: { requiredTags: ["meta", "title"], htmlIncludes: ["charset=\"UTF-8\"", "name=\"viewport\""], title: "Apex Study Hub Open Day" },
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
    supportDocument: ["Upload file: apex-study-card.svg", "Image path after upload: images/apex-study-card.svg", "Alt text: Apex open day practice image", "Caption: Students practise before the final check."],
    goal: "Add a figure with image and caption.",
    steps: ["Upload the image.", "Add figure, img, and figcaption inside main.", "Use the uploaded path and exact alt text."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["figure", "img", "figcaption"], uploadedPaths: ["images/apex-study-card.svg"], images: [{ srcIncludes: "apex-study-card.svg", alt: "Apex open day practice image" }], htmlIncludes: ["Students practise before the final check."] },
    points: 30
  }),
  moduleCard("exam-build", "Exam Website Build", {
    id: "web-exam-table",
    title: "Add source data as a table",
    scenario: "Tabular source data must be converted into table, caption, rows, headings, and data cells.",
    supportDocument: ["Caption: Apex session timetable", "Headings: Activity, Room, Time", "Use <tr> rows, <th> headings, and <td> data cells.", "Rows: Spreadsheet/Lab 1/09:00; Documents/Lab 2/10:00; Websites/Lab 3/11:00"],
    goal: "Add the timetable table to the sessions section.",
    steps: ["Find the sessions section.", "Add table and caption.", "Add heading row and three data rows using th and td."],
    starterHtml: apexPageHtml,
    expected: { requiredTags: ["table", "caption", "tr", "th", "td"], tableHeaders: ["Activity", "Room", "Time"], htmlIncludes: ["Apex session timetable", "Spreadsheet", "Documents", "Websites"] },
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
  examPractice("practice-open-day", "Practical Task 1: Build an open day page", "Apex Open Day"),
  examPractice("practice-clinic", "Practical Task 2: Build a clinic page", "Apex ICT Clinic"),
  examPractice("practice-showcase", "Practical Task 3: Build a showcase page", "Apex Skills Showcase"),
  examPractice("practice-register", "Practical Task 4: Build a register page", "Apex Registration Day"),
  examPractice("practice-timetable", "Practical Task 5: Build a timetable page", "Apex Practical Timetable"),
  examPractice("practice-evidence", "Practical Task 6: Build an evidence page", "Apex Evidence Page"),
  examPractice("practice-final", "Practical Task 7: Final exam-style website", "Apex Final Website")
];

const allCards = [
  ...introCards,
  ...textMediaCards,
  ...linksNavigationCards,
  ...tableCards,
  ...cssCards,
  ...examBuildCards
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
