import { notFound } from "next/navigation";
import { WordProcessingLab } from "@/components/word-processing-lab";
import { getWordProcessingCardsForModule, getWordProcessingModule, wordProcessingModules } from "@/lib/word-processing-instruction-cards";

type WordProcessingModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return wordProcessingModules.map((module) => ({ module: module.id }));
}

export default function WordProcessingModulePage({ params }: WordProcessingModulePageProps) {
  const module = getWordProcessingModule(params.module);
  const cards = getWordProcessingCardsForModule(params.module);

  if (!module || cards.length === 0) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <WordProcessingLab moduleId={params.module} />
    </main>
  );
}
