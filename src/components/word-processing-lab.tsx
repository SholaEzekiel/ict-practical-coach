"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CheckCircle2,
  Columns2,
  FileText,
  Hash,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Merge,
  MonitorPlay,
  Pilcrow,
  Ruler,
  Table2,
  TextCursorInput,
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
  return normalise(root.textContent || "").includes(normalise(text));
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
  const widestRowCellCount = rows.reduce((max, row) => Math.max(max, row.querySelectorAll("td, th").length), 0);
  const allCellText = Array.from(table.querySelectorAll("td, th")).map((cell) => normalise(cell.textContent || ""));

  if (expected.minRows && rows.length < expected.minRows) {
    messages.push(`The table needs at least ${expected.minRows} rows.`);
  }

  if (expected.minColumns && widestRowCellCount < expected.minColumns) {
    messages.push(`The table needs at least ${expected.minColumns} columns.`);
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

  if (expected.mergedFirstRowText) {
    const firstRow = rows[0];
    const firstCell = firstRow?.querySelector("td, th") as HTMLTableCellElement | null;
    const cellCount = firstRow ? firstRow.querySelectorAll("td, th").length : 0;
    if (!firstCell || cellCount !== 1 || firstCell.colSpan < 2 || normalise(firstCell.textContent || "") !== normalise(expected.mergedFirstRowText)) {
      messages.push(`Merge the first row and centre the text ${expected.mergedFirstRowText}.`);
    }
  }
}

