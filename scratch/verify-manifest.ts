import { SLUG_ALIASES, getCanonicalToolSlugs, toolsDatabase } from '../src/lib/tools-db';
import * as fs from 'fs';

const canonicalSlugs = new Set(getCanonicalToolSlugs());
const aliasEntries = Object.entries(SLUG_ALIASES);

console.log(`Total aliases in SLUG_ALIASES: ${aliasEntries.length}`);

const validationResults = {
  totalAliases: aliasEntries.length,
  missingTargets: [] as string[],
  aliasChains: [] as string[],
  selfLoops: [] as string[],
  canonicalAsAlias: [] as string[],
  manifest: [] as { alias: string; target: string; targetExists: boolean; targetCategory: string }[]
};

// Map target to category
const targetToCategory: Record<string, string> = {};
for (const [cat, tools] of Object.entries(toolsDatabase)) {
  for (const slug of Object.keys(tools)) {
    targetToCategory[slug] = cat;
  }
}

for (const [alias, target] of aliasEntries) {
  // Check target exists
  const targetExists = canonicalSlugs.has(target);
  if (!targetExists) {
    validationResults.missingTargets.push(`${alias} -> ${target} (TARGET NOT FOUND IN CANONICAL TOOLS)`);
  }

  // Check alias chain (target is also an alias)
  if (SLUG_ALIASES[target]) {
    validationResults.aliasChains.push(`${alias} -> ${target} -> ${SLUG_ALIASES[target]}`);
  }

  // Check self loop
  if (alias === target) {
    validationResults.selfLoops.push(`${alias} -> ${target}`);
  }

  // Check if alias is accidentally also a canonical tool
  if (canonicalSlugs.has(alias)) {
    validationResults.canonicalAsAlias.push(alias);
  }

  validationResults.manifest.push({
    alias,
    target,
    targetExists,
    targetCategory: targetToCategory[target] || 'unknown'
  });
}

fs.writeFileSync('scratch/manifest-validation.json', JSON.stringify(validationResults, null, 2));
console.log("Validation Results:", {
  total: validationResults.totalAliases,
  missingTargetsCount: validationResults.missingTargets.length,
  aliasChainsCount: validationResults.aliasChains.length,
  selfLoopsCount: validationResults.selfLoops.length,
  canonicalAsAliasCount: validationResults.canonicalAsAlias.length
});
