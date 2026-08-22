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
};

export const presentationModules: PresentationModule[] = [
  { id: "intro", title: "Slide Foundations", description: "Learn the slide pane, canvas, layouts, title text, and content placeholders." },
  { id: "content", title: "Text and Imported Source", description: "Turn support text into slide titles, subtitles, bullet points, and speaker notes." },
  { id: "design", title: "Design and Objects", description: "Apply consistent themes, add images, align objects, and make slides readable." },
  { id: "output", title: "Review and Output", description: "Use slide numbers, speaker notes, deck order, and teacher-reviewed print/export checks." },
  { id: "exam-build", title: "Exam Presentation Build", description: "Complete a full original 0417-style presentation task from a support document." }
];

export const baseDeck: PresentationSlide[] = [
  { title: "", body: "", bullets: [], layout: "title" }
];

const apexDeck: PresentationSlide[] = [
  { title: "Apex Study Skills Evening", body: "Practical revision support for families and learners.", bullets: [], layout: "title" },
  { title: "Practice Stations", body: "", bullets: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"], layout: "title-content" }
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
    supportDocument: source,
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
  ...["Add a second slide", "Choose a title and content layout", "Add a slide title", "Create three bullet points", "Reorder slide content", "Delete unused text"].map((title, index) => card({
    id: `pres-intro-${index + 3}`,
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title,
    scenario: "Practise one slide-building action before the full deck task.",
    supportDocument: source,
    goal: title,
    steps: ["Use the slide pane and layout control.", "Edit only the selected slide.", "Check the title and content boxes before moving on."],
    starterDeck: apexDeck,
    expected: index === 0
      ? { minSlides: 2 }
      : index === 1
        ? { activeSlide: 1, layout: "title-content" }
        : index === 2
          ? { activeSlide: 1, slideTitle: "Practice Stations" }
          : { activeSlide: 1, bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"] },
    points: 12
  })),
  card({
    id: "pres-intro-checkpoint",
    moduleId: "intro",
    moduleTitle: "Slide Foundations",
    title: "Build a two-slide starter deck",
    scenario: "This checkpoint combines slide creation, layouts, titles, subtitle text, and bullet points.",
    supportDocument: source,
    goal: "Create a two-slide Apex starter deck.",
    steps: ["Slide 1: use Title layout with title and subtitle.", "Slide 2: use Title and Content layout.", "Add the three session bullet points."],
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
  ...[
    ["pres-content-audience", "Add an audience slide", "Audience", ["Year 10 students", "Year 11 students", "Families"]],
    ["pres-content-message", "Summarise the main message", "Why attend?", ["Short sessions", "Practical revision", "Confidence before exams"]],
    ["pres-content-closing", "Add a closing slide", "Book a guided practice slot", ["Choose a subject", "Select a practice session", "Ask a teacher for feedback"]],
    ["pres-content-notes", "Add speaker notes", "Practice Stations", ["Spreadsheet clinic"]]
  ].map(([id, title, slideTitle, bullets]) => card({
    id: id as string,
    moduleId: "content",
    moduleTitle: "Text and Imported Source",
    title: title as string,
    scenario: "A support document has been supplied. Convert the useful points into short slide content.",
    supportDocument: source,
    goal: title as string,
    steps: ["Read the support document.", "Choose the best slide for the information.", "Use short bullet points instead of copying long sentences."],
    starterDeck: apexDeck,
    expected: id === "pres-content-notes"
      ? { activeSlide: 1, notesInclude: "Spreadsheet clinic" }
      : { slideTitle: slideTitle as string, bulletItems: bullets as string[] },
    points: 15
  })),
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
    title: "Insert a relevant image",
    scenario: "A slide about practical revision should include a relevant visual without covering the text.",
    supportDocument: ["Image alternative text: Apex study practice card"],
    goal: "Add the Apex image to a slide.",
    steps: ["Select the slide that needs a visual.", "Click Insert image.", "Set the alt text to Apex study practice card."],
    starterDeck: apexDeck,
    expected: { imageAlt: "Apex study practice card" },
    points: 15
  }),
  ...["Use an image and content layout", "Use a comparison layout", "Keep bullet text short", "Apply a high contrast theme"].map((title, index) => card({
    id: `pres-design-${index + 3}`,
    moduleId: "design",
    moduleTitle: "Design and Objects",
    title,
    scenario: "Improve slide readability using layout, contrast, and object placement.",
    supportDocument: source,
    goal: title,
    steps: ["Select the slide.", "Use the layout or theme control.", "Check the slide is easy to read."],
    starterDeck: apexDeck,
    expected: index === 0 ? { layout: "image-content" } : index === 1 ? { layout: "comparison" } : index === 3 ? { theme: "contrast" } : { bulletItems: ["Spreadsheet clinic"] },
    teacherReview: ["Check that objects are aligned and no text is hidden."],
    points: 15
  }))
];

const outputCards: PresentationCard[] = [
  ...[
    ["pres-output-numbers", "Show slide numbers", { slideNumbers: true }],
    ["pres-output-notes", "Add presenter notes", { notesInclude: "families" }],
    ["pres-output-order", "Check slide order", { minSlides: 4 }],
    ["pres-output-title-check", "Check deck title", { slideTitle: "Apex Study Skills Evening" }]
  ].map(([id, title, expected]) => card({
    id: id as string,
    moduleId: "output",
    moduleTitle: "Review and Output",
    title: title as string,
    scenario: "Before printing or exporting, students must check structure, notes, numbering, and audience suitability.",
    supportDocument: source,
    goal: title as string,
    steps: ["Use the review controls.", "Check every slide in the slide pane.", "Use teacher review for print/export evidence."],
    starterDeck: apexDeck,
    expected: expected as PresentationExpectedResult,
    teacherReview: ["Teacher should check final slide show, handout view, and evidence requirements."],
    points: 15
  }))
];

const examCards: PresentationCard[] = [
  card({
    id: "pres-exam-apex-evening",
    moduleId: "exam-build",
    moduleTitle: "Exam Presentation Build",
    title: "Apex presentation build",
    scenario: "Complete an original presentation task using support text, layouts, theme, image, notes, and final review.",
    supportDocument: source,
    goal: "Create a complete Apex Study Skills Evening presentation.",
    steps: ["Create at least four slides from the support document.", "Use suitable layouts, bullets, theme, image, and slide numbers.", "Add speaker notes and use teacher review for output evidence."],
    starterDeck: baseDeck,
    expected: {
      minSlides: 4,
      slideTitle: "Apex Study Skills Evening",
      bulletItems: ["Spreadsheet clinic", "Document design desk", "Web authoring studio"],
      imageAlt: "Apex study practice card",
      slideNumbers: true
    },
    teacherReview: ["Check slide order, consistency, no overlapping objects, spelling, notes, and output evidence."],
    points: 70
  })
];

const allCards = [...introCards, ...contentCards, ...designCards, ...outputCards, ...examCards];

export function getPresentationModule(moduleId?: string) {
  return presentationModules.find((module) => module.id === moduleId);
}

export function getPresentationCardsForModule(moduleId?: string) {
  return allCards.filter((card) => !moduleId || card.moduleId === moduleId);
}
