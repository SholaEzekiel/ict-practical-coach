import { notFound } from "next/navigation";
import { PresentationLab } from "@/components/presentation-lab";
import { getPresentationCardsForModule, getPresentationModule, presentationModules } from "@/lib/presentation-instruction-cards";

type PresentationModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return presentationModules.map((module) => ({ module: module.id }));
}

export default function PresentationModulePage({ params }: PresentationModulePageProps) {
  const module = getPresentationModule(params.module);
  const cards = getPresentationCardsForModule(params.module);

  if (!module || cards.length === 0) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <PresentationLab moduleId={params.module} />
    </main>
  );
}
