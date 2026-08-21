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
    description: "Practise page titles, headings, paragraphs, semantic structure, and source-text placement."
  },
  {
    id: "text-media",
    title: "Text and Images",
    description: "Add images, alternative text, captions, and image placement for exam-style web pages."
  },
  {
    id: "links-navigation",
    title: "Links and Navigation",
    description: "Create internal links, external links, navigation lists, and clear menu structures."
  },
  {
    id: "tables",
    title: "HTML Tables",
    description: "Build tables from support data, add headings, and present rows clearly."
  },
  {
    id: "css-layout",
    title: "CSS Layout",
    description: "Apply selectors, colours, spacing, borders, widths, and simple responsive layout."
  },
  {
    id: "exam-build",
    title: "Exam Website Build",
    description: "Combine HTML, CSS, links, images, tables, and teacher-reviewed finishing checks."
  }
];

const blankHtml = `<main>\n  \n</main>`;

const baseCss = `body {\n  font-family: Arial, sans-serif;\n  color: #172026;\n}\n`;

const festivalSupport = [
  "Support document: Tawara Cycling Festival",
  "Main heading: Tawara Cycling Festival",
  "Page subtitle: Cycling for every ability",
  "The event is open to club members and visiting cyclists.",
  "The routes pass through woodlands, heathland, wetland habitats and farmland."
];

const festivalStarterHtml = `<main>
  <h1>Tawara Cycling Festival</h1>
  <p>The event is open to club members and visiting cyclists.</p>
  <section>
    <h2>The Trails</h2>
    <p>The routes pass through woodlands, heathland, wetland habitats and farmland.</p>
  </section>
</main>`;

const tableStarterHtml = `<main>
  <h1>Trail Details</h1>
  <table>
    <tr><td>Distance</td><td>Lunch</td><td>Fee</td></tr>
    <tr><td>25 miles</td><td>No</td><td>15.00</td></tr>
    <tr><td>50 miles</td><td>No</td><td>20.00</td></tr>
  </table>
</main>`;

const card = (item: WebsiteAuthoringCard) => item;

const introCards: WebsiteAuthoringCard[] = [
  card({
    id: "web-intro-title",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add the main page heading",
    scenario: "A source document has been supplied for a cycling festival web page.",
    supportDocument: festivalSupport,
    goal: "Add the main heading Tawara Cycling Festival inside an h1 element.",
    steps: ["Click in the HTML editor.", "Add an h1 element inside main.", "Use the heading text from the support document."],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: { requiredTags: ["h1"], htmlIncludes: ["Tawara Cycling Festival"] },
    points: 10
  }),
  card({
    id: "web-intro-subtitle",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "Add a subtitle paragraph",
    scenario: "The home page needs a short line under the main heading.",
    supportDocument: festivalSupport,
    goal: "Add the subtitle Cycling for every ability as a paragraph.",
    steps: ["Find the main heading.", "Add a p element below it.", "Use the subtitle from the support document."],
    starterHtml: `<main>\n  <h1>Tawara Cycling Festival</h1>\n</main>`,
    starterCss: baseCss,
    expected: { requiredTags: ["p"], htmlIncludes: ["Cycling for every ability"] },
    points: 10
  }),
  ...[
    ["web-intro-section-trails", "The Trails", "Create a section heading for trail information."],
    ["web-intro-section-register", "Registration and Participation", "Create a section heading for registration information."],
    ["web-intro-section-entertainment", "Entertainment", "Create a section heading for entertainment information."],
    ["web-intro-paragraph-members", "The event is open to club members and visiting cyclists.", "Add the audience paragraph."],
    ["web-intro-paragraph-routes", "The routes pass through woodlands, heathland, wetland habitats and farmland.", "Add the route description paragraph."],
    ["web-intro-paragraph-safety", "Cyclists must start within twenty minutes of the listed start time.", "Add the safety timing paragraph."]
  ].map(([id, text, goal]) => card({
    id,
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: goal,
    scenario: "Practise placing source text into a meaningful HTML structure.",
    supportDocument: ["Support document: Cycling Festival", text],
    goal,
    steps: ["Choose the correct place in the HTML.", "Use a heading element for a section title or a paragraph element for body text.", "Check the preview shows the new content."],
    starterHtml: festivalStarterHtml,
    starterCss: baseCss,
    expected: { htmlIncludes: [text], requiredTags: goal.includes("heading") ? ["h2"] : ["p"] },
    points: 10
  })),
  card({
    id: "web-intro-0417-challenge",
    moduleId: "intro",
    moduleTitle: "HTML Foundations",
    title: "0417 page setup challenge",
    scenario: "Exam tasks often start with a partially prepared page and source text to insert in the right structure.",
    supportDocument: festivalSupport,
    goal: "Build the basic page structure with heading, subtitle, and trails section.",
    steps: ["Use h1 for the main heading.", "Use p for the subtitle.", "Use section and h2 for The Trails."],
    starterHtml: blankHtml,
    starterCss: baseCss,
    expected: { requiredTags: ["main", "h1", "p", "section", "h2"], htmlIncludes: ["Tawara Cycling Festival", "Cycling for every ability", "The Trails"] },
    teacherReview: ["Check the student chose suitable structural tags, not only visible text."],
    points: 25
  })
];

const textMediaCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-media-image", "Insert the rider image", "cyclist"],
    ["web-media-alt", "Set useful alternative text", "cyclist"],
    ["web-media-caption", "Add a caption for the image", "Rider on the festival route"]
  ].map(([id, title, text]) => card({
    id,
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title,
    scenario: "The festival page needs a relevant image and accessible text.",
    supportDocument: ["Image file: j2321rider.jpg", "Caption: Rider on the festival route", "Alt text: cyclist"],
    goal: title,
    steps: ["Add or edit the img element.", "Use /assets/j2321rider.jpg as the image source.", "Check the preview and image attributes."],
    starterHtml: festivalStarterHtml,
    starterCss: baseCss,
    expected: { images: [{ srcIncludes: "j2321rider.jpg", alt: "cyclist" }], htmlIncludes: title.includes("Caption") ? [text] : undefined },
    points: 15
  })),
  ...[
    ["web-media-figure", "Wrap the image in a figure element", "figure"],
    ["web-media-figcaption", "Use a figcaption element", "figcaption"],
    ["web-media-section-image", "Place image in the trails section", "img"]
  ].map(([id, title, tag]) => card({
    id,
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title,
    scenario: "Exam website tasks often check whether images are placed logically and labelled clearly.",
    supportDocument: ["Image file: j2321rider.jpg", "Caption: Rider on the festival route"],
    goal: title,
    steps: ["Find the correct place in the HTML.", "Use the appropriate image or caption element.", "Check the preview still reads clearly."],
    starterHtml: `${festivalStarterHtml}\n<img src="/assets/j2321rider.jpg" alt="cyclist">`,
    starterCss: baseCss,
    expected: { requiredTags: [tag], images: [{ srcIncludes: "j2321rider.jpg", alt: "cyclist" }] },
    points: 15
  })),
  card({
    id: "web-media-0417-challenge",
    moduleId: "text-media",
    moduleTitle: "Text and Images",
    title: "0417 image placement challenge",
    scenario: "A typical web authoring task asks students to insert a supplied image, set alt text, and position it with CSS.",
    supportDocument: ["Image file: j2321rider.jpg", "Alt text: cyclist", "Caption: Rider on the festival route"],
    goal: "Add the rider image with alt text and a caption.",
    steps: ["Insert the image into the page.", "Set the alt attribute.", "Add a caption below the image."],
    starterHtml: festivalStarterHtml,
    starterCss: `${baseCss}\nimg {\n  max-width: 260px;\n}\n`,
    expected: { requiredTags: ["img"], images: [{ srcIncludes: "j2321rider.jpg", alt: "cyclist" }], htmlIncludes: ["Rider on the festival route"] },
    teacherReview: ["Check image position and proportional sizing against the intended page design."],
    points: 30
  })
];

const linkCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-link-home", "Create a Home link", "Home", "index.html"],
    ["web-link-trails", "Create a Trails link", "Trails", "#trails"],
    ["web-link-register", "Create a Register link", "Register", "#registration"],
    ["web-link-contact", "Create a Contact link", "Contact", "contact.html"],
    ["web-link-image", "Link to the image file", "Rider image", "/assets/j2321rider.jpg"],
    ["web-link-mail", "Create an email link", "Email organiser", "mailto:info@example.com"]
  ].map(([id, title, text, href]) => card({
    id,
    moduleId: "links-navigation",
    moduleTitle: "Links and Navigation",
    title,
    scenario: "Navigation links must point to the correct pages or sections.",
    supportDocument: [`Link text: ${text}`, `Target: ${href}`],
    goal: title,
    steps: ["Find or add the navigation area.", "Create an anchor element.", "Set the href to the target in the support document."],
    starterHtml: `<nav>\n  \n</nav>\n${festivalStarterHtml}`,
    starterCss: baseCss,
    expected: { links: [{ text, href }] },
    points: 15
  })),
  card({
    id: "web-link-0417-challenge",
    moduleId: "links-navigation",
    moduleTitle: "Links and Navigation",
    title: "0417 navigation challenge",
    scenario: "A web page needs a small navigation menu with working internal links.",
    supportDocument: ["Menu: Home, Trails, Registration", "Targets: index.html, #trails, #registration"],
    goal: "Create a three-item navigation menu.",
    steps: ["Use nav for the menu.", "Add three links.", "Check each href matches the support document."],
    starterHtml: festivalStarterHtml.replace("<section>", `<section id="trails">`).replace("<h2>The Trails</h2>", `<h2>The Trails</h2><section id="registration"><h2>Registration</h2></section>`),
    starterCss: baseCss,
    expected: { requiredTags: ["nav", "a"], links: [{ text: "Home", href: "index.html" }, { text: "Trails", href: "#trails" }, { text: "Registration", href: "#registration" }] },
    teacherReview: ["Check the menu is clear, consistent and accessible."],
    points: 30
  })
];

const tableSpecs: Array<[string, string, string[]]> = [
    ["web-table-heading", "Create table headings", ["Distance", "Lunch", "Fee"]],
    ["web-table-25", "Add the 25 mile row", ["25 miles", "No", "15.00"]],
    ["web-table-50", "Add the 50 mile row", ["50 miles", "No", "20.00"]],
    ["web-table-75", "Add the 75 mile row", ["75 miles", "Yes", "25.00"]],
    ["web-table-100", "Add the 100 mile row", ["100 miles", "Yes", "25.00"]],
    ["web-table-150", "Add the 150 mile row", ["150 miles", "Yes", "32.00"]]
];

const tableCards: WebsiteAuthoringCard[] = [
  ...tableSpecs.map(([id, title, values]) => card({
    id,
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title,
    scenario: "Trail details are supplied as source data and must be placed into an HTML table.",
    supportDocument: [`Table data: ${(values as string[]).join(" | ")}`],
    goal: title,
    steps: ["Find the table in the HTML.", "Use tr for a row and th or td for cells.", "Check the preview shows the data in separate cells."],
    starterHtml: tableStarterHtml,
    starterCss: baseCss,
    expected: { htmlIncludes: values, tableHeaders: title.includes("heading") ? values : undefined, requiredTags: ["table", "tr"] },
    points: 15
  })),
  card({
    id: "web-table-0417-challenge",
    moduleId: "tables",
    moduleTitle: "HTML Tables",
    title: "0417 table build challenge",
    scenario: "A web authoring question may provide CSV-style data and require a formatted HTML table.",
    supportDocument: ["Headers: Distance, Lunch, Fee, Climb", "Rows: 25/No/15.00/949; 50/No/20.00/1640; 75/Yes/25.00/2112"],
    goal: "Build a trail details table with headings and three data rows.",
    steps: ["Use th cells for the heading row.", "Add the three data rows.", "Teacher should check the table is readable and fits the page."],
    starterHtml: `<main><h1>Trail Details</h1></main>`,
    starterCss: baseCss,
    expected: { requiredTags: ["table", "tr", "th", "td"], tableHeaders: ["Distance", "Lunch", "Fee", "Climb"], htmlIncludes: ["25", "50", "75", "949", "1640", "2112"] },
    teacherReview: ["Check table readability, consistent cell spacing and suitable borders."],
    points: 35
  })
];

