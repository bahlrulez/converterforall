import type { Metadata } from "next";

/**
 * Single source of truth for indexable pages in Phase 1 SEO turnaround.
 * Only these 34 canonical paths appear in sitemap.xml and receive index: true.
 * Every other route receives robots: { index: false, follow: false }.
 * Note: /unicode-to-raavi is excluded because it currently renders as a held
 * informational guide ("This tool is not available yet.") rather than a working tool.
 */
export const INDEXABLE_PATHS = [
  // Core & Hubs (8)
  "/",
  "/tools",
  "/category/exam",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",

  // Indian Exam & Photo Suite (6)
  "/exam-photo-resizer",
  "/exam-signature-resizer",
  "/photo-name-date-stamper",
  "/compress-pdf-100kb",
  "/image-dpi-converter",
  "/passport-photo-maker",

  // Indic Font Suite (11)
  "/unicode-to-krutidev",
  "/krutidev-to-unicode",
  "/asees-to-unicode",
  "/unicode-to-asees",
  "/anmollipi-to-unicode",
  "/satluj-to-unicode",
  "/unicode-to-satluj",
  "/joy-to-unicode",
  "/unicode-to-joy",
  "/font-detector",
  "/font-text-fixer",

  // Creator Video/Audio Suite (4)
  "/video-caption-generator",
  "/subtitle-converter",
  "/video-compressor",
  "/trim-audio",

  // On-Topic Blog Posts (5)
  "/blog/how-to-add-name-and-date-on-photo-for-ssc-upsc",
  "/blog/sarkari-exam-photo-signature-guidelines-rules",
  "/blog/how-to-fix-garbled-kruti-dev-chanakya-asees-font",
  "/blog/the-ultimate-guide-to-hindi-and-punjabi-font-conversion",
  "/blog/kruti-dev-font-showing-as-english-in-word",
] as const;

export const INDEXABLE_PATH_SET = new Set<string>(INDEXABLE_PATHS);

/** Normalize route paths to leading-slash format without trailing slash. */
export function normalizeAllowlistPath(path: string): string {
  const trimmed = (path || "").trim();
  if (!trimmed || trimmed === "/") return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, "") || "/";
}

/** Check whether a route path is in the indexable SEO allowlist. */
export function isIndexablePath(path: string): boolean {
  return INDEXABLE_PATH_SET.has(normalizeAllowlistPath(path));
}

/** Return standardized robots directives based on SEO allowlist membership. */
export function getRobotsForPath(path: string): NonNullable<Metadata["robots"]> {
  if (isIndexablePath(path)) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    };
  }

  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  };
}
