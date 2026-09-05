export interface SeoScoreBreakdown {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  issues: string[];
}

export function calculateToolSeoScore(params: {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  isAlias: boolean;
  wordCount: number;
  isThinContent: boolean;
  incomingLinkCount: number;
  hasBreadcrumbs: boolean;
  hasStructuredData: boolean;
}): SeoScoreBreakdown {
  let score = 100;
  const issues: string[] = [];

  // Title validation
  if (!params.title) {
    score -= 25;
    issues.push("Critical: Page is missing a Title tag.");
  } else {
    if (params.title.length < 30) {
      score -= 5;
      issues.push("Title tag is too short (< 30 characters).");
    } else if (params.title.length > 70) {
      score -= 5;
      issues.push("Title tag may be truncated in SERPs (> 70 characters).");
    }
  }

  // Meta Description validation
  if (!params.metaDescription) {
    score -= 20;
    issues.push("Critical: Page is missing a Meta Description.");
  } else {
    if (params.metaDescription.length < 70) {
      score -= 5;
      issues.push("Meta description is brief (< 70 characters).");
    } else if (params.metaDescription.length > 175) {
      score -= 5;
      issues.push("Meta description is long (> 175 characters) and may truncate.");
    }
  }

  // Canonical tag
  if (!params.canonicalUrl) {
    score -= 20;
    issues.push("Critical: Missing canonical URL definition.");
  } else if (params.isAlias) {
    score -= 10;
    issues.push("Alias route: Should 301 redirect or point canonical directly to target tool.");
  }

  // Content depth & Thin content
  if (params.isThinContent) {
    score -= 20;
    issues.push("Thin Content Alert: Visible copy relies heavily on generic boilerplate or is under 250 words.");
  } else if (params.wordCount < 350) {
    score -= 8;
    issues.push(`Moderate Content Depth: Word count is ${params.wordCount} words (recommendation: 450+ words).`);
  }

  // Internal Link equity
  if (params.incomingLinkCount < 2) {
    score -= 15;
    issues.push(`Orphan / Low Link Equity: Only ${params.incomingLinkCount} incoming internal links.`);
  } else if (params.incomingLinkCount < 4) {
    score -= 5;
    issues.push(`Weak Internal Linking: Only ${params.incomingLinkCount} incoming internal links.`);
  }

  // Structured Data & Breadcrumbs
  if (!params.hasStructuredData) {
    score -= 10;
    issues.push("Missing SoftwareApplication / Utility structured data schema.");
  }
  if (!params.hasBreadcrumbs) {
    score -= 5;
    issues.push("Missing BreadcrumbList schema.");
  }

  // Clamp score
  const finalScore = Math.max(0, Math.min(100, score));

  let grade: "A" | "B" | "C" | "D" | "F" = "F";
  if (finalScore >= 90) grade = "A";
  else if (finalScore >= 80) grade = "B";
  else if (finalScore >= 70) grade = "C";
  else if (finalScore >= 60) grade = "D";

  return {
    score: finalScore,
    grade,
    issues
  };
}
