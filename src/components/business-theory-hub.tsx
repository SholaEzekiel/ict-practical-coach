"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, ChevronRight, FileText, ListChecks, XCircle } from "lucide-react";
import { businessNoteModules } from "@/lib/business-note-data";
import type { BusinessNoteLesson } from "@/lib/business-note-data";
import { businessGlossaryTerms } from "@/lib/business-theory-data";
import type { BusinessTheoryLesson } from "@/lib/business-theory-data";
import { Card, Pill, ProgressBar } from "@/components/ui";

type ContentTarget = string | "module-glossary" | "module-quiz";
type BusinessKnowledgeQuestion = {
  id: string;
  prompt: string;
  correct: BusinessTheoryLesson;
  options: BusinessTheoryLesson[];
};

const forbiddenLine = /(creativecommons|https?:\/\/|Grupp20fiskar|studyvaults?|studeyvaults?)/i;
const businessQuizScoreStorageKey = "peak-business-quiz-scoreboard";
const businessMinimumQuizCount = 60;

const businessExamNoteAdditions: Record<string, string> = {
  "bus-note-1-3": "\nExam focus - growth and business size\nDo not just say a business is large or small; link the measure to the case. Number of employees suits labour-intensive businesses, output value can mislead when products have different prices, and capital employed suits businesses that use expensive assets.\nGrowth may bring economies of scale and market share, but overexpansion can create cash shortages, communication problems, and loss of control.",
  "bus-note-1-4": "\nExam focus - ownership decisions\nA strong answer compares control, finance, continuity, liability, legal requirements, and the owner's objectives.\nFor franchises, application must use the brand support, fees, rules, supplies, or local market in the case; do not simply repeat the word franchise.",
  "bus-note-1-5": "\nExam focus - objectives and stakeholders\nStakeholder conflict questions need both sides. For example, shareholders may want higher profit, while workers may want higher pay and the local community may want less noise or pollution.\nA justified conclusion should explain which objective matters most in the situation, such as survival for a new business or growth for an established one.",
  "bus-note-2-1": "\nExam focus - motivation answers\nUse the business context when choosing a method of motivation. Piece rate may suit measurable output, commission may suit sales staff, and job enrichment may suit skilled employees needing responsibility.\nFor higher marks, explain how motivation affects productivity, labour turnover, absenteeism, quality, and customer service.",
  "bus-note-2-2": "\nExam focus - management and structure\nA tall structure can improve supervision but slow communication; a wide span may speed decisions but reduce control.\nLeadership style depends on worker skill, urgency, task risk, and the need for ideas. Avoid saying one style is always best.",
  "bus-note-2-3": "\nExam focus - recruitment and training\nApplication means using the vacancy and business situation. A shop supervisor, factory worker, and finance manager may need different selection methods and training.\nInduction introduces the workplace, on-the-job is practical and specific, and off-the-job may bring specialist skills but can be expensive.",
  "bus-note-3-1": "\nExam focus - market research\nPrimary research is current and specific, but may be expensive or biased if the sample is poor. Secondary research is quicker and cheaper, but may be outdated or not fit the business's exact need.\nAccuracy can be affected by sample size, question wording, timing, bias, and whether respondents tell the truth.",
  "bus-note-3-2": "\nExam focus - market and customers\nSegmentation should identify a useful group, such as age, income, lifestyle, location, or buying behaviour.\nA strong answer explains how knowing the segment helps the business adapt product, price, place, and promotion.",
  "bus-note-3-3": "\nExam focus - marketing mix\nFor 8-mark and 12-mark questions, compare the marketing mix elements rather than listing them. A price change may need matching promotion, and a new product may need suitable distribution.\nA good judgement depends on target market, competition, costs, product image, and business objective.",
  "bus-note-4-1": "\nExam focus - production methods\nJob production suits one-off or customised products, batch production suits groups of similar products, and flow production suits high-volume standardised output.\nThe best method depends on demand, variety, skill needs, machinery cost, flexibility, and quality requirements.",
  "bus-note-4-2": "\nExam focus - inventory and break-even\nHigh inventory can prevent production stopping and meet sudden demand, but increases storage cost, risk of damage, and cash tied up in stock.\nBreak-even answers should link fixed costs, variable costs, selling price, contribution, break-even output, and margin of safety.",
  "bus-note-4-3": "\nExam focus - quality\nQuality control checks finished output and can reject faulty products. Quality assurance builds checks into the process to prevent faults.\nQuality matters because it affects reputation, repeat purchases, waste, returns, and competitiveness.",
  "bus-note-5-1": "\nExam focus - choosing finance\nThe best source of finance depends on amount required, purpose, repayment period, cost, business size, legal structure, risk, existing debts, and control.\nDebt keeps ownership but needs repayment and interest; equity avoids interest but may reduce control and share future profits.",
  "bus-note-5-2": "\nExam focus - cash flow\nProfit is not the same as cash. A profitable business can fail if cash inflows arrive after wages, rent, suppliers, or loan payments are due.\nShort-term cash problems may be improved by overdrafts, delaying payments, encouraging faster customer payment, reducing inventory, or selling unused assets.",
  "bus-note-5-5": "\nExam focus - accounts analysis\nRatios must be interpreted, not just calculated. Profitability shows how well profit is made from sales or capital; liquidity shows ability to pay short-term debts.\nCompare with previous years, competitors, and business objectives before making a judgement.",
  "bus-note-6-1": "\nExam focus - economic change\nInflation can raise costs and reduce purchasing power. Higher interest rates can increase loan costs and reduce consumer spending.\nExchange rate appreciation makes imports cheaper and exports more expensive; depreciation usually has the opposite effect.",
  "bus-note-6-2": "\nExam focus - ethics and environment\nEthical or environmental choices can raise costs in the short term but improve reputation, customer loyalty, and relationships with workers or communities.\nA balanced answer weighs profit impact against pressure groups, legal risks, brand image, and stakeholder expectations.",
  "bus-note-6-3": "\nExam focus - international business\nGlobalisation can give access to larger markets, cheaper resources, and spreading risk, but may create transport costs, exchange-rate risk, cultural differences, and stronger competition.\nTariffs and quotas protect local businesses but may raise prices and reduce consumer choice."
};