function imageResult(root: HTMLElement, expected: NonNullable<WordProcessingExpectedResult["image"]>, messages: string[]) {
  const image = root.querySelector("img");
  if (!image) {
    messages.push("Insert the required image.");
    return;
  }

  if (expected.alt && normalise(image.getAttribute("alt") || "") !== normalise(expected.alt)) {
    messages.push(`Set the image alternative text to ${expected.alt}.`);
  }

  if (expected.alignment) {
    const wrapper = image.closest("p, div, figure") as HTMLElement | null;
    const imageStyle = image.getAttribute("data-align") || image.style.float || image.style.display;
    const wrapperAlign = wrapper?.style.textAlign || wrapper?.getAttribute("align") || "";

    if (expected.alignment === "center" && wrapperAlign !== "center" && imageStyle !== "block") {
      messages.push("Centre align the image.");
    }

    if (expected.alignment === "right" && wrapperAlign !== "right" && imageStyle !== "right") {
      messages.push("Right align the image.");
    }

    if (expected.alignment === "left" && wrapperAlign === "right") {
      messages.push("Place the image on the left.");
    }
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
  if (expected.image) imageResult(root, expected.image, messages);

  if (expected.columns && !root.classList.contains(`columns-${expected.columns}`)) {
    messages.push(`Apply ${expected.columns} columns to the document.`);
  }

  return {
    ok: messages.length === 0,
    messages: messages.length === 0
      ? [
          "Good work. The final document matches the checks available in Peak Study.",
          ...(card.teacherReview?.length ? ["Your teacher should now review the listed exam presentation points."] : [])
        ]
      : messages
  };
}

function createDocumentRoot(html: string, classes = "") {
  const root = document.createElement("div");
  root.className = `word-document ${classes}`;
  root.innerHTML = html;
  return root;
}

function sortFirstTableContent(html: string) {
  const root = createDocumentRoot(html);
  const table = root.querySelector("table");
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
  return root.innerHTML;
}

function mergeFirstTableRowContent(html: string) {
  const root = createDocumentRoot(html);
  const table = root.querySelector("table");
  const firstRow = table?.querySelector("tr");
  if (!table || !firstRow) return html;
  const cells = Array.from(firstRow.querySelectorAll("td, th")) as HTMLTableCellElement[];
  if (cells.length < 2) return html;
  const mergedText = cells.map((cell) => cell.textContent?.trim()).filter(Boolean).join(" ");
  firstRow.innerHTML = `<td colspan="${cells.length}" style="text-align:center">${mergedText}</td>`;
  return root.innerHTML;
}

export function WordProcessingLab({ moduleId }: WordProcessingLabProps) {
  const cards = useMemo(() => getWordProcessingCardsForModule(moduleId), [moduleId]);
  const module = getWordProcessingModule(moduleId) || getWordProcessingModule(cards[0]?.moduleId);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [content, setContent] = useState(cards[0]?.starterHtml || "");
  const [documentClasses, setDocumentClasses] = useState("");

  const card = cards[activeIndex];
  const currentComplete = completed.includes(card.id);
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;

  useEffect(() => {
    if (!card) return;
    setContent(card.starterHtml);
    setDocumentClasses("");
    setFeedback(null);
    refreshWordCount(card.starterHtml);
  }, [card]);

  useEffect(() => {
    const body = editorRef.current?.getBody();
    if (body) body.className = `word-document ${documentClasses}`;
  }, [documentClasses]);

  function refreshWordCount(html = content) {
    const root = createDocumentRoot(html);
    const text = root.textContent || "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }

  function setEditorContent(nextContent: string) {
    setContent(nextContent);
    editorRef.current?.setContent(nextContent);
    refreshWordCount(nextContent);
  }

  function runCheck() {
    const root = createDocumentRoot(content, documentClasses);
    refreshWordCount();
    const result = validateDocument(root, card);
    setFeedback(result);
    if (result.ok) {
      setCompleted((items) => (items.includes(card.id) ? items : [...items, card.id]));
    }
  }

  function openDocumentPreview() {
    const preview = window.open("", "apex-word-processing-preview");
    if (!preview) return;

    preview.document.open();
    preview.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Peak document preview</title>
    <style>
      body{margin:0;background:#eef3f7;color:#111827;font-family:Arial,Helvetica,sans-serif}
      .toolbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;background:#fff;border-bottom:1px solid #d9e2ea}
      .toolbar button{border:0;border-radius:8px;background:#0f6f8c;color:#fff;padding:10px 16px;font-weight:700;cursor:pointer}
      .word-document{background:#fff;box-shadow:0 20px 60px rgba(15,23,42,.16);margin:32px auto;max-width:850px;min-height:900px;padding:48px;line-height:1.55}
      .word-document.page-margin-wide{padding-left:64px;padding-right:64px}
      .word-document.page-landscape{max-width:1120px;min-height:720px}
      .word-document.paragraph-spacing-relaxed p{margin-bottom:20px}
      .word-document.columns-2{column-count:2;column-gap:32px}
      .word-document.columns-3{column-count:3;column-gap:24px}
      .word-document table{width:100%;border-collapse:collapse}
      .word-document td,.word-document th{border:1px solid #9ca3af;padding:7px 10px}
      .word-document img{max-width:100%;height:auto}
      @media print{body{background:white}.toolbar{display:none}.word-document{box-shadow:none;margin:0;max-width:none;min-height:0;padding:0}}
    </style>
  </head>
  <body>
    <div class="toolbar"><strong>Peak document preview</strong><button type="button" onclick="window.print()">Print / Save as PDF</button></div>
    <main class="word-document ${documentClasses}">${content}</main>
  </body>
</html>`);
    preview.document.close();
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

  function applyColumns(count: 2 | 3) {
    setDocumentClasses((classes) => {
      const next = classes.split(" ").filter((item) => item && item !== "columns-2" && item !== "columns-3");
      next.push(`columns-${count}`);
      return next.join(" ");
    });
  }

  function runEditorCommand(name: string, value?: string) {
    editorRef.current?.execCommand(name, false, value);
    const nextContent = editorRef.current?.getContent() || content;
    setContent(nextContent);
    refreshWordCount(nextContent);
  }

  function insertContent(html: string) {
    editorRef.current?.insertContent(html);
    const nextContent = editorRef.current?.getContent() || content;
    setContent(nextContent);
    refreshWordCount(nextContent);
  }

  function toggleDocumentClass(className: string) {
    setDocumentClasses((classes) => {
      const items = classes.split(" ").filter(Boolean);
      return items.includes(className) ? items.filter((item) => item !== className).join(" ") : [...items, className].join(" ");
    });
  }

  function insertHeader() {
    insertContent(`<header class="doc-header">Peak Study Hub</header><p></p>`);
  }

  function insertFooter() {
    insertContent(`<footer class="doc-footer">Peak Study Hub | Page <span class="page-number">1</span></footer><p></p>`);
  }

  function insertPageNumber() {
    insertContent(`<span class="page-number">1</span>`);
  }

  function insertStudyImage() {
    insertContent(`<p style="text-align:center"><img src="/assets/peak-study-card.svg" alt="peak study workspace" data-align="center" style="max-width:260px;width:45%;height:auto" /></p><p></p>`);
  }

  function insertTable() {
    insertContent(`<table><tbody><tr><td>Club</td><td>Teacher</td><td>Room</td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><p></p>`);
  }

  function sortFirstTable() {
    const nextContent = sortFirstTableContent(content);
    if (nextContent) setEditorContent(nextContent);
  }

  function mergeFirstTableRow() {
    setEditorContent(mergeFirstTableRowContent(content));
  }

  if (!card) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1600px] gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
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

          {card.teacherReview && (
            <section className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <h3 className="font-bold">Teacher review</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {card.teacherReview.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          )}

          {feedback && (
            <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              <h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                {feedback.messages.map((message) => <li key={message}>{message}</li>)}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line p-5">
          <button type="button" onClick={runCheck} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90">
            <CheckCircle2 size={18} aria-hidden="true" /> Check final result
          </button>
          <button type="button" onClick={openDocumentPreview} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 font-bold text-ocean hover:bg-mist">
            <MonitorPlay size={18} aria-hidden="true" /> Preview / Print
          </button>
          <span className="mr-auto text-sm font-semibold text-ink">{currentComplete ? card.points : 0} points</span>
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

      <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4">
          <h2 className="font-bold">Document workspace</h2>
          <p className="mt-1 text-sm text-slate-600">Use the toolbar, edit the document, then check the final result.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1 border-b border-line bg-slate-50 px-4 py-2">
          {toolbarButton("Bold", Bold, () => runEditorCommand("Bold"))}
          {toolbarButton("Italic", Italic, () => runEditorCommand("Italic"))}
          {toolbarButton("Underline", Underline, () => runEditorCommand("Underline"))}
          <span className="mx-2 h-8 w-px bg-line" />
          {toolbarButton("Heading 1", Pilcrow, () => runEditorCommand("FormatBlock", "h1"))}
          {toolbarButton("Align left", AlignLeft, () => runEditorCommand("JustifyLeft"))}
          {toolbarButton("Centre align", AlignCenter, () => runEditorCommand("JustifyCenter"))}
          {toolbarButton("Right align", AlignRight, () => runEditorCommand("JustifyRight"))}
          {toolbarButton("Justify", AlignJustify, () => runEditorCommand("JustifyFull"))}
          <span className="mx-2 h-8 w-px bg-line" />
          {toolbarButton("Bullet list", List, () => runEditorCommand("InsertUnorderedList"))}
          {toolbarButton("Numbered list", ListOrdered, () => runEditorCommand("InsertOrderedList"))}
          {toolbarButton("Insert table", Table2, insertTable)}
          {toolbarButton("Insert study image", ImageIcon, insertStudyImage)}
          {toolbarButton("Two columns", Columns2, () => applyColumns(2))}
          {toolbarButton("Merge first table row", Merge, mergeFirstTableRow)}
          <span className="mx-2 h-8 w-px bg-line" />
          {toolbarButton("Toggle wider margins", Ruler, () => toggleDocumentClass("page-margin-wide"))}
          {toolbarButton("Toggle landscape page", FileText, () => toggleDocumentClass("page-landscape"))}
          {toolbarButton("Insert header", TextCursorInput, insertHeader)}
          {toolbarButton("Insert footer", Pilcrow, insertFooter)}
          {toolbarButton("Insert page number", Hash, insertPageNumber)}
          {toolbarButton("Toggle paragraph spacing", Columns2, () => toggleDocumentClass("paragraph-spacing-relaxed"))}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={sortFirstTable}
            className="rounded-md px-3 py-2 text-sm font-bold text-ink hover:bg-slate-100"
          >
            Sort A-Z
          </button>
          <span className="ml-auto rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
            {wordCount} words
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-6">
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey="gpl"
            value={content}
            onInit={(_, editor) => {
              editorRef.current = editor;
              editor.getBody().className = `word-document ${documentClasses}`;
              refreshWordCount(editor.getContent());
            }}
            onEditorChange={(value) => {
              setContent(value);
              refreshWordCount(value);
            }}
            init={{
              height: "100%",
              min_height: 640,
              menubar: false,
              branding: false,
              promotion: false,
              statusbar: false,
              plugins: "lists table link image wordcount code",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | table image link | code",
              font_family_formats: "Arial=arial,helvetica,sans-serif;Calibri=calibri,arial,sans-serif;Times New Roman=times new roman,times,serif",
              fontsize_formats: "10pt 11pt 12pt 14pt 18pt 24pt 36pt",
              body_class: `word-document ${documentClasses}`,
              content_style: `
                body.word-document {
                  background: #fff;
                  color: #111827;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 16px;
                  line-height: 1.55;
                  margin: 0 auto;
                  max-width: 850px;
                  min-height: 900px;
                  padding: 40px;
                }
                body.word-document.page-margin-wide { padding-left: 64px; padding-right: 64px; }
                body.word-document.page-landscape { max-width: 1120px; min-height: 720px; }
                body.word-document.paragraph-spacing-relaxed p { margin-bottom: 20px; }
                body.word-document.columns-2 { column-count: 2; column-gap: 32px; }
                body.word-document.columns-3 { column-count: 3; column-gap: 24px; }
                body.word-document h1 { margin: 0 0 16px; font-size: 28px; font-weight: 700; }
                body.word-document h2 { margin: 0 0 12px; font-size: 22px; font-weight: 700; }
                body.word-document p { margin: 0 0 12px; }
                body.word-document table { margin: 16px 0; width: 100%; border-collapse: collapse; }
                body.word-document td, body.word-document th { min-width: 120px; border: 1px solid #9ca3af; padding: 7px 10px; vertical-align: top; }
                body.word-document img { display: inline-block; margin: 12px 0; max-width: 100%; }
                .doc-header, .doc-footer { border-bottom: 1px solid #cbd5e1; color: #475569; font-size: 13px; margin-bottom: 16px; padding-bottom: 6px; text-align: right; }
                .doc-footer { border-bottom: 0; border-top: 1px solid #cbd5e1; margin-bottom: 0; margin-top: 20px; padding-bottom: 0; padding-top: 6px; }
                .page-number { border: 1px solid #cbd5e1; border-radius: 4px; display: inline-block; min-width: 24px; padding: 0 4px; text-align: center; }
              `,
              table_default_attributes: { border: "1" },
              table_default_styles: { borderCollapse: "collapse", width: "100%" },
              automatic_uploads: false
            }}
          />
        </div>
      </section>
    </div>
  );
}
