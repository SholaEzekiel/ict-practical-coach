import type { SubjectArea } from "./types";

export const ictSyllabusStrands = [
  {
    title: "Foundations and devices",
    sections: "1-3",
    skills: ["computer system components", "input and output devices", "storage devices and media"],
    practiceMode: "Image identification, function matching, use-case selection, and misconception checks"
  },
  {
    title: "Networks, safety, security and ICT impact",
    sections: "4-10",
    skills: ["network types", "data transfer risks", "eSafety", "system life cycle", "ICT applications", "audience and communication"],
    practiceMode: "Scenario decisions, terminology drills, command-word responses, and short structured feedback"
  },
  {
    title: "Shared practical skills",
    sections: "11-16",
    skills: ["file management", "image editing", "layout", "styles", "proofing", "graphs and charts"],
    practiceMode: "Instruction cards paired with simulated toolbar actions and expected-result previews"
  },
  {
    title: "Paper 2 practical skills",
    sections: "17-19",
    skills: ["document production", "databases", "presentations"],
    practiceMode: "Step-by-step exam-style workspaces with evidence, screenshots, reports, and output checks"
  },
  {
    title: "Paper 3 practical skills",
    sections: "20-21",
    skills: ["spreadsheets", "website authoring"],
    practiceMode: "Interactive model building, formula checks, chart/source validation, HTML/CSS editing, and browser-preview evidence"
  }
];

export const hotSensePlan = [
  "HotSense segments lessons into small instruction types, such as select, format, calculate, arrange, identify, explain, evaluate, and evidence.",
  "Each segment can run targeted prompts, hints, mistake diagnosis, confidence scoring, and revision recommendations.",
  "Any major AI-generated assessment, certificate decision, teacher-facing judgement, paid unlock, or personal-data action must require clear user approval before it runs."
];

export const ictPracticeAreas = [
  {
    title: "Theory",
    href: "/subjects/ict/theory",
    summary: "Devices, networks, storage, safety, applications, systems, and command-word practice.",
    actions: ["identify images", "match functions", "explain uses", "compare choices"]
  },
  {
    title: "Word Processing",
    href: "/subjects/ict/word-processing",
    summary: "Document layout, tables, headers, footers, styles, proofing, and evidence preparation.",
    actions: ["format text", "edit tables", "apply styles", "check layout"]
  },
  {
    title: "Spreadsheets",
    href: "/subjects/ict/spreadsheets",
    summary: "Cell selection, formulae, formatting, charts, page setup, and output checks.",
    actions: ["select ranges", "enter formulae", "format values", "create charts"]
  },
  {
    title: "Databases",
    href: "/academies/databases",
    summary: "Tables, fields, data types, keys, forms, queries, reports, and validation.",
    actions: ["set fields", "filter records", "build reports", "format output"]
  },
  {
    title: "Presentations",
    href: "/academies/presentations",
    summary: "Slide layouts, master slides, objects, notes, hyperlinks, and print settings.",
    actions: ["choose layouts", "insert objects", "align content", "prepare outputs"]
  },
  {
    title: "Website Authoring",
    href: "/academies/website-authoring",
    summary: "HTML structure, CSS styles, tables, images, hyperlinks, metadata, and browser preview.",
    actions: ["edit HTML", "apply CSS", "check paths", "preview pages"]
  }
];

export const businessPracticeAreas = [
  {
    title: "Terminology",
    summary: "Short drills for key business words, definitions, examples, and common confusions.",
    actions: ["define", "identify", "match", "recall"]
  },
  {
    title: "Application",
    summary: "Scenario-based practice that trains students to apply ideas to the business in the question.",
    actions: ["select context", "connect concept", "write applied points"]
  },
  {
    title: "Analysis",
    summary: "Cause-and-effect chains that move answers beyond simple statements.",
    actions: ["explain impact", "link consequences", "develop chains"]
  },
  {
    title: "Evaluation",
    summary: "Judgement practice for weighing options, using evidence, and writing balanced conclusions.",
    actions: ["compare options", "justify", "evaluate", "conclude"]
  }
];

export const subjects: SubjectArea[] = [
  {
    slug: "ict",
    title: "ICT",
    summary:
      "Practice ICT theory and application software skills by reading instructions, attempting actions, and checking the expected result.",
    focus: [
      "Theory and image recognition",
      "Word processing",
      "Spreadsheets",
      "Databases",
      "Presentations",
      "Website authoring"
    ],
    learningModel: [
      "Read the instruction",
      "Identify what the command word or tool means",
      "Attempt the task in a simulated application workspace",
      "Compare the expected result with the student's result",
      "Receive feedback, corrections, and next-step practice"
    ],
    routes: [
      { label: "Open ICT", href: "/subjects/ict" },
      { label: "Start spreadsheet practice", href: "/subjects/ict/spreadsheets" },
      { label: "Start word processing practice", href: "/subjects/ict/word-processing" }
    ]
  },
  {
    slug: "business",
    title: "Business",
    summary:
      "Practice business terms, application, analysis, and evaluation through guided scenarios and response building.",
    focus: [
      "Terminology",
      "Application",
      "Analysis",
      "Evaluation"
    ],
    learningModel: [
      "Read the business scenario",
      "Identify the key term or concept being tested",
      "Choose or build a response using the right command-word depth",
      "Compare against an original mark-guidance model",
      "Revise weak terminology and evaluation habits"
    ],
    routes: [
      { label: "Open Business", href: "/subjects/business" }
    ]
  }
];