const cssCards: WebsiteAuthoringCard[] = [
  ...[
    ["web-css-body-font", "Set the body font", "body", "font-family"],
    ["web-css-heading-color", "Style the main heading colour", "h1", "color"],
    ["web-css-image-width", "Control image width", "img", "max-width"],
    ["web-css-table-border", "Add table borders", "table", "border"],
    ["web-css-nav-spacing", "Space navigation links", "nav", "gap"],
    ["web-css-section-padding", "Add section padding", "section", "padding"],
    ["web-css-page-width", "Set page width", "main", "max-width"],
    ["web-css-background", "Set page background", "body", "background"]
  ].map(([id, title, selector, property]) => card({
    id,
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title,
    scenario: "The HTML is present; now style it with CSS selectors and properties.",
    supportDocument: [`Selector: ${selector}`, `Property: ${property}`],
    goal: title,
    steps: ["Open the CSS editor.", "Find or add the selector.", "Add the requested property."],
    starterHtml: `${festivalStarterHtml}<img src="/assets/j2321rider.jpg" alt="cyclist">${tableStarterHtml}`,
    starterCss: baseCss,
    expected: { cssIncludes: [selector, property] },
    points: 15
  })),
  card({
    id: "web-css-0417-challenge",
    moduleId: "css-layout",
    moduleTitle: "CSS Layout",
    title: "0417 CSS house style challenge",
    scenario: "Exam web tasks often require a consistent house style across headings, images, navigation and tables.",
    supportDocument: ["Use a readable sans-serif font.", "Constrain main page width.", "Add visible table borders.", "Make images responsive."],
    goal: "Apply a consistent CSS house style to the page.",
    steps: ["Style body and main.", "Add table borders.", "Set image max-width."],
    starterHtml: `${festivalStarterHtml}<img src="/assets/j2321rider.jpg" alt="cyclist">${tableStarterHtml}`,
    starterCss: baseCss,
    expected: { cssIncludes: ["body", "font-family", "main", "max-width", "table", "border", "img", "max-width"] },
    teacherReview: ["Check colour contrast, spacing and overall suitability for the audience."],
    points: 35
  })
];

const examCards: WebsiteAuthoringCard[] = [
  card({
    id: "web-exam-festival-page",
    moduleId: "exam-build",
    moduleTitle: "Exam Website Build",
    title: "0417 festival website task",
    scenario: "This combines the main website authoring skills: structure, source text, image, links, table and CSS.",
    supportDocument: [
      "Create a page for Tawara Cycling Festival.",
      "Include heading, subtitle, trails section, rider image, navigation menu and trail details table.",
      "Apply CSS for readable font, page width, image width and table borders.",
      "Teacher check: file names, relative paths, audience suitability, browser preview and evidence screenshots."
    ],
    goal: "Build a complete exam-style festival web page.",
    steps: ["Complete the HTML structure.", "Add image, navigation and table.", "Apply the CSS house style.", "Use teacher review for file/path/evidence checks."],
    starterHtml: `<main>\n  \n</main>`,
    starterCss: baseCss,
    expected: {
      requiredTags: ["main", "h1", "h2", "nav", "a", "img", "table", "tr", "th", "td"],
      htmlIncludes: ["Tawara Cycling Festival", "Cycling for every ability", "The Trails", "Distance", "Lunch", "Fee"],
      images: [{ srcIncludes: "j2321rider.jpg", alt: "cyclist" }],
      links: [{ text: "Home", href: "index.html" }, { text: "Trails", href: "#trails" }],
      cssIncludes: ["font-family", "max-width", "border"]
    },
    teacherReview: [
      "Check file names and relative paths match the question.",
      "Check the page works in a browser and images are not broken.",
      "Check layout, contrast, spelling and suitability for the audience."
    ],
    points: 70
  }),
  ...["source structure", "image evidence", "navigation evidence", "table evidence", "css evidence"].map((name, index) => card({
    id: `web-exam-${name.replaceAll(" ", "-")}`,
    moduleId: "exam-build",
    moduleTitle: "Exam Website Build",
    title: `Exam practice: ${name}`,
    scenario: "Practise one part of the final website build before attempting the full task.",
    supportDocument: ["Use the festival source text and page assets.", "Check your browser preview after editing."],
    goal: `Complete the ${name} part of the page.`,
    steps: ["Read the support document.", "Edit the HTML or CSS.", "Check the preview and use teacher review for presentation."],
    starterHtml: festivalStarterHtml,
    starterCss: baseCss,
    expected: index === 0
      ? { requiredTags: ["main", "h1", "section"], htmlIncludes: ["Tawara Cycling Festival"] }
      : index === 1
        ? { images: [{ srcIncludes: "j2321rider.jpg", alt: "cyclist" }] }
        : index === 2
          ? { links: [{ text: "Home", href: "index.html" }] }
          : index === 3
            ? { requiredTags: ["table"], htmlIncludes: ["Distance"] }
            : { cssIncludes: ["body", "font-family"] },
    teacherReview: ["Check that the result would satisfy the style and evidence requirements in a practical paper."],
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
