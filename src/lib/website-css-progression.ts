import type { WebsiteAuthoringCard, WebsiteAuthoringModule, WebsiteExpectedResult } from "./website-authoring-instruction-cards";

export const cssProgressionModules: WebsiteAuthoringModule[] = [
  { id: "css-introduction", title: "CSS Introduction: Inline Styles", description: "Change paragraph colour, heading size, and table-cell spacing using simple inline styles." },
  { id: "css-internal", title: "Internal Styles and Classes", description: "Move into a head style block; connect element, class, and ID selectors to the page." },
  { id: "css-tables", title: "Styling Tables", description: "Develop the same timetable with borders, heading colours, padding, and width." },
  { id: "css-positioning", title: "Spacing and Positioning", description: "Arrange the page, navigation, sections, and image with visible layout changes." },
  { id: "css-backgrounds", title: "Background Images", description: "Control an image's position, repetition, and size on a contrasting background." },
  { id: "css-layout", title: "External Stylesheets", description: "Transfer your internal rules to styles.css, then extend the completed page." }
];

type StyleCheck = NonNullable<WebsiteExpectedResult["styleChecks"]>[number];
type Step = { title: string; explanation: string; selector: string; declarations: Record<string, string>; source: StyleCheck["source"]; observe: string; className?: string; transfer?: boolean };
const inline: Record<string, Record<string, string>> = {};
const rules: Record<string, Record<string, string>> = {};
let paragraphClass = "";
let external = false;
let headerId = false;
const firstCell = "table tr:nth-child(2) td:first-child";
const declarations = (values: Record<string, string>) => Object.entries(values).map(([property, value]) => `${property}: ${value};`).join(" ");
const stylesheet = () => Object.entries(rules).map(([selector, values]) => `${selector} {\n  ${Object.entries(values).map(([key, value]) => `${key}: ${value};`).join("\n  ")}\n}`).join("\n\n");
const attributes = (selector: string) => inline[selector] ? ` style="${declarations(inline[selector])}"` : "";
function page(introduction: boolean) {
  const heading = `<h1${attributes("h1")}>Digital Club</h1>`;
  const paragraph = `<p${attributes("p")}${paragraphClass ? ` class="${paragraphClass}"` : ""}>Welcome to our digital club.</p>`;
  const table = `<table>
  <tr><th>Activity</th><th>Day</th></tr>
  <tr><td${attributes(firstCell)}>Web design</td><td>Monday</td></tr>
  <tr><td>Spreadsheets</td><td>Friday</td></tr>
</table>`;
  return `<!doctype html>
<html lang="en">
<head>
  <title>Digital Club</title>
  ${external ? '<link rel="stylesheet" href="styles.css">' : Object.keys(rules).length ? `<style>\n${stylesheet()}\n</style>` : ""}
</head>
<body>
${introduction ? `  ${heading}
  ${paragraph}
  ${table}` : `  <header${headerId ? ' id="banner"' : ""}>${heading}</header>
  <nav><a href="#">Sessions</a> <a href="#">Contact</a></nav>
  <main>
    ${paragraph}
    <section>
      <h2>Weekly sessions</h2>
      ${table}
    </section>
    <img src="/assets/peak-study-card.svg" alt="Study workspace" width="220">
  </main>
  <footer>Contact: digital club office</footer>`}
</body>
</html>`;
}

