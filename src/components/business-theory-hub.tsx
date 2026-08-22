"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, ChevronDown, ChevronRight, FileText, ListChecks, XCircle } from "lucide-react";
import { businessNoteModules } from "@/lib/business-note-data";
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
  const [activeModuleId, setActiveModuleId] = useState(businessNoteModules[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState(businessNoteModules[0]?.lessons[0]?.id || "");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const activeModule = businessNoteModules.find((module) => module.id === activeModuleId) || businessNoteModules[0];
  const moduleGlossary = businessGlossaryTerms.filter((term) => term.id.startsWith(`bus-${activeModule?.moduleId}-`));
  const moduleStartIndex = useMemo(() => {
    const firstLesson = moduleGlossary[0];
    return Math.max(0, businessGlossaryTerms.findIndex((term) => term.id === firstLesson?.id));
  }, [moduleGlossary]);
  const currentIndex = (moduleStartIndex + quizIndex) % businessGlossaryTerms.length;
  const quizTerm = businessGlossaryTerms[currentIndex];
  const options = optionSet(currentIndex);
  const isCorrect = selectedAnswer === quizTerm.title;
  const quizProgress = moduleGlossary.length ? ((quizIndex % moduleGlossary.length) / moduleGlossary.length) * 100 : 0;

  function chooseModule(moduleId: string) {
    const nextModule = businessNoteModules.find((module) => module.id === moduleId);
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
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2">
          <BookOpenCheck size={22} className="text-ocean" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Modules</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {businessNoteModules.map((module) => (
            <button
              key={module.id}
              type="button"
              onClick={() => chooseModule(module.id)}
              className={`min-h-40 rounded-lg border bg-white p-5 text-left shadow-sm transition hover:border-ocean hover:shadow-soft ${
                activeModule?.id === module.id ? "border-ocean ring-2 ring-ocean/10" : "border-line"
              }`}
            >
              <span className="text-sm font-semibold text-slate-500">{module.lessons.length} lessons</span>
              <span className="mt-5 block break-words text-2xl font-bold text-ink">Unit {module.moduleId} {module.moduleTitle}</span>
              <span className="mt-5 flex items-center gap-2 text-sm font-bold text-ocean">
                Open unit <ChevronRight size={16} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="self-start">
          <h2 className="text-2xl font-bold">Course Content</h2>
          <div className="mt-5 space-y-3">
            {activeModule?.lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonId(lesson.id)}
                className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-4 text-left transition ${
                  activeLessonId === lesson.id ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                }`}
              >
                <span className="min-w-0 break-words font-bold">{lesson.number} {lesson.title}</span>
                <ChevronRight size={17} className="flex-none" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveLessonId("module-glossary")}
              className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-4 text-left transition ${
                activeLessonId === "module-glossary" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
              }`}
            >
              <span className="min-w-0 break-words font-bold">Module glossary</span>
              <ChevronRight size={17} className="flex-none" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveLessonId("module-quiz")}
              className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-4 text-left transition ${
                activeLessonId === "module-quiz" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
              }`}
            >
              <span className="min-w-0 break-words font-bold">Multiple choice questions</span>
              <ChevronRight size={17} className="flex-none" aria-hidden="true" />
            </button>
          </div>
        </Card>

        <div className="min-w-0 space-y-5">
          <Card>
            <Pill>Unit {activeModule?.moduleId}</Pill>
            <h2 className="mt-4 text-3xl font-bold">{activeModule?.moduleTitle}</h2>
            <p className="mt-3 text-slate-600">
              Notes are structured from the Apex Note PDF by topic, followed by the unit glossary and multiple-choice practice.
            </p>
          </Card>

          {activeModule?.lessons.map((lesson) => (
            activeLessonId === lesson.id ? (
              <Card key={lesson.id}>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-mist text-ocean">
                    <FileText size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ocean">{lesson.number}</p>
                    <h3 className="mt-1 break-words text-2xl font-bold">{lesson.title}</h3>
                  </div>
                </div>
                <div className="mt-6 max-w-none rounded-lg border border-line bg-white p-5">
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-800">{lesson.content}</pre>
                </div>
              </Card>
            ) : null
          ))}

          {activeLessonId === "module-glossary" && (
            <Card>
              <Pill>Glossary</Pill>
              <h3 className="mt-4 text-2xl font-bold">{activeModule?.moduleTitle} glossary</h3>
              <div className="mt-5 divide-y divide-line rounded-lg border border-line bg-white">
                {moduleGlossary.map((term) => (
                  <div key={term.id} className="grid gap-2 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                    <p className="break-words font-bold text-ink">{term.title}</p>
                    <p className="text-sm leading-6 text-slate-700">{term.fullDefinition}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeLessonId === "module-quiz" && (
            <Card>
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <ListChecks size={20} className="text-ocean" aria-hidden="true" />
                    <h2 className="text-2xl font-bold">Multiple choice questions</h2>
                  </div>
                  <p className="mt-3 leading-7 text-slate-600">
                    Read the definition, then choose the correct business term. The other options are pulled from the glossary.
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm font-medium">
                      <span>{activeModule?.moduleTitle}</span>
                      <span>{(quizIndex % Math.max(1, moduleGlossary.length)) + 1}/{moduleGlossary.length || 1}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
