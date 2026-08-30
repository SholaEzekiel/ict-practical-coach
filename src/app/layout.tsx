import type { Metadata } from "next";
import "@univerjs/preset-sheets-core/lib/index.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRODUCT_NAME, SHORT_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} | Independent ICT Skills Practice`,
  description:
    "Independent exam-style study practice for ICT practical skills, theory revision, and future Business practice.",
  keywords: [
    "ICT skills practice",
    "international exam ICT practical practice",
    "ICT practical skills",
    "business studies practice",
    "spreadsheet practice",
    "database practice",
    "presentation practice",
    "website authoring practice",
    "exam-style ICT tasks"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter disclaimer={SHORT_DISCLAIMER} />
        </div>
      </body>
    </html>
  );
}

