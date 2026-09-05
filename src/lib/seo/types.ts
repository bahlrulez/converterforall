export type SeoIndexability = "indexable" | "noindex" | "canonicalized-alias";

export type ToolType = 
  | "converter" 
  | "calculator" 
  | "detector" 
  | "normalizer" 
  | "cleaner" 
  | "editor" 
  | "generator" 
  | "scanner" 
  | "compressor" 
  | "utility";

export type ProcessingType = 
  | "client-side (browser WASM/JS)" 
  | "client-side (WebGPU/AI)" 
  | "client-side (Canvas/DOM)" 
  | "hybrid (client-side + ephemeral cloud)";

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface FaqSection {
  title: string;
  contentSnippet: string;
  questionCount: number;
}

export interface InternalLinkItem {
  targetSlug: string;
  targetUrl: string;
  anchorText: string;
  sourceType: "header" | "footer" | "homepage" | "category" | "related-tools" | "blog";
}

export interface ToolSeoInventoryItem {
  // Identity & Route
  toolName: string;
  urlPath: string;
  isAlias: boolean;
  canonicalTargetSlug?: string;
  canonicalUrl: string;
  category: string;
  subCategory?: string;
  toolType: ToolType;

  // Conversion Technical Details
  primaryConversionDirection: string;
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
  requiresFileUpload: boolean;
  processingLocation: ProcessingType;
  isFunctional: boolean;

  // On-Page SEO Elements
  currentH1: string;
  currentTitle: string;
  currentMetaDescription: string;
  indexability: SeoIndexability;
  robotsDirectives: string;
  structuredDataTypes: string[];
  breadcrumbStructure: BreadcrumbItem[];

  // Content Quality & Uniqueness
  wordCount: number;
  introductoryContent: string;
  faqSections: FaqSection[];
  hasUniqueSeoContent: boolean;
  isThinContent: boolean;
  thinContentReason?: string;

  // Internal Link Graph
  incomingInternalLinks: InternalLinkItem[];
  incomingInternalLinkCount: number;
  outgoingInternalLinks: { targetUrl: string; anchorText: string }[];
  outgoingInternalLinkCount: number;
  relatedTools: string[];

  // Scoring
  seoHealthScore: number; // 0 - 100
  issues: string[];
}

export interface SystemSeoInspection {
  sitemap: {
    totalUrls: number;
    urlCountsByType: {
      baseRoutes: number;
      categoryRoutes: number;
      toolRoutes: number;
      blogRoutes: number;
    };
    hasSitemapXml: boolean;
    issues: string[];
  };
  robotsTxt: {
    isCrawlerAllowed: boolean;
    disallowedPaths: string[];
    sitemapUrl?: string;
    issues: string[];
  };
  canonicalStrategy: {
    baseUrl: string;
    isSelfReferentialCanonical: boolean;
    handlesAliasesCorrectly: boolean;
    issues: string[];
  };
  metadataGeneration: {
    hasMetadataBase: boolean;
    titleTemplate: string;
    hasOpenGraph: boolean;
    hasTwitterCard: boolean;
    issues: string[];
  };
  schemaGeneration: {
    hasOrganizationSchema: boolean;
    hasWebSiteSchema: boolean;
    hasBreadcrumbListSchema: boolean;
    hasSoftwareApplicationSchema: boolean;
    issues: string[];
  };
  analyticsAndSearchConsole: {
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
    vercelAnalyticsEnabled: boolean;
    issues: string[];
  };
}

export interface SeoAuditSummary {
  totalToolPagesDiscovered: number;
  totalCanonicalTools: number;
  totalAliasRoutes: number;
  totalIndexablePages: number;
  totalNoindexPages: number;
  pagesMissingTitle: number;
  pagesMissingMetaDescription: number;
  pagesWithDuplicateTitles: { title: string; count: number; slugs: string[] }[];
  pagesWithDuplicateDescriptions: { description: string; count: number; slugs: string[] }[];
  pagesMissingH1: number;
  pagesWithThinContent: number;
  pagesWithWeakInternalLinking: number;
  pagesMissingCanonical: number;
  pagesMissingBreadcrumbs: number;
  pagesMissingAppropriateStructuredData: number;
  averageWordCount: number;
  categoryBreakdown: Record<string, number>;
  averageSeoScore: number;
}

export interface CompleteSeoAuditDataset {
  auditTimestamp: string;
  summary: SeoAuditSummary;
  systemInspection: SystemSeoInspection;
  inventory: ToolSeoInventoryItem[];
}
