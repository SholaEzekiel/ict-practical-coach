import type { Editor } from "tinymce";

type Finding = { word: string; range: Range };
type Reply = { id: number; incorrect: string[]; suggestions: string[]; error?: string };
const labels: Record<string, string> = { "en-GB": "English (UK)", "en-US": "English (US)", "es-ES": "Spanish", "fr-FR": "French" };

export function attachWordSpelling(editor: Editor) {
  const worker = new Worker(new URL("./word-spelling.worker.ts", import.meta.url));
  const document = editor.getDoc();
  const window = editor.getWin();
  const highlights = (window as unknown as { CSS?: { highlights?: Map<string, unknown> } }).CSS?.highlights;
  const Highlight = (window as unknown as { Highlight?: new () => { add: (range: Range) => void } }).Highlight;
  const pending = new Map<number, { resolve: (reply: Reply) => void; reject: (error: Error) => void }>();
  let language = "en-GB";
  let generation = 0;
  let nextId = 0;
  let disposed = false;
  let workerError: Error | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let findings: Finding[] = [];
  const ignored = new Map<string, Set<string>>();
  worker.onmessage = (event: MessageEvent<Reply>) => {
    const request = pending.get(event.data.id);
    pending.delete(event.data.id);
    if (event.data.error) request?.reject(new Error(event.data.error));
    else request?.resolve(event.data);
  };
  worker.onerror = () => {
    workerError = new Error("The spelling checker could not start. Reload the page to retry.");
    pending.forEach(request => request.reject(workerError!));
    pending.clear();
  };
  function request(words: string[], suggest?: string) {
    return new Promise<Reply>((resolve, reject) => {
      if (workerError) { reject(workerError); return; }
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      worker.postMessage({ id, language, words, suggest });
    });
  }
  function clear() {
    findings = [];
    highlights?.delete("peak-spelling");
  }
  function words() {
    const result: Finding[] = [];
    const walker = document.createTreeWalker(editor.getBody(), NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('[data-spellcheck-ignore="true"], [contenteditable="false"], code, pre, script, style')) continue;
      for (const match of (node.textContent || "").matchAll(/\p{L}+(?:['\u2019]\p{L}+)*/gu)) {
        if (match[0].length < 2 || /^[A-Z]{2,}$/.test(match[0]) || ignored.get(language)?.has(match[0].toLocaleLowerCase(language))) continue;
        const range = document.createRange();
        range.setStart(node, match.index!);
        range.setEnd(node, match.index! + match[0].length);
        result.push({ word: match[0], range });
      }
    }
    return result;
  }
  async function scan(dialog = false) {
    clearTimeout(timer);
    const version = ++generation;
    const candidates = words();
    try {
      const reply = await request([...new Set(candidates.map(item => item.word))]);
      if (disposed || version !== generation) return;
      const incorrect = new Set(reply.incorrect);
      findings = candidates.filter(item => incorrect.has(item.word));
      if (highlights && Highlight) {
        const highlight = new Highlight();
        findings.forEach(item => highlight.add(item.range));
        highlights.set("peak-spelling", highlight);
      }
      if (dialog) await showFinding();
    } catch (error) {
      if (!disposed && version === generation) editor.notificationManager.open({ type: "error", text: error instanceof Error ? error.message : "Spelling check failed." });
    }
  }
  async function showFinding() {
    const finding = findings[0];
    if (!finding) {
      editor.windowManager.alert(`No spelling errors found using ${labels[language]}.`);
      return;
    }
    const checkedLanguage = language;
    const reply = await request([], finding.word);
    if (disposed || checkedLanguage !== language || !finding.range.startContainer.isConnected) return;
    editor.selection.setRng(finding.range);
    editor.selection.scrollIntoView();
    editor.windowManager.open({
      title: `Spelling - ${labels[language]}`,
      body: { type: "panel", items: [
        { type: "htmlpanel", html: `<p>Not in dictionary: <strong>${editor.dom.encode(finding.word)}</strong></p>` },
        ...(reply.suggestions.length ? [{ type: "selectbox" as const, name: "suggestion", label: "Suggestions", items: reply.suggestions.map(value => ({ text: value, value })) }] : []),
        { type: "input", name: "replacement", label: "Replace with" }
      ] },
      initialData: { replacement: reply.suggestions[0] || finding.word, suggestion: reply.suggestions[0] || "" },
      onChange: (dialog, details) => { if (details.name !== "suggestion") return; const selected = dialog.getData().suggestion; if (selected) dialog.setData({ replacement: selected }); },
      buttons: [{ type: "cancel", text: "Close" }, { type: "custom", name: "ignore", text: "Ignore all" }, { type: "submit", text: "Replace", primary: true }],
      onAction: (dialog, details) => {
        if (details.name !== "ignore") return;
        ignore(finding.word);
        dialog.close();
        void scan(true);
      },
      onSubmit: dialog => {
        const replacement = dialog.getData().replacement.trim();
        if (!replacement || !finding.range.startContainer.isConnected || finding.range.toString() !== finding.word) return;
        editor.undoManager.transact(() => {
          editor.selection.setRng(finding.range);
          editor.insertContent(editor.dom.encode(replacement));
        });
        editor.nodeChanged();
        editor.dispatch("change");
        dialog.close();
        void scan(true);
      }
    });
  }
  function ignore(word: string) {
    if (!ignored.has(language)) ignored.set(language, new Set());
    ignored.get(language)!.add(word.toLocaleLowerCase(language));
  }
  function schedule() {
    generation += 1;
    clear();
    clearTimeout(timer);
    timer = setTimeout(() => { void scan(); }, 700);
  }
  editor.on("input change Undo Redo SetContent", schedule);
  return {
    setLanguage(value: string) {
      language = labels[value] ? value : "en-GB";
      editor.getBody().lang = language;
      editor.getBody().spellcheck = false;
      document.documentElement.lang = language;
      editor.dispatch("SpellingLanguageChange");
      schedule();
    },
    check: () => { void scan(true); },
    ignoreSelection: () => {
      const selected = editor.selection.getContent({ format: "text" }).trim();
      if (!selected) { editor.windowManager.alert("Select a word in the document first."); return; }
      ignore(selected);
      schedule();
    },
    dispose() {
      disposed = true;
      clearTimeout(timer);
      clear();
      editor.off("input change Undo Redo SetContent", schedule);
      worker.terminate();
      pending.forEach(request => request.reject(new Error("Editor closed")));
      pending.clear();
    }
  };
}
