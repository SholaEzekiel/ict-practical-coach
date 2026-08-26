"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MonacoEditor from "@monaco-editor/react";
import grapesjs from "grapesjs";
import type { Editor as GrapesEditor } from "grapesjs";
import { ArrowLeft, CheckCircle2, ChevronLeft, Code2, Eye, FileCode2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { getWebsiteAuthoringCardsForModule, getWebsiteAuthoringModule } from "@/lib/website-authoring-instruction-cards";
import type { WebsiteAuthoringCard } from "@/lib/website-authoring-instruction-cards";

type Feedback = {
  ok: boolean;
  messages: string[];
};

type WebsiteAuthoringLabProps = {
  moduleId?: string;
};

function normalise(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function sourceHasTag(html: string, tag: string) {
  const cleanTag = tag.toLowerCase();
  if (cleanTag.startsWith("<!--")) return html.toLowerCase().includes(cleanTag);
  return new RegExp(`<${cleanTag}(\\s|>|/)`, "i").test(html) && new RegExp(`</${cleanTag}>`, "i").test(html);
}

function getBodyInnerHtml(html: string) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match?.[1]?.trim() || "";
}

function hasPreviewableDocument(html: string) {
  return /<!doctype\s+html>/i.test(html) && sourceHasTag(html, "html") && sourceHasTag(html, "head") && sourceHasTag(html, "body");
}

function validateWebsite(card: WebsiteAuthoringCard, html: string, css: string): Feedback {
  const messages: string[] = [];
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const allText = normalise(document.body.textContent || "");

  if (card.expected.htmlIncludes?.some((text) => normalise(text).includes("<!doctype html>")) && !/<!doctype\s+html>/i.test(html)) {
    messages.push("Add <!doctype html> as the first line.");
  }

  if (card.expected.title) {
    const sourceTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    if (sourceTitle !== card.expected.title) messages.push(`Set the page title to ${card.expected.title}.`);
  }

  card.expected.htmlIncludes?.forEach((text) => {
    if (normalise(text).includes("<!doctype html>")) return;
    if (!allText.includes(normalise(text)) && !normalise(html).includes(normalise(text))) messages.push(`Add this source text: ${text}`);
  });

  card.expected.requiredTags?.forEach((tag) => {
    if (["html", "head", "body", "title", "main"].includes(tag) || tag.startsWith("<!--")) {
      if (!sourceHasTag(html, tag)) messages.push(`Add a ${tag} element.`);
      return;
    }

    if (!document.querySelector(tag)) messages.push(`Add a ${tag} element.`);
  });

  card.expected.images?.forEach((expectedImage) => {
    const images = Array.from(document.querySelectorAll("img"));
    const found = images.some((image) => {
      const srcOk = expectedImage.srcIncludes ? image.getAttribute("src")?.includes(expectedImage.srcIncludes) : true;
      const altOk = expectedImage.alt ? normalise(image.getAttribute("alt") || "") === normalise(expectedImage.alt) : true;
      return srcOk && altOk;
    });
    if (!found) messages.push("Add the required image with the correct source and alt text.");
  });

  card.expected.links?.forEach((expectedLink) => {
    const links = Array.from(document.querySelectorAll("a"));
    const found = links.some((link) => {
      const textOk = expectedLink.text ? normalise(link.textContent || "").includes(normalise(expectedLink.text)) : true;
      const hrefOk = expectedLink.href ? link.getAttribute("href") === expectedLink.href : true;
      return textOk && hrefOk;
    });
    if (!found) messages.push(`Add the link ${expectedLink.text || ""} to ${expectedLink.href || "the required target"}.`);
  });

  card.expected.tableHeaders?.forEach((header) => {
    const headers = Array.from(document.querySelectorAll("th")).map((item) => normalise(item.textContent || ""));
    if (!headers.includes(normalise(header))) messages.push(`Use ${header} as a table heading.`);
  });

  card.expected.cssIncludes?.forEach((part) => {
    if (!normalise(css).includes(normalise(part))) messages.push(`Add ${part} to the CSS.`);
  });

  return {
    ok: messages.length === 0,
    messages: messages.length === 0
      ? [
          "Good work. The HTML/CSS matches the checks available in Apex.",
          ...(card.teacherReview?.length ? ["Your teacher should now review the listed presentation and evidence points."] : [])
        ]
      : messages
  };
}

export function WebsiteAuthoringLab({ moduleId }: WebsiteAuthoringLabProps) {
  const cards = useMemo(() => getWebsiteAuthoringCardsForModule(moduleId), [moduleId]);
  const module = getWebsiteAuthoringModule(moduleId) || getWebsiteAuthoringModule(cards[0]?.moduleId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [mode, setMode] = useState<"html" | "css">("html");
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const card = cards[activeIndex];
  const [html, setHtml] = useState(card?.starterHtml || "");
  const [css, setCss] = useState(card?.starterCss || "");
  const visualEditorRef = useRef<GrapesEditor | null>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const editorPasteCleanupRef = useRef<(() => void) | null>(null);
  const syncingFromCodeRef = useRef(false);
  const previewReady = hasPreviewableDocument(html);

  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;

  useEffect(() => {
    if (!visualContainerRef.current || visualEditorRef.current) return;

    const editor = grapesjs.init({
      container: visualContainerRef.current,
      height: "100%",
      storageManager: false,
      fromElement: false,
      components: hasPreviewableDocument(html) ? getBodyInnerHtml(html) : "",
      style: css,
      blockManager: {
        appendTo: undefined,
        blocks: [
          { id: "section", label: "Section", content: "<section><h2>Section heading</h2><p>Section text</p></section>" },
          { id: "heading", label: "Heading", content: "<h1>Apex Study Hub Open Day</h1>" },
          { id: "paragraph", label: "Paragraph", content: "<p>Practical digital skills for confident learners.</p>" },
          { id: "link", label: "Link", content: '<a href="index.html">Home</a>' },
          { id: "image", label: "Image", content: '<img src="/assets/apex-study-card.svg" alt="Apex study practice card">' },
          {
            id: "table",
            label: "Table",
            content: "<table><tr><th>Session</th><th>Room</th><th>Time</th></tr><tr><td>Spreadsheet Sprint</td><td>Lab 1</td><td>09:30</td></tr></table>"
          }
        ]
      }
    });

    visualEditorRef.current = editor;

    return () => {
      editor.destroy();
      visualEditorRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      editorPasteCleanupRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (!visualEditorRef.current) return;
    syncingFromCodeRef.current = true;
    visualEditorRef.current.setComponents(hasPreviewableDocument(html) ? getBodyInnerHtml(html) : "");
    visualEditorRef.current.setStyle(css);
    queueMicrotask(() => {
      syncingFromCodeRef.current = false;
    });
  }, [html, css]);

  function loadCard(index: number) {
    const next = cards[index];
    if (!next) return;
    setActiveIndex(index);
    setHtml(next.starterHtml);
    setCss(next.starterCss);
    setMode("html");
    setFeedback(null);
    if (visualEditorRef.current) {
      syncingFromCodeRef.current = true;
      visualEditorRef.current.setComponents(hasPreviewableDocument(next.starterHtml) ? getBodyInnerHtml(next.starterHtml) : "");
      visualEditorRef.current.setStyle(next.starterCss);
      queueMicrotask(() => {
        syncingFromCodeRef.current = false;
      });
    }
  }

  function checkWork() {
    if (!card) return;
    const result = validateWebsite(card, html, css);
    setFeedback(result);
    if (result.ok) setCompleted((items) => (items.includes(card.id) ? items : [...items, card.id]));
  }

  function nextCard() {
    if (activeIndex === cards.length - 1) return;
    loadCard(activeIndex + 1);
  }

  function previousCard() {
    if (activeIndex === 0) return;
    loadCard(activeIndex - 1);
  }

  if (!card) return null;

  const layoutClass = instructionsOpen
    ? "mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)_minmax(360px,0.85fr)]"
    : "mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[72px_minmax(0,1fr)_minmax(360px,0.85fr)]";

  return (
    <div className={layoutClass}>
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setInstructionsOpen((value) => !value)}
          className="flex items-center justify-between gap-2 border-b border-line p-4 text-sm font-bold text-ocean hover:bg-mist"
          aria-expanded={instructionsOpen}
        >
          <span>{instructionsOpen ? "Hide guide" : "Guide"}</span>
          {instructionsOpen ? <PanelLeftClose size={18} aria-hidden="true" /> : <PanelLeftOpen size={18} aria-hidden="true" />}
        </button>

        {instructionsOpen && (
          <>
            <div className="border-b border-line p-5">
              <Link href="/subjects/ict/website-authoring" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                <ArrowLeft size={16} aria-hidden="true" /> Website Authoring modules
              </Link>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
                <span className="text-sm font-semibold text-slate-600">{activeIndex + 1}/{cards.length}</span>
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

            <div
              className="min-h-0 flex-1 select-none space-y-4 overflow-y-auto p-5"
              onCopy={(event) => event.preventDefault()}
              onCut={(event) => event.preventDefault()}
              onContextMenu={(event) => event.preventDefault()}
            >
              <section className="rounded-lg border border-line bg-mist p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">Goal</p>
                <h2 className="mt-2 text-xl font-bold leading-8">{card.goal}</h2>
              </section>

              <section className="rounded-lg border border-line bg-white p-4">
                <h3 className="font-bold">Support document</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {card.supportDocument.map((line) => <p key={line} className="break-words [overflow-wrap:anywhere]">{line}</p>)}
                </div>
              </section>

              <section className="rounded-lg border border-line bg-white p-4">
                <h3 className="font-bold">Steps</h3>
                <ol className="mt-3 space-y-3">
                  {card.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span>
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {card.teacherReview && (
                <section className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                  <h3 className="font-bold">Teacher review</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {card.teacherReview.map((item) => <li key={item} className="break-words [overflow-wrap:anywhere]">{item}</li>)}
                  </ul>
                </section>
              )}

              {feedback && (
                <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                  <h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {feedback.messages.map((message) => <li key={message} className="break-words [overflow-wrap:anywhere]">{message}</li>)}
                  </ul>
                </section>
              )}
            </div>

            <div className="space-y-4 border-t border-line p-5">
              <button type="button" onClick={checkWork} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90">
                <CheckCircle2 size={18} aria-hidden="true" /> Check final result
              </button>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={previousCard}
                  disabled={activeIndex === 0}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 font-bold text-ink hover:bg-mist disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <ChevronLeft size={18} aria-hidden="true" /> Previous
                </button>
                <button type="button" onClick={nextCard} disabled={activeIndex === cards.length - 1} className="min-h-12 rounded-lg bg-ink px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </aside>

      <section className="min-h-[520px] overflow-hidden rounded-lg border border-line bg-white shadow-sm xl:min-h-0" onPaste={(event) => event.preventDefault()}>
        <div className="flex items-center justify-between border-b border-line p-4">
          <div>
            <h2 className="font-bold">Code editor</h2>
            <p className="mt-1 text-sm text-slate-600">Edit source code with HTML and CSS tabs.</p>
          </div>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button type="button" onClick={() => setMode("html")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${mode === "html" ? "bg-white text-ocean shadow-sm" : "text-slate-600"}`}>
              <FileCode2 size={16} aria-hidden="true" /> HTML
            </button>
            <button type="button" onClick={() => setMode("css")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${mode === "css" ? "bg-white text-ocean shadow-sm" : "text-slate-600"}`}>
              <Code2 size={16} aria-hidden="true" /> CSS
            </button>
          </div>
        </div>
        <div className="h-full min-h-0 bg-[#101820]">
          <MonacoEditor
            key={mode}
            height="100%"
            language={mode}
            theme="vs-dark"
            value={mode === "html" ? html : css}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 22,
              wordWrap: "on",
              tabSize: 2,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              contextmenu: false
            }}
            onMount={(editor, monaco) => {
              editorPasteCleanupRef.current?.();
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => null);

              const keyDisposable = editor.onKeyDown((event) => {
                const browserEvent = event.browserEvent;
                if ((browserEvent.ctrlKey || browserEvent.metaKey) && browserEvent.key.toLowerCase() === "v") {
                  event.preventDefault();
                  browserEvent.preventDefault();
                }
              });
              const editorNode = editor.getDomNode();
              const preventPaste = (event: ClipboardEvent) => event.preventDefault();
              editorNode?.addEventListener("paste", preventPaste);
              editorPasteCleanupRef.current = () => {
                keyDisposable.dispose();
                editorNode?.removeEventListener("paste", preventPaste);
              };
            }}
            onChange={(value) => {
              if (mode === "html") setHtml(value || "");
              else setCss(value || "");
            }}
          />
        </div>
      </section>

      <section className="min-h-[560px] overflow-hidden rounded-lg border border-line bg-white shadow-sm xl:min-h-0">
        <div className="flex items-center gap-2 border-b border-line p-4">
          <Eye size={18} aria-hidden="true" />
          <div>
            <h2 className="font-bold">Visual builder</h2>
            <p className="mt-1 text-sm text-slate-600">Use the GrapesJS canvas to inspect and edit the page.</p>
          </div>
        </div>
        <div className="relative h-full min-h-0">
          {!previewReady && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-white px-8 text-center">
              <div className="max-w-sm rounded-lg border border-line bg-mist p-5">
                <p className="font-bold text-ink">Preview starts after the HTML structure is ready.</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Add the doctype, html, head, and body elements first. Random words will stay in the editor until the page has a proper structure.
                </p>
              </div>
            </div>
          )}
          <div ref={visualContainerRef} className="website-builder h-full min-h-0 bg-white" />
        </div>
      </section>
    </div>
  );
}
