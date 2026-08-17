import type { LucideIcon } from "lucide-react";

export type AcademySlug =
  | "word-processing"
  | "spreadsheets"
  | "databases"
  | "presentations"
  | "website-authoring"
  | "theory-revision";

export type SubjectSlug = "ict" | "business";

export type Academy = {
  slug: AcademySlug;
  title: string;
  summary: string;
  icon: LucideIcon;
  color: string;
  outcomes: string[];
  lessons: LessonSummary[];
};

export type SubjectArea = {
  slug: SubjectSlug;
  title: string;
  summary: string;
  status: "Interactive MVP" | "Content scaffold";
  paperStructure: string[];
  learningModel: string[];
  routes: { label: string; href: string }[];
};

export type LessonSummary = {
  id: string;
  title: string;
  level: "Introduction" | "Beginner" | "Intermediate" | "Advanced" | "Checkpoint" | "Milestone" | "Assessment";
  duration: string;
  marks: number;
  description: string;
  available: boolean;
};

export type ValidationResult = {
  isCorrect: boolean;
  marksAwarded: number;
  marksAvailable: number;
  mistakeType: string;
  feedbackMessage: string;
  correctionSteps: string[];
  examinerComment: string;
  confidenceImpact: number;
};

export type ExaminerFeedback = {
  predictedMark: string;
  marksGained: string[];
  marksLost: string[];
  commonMistakes: string[];
  alternativeMethod: string;
  improvementTip: string;
  predictedGradeBand: string;
  examConfidenceScore: number;
};
