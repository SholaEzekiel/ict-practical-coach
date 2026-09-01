import { notFound } from "next/navigation";
import { FlowchartLab } from "@/components/flowchart-lab";
import { flowchartModules, getFlowchartModule } from "@/lib/flowchart-instruction-cards";

type FlowchartModulePageProps = {
  params: {
    module: string;
  };
};

export function generateStaticParams() {
  return flowchartModules.map((module) => ({ module: module.id }));
}

export default function FlowchartModulePage({ params }: FlowchartModulePageProps) {
  const module = getFlowchartModule(params.module);

  if (!module) {
    notFound();
  }

  return (
    <main className="bg-mist px-4 py-4 sm:px-6 lg:px-8">
      <FlowchartLab moduleId={params.module} />
    </main>
  );
}
