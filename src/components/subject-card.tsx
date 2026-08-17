import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import type { SubjectArea } from "@/lib/types";
import { Card } from "./ui";

export function SubjectCard({ subject }: { subject: SubjectArea }) {
  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
          <BookOpenCheck size={22} aria-hidden="true" />
        </span>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-ink">{subject.title}</h2>
        <p className="mt-2 leading-6 text-slate-600">{subject.summary}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-600">
        {subject.focus.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
      <Link href={`/subjects/${subject.slug}`} className="mt-auto inline-flex items-center gap-2 font-semibold text-ocean">
        Open subject <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </Card>
  );
}
