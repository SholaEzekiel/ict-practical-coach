import Link from "next/link";
import { ChevronDown, GraduationCap } from "lucide-react";
import { PRODUCT_NAME } from "@/lib/constants";

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
        <nav className="hidden items-center gap-5 text-sm text-slate-700 md:flex" aria-label="Primary navigation">
          <Link href="/" className="rounded-lg px-2 py-2 font-medium hover:text-ocean">
            Home
          </Link>
          <div className="group relative">
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-2 font-medium hover:text-ocean" type="button">
              Subjects <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 w-64 rounded-lg border border-line bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
              <Link href="/subjects/ict/spreadsheets" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Spreadsheets
              </Link>
              <Link href="/subjects/ict/word-processing" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Word Processing
              </Link>
              <Link href="/subjects/ict/databases" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Databases
              </Link>
              <Link href="/subjects/ict/presentations" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Presentations
              </Link>
              <Link href="/subjects/ict/website-authoring" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Website Authoring
              </Link>
              <Link href="/subjects/ict/flowcharts" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Flowcharts
              </Link>
              <Link href="/subjects/ict/theory" className="block rounded-md px-3 py-2 hover:bg-mist">
                ICT Theory
              </Link>
              <Link href="/subjects/business" className="block rounded-md px-3 py-2 hover:bg-mist">
                Business
              </Link>
            </div>
          </div>
          <Link href="/about" className="rounded-lg px-2 py-2 font-medium hover:text-ocean">
            About
          </Link>
          <Link href="/contact" className="rounded-lg px-2 py-2 font-medium hover:text-ocean">
            Contact
          </Link>
        </nav>
        <Link
          href="/subjects"
          className="rounded-lg bg-ocean px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ocean/90"
        >
          Start Practice
        </Link>
      </div>
    </header>
  );
}