const tableCards: Record<string, { headers: string[]; rows: string[][]; skip: number }> = {
  "Primary Secondary Tertiary": {
    headers: ["Primary", "Secondary", "Tertiary"],
    rows: [["Industries that extract raw materials from the Earth", "The industry that convert raw materials into finished goods", "The industry that provides services"]],
    skip: 4,
  },
  "Hygiene Motivating": {
    headers: ["Hygiene", "Motivating"],
    rows: [
      ["Good work environment/conditions", "Acknowledgment by superiors"],
      ["Job security", "Promotion"],
      ["Good relationship with superiors", "Enjoyment in the work given"],
      ["Salary", "Achievement"],
    ],
    skip: 4,
  },
  "Planning Organising Commanding Coordinating Controlling": {
    headers: ["Planning", "Organising", "Commanding", "Coordinating", "Controlling"],
    rows: [["Create plans to work towards the business goal", "Creating tasks to put the plan into work, and delegating these tasks", "Giving direction to employees so that the tasks are done well", "Managing multiple employees so work is done efficiently", "Creating deadlines and monitoring progress to meet targets."]],
    skip: 5,
  },
  "Autocratic Democratic Laissez-faire": {
    headers: ["Autocratic", "Democratic", "Laissez-faire"],
    rows: [
      ["Decisions are made by the manager, and employees must follow instructions from the manager without question.", "Managers and employees share and discuss ideas to come up with the best decision.", "The manager shares the objectives and lets the employees do what they see fit with the given task."],
      ["Decisions are made fast. Employees are clear with instructions.", "Decisions made may be the best option, so better decisions made. Employee skills and relationships improve.", "Employees may feel motivated as they have freedom. They can develop their own skills."],
      ["No employee contribution, leading to demotivation and dissatisfaction.", "Decision making is slow. Conflicts may arise; unproductive and slow.", "No clear instructions given. This could be unproductive."],
    ],
    skip: 14,
  },
};

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function cleanLines(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !forbiddenLine.test(line));
}