const stages: Step[][] = [
  [
    { title: "Make paragraph text red", explanation: 'Add a style attribute to the existing paragraph: <p style="color: red;">. The color property changes the text colour.', selector: "p", declarations: { color: "red" }, source: "inline", observe: "Only the welcome paragraph becomes red." },
    { title: "Decode a hexadecimal colour", explanation: "A six-digit hex colour starts with #. The pairs describe red, green, and blue, from 00 (none) to ff (maximum). #0000ff means no red, no green, full blue. Replace the previous colour; do not add a second color declaration.", selector: "p", declarations: { color: "#0000ff" }, source: "inline", observe: "The same paragraph changes from red to vivid blue." },
    { title: "Colour one table cell", explanation: 'background-color fills the element. #00ff00 means full green. Add style="background-color: #00ff00;" to the td containing Web design, not to the whole table.', selector: firstCell, declarations: { "background-color": "#00ff00" }, source: "inline", observe: "One timetable cell becomes bright green; the other cells stay unchanged." },
    { title: "Increase the heading size", explanation: "CSS controls more than colour. A px value sets a visible size. Add font-size to the h1 opening tag without changing its text.", selector: "h1", declarations: { "font-size": "40px" }, source: "inline", observe: "The Digital Club heading becomes noticeably larger." },
    { title: "Give the coloured cell breathing room", explanation: "Padding is space inside an element's boundary. Keep the green background and add padding to the same style attribute, separating declarations with semicolons.", selector: firstCell, declarations: { padding: "16px" }, source: "inline", observe: "The green cell expands around Web design." }
  ],
  [
    { title: "Write your first internal rule", explanation: "Internal CSS belongs inside <style> in head. The element selector p targets paragraphs: p { color: #dc2626; }. Remove the welcome paragraph's inline color so it does not override this rule. p is an element selector; .p would be a class named p.", selector: "p", declarations: { color: "#dc2626" }, source: "internal", observe: "The welcome paragraph changes from blue to a strong red." },
    { title: "Add a second declaration", explanation: "One rule can contain several property: value; declarations between its braces. Keep the red text and increase paragraph size.", selector: "p", declarations: { "font-size": "22px" }, source: "internal", observe: "The red paragraph becomes larger." },
    { title: "Connect a class to HTML", explanation: 'Write .notice { border: 3px solid #7c3aed; } in the style block. Then add class="notice" to the welcome p opening tag. The dot is used in CSS, not in the HTML class value.', selector: ".notice", declarations: { border: "3px solid #7c3aed" }, source: "internal", className: "notice", observe: "A purple border appears around the welcome paragraph only." },
    { title: "Develop the notice style", explanation: "Add background-color and padding to the existing .notice rule. The yellow fill and internal spacing make the class's effect unmistakable.", selector: ".notice", declarations: { "background-color": "#facc15", padding: "16px" }, source: "internal", observe: "The bordered notice gains a vivid yellow background and space around its text." },
    { title: "Style the header by its ID", explanation: 'Add id="banner" to the header opening tag. Then #banner in the style block selects that header. IDs are introduced here after practising element and class selectors.', selector: "#banner", declarations: { "background-color": "#0f766e", color: "#ffffff", padding: "20px" }, source: "internal", observe: "The heading sits on a dark teal band with contrasting white text." },
    { title: "Give the footer its own style", explanation: "A footer element selector can style the contact area without changing the notice or header. Keep the previous rules.", selector: "footer", declarations: { "background-color": "#7c3aed", color: "#ffffff", padding: "16px" }, source: "internal", observe: "The footer becomes a distinct purple band with readable white contact text." }
  ],
  [
    { title: "Draw a visible table grid", explanation: "The comma in th, td selects both heading and data cells. A border needs a width, line style, and colour.", selector: "th, td", declarations: { border: "2px solid #172026" }, source: "internal", observe: "A clear dark grid appears around every timetable cell." },
    { title: "Join the table borders", explanation: "Keep the new cell borders. border-collapse: collapse removes the gaps between neighbouring borders.", selector: "table", declarations: { "border-collapse": "collapse" }, source: "internal", observe: "The separated cell outlines become a single joined grid." },
    { title: "Distinguish the heading row", explanation: "The th selector changes heading cells, not td data cells. A dark blue fill with white text distinguishes labels from data.", selector: "th", declarations: { "background-color": "#1d4ed8", color: "#ffffff" }, source: "internal", observe: "Activity and Day become white labels on blue cells." },
    { title: "Space every table cell", explanation: "Apply padding to th, td so headings and data have equal spacing. Remove the first cell's inline padding so the shared rule controls it too.", selector: "th, td", declarations: { padding: "12px" }, source: "internal", observe: "All timetable cells have consistent space around their text." },
    { title: "Widen the timetable", explanation: "width: 100% uses the available width of the table's parent, rather than a fixed number of pixels.", selector: "table", declarations: { width: "100%" }, source: "internal", observe: "The timetable stretches across its section." }
  ],
  [
    { title: "Centre the page content", explanation: "max-width limits a main area on wide screens. margin: 24px auto adds vertical space and shares remaining horizontal space equally.", selector: "main", declarations: { "max-width": "760px", margin: "24px auto" }, source: "internal", observe: "The notice and timetable form a centred column on a wide preview." },
    { title: "Arrange navigation links", explanation: "Flex layout positions child elements in a row. gap creates space between the links; it does not change their text.", selector: "nav", declarations: { display: "flex", gap: "24px", padding: "16px" }, source: "internal", observe: "Sessions and Contact are clearly separated in a navigation row." },
    { title: "Separate the timetable section", explanation: "Padding adds inside space; margin adds outside space. A border makes the section boundary visible.", selector: "section", declarations: { padding: "20px", "margin-bottom": "24px", border: "3px solid #ea580c" }, source: "internal", observe: "An orange boundary frames the timetable, with space inside and below it." },
    { title: "Align the heading text", explanation: "text-align centres text inside its element. It does not move the whole header or change the main area's width.", selector: "h1", declarations: { "text-align": "center" }, source: "internal", observe: "Digital Club is centred in the teal header." },
    { title: "Position the study image", explanation: "A block image with automatic left and right margins can be centred. Set its width and preserve its proportions with height: auto.", selector: "img", declarations: { display: "block", width: "220px", "max-width": "100%", height: "auto", margin: "20px auto" }, source: "internal", observe: "The study image becomes a small centred image below the timetable." }
  ],
  [
    { title: "Prepare a contrasting background", explanation: "Use a yellow-orange section background so changes remain visible. Keep the table's blue headings and green example cell.", selector: "section", declarations: { "background-color": "#fbbf24", "min-height": "300px" }, source: "internal", observe: "The orange-framed timetable section gains a strong amber fill." },
    { title: "Add a background image", explanation: "background-image paints behind the section's content rather than inserting another img element. The supplied asset path is already available; no upload is required.", selector: "section", declarations: { "background-image": 'url("/assets/peak-study-card.svg")' }, source: "internal", observe: "The study graphic appears behind the section, repeating until the next step." },
    { title: "Stop repetition and set image size", explanation: "no-repeat paints one copy. background-size controls that painted image, not the separate img below the table.", selector: "section", declarations: { "background-repeat": "no-repeat", "background-size": "140px auto" }, source: "internal", observe: "Only one small background graphic remains." },
    { title: "Position the background without covering data", explanation: "background-position: right bottom places the single graphic at the bottom-right. Add bottom padding to reserve space below the table.", selector: "section", declarations: { "background-position": "right bottom", "padding-bottom": "160px" }, source: "internal", observe: "The graphic sits below the timetable at the bottom-right, leaving the data readable." }
  ],
  [
    { title: "Move the rules to an external stylesheet", explanation: 'Copy all rules from the head style block into the CSS tab (styles.css). Remove the style block and put <link rel="stylesheet" href="styles.css"> in head. The preview loads this CSS tab as the linked stylesheet.', selector: "p", declarations: { color: "#dc2626" }, source: "external", transfer: true, observe: "The page keeps its completed appearance; only the location of the rules changes." },
    { title: "Choose the whole page's font", explanation: "Now edit only the CSS tab. body is the parent of the visible page, so its font-family is inherited unless a more specific rule overrides it.", selector: "body", declarations: { "font-family": "Arial, sans-serif" }, source: "external", observe: "The page text changes to a clean sans-serif font." },
    { title: "Style links as a group", explanation: "nav a is a descendant selector: it targets links inside nav, not every link on the page. The braces and declarations are the same as internal CSS.", selector: "nav a", declarations: { color: "#1d4ed8", "font-weight": "bold", "text-decoration": "none" }, source: "external", observe: "Navigation links become bold blue text without underlines." },
    { title: "Add a hover state", explanation: "The :hover state applies only while the pointer is over a navigation link. Preview, then hover Sessions to observe it.", selector: "nav a:hover", declarations: { "background-color": "#facc15", color: "#172026" }, source: "external", observe: "A hovered navigation link gains a yellow highlight." },
    { title: "Finish the page spacing", explanation: "Remove the browser's default body margin. Add explicit space through the rules you already created, rather than adding empty paragraphs.", selector: "body", declarations: { margin: "0" }, source: "external", observe: "Header and footer colour bands reach the page edges; the centred main area keeps its spacing." }
  ]
];

