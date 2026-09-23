"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, Diamond, ListChecks, MousePointer2, Play, Plus, Printer, Redo2, RotateCcw, Square, Trash2, Undo2, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { getFlowchartModule, flowchartModules } from "@/lib/flowchart-instruction-cards";
import type { FlowchartModule, FlowEdgeSeed, FlowNodeSeed, FlowNodeType } from "@/lib/flowchart-instruction-cards";
import { parseFlowchartInputs, runFlowchart, valuesMatch } from "@/lib/flowchart-interpreter";
import type { FlowValue } from "@/lib/flowchart-interpreter";
import { useFeedbackAutoScroll } from "@/lib/use-feedback-auto-scroll";
import { PracticeTimer } from "@/components/practice-timer";
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

function validateFreePracticeFlow(nodes: FlowNodeSeed[], edges: FlowEdgeSeed[]) {
  const feedback: string[] = [];
  const startCount = nodes.filter((node) => node.type === "start").length;
  const stopCount = nodes.filter((node) => node.type === "stop").length;
  const connectedIds = new Set(edges.flatMap((edge) => [edge.from, edge.to]));
  const labelledNodes = nodes.filter((node) => normalise(node.label) && !normalise(node.label).endsWith("block"));

  if (startCount !== 1) feedback.push("Use exactly one START block.");
  if (stopCount !== 1) feedback.push("Use exactly one STOP block.");
  if (nodes.length < 4) feedback.push("Add at least two useful algorithm blocks between START and STOP.");
  if (edges.length < Math.max(1, nodes.length - 1)) feedback.push("Connect the blocks so the flow can be followed from start to finish.");
  if (labelledNodes.length < nodes.length) feedback.push("Give each block a meaningful label for your chosen problem.");
  if (nodes.some((node) => !connectedIds.has(node.id))) feedback.push("Avoid isolated blocks; every block should be part of the flow.");

  return feedback;
}

type FlowSnapshot = {
  nodes: FlowNodeSeed[];
  edges: FlowEdgeSeed[];
};

function nodeSize(node: FlowNodeSeed) {
  return node.type === "decision" ? { width: 92, height: 92 } : { width: 160, height: 68 };
}

function nodeCenter(node: FlowNodeSeed) {
  const size = nodeSize(node);
  return { x: node.x + size.width / 2, y: node.y + size.height / 2 };
}

function nodeAnchorPoint(node: FlowNodeSeed, target: FlowNodeSeed) {
  const size = nodeSize(node);
  const center = nodeCenter(node);
  const targetCenter = nodeCenter(target);
  const dx = targetCenter.x - center.x;
  const dy = targetCenter.y - center.y;
  if (dx === 0 && dy === 0) return center;

  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);
  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale
  };
}

function snapshotOf(nodes: FlowNodeSeed[], edges: FlowEdgeSeed[]): FlowSnapshot {
  return { nodes: cloneNodes(nodes), edges: cloneEdges(edges) };
}

function formatValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function officialTests(module: FlowchartModule) {
  if (module.inputs.length === module.expectedOutputs.length && module.expectedOutputs.length > 1) {
    return module.inputs.map((input, index) => ({
      inputs: (Array.isArray(input) ? input : [input]) as FlowValue[],
      expected: [module.expectedOutputs[index]]
    }));
  }
  return [{ inputs: module.inputs as FlowValue[], expected: module.expectedOutputs }];
}

function initialTestInput(module: FlowchartModule) {
  const first = officialTests(module)[0]?.inputs || [];
  if (first.length === 1 && typeof first[0] === "string") return first[0];
  if (first.length === 1) return String(first[0]);
  return JSON.stringify(first);
}

