import { notFound } from "next/navigation";
import { DatabaseLab } from "@/components/database-lab";
import { databaseModules, getDatabaseCardsForModule, getDatabaseModule } from "@/lib/database-instruction-cards";

type DatabaseModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return databaseModules.map((module) => ({ module: module.id }));
}

export default function DatabaseModulePage({ params }: DatabaseModulePageProps) {
  const module = getDatabaseModule(params.module);
  const cards = getDatabaseCardsForModule(params.module);

  if (!module || cards.length === 0) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <DatabaseLab moduleId={params.module} />
    </main>
  );
}
