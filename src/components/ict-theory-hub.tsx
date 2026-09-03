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

type VisualSearch = {
  title: string;
  query: string;
};

const visualFileNames = ["01-concept.jpg", "02-detail.jpg", "03-real-world.jpg", "04-context.jpg"];

const visualSearchesByLesson: Record<string, VisualSearch[]> = {
  "ict-1-hardware-software": [
    { title: "Hardware", query: "computer hardware motherboard components" },
    { title: "Software", query: "software code on computer screen" },
    { title: "System unit", query: "desktop computer internal components" },
    { title: "User workspace", query: "computer workstation software" }
  ],
  "ict-1-cpu-memory": [
    { title: "Processor", query: "computer processor chip close up" },
    { title: "Memory", query: "computer ram memory modules" },
    { title: "Storage device", query: "solid state drive computer storage" },
    { title: "Performance", query: "computer performance analytics screen" }
  ],
  "ict-1-interfaces": [
    { title: "Operating system", query: "computer operating system desktop interface" },
    { title: "GUI", query: "graphical user interface dashboard" },
    { title: "CLI", query: "command line terminal code" },
    { title: "User control", query: "person using laptop interface" }
  ],
  "ict-2-manual-input": [
    { title: "Keyboard", query: "computer keyboard typing" },
    { title: "Mouse", query: "computer mouse on desk" },
    { title: "Touch screen", query: "person using touchscreen tablet" },
    { title: "Manual entry", query: "data entry keyboard office" }
  ],
  "ict-2-direct-entry": [
    { title: "Barcode", query: "barcode scanner retail" },
    { title: "QR code", query: "qr code scanning phone" },
    { title: "Card reader", query: "payment card reader terminal" },
    { title: "Sensor input", query: "industrial sensor technology" }
  ],
  "ict-2-output": [
    { title: "Monitor", query: "computer monitor display" },
    { title: "Printer", query: "office printer paper" },
    { title: "Speaker", query: "computer speaker audio" },
    { title: "Projector", query: "digital projector presentation room" }
  ],
  "ict-3-magnetic": [
    { title: "Hard disk", query: "hard disk drive platter" },
    { title: "External drive", query: "external hard drive storage" },
    { title: "Data archive", query: "data backup storage drives" },
    { title: "Storage bay", query: "server storage hard drives" }
  ],
  "ict-3-solid-state": [
    { title: "SSD", query: "solid state drive ssd" },
    { title: "Flash memory", query: "usb flash drive storage" },
    { title: "Memory card", query: "sd memory card camera" },
    { title: "Portable storage", query: "portable ssd laptop" }
  ],
  "ict-3-optical-cloud": [
    { title: "Optical discs", query: "cd dvd blu ray discs" },
    { title: "Disc drive", query: "optical disc drive computer" },
    { title: "Cloud files", query: "cloud storage laptop files" },
    { title: "Data centre", query: "cloud server data center" }
  ],
  "ict-4-network-types": [
    { title: "Local network", query: "office local area network computers" },
    { title: "Wide network", query: "global network communication map" },
    { title: "Connected devices", query: "devices connected to network" },
    { title: "Collaboration", query: "team video conference computers" }
  ],
  "ict-4-hardware": [
    { title: "Router", query: "wireless router close up" },
    { title: "Switch", query: "network switch ethernet cables" },
    { title: "Network cables", query: "ethernet cables network rack" },
    { title: "Adapter", query: "network adapter computer hardware" }
  ],
  "ict-4-wired-wireless": [
    { title: "Ethernet", query: "ethernet cable laptop connection" },
    { title: "Wi-Fi", query: "wifi router home network" },
    { title: "Mobile network", query: "mobile phone network signal" },
    { title: "Fibre", query: "fiber optic cable network" }
  ],
  "ict-5-employment": [
    { title: "Automation", query: "factory automation robots" },
    { title: "Office systems", query: "automated office workflow computers" },
    { title: "Digital jobs", query: "technology workers office laptops" },
    { title: "Skills change", query: "online learning technology skills" }
  ],
  "ict-5-teleworking": [
    { title: "Home office", query: "remote work home office laptop" },
    { title: "Video meeting", query: "video conference laptop screen" },
    { title: "Cloud teamwork", query: "online collaboration team laptop" },
    { title: "Mobile work", query: "person working laptop cafe" }
  ],
  "ict-5-health": [
    { title: "Ergonomics", query: "ergonomic computer workstation posture" },
    { title: "Eye strain", query: "computer screen glasses workspace" },
    { title: "Accessible tech", query: "assistive technology computer accessibility" },
    { title: "Digital wellbeing", query: "healthy computer workstation" }
  ],
  "ict-6-expert-systems": [
    { title: "Decision support", query: "medical diagnosis technology screen" },
    { title: "Knowledge base", query: "artificial intelligence data visualization" },
    { title: "Rules engine", query: "business analytics dashboard decision" },
    { title: "Specialist advice", query: "doctor using medical computer" }
  ],
  "ict-6-transaction-systems": [
    { title: "Booking", query: "online booking system laptop" },
    { title: "Payment", query: "card payment terminal transaction" },
    { title: "Stock update", query: "warehouse inventory barcode scanner" },
    { title: "Ticketing", query: "digital ticket scanning" }
  ],
  "ict-6-control-systems": [
    { title: "Sensors", query: "industrial sensors automation" },
    { title: "Control room", query: "control room monitoring screens" },
    { title: "Actuator", query: "robotic arm automation factory" },
    { title: "Feedback loop", query: "smart thermostat control system" }
  ],
  "ict-7-analysis": [
    { title: "Interview", query: "business interview notes laptop" },
    { title: "Questionnaire", query: "survey form clipboard" },
    { title: "Observation", query: "office workflow observation computer" },
    { title: "Requirements", query: "requirements analysis sticky notes" }
  ],
  "ict-7-design-testing": [
    { title: "Prototype", query: "wireframe user interface design" },
    { title: "Test plan", query: "software testing checklist laptop" },
    { title: "Documentation", query: "technical documentation laptop" },
    { title: "User feedback", query: "user testing feedback session" }
  ],
  "ict-7-implementation": [
    { title: "Direct changeover", query: "software deployment computer" },
    { title: "Parallel running", query: "two computer systems comparison" },
    { title: "Training", query: "computer training classroom" },
    { title: "Evaluation", query: "project evaluation dashboard" }
  ],
  "ict-8-threats": [
    { title: "Malware", query: "cyber security malware warning screen" },
    { title: "Phishing", query: "phishing email laptop security" },
    { title: "Data loss", query: "data breach cybersecurity" },
    { title: "Unauthorised access", query: "hacker cybersecurity screen" }
  ],
  "ict-8-protection": [
    { title: "Password", query: "password security login screen" },
    { title: "Firewall", query: "network security firewall" },
    { title: "Backup", query: "data backup external drive" },
    { title: "Authentication", query: "two factor authentication phone" }
  ],
  "ict-8-encryption": [
    { title: "Encrypted data", query: "encrypted data cybersecurity" },
    { title: "Padlock", query: "secure website padlock browser" },
    { title: "Keys", query: "encryption keys cybersecurity" },
    { title: "Secure transfer", query: "secure data transfer network" }
  ],
  "ict-9-audience": [
    { title: "Audience", query: "students using computers classroom" },
    { title: "Purpose", query: "website planning notes laptop" },
    { title: "Design choice", query: "web design layout screen" },
    { title: "Presentation", query: "digital presentation audience" }
  ],
  "ict-9-netiquette": [
    { title: "Email", query: "professional email laptop" },
    { title: "Online respect", query: "online communication video call" },
    { title: "Social media", query: "social media phone communication" },
    { title: "Digital footprint", query: "digital identity security laptop" }
  ]
};

function localVisualPath(lessonId: string, index: number) {
  return `/assets/ict-theory/${lessonId}/${visualFileNames[index - 1]}`;
}

function lessonVisuals(lesson: IctTheoryLesson): VisualCard[] {
  const searches = visualSearchesByLesson[lesson.id] || [
    { title: "Concept", query: `${lesson.title} information technology` },
    { title: "Equipment", query: `${lesson.title} computer equipment` },
    { title: "Real use", query: `${lesson.title} technology workplace` },
    { title: "Context", query: `${lesson.title} digital learning` }
  ];

  return searches.slice(0, 4).map((visual, index) => ({
    title: visual.title,
    alt: `${visual.title} visual for ${lesson.title}`,
    imageUrl: localVisualPath(lesson.id, index + 1)
  }));
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
    <aside className="grid min-h-[500px] rounded-lg border border-dashed border-line bg-slate-50 p-2">
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
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
