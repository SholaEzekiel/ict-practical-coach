"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Code2, Eye, FileCode2 } from "lucide-react";
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

function validateWebsite(card: WebsiteAuthoringCard, html: string, css: string): Feedback {
  const messages: string[] = [];
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const allText = normalise(document.body.textContent || "");

  card.expected.title && document.querySelector("title")?.textContent !== card.expected.title && messages.push(`Set the page title to ${card.expected.title}.`);

  card.expected.htmlIncludes?.forEach((text) => {
    if (!allText.includes(normalise(text)) && !normalise(html).includes(normalise(text))) messages.push(`Add this source text: ${text}`);
  });

  card.expected.requiredTags?.forEach((tag) => {
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
  const card = cards[activeIndex];
  const [html, setHtml] = useState(card?.starterHtml || "");
  const [css, setCss] = useState(card?.starterCss || "");

  const currentComplete = card ? completed.includes(card.id) : false;
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;
  const preview = `<!doctype html><html><head><style>${css}</style></head><body>${html}</body></html>`;

  function loadCard(index: number) {
    const next = cards[index];
    if (!next) return;
    setActiveIndex(index);
    setHtml(next.starterHtml);
    setCss(next.starterCss);
    setMode("html");
    setFeedback(null);
  }

  function checkWork() {
    if (!card) return;
    const result = validateWebsite(card, html, css);
    setFeedback(result);
    if (result.ok) setCompleted((items) => (items.includes(card.id) ? items : [...items, card.id]));
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    loadCard(activeIndex + 1);
  }

  if (!card) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-120px)] min-h-[720px] max-w-[1700px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)_minmax(360px,0.85fr)]">
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
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

        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-5">
          <button type="button" onClick={checkWork} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90">
            <CheckCircle2 size={18} aria-hidden="true" /> Check final result
          </button>
          <button type="button" onClick={nextCard} disabled={!currentComplete || activeIndex === cards.length - 1} className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
            Next
          </button>
        </div>
      </aside>

      <section className="min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line p-4">
          <div>
            <h2 className="font-bold">Code editor</h2>
            <p className="mt-1 text-sm text-slate-600">Edit the source, then check the preview.</p>
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
        <textarea
          value={mode === "html" ? html : css}
          onChange={(event) => mode === "html" ? setHtml(event.target.value) : setCss(event.target.value)}
          spellCheck={false}
          className="h-full min-h-[620px] w-full resize-none border-0 bg-[#101820] p-5 font-mono text-sm leading-6 text-slate-100 outline-none"
        />
      </section>

      <section className="min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-line p-4">
          <Eye size={18} aria-hidden="true" />
          <div>
            <h2 className="font-bold">Browser preview</h2>
            <p className="mt-1 text-sm text-slate-600">The preview updates from your HTML and CSS.</p>
          </div>
        </div>
        <iframe title="Website preview" srcDoc={preview} className="h-full min-h-[650px] w-full bg-white" sandbox="" />
      </section>
    </div>
  );
}
