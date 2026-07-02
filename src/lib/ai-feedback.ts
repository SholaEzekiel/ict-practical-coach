import type { ExaminerFeedback, ValidationResult } from "./types";

export function createMockExaminerFeedback(results: ValidationResult[]): ExaminerFeedback {
  const awarded = results.reduce((sum, result) => sum + result.marksAwarded, 0);
  const available = results.reduce((sum, result) => sum + result.marksAvailable, 0);
  const lost = available - awarded;
  const percent = available ? Math.round((awarded / available) * 100) : 0;
  const band = percent >= 85 ? "Secure A/A* range" : percent >= 65 ? "Developing B range" : percent >= 45 ? "C/D improvement range" : "Foundation support needed";

  return {
    predictedMark: `${awarded}/${available}`,
    marksGained: results.filter((result) => result.isCorrect).map((result) => result.examinerComment),
    marksLost: lost === 0 ? ["No marks lost in this attempt."] : results.filter((result) => !result.isCorrect).map((result) => `${result.mistakeType}: ${result.feedbackMessage}`),
    commonMistakes: [
      "Selecting a nearby range instead of the exact required range.",
      "Applying a command before entering or checking the required data.",
      "Including the total row when creating a chart from raw category data."
    ],
    alternativeMethod: "For the total, either =SUM(B4:B7) or =B4+B5+B6+B7 is acceptable in this original practice task.",
    improvementTip: lost === 0 ? "Keep narrating the required range before each command; that habit protects marks under time pressure." : "Before checking, compare your selected cells with the instruction and confirm the final worksheet result.",
    predictedGradeBand: band,
    examConfidenceScore: Math.max(20, Math.min(98, 45 + percent / 2))
  };
}
