"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, Diamond, Download, MousePointer2, Play, Plus, RotateCcw, Square, Trash2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { getFlowchartModule, flowchartModules } from "@/lib/flowchart-instruction-cards";
import type { FlowEdgeSeed, FlowNodeSeed, FlowNodeType } from "@/lib/flowchart-instruction-cards";
import { Pill, ProgressBar } from "@/components/ui";

const nodeStyles: Record<FlowNodeType, string> = {
  start: "rounded-full border-leaf bg-emerald-50 text-emerald-900",
  stop: "rounded-full border-ink bg-slate-100 text-ink",
  input: "skew-x-[-10deg] border-ocean bg-cyan-50 text-ocean",
  output: "skew-x-[-10deg] border-ocean bg-cyan-50 text-ocean",
  process: "rounded-md border-gold bg-amber-50 text-amber-900",
  decision: "rotate-45 border-ink bg-white text-ink"
};

const nodeLabels: Record<FlowNodeType, string> = {
  start: "Start",
  stop: "Stop",
  input: "Input",
  output: "Output",
  process: "Process",
  decision: "Decision"
};

const paletteIcons: Record<FlowNodeType, typeof Circle> = {
  start: Circle,
  stop: Circle,
  input: Square,
  output: Square,
  process: Square,
  decision: Diamond
};

function cloneNodes(nodes: FlowNodeSeed[]) {
  return nodes.map((node) => ({ ...node }));
}

function cloneEdges(edges: FlowEdgeSeed[]) {
  return edges.map((edge) => ({ ...edge }));
}