function definitionParts(line: string) {
  const match = line.match(/^([^:–-]{2,58})\s*[:\-]\s+(.+)$/);
  if (!match) return null;
  const [, term, definition] = match;
  if (term.toLowerCase().startsWith("to ")) return null;
  return { term, definition };
}

function isSoftHeading(line: string) {
  if (line.endsWith(":")) return true;
  if (/^(key definitions|methods of|types of|reasons for|importance of|benefits of|purpose of|role of|leadership styles|communication barriers|private sector|public sector|social enterprises|stakeholders|objectives|financial|non financial|making work less boring)/i.test(line)) return true;
  if (/^(Maslow|Taylor|Herzberg|Internal recruitment|External recruitment|Part time|Full time|Trade unions)/i.test(line)) return true;
  return false;
}

function isBulletLine(line: string) {
  if (definitionParts(line) || tableCards[line] || isSoftHeading(line)) return false;
  if (/^\d+\./.test(line)) return true;
  return line.length <= 95 && !/[.;:]$/.test(line);
}

function NoteTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-ink text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="max-w-sm align-top px-4 py-3 leading-6 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DefinitionLine({ line }: { line: string }) {
  const parts = definitionParts(line);
  if (!parts) return <p className="leading-7 text-slate-800">{line}</p>;
  return (
    <p className="leading-7 text-slate-800">
      <strong className="font-bold text-ink">{parts.term}:</strong> {parts.definition}
    </p>
  );
}

