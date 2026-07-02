import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { PRODUCT_NAME } from "@/lib/constants";

const nav = [
  ["Academies", "/academies"],
  ["Student", "/dashboard/student"],
  ["Teacher", "/dashboard/teacher"],
  ["Pricing", "/pricing"],
  ["About", "/about"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink" aria-label={`${PRODUCT_NAME} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white">
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <span>{PRODUCT_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex" aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-ocean">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/academies/spreadsheets/lessons/club-attendance"
          className="hidden rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ocean/90 sm:inline-flex"
        >
          Start Practising Free
        </Link>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden" aria-label="Open navigation menu">
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