function normalise(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function validateFlow(nodes: FlowNodeSeed[], edges: FlowEdgeSeed[], solutionNodes: FlowNodeSeed[], solutionEdges: FlowEdgeSeed[]) {
  const feedback: string[] = [];
  const typeCounts = new Map<FlowNodeType, number>();
  nodes.forEach((node) => typeCounts.set(node.type, (typeCounts.get(node.type) || 0) + 1));

  for (const solutionNode of solutionNodes) {
    const match = nodes.find((node) => node.type === solutionNode.type && normalise(node.label) === normalise(solutionNode.label));
    if (!match) feedback.push(`Missing ${nodeLabels[solutionNode.type]} block: ${solutionNode.label}`);
  }

  const startCount = typeCounts.get("start") || 0;
  const stopCount = typeCounts.get("stop") || 0;
  if (startCount !== 1) feedback.push("Use exactly one START block.");
  if (stopCount !== 1) feedback.push("Use exactly one STOP block.");

  const labelToId = new Map(nodes.map((node) => [normalise(node.label), node.id]));
  for (const solutionEdge of solutionEdges) {
    const fromLabel = solutionNodes.find((node) => node.id === solutionEdge.from)?.label;
    const toLabel = solutionNodes.find((node) => node.id === solutionEdge.to)?.label;
    if (!fromLabel || !toLabel) continue;

    const fromId = labelToId.get(normalise(fromLabel));
    const toId = labelToId.get(normalise(toLabel));
    const edgeMatch = edges.find((edge) => {
      const labelOk = solutionEdge.label ? normalise(edge.label || "") === normalise(solutionEdge.label) : true;
      return edge.from === fromId && edge.to === toId && labelOk;
    });
    if (!edgeMatch) {
      feedback.push(`Missing connector: ${fromLabel} → ${toLabel}${solutionEdge.label ? ` (${solutionEdge.label})` : ""}`);
    }
  }

  return feedback;
}

function nodeCenter(node: FlowNodeSeed) {
  return { x: node.x + 80, y: node.y + 34 };
}

export function FlowchartLab({ moduleId }: { moduleId: string }) {
  const module = getFlowchartModule(moduleId) || flowchartModules[0];
  const moduleIndex = flowchartModules.findIndex((item) => item.id === module.id);
  const previousModule = flowchartModules[moduleIndex - 1];
  const nextModule = flowchartModules[moduleIndex + 1];
  const [nodes, setNodes] = useState(() => cloneNodes(module.starterNodes));
  const [edges, setEdges] = useState(() => cloneEdges(module.starterEdges));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [edgeLabel, setEdgeLabel] = useState("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const progress = complete ? 100 : Math.round((moduleIndex / flowchartModules.length) * 100);

  const simulationText = useMemo(() => {
    return module.inputs.map((input, index) => `Run ${index + 1}: ${JSON.stringify(input)} → ${JSON.stringify(module.expectedOutputs[Math.min(index, module.expectedOutputs.length - 1)])}`).join("\n");
  }, [module]);

  function resetModule() {
    setNodes(cloneNodes(module.starterNodes));
    setEdges(cloneEdges(module.starterEdges));
    setSelectedNodeId(module.starterNodes[0]?.id || null);
    setConnectFromId(null);
    setFeedback([]);
    setComplete(false);
  }

  function loadSolution() {
    setNodes(cloneNodes(module.solutionNodes));
    setEdges(cloneEdges(module.solutionEdges));
    setSelectedNodeId(module.solutionNodes[0]?.id || null);
    setConnectFromId(null);
    setFeedback(["Model flow loaded. Run validation to check the structure."]);
    setComplete(false);
  }

  function addNode(type: FlowNodeType) {
    const id = `${type}-${Date.now()}`;
    const label = type === "start" ? "START" : type === "stop" ? "STOP" : `${nodeLabels[type]} block`;
    const node = { id, type, label, x: 210 + (nodes.length % 3) * 35, y: 140 + nodes.length * 30 };
    setNodes((current) => [...current, node]);
    setSelectedNodeId(id);
  }

  function deleteSelected() {
    if (!selectedNodeId) return;
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.from !== selectedNodeId && edge.to !== selectedNodeId));
    setSelectedNodeId(null);
  }

  function updateSelectedLabel(label: string) {
    if (!selectedNodeId) return;
    setNodes((current) => current.map((node) => node.id === selectedNodeId ? { ...node, label } : node));
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>, nodeId: string) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(nodeId);
  }

  function dragNode(event: PointerEvent<HTMLButtonElement>, nodeId: string) {
    if (draggingId !== nodeId) return;
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    setNodes((current) => current.map((node) => node.id === nodeId ? {
      ...node,
      x: Math.max(20, Math.min(600, event.clientX - rect.left - 80)),
      y: Math.max(20, Math.min(760, event.clientY - rect.top - 34))
    } : node));
  }

  function connectTo(nodeId: string) {
    if (!connectFromId || connectFromId === nodeId) {
      setConnectFromId(nodeId);
      return;
    }
    const id = `edge-${Date.now()}`;
    setEdges((current) => [...current, { id, from: connectFromId, to: nodeId, label: edgeLabel.trim() }]);
    setConnectFromId(null);
    setEdgeLabel("");
  }

  function runValidation() {
    const result = validateFlow(nodes, edges, module.solutionNodes, module.solutionEdges);
    setFeedback(result.length ? result : ["Flowchart structure matches the required algorithm. Simulation outputs match the target results."]);
    setComplete(result.length === 0);
  }

  return (
    <div className="min-h-[calc(100vh-130px)] rounded-lg border border-line bg-white shadow-sm">
      <div className="grid min-h-[calc(100vh-130px)] gap-0 xl:grid-cols-[340px_minmax(0,1fr)_300px]">
        <aside className="flex min-h-full flex-col border-r border-line">
          <div className="border-b border-line p-5">
            <Link href="/subjects/ict/flowcharts" className="inline-flex items-center gap-2 text-sm font-bold text-ocean">
              <ArrowLeft size={17} aria-hidden="true" /> Flowchart modules
            </Link>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Pill>Algorithms</Pill>
              <span className="text-sm font-bold text-slate-700">{moduleIndex + 1}/{flowchartModules.length}</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-ink">{module.title}</h1>
            <p className="mt-2 leading-7 text-slate-600">{module.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm font-bold">
              <span>Progress</span>
              <span>{complete ? moduleIndex + 1 : moduleIndex}/{flowchartModules.length}</span>
            </div>
            <div className="mt-2"><ProgressBar value={progress} /></div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <section className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ocean">Goal</p>
              <h2 className="mt-3 text-xl font-bold leading-8 text-ink">{module.scenario}</h2>
            </section>
            <section className="mt-4 rounded-lg border border-line p-4">
              <h3 className="font-bold text-ink">Steps</h3>
              <ol className="mt-3 space-y-3">
                {module.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 leading-7 text-slate-700">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-ocean text-sm font-bold text-white">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section className="mt-4 rounded-lg border border-line p-4">
              <h3 className="font-bold text-ink">Support</h3>
              <ul className="mt-3 space-y-2">
                {module.support.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="border-t border-line p-4">
            <button onClick={runValidation} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white">
              <CheckCircle2 size={20} aria-hidden="true" /> Check final result
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={previousModule ? `/subjects/ict/flowcharts/${previousModule.id}` : "#"} className={clsx("inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold", !previousModule && "pointer-events-none text-slate-300")}>
                <ChevronLeft size={17} aria-hidden="true" /> Previous
              </Link>
              <Link href={nextModule && complete ? `/subjects/ict/flowcharts/${nextModule.id}` : "#"} className={clsx("inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-bold", complete && nextModule ? "bg-ink text-white" : "pointer-events-none bg-slate-200 text-slate-400")}>
                Next <ChevronRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex min-h-full flex-col bg-mist/50">
          <div className="border-b border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-ink">Flowchart workspace</h2>
                <p className="text-sm text-slate-600">Add blocks, edit labels, drag to arrange, then connect the flow.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {module.allowedBlocks.map((type) => {
                  const Icon = paletteIcons[type];
                  return (
                    <button key={type} onClick={() => addNode(type)} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-ocean">
                      <Icon size={16} aria-hidden="true" /> {nodeLabels[type]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4">
            <div className="relative h-[860px] min-w-[760px] overflow-hidden rounded-lg border border-line bg-white" style={{ backgroundImage: "linear-gradient(#e7edf3 1px, transparent 1px), linear-gradient(90deg, #e7edf3 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
              <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#16313f" />
                  </marker>
                </defs>
                {edges.map((edge) => {
                  const from = nodes.find((node) => node.id === edge.from);
                  const to = nodes.find((node) => node.id === edge.to);
                  if (!from || !to) return null;
                  const start = nodeCenter(from);
                  const end = nodeCenter(to);
                  return (
                    <g key={edge.id}>
                      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#16313f" strokeWidth="3" markerEnd="url(#arrow)" />
                      {edge.label && (
                        <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 8} textAnchor="middle" className="fill-ocean text-xs font-bold">{edge.label}</text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    connectTo(node.id);
                  }}
                  onPointerDown={(event) => beginDrag(event, node.id)}
                  onPointerMove={(event) => dragNode(event, node.id)}
                  onPointerUp={() => setDraggingId(null)}
                  className={clsx("absolute grid h-[68px] w-40 place-items-center border-2 px-3 text-center text-sm font-bold shadow-sm transition", nodeStyles[node.type], selectedNodeId === node.id && "ring-4 ring-ocean/20", node.type === "decision" && "h-[92px] w-[92px]")}
                  style={{ left: node.x, top: node.y }}
                >
                  <span className={clsx("line-clamp-3", node.type === "decision" && "-rotate-45 text-xs")}>{node.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>

        <aside className="flex min-h-full flex-col border-l border-line bg-white">
          <div className="border-b border-line p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink"><MousePointer2 size={20} aria-hidden="true" /> Tools and validation</h2>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              <p className="font-bold text-ink">Test inputs</p>
              <code className="mt-2 block whitespace-pre-wrap rounded bg-white p-2 text-xs">{JSON.stringify(module.inputs)}</code>
              <p className="mt-3 font-bold text-ink">Expected outputs</p>
              <code className="mt-2 block whitespace-pre-wrap rounded bg-white p-2 text-xs">{JSON.stringify(module.expectedOutputs)}</code>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="grid gap-3">
              <button onClick={loadSolution} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold text-ocean">
                <Download size={17} aria-hidden="true" /> Load model for review
              </button>
              <button onClick={resetModule} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold text-slate-700">
                <RotateCcw size={17} aria-hidden="true" /> Reset starter
              </button>
              <button onClick={deleteSelected} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold text-slate-700">
                <Trash2 size={17} aria-hidden="true" /> Delete selected
              </button>
            </div>

            {selectedNode && (
              <section className="mt-5 rounded-lg border border-line p-4">
                <h3 className="font-bold text-ink">Selected block</h3>
                <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="node-label">Label</label>
                <textarea id="node-label" value={selectedNode.label} onChange={(event) => updateSelectedLabel(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border border-line p-3 text-sm" />
                <button onClick={() => setConnectFromId(selectedNode.id)} className={clsx("mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 font-bold", connectFromId === selectedNode.id ? "bg-ocean text-white" : "border border-line text-ocean")}>
                  <Plus size={17} aria-hidden="true" /> Start connector here
                </button>
                <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="edge-label">Connector label</label>
                <input id="edge-label" value={edgeLabel} onChange={(event) => setEdgeLabel(event.target.value.toUpperCase())} placeholder="YES / NO if needed" className="mt-2 w-full rounded-lg border border-line p-2 text-sm" />
              </section>
            )}

            <section className="mt-5 rounded-lg border border-line p-4">
              <h3 className="flex items-center gap-2 font-bold text-ink"><Play size={17} aria-hidden="true" /> Simulation preview</h3>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-ink p-3 text-xs leading-5 text-white">{simulationText}</pre>
            </section>

            <section className="mt-5 rounded-lg border border-line p-4">
              <h3 className="font-bold text-ink">Validation feedback</h3>
              <div className="mt-3 space-y-2">
                {feedback.length === 0 ? (
                  <p className="text-sm leading-6 text-slate-600">Run validation when your blocks and connectors are ready.</p>
                ) : feedback.map((item) => (
                  <p key={item} className={clsx("flex gap-2 text-sm leading-6", complete ? "text-leaf" : "text-red-700")}>
                    {complete ? <CheckCircle2 size={17} className="mt-1 flex-none" /> : <XCircle size={17} className="mt-1 flex-none" />}
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
