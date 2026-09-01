import Link from "next/link";
import { ArrowRight, GitBranch, ListTree, Route, Workflow } from "lucide-react";
import { Pill, Section } from "@/components/ui";
import { flowchartModules } from "@/lib/flowchart-instruction-cards";

const moduleIcons = [Workflow, GitBranch, Route, ListTree];

export default function FlowchartsPage() {
  return (
    <Section className="max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Pill>ICT Algorithms</Pill>
          <h1 className="mt-4 text-4xl font-bold">Flowchart and algorithm modules</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Practise sequence, selection, loops, nested decisions, and complete algorithm logic using a visual flowchart workspace.
          </p>
        </div>
        <Link href="/subjects/ict" className="inline-flex items-center gap-2 font-semibold text-ocean">
          Back to ICT <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {flowchartModules.map((module, index) => {
          const Icon = moduleIcons[index % moduleIcons.length];
          return (
            <Link key={module.id} href={`/subjects/ict/flowcharts/${module.id}`} className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-mist text-ocean">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Task {index + 1}</span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-ink">{module.title}</h2>
              <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{module.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">{module.allowedBlocks.length} block types</span>
                <span className="inline-flex items-center gap-2 font-semibold text-ocean">
                  Open <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
