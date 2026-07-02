import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/constants";

export function SiteFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold text-ink">{PRODUCT_NAME}</p>
          <p className="mt-2 max-w-3xl leading-6">{disclaimer}</p>
          <p className="mt-3">Contact: hello@example.com</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          <Link href="/about" className="hover:text-ocean">About</Link>
          <Link href="/terms" className="hover:text-ocean">Terms</Link>
          <Link href="/privacy" className="hover:text-ocean">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-ocean">Disclaimer</Link>
        </div>
        <p className="md:col-span-2">Copyright {new Date().getFullYear()} {PRODUCT_NAME}. Original educational materials.</p>
      </div>
    </footer>
  );
}
