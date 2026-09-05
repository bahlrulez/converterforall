export interface CompetitorBenchmark {
  competitorName: string;
  domain: string;
  primaryNiche: string;
  avgWordCountPerTool: number;
  schemaImplemented: string[];
  weaknessesToExploit: string[];
  converterForAllAdvantage: string;
}

export const COMPETITOR_BENCHMARKS: Record<string, CompetitorBenchmark> = {
  "ilovepdf": {
    competitorName: "iLovePDF",
    domain: "ilovepdf.com",
    primaryNiche: "PDF Utilities",
    avgWordCountPerTool: 650,
    schemaImplemented: ["SoftwareApplication", "HowTo", "FAQPage", "BreadcrumbList"],
    weaknessesToExploit: [
      "Uploads user files to cloud servers",
      "Strict file size limits on free tier",
      "Aggressive upsells to premium plans"
    ],
    converterForAllAdvantage: "100% on-device WebAssembly processing with zero cloud uploads and no file limits."
  },
  "cloudconvert": {
    competitorName: "CloudConvert",
    domain: "cloudconvert.com",
    primaryNiche: "General File Conversions",
    avgWordCountPerTool: 420,
    schemaImplemented: ["SoftwareApplication", "BreadcrumbList"],
    weaknessesToExploit: [
      "Limits free conversions to 25 per day",
      "Uploads files to remote servers",
      "Long conversion queues during peak hours"
    ],
    converterForAllAdvantage: "Unlimited daily conversions running directly in the user's browser."
  },
  "tinypng": {
    competitorName: "TinyPNG",
    domain: "tinypng.com",
    primaryNiche: "Image Compression",
    avgWordCountPerTool: 380,
    schemaImplemented: ["SoftwareApplication", "FAQPage"],
    weaknessesToExploit: [
      "Uploads images across network",
      "5MB size limit on free tier",
      "Limited batch size without subscription"
    ],
    converterForAllAdvantage: "Browser-based Canvas and WASM compression with no upload lag or size quotas."
  },
  "removebg": {
    competitorName: "Remove.bg",
    domain: "remove.bg",
    primaryNiche: "AI Background Removal",
    avgWordCountPerTool: 850,
    schemaImplemented: ["SoftwareApplication", "FAQPage", "BreadcrumbList", "Organization"],
    weaknessesToExploit: [
      "Watermarks or downscales free cutouts to preview resolution",
      "Requires paid credits for full-resolution downloads",
      "Stores images temporarily in cloud"
    ],
    converterForAllAdvantage: "Free full-resolution cutouts using in-browser ISNet WebGPU hardware acceleration."
  },
  "indicfonts": {
    competitorName: "Wordinzi / Aksharmala",
    domain: "wordinzi.com",
    primaryNiche: "Indic Legacy to Unicode Font Conversion",
    avgWordCountPerTool: 550,
    schemaImplemented: ["SoftwareApplication", "FAQPage"],
    weaknessesToExploit: [
      "Cluttered with intrusive pop-up ads",
      "Outdated non-responsive UI",
      "Lacks modern privacy transparency"
    ],
    converterForAllAdvantage: "Modern, clean, responsive UI with zero-ad clutter and instant client-side typing conversion."
  }
};
