import { runFullSeoAudit } from '../src/lib/seo';
import { SLUG_ALIASES } from '../src/lib/tools-db';
import * as fs from 'fs';

const audit = runFullSeoAudit();
const canonicalTools = audit.inventory.filter(i => !i.isAlias);

const aliasCountMap: Record<string, number> = {};
for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
  aliasCountMap[target] = (aliasCountMap[target] || 0) + 1;
}

// Sort by score desc, then wordCount desc
canonicalTools.sort((a, b) => b.seoHealthScore - a.seoHealthScore || b.wordCount - a.wordCount);

let table = "| Rank | Tool | URL | Category | Current SEO Health Score | Word Count | Inbound Links | Alias Count |\n";
table += "|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|\n";

canonicalTools.forEach((tool, idx) => {
  const targetSlug = tool.urlPath.slice(1);
  const aliasCount = aliasCountMap[targetSlug] || 0;
  table += `| ${idx + 1} | ${tool.toolName.replace(/\|/g, '-')} | \`${tool.urlPath}\` | ${tool.category} | ${tool.seoHealthScore}/100 | ${tool.wordCount} | ${tool.incomingInternalLinkCount} | ${aliasCount} |\n`;
});

fs.writeFileSync('scratch/canonical-tools-table.md', table);
console.log(`Generated table with ${canonicalTools.length} rows`);
