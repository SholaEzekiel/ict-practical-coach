"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  Copy,
  FileImage,
  Layers,
  LayoutTemplate,
  ListPlus,
  MonitorPlay,
  Move,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Square,
  Trash2,
  Type
} from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { getPresentationCardsForModule, getPresentationModule } from "@/lib/presentation-instruction-cards";
import type { PresentationCard, PresentationObject, PresentationSlide } from "@/lib/presentation-instruction-cards";

type Feedback = {
  ok: boolean;
  messages: string[];
};

type MasterDesign = {
  enabled: boolean;
  footer: string;
  dateText: string;
  logoText: string;
  background: string;
  fontFamily: string;
};

const emptySlide: PresentationSlide = { title: "", body: "", bullets: [], layout: "title-content", objects: [] };

const defaultMaster: MasterDesign = {
  enabled: false,
  footer: "",
  dateText: "",
  logoText: "Peak Study",
  background: "#ffffff",
  fontFamily: "Arial"
};

const layoutOptions: NonNullable<PresentationSlide["layout"]>[] = ["title", "title-content", "two-content", "image-content", "comparison"];

function normalise(value = "") {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function objectId(type: PresentationObject["type"]) {
  return `${type}-${Math.random().toString(36).slice(2, 9)}`;
}

function titleObject(text: string): PresentationObject {
  return { id: objectId("title"), type: "title", text, x: 8, y: 9, width: 84, height: 13, fontSize: 34, fontFamily: "Arial", bold: true, align: "left", fill: "#14212b", layer: 5 };
}

function bodyObject(text: string): PresentationObject {
  return { id: objectId("body"), type: "body", text, x: 8, y: 27, width: 78, height: 18, fontSize: 19, fontFamily: "Arial", align: "left", fill: "#334155", layer: 4 };
}

function bulletsObject(items: string[]): PresentationObject {
  return { id: objectId("bullets"), type: "bullets", text: items.join("\n"), x: 10, y: 42, width: 58, height: 32, fontSize: 18, fontFamily: "Arial", align: "left", fill: "#334155", layer: 4 };
}

function imageObject(alt = "Uploaded image", src?: string): PresentationObject {
  return { id: objectId("image"), type: "image", alt, src, x: 58, y: 36, width: 30, height: 26, fill: "#e6f2f5", outline: "#7aa9b7", lineWidth: 2, layer: 3 };
}

function shapeObject(): PresentationObject {
  return { id: objectId("shape"), type: "shape", x: 62, y: 18, width: 24, height: 14, fill: "#e6f2f5", outline: "#0f6f8c", lineWidth: 2, layer: 2 };
}

function lineObject(): PresentationObject {
  return { id: objectId("line"), type: "line", x: 10, y: 82, width: 78, height: 1, outline: "#0f6f8c", lineWidth: 3, layer: 2 };
}

function slideObjects(slide: PresentationSlide): PresentationObject[] {
  if (slide.objects?.length) return slide.objects;
  const objects: PresentationObject[] = [];
  if (slide.title) objects.push(titleObject(slide.title));
  if (slide.body) objects.push(bodyObject(slide.body));
  if (slide.bullets.length) objects.push(bulletsObject(slide.bullets));
  if (slide.imageAlt) objects.push(imageObject(slide.imageAlt));
  return objects;
}

function normaliseSlide(slide: PresentationSlide): PresentationSlide {
  return { ...slide, bullets: [...slide.bullets], objects: slideObjects(slide).map((item) => ({ ...item })) };
}

function syncLegacyFields(slide: PresentationSlide): PresentationSlide {
  const objects = slide.objects || [];
  const title = objects.find((item) => item.type === "title")?.text ?? slide.title;
  const body = objects.find((item) => item.type === "body")?.text ?? slide.body;
  const bullets = objects.find((item) => item.type === "bullets")?.text?.split("\n").map((item) => item.trim()).filter(Boolean) ?? slide.bullets;
  const imageAlt = objects.find((item) => item.type === "image")?.alt ?? slide.imageAlt;
  return { ...slide, title, body, bullets, imageAlt };
}

function validateDeck(card: PresentationCard, slides: PresentationSlide[], activeSlide: number, theme: string, slideNumbers: boolean, master: MasterDesign): Feedback {
  const messages: string[] = [];
  const expected = card.expected;
  const prepared = slides.map(syncLegacyFields);
  const selected = prepared[expected.activeSlide ?? activeSlide] || prepared[activeSlide] || emptySlide;
  const allTitles = prepared.map((slide) => normalise(slide.title));
  const allBodies = prepared.map((slide) => normalise(slide.body)).join(" ");
  const allBullets = prepared.flatMap((slide) => slide.bullets.map(normalise));
  const allNotes = prepared.map((slide) => normalise(slide.notes || "")).join(" ");
  const allImages = prepared.flatMap((slide) => slide.objects || []).filter((item) => item.type === "image");
  const allTypes = prepared.flatMap((slide) => slide.objects || []).map((item) => item.type);
  const objectLabels: Record<PresentationObject["type"], string> = {
    title: "title text object",
    body: "text box object",
    bullets: "bullet list object",
    image: "image object",
    shape: "shape object",
    line: "line object"
  };

  if (expected.minSlides && prepared.length < expected.minSlides) messages.push(`Create at least ${expected.minSlides} slides.`);
  if (expected.layout && selected.layout !== expected.layout) messages.push(`Set the selected slide layout to ${expected.layout.replace("-", " ")}.`);
  if (expected.slideTitle && !allTitles.includes(normalise(expected.slideTitle))) messages.push(`Add the slide title ${expected.slideTitle}.`);
  expected.slideBodyIncludes?.forEach((text) => {
    if (!allBodies.includes(normalise(text))) messages.push(`Add this body text: ${text}`);
  });
  expected.bulletItems?.forEach((item) => {
    if (!allBullets.includes(normalise(item))) messages.push(`Add ${item} as a bullet point.`);
  });
  expected.objectTypes?.forEach((type) => {
    if (!allTypes.includes(type)) messages.push(`Add a ${objectLabels[type]}.`);
  });
  if (expected.theme && theme !== expected.theme) messages.push(`Apply the ${expected.theme} theme.`);
  if (expected.imageAlt && !allImages.some((item) => normalise(item.alt).includes(normalise(expected.imageAlt)))) messages.push(`Insert the image with alt text: ${expected.imageAlt}`);
  if (expected.notesInclude && !allNotes.includes(normalise(expected.notesInclude))) messages.push(`Add speaker notes that include ${expected.notesInclude}.`);
  if (expected.slideNumbers && !slideNumbers) messages.push("Turn on slide numbers.");
  if (expected.masterFooter && (!master.enabled || normalise(master.footer) !== normalise(expected.masterFooter))) messages.push(`Use Global Design and set the footer to ${expected.masterFooter}.`);
  if (expected.masterLogo && (!master.enabled || !normalise(master.logoText))) messages.push("Use Global Design to add a logo or repeated image.");

  return {
    ok: messages.length === 0,
    messages: messages.length ? messages : ["Good work. The presentation matches the Peak final-result checks.", ...(card.teacherReview?.length ? ["Your teacher should now review layout quality and output evidence."] : [])]
  };
}

function themeClass(theme: string) {
  if (theme === "ocean") return "bg-ocean text-white";
  if (theme === "leaf") return "bg-leaf text-white";
  if (theme === "contrast") return "bg-ink text-white";
  return "bg-white text-ink";
}

function objectStyle(item: PresentationObject, selected: boolean): React.CSSProperties {
  return {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.height}%`,
    transform: `rotate(${item.rotate || 0}deg)`,
    zIndex: item.layer || 1,
    fontSize: `${item.fontSize || 16}px`,
    fontFamily: item.fontFamily || "Arial",
    fontWeight: item.bold ? 800 : 500,
    fontStyle: item.italic ? "italic" : "normal",
    textAlign: item.align || "left",
    color: item.fill || "inherit",
    borderColor: selected ? "#0f6f8c" : item.outline || "transparent",
    borderWidth: selected || item.type === "shape" || item.type === "line" || item.type === "image" ? `${selected ? 2 : item.lineWidth || 1}px` : 0,
    background: item.type === "shape" || item.type === "image" ? item.fill || "transparent" : "transparent"
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderObjectForPreview(item: PresentationObject) {
  const style = [
    "position:absolute",
    `left:${item.x}%`,
    `top:${item.y}%`,
    `width:${item.width}%`,
    `height:${item.height}%`,
    `transform:rotate(${item.rotate || 0}deg)`,
    `z-index:${item.layer || 1}`,
    `font-size:${item.fontSize || 16}px`,
    `font-family:${item.fontFamily || "Arial"}`,
    `font-weight:${item.bold ? 800 : 500}`,
    `font-style:${item.italic ? "italic" : "normal"}`,
    `text-align:${item.align || "left"}`,
    `color:${item.fill || "#14212b"}`,
    `border:${item.type === "shape" || item.type === "line" || item.type === "image" ? `${item.lineWidth || 1}px solid ${item.outline || "transparent"}` : "0"}`,
    `background:${item.type === "shape" || item.type === "image" ? item.fill || "transparent" : "transparent"}`,
    "box-sizing:border-box",
    "overflow:hidden",
    "padding:10px"
  ].join(";");

  if (item.type === "image") {
    return item.src
      ? `<img style="${style};object-fit:contain;padding:0" src="${item.src}" alt="${escapeHtml(item.alt || "")}" />`
      : `<div style="${style};display:grid;place-items:center;text-align:center">${escapeHtml(item.alt || "Image placeholder")}</div>`;
  }
  if (item.type === "bullets") {
    const items = (item.text || "").split("\n").filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    return `<ul style="${style};padding-left:32px">${items}</ul>`;
  }
  if (item.type === "line") return `<div style="${style};padding:0"></div>`;
  if (item.type === "shape") return `<div style="${style}"></div>`;
  return `<div style="${style};white-space:pre-wrap">${escapeHtml(item.text || "")}</div>`;
}

export function PresentationLab({ moduleId }: { moduleId?: string }) {
  const cards = useMemo(() => getPresentationCardsForModule(moduleId), [moduleId]);
  const module = getPresentationModule(moduleId) || getPresentationModule(cards[0]?.moduleId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<PresentationSlide[]>(cards[0]?.starterDeck?.map(normaliseSlide) || [normaliseSlide(emptySlide)]);
  const [theme, setTheme] = useState<"clean" | "ocean" | "leaf" | "contrast">("clean");
  const [slideNumbers, setSlideNumbers] = useState(false);
  const [masterMode, setMasterMode] = useState(false);
  const [master, setMaster] = useState<MasterDesign>(defaultMaster);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const dragRef = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; item: PresentationObject; rect: DOMRect } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const card = cards[activeIndex];
  const currentComplete = card ? completed.includes(card.id) : false;
  const progress = cards.length ? (completed.length / cards.length) * 100 : 0;
  const selected = slides[activeSlide] || slides[0] || normaliseSlide(emptySlide);
  const selectedObject = selected.objects?.find((item) => item.id === selectedObjectId) || null;

  useEffect(() => {
    if (!card) return;
    setSlides(card.starterDeck?.map(normaliseSlide) || [normaliseSlide(emptySlide)]);
    setActiveSlide(0);
    setSelectedObjectId(null);
    setTheme("clean");
    setSlideNumbers(false);
    setMasterMode(false);
    setFeedback(null);
  }, [card]);

  function updateSlide(patch: Partial<PresentationSlide>) {
    setSlides((items) => items.map((slide, index) => index === activeSlide ? syncLegacyFields({ ...slide, ...patch }) : slide));
  }

  function updateObject(id: string, patch: Partial<PresentationObject>) {
    updateSlide({ objects: (selected.objects || []).map((item) => item.id === id ? { ...item, ...patch } : item) });
  }

  function addSlide() {
    setSlides((items) => [...items, normaliseSlide({ ...emptySlide })]);
    setActiveSlide(slides.length);
    setSelectedObjectId(null);
  }

  function duplicateSlide() {
    const copySlide = normaliseSlide(selected);
    setSlides((items) => [...items.slice(0, activeSlide + 1), copySlide, ...items.slice(activeSlide + 1)]);
    setActiveSlide(activeSlide + 1);
    setSelectedObjectId(null);
  }

  function deleteSlide() {
    if (slides.length === 1) return;
    setSlides((items) => items.filter((_, index) => index !== activeSlide));
    setActiveSlide((index) => Math.max(0, index - 1));
    setSelectedObjectId(null);
  }

  function addObject(object: PresentationObject) {
    updateSlide({ objects: [...(selected.objects || []), object] });
    setSelectedObjectId(object.id);
    setPropertiesOpen(true);
  }

  function removeObject() {
    if (!selectedObjectId) return;
    updateSlide({ objects: (selected.objects || []).filter((item) => item.id !== selectedObjectId) });
    setSelectedObjectId(null);
  }

  function layerObject(delta: number) {
    if (!selectedObject) return;
    updateObject(selectedObject.id, { layer: clamp((selectedObject.layer || 1) + delta, 1, 20) });
  }

  function handleImageUpload(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => addObject(imageObject(file.name.replace(/\.[^.]+$/, ""), String(reader.result)));
    reader.readAsDataURL(file);
  }

  function checkWork() {
    if (!card) return;
    const result = validateDeck(card, slides, activeSlide, theme, slideNumbers, master);
    setFeedback(result);
    if (result.ok) setCompleted((items) => items.includes(card.id) ? items : [...items, card.id]);
  }

  function nextCard() {
    if (!currentComplete || activeIndex === cards.length - 1) return;
    setActiveIndex((index) => index + 1);
  }

  function previousCard() {
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  function startDrag(event: React.PointerEvent, item: PresentationObject, mode: "move" | "resize") {
    const rect = event.currentTarget.closest("[data-slide-canvas]")?.getBoundingClientRect();
    if (!rect) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedObjectId(item.id);
    dragRef.current = { id: item.id, mode, startX: event.clientX, startY: event.clientY, item, rect };
  }

  function continueDrag(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaX = ((event.clientX - drag.startX) / drag.rect.width) * 100;
    const deltaY = ((event.clientY - drag.startY) / drag.rect.height) * 100;
    if (drag.mode === "move") {
      updateObject(drag.id, {
        x: clamp(drag.item.x + deltaX, 0, 100 - drag.item.width),
        y: clamp(drag.item.y + deltaY, 0, 100 - drag.item.height)
      });
    } else {
      updateObject(drag.id, {
        width: clamp(drag.item.width + deltaX, 6, 100 - drag.item.x),
        height: clamp(drag.item.height + deltaY, 4, 100 - drag.item.y)
      });
    }
  }

  function stopDrag() {
    dragRef.current = null;
  }

  function openPresentationPreview() {
    const preview = window.open("", "apex-presentation-preview");
    if (!preview) return;

    const renderedSlides = slides.map((slide, index) => {
      const slideStyle = [
        `background:${master.enabled && !slide.hideMaster ? master.background : "#ffffff"}`,
        `font-family:${master.enabled && !slide.hideMaster ? master.fontFamily : "Arial"}`,
        "position:relative",
        "aspect-ratio:16/9",
        "width:min(1100px,calc(100vw - 64px))",
        "margin:28px auto",
        "overflow:hidden",
        "box-shadow:0 20px 60px rgba(15,23,42,.2)",
        "border-radius:10px"
      ].join(";");
      const masterObjects = master.enabled && !slide.hideMaster
        ? `${master.logoText ? `<div class="master-logo">${escapeHtml(master.logoText)}</div>` : ""}${master.footer ? `<div class="master-footer">${escapeHtml(master.footer)}</div>` : ""}${master.dateText ? `<div class="master-date">${escapeHtml(master.dateText)}</div>` : ""}`
        : "";
      return `<section class="slide" style="${slideStyle}">${masterObjects}${(slide.objects || []).map(renderObjectForPreview).join("")}${slideNumbers ? `<span class="slide-number">${index + 1}</span>` : ""}</section>`;
    }).join("");

    preview.document.open();
    preview.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Peak presentation preview</title>
    <style>
      body{margin:0;background:#eef3f7;color:#14212b;font-family:Arial,sans-serif}
      .toolbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;background:white;border-bottom:1px solid #d9e2ea}
      .toolbar strong{font-size:18px}
      .toolbar button{border:0;border-radius:8px;background:#0f6f8c;color:white;padding:10px 16px;font-weight:700;cursor:pointer}
      .deck{padding:8px 0 36px}
      .master-logo{position:absolute;left:4%;top:4%;z-index:30;border-radius:6px;background:rgba(0,0,0,.1);padding:6px 12px;font-weight:800}
      .master-footer{position:absolute;bottom:4%;left:5%;z-index:30;font-size:12px;font-weight:700;opacity:.8}
      .master-date{position:absolute;bottom:4%;left:42%;z-index:30;font-size:12px;font-weight:700;opacity:.8}
      .slide-number{position:absolute;right:5%;bottom:4%;z-index:30;border-radius:4px;background:rgba(0,0,0,.12);padding:4px 8px;font-size:12px;font-weight:800}
      @media print{
        body{background:white}
        .toolbar{display:none}
        .deck{padding:0}
        .slide{width:100vw !important;margin:0 !important;box-shadow:none !important;border-radius:0 !important;page-break-after:always;break-after:page}
      }
    </style>
  </head>
  <body>
    <div class="toolbar"><strong>Peak presentation preview</strong><button onclick="window.print()">Print / Save as PDF</button></div>
    <main class="deck">${renderedSlides}</main>
  </body>
</html>`);
    preview.document.close();
  }

  if (!card) return null;

  const gridClass = instructionsOpen
    ? propertiesOpen ? "xl:grid-cols-[360px_170px_minmax(0,1fr)_300px]" : "xl:grid-cols-[360px_170px_minmax(0,1fr)_48px]"
    : propertiesOpen ? "xl:grid-cols-[48px_170px_minmax(0,1fr)_300px]" : "xl:grid-cols-[48px_170px_minmax(0,1fr)_48px]";

  return (
    <div className={`mx-auto grid h-[calc(100vh-112px)] min-h-0 max-w-[1800px] gap-3 ${gridClass}`}>
      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        {instructionsOpen ? (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <button type="button" onClick={() => setInstructionsOpen(false)} className="inline-flex items-center gap-2 text-sm font-bold text-ocean">
                <PanelLeftClose size={17} /> Collapse Instructions
              </button>
            </div>
            <div className="border-b border-line p-5">
              <Link href="/subjects/ict/presentations" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                <ArrowLeft size={16} aria-hidden="true" /> Presentation modules
              </Link>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{module?.title}</span>
                <span className="text-sm font-semibold text-slate-600">{activeIndex + 1}/{cards.length}</span>
              </div>
              <h1 className="mt-3 text-xl font-bold leading-7 text-ink">{card.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.scenario}</p>
              <div className="mt-3">
                <div className="mb-2 flex justify-between text-sm font-medium"><span>Progress</span><span>{completed.length}/{cards.length}</span></div>
                <ProgressBar value={progress} />
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <section className="rounded-lg border border-line bg-mist p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">Goal</p>
                <h2 className="mt-2 text-lg font-bold leading-7">{card.goal}</h2>
              </section>
              <section className="rounded-lg border border-line bg-white p-4">
                <h3 className="font-bold">Support document</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{card.supportDocument.map((line) => <p key={line}>{line}</p>)}</div>
              </section>
              <section className="rounded-lg border border-line bg-white p-4">
                <h3 className="font-bold">Steps</h3>
                <ol className="mt-3 space-y-3">{card.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ocean text-xs font-bold text-white">{index + 1}</span><span>{step}</span></li>)}</ol>
              </section>
              {feedback && <section className={`rounded-lg border p-4 ${feedback.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><h3 className="font-bold">{feedback.ok ? "Correct result" : "Check these points"}</h3><ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">{feedback.messages.map((message) => <li key={message}>{message}</li>)}</ul></section>}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setInstructionsOpen(true)} className="flex h-full items-center justify-center text-ocean" title="Show Instructions">
            <PanelLeftOpen size={22} />
          </button>
        )}
      </aside>

      <section className="min-h-0 overflow-y-auto rounded-lg border border-line bg-slate-50 p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Slides</h2>
          <button type="button" title="Add slide" onClick={addSlide} className="grid h-8 w-8 place-items-center rounded-md bg-ocean text-white"><Plus size={16} /></button>
        </div>
        <div className="mt-4 space-y-3">
          {slides.map((slide, index) => {
            const synced = syncLegacyFields(slide);
            return (
              <button key={`${synced.title}-${index}`} type="button" onClick={() => setActiveSlide(index)} className={`block w-full rounded-lg border p-2 text-left ${index === activeSlide ? "border-ocean bg-white shadow-sm" : "border-line bg-white/70"}`}>
                <div className={`relative aspect-video overflow-hidden rounded-md p-2 text-[9px] ${themeClass(theme)}`} style={master.enabled && !slide.hideMaster ? { background: master.background } : undefined}>
                  <p className="line-clamp-2 font-bold">{synced.title || "Untitled slide"}</p>
                  <p className="mt-1 line-clamp-2 opacity-80">{synced.bullets[0] || synced.body || "Empty content"}</p>
                  {slideNumbers && <span className="absolute bottom-1 right-1">{index + 1}</span>}
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">Slide {index + 1}</p>
              </button>
            );
          })}
        </div>
      </section>

      <main className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-white p-3">
          <button type="button" onClick={addSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Plus size={16} /> New</button>
          <button type="button" onClick={duplicateSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Copy size={16} /> Duplicate</button>
          <button type="button" onClick={deleteSlide} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><Trash2 size={16} /> Delete</button>
          <label className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"><LayoutTemplate size={16} /> Layout
            <select value={selected.layout} onChange={(event) => updateSlide({ layout: event.target.value as PresentationSlide["layout"] })} className="rounded-md border border-line px-2 py-1 font-medium">
              {layoutOptions.map((layout) => <option key={layout} value={layout}>{layout.replace("-", " ")}</option>)}
            </select>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"><Palette size={16} /> Theme
            <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)} className="rounded-md border border-line px-2 py-1 font-medium">
              <option value="clean">Clean</option>
              <option value="ocean">Ocean</option>
              <option value="leaf">Leaf</option>
              <option value="contrast">Contrast</option>
            </select>
          </label>
          <button type="button" onClick={() => setMasterMode((value) => !value)} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${masterMode ? "bg-ocean text-white" : "hover:bg-mist"}`}><Layers size={16} /> Global Design</button>
          <button type="button" onClick={openPresentationPreview} className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-mist"><MonitorPlay size={16} /> Preview Slideshow</button>
        </div>
        <div className="grid flex-1 place-items-center overflow-auto bg-slate-100 p-4">
          <article
            data-slide-canvas
            className={`relative aspect-video w-full max-w-5xl overflow-hidden rounded-lg shadow-soft ${themeClass(theme)}`}
            style={master.enabled && !selected.hideMaster ? { background: master.background, fontFamily: master.fontFamily } : undefined}
            onPointerMove={continueDrag}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
            onClick={() => setSelectedObjectId(null)}
          >
            {master.enabled && !selected.hideMaster && (
              <>
                {master.logoText && <div className="absolute left-[4%] top-[4%] rounded bg-black/10 px-3 py-1 text-sm font-bold">{master.logoText}</div>}
                {master.footer && <div className="absolute bottom-[4%] left-[5%] text-xs font-semibold opacity-80">{master.footer}</div>}
                {master.dateText && <div className="absolute bottom-[4%] left-[42%] text-xs font-semibold opacity-80">{master.dateText}</div>}
              </>
            )}
            {slideNumbers && <span className="absolute bottom-[4%] right-[5%] rounded bg-black/15 px-2 py-1 text-xs font-bold">{activeSlide + 1}</span>}
            {(selected.objects || []).sort((first, second) => (first.layer || 1) - (second.layer || 1)).map((item) => {
              const isSelected = item.id === selectedObjectId;
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className={`absolute cursor-move overflow-hidden rounded-sm border border-dashed p-2 outline-none ${isSelected ? "ring-2 ring-ocean" : ""}`}
                  style={objectStyle(item, isSelected)}
                  onPointerDown={(event) => startDrag(event, item, "move")}
                  onClick={(event) => { event.stopPropagation(); setSelectedObjectId(item.id); setPropertiesOpen(true); }}
                >
                  {item.type === "image" ? (
                    item.src ? <img src={item.src} alt={item.alt || ""} className="h-full w-full object-contain" draggable={false} /> : <div className="grid h-full place-items-center text-center text-sm font-bold"><FileImage size={34} /><span>{item.alt || "Image"}</span></div>
                  ) : item.type === "shape" ? (
                    <span className="sr-only">Shape</span>
                  ) : item.type === "line" ? (
                    <span className="sr-only">Line</span>
                  ) : item.type === "bullets" ? (
                    <ul className="list-disc space-y-1 pl-6">{(item.text || "").split("\n").filter(Boolean).map((line) => <li key={line}>{line}</li>)}</ul>
                  ) : (
                    <span className="whitespace-pre-wrap">{item.text}</span>
                  )}
                  {isSelected && <span className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl bg-ocean" onPointerDown={(event) => startDrag(event, item, "resize")} />}
                </div>
              );
            })}
            {masterMode && <div className="absolute left-3 top-3 rounded bg-ocean px-3 py-1 text-xs font-bold text-white">Editing Global Design</div>}
          </article>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-white p-3">
          <button type="button" onClick={checkWork} className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-3 font-bold text-white hover:bg-leaf/90"><CheckCircle2 size={18} aria-hidden="true" /> Check final result</button>
          <span className="mr-auto font-bold">{cards.filter((item) => completed.includes(item.id)).reduce((total, item) => total + item.points, 0)} points</span>
          <button type="button" onClick={previousCard} disabled={activeIndex === 0} className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-3 font-bold disabled:cursor-not-allowed disabled:text-slate-300"><ChevronLeft size={18} /> Previous</button>
          <button type="button" onClick={nextCard} disabled={!currentComplete || activeIndex === cards.length - 1} className="rounded-lg bg-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Next</button>
        </div>
      </main>

      <aside className="flex min-h-0 flex-col rounded-lg border border-line bg-white shadow-sm">
        {propertiesOpen ? (
          <>
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="font-bold">{masterMode ? "Global Design" : "Properties"}</h2>
              <button type="button" onClick={() => setPropertiesOpen(false)} title="Hide properties" className="text-ocean"><PanelRightClose size={18} /></button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              {masterMode ? (
                <>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={master.enabled} onChange={(event) => setMaster({ ...master, enabled: event.target.checked })} /> Apply global design</label>
                  <label className="block text-sm font-bold">Footer text<input value={master.footer} onChange={(event) => setMaster({ ...master, footer: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm" /></label>
                  <label className="block text-sm font-bold">Date/repeated text<input value={master.dateText} onChange={(event) => setMaster({ ...master, dateText: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm" /></label>
                  <label className="block text-sm font-bold">Logo text<input value={master.logoText} onChange={(event) => setMaster({ ...master, logoText: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm" /></label>
                  <label className="block text-sm font-bold">Background colour<input type="color" value={master.background} onChange={(event) => setMaster({ ...master, background: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-line p-1" /></label>
                  <label className="block text-sm font-bold">Font family<select value={master.fontFamily} onChange={(event) => setMaster({ ...master, fontFamily: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm"><option>Arial</option><option>Calibri</option><option>Verdana</option><option>Georgia</option></select></label>
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!selected.hideMaster} onChange={(event) => updateSlide({ hideMaster: event.target.checked })} /> Hide master on this slide</label>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => addObject(titleObject("New title"))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><Type size={16} /> Title</button>
                    <button type="button" onClick={() => addObject(bodyObject("New text box"))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><Type size={16} /> Text</button>
                    <button type="button" onClick={() => addObject(bulletsObject(["First point", "Second point"]))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><ListPlus size={16} /> Bullets</button>
                    <button type="button" onClick={() => addObject(shapeObject())} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><Square size={16} /> Shape</button>
                    <button type="button" onClick={() => addObject(lineObject())} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><Move size={16} /> Line</button>
                    <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-line p-2 text-sm font-bold"><FileImage size={16} /> Image</button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
                  {selectedObject ? (
                    <>
                      {selectedObject.type !== "image" && selectedObject.type !== "shape" && selectedObject.type !== "line" && <label className="block text-sm font-bold">Text<textarea value={selectedObject.text || ""} onChange={(event) => updateObject(selectedObject.id, { text: event.target.value })} className="mt-2 h-24 w-full rounded-lg border border-line p-2 text-sm" /></label>}
                      {selectedObject.type === "image" && <label className="block text-sm font-bold">Alt text<input value={selectedObject.alt || ""} onChange={(event) => updateObject(selectedObject.id, { alt: event.target.value })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm" /></label>}
                      <div className="grid grid-cols-2 gap-2">
                        <label className="text-xs font-bold">X<input type="number" value={Math.round(selectedObject.x)} onChange={(event) => updateObject(selectedObject.id, { x: Number(event.target.value) })} className="mt-1 w-full rounded border border-line p-2" /></label>
                        <label className="text-xs font-bold">Y<input type="number" value={Math.round(selectedObject.y)} onChange={(event) => updateObject(selectedObject.id, { y: Number(event.target.value) })} className="mt-1 w-full rounded border border-line p-2" /></label>
                        <label className="text-xs font-bold">Width<input type="number" value={Math.round(selectedObject.width)} onChange={(event) => updateObject(selectedObject.id, { width: Number(event.target.value) })} className="mt-1 w-full rounded border border-line p-2" /></label>
                        <label className="text-xs font-bold">Height<input type="number" value={Math.round(selectedObject.height)} onChange={(event) => updateObject(selectedObject.id, { height: Number(event.target.value) })} className="mt-1 w-full rounded border border-line p-2" /></label>
                      </div>
                      <label className="block text-sm font-bold">Font size<input type="number" value={selectedObject.fontSize || 16} onChange={(event) => updateObject(selectedObject.id, { fontSize: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-line p-2 text-sm" /></label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => updateObject(selectedObject.id, { bold: !selectedObject.bold })} className="rounded border border-line px-3 py-2 font-bold">B</button>
                        <button type="button" onClick={() => updateObject(selectedObject.id, { italic: !selectedObject.italic })} className="rounded border border-line px-3 py-2 italic">I</button>
                        <button type="button" onClick={() => updateObject(selectedObject.id, { align: "left" })} className="rounded border border-line px-3 py-2"><AlignLeft size={16} /></button>
                        <button type="button" onClick={() => updateObject(selectedObject.id, { align: "center" })} className="rounded border border-line px-3 py-2"><AlignCenter size={16} /></button>
                        <button type="button" onClick={() => updateObject(selectedObject.id, { align: "right" })} className="rounded border border-line px-3 py-2"><AlignRight size={16} /></button>
                      </div>
                      <label className="block text-sm font-bold">Fill/text colour<input type="color" value={selectedObject.fill || "#14212b"} onChange={(event) => updateObject(selectedObject.id, { fill: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-line p-1" /></label>
                      <label className="block text-sm font-bold">Outline colour<input type="color" value={selectedObject.outline || "#0f6f8c"} onChange={(event) => updateObject(selectedObject.id, { outline: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-line p-1" /></label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => layerObject(1)} className="rounded-lg border border-line p-2 text-sm font-bold">Forward</button>
                        <button type="button" onClick={() => layerObject(-1)} className="rounded-lg border border-line p-2 text-sm font-bold">Backward</button>
                      </div>
                      <button type="button" onClick={removeObject} className="w-full rounded-lg bg-rose-50 p-2 text-sm font-bold text-rose-700">Delete object</button>
                    </>
                  ) : (
                    <div className="rounded-lg border border-line bg-mist p-3 text-sm leading-6 text-slate-700">
                      Select an object on the slide to edit position, size, colours, alignment, and layer order.
                    </div>
                  )}
                  <label className="mt-4 block text-sm font-bold">Speaker notes</label>
                  <textarea value={selected.notes || ""} onChange={(event) => updateSlide({ notes: event.target.value })} className="mt-2 h-24 w-full rounded-lg border border-line p-3 text-sm" />
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={slideNumbers} onChange={(event) => setSlideNumbers(event.target.checked)} /> Slide numbers</label>
                </>
              )}
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setPropertiesOpen(true)} className="flex h-full items-center justify-center text-ocean" title="Show properties">
            <PanelRightOpen size={22} />
          </button>
        )}
      </aside>
    </div>
  );
}
