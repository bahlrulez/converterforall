import { ToolKeywordTarget, SearchIntent } from "./types";

export function getKeywordTargetForTool(slug: string, title: string, category: string): ToolKeywordTarget {
  const normalizedTitle = title.toLowerCase();
  
  let primaryKeyword = title.toLowerCase().replace(/converter|free|online|\(|\)|\[|\]/g, "").trim();
  if (!primaryKeyword) primaryKeyword = slug.replace(/-/g, " ");

  // Deduce search intent
  let searchIntent: SearchIntent = "transactional";
  if (slug.startsWith("what-is") || slug.includes("how-to") || slug.includes("detector")) {
    searchIntent = "informational";
  }

  // Deduce volume tier
  let volumeTier: "high" | "medium" | "niche" = "niche";
  if (
    slug.includes("pdf") || 
    slug.includes("background") || 
    slug.includes("mp4") || 
    slug.includes("mp3") || 
    slug.includes("krutidev") || 
    slug.includes("compress")
  ) {
    volumeTier = "high";
  } else if (category === "image" || category === "document" || category === "video") {
    volumeTier = "medium";
  }

  // Secondary keywords
  const secondaryKeywords = [
    `${primaryKeyword} online free`,
    `free ${primaryKeyword}`,
    `${primaryKeyword} no upload`,
    `private ${primaryKeyword}`,
    `${primaryKeyword} without watermark`,
  ];

  return {
    toolSlug: slug,
    primaryKeyword,
    secondaryKeywords,
    searchIntent,
    estimatedVolumeTier: volumeTier,
    difficultyTier: volumeTier === "high" ? "high" : "medium",
    competitorBenchmarkTarget: category === "document" ? "iLovePDF / Smallpdf" : category === "image" ? "TinyPNG / Remove.bg" : "CloudConvert"
  };
}
