"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, ChevronDown, ChevronRight, ListChecks, XCircle } from "lucide-react";
import { businessGlossaryTerms, businessTheoryModules } from "@/lib/business-theory-data";
import { Card, Pill, ProgressBar } from "@/components/ui";

function optionSet(correctIndex: number) {
  const correct = businessGlossaryTerms[correctIndex];
  const offsets = [7, 19, 31];
  const distractors = offsets.map((offset) => businessGlossaryTerms[(correctIndex + offset) % businessGlossaryTerms.length]);
  const options = [correct, ...distractors];
  const rotateBy = correctIndex % options.length;
  return [...options.slice(rotateBy), ...options.slice(0, rotateBy)];
}

export function BusinessTheoryHub() {
  const [activeModuleId, setActiveModuleId] = useState(businessTheoryModules[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState(businessTheoryModules[0]?.lessons[0]?.id || "");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const activeModule = businessTheoryModules.find((module) => module.id === activeModuleId) || businessTheoryModules[0];
  const moduleStartIndex = useMemo(() => {
    const firstLesson = activeModule?.lessons[0];
    return Math.max(0, businessGlossaryTerms.findIndex((term) => term.id === firstLesson?.id));
  }, [activeModule]);
  const currentIndex = (moduleStartIndex + quizIndex) % businessGlossaryTerms.length;
  const quizTerm = businessGlossaryTerms[currentIndex];
  const options = optionSet(currentIndex);
  const isCorrect = selectedAnswer === quizTerm.title;
  const quizProgress = activeModule?.lessons.length ? ((quizIndex % activeModule.lessons.length) / activeModule.lessons.length) * 100 : 0;

  function chooseModule(moduleId: string) {
    const nextModule = businessTheoryModules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(nextModule?.lessons[0]?.id || "");
    setQuizIndex(0);
    setSelectedAnswer(null);
  }

  function nextQuestion() {
    setQuizIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2">
          <BookOpenCheck size={20} className="text-ocean" aria-hidden="true" />
          <h2 className="text-xl font-bold">Business modules</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {businessTheoryModules.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => chooseModule(module.id)}
              className={`flex min-w-0 items-center justify-between rounded-lg border px-4 py-4 text-left font-bold transition ${
                activeModule?.id === module.id ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
              }`}
            >
              <span className="min-w-0 break-words">{module.moduleId}. {module.moduleTitle}</span>
              <ChevronRight size={17} className="ml-3 flex-none" aria-hidden="true" />
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5 min-w-0">
          <Card>
            <Pill>Revision Notes</Pill>
            <h2 className="mt-4 text-3xl font-bold">{activeModule?.moduleTitle}</h2>
            <p className="mt-3 text-slate-600">{activeModule?.overview}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>{activeModule?.lessons.length || 0} note cards</Pill>
              <Pill>Glossary quiz included</Pill>
            </div>
          </Card>

          <div className="space-y-3">
            {activeModule?.lessons.map((lesson) => (
              <section key={lesson.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveLessonId((current) => current === lesson.id ? "" : lesson.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="min-w-0 break-words text-lg font-bold">{lesson.title}</span>
                  <ChevronDown size={18} className={`flex-none text-ocean transition ${activeLessonId === lesson.id ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {activeLessonId === lesson.id && (
                  <div className="border-t border-line px-4 py-4">
                    <p className="text-sm leading-6 text-slate-700">{lesson.definition}</p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        <Card className="self-start">
          <div className="grid gap-6 lg:items-start">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks size={20} className="text-ocean" aria-hidden="true" />
              <h2 className="text-2xl font-bold">Glossary quiz</h2>
            </div>
            <p className="mt-3 leading-7 text-slate-600">
              Read the definition, then choose the correct business term. The other options are pulled from the same glossary bank.
            </p>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>{activeModule?.moduleTitle}</span>
                <span>{(quizIndex % Math.max(1, activeModule?.lessons.length || 1)) + 1}/{activeModule?.lessons.length || 1}</span>
              </div>
              <ProgressBar value={quizProgress} />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-mist p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-ocean">Definition</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-ink">{quizTerm?.fullDefinition}</p>
            <div className="mt-5 grid gap-3">
              {options.map((option) => {
                const chosen = selectedAnswer === option.title;
                const correct = quizTerm?.title === option.title;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedAnswer(option.title)}
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
      </div>
    </div>
  );
}