function BusinessNoteRenderer({ lesson }: { lesson: BusinessNoteLesson }) {
  const lines = cleanLines(`${lesson.content}${businessExamNoteAdditions[lesson.id] || ""}`);
  const elements = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const table = tableCards[line];

    if (table) {
      elements.push(<NoteTable key={`${lesson.id}-table-${index}`} headers={table.headers} rows={table.rows} />);
      index += table.skip + 1;
      continue;
    }

    if (isSoftHeading(line)) {
      elements.push(
        <h4 key={`${lesson.id}-heading-${index}`} className="mt-6 border-l-4 border-gold pl-3 text-lg font-bold text-ink first:mt-0">
          {line.replace(/:$/, "")}
        </h4>,
      );
      index += 1;
      continue;
    }

    if (isBulletLine(line)) {
      const bullets = [];
      while (index < lines.length && isBulletLine(lines[index]) && !tableCards[lines[index]]) {
        bullets.push(lines[index].replace(/^\d+\.\s*/, ""));
        index += 1;
      }
      elements.push(
        <ul key={`${lesson.id}-list-${index}`} className="my-4 space-y-2 pl-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 leading-7 text-slate-800">
              <span className="mt-3 h-2 w-2 flex-none bg-gold" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    elements.push(<DefinitionLine key={`${lesson.id}-line-${index}`} line={line} />);
    index += 1;
  }

  return <div className="space-y-3 text-base">{elements}</div>;
}

function buildOptionSet(correct: BusinessTheoryLesson | undefined, pool: BusinessTheoryLesson[]) {
  if (!correct) return [];
  const source = pool.length >= 4 ? pool : businessGlossaryTerms;
  const distractors = shuffle(source.filter((term) => term.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

function cleanQuizPrompt(term: BusinessTheoryLesson) {
  const customPrompts: Record<string, string> = {
    Franchise: "Business arrangement where one business uses another successful business's brand name, products, support, and trading methods in return for fees.",
    Franchisor: "The original business that allows another operator to use its established brand, products, and trading system.",
    Franchisee: "The operator who pays to use an established business name, products, and trading method.",
    Stakeholder: "A person or group with an interest in, or affected by, a business and its decisions.",
    "Added Value": "The difference between the selling price of a product and the cost of bought-in materials and components."
  };
  if (customPrompts[term.title]) return customPrompts[term.title];

  const words = term.title
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);
  return words.reduce((prompt, word) => {
    const pattern = new RegExp(`\\b${word}(?:s|es|ed|ing)?\\b`, "gi");
    return prompt.replace(pattern, "this concept");
  }, term.fullDefinition);
}

function buildKnowledgeQuestions(moduleGlossary: BusinessTheoryLesson[]) {
  if (!moduleGlossary.length) return [];
  const questions: BusinessKnowledgeQuestion[] = [];
  let index = 0;

  while (questions.length < Math.max(businessMinimumQuizCount, moduleGlossary.length)) {
    const term = moduleGlossary[index % moduleGlossary.length];
    const options = buildOptionSet(term, moduleGlossary);
    questions.push({
      id: `${term.id}-knowledge-${Math.floor(index / moduleGlossary.length) + 1}`,
      prompt: cleanQuizPrompt(term),
      correct: term,
      options
    });
    index += 1;
  }

  return questions;
}

export function BusinessTheoryHub() {
  const [activeModuleId, setActiveModuleId] = useState(businessNoteModules[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState<ContentTarget>(businessNoteModules[0]?.lessons[0]?.id || "");
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, { correct: number; attempted: number }>>({});

  const activeModule = businessNoteModules.find((module) => module.id === activeModuleId) || businessNoteModules[0];
  const moduleGlossary = useMemo(
    () => businessGlossaryTerms.filter((term) => term.id.startsWith(`bus-${activeModule?.moduleId}-`)),
    [activeModule?.moduleId],
  );
  const knowledgeQuestions = useMemo(() => buildKnowledgeQuestions(moduleGlossary), [moduleGlossary]);
  const activeLesson = activeModule?.lessons.find((lesson) => lesson.id === activeLessonId);

  useEffect(() => {
    setQuizOrder(shuffle(knowledgeQuestions.map((_, index) => index)));
    setQuizIndex(0);
    setSelectedAnswer(null);
  }, [knowledgeQuestions]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(businessQuizScoreStorageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Record<string, { correct: number; attempted: number }>;
      if (parsed && typeof parsed === "object") setQuizAttempts(parsed);
    } catch {
      window.localStorage.removeItem(businessQuizScoreStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(businessQuizScoreStorageKey, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const orderedIndex = quizOrder.length ? quizOrder[quizIndex % quizOrder.length] : 0;
  const quizQuestion = knowledgeQuestions[orderedIndex] || knowledgeQuestions[0];
  const quizTerm = quizQuestion?.correct;
  const options = quizQuestion?.options || [];
  const isCorrect = selectedAnswer === quizTerm?.title;
  const quizProgress = knowledgeQuestions.length ? ((quizIndex % knowledgeQuestions.length) / knowledgeQuestions.length) * 100 : 0;

  function chooseModule(moduleId: string) {
    const nextModule = businessNoteModules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(nextModule?.lessons[0]?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseContent(moduleId: string, target: ContentTarget) {
    if (moduleId !== activeModuleId) {
      setActiveModuleId(moduleId);
    }
    setActiveLessonId(target);
    setSelectedAnswer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextQuestion() {
    setQuizIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  function chooseAnswer(answer: string) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setQuizAttempts((current) => {
      const moduleScore = current[activeModule.id] || { correct: 0, attempted: 0 };
      return {
        ...current,
        [activeModule.id]: {
          attempted: moduleScore.attempted + 1,
          correct: moduleScore.correct + (answer === quizTerm?.title ? 1 : 0)
        }
      };
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={22} className="text-ocean" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Business modules</h2>
        </div>
        {businessNoteModules.map((module) => {
          const open = activeModule?.id === module.id;
          return (
            <Card key={module.id} className={`transition ${open ? "border-ocean ring-2 ring-ocean/10" : ""}`}>
              <button type="button" onClick={() => chooseModule(module.id)} className="flex w-full items-center justify-between gap-4 text-left">
                <span>
                  <span className="text-sm font-semibold text-slate-500">{module.lessons.length} lessons</span>
                  <span className="mt-2 block break-words text-xl font-bold text-ink">Unit {module.moduleId} {module.moduleTitle}</span>
                </span>
                <ChevronRight className={`flex-none text-ocean transition ${open ? "rotate-90" : ""}`} size={20} aria-hidden="true" />
              </button>

              {open && (
                <div className="mt-5 border-t border-line pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Course Content</h3>
                  <div className="mt-3 space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => chooseContent(module.id, lesson.id)}
                        className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                          activeLessonId === lesson.id ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                        }`}
                      >
                        <span className="min-w-0 break-words font-bold">{lesson.number} {lesson.title}</span>
                        <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => chooseContent(module.id, "module-glossary")}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                        activeLessonId === "module-glossary" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                      }`}
                    >
                      <span className="min-w-0 break-words font-bold">Module glossary</span>
                      <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseContent(module.id, "module-quiz")}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                        activeLessonId === "module-quiz" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                      }`}
                    >
                      <span className="min-w-0 break-words font-bold">Multiple choice questions</span>
                      <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      <div className="min-w-0 space-y-5">
        <Card>
          <Pill>Unit {activeModule?.moduleId}</Pill>
          <h2 className="mt-4 text-3xl font-bold">{activeModule?.moduleTitle}</h2>
          <p className="mt-3 text-slate-600">Open a lesson, then revise the exact topic notes, glossary, and multiple-choice practice for this unit.</p>
        </Card>

        {activeLesson && (
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-mist text-ocean">
                <FileText size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ocean">{activeLesson.number}</p>
                <h3 className="mt-1 break-words text-2xl font-bold">{activeLesson.title}</h3>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-line bg-white p-5 md:p-7">
              <BusinessNoteRenderer lesson={activeLesson} />
            </div>
          </Card>
        )}

        {activeLessonId === "module-glossary" && (
          <Card>
            <Pill>Glossary</Pill>
            <h3 className="mt-4 text-2xl font-bold">{activeModule?.moduleTitle} glossary</h3>
            <div className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
              {moduleGlossary.map((term) => (
                <div key={term.id} className="grid gap-2 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                  <p className="break-words font-bold text-ink">{term.title}</p>
                  <p className="text-sm leading-6 text-slate-700">{term.fullDefinition}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeLessonId === "module-quiz" && quizQuestion && (
          <Card>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks size={20} className="text-ocean" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Multiple choice questions</h2>
                </div>
                <p className="mt-3 leading-7 text-slate-600">Read the definition, then choose the correct business term. Question order is shuffled for this attempt.</p>
                <div className="mt-4 rounded-lg border border-line bg-white p-4">
                  <p className="text-sm font-bold text-ink">Scoreboard</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ocean">{quizAttempts[activeModule.id]?.correct || 0}</p>
                      <p className="text-xs text-slate-600">Correct</p>
                    </div>
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ink">{quizAttempts[activeModule.id]?.attempted || 0}</p>
                      <p className="text-xs text-slate-600">Answered</p>
                    </div>
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ink">
                        {quizAttempts[activeModule.id]?.attempted ? Math.round(((quizAttempts[activeModule.id]?.correct || 0) / quizAttempts[activeModule.id].attempted) * 100) : 0}%
                      </p>
                      <p className="text-xs text-slate-600">Accuracy</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuizAttempts((current) => ({ ...current, [activeModule.id]: { correct: 0, attempted: 0 } }))}
                    className="mt-3 text-xs font-bold text-ocean hover:underline"
                  >
                    Reset module score
                  </button>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>{activeModule?.moduleTitle}</span>
                    <span>{(quizIndex % Math.max(1, knowledgeQuestions.length)) + 1}/{knowledgeQuestions.length || 1}</span>
                  </div>
                  <ProgressBar value={quizProgress} />
                </div>
              </div>

              <div className="rounded-lg border border-line bg-mist p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">Business clue</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-ink">{quizQuestion.prompt}</p>
                <div className="mt-5 grid gap-3">
                  {options.map((option) => {
                    const chosen = selectedAnswer === option.title;
                    const correct = quizTerm?.title === option.title;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => chooseAnswer(option.title)}
                        className={`flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-left font-bold transition ${
                          chosen ? (correct ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700") : "border-line text-ink hover:border-ocean"
                        }`}
                      >
                        <span>{option.title}</span>
                        {chosen && (correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />)}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer && (
                  <div className={`mt-4 rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className="font-bold">{isCorrect ? "Correct" : `Correct answer: ${quizTerm.title}`}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{quizTerm.definition}</p>
                    <button type="button" onClick={nextQuestion} className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">
                      Next question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
