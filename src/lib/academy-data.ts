import {
  BarChart3,
  BookOpenCheck,
  Database,
  FileText,
  Globe2,
  Presentation,
  Table2
} from "lucide-react";
import type { Academy } from "./types";

export const academies: Academy[] = [
  {
    slug: "word-processing",
    title: "Word Processing",
    summary: "Format documents, manage tables, use styles, and prepare polished business materials.",
    icon: FileText,
    color: "bg-ocean",
    outcomes: ["Apply consistent document formatting", "Create tables and page layouts", "Proofread and improve professional documents"],
    lessons: [
      { id: "intro", title: "Document production essentials", level: "Introduction", duration: "6 min", marks: 8, description: "Prepare a short information sheet using original source text.", available: true },
      { id: "tables", title: "Tables and page layout", level: "Beginner", duration: "8 min", marks: 10, description: "Build a simple event schedule with readable table formatting.", available: false },
      { id: "checkpoint", title: "Document checkpoint", level: "Checkpoint", duration: "10 min", marks: 15, description: "Complete a compact document production challenge.", available: false }
    ]
  },
  {
    slug: "spreadsheets",
    title: "Spreadsheets",
    summary: "Enter data, format worksheets, use simple formulas, validate workflows, and present charts.",
    icon: Table2,
    color: "bg-leaf",
    outcomes: ["Select and edit cells accurately", "Use formatting and simple formulas", "Create a chart from selected data"],
    lessons: [
      { id: "club-attendance", title: "Club attendance worksheet", level: "Beginner", duration: "10 min", marks: 18, description: "Complete an original spreadsheet task with validation and examiner-style feedback.", available: true },
      { id: "sales-summary", title: "Small shop sales summary", level: "Intermediate", duration: "9 min", marks: 16, description: "Practise formulas, number formatting, and chart preparation.", available: false },
      { id: "spreadsheet-milestone", title: "Spreadsheet milestone", level: "Milestone", duration: "12 min", marks: 25, description: "A compact practical challenge with rewards and confidence scoring.", available: false }
    ]
  },
  {
    slug: "databases",
    title: "Databases",
    summary: "Design tables, enter records, build queries, and create simple reports using original datasets.",
    icon: Database,
    color: "bg-coral",
    outcomes: ["Understand fields and records", "Filter and query useful data", "Create clear reports from a dataset"],
    lessons: [
      { id: "intro", title: "Records and fields", level: "Introduction", duration: "6 min", marks: 8, description: "Explore an original school equipment dataset.", available: true },
      { id: "queries", title: "Simple queries", level: "Beginner", duration: "8 min", marks: 12, description: "Find records using criteria and sort order.", available: false }
    ]
  },
  {
    slug: "presentations",
    title: "Presentations",
    summary: "Create clear slide decks, format content, and use visual hierarchy for communication tasks.",
    icon: Presentation,
    color: "bg-amber",
    outcomes: ["Choose appropriate slide layouts", "Format text and images clearly", "Prepare audience-friendly slides"],
    lessons: [
      { id: "intro", title: "Slide structure basics", level: "Introduction", duration: "6 min", marks: 8, description: "Create a short information deck for a community event.", available: true },
      { id: "visuals", title: "Using images and charts", level: "Beginner", duration: "8 min", marks: 12, description: "Improve a deck using alignment and clear visuals.", available: false }
    ]
  },
  {
    slug: "website-authoring",
    title: "Website Authoring",
    summary: "Practise HTML, CSS, links, images, and simple page structure in a guided editor.",
    icon: Globe2,
    color: "bg-ocean",
    outcomes: ["Build semantic page structure", "Style readable layouts with CSS", "Check links, images, and accessibility"],
    lessons: [
      { id: "intro", title: "HTML page foundations", level: "Introduction", duration: "7 min", marks: 10, description: "Build a small page for a fictional activity club.", available: true },
      { id: "css", title: "CSS presentation", level: "Beginner", duration: "8 min", marks: 12, description: "Apply readable spacing, colour, and typography.", available: false }
    ]
  },
  {
    slug: "theory-revision",
    title: "Theory & Revision",
    summary: "Review key ICT concepts using quick checks, scenario questions, and confidence tracking.",
    icon: BookOpenCheck,
    color: "bg-ink",
    outcomes: ["Explain ICT terms in context", "Apply theory to practical decisions", "Spot weak areas for revision"],
    lessons: [
      { id: "intro", title: "Practical theory warm-up", level: "Introduction", duration: "5 min", marks: 8, description: "Answer short original questions linked to practical skills.", available: true },
      { id: "security", title: "Data security scenarios", level: "Beginner", duration: "7 min", marks: 10, description: "Choose suitable controls for everyday ICT risks.", available: false }
    ]
  }
];

export const dashboardStats = {
  overallProgress: 18,
  streak: 4,
  predictedGradeBand: "Developing B/C range",
  confidence: 62,
  weakAreas: ["Formula accuracy", "Chart source selection", "Consistent number formatting"],
  recommended: "Club attendance worksheet"
};

export const teacherStats = {
  classrooms: 3,
  learners: 86,
  averageReadiness: 58,
  weakTopics: ["Spreadsheet formulas", "Database query criteria", "Presentation consistency"],
  recentActivity: ["Year 10 Alpha completed Spreadsheet Introduction", "Year 11 Beta unlocked a milestone reward", "Revision group improved confidence by 7 points"]
};