export const cssProgressionCards: WebsiteAuthoringCard[] = stages.flatMap((steps, stageIndex) => steps.map((step, index) => {
  const module = cssProgressionModules[stageIndex];
  const starterHtml = page(stageIndex === 0);
  const starterCss = external ? stylesheet() : "";
  if (step.className) paragraphClass = step.className;
  if (step.selector === "#banner") headerId = true;
  if (stageIndex === 1 && index === 0) delete inline.p;
  if (stageIndex === 2 && index === 3) delete inline[firstCell].padding;
  if (step.transfer) external = true;
  const target = step.source === "inline" ? inline : rules;
  if (step.selector) target[step.selector] = { ...target[step.selector], ...step.declarations };
  const checks: StyleCheck[] = [
    ...Object.entries(inline).map(([selector, properties]) => ({ source: "inline" as const, selector, label: selector === firstCell ? "the Web design table cell" : selector === "h1" ? "the Digital Club heading" : "the welcome paragraph", declarations: { ...properties } })),
    ...Object.entries(rules).map(([selector, properties]) => ({ source: external ? "external" as const : "internal" as const, selector, declarations: { ...properties } }))
  ];
  const tag = step.selector === firstCell ? "td" : step.selector;
  const code = step.source === "inline" ? `<${tag} style="${declarations(target[step.selector])}">` : `${step.selector} { ${declarations(step.declarations)} }`;
  const goals: Record<string, string> = {
  "Make paragraph text red": "Make the welcome paragraph red.",
  "Decode a hexadecimal colour": "Change the welcome paragraph from red to blue using #0000ff.",
  "Colour one table cell": "Give the Web design table cell a bright green background.",
  "Increase the heading size": "Set the Digital Club heading's font size to 40 pixels.",
  "Give the coloured cell breathing room": "Add 16 pixels of padding inside the green table cell.",
  "Write your first internal rule": "Make paragraph text red using a rule inside the HTML head.",
  "Add a second declaration": "Set the paragraph font size to 22 pixels, keeping its red colour.",
  "Connect a class to HTML": "Give the welcome paragraph a purple border using the notice class.",
  "Develop the notice style": "Add a yellow background and 16 pixels of padding to the notice.",
  "Style the header by its ID": "Give the header a teal background using the banner ID.",
  "Give the footer its own style": "Give the footer a purple background and white text.",
  "Draw a visible table grid": "Add a dark 2-pixel border around every table cell.",
  "Join the table borders": "Join neighbouring cell borders into one table grid.",
  "Distinguish the heading row": "Make the table headings white on a blue background.",
  "Space every table cell": "Give all table cells 12 pixels of padding.",
  "Widen the timetable": "Make the timetable fill the width of its section.",
  "Centre the page content": "Centre the main area and limit its width to 760 pixels.",
  "Arrange navigation links": "Arrange the navigation links in a row with a 24-pixel gap.",
  "Separate the timetable section": "Add an orange border and spacing around the timetable section.",
  "Align the heading text": "Centre the Digital Club heading inside the header.",
  "Position the study image": "Centre the study image and set its width to 220 pixels.",
  "Prepare a contrasting background": "Give the timetable section an amber background.",
  "Add a background image": "Use the supplied study graphic as the section background.",
  "Stop repetition and set image size": "Show one background graphic, 140 pixels wide.",
  "Position the background without covering data": "Place the background graphic at the bottom-right, below the table.",
  "Move the rules to an external stylesheet": "Move the internal rules to styles.css without changing the page's appearance.",
  "Choose the whole page's font": "Use Arial for the page's text.",
  "Style links as a group": "Make navigation links bold and blue, without underlines.",
  "Add a hover state": "Give a navigation link a yellow background when the pointer is over it.",
  "Finish the page spacing": "Remove the default space around the outside of the page."
};
  return {
    id: `web-${module.id}-${index + 1}`, moduleId: module.id, moduleTitle: module.title,
    title: step.title, scenario: step.explanation, goal: goals[step.title],
    supportDocument: [`Example: ${code}`, `Look for: ${step.observe}`],
    steps: [
      step.source === "inline" ? `In the HTML tab, find the opening <${tag}> tag${step.selector === firstCell ? " for Web design" : ""}.` : step.source === "internal" ? "In the HTML tab, edit the <style> block inside <head>." : "Edit the rules in the CSS tab.",
      ...(step.source === "inline" ? [`Add or edit the style attribute: style="${declarations(target[step.selector])}". Keep the closing >.`] : [`Add or update this rule: ${code}`]),
      ...(step.className ? ['Add class="notice" to the welcome paragraph opening tag.'] : []),
      ...(step.selector === "#banner" ? ['Add id="banner" to the header opening tag.'] : []),
      ...(stageIndex === 1 && index === 0 ? ["Remove the welcome paragraph's inline color so the internal rule can take effect."] : []),
      ...(stageIndex === 2 && index === 3 ? ["Remove inline padding from the Web design cell; keep its green fill."] : []),
      `Preview: ${step.observe}`
    ],
    starterHtml, starterCss, progressive: true,
    expected: { requiredTags: ["h1", "p", "table", "th", "td", ...(stageIndex > 0 ? ["header", "footer", "nav", "img"] : [])], containedText: [{ container: "h1", text: "Digital Club" }, { container: paragraphClass ? "p.notice" : "p", text: "Welcome to our digital club." }], styleChecks: checks, ...(headerId ? { containedTags: [{ container: "#banner", tag: "h1" }] } : {}), ...(external ? { stylesheetLink: "styles.css", noInternalStyles: true } : {}) },
    points: 10
  };
}));
