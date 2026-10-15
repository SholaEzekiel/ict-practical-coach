import nspell from "nspell";

const dictionaries = new Map<string, Promise<ReturnType<typeof nspell>>>();
const languages = new Set(["en-GB", "en-US", "es-ES", "fr-FR"]);
async function dictionary(language: string) {
  if (!languages.has(language)) throw new Error("Unsupported spelling language");
  if (!dictionaries.has(language)) {
    const pending = Promise.all(["aff", "dic"].map(async extension => {
      const response = await fetch(`/dictionaries/${language}/index.${extension}`);
      if (!response.ok) throw new Error("Could not load the spelling dictionary. Check your connection and try again.");
      return response.text();
    })).then(([aff, dic]) => nspell(aff, dic));
    dictionaries.set(language, pending);
    pending.catch(() => dictionaries.delete(language));
  }
  return dictionaries.get(language)!;
}

self.onmessage = async (event: MessageEvent<{ id: number; language: string; words: string[]; suggest?: string }>) => {
  const { id, language, words, suggest } = event.data;
  try {
    const spell = await dictionary(language);
    self.postMessage({ id, incorrect: words.filter(word => !spell.correct(word.replaceAll("\u2019", "'"))), suggestions: suggest ? spell.suggest(suggest.replaceAll("\u2019", "'")).slice(0, 6) : [] });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : "Spelling check failed." });
  }
};
