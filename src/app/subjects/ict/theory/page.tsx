import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IctImageTrainer } from "@/components/ict-image-trainer";
import { Card, Pill, Section } from "@/components/ui";
import { ictSyllabusStrands } from "@/lib/subject-data";

const theorySets = [
  {
    title: "Computer systems",
    task: "Identify a component, choose its function, then explain where it is used.",
    examples: ["CPU", "RAM", "ROM", "SSD", "input device", "output device"]
  },
  {
    title: "Storage and media",
    task: "Compare storage types by use, capacity, portability, speed, and reliability.",
    examples: ["magnetic", "optical", "solid-state", "cloud storage"]
  },
  {
    title: "Networks and security",
    task: "Read a scenario, identify the risk, and choose a suitable protection method.",
    examples: ["LAN", "WAN", "passwords", "malware", "encryption"]
  },
  {
    title: "ICT applications",
    task: "Match systems to their purpose, inputs, processing, outputs, benefits, and drawbacks.",
    examples: ["booking systems", "expert systems", "recognition systems", "retail systems"]
  }
];

export default function IctTheoryPage() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Pill>ICT Theory</Pill>
          <h1 className="mt-4 text-4xl font-bold">Recognise, explain, apply</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Theory practice starts with identification and meaning, then moves into use, advantage, disadvantage, and scenario application.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {theorySets.map((set) => (
          <Card key={set.title}>
            <h2 className="text-xl font-semibold">{set.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{set.task}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {set.examples.map((example) => <Pill key={example}>{example}</Pill>)}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <IctImageTrainer />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Coverage map</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {ictSyllabusStrands.slice(0, 3).map((strand) => (
            <Card key={strand.title}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{strand.title}</h3>
                <Pill>Sections {strand.sections}</Pill>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{strand.skills.join(", ")}.</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
