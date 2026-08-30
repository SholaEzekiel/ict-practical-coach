export type PresentationModule = {
  id: string;
  title: string;
  description: string;
};

export type PresentationExpectedResult = {
  minSlides?: number;
  activeSlide?: number;
  slideTitle?: string;
  slideBodyIncludes?: string[];
  bulletItems?: string[];
  layout?: "title" | "title-content" | "two-content" | "image-content" | "comparison";
  theme?: "clean" | "ocean" | "leaf" | "contrast";
  imageAlt?: string;
  objectTypes?: PresentationObject["type"][];
  masterFooter?: string;
  masterLogo?: boolean;
  notesInclude?: string;
  slideNumbers?: boolean;
};

export type PresentationCard = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  scenario: string;
  supportDocument: string[];
  goal: string;
  steps: string[];
  starterDeck?: PresentationSlide[];
  expected: PresentationExpectedResult;
  teacherReview?: string[];
  points: number;
};

export type PresentationSlide = {
  title: string;
  body: string;
  bullets: string[];
  layout: PresentationExpectedResult["layout"];
  imageAlt?: string;
  notes?: string;
  objects?: PresentationObject[];
  hideMaster?: boolean;
};

export type PresentationObject = {
  id: string;
  type: "title" | "body" | "bullets" | "image" | "shape" | "line";
  text?: string;
  alt?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  fill?: string;
  outline?: string;
  lineWidth?: number;
  layer?: number;
};

export const presentationModules: PresentationModule[] = [
  { id: "intro", title: "Slide Foundations", description: "Learn the slide pane, canvas, layouts, title text, and content placeholders." },
  { id: "content", title: "Text and Imported Source", description: "Turn support text into slide titles, subtitles, bullet points, and speaker notes." },
  { id: "design", title: "Design and Objects", description: "Apply consistent themes, add images, align objects, and make slides readable." },
  { id: "output", title: "Review and Output", description: "Use slide numbers, speaker notes, deck order, and teacher-reviewed print/export checks." },
  { id: "exam-build", title: "Exam Presentation Build", description: "Complete a full original exam-style presentation task from a support document." },
  { id: "free-practice", title: "Free Practice", description: "Create your own deck, import images, preview the slideshow, and print or save as PDF." }
];

export const baseDeck: PresentationSlide[] = [
  { title: "", body: "", bullets: [], layout: "title" }
];

