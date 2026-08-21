import { notFound } from "next/navigation";
import { WebsiteAuthoringLab } from "@/components/website-authoring-lab";
import { getWebsiteAuthoringCardsForModule, getWebsiteAuthoringModule, websiteAuthoringModules } from "@/lib/website-authoring-instruction-cards";

type WebsiteAuthoringModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return websiteAuthoringModules.map((module) => ({ module: module.id }));
}

export default function WebsiteAuthoringModulePage({ params }: WebsiteAuthoringModulePageProps) {
  const module = getWebsiteAuthoringModule(params.module);
  const cards = getWebsiteAuthoringCardsForModule(params.module);

  if (!module || cards.length === 0) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <WebsiteAuthoringLab moduleId={params.module} />
    </main>
  );
}
