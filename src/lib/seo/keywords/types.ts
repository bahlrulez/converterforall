export type SearchIntent = "transactional" | "informational" | "navigational" | "commercial";

export interface ToolKeywordTarget {
  toolSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  estimatedVolumeTier: "high" | "medium" | "niche";
  difficultyTier: "low" | "medium" | "high";
  competitorBenchmarkTarget: string;
}