const apexDeck: PresentationSlide[] = [
  { title: "Apex Study Skills Evening", body: "Practical revision support for families and learners.", bullets: [], layout: "title" },
  { title: "Practice Stations", body: "", bullets: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"], layout: "title-content" }
];

const audienceDeck: PresentationSlide[] = [
  ...apexDeck,
  { title: "Audience", body: "", bullets: ["Year 10 students", "Year 11 students", "Families"], layout: "title-content" }
];

const source = [
  "Deck topic: Apex Study Skills Evening",
  "Audience: Year 10 and Year 11 students and their families",
  "Main message: short practical sessions help students revise with confidence",
  "Sessions: Spreadsheet clinic, Document design desk, Web authoring studio",
  "Closing message: Book a guided practice slot with Apex Study Hub"
];

const card = (item: PresentationCard) => item;

const introCards: PresentationCard[] = [
  card({
    id: "pres-intro-title-slide",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Create a title slide",
    scenario: "Apex needs the first slide for a short student information deck.",
    supportDocument: [...source, "Required layout: title-content, shown as Title and content."],
    goal: "Add the deck title to slide 1.",
    steps: ["Select slide 1 in the slide pane.", "Choose the Title layout.", "Type Apex Study Skills Evening in the title box."],
    starterDeck: baseDeck,
    expected: { activeSlide: 0, layout: "title", slideTitle: "Apex Study Skills Evening" },
    points: 10
  }),
  card({
    id: "pres-intro-subtitle",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Add a subtitle",
    scenario: "The title slide should quickly explain what the event is for.",
    supportDocument: source,
    goal: "Add a subtitle to the title slide.",
    steps: ["Keep slide 1 selected.", "Click in the subtitle/body box.", "Type Practical revision support for families and learners."],
    starterDeck: [{ ...baseDeck[0], title: "Apex Study Skills Evening" }],
    expected: { activeSlide: 0, slideTitle: "Apex Study Skills Evening", slideBodyIncludes: ["Practical revision support for families and learners."] },
    points: 10
  }),
  card({
    id: "pres-intro-second-slide",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Add a second slide",
    scenario: "A presentation normally separates the opening title from the detailed information.",
    supportDocument: source,
    goal: "Create a second slide after the title slide.",
    steps: ["Click the New button in the toolbar or slide pane.", "Check that a second thumbnail appears on the left.", "Select slide 2 before adding new content."],
    starterDeck: apexDeck,
    expected: { minSlides: 2 },
    points: 12
  }),
  card({
    id: "pres-intro-title-content-layout",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Choose a title and content layout",
    scenario: "The second slide needs a title area and a content area for bullets.",
    supportDocument: source,
    goal: "Set slide 2 to Title and content layout.",
    steps: ["Select slide 2 in the slide pane.", "Open the Layout dropdown in the toolbar.", "Choose Title and content, which uses the title-content layout."],
    starterDeck: apexDeck,
    expected: { activeSlide: 1, layout: "title-content" },
    points: 12
  }),
  card({
    id: "pres-intro-slide-title",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Add a slide title",
    scenario: "Each information slide should tell the audience what the slide is about.",
    supportDocument: [...source, "Keep the useful slide title: Practice Stations"],
    goal: "Add the title Practice Stations to slide 2.",
    steps: ["Select slide 2.", "Click the title text object or add a Title object if needed.", "Type Practice Stations."],
    starterDeck: apexDeck,
    expected: { activeSlide: 1, slideTitle: "Practice Stations" },
    points: 12
  }),
  card({
    id: "pres-intro-bullets",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Create three bullet points",
    scenario: "Bullets make presentation text easier to read than long paragraphs.",
    supportDocument: source,
    goal: "Add the three practice stations as bullet points.",
    steps: ["Select slide 2.", "Use the bullet object or the properties panel bullet box.", "Enter Spreadsheet clinic, Document design desk, and Web authoring studio as separate bullets."],
    starterDeck: apexDeck,
    expected: { activeSlide: 1, bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"] },
    points: 12
  }),
  card({
    id: "pres-intro-duplicate-slide",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Duplicate a slide",
    scenario: "Duplicating a slide is faster when the next slide needs a similar layout.",
    supportDocument: source,
    goal: "Duplicate slide 2 so the deck has at least three slides.",
    steps: ["Select slide 2 in the slide pane.", "Click Duplicate on the toolbar.", "Check that a new copied slide appears after slide 2."],
    starterDeck: apexDeck,
    expected: { minSlides: 3, bulletItems: ["Spreadsheet clinic"] },
    points: 12
  }),
  card({
    id: "pres-intro-delete-unused-slide",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Delete an unused slide",
    scenario: "Exam work should not contain extra blank or repeated slides.",
    supportDocument: source,
    goal: "Practise deleting an unwanted slide while keeping at least two slides.",
    steps: ["Create or select an unwanted slide.", "Click Delete on the toolbar.", "Check that the useful Practice Stations title and content slides remain."],
    starterDeck: [...apexDeck, { title: "Unused", body: "", bullets: [], layout: "title-content" }],
    expected: { minSlides: 2, slideTitle: "Practice Stations" },
    points: 12
  }),
  card({
    id: "pres-intro-checkpoint",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Build a two-slide starter deck",
    scenario: "This checkpoint combines slide creation, layouts, titles, subtitle text, and bullet points.",
    supportDocument: source,
    goal: "Create a two-slide Apex starter deck.",
    steps: ["Slide 1: use Title layout with title and subtitle.", "Slide 2: use Title and Content layout with the title Practice Stations.", "Add the three session bullet points."],
    starterDeck: baseDeck,
    expected: {
      minSlides: 2,
      slideTitle: "Practice Stations",
      bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"]
    },
    teacherReview: ["Check slide order, spelling, and that bullet points are not written as one paragraph."],
    points: 25
  })
];

const contentCards: PresentationCard[] = [
  card({
    id: "pres-content-audience",
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: "Add an audience slide",
    scenario: "A support document has been supplied. Convert the useful points into short slide content.",
    supportDocument: [...source, "Required layout: image-content, shown as Image and content."],
    goal: "Create an Audience slide with three short bullet points.",
    steps: ["Add a new slide.", "Set the slide title to Audience.", "Add Year 10 students, Year 11 students, and Families as separate bullet points."],
    starterDeck: apexDeck,
    expected: { slideTitle: "Audience", bulletItems: ["Year 10 students", "Year 11 students", "Families"] },
    points: 15
  }),
  card({
    id: "pres-content-message",
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: "Summarise the main message",
    scenario: "Slides should turn source text into short points, not copy the whole paragraph.",
    supportDocument: source,
    goal: "Create a Why attend? slide from the main message.",
    steps: ["Add a new slide.", "Set the title to Why attend?.", "Add Short sessions, Practical revision, and Confidence before exams as bullets."],
    starterDeck: apexDeck,
    expected: { slideTitle: "Why attend?", bulletItems: ["Short sessions", "Practical revision", "Confidence before exams"] },
    points: 15
  }),
  card({
    id: "pres-content-closing",
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: "Add a closing slide",
    scenario: "The final slide should tell the audience what to do next.",
    supportDocument: source,
    goal: "Create a booking slide with action bullets.",
    steps: ["Add a new slide.", "Set the title to Book a guided practice slot.", "Add Choose a subject, Select a practice session, and Ask a teacher for feedback as bullets."],
    starterDeck: apexDeck,
    expected: { slideTitle: "Book a guided practice slot", bulletItems: ["Choose a subject", "Select a practice session", "Ask a teacher for feedback"] },
    points: 15
  }),
  card({
    id: "pres-content-notes",
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: "Add speaker notes",
    scenario: "Speaker notes help the presenter remember extra detail without crowding the slide.",
    supportDocument: ["Speaker note must include: Spreadsheet clinic"],
    goal: "Add a speaker note to the Practice Stations slide.",
    steps: ["Select the Practice Stations slide.", "Use the Speaker notes box in the properties panel.", "Type a note that includes Spreadsheet clinic."],
    starterDeck: apexDeck,
    expected: { activeSlide: 1, notesInclude: "Spreadsheet clinic" },
    points: 15
  }),
  card({
    id: "pres-content-import-checkpoint",
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: "Split source text across slides",
    scenario: "Exam tasks often provide source text. The student must select useful content and place it on suitable slides.",
    supportDocument: source,
    goal: "Create at least four slides from the Apex support document.",
    steps: ["Make one title slide.", "Make separate slides for audience, practice stations, and booking.", "Use concise bullet points."],
    starterDeck: baseDeck,
    expected: { minSlides: 4, bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"] },
    teacherReview: ["Check the student has selected and reorganised the source text, not copied everything onto one slide."],
    points: 35
  })
];

const designCards: PresentationCard[] = [
  card({
    id: "pres-design-theme",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Apply a consistent theme",
    scenario: "The deck should look like one professional presentation, not separate unrelated slides.",
    supportDocument: ["Use the Ocean theme for this deck."],
    goal: "Apply the Ocean theme.",
    steps: ["Open the theme control.", "Choose Ocean.", "Check the colour style applies to all slides."],
    starterDeck: apexDeck,
    expected: { theme: "ocean" },
    points: 12
  }),
  card({
    id: "pres-design-image",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Insert an uploaded image",
    scenario: "A slide about practical revision should include a relevant image uploaded by the student.",
    supportDocument: ["Image alternative text: Apex study workspace"],
    goal: "Upload an image and set useful alt text.",
    steps: ["Select the slide that needs a visual.", "Click Image in the properties panel and choose an image from your device.", "Set the image alt text to Apex study workspace."],
    starterDeck: apexDeck,
    expected: { imageAlt: "Apex study workspace", objectTypes: ["image"] },
    points: 15
  }),
  card({
    id: "pres-design-image-layout",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Use an image and content layout",
    scenario: "The image and text need enough space so neither one covers the other.",
    supportDocument: source,
    goal: "Set the selected slide to Image and content layout.",
    steps: ["Select the slide you want to format.", "Open the Layout dropdown.", "Choose Image and content, which uses the image-content layout."],
    starterDeck: audienceDeck,
    expected: { layout: "image-content" },
    teacherReview: ["Check that objects are aligned and no text is hidden."],
    points: 15
  }),
  card({
    id: "pres-design-shape",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Add a shape callout",
    scenario: "Shapes can highlight important information without rewriting the whole slide.",
    supportDocument: ["Use a shape to highlight: Book early"],
    goal: "Add a shape object to the slide.",
    steps: ["Click Shape in the properties panel.", "Move the shape to a clear empty area on the slide.", "Use the text box or teacher check to label the callout Book early."],
    starterDeck: apexDeck,
    expected: { objectTypes: ["shape"] },
    teacherReview: ["Check that the shape supports the message and does not hide slide text."],
    points: 15
  }),
  card({
    id: "pres-design-textbox",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Add a text box",
    scenario: "A separate text box is useful for short labels, reminders, or callouts.",
    supportDocument: ["Text box wording: Book early"],
    goal: "Add a text box object with the wording Book early.",
    steps: ["Click Text in the properties panel.", "Select the new text box on the slide.", "Change its text to Book early."],
    starterDeck: apexDeck,
    expected: { slideBodyIncludes: ["Book early"], objectTypes: ["body"] },
    points: 15
  }),
  card({
    id: "pres-design-layer",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Move and layer objects",
    scenario: "Presentation objects must be positioned so the audience can read the slide clearly.",
    supportDocument: ["Use Forward and Backward when objects overlap."],
    goal: "Add at least one shape and one text object for layering practice.",
    steps: ["Add a Shape object.", "Add a Text object.", "Select an object and use Forward or Backward to practise layer order."],
    starterDeck: apexDeck,
    expected: { objectTypes: ["shape", "body"] },
    teacherReview: ["Check that the student can move, resize, and layer the objects without hiding key content."],
    points: 15
  }),
  card({
    id: "pres-design-contrast",
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title: "Apply a high contrast theme",
    scenario: "High contrast can make projected slides easier to read.",
    supportDocument: ["Required theme: Contrast"],
    goal: "Apply the Contrast theme.",
    steps: ["Open the Theme dropdown.", "Choose Contrast.", "Check that text remains readable on every slide."],
    starterDeck: apexDeck,
    expected: { theme: "contrast" },
    teacherReview: ["Check that contrast improves readability and does not make the slide too crowded."],
    points: 15
  })
];

const outputCards: PresentationCard[] = [
  card({
    id: "pres-output-numbers",
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: "Show slide numbers",
    scenario: "Before printing or exporting, students must check structure, notes, numbering, and audience suitability.",
    supportDocument: source,
    goal: "Turn on automatic slide numbers.",
    steps: ["Find the Slide numbers checkbox in the properties panel.", "Turn it on.", "Check that each slide shows its own number automatically."],
    starterDeck: apexDeck,
    expected: { slideNumbers: true },
    teacherReview: ["Teacher should check final slide show, handout view, and evidence requirements."],
    points: 15
  }),
  card({
    id: "pres-output-global-footer",
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: "Add a global footer",
    scenario: "Repeated footer text should be added once through Global Design, not typed manually on every slide.",
    supportDocument: ["Footer text: Apex Study Hub"],
    goal: "Use Global Design to add the footer Apex Study Hub.",
    steps: ["Click Global Design.", "Turn on Apply global design.", "Type Apex Study Hub in the Footer text box."],
    starterDeck: apexDeck,
    expected: { masterFooter: "Apex Study Hub" },
    points: 15
  }),
  card({
    id: "pres-output-global-logo",
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: "Add a repeated logo",
    scenario: "A logo or repeated mark should appear automatically across slides when global design is used.",
    supportDocument: ["Logo text: Apex"],
    goal: "Use Global Design to show an Apex logo mark.",
    steps: ["Click Global Design.", "Turn on Apply global design.", "Keep or type Apex in the Logo text box."],
    starterDeck: apexDeck,
    expected: { masterLogo: true },
    points: 15
  }),
  card({
    id: "pres-output-notes",
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: "Add presenter notes",
    scenario: "Presenter notes hold reminders that are not displayed as slide text.",
    supportDocument: ["Speaker note must include: families"],
    goal: "Add presenter notes for the audience slide.",
    steps: ["Select the slide that mentions the audience.", "Use the Speaker notes box.", "Add a note that includes the word families."],
    starterDeck: apexDeck,
    expected: { notesInclude: "families" },
    points: 15
  }),
  card({
    id: "pres-output-preview",
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: "Preview and prepare to print",
    scenario: "The final deck should be checked in output view before saving or printing.",
    supportDocument: ["Use Preview Slideshow, then Print / Save as PDF in the preview window."],
    goal: "Create at least four slides ready for preview.",
    steps: ["Add slides until the deck has at least four useful slides.", "Click Preview Slideshow.", "Use the preview window to inspect the output before printing or saving as PDF."],
    starterDeck: apexDeck,
    expected: { minSlides: 4 },
    teacherReview: ["Confirm the preview window displays the whole deck and that print/PDF output is suitable."],
    points: 15
  })
];

const examCards: PresentationCard[] = [
  card({
    id: "pres-exam-apex-evening",
    moduleId: "exam-build",
    moduleTitle: "Exam Presentation Build",
    title: "Apex presentation build",
    scenario: "Complete an original presentation task using support text, layouts, theme, image, notes, and final review.",
    supportDocument: [
      ...source,
      "Required image alt text: Apex study workspace",
      "Required Global Design footer: Apex Study Hub",
      "Required design object: one clear shape callout"
    ],
    goal: "Create a complete Apex Study Skills Evening presentation.",
    steps: [
      "Create at least four slides from the support document.",
      "Use suitable layouts and add the three practice-station bullets.",
      "Upload an image, set its alt text to Apex study workspace, and add one shape callout.",
      "Use Global Design to add the Apex Study Hub footer, then turn on slide numbers.",
      "Add speaker notes and use Preview Slideshow for final output evidence."
    ],
    starterDeck: baseDeck,
    expected: {
      minSlides: 4,
      slideTitle: "Apex Study Skills Evening",
      bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"],
      imageAlt: "Apex study workspace",
      objectTypes: ["image", "shape"],
      slideNumbers: true,
      masterFooter: "Apex Study Hub"
    },
    teacherReview: ["Check slide order, consistency, no overlapping objects, spelling, notes, and output evidence."],
    points: 70
  })
];

const freePracticeCards: PresentationCard[] = [
  card({
    id: "pres-free-practice",
    moduleId: "free-practice",
    moduleTitle: "Free Practice",
    title: "Free Practice workspace",
    scenario: "Use the presentation editor without a guided validation target.",
    supportDocument: [
      "Create slides with the slide controls and layout menu.",
      "Use the properties panel to add text, bullets, shapes, lines, and your own uploaded images.",
      "Use Preview Slideshow to open the final output, then print or save as PDF."
    ],
    goal: "Create, preview, and print your own presentation.",
    steps: [
      "Build any practice deck using slides, layouts, objects, themes, and Global Design if useful.",
      "Import your own images from the device when you need pictures.",
      "Click Preview Slideshow to review the deck and use Print / Save as PDF when ready."
    ],
    starterDeck: baseDeck,
    expected: {},
    points: 0
  })
];

const allCards = [...introCards, ...contentCards, ...designCards, ...outputCards, ...examCards, ...freePracticeCards];

export function getPresentationModule(moduleId?: string) {
  return presentationModules.find((module) => module.id === moduleId);
}

export function getPresentationCardsForModule(moduleId?: string) {
  return allCards.filter((card) => !moduleId || card.moduleId === moduleId);
}

