"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, ChevronRight, FileText, ListChecks, XCircle } from "lucide-react";
import { ictTheoryModules } from "@/lib/ict-theory-data";
import type { IctTheoryLesson } from "@/lib/ict-theory-data";
import { Card, Pill, ProgressBar } from "@/components/ui";

type ContentTarget = string | "module-glossary" | "module-quiz";

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function LessonTable({ table }: { table: NonNullable<IctTheoryLesson["compare"]> }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-ink text-white">
            <tr>
              {table.headers.map((header) => (
                <th key={header} className="px-4 py-3 font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {table.rows.map((row, rowIndex) => (
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

type VisualCard = {
  title: string;
  imageUrl: string;
  alt: string;
};

function svgVisual(title: string, detail: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#eef6f8"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="640" height="420" fill="url(#bg)"/>
      <rect x="42" y="48" width="556" height="324" rx="28" fill="#ffffff" stroke="#cfe0e8" stroke-width="4"/>
      <circle cx="170" cy="210" r="72" fill="#0f7490" opacity="0.14"/>
      <circle cx="320" cy="210" r="72" fill="#d99b1d" opacity="0.14"/>
      <circle cx="470" cy="210" r="72" fill="#16313f" opacity="0.12"/>
      <path d="M228 210h64M348 210h64" stroke="#0f7490" stroke-width="12" stroke-linecap="round"/>
      <text x="320" y="98" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111820">${title}</text>
      <text x="320" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#3a4758">${detail}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function lessonVisuals(lesson: IctTheoryLesson): VisualCard[] {
  if (lesson.id === "ict-3-optical-cloud") {
    return [
      {
        title: "Concept overview",
        alt: "Diagram comparing physical optical storage with online cloud storage",
        imageUrl: svgVisual("Optical vs Cloud", "physical media and remote storage")
      },
      {
        title: "Disc types",
        alt: "Chart-style image comparing CD DVD and Blu-ray optical disc types",
        imageUrl: svgVisual("CD / DVD / Blu-ray", "capacity increases by disc type")
      },
      {
        title: "Actual Optical Disc",
        alt: "Close view of an optical disc surface",
        imageUrl: "https://images.unsplash.com/photo-1616688918152-cd3a45a23e68?q=80&w=900"
      },
      {
        title: "Cloud storage",
        alt: "Server racks used for cloud storage infrastructure",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900"
      }
    ];
  }

  return [
    {
      title: "Concept overview",
      alt: `Illustrated overview for ${lesson.title}`,
      imageUrl: svgVisual(lesson.title, "main idea and vocabulary")
    },
    {
      title: "Key comparison",
      alt: `Comparison chart for ${lesson.title}`,
      imageUrl: svgVisual(
        lesson.compare ? lesson.compare.headers.join(" vs ") : "Compare",
        "features, uses, benefits, limits"
      )
    },
    {
      title: "Real-World View",
      alt: lesson.image ? lesson.image.alt : `Real-world visual example for ${lesson.title}`,
      imageUrl: lesson.image?.url || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900"
    },
    {
      title: "Use case",
      alt: `Practical use case visual for ${lesson.title}`,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900"
    }
  ];
}

function VisualTile({ visual, index }: { visual: VisualCard; index: number }) {
  return (
    <figure className="group relative min-h-36 overflow-hidden rounded-lg border border-line bg-white">
      <img src={visual.imageUrl} alt={visual.alt} className="h-full min-h-36 w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-ink/80 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
        Visual {index + 1}: {visual.title}
      </figcaption>
    </figure>
  );
}

function LessonVisualPanel({ lesson }: { lesson: IctTheoryLesson }) {
  const visuals = lessonVisuals(lesson).slice(0, 4);

  return (
    <aside className="grid min-h-[520px] rounded-lg border border-dashed border-line bg-slate-50 p-3">
      <div className="grid grid-rows-4 gap-3 sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-1 xl:grid-rows-4">
      {visuals.map((visual, index) => (
        <VisualTile key={`${lesson.id}-${visual.title}`} visual={visual} index={index} />
      ))}
      </div>
    </aside>
  );
}

function IctLessonRenderer({ lesson }: { lesson: IctTheoryLesson }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <p className="text-base leading-7 text-slate-700">{lesson.summary}</p>
        <ul className="mt-5 space-y-3">
          {lesson.keyPoints.map((point) => (
            <li key={point} className="flex gap-3 leading-7 text-slate-800">
              <span className="mt-3 h-2 w-2 flex-none bg-gold" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {lesson.studyBlocks && (
          <div className="mt-6 grid gap-4">
            {lesson.studyBlocks.map((block) => (
              <section key={block.heading} className="rounded-lg border border-line bg-slate-50 p-4">
                <h4 className="font-bold text-ink">{block.heading}</h4>
                <ul className="mt-3 space-y-2">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <span className="mt-2.5 h-1.5 w-1.5 flex-none bg-ocean" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        {lesson.compare && <LessonTable table={lesson.compare} />}
      </div>

      <LessonVisualPanel lesson={lesson} />
    </div>
  );
}

export function IctTheoryHub() {
  const [activeModuleId, setActiveModuleId] = useState(ictTheoryModules[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState<ContentTarget>(ictTheoryModules[0]?.lessons[0]?.id || "");
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const activeModule = ictTheoryModules.find((module) => module.id === activeModuleId) || ictTheoryModules[0];
  const activeLesson = activeModule?.lessons.find((lesson) => lesson.id === activeLessonId);
  const orderedIndex = quizOrder.length ? quizOrder[quizIndex % quizOrder.length] : 0;
  const quiz = activeModule?.quiz[orderedIndex] || activeModule?.quiz[0];
  const quizProgress = activeModule?.quiz.length ? ((quizIndex % activeModule.quiz.length) / activeModule.quiz.length) * 100 : 0;
  const isCorrect = selectedAnswer === quiz?.correctIndex;
  const shuffledOptions = useMemo(() => {
    if (!quiz) return [];
    return quiz.options.map((option, index) => ({ option, index }));
  }, [quiz]);

  useEffect(() => {
    setQuizOrder(shuffle((activeModule?.quiz || []).map((_, index) => index)));
    setQuizIndex(0);
    setSelectedAnswer(null);
  }, [activeModule?.id, activeModule?.quiz]);

  function chooseModule(moduleId: string) {
    const nextModule = ictTheoryModules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(nextModule?.lessons[0]?.id || "");
    setSelectedAnswer(null);
  }

  function chooseContent(moduleId: string, target: ContentTarget) {
    if (moduleId !== activeModuleId) setActiveModuleId(moduleId);
    setActiveLessonId(target);
    setSelectedAnswer(null);
  }

  function nextQuestion() {
    setQuizIndex((index) => index + 1);
    setSelectedAnswer(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={22} className="text-ocean" aria-hidden="true" />
          <h2 className="text-2xl font-bold">ICT theory modules</h2>
        </div>
        {ictTheoryModules.map((module) => {
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
          <p className="mt-3 leading-7 text-slate-600">{activeModule?.overview}</p>
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
              <IctLessonRenderer lesson={activeLesson} />
            </div>
          </Card>
        )}

        {activeLessonId === "module-glossary" && (
          <Card>
            <Pill>Glossary</Pill>
            <h3 className="mt-4 text-2xl font-bold">{activeModule?.moduleTitle} glossary</h3>
            <div className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
              {activeModule?.glossary.map((term) => (
                <div key={term.term} className="grid gap-2 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                  <p className="break-words font-bold text-ink">{term.term}</p>
                  <p className="text-sm leading-6 text-slate-700">{term.definition}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeLessonId === "module-quiz" && quiz && (
          <Card>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks size={20} className="text-ocean" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Multiple choice questions</h2>
                </div>
                <p className="mt-3 leading-7 text-slate-600">Read the scenario, then choose the best ICT theory answer for this module.</p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>{activeModule?.moduleTitle}</span>
                    <span>{(quizIndex % Math.max(1, activeModule?.quiz.length || 1)) + 1}/{activeModule?.quiz.length || 1}</span>
                  </div>
                  <ProgressBar value={quizProgress} />
                </div>
              </div>

              <div className="rounded-lg border border-line bg-mist p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">{quiz.topic}</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-ink">{quiz.question}</p>
                <div className="mt-5 grid gap-3">
                  {shuffledOptions.map(({ option, index }) => {
                    const chosen = selectedAnswer === index;
                    const correct = quiz.correctIndex === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedAnswer(index)}
                        className={`flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-left font-bold transition ${
                          chosen ? (correct ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700") : "border-line text-ink hover:border-ocean"
                        }`}
                      >
                        <span>{option}</span>
                        {chosen && (correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />)}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <div className={`mt-4 rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className="font-bold">{isCorrect ? "Correct" : `Correct answer: ${quiz.options[quiz.correctIndex]}`}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{quiz.feedback}</p>
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
