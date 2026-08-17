"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Cpu, HardDrive, MemoryStick, XCircle } from "lucide-react";
import { Card, Pill } from "./ui";

type DeviceQuestion = {
  id: string;
  title: string;
  prompt: string;
  answer: string;
  options: string[];
  use: string;
  Icon: typeof HardDrive;
};

const questions: DeviceQuestion[] = [
  {
    id: "ssd",
    title: "Solid-state drive",
    prompt: "What does this internal storage device represent?",
    answer: "SSD",
    options: ["SSD", "RAM", "Router"],
    use: "It stores files and applications without moving parts, usually with fast read and write speeds.",
    Icon: HardDrive
  },
  {
    id: "cpu",
    title: "Processor",
    prompt: "Which component processes instructions to produce output?",
    answer: "CPU",
    options: ["CPU", "Monitor", "Optical disc"],
    use: "It carries out instructions and coordinates processing inside the computer system.",
    Icon: Cpu
  },
  {
    id: "ram",
    title: "Internal memory",
    prompt: "Which component temporarily stores data and programs currently in use?",
    answer: "RAM",
    options: ["RAM", "Keyboard", "Blu-ray"],
    use: "It is volatile working memory used while programs are running.",
    Icon: MemoryStick
  }
];

export function IctImageTrainer() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[index];
  const Icon = question.Icon;
  const correct = selected === question.answer;

  const progress = useMemo(() => `${index + 1}/${questions.length}`, [index]);

  function choose(option: string) {
    setSelected(option);
    if (option === question.answer) setScore((value) => value + 1);
  }

  function next() {
    setSelected(null);
    setIndex((value) => (value + 1) % questions.length);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill>Image identification</Pill>
          <h2 className="mt-3 text-2xl font-bold">ICT component trainer</h2>
        </div>
        <span className="text-sm font-semibold text-slate-600">Question {progress}</span>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1fr]">
        <div className="grid min-h-52 place-items-center rounded-lg border border-line bg-slate-50 p-6">
          <div className="grid h-32 w-48 place-items-center rounded-lg border-2 border-slate-300 bg-white shadow-sm">
            <Icon size={70} className="text-ink" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ocean">{question.title}</p>
          <p className="mt-2 text-lg font-semibold">{question.prompt}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => choose(option)}
                disabled={selected !== null}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold hover:border-ocean disabled:cursor-not-allowed disabled:opacity-75"
              >
                {option}
              </button>
            ))}
          </div>
          {selected && (
            <div className={`mt-4 rounded-lg border p-4 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`} role="status">
              <p className={`flex items-center gap-2 font-semibold ${correct ? "text-leaf" : "text-coral"}`}>
                {correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {correct ? "Correct identification" : `Not quite. This is ${question.answer}.`}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{question.use}</p>
              <button onClick={next} className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white">
                Next image
              </button>
            </div>
          )}
          <p className="mt-4 text-sm text-slate-600">Score this round: {score}</p>
        </div>
      </div>
    </Card>
  );
}
