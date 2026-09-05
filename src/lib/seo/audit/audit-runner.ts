import { collectSeoInventory } from "./inventory-collector";
import { inspectSeoSystem } from "./system-inspector";
import { CompleteSeoAuditDataset, SeoAuditSummary, ToolSeoInventoryItem } from "../types";

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

  let totalWords = 0;
  let totalScore = 0;
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
    }

    // Indexability count
    if (item.indexability === "indexable") {
      totalIndexablePages++;
    } else {
      totalNoindexPages++;
    }

    // Category breakdown
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;

    // Word count & score
    totalWords += item.wordCount;
    totalScore += item.seoHealthScore;

    // Title validation
    if (!item.currentTitle || item.currentTitle.trim() === "") {
      pagesMissingTitle++;
    } else {
      if (!titlesMap[item.currentTitle]) titlesMap[item.currentTitle] = [];
      titlesMap[item.currentTitle].push(item.urlPath);
    }

    // Meta Description validation
    if (!item.currentMetaDescription || item.currentMetaDescription.trim() === "") {
      pagesMissingMetaDescription++;
    } else {
      if (!descriptionsMap[item.currentMetaDescription]) descriptionsMap[item.currentMetaDescription] = [];
      descriptionsMap[item.currentMetaDescription].push(item.urlPath);
    }

    // H1 validation
    if (!item.currentH1 || item.currentH1.trim() === "") {
      pagesMissingH1++;
    }

    // Thin Content
    if (item.isThinContent) {
      pagesWithThinContent++;
    }

    // Weak Internal Linking (< 3 inbound links)
    if (item.incomingInternalLinkCount < 3) {
      pagesWithWeakInternalLinking++;
    }

    // Canonical
    if (!item.canonicalUrl || item.canonicalUrl.trim() === "") {
      pagesMissingCanonical++;
    }

    // Breadcrumbs
    if (!item.breadcrumbStructure || item.breadcrumbStructure.length === 0) {
      pagesMissingBreadcrumbs++;
    }

    // Structured Data
    if (!item.structuredDataTypes || item.structuredDataTypes.length === 0) {
      pagesMissingAppropriateStructuredData++;
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
  const averageWordCount = totalToolPagesDiscovered > 0 ? Math.round(totalWords / totalToolPagesDiscovered) : 0;
  const averageSeoScore = totalToolPagesDiscovered > 0 ? Math.round(totalScore / totalToolPagesDiscovered) : 0;

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
