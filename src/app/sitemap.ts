import type { MetadataRoute } from "next";
import { databaseModules } from "@/lib/database-instruction-cards";
import { flowchartModules } from "@/lib/flowchart-instruction-cards";
import { presentationModules } from "@/lib/presentation-instruction-cards";
import { spreadsheetModules } from "@/lib/spreadsheet-instruction-cards";
import { websiteAuthoringModules } from "@/lib/website-authoring-instruction-cards";
import { wordProcessingModules } from "@/lib/word-processing-instruction-cards";

const siteUrl = "https://www.peakstudyhub.com";

const staticRoutes = [
  "",
  "/about",
  "/academies",
  "/contact",
  "/disclaimer",
  "/practice",
  "/pricing",
  "/privacy",
  "/subjects",
  "/subjects/ict/databases",
  "/subjects/ict/flowcharts",
  "/subjects/ict/presentations",
  "/subjects/ict/spreadsheets",
  "/subjects/ict/theory",
  "/subjects/ict/website-authoring",
  "/subjects/ict/word-processing",
  "/terms"
];

const dynamicRoutes = [
  ...databaseModules.map((module) => `/subjects/ict/databases/${module.id}`),
  ...flowchartModules.map((module) => `/subjects/ict/flowcharts/${module.id}`),
  ...presentationModules.map((module) => `/subjects/ict/presentations/${module.id}`),
  ...spreadsheetModules.map((module) => `/subjects/ict/spreadsheets/${module.id}`),
  ...websiteAuthoringModules.map((module) => `/subjects/ict/website-authoring/${module.id}`),
  ...wordProcessingModules.map((module) => `/subjects/ict/word-processing/${module.id}`)
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("/subjects/ict/") ? 0.8 : 0.6
  }));
}
