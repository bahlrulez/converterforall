import { toolsDatabase, SLUG_ALIASES, getCanonicalToolSlugs, getAllToolSlugs } from '../src/lib/tools-db';
import { toolContent, getToolContent } from '../src/lib/tool-content';

const canonical = getCanonicalToolSlugs();
const all = getAllToolSlugs();
const aliases = Object.keys(SLUG_ALIASES);

console.log("Canonical tools count:", canonical.length);
console.log("Total including aliases:", all.length);
console.log("Aliases count:", aliases.length);
console.log("Categories:", Object.keys(toolsDatabase));

for (const cat of Object.keys(toolsDatabase)) {
  console.log(`Category ${cat}: ${Object.keys((toolsDatabase as any)[cat]).length} tools`);
}
