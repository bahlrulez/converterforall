import { collectSeoInventory } from "./inventory-collector";
import { inspectSeoSystem } from "./system-inspector";
import { CompleteSeoAuditDataset, SeoAuditSummary } from "../types";

export function runFullSeoAudit(): CompleteSeoAuditDataset {
  const inventory = collectSeoInventory();
  const systemInspection = inspectSeoSystem();

  let totalIndexablePages = 0;
  let totalNoindexPages = 0;
  let pagesMissingTitle = 0;
  let pagesMissingMetaDescription = 0;
  let pagesMissingH1 = 0;
  let pagesWithThinContent = 0;
  let pagesWithWeakInternalLinking = 0;
  let pagesMissingCanonical = 0;
  let pagesMissingBreadcrumbs = 0;
  let pagesMissingAppropriateStructuredData = 0;

  let renderedPageCount = 0;
  let totalRenderedWords = 0;
  let totalRenderedScore = 0;
  let canonicalCount = 0;
  let aliasCount = 0;

  const categoryBreakdown: Record<string, number> = {};
  const titlesMap: Record<string, string[]> = {};
  const descriptionsMap: Record<string, string[]> = {};

  for (const item of inventory) {
    if (item.isAlias) {
      aliasCount++;
    } else {
      canonicalCount++;
      renderedPageCount++;
      totalRenderedWords += item.wordCount;
      totalRenderedScore += item.seoHealthScore;

      // Rendered-page on-page SEO element validation
      if (!item.currentTitle || item.currentTitle.trim() === "") {
        pagesMissingTitle++;
      }
      if (!item.currentMetaDescription || item.currentMetaDescription.trim() === "") {
        pagesMissingMetaDescription++;
      }
      if (!item.currentH1 || item.currentH1.trim() === "") {
        pagesMissingH1++;
      }
      if (!item.canonicalUrl || item.canonicalUrl.trim() === "") {
        pagesMissingCanonical++;
      }
      if (!item.breadcrumbStructure || item.breadcrumbStructure.length === 0) {
        pagesMissingBreadcrumbs++;
      }
      if (!item.structuredDataTypes || item.structuredDataTypes.length === 0) {
        pagesMissingAppropriateStructuredData++;
      }
      if (item.isThinContent) {
        pagesWithThinContent++;
      }
    }

    // Indexability count (indexable vs noindex vs redirect)
    if (item.indexability === "indexable") {
      totalIndexablePages++;
    } else if (item.indexability === "noindex") {
      totalNoindexPages++;
    }

    // Category breakdown
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;

    // Weak Internal Linking (< 3 inbound links)
    if (item.incomingInternalLinkCount < 3) {
      pagesWithWeakInternalLinking++;
    }

    // Duplicate titles & descriptions tracking
    if (item.currentTitle) {
      if (!titlesMap[item.currentTitle]) titlesMap[item.currentTitle] = [];
      titlesMap[item.currentTitle].push(item.urlPath);
    }
    if (item.currentMetaDescription) {
      if (!descriptionsMap[item.currentMetaDescription]) descriptionsMap[item.currentMetaDescription] = [];
      descriptionsMap[item.currentMetaDescription].push(item.urlPath);
    }
  }

  // Find duplicate titles (title shared by > 1 page)
  const pagesWithDuplicateTitles: { title: string; count: number; slugs: string[] }[] = [];
  for (const [title, slugs] of Object.entries(titlesMap)) {
    if (slugs.length > 1) {
      pagesWithDuplicateTitles.push({ title, count: slugs.length, slugs });
    }
  }

  // Find duplicate meta descriptions (description shared by > 1 page)
  const pagesWithDuplicateDescriptions: { description: string; count: number; slugs: string[] }[] = [];
  for (const [desc, slugs] of Object.entries(descriptionsMap)) {
    if (slugs.length > 1) {
      pagesWithDuplicateDescriptions.push({ description: desc, count: slugs.length, slugs });
    }
  }

  const totalToolPagesDiscovered = inventory.length;
  // Averages are calculated across rendered pages so that 301 redirect aliases do not dilute word count or scores
  const averageWordCount = renderedPageCount > 0 ? Math.round(totalRenderedWords / renderedPageCount) : 0;
  const averageSeoScore = renderedPageCount > 0 ? Math.round(totalRenderedScore / renderedPageCount) : 0;

  const summary: SeoAuditSummary = {
    totalToolPagesDiscovered,
    totalCanonicalTools: canonicalCount,
    totalAliasRoutes: aliasCount,
    totalIndexablePages,
    totalNoindexPages,
    pagesMissingTitle,
    pagesMissingMetaDescription,
    pagesWithDuplicateTitles,
    pagesWithDuplicateDescriptions,
    pagesMissingH1,
    pagesWithThinContent,
    pagesWithWeakInternalLinking,
    pagesMissingCanonical,
    pagesMissingBreadcrumbs,
    pagesMissingAppropriateStructuredData,
    averageWordCount,
    categoryBreakdown,
    averageSeoScore
  };

  return {
    auditTimestamp: new Date().toISOString(),
    summary,
    systemInspection,
    inventory
  };
}
