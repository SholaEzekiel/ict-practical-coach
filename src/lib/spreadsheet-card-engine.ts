import type { SpreadsheetInstructionCard } from "./spreadsheet-instruction-cards";

export type SpreadsheetCardAttempt = {
  selectedRange?: string;
  clickedPath?: string[];
  action?: string;
  resultConfirmed?: boolean;
};

export type SpreadsheetCardFeedback = {
  isCorrect: boolean;
  stage: "selection" | "tool" | "action" | "result" | "complete";
  message: string;
  nextStep: string;
};

function normalise(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function pathMatches(actual: string[] = [], expected: string[]) {
  return actual.map(normalise).join(">") === expected.map(normalise).join(">");
}

export function validateSpreadsheetCard(card: SpreadsheetInstructionCard, attempt: SpreadsheetCardAttempt): SpreadsheetCardFeedback {
  if (card.expectedSelection && normalise(attempt.selectedRange) !== normalise(card.expectedSelection)) {
    return {
      isCorrect: false,
      stage: "selection",
      message: card.feedback.wrongSelection || `Select ${card.expectedSelection} first.`,
      nextStep: card.hints[0] || "Check the range in the instruction."
    };
  }

  if (!pathMatches(attempt.clickedPath, card.clickPath)) {
    return {
      isCorrect: false,
      stage: "tool",
      message: card.feedback.wrongTool,
      nextStep: `Expected path: ${card.clickPath.join(" > ")}`
    };
  }

  if (normalise(attempt.action) !== normalise(card.expectedAction)) {
    return {
      isCorrect: false,
      stage: "action",
      message: `Use the ${card.expectedAction.replaceAll("-", " ")} action.`,
      nextStep: card.hints[1] || "Choose the command that matches the instruction."
    };
  }

  if (!attempt.resultConfirmed) {
    return {
      isCorrect: false,
      stage: "result",
      message: card.feedback.wrongResult,
      nextStep: "Check the expected result before moving on."
    };
  }

  return {
    isCorrect: true,
    stage: "complete",
    message: "Correct workflow. The selection, tool path, action, and expected result match this instruction.",
    nextStep: "Move to the next instruction card."
  };
}
