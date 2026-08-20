"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CheckCircle2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Table2,
  Underline
} from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { getWordProcessingCardsForModule, getWordProcessingModule } from "@/lib/word-processing-instruction-cards";
import type { WordProcessingExpectedResult, WordProcessingInstructionCard } from "@/lib/word-processing-instruction-cards";

type Feedback = {
  ok: boolean;
  messages: string[];
};

type WordProcessingLabProps = {
  moduleId?: string;
};

function normalise(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function hasText(root: HTMLElement, text: string) {
  return normalise(root.innerText).includes(normalise(text));
}

function matchingElements(root: HTMLElement, text: string) {
  return Array.from(root.querySelectorAll("*")).filter((element) => normalise(element.textContent || "").includes(normalise(text)));
}

function textHasTag(root: HTMLElement, text: string, tags: string[]) {
  return matchingElements(root, text).some((element) => {
    let current: Element | null = element;
    while (current && current !== root) {
      if (tags.includes(current.tagName.toLowerCase())) return true;
      const style = (current as HTMLElement).style;
      if (tags.includes("b") && (style.fontWeight === "bold" || Number(style.fontWeight) >= 600)) return true;
      if (tags.includes("i") && style.fontStyle === "italic") return true;
      if (tags.includes("u") && style.textDecoration.includes("underline")) return true;
      current = current.parentElement;
    }
    return false;
  });
}

function textHasAlignment(root: HTMLElement, text: string, alignment: string) {
  const acceptable = alignment === "justify" ? ["justify"] : [alignment];
  return matchingElements(root, text).some((element) => {
    let current: Element | null = element;
    while (current && current !== root) {
      const htmlElement = current as HTMLElement;
      const align = htmlElement.getAttribute("align") || htmlElement.style.textAlign;
      if (acceptable.includes(align)) return true;
      current = current.parentElement;
    }
    return false;
  });
}

function tableResult(root: HTMLElement, expected: NonNullable<WordProcessingExpectedResult["table"]>, messages: string[]) {
  const table = root.querySelector("table");
  if (!table) {
    messages.push("Insert or keep the table in the document.");
    return;
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const firstRowCells = rows[0] ? Array.from(rows[0].querySelectorAll("td, th")) : [];
  const allCellText = Array.from(table.querySelectorAll("td, th")).map((cell) => normalise(cell.textContent || ""));

  if (expected.minRows && rows.length < expected.minRows) {
    messages.push(`The table needs at least ${expected.minRows} rows.`);
  }

  if (expected.minColumns && firstRowCells.length < expected.minColumns) {
    messages.push(`The first row needs at least ${expected.minColumns} columns.`);
  }

  expected.headers?.forEach((header) => {
    if (!allCellText.includes(normalise(header))) {
      messages.push(`The table heading ${header} is missing.`);
    }
  });

  if (expected.sortedFirstColumn) {
    const bodyRows = rows.slice(1).map((row) => normalise(row.querySelector("td, th")?.textContent || "")).filter(Boolean);
    expected.sortedFirstColumn.forEach((value, index) => {
      if (bodyRows[index] !== normalise(value)) {
        messages.push(`The first column should be sorted so row ${index + 1} is ${value}.`);
      }
    });
  }
}

function validateDocument(root: HTMLElement, card: WordProcessingInstructionCard): Feedback {
  const messages: string[] = [];
  const expected = card.expected;

  expected.textIncludes?.forEach((text) => {
    if (!hasText(root, text)) messages.push(`Add the text: ${text}`);
  });

  expected.boldText?.forEach((text) => {
    if (!textHasTag(root, text, ["strong", "b", "h1", "h2"])) messages.push(`Make ${text} bold.`);
  });

  expected.italicText?.forEach((text) => {
    if (!textHasTag(root, text, ["em", "i"])) messages.push(`Make ${text} italic.`);
  });

  expected.underlineText?.forEach((text) => {
    if (!textHasTag(root, text, ["u"])) messages.push(`Underline ${text}.`);
  });

  expected.alignments?.forEach((item) => {
    if (!textHasAlignment(root, item.text, item.value)) messages.push(`Set ${item.text} to ${item.value} alignment.`);
  });

  expected.unorderedListItems?.forEach((item) => {
    const found = Array.from(root.querySelectorAll("ul li")).some((li) => normalise(li.textContent || "") === normalise(item));
    if (!found) messages.push(`Add ${item} as a bullet list item.`);
  });

  expected.orderedListItems?.forEach((item) => {
    const found = Array.from(root.querySelectorAll("ol li")).some((li) => normalise(li.textContent || "") === normalise(item));
    if (!found) messages.push(`Add ${item} as a numbered list item.`);
  });

  if (expected.table) tableResult(root, expected.table, messages);

  return {
    ok: messages.length === 0,
    messages: messages.length === 0 ? ["Good work. The final document matches the task."] : messages
  };
}

function command(name: string, value?: string) {
  document.execCommand(name, false, value);
}

function insertTable() {
  command(
    "insertHTML",
    `<table><tbody><tr><td>Club</td><td>Teacher</td><td>Room</td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><p></p>`
  );
}

function sortFirstTable(editor: HTMLElement | null) {
  const table = editor?.querySelector("table");
  if (!table) return;
  const tbody = table.querySelector("tbody") || table;
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const heading = rows[0];
  const bodyRows = rows.slice(1).sort((first, second) => {
    const firstText = normalise(first.querySelector("td, th")?.textContent || "");
    const secondText = normalise(second.querySelector("td, th")?.textContent || "");
    return firstText.localeCompare(secondText);
  });
  tbody.innerHTML = "";
  if (heading) tbody.appendChild(heading);
  bodyRows.forEach((row) => tbody.appendChild(row));
}

export function WordProcessingLab({ moduleId }: WordProcessingLabProps) {
  const cards = useMemo(() => getWordProcessingCardsForModule(moduleId), [moduleId]);
  const module = getWordProcessingModule(moduleId) || getWordProcessingModule(cards[0]?.moduleId);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const card = cards[activeIndex];
  const currentComplete = completed.includes(card.id);
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;

  function runCheck() {
    if (!editorRef.current) return;
    const result = validateDocument(editorRef.current, card);
    setFeedback(result);
    if (result.ok) {
      setCompleted((items) => (items.includes(card.id) ? items : [...items, card.id]));
    }
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    setFeedback(null);
    setActiveIndex((index) => Math.min(index + 1, cards.length - 1));
  }

  function toolbarButton(label: string, Icon: typeof Bold, onClick: () => void) {
    return (
      <button
        type="button"
        title={label}
        aria-label={label}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className="grid h-9 w-9 place-items-center rounded-md text-ink hover:bg-slate-100"
      >
        <Icon size={18} aria-hidden="true" />
      </button>
    );
  }

  if (!card) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-120px)] min-h-[720px] max-w-[1600px] gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line p-5">
          <Link href="/subjects/ict/word-processing" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
            <ArrowLeft size={16} aria-hidden="true" /> Word Processing modules
          </Link>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
            <span className="text-sm font-semibold text-slate-600">
              {activeIndex + 1}/{cards.length}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{card.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>{completed.length}/{cards.length}</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <section className="rounded-lg border border-line bg-mist p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ocean">Goal</p>
            <h2 className="mt-2 text-xl font-bold leading-8">{card.goal}</h2>
          </section>

          <section className="rounded-lg border border-line bg-white p-4">
            <h3 className="font-bold">Support document</h3>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {card.supportDocument.map((line) => <p key={line}>{line}</p>)}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4">
            <h3 className="font-bold">Steps</h3>
            <ol className="mt-3 space-y-3">
              {card.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {feedback && (
            <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              <h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                {feedback.messages.map((message) => <li key={message}>{message}</li>)}
              </ul>
            </section>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-5">
          <button type="button" onClick={runCheck} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90">
            <CheckCircle2 size={18} aria-hidden="true" /> Check final result
          </button>
          <button
            type="button"
            onClick={nextCard}
            disabled={!currentComplete || activeIndex === cards.length - 1}
            className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Next
          </button>
        </div>
      </aside>

      <section className="min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4">
          <h2 className="font-bold">Document workspace</h2>
          <p className="mt-1 text-sm text-slate-600">Use the toolbar, edit the document, then check the final result.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 border-b border-line bg-slate-50 px-4 py-2">
          {toolbarButton("Bold", Bold, () => command("bold"))}
          {toolbarButton("Italic", Italic, () => command("italic"))}
          {toolbarButton("Underline", Underline, () => command("underline"))}
          <span className="mx-2 h-8 w-px bg-line" />
          {toolbarButton("Heading 1", Pilcrow, () => command("formatBlock", "h1"))}
          {toolbarButton("Align left", AlignLeft, () => command("justifyLeft"))}
          {toolbarButton("Centre align", AlignCenter, () => command("justifyCenter"))}
          {toolbarButton("Right align", AlignRight, () => command("justifyRight"))}
          {toolbarButton("Justify", AlignJustify, () => command("justifyFull"))}
          <span className="mx-2 h-8 w-px bg-line" />
          {toolbarButton("Bullet list", List, () => command("insertUnorderedList"))}
          {toolbarButton("Numbered list", ListOrdered, () => command("insertOrderedList"))}
          {toolbarButton("Insert table", Table2, insertTable)}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => sortFirstTable(editorRef.current)}
            className="rounded-md px-3 py-2 text-sm font-bold text-ink hover:bg-slate-100"
          >
            Sort A-Z
          </button>
        </div>
        <div className="h-full overflow-auto bg-slate-100 p-6">
          <div
            key={card.id}
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="word-document mx-auto min-h-[900px] w-full max-w-[850px] bg-white p-10 shadow-sm outline-none"
            dangerouslySetInnerHTML={{ __html: card.starterHtml }}
          />
        </div>
      </section>
    </div>
  );
}
