import { runFullSeoAudit } from '../src/lib/seo';
import { SLUG_ALIASES, toolsDatabase } from '../src/lib/tools-db';
import * as fs from 'fs';

const audit = runFullSeoAudit();
const { inventory, summary } = audit;

// 1. Alias Examples
const aliasExamples = ['kruti-dev-to-mangal', 'pdf-merger'];
const aliasReport = aliasExamples.map(slug => {
  const target = SLUG_ALIASES[slug];
  const item = inventory.find(i => i.urlPath === `/${slug}`);
  const targetItem = inventory.find(i => i.urlPath === `/${target}`);
  return {
    aliasSlug: slug,
    aliasUrl: `https://www.converterforall.com/${slug}`,
    intendedCanonical: `https://www.converterforall.com/${target}`,
    currentGeneratedCanonical: item?.canonicalUrl,
    targetGeneratedCanonical: targetItem?.canonicalUrl
  };
});

// 2. Classify 129 Thin Content Pages
// Let's inspect the 129 thin content pages
const thinPages = inventory.filter(i => i.isThinContent);
console.log("Total thin pages count:", thinPages.length);

// Classification logic:
// B: Short but useful utility page (calculators, generators, scanners, rulers, timers, password, age)
// D: Duplicate / near-duplicate page (aliases that duplicate a canonical)
// C: Boilerplate-heavy page (pages using the generic fallback template with <250 words)
// A: Truly thin / weak page (bare minimum content without practical utility explanation or tool interactivity)
// E: Needs manual review

const categorizedThin = {
  A: [] as typeof thinPages,
  B: [] as typeof thinPages,
  C: [] as typeof thinPages,
  D: [] as typeof thinPages,
  E: [] as typeof thinPages,
};

for (const item of thinPages) {
  if (item.isAlias) {
    categorizedThin.D.push(item);
  } else if (
    item.category === "utilities" && 
    (item.urlPath.includes("calculator") || item.urlPath.includes("ruler") || item.urlPath.includes("measure") || item.urlPath.includes("generator") || item.urlPath.includes("scanner"))
  ) {
    categorizedThin.B.push(item);
  } else if (
    item.category === "developer" && 
    (item.urlPath.includes("decoder") || item.urlPath.includes("generator") || item.urlPath.includes("converter") || item.urlPath.includes("formatter"))
  ) {
    categorizedThin.B.push(item);
  } else if (item.thinContentReason?.includes("generic fallback")) {
    categorizedThin.C.push(item);
  } else if (item.wordCount < 180) {
    categorizedThin.A.push(item);
  } else {
    categorizedThin.E.push(item);
  }
}

// 3. 20 Pages with Weakest Inbound Internal Links
const canonicalTools = inventory.filter(i => !i.isAlias);
const sortedByInbound = [...canonicalTools].sort((a, b) => a.incomingInternalLinkCount - b.incomingInternalLinkCount || a.urlPath.localeCompare(b.urlPath));
const weakest20 = sortedByInbound.slice(0, 20);

// 4. Duplicate Title Clusters
const dupTitles = summary.pagesWithDuplicateTitles;

// 5. Alias counts per canonical tool
const aliasCountMap: Record<string, number> = {};
for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
  aliasCountMap[target] = (aliasCountMap[target] || 0) + 1;
}

// Format 154 Canonical Tools sorted by SEO Health Score descending, then word count
const sortedCanonical = [...canonicalTools].sort((a, b) => b.seoHealthScore - a.seoHealthScore || b.wordCount - a.wordCount);
const canonicalTable = sortedCanonical.map((item, index) => ({
  rank: index + 1,
  name: item.toolName,
  url: item.urlPath,
  category: item.category,
  score: item.seoHealthScore,
  wordCount: item.wordCount,
  inbound: item.incomingInternalLinkCount,
  aliasCount: aliasCountMap[item.urlPath.slice(1)] || 0
}));

const report = {
  aliasReport,
  categorizedThinCounts: {
    A_trulyThin: categorizedThin.A.length,
    B_shortUsefulUtility: categorizedThin.B.length,
    C_boilerplateHeavy: categorizedThin.C.length,
    D_duplicateNearDuplicate: categorizedThin.D.length,
    E_needsManualReview: categorizedThin.E.length,
    total: thinPages.length
  },
  categorizedThinSamples: {
    A: categorizedThin.A.map(i => i.urlPath),
    B: categorizedThin.B.map(i => i.urlPath),
    C: categorizedThin.C.map(i => i.urlPath),
    D: categorizedThin.D.map(i => i.urlPath).slice(0, 10),
    E: categorizedThin.E.map(i => i.urlPath)
  },
  weakest20: weakest20.map(i => ({
    url: i.urlPath,
    inboundLinks: i.incomingInternalLinkCount,
    sourcePages: i.incomingInternalLinks.map(l => `${l.sourceType}: ${l.anchorText}`),
    category: i.category,
    toolType: i.toolType
  })),
  dupTitlesCount: dupTitles.length,
  dupTitles: dupTitles.slice(0, 15),
  canonicalTableCount: canonicalTable.length,
  canonicalTableHead: canonicalTable.slice(0, 10)
};

fs.writeFileSync('scratch/verification-data.json', JSON.stringify(report, null, 2));
console.log("Analysis saved to scratch/verification-data.json");
console.log("Thin categories count:", report.categorizedThinCounts);
console.log("Weakest 20 top 5:", weakest20.slice(0, 5).map(w => ({ url: w.urlPath, links: w.incomingInternalLinkCount, sources: w.incomingInternalLinks.map(s => s.sourceType) })));
