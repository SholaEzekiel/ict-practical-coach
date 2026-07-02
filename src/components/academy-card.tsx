import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Academy } from "@/lib/types";
import { Card, Pill } from "./ui";

export function AcademyCard({ academy }: { academy: Academy }) {
  const Icon = academy.icon;
  const availableLessons = academy.lessons.filter((lesson) => lesson.available).length;

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-lg ${academy.color} text-white`}>
          <Icon size={22} aria-hidden="true" />
        </span>
        <Pill>{availableLessons} sample lesson{availableLessons === 1 ? "" : "s"}</Pill>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-ink">{academy.title}</h3>
        <p className="mt-2 leading-6 text-slate-600">{academy.summary}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-600">
        {academy.outcomes.map((outcome) => (
          <li key={outcome}>• {outcome}</li>
        ))}
      </ul>
      <Link href={`/academies/${academy.slug}`} className="mt-auto inline-flex items-center gap-2 font-semibold text-ocean">
        Open academy <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </Card>
  );
}
