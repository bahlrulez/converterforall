import { runFullSeoAudit } from '../src/lib/seo';

console.log("Running SEO Audit...");
const start = Date.now();
const audit = runFullSeoAudit();
const duration = Date.now() - start;

console.log(`Audit completed in ${duration}ms`);
console.log("================ SUMMARY ================");
console.log("1. Total tool pages discovered:", audit.summary.totalToolPagesDiscovered);
console.log("2. Total indexable pages:", audit.summary.totalIndexablePages);
console.log("3. Total noindex pages:", audit.summary.totalNoindexPages);
console.log("4. Pages missing title:", audit.summary.pagesMissingTitle);
console.log("5. Pages missing meta description:", audit.summary.pagesMissingMetaDescription);
console.log("6. Pages with duplicate titles:", audit.summary.pagesWithDuplicateTitles.length);
console.log("7. Pages with duplicate descriptions:", audit.summary.pagesWithDuplicateDescriptions.length);
console.log("8. Pages missing H1:", audit.summary.pagesMissingH1);
console.log("9. Pages with thin content:", audit.summary.pagesWithThinContent);
console.log("10. Pages with weak internal linking (<3 inbound):", audit.summary.pagesWithWeakInternalLinking);
console.log("11. Pages missing canonical:", audit.summary.pagesMissingCanonical);
console.log("12. Pages missing breadcrumbs:", audit.summary.pagesMissingBreadcrumbs);
console.log("13. Pages missing appropriate structured data:", audit.summary.pagesMissingAppropriateStructuredData);
console.log("Average Word Count:", audit.summary.averageWordCount);
console.log("Average SEO Health Score:", audit.summary.averageSeoScore);
console.log("Canonical tools:", audit.summary.totalCanonicalTools);
console.log("Aliases:", audit.summary.totalAliasRoutes);
console.log("Category breakdown:", audit.summary.categoryBreakdown);
console.log("Sample tool item (0):", audit.inventory[0]?.toolName, audit.inventory[0]?.urlPath);