function inputNames(module: FlowchartModule) {
  const names = module.solutionNodes
    .filter((node) => node.type === "input")
    .flatMap((node) => node.label.replace(/^\s*input\s*/i, "").split(","))
    .map((name) => name.trim())
    .filter(Boolean);
  return [...new Set(names)].join(", ");
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function FlowchartLab({ moduleId }: { moduleId: string }) {
  const module = getFlowchartModule(moduleId) || flowchartModules[0];
  const moduleIndex = flowchartModules.findIndex((item) => item.id === module.id);
  const previousModule = flowchartModules[moduleIndex - 1];
  const nextModule = flowchartModules[moduleIndex + 1];
  const isFreePractice = module.id === "free-practice";
  const [nodes, setNodes] = useState(() => cloneNodes(module.starterNodes));
  const [edges, setEdges] = useState(() => cloneEdges(module.starterEdges));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [edgeLabel, setEdgeLabel] = useState("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [historyPast, setHistoryPast] = useState<FlowSnapshot[]>([]);
  const [historyFuture, setHistoryFuture] = useState<FlowSnapshot[]>([]);
  const [showModelChecklist, setShowModelChecklist] = useState(false);
  const [testRuns, setTestRuns] = useState<string[]>([]);
  const [testInput, setTestInput] = useState(() => initialTestInput(module));
  const [testOutput, setTestOutput] = useState("");
  const [studentName, setStudentName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const dragSnapshotRef = useRef<FlowSnapshot | null>(null);
  const labelSnapshotRef = useRef<FlowSnapshot | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const progress = isFreePractice ? (complete ? 100 : 0) : complete ? 100 : Math.round((moduleIndex / flowchartModules.length) * 100);
  const feedbackRef = useFeedbackAutoScroll<HTMLElement>(feedback, feedback.length > 0 && !complete);

  useEffect(() => {
    setNodes(cloneNodes(module.starterNodes));
    setEdges(cloneEdges(module.starterEdges));
    setSelectedNodeId(module.starterNodes[0]?.id || null);
    setConnectFromId(null);
    setEdgeLabel("");
    setFeedback([]);
    setComplete(false);
    setDraggingId(null);
    setHistoryPast([]);
    setHistoryFuture([]);
    setShowModelChecklist(false);
    setTestRuns([]);
    setTestInput(initialTestInput(module));
    setTestOutput("");
    setStudentName("");
    setFlowDescription("");
    setEditingNodeId(null);
  }, [module.id, module.starterEdges, module.starterNodes]);

  function rememberChange() {
    setHistoryPast((current) => [...current, snapshotOf(nodes, edges)].slice(-30));
    setHistoryFuture([]);
    setFeedback([]);
    setComplete(false);
    setTestRuns([]);
    setTestOutput("");
  }

  function resetModule() {
    rememberChange();
    setNodes(cloneNodes(module.starterNodes));
    setEdges(cloneEdges(module.starterEdges));
    setSelectedNodeId(module.starterNodes[0]?.id || null);
    setConnectFromId(null);
    setFeedback([]);
    setComplete(false);
    setTestRuns([]);
    setTestOutput("");
    setStudentName("");
    setFlowDescription("");
  }

  function addNode(type: FlowNodeType) {
    rememberChange();
    const id = `${type}-${Date.now()}`;
    const label = type === "start" ? "START" : type === "stop" ? "STOP" : `${nodeLabels[type]} block`;
    const node = { id, type, label, x: 210 + (nodes.length % 3) * 35, y: 140 + nodes.length * 30 };
    setNodes((current) => [...current, node]);
    setSelectedNodeId(id);
  }

  function deleteSelected() {
    if (!selectedNodeId) return;
    rememberChange();
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.from !== selectedNodeId && edge.to !== selectedNodeId));
    setSelectedNodeId(null);
  }

  function beginLabelEdit(nodeId: string) {
    setSelectedNodeId(nodeId);
    setEditingNodeId(nodeId);
    labelSnapshotRef.current = snapshotOf(nodes, edges);
  }

  function updateNodeLabel(nodeId: string, label: string) {
    if (labelSnapshotRef.current) {
      setHistoryPast((current) => [...current, labelSnapshotRef.current!].slice(-30));
      setHistoryFuture([]);
      labelSnapshotRef.current = null;
    }
    setFeedback([]);
    setComplete(false);
    setTestRuns([]);
    setTestOutput("");
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, label } : node));
  }

  function finishLabelEdit() {
    setEditingNodeId(null);
    labelSnapshotRef.current = null;
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>, nodeId: string) {
    if (editingNodeId === nodeId) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(nodeId);
    dragSnapshotRef.current = snapshotOf(nodes, edges);
  }

  function dragNode(event: PointerEvent<HTMLDivElement>, nodeId: string) {
    if (draggingId !== nodeId) return;
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    if (dragSnapshotRef.current) {
      const snapshot = dragSnapshotRef.current;
      setHistoryPast((current) => [...current, snapshot].slice(-30));
      setHistoryFuture([]);
      setFeedback([]);
      setComplete(false);
      setTestRuns([]);
      dragSnapshotRef.current = null;
    }
    const node = nodes.find((item) => item.id === nodeId);
    const size = node ? nodeSize(node) : { width: 160, height: 68 };
    setNodes((current) => current.map((node) => node.id === nodeId ? {
      ...node,
      x: Math.max(20, Math.min(rect.width - size.width - 20, event.clientX - rect.left - size.width / 2)),
      y: Math.max(20, Math.min(rect.height - size.height - 20, event.clientY - rect.top - size.height / 2))
    } : node));
  }

  function connectTo(nodeId: string) {
    if (!connectFromId || connectFromId === nodeId) return;
    rememberChange();
    const id = `edge-${Date.now()}`;
    setEdges((current) => [...current, { id, from: connectFromId, to: nodeId, label: edgeLabel.trim() }]);
    setConnectFromId(null);
    setEdgeLabel("");
  }

  function runValidation() {
    if (isFreePractice) {
      const result = validateFreePracticeFlow(nodes, edges);
      setFeedback(result.length ? result : ["Free practice structure is complete. Run test data separately to review its behaviour."]);
      setComplete(result.length === 0);
      return;
    }

    const result = validateFlow(nodes, edges, module.solutionNodes, module.solutionEdges);
    if (result.length) {
      setFeedback(result);
      setComplete(false);
      return;
    }

    try {
      const failedRun = officialTests(module).find((test) => !valuesMatch(runFlowchart(nodes, edges, test.inputs).outputs, test.expected));
      if (failedRun) {
        setFeedback(["The structure is present, but the algorithm does not produce the required result for every assessment test. Check the calculations and decision routes."]);
        setComplete(false);
        return;
      }
      setFeedback(["Flowchart structure and algorithm behaviour are correct."]);
      setComplete(true);
    } catch (error) {
      setFeedback([error instanceof Error ? error.message : "The flowchart could not be executed."]);
      setComplete(false);
    }
  }

  function runTestData() {
    try {
      const result = runFlowchart(nodes, edges, parseFlowchartInputs(testInput));
      const output = result.outputs.length ? result.outputs.map(formatValue).join("\n") : "The flow reached STOP without producing output.";
      setTestOutput(output);
      setTestRuns([`Test completed in ${result.steps} steps. This does not submit or complete the task.`]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The flowchart could not be executed.";
      setTestOutput("");
      setTestRuns([message]);
    }
  }

  function undo() {
    const previous = historyPast.at(-1);
    if (!previous) return;
    setHistoryPast((current) => current.slice(0, -1));
    setHistoryFuture((current) => [snapshotOf(nodes, edges), ...current].slice(0, 30));
    setNodes(cloneNodes(previous.nodes));
    setEdges(cloneEdges(previous.edges));
    setComplete(false);
    setFeedback(["Undid the last edit."]);
    setTestRuns([]);
  }

  function redo() {
    const next = historyFuture[0];
    if (!next) return;
    setHistoryFuture((current) => current.slice(1));
    setHistoryPast((current) => [...current, snapshotOf(nodes, edges)].slice(-30));
    setNodes(cloneNodes(next.nodes));
    setEdges(cloneEdges(next.edges));
    setComplete(false);
    setFeedback(["Redid the last edit."]);
    setTestRuns([]);
  }

  function openFlowchartPrint() {
    const printWindow = window.open("", "peak-flowchart-print", "width=1100,height=850");
    if (!printWindow) return;

    const lines = edges.map((edge) => {
      const from = nodes.find((node) => node.id === edge.from);
      const to = nodes.find((node) => node.id === edge.to);
      if (!from || !to) return "";
      const start = nodeAnchorPoint(from, to);
      const end = nodeAnchorPoint(to, from);
      const labelX = (start.x + end.x) / 2;
      const labelY = (start.y + end.y) / 2 - 8;
      return `<g>
        <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#16313f" stroke-width="3" marker-end="url(#arrow)" />
        ${edge.label ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" class="edge-label">${escapeHtml(edge.label)}</text>` : ""}
      </g>`;
    }).join("");

    const nodeMarkup = nodes.map((node) => {
      const size = nodeSize(node);
      const label = escapeHtml(node.label);
      if (node.type === "decision") {
        return `<div class="node decision" style="left:${node.x}px;top:${node.y}px;width:${size.width}px;height:${size.height}px;"><span>${label}</span></div>`;
      }
      return `<div class="node ${node.type}" style="left:${node.x}px;top:${node.y}px;width:${size.width}px;height:${size.height}px;">${label}</div>`;
    }).join("");

    printWindow.document.write(`<!doctype html>
<html>
<head>
  <title>Peak flowchart print</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; color: #10212b; background: #eef3f7; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #10212b; color: white; }
    .toolbar button { border: 0; border-radius: 8px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
    .page { width: 960px; margin: 24px auto; background: white; padding: 28px; border: 1px solid #d6e0e8; }
    h1 { margin: 0; font-size: 24px; }
    .meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 16px 0 20px; font-size: 14px; }
    .meta div { border: 1px solid #d6e0e8; border-radius: 8px; padding: 10px; min-height: 44px; }
    .meta strong { display: block; color: #0b6f8a; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .canvas { position: relative; width: 760px; height: 860px; margin: 0 auto; border: 1px solid #d6e0e8; background-color: #fff; background-image: linear-gradient(#e7edf3 1px, transparent 1px), linear-gradient(90deg, #e7edf3 1px, transparent 1px); background-size: 24px 24px; overflow: hidden; }
    svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .edge-label { fill: #0b6f8a; font-size: 12px; font-weight: 700; }
    .node { position: absolute; z-index: 2; display: grid; place-items: center; border: 2px solid #d29a17; background: #fff7df; padding: 8px; text-align: center; font-size: 13px; font-weight: 700; line-height: 1.25; overflow: hidden; }
    .start { border-color: #2e8b68; background: #ecfdf5; border-radius: 999px; }
    .stop { border-color: #10212b; background: #f1f5f9; border-radius: 999px; }
    .input, .output { border-color: #0b6f8a; background: #ecfeff; transform: skewX(-10deg); }
    .input, .output { }
    .decision { border-color: #10212b; background: white; transform: rotate(45deg); }
    .decision span { transform: rotate(-45deg); font-size: 12px; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .page { margin: 0; width: 100%; border: 0; padding: 12mm; }
      .canvas { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="toolbar"><strong>Peak flowchart evidence</strong><button type="button" onclick="window.print()">Print / Save as PDF</button></div>
  <main class="page">
    <h1>${escapeHtml(module.title)}</h1>
    <section class="meta">
      <div><strong>Name</strong>${studentName.trim() ? escapeHtml(studentName.trim()) : "Optional"}</div>
      <div><strong>Description</strong>${flowDescription.trim() ? escapeHtml(flowDescription.trim()) : escapeHtml(module.scenario)}</div>
    </section>
    <section class="canvas">
      <svg aria-hidden="true">
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#16313f" /></marker></defs>
        ${lines}
      </svg>
      ${nodeMarkup}
    </section>
  </main>
</body>
</html>`);
    printWindow.document.close();
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
            {isFreePractice && (
              <div className="mb-4">
                <PracticeTimer compact />
              </div>
            )}
            <section className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ocean">{isFreePractice ? "Open practice" : "Goal"}</p>
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
            <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-2">
              <button onClick={openFlowchartPrint} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ocean" title="Preview and print flowchart">
                <Printer size={17} aria-hidden="true" /> Print
              </button>
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
                <button onClick={undo} disabled={historyPast.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-ocean disabled:text-slate-300 disabled:hover:border-line">
                  <Undo2 size={16} aria-hidden="true" /> Undo
                </button>
                <button onClick={redo} disabled={historyFuture.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-ocean disabled:text-slate-300 disabled:hover:border-line">
                  <Redo2 size={16} aria-hidden="true" /> Redo
                </button>
                <button onClick={resetModule} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-ocean">
                  <RotateCcw size={16} aria-hidden="true" /> Reset
                </button>
                <button onClick={deleteSelected} disabled={!selectedNodeId} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-ocean disabled:text-slate-300 disabled:hover:border-line">
                  <Trash2 size={16} aria-hidden="true" /> Delete
                </button>
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
            <div className="relative h-[980px] min-w-[900px] overflow-hidden rounded-lg border border-line bg-white" style={{ backgroundImage: "linear-gradient(#e7edf3 1px, transparent 1px), linear-gradient(90deg, #e7edf3 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
              <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#16313f" />
                  </marker>
                </defs>
                {edges.map((edge) => {
                  const from = nodes.find((node) => node.id === edge.from);
                  const to = nodes.find((node) => node.id === edge.to);
                  if (!from || !to) return null;
                  const start = nodeAnchorPoint(from, to);
                  const end = nodeAnchorPoint(to, from);
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
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${nodeLabels[node.type]} block: ${node.label}. Double-click to edit.`}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    if (connectFromId) connectTo(node.id);
                  }}
                  onDoubleClick={() => beginLabelEdit(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") beginLabelEdit(node.id);
                  }}
                  onPointerDown={(event) => beginDrag(event, node.id)}
                  onPointerMove={(event) => dragNode(event, node.id)}
                  onPointerUp={() => {
                    setDraggingId(null);
                    dragSnapshotRef.current = null;
                  }}
                  className={clsx("absolute z-10 grid h-[68px] w-40 cursor-move place-items-center border-2 px-3 text-center text-sm font-bold shadow-sm transition", nodeStyles[node.type], selectedNodeId === node.id && "ring-4 ring-ocean/20", node.type === "decision" && "h-[92px] w-[92px]")}
                  style={{ left: node.x, top: node.y }}
                >
                  {editingNodeId === node.id ? (
                    <textarea
                      autoFocus
                      value={node.label}
                      onClick={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                      onChange={(event) => updateNodeLabel(node.id, event.target.value)}
                      onBlur={finishLabelEdit}
                      onKeyDown={(event) => {
                        if (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey)) {
                          event.preventDefault();
                          event.currentTarget.blur();
                        }
                      }}
                      className={clsx("h-[52px] w-[136px] resize-none rounded border border-ocean bg-white p-1 text-center text-xs font-semibold text-ink outline-none", node.type === "decision" && "h-[66px] w-[66px] -rotate-45")}
                    />
                  ) : (
                    <span className={clsx("line-clamp-3", node.type === "decision" && "-rotate-45 text-xs")}>{node.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="flex min-h-full flex-col border-l border-line bg-white">
          <div className="border-b border-line p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink"><MousePointer2 size={20} aria-hidden="true" /> Tools and validation</h2>
            <section className="mt-4 rounded-lg border border-line bg-slate-50 p-3">
              <h3 className="font-bold text-ink">Flowchart details</h3>
              <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="student-name">Name (optional)</label>
              <input id="student-name" value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Student name" className="mt-2 w-full rounded-lg border border-line bg-white p-2 text-sm" />
              <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="flow-description">Description (optional)</label>
              <textarea id="flow-description" value={flowDescription} onChange={(event) => setFlowDescription(event.target.value)} placeholder="Brief description" className="mt-2 min-h-20 w-full rounded-lg border border-line bg-white p-2 text-sm" />
            </section>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <button onClick={() => setShowModelChecklist((current) => !current)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold text-ocean">
              <ListChecks size={17} aria-hidden="true" /> {showModelChecklist ? "Hide model checklist" : "Show model checklist"}
            </button>

            {selectedNode && (
              <section className="mt-5 rounded-lg border border-line p-4">
                <h3 className="font-bold text-ink">Selected block</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">Double-click the block to type there, or edit the same label below.</p>
                <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="node-label">Label</label>
                <textarea
                  id="node-label"
                  value={selectedNode.label}
                  onFocus={() => beginLabelEdit(selectedNode.id)}
                  onChange={(event) => updateNodeLabel(selectedNode.id, event.target.value)}
                  onBlur={finishLabelEdit}
                  className="mt-2 min-h-24 w-full rounded-lg border border-line p-3 text-sm"
                />
                <button onClick={() => setConnectFromId(selectedNode.id)} className={clsx("mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 font-bold", connectFromId === selectedNode.id ? "bg-ocean text-white" : "border border-line text-ocean")}>
                  <Plus size={17} aria-hidden="true" /> Start connector here
                </button>
                <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="edge-label">Connector label</label>
                <input id="edge-label" value={edgeLabel} onChange={(event) => setEdgeLabel(event.target.value.toUpperCase())} placeholder="YES / NO if needed" className="mt-2 w-full rounded-lg border border-line p-2 text-sm" />
              </section>
            )}

            {showModelChecklist && (
              <section className="mt-5 rounded-lg border border-line p-4">
                <h3 className="font-bold text-ink">Model checklist</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use this to check your thinking. It does not change your flowchart.</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {module.solutionNodes.map((node) => (
                    <li key={node.id}>Add {nodeLabels[node.type]}: {node.label}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-5 rounded-lg border border-line p-4">
              <h3 className="flex items-center gap-2 font-bold text-ink"><Play size={17} aria-hidden="true" /> Simulation preview</h3>
              <label className="mt-3 block text-sm font-bold text-slate-600" htmlFor="test-input">Test input{inputNames(module) ? ` (${inputNames(module)})` : ""}</label>
              <textarea
                id="test-input"
                value={testInput}
                onChange={(event) => setTestInput(event.target.value)}
                placeholder={isFreePractice ? "Type one value, or use [1, 2, 3] for several inputs" : "Type a value or JSON list"}
                className="mt-2 min-h-16 w-full rounded-lg border border-line p-2 text-sm"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">For several INPUT steps, enter a JSON list such as [10, 20, 30].</p>
              <div className="mt-3 rounded-lg border border-line bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">Output</p>
                <pre className="mt-2 min-h-20 whitespace-pre-wrap rounded-lg bg-ink p-3 text-sm leading-6 text-white">{testOutput || "Run test data to execute this flowchart."}</pre>
              </div>
              <button onClick={runTestData} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 font-bold text-ocean">
                <Play size={17} aria-hidden="true" /> Run test data
              </button>
              {testRuns.length > 0 && (
                <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
                  {testRuns.map((item) => (
                    <p key={item} className={clsx("text-sm leading-6", item.startsWith("Test completed") ? "text-leaf" : "text-red-700")}>{item}</p>
                  ))}
                </div>
              )}
            </section>

            <section ref={feedbackRef} className="mt-5 rounded-lg border border-line p-4">
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
