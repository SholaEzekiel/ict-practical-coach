"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import { businessCaseStudyModules } from "@/lib/business-case-study-data";
import { businessNoteModules } from "@/lib/business-note-data";
import { Card, Pill, ProgressBar } from "@/components/ui";

type Score = { correct: number; attempted: number };
const businessCaseScoreStorageKey = "peak-business-case-scoreboard";

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function BusinessCaseStudyHub() {
  const [activeUnitId, setActiveUnitId] = useState(businessCaseStudyModules[0]?.unitId || 1);
  const [caseIndex, setCaseIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, Score>>({});

  const activeModule = businessCaseStudyModules.find((module) => module.unitId === activeUnitId) || businessCaseStudyModules[0];
  const noteModule = businessNoteModules.find((module) => module.moduleId === activeUnitId);
  const activeCase = activeModule.cases[caseIndex % Math.max(1, activeModule.cases.length)];
  const activeQuestion = activeCase.questions[questionIndex % Math.max(1, activeCase.questions.length)];
  const options = useMemo(
    () => shuffle(activeQuestion.options.map((option, index) => ({ option, index }))),
    [activeQuestion]
  );
  const totalQuestions = activeModule.cases.reduce((total, caseStudy) => total + caseStudy.questions.length, 0);
  const currentQuestionPosition = activeModule.cases
    .slice(0, caseIndex)
    .reduce((total, caseStudy) => total + caseStudy.questions.length, 0) + questionIndex + 1;
  const progress = totalQuestions ? ((currentQuestionPosition - 1) / totalQuestions) * 100 : 0;
  const unitScoreKey = `unit-${activeUnitId}`;
  const unitScore = scores[unitScoreKey] || { correct: 0, attempted: 0 };
  const accuracy = unitScore.attempted ? Math.round((unitScore.correct / unitScore.attempted) * 100) : 0;
  const isCorrect = selectedAnswer === activeQuestion.correctIndex;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(businessCaseScoreStorageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Record<string, Score>;
      if (parsed && typeof parsed === "object") setScores(parsed);
    } catch {
      window.localStorage.removeItem(businessCaseScoreStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(businessCaseScoreStorageKey, JSON.stringify(scores));
  }, [scores]);

  function chooseUnit(unitId: number) {
    setActiveUnitId(unitId);
    setCaseIndex(0);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(answerIndex: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setScores((current) => {
      const currentScore = current[unitScoreKey] || { correct: 0, attempted: 0 };
      return {
        ...current,
        [unitScoreKey]: {
          attempted: currentScore.attempted + 1,
          correct: currentScore.correct + (answerIndex === activeQuestion.correctIndex ? 1 : 0)
        }
      };
    });
  }

  function nextQuestion() {
    if (questionIndex + 1 < activeCase.questions.length) {
      setQuestionIndex((index) => index + 1);
    } else {
      setQuestionIndex(0);
      setCaseIndex((index) => (index + 1) % activeModule.cases.length);
    }
    setSelectedAnswer(null);
  }

  function previousQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
    } else {
      const previousCaseIndex = caseIndex === 0 ? activeModule.cases.length - 1 : caseIndex - 1;
      setCaseIndex(previousCaseIndex);
      setQuestionIndex(activeModule.cases[previousCaseIndex].questions.length - 1);
    }
    setSelectedAnswer(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={22} className="text-ocean" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Case study units</h2>
        </div>
        {businessCaseStudyModules.map((module) => {
          const open = module.unitId === activeUnitId;
          const moduleTitle = businessNoteModules.find((item) => item.moduleId === module.unitId)?.moduleTitle || "Business";
          const questionCount = module.cases.reduce((total, caseStudy) => total + caseStudy.questions.length, 0);
          return (
            <button
              key={module.unitId}
              type="button"
              onClick={() => chooseUnit(module.unitId)}
              className={`w-full rounded-lg border bg-white p-5 text-left shadow-sm transition ${open ? "border-ocean ring-2 ring-ocean/10" : "border-line hover:border-ocean"}`}
            >
              <span className="text-sm font-semibold text-slate-500">{module.cases.length} cases • {questionCount} questions</span>
              <span className="mt-2 block text-xl font-bold text-ink">Unit {module.unitId} Case Study Practice</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{moduleTitle}</span>
            </button>
          );
        })}
      </aside>

      <div className="min-w-0 space-y-5">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Pill>Business Case Study Practice</Pill>
              <h2 className="mt-4 text-3xl font-bold">Unit {activeUnitId} — {noteModule?.moduleTitle || "Business"}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Practise recognising what makes an exam answer stronger: Knowledge, Application, Analysis, and Evaluation.
              </p>
            </div>
            <Link href="/subjects/business/notes" className="inline-flex items-center gap-2 font-semibold text-ocean">
              Business Notes <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </Card>

        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_520px] 2xl:items-start">
          <Card className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-ocean">Business scenario</p>
                <h3 className="mt-2 text-2xl font-bold text-ink">{activeCase.title}</h3>
              </div>
              <Pill>Case {caseIndex + 1}/{activeModule.cases.length}</Pill>
            </div>
            <p className="mt-5 text-lg leading-8 text-slate-700">{activeCase.scenario}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {activeCase.details.map((detail) => (
                <div key={detail} className="rounded-lg border border-line bg-mist p-4">
                  <p className="text-sm font-semibold leading-6 text-slate-700">{detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm font-bold text-ink">Scoreboard</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-mist p-3">
                <p className="font-bold text-ocean">{unitScore.correct}</p>
                <p className="text-xs text-slate-600">Correct</p>
              </div>
              <div className="rounded-lg bg-mist p-3">
                <p className="font-bold text-ink">{unitScore.attempted}</p>
                <p className="text-xs text-slate-600">Answered</p>
              </div>
              <div className="rounded-lg bg-mist p-3">
                <p className="font-bold text-ink">{accuracy}%</p>
                <p className="text-xs text-slate-600">Accuracy</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScores((current) => ({ ...current, [unitScoreKey]: { correct: 0, attempted: 0 } }))}
              className="mt-3 text-xs font-bold text-ocean hover:underline"
            >
              Reset unit score
            </button>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Question progress</span>
                <span>{currentQuestionPosition}/{totalQuestions}</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ListChecks size={20} className="text-ocean" aria-hidden="true" />
                <p className="text-sm font-bold uppercase tracking-wide text-ocean">{activeQuestion.skill} skill focus</p>
              </div>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-ink">{activeQuestion.question}</h3>
            </div>
            <Pill>Question {questionIndex + 1}/{activeCase.questions.length}</Pill>
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {options.map(({ option, index }) => {
              const chosen = selectedAnswer === index;
              const correct = activeQuestion.correctIndex === index;
              return (
                <button
                  key={`${activeQuestion.id}-${option}`}
                  type="button"
                  onClick={() => chooseAnswer(index)}
                  className={`rounded-lg border px-4 py-4 text-left font-semibold leading-7 transition ${
                    chosen ? (correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800") : "border-line bg-white text-ink hover:border-ocean"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-5 rounded-lg border p-5 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className={isCorrect ? "text-emerald-700" : "text-amber-700"} aria-hidden="true" />
                <p className="font-bold">{isCorrect ? "Correct" : `Correct answer: ${activeQuestion.options[activeQuestion.correctIndex]}`}</p>
              </div>
              <div className="mt-3 space-y-2">
                {activeQuestion.feedback.map((line) => (
                  <p key={line} className="leading-7 text-slate-700">{line}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={previousQuestion} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 font-bold text-ink hover:border-ocean">
              <ChevronLeft size={18} aria-hidden="true" /> Previous
            </button>
            <button type="button" onClick={nextQuestion} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 font-bold text-white">
              Next <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
