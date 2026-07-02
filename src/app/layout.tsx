import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRODUCT_NAME, SHORT_DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} | Independent IGCSE ICT Practical Practice`,
  description:
    "Independent exam-style ICT practical preparation for word processing, spreadsheets, databases, presentations, website authoring, and theory revision.",
  keywords: [
    "IGCSE ICT practical practice",
    "ICT practical skills",
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
