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

export const subjects: SubjectArea[] = [
  {
    slug: "ict",
    title: "ICT",
    summary:
      "Interactive practical and theory preparation for ICT, built around instructions, simulated actions, expected results, and feedback.",
    status: "Interactive MVP",
    paperStructure: [
      "Paper 1: theory practice across all ICT syllabus sections",
      "Paper 2: document production, databases, and presentations",
      "Paper 3: spreadsheets and website authoring"
    ],
    learningModel: [
      "Read the instruction",
      "Identify what the command word or tool means",
      "Attempt the task in a simulated application workspace",
      "Compare the expected result with the student's result",
      "Receive feedback, corrections, and next-step practice"
    ],
    routes: [
      { label: "Open ICT roadmap", href: "/subjects/ict" },
      { label: "Start spreadsheet practice", href: "/academies/spreadsheets/lessons/club-attendance" },
      { label: "Browse ICT practical academies", href: "/academies" }
    ]
  },
  {
    slug: "business",
    title: "Business",
    summary:
      "A structured practice area for business terminology, application, analysis, and evaluation. Full content will be mapped when the Business syllabus and sample papers are added.",
    status: "Content scaffold",
    paperStructure: [
      "Terminology and definition practice",
      "Application to short business contexts",
      "Analysis and evaluation response building"
    ],
    learningModel: [
      "Read the business scenario",
      "Identify the key term or concept being tested",
      "Choose or build a response using the right command-word depth",
      "Compare against an original mark-guidance model",
      "Revise weak terminology and evaluation habits"
    ],
    routes: [
      { label: "Open Business scaffold", href: "/subjects/business" },
      { label: "View pricing", href: "/pricing" }
    ]
  }
];
