"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, FileImage, LayoutTemplate, ListPlus, MonitorPlay, Plus, Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { getPresentationCardsForModule, getPresentationModule } from "@/lib/presentation-instruction-cards";
import type { PresentationCard, PresentationSlide } from "@/lib/presentation-instruction-cards";

type Feedback = {
  ok: boolean;
  messages: string[];
};

const emptySlide: PresentationSlide = { title: "", body: "", bullets: [], layout: "title-content" };

function normalise(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function validateDeck(card: PresentationCard, slides: PresentationSlide[], activeSlide: number, theme: string, slideNumbers: boolean): Feedback {
  const messages: string[] = [];
  const expected = card.expected;
  const selected = slides[expected.activeSlide ?? activeSlide] || slides[activeSlide];
  const allTitles = slides.map((slide) => normalise(slide.title));
  const allBodies = slides.map((slide) => normalise(slide.body)).join(" ");
  const allBullets = slides.flatMap((slide) => slide.bullets.map(normalise));
  const allNotes = slides.map((slide) => normalise(slide.notes || "")).join(" ");
  const allImages = slides.map((slide) => normalise(slide.imageAlt || ""));

  if (expected.minSlides && slides.length < expected.minSlides) messages.push(`Create at least ${expected.minSlides} slides.`);
  if (expected.layout && selected.layout !== expected.layout) messages.push(`Set the selected slide layout to ${expected.layout.replace("-", " ")}.`);
  if (expected.slideTitle && !allTitles.includes(normalise(expected.slideTitle))) messages.push(`Add the slide title ${expected.slideTitle}.`);
  expected.slideBodyIncludes?.forEach((text) => {
    if (!allBodies.includes(normalise(text))) messages.push(`Add this body text: ${text}`);
  });
  expected.bulletItems?.forEach((item) => {
    if (!allBullets.includes(normalise(item))) messages.push(`Add ${item} as a bullet point.`);
  });
  if (expected.theme && theme !== expected.theme) messages.push(`Apply the ${expected.theme} theme.`);
  if (expected.imageAlt && !allImages.includes(normalise(expected.imageAlt))) messages.push(`Insert the image with alt text: ${expected.imageAlt}`);
  if (expected.notesInclude && !allNotes.includes(normalise(expected.notesInclude))) messages.push(`Add speaker notes that include ${expected.notesInclude}.`);
  if (expected.slideNumbers && !slideNumbers) messages.push("Turn on slide numbers.");

  return {
    ok: messages.length === 0,
    messages: messages.length ? messages : ["Good work. The presentation matches the Apex final-result checks.", ...(card.teacherReview?.length ? ["Your teacher should now review layout quality and output evidence."] : [])]
  };
}

function themeClass(theme: string) {
  if (theme === "ocean") return "bg-ocean text-white";
  if (theme === "leaf") return "bg-leaf text-white";
  if (theme === "contrast") return "bg-ink text-white";
  return "bg-white text-ink";
}

export function PresentationLab({ moduleId }: { moduleId?: string }) {
  const cards = useMemo(() => getPresentationCardsForModule(moduleId), [moduleId]);
  const module = getPresentationModule(moduleId) || getPresentationModule(cards[0]?.moduleId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<PresentationSlide[]>(cards[0]?.starterDeck || [emptySlide]);
  const [theme, setTheme] = useState<"clean" | "ocean" | "leaf" | "contrast">("clean");
  const [slideNumbers, setSlideNumbers] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const card = cards[activeIndex];
  const currentComplete = card ? completed.includes(card.id) : false;
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;
  const selected = slides[activeSlide] || slides[0] || emptySlide;

  useEffect(() => {
    if (!card) return;
    setSlides(card.starterDeck?.map((slide) => ({ ...slide, bullets: [...slide.bullets] })) || [emptySlide]);
    setActiveSlide(0);
    setTheme("clean");
    setSlideNumbers(false);
    setFeedback(null);
  }, [card]);

  function updateSlide(patch: Partial<PresentationSlide>) {
    setSlides((items) => items.map((slide, index) => index === activeSlide ? { ...slide, ...patch } : slide));
  }

  function addSlide() {
    setSlides((items) => [...items, { ...emptySlide }]);
    setActiveSlide(slides.length);
  }

  function duplicateSlide() {
    setSlides((items) => [...items.slice(0, activeSlide + 1), { ...selected, bullets: [...selected.bullets] }, ...items.slice(activeSlide + 1)]);
    setActiveSlide(activeSlide + 1);
  }

  function deleteSlide() {
    if (slides.length === 1) return;
    setSlides((items) => items.filter((_, index) => index !== activeSlide));
    setActiveSlide((index) => Math.max(0, index - 1));
  }

  function setBullets(value: string) {
    updateSlide({ bullets: value.split("\n").map((item) => item.trim()).filter(Boolean) });
  }

  function checkWork() {
    if (!card) return;
    const result = validateDeck(card, slides, activeSlide, theme, slideNumbers);
    setFeedback(result);
    if (result.ok) setCompleted((items) => items.includes(card.id) ? items : [...items, card.id]);
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    setActiveIndex((index) => index + 1);
  }

  if (!card) return null;

  return (
    <div className="mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1700px] gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line p-5">
          <Link href="/subjects/ict/presentations" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
            <ArrowLeft size={16} aria-hidden="true" /> Presentation modules
          </Link>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
            <span className="text-sm font-semibold text-slate-600">{activeIndex + 1}/{cards.length}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{card.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm font-medium"><span>Progress</span><span>{completed.length}/{cards.length}</span></div>
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
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{card.supportDocument.map((line) => <p key={line}>{line}</p>)}</div>
          </section>
          <section className="rounded-lg border border-line bg-white p-4">
            <h3 className="font-bold">Steps</h3>
            <ol className="mt-3 space-y-3">{card.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol>
          </section>
          {card.teacherReview && <section className="rounded-lg border border-sky-200 bg-sky-50 p-4"><h3 className="font-bold">Teacher review</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">{card.teacherReview.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {feedback && <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3><ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">{feedback.messages.map((message) => <li key={message}>{message}</li>)}</ul></section>}
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3 border-t border-line p-5">
          <button type="button" onClick={checkWork} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90"><CheckCircle2 size={18} aria-hidden="true" /> Check final result</button>
          <button type="button" onClick={nextCard} disabled={!currentComplete || activeIndex === cards.length - 1} className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Next</button>
        </div>
      </aside>

      <section className="grid min-h-0 overflow-hidden rounded-lg border border-line bg-white shadow-sm lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <div className="min-h-0 border-r border-line bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Slides</h2>
            <button type="button" title="Add slide" onClick={addSlide} className="grid h-8 w-8 place-items-center rounded-md bg-ocean text-white"><Plus size={16} /></button>
          </div>
          <div className="mt-4 space-y-3 overflow-y-auto">
            {slides.map((slide, index) => (
              <button key={`${slide.title}-${index}`} type="button" onClick={() => setActiveSlide(index)} className={`block w-full rounded-lg border p-2 text-left ${index === activeSlide ? "border-ocean bg-white shadow-sm" : "border-line bg-white/70"}`}>
                <div className={`aspect-video rounded-md p-2 text-[10px] ${themeClass(theme)}`}>
                  <p className="line-clamp-2 font-bold">{slide.title || "Untitled slide"}</p>
                  <p className="mt-1 line-clamp-2 opacity-80">{slide.bullets[0] || slide.body || "Empty content"}</p>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">Slide {index + 1}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col bg-slate-100">
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-white p-3">
            <button type="button" onClick={addSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Plus size={16} /> New</button>
            <button type="button" onClick={duplicateSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Copy size={16} /> Duplicate</button>
            <button type="button" onClick={deleteSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Trash2 size={16} /> Delete</button>
            <label className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"><LayoutTemplate size={16} /> Layout
              <select value={selected.layout} onChange={(event) => updateSlide({ layout: event.target.value as PresentationSlide["layout"] })} className="rounded-md border border-line px-2 py-1 font-medium">
                <option value="title">Title</option>
                <option value="title-content">Title and content</option>
                <option value="two-content">Two content</option>
                <option value="image-content">Image and content</option>
                <option value="comparison">Comparison</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"><MonitorPlay size={16} /> Theme
              <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)} className="rounded-md border border-line px-2 py-1 font-medium">
                <option value="clean">Clean</option>
                <option value="ocean">Ocean</option>
                <option value="leaf">Leaf</option>
                <option value="contrast">Contrast</option>
              </select>
            </label>
            <label className="ml-auto inline-flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={slideNumbers} onChange={(event) => setSlideNumbers(event.target.checked)} /> Slide numbers</label>
          </div>
          <div className="grid flex-1 place-items-center overflow-auto p-8">
            <article className={`relative aspect-video w-full max-w-4xl rounded-lg p-10 shadow-soft ${themeClass(theme)}`}>
              {slideNumbers && <span className="absolute bottom-4 right-5 rounded bg-black/15 px-2 py-1 text-xs font-bold">{activeSlide + 1}</span>}
              <input value={selected.title} onChange={(event) => updateSlide({ title: event.target.value })} placeholder="Slide title" className="w-full bg-transparent text-4xl font-bold outline-none placeholder:opacity-60" />
              <textarea value={selected.body} onChange={(event) => updateSlide({ body: event.target.value })} placeholder="Subtitle or paragraph text" className="mt-5 min-h-20 w-full resize-none bg-transparent text-xl leading-8 outline-none placeholder:opacity-60" />
              <div className={`mt-4 grid gap-6 ${selected.layout === "two-content" || selected.layout === "comparison" ? "grid-cols-2" : "grid-cols-1"}`}>
                <ul className="list-disc space-y-2 pl-6 text-lg">{selected.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
                {(selected.layout === "image-content" || selected.imageAlt) && <div className="grid min-h-36 place-items-center rounded-lg border border-current/25 bg-white/15 p-4 text-center"><FileImage size={44} /><p className="mt-2 text-sm font-bold">{selected.imageAlt || "Image placeholder"}</p></div>}
              </div>
            </article>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto border-l border-line p-4">
          <h2 className="font-bold">Selected slide</h2>
          <label className="mt-4 block text-sm font-bold">Bullet points</label>
          <textarea value={selected.bullets.join("\n")} onChange={(event) => setBullets(event.target.value)} className="mt-2 h-32 w-full rounded-lg border border-line p-3 text-sm" placeholder="One bullet per line" />
          <button type="button" onClick={() => updateSlide({ imageAlt: "Apex study practice card", layout: "image-content" })} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ocean px-3 py-2 text-sm font-bold text-white"><FileImage size={16} /> Insert Apex image</button>
          <label className="mt-4 block text-sm font-bold">Image alt text</label>
          <input value={selected.imageAlt || ""} onChange={(event) => updateSlide({ imageAlt: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-3 text-sm" />
          <label className="mt-4 block text-sm font-bold">Speaker notes</label>
          <textarea value={selected.notes || ""} onChange={(event) => updateSlide({ notes: event.target.value })} className="mt-2 h-28 w-full rounded-lg border border-line p-3 text-sm" />
          <div className="mt-5 rounded-lg border border-line bg-mist p-3 text-sm leading-6 text-slate-700">
            <p className="font-bold text-ink"><ListPlus className="mr-2 inline" size={16} />Exam habit</p>
            <p className="mt-1">Use short bullets, keep objects aligned, and leave final output evidence for teacher review.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
