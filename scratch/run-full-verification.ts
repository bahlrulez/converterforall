import { toolsDatabase, SLUG_ALIASES, getCanonicalToolSlugs, getToolBySlug } from '../src/lib/tools-db';
import { generateMetadata } from '../src/app/[slug]/page';
import nextConfig from '../next.config';

async function main() {
  console.log("================ STARTING COMPREHENSIVE PRODUCTION VERIFICATION ================");

  const results = {
    htmlToPdfCheck: { passed: true, details: [] as string[] },
    sevenAliasesCheck: { passed: true, details: [] as string[] },
    allAliasesRedirectCheck: { passed: true, totalRedirects: 0, verifiedAliases: 0, errors: [] as string[] },
    canonicalPagesDoNotRedirectCheck: { passed: true, canonicalCount: 0, errors: [] as string[] },
    canonicalMetadataGenerationCheck: { passed: true, details: [] as string[], errors: [] as string[] }
  };

  // 1. Verify /html-to-pdf
  const htmlTool = (toolsDatabase as any).document["html-to-pdf"];
  if (!htmlTool) {
    results.htmlToPdfCheck.passed = false;
    results.htmlToPdfCheck.details.push("ERROR: html-to-pdf not found in toolsDatabase.document");
  } else {
    const checks = [
      { field: 'description', expected: 'Convert HTML files and web pages to high-quality PDF documents online for free.', actual: htmlTool.description },
      { field: 'subCategory', expected: 'Convert to PDF', actual: htmlTool.subCategory },
      { field: 'inputFormat', expected: 'html', actual: htmlTool.inputFormat },
      { field: 'outputFormat', expected: 'pdf', actual: htmlTool.outputFormat },
      { field: 'actionName', expected: 'Convert to PDF', actual: htmlTool.actionName },
      { field: 'acceptedTypes', expected: JSON.stringify({ "text/html": [".html", ".htm"] }), actual: JSON.stringify(htmlTool.acceptedTypes) },
    ];

    for (const c of checks) {
      if (c.actual === c.expected) {
        results.htmlToPdfCheck.details.push(`✓ ${c.field}: "${c.actual}"`);
      } else {
        results.htmlToPdfCheck.passed = false;
        results.htmlToPdfCheck.details.push(`✗ ${c.field} MISMATCH! Expected "${c.expected}", got "${c.actual}"`);
      }
    }
  }

  // 2. Verify the 7 corrected PDF resize/scale aliases
  const sevenTargetMap: Record<string, string> = {
    "resize-pdf": "compress-pdf",
    "pdf-resize": "compress-pdf",
    "pdf-resizer": "compress-pdf",
    "scale-pdf": "organize-pdf",
    "pdf-scale": "organize-pdf",
    "resize-pdf-pages": "organize-pdf",
    "scale-pdf-pages": "organize-pdf"
  };

  for (const [alias, expectedTarget] of Object.entries(sevenTargetMap)) {
    const actual = SLUG_ALIASES[alias];
    if (actual === expectedTarget) {
      results.sevenAliasesCheck.details.push(`✓ /${alias} → /${actual}`);
    } else {
      results.sevenAliasesCheck.passed = false;
      results.sevenAliasesCheck.details.push(`✗ /${alias} expected /${expectedTarget}, but got /${actual}`);
    }
  }

  // 3. Verify next.config.ts redirects
  const redirects = await (nextConfig as any).redirects();
  results.allAliasesRedirectCheck.totalRedirects = redirects.length;

  const canonicalSlugs = new Set(getCanonicalToolSlugs());
  const redirectMap = new Map<string, { destination: string; permanent: boolean }>();
  for (const r of redirects) {
    redirectMap.set(r.source, { destination: r.destination, permanent: r.permanent });
  }

  for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
    const redirect = redirectMap.get(`/${alias}`);
    if (!redirect) {
      results.allAliasesRedirectCheck.passed = false;
      results.allAliasesRedirectCheck.errors.push(`Missing redirect in next.config.ts for /${alias}`);
    } else if (redirect.destination !== `/${target}`) {
      results.allAliasesRedirectCheck.passed = false;
      results.allAliasesRedirectCheck.errors.push(`Incorrect destination for /${alias}: expected /${target}, got ${redirect.destination}`);
    } else if (!redirect.permanent) {
      results.allAliasesRedirectCheck.passed = false;
      results.allAliasesRedirectCheck.errors.push(`Redirect for /${alias} is not permanent (301)`);
    } else if (!canonicalSlugs.has(target)) {
      results.allAliasesRedirectCheck.passed = false;
      results.allAliasesRedirectCheck.errors.push(`Redirect target /${target} is NOT a canonical tool!`);
    } else {
      results.allAliasesRedirectCheck.verifiedAliases++;
    }
  }

  // 4. Verify canonical pages do NOT redirect
  results.canonicalPagesDoNotRedirectCheck.canonicalCount = canonicalSlugs.size;
  for (const cSlug of canonicalSlugs) {
    if (redirectMap.has(`/${cSlug}`)) {
      results.canonicalPagesDoNotRedirectCheck.passed = false;
      results.canonicalPagesDoNotRedirectCheck.errors.push(`CRITICAL ERROR: Canonical tool /${cSlug} is present in redirects! Destination: ${redirectMap.get(`/${cSlug}`)?.destination}`);
    }
  }

  // 5. Verify metadata / canonical generation in [slug]/page.tsx
  // Test alias slug
  const aliasMeta = await generateMetadata({ params: Promise.resolve({ slug: "kruti-dev-to-mangal" }) });
  if (aliasMeta.alternates?.canonical === "https://www.converterforall.com/krutidev-to-unicode") {
    results.canonicalMetadataGenerationCheck.details.push(`✓ Alias /kruti-dev-to-mangal correctly generates canonical: ${aliasMeta.alternates.canonical}`);
  } else {
    results.canonicalMetadataGenerationCheck.passed = false;
    results.canonicalMetadataGenerationCheck.errors.push(`✗ Alias /kruti-dev-to-mangal generated: ${aliasMeta.alternates?.canonical}`);
  }

  // Test resize-pdf alias
  const resizeMeta = await generateMetadata({ params: Promise.resolve({ slug: "resize-pdf" }) });
  if (resizeMeta.alternates?.canonical === "https://www.converterforall.com/compress-pdf") {
    results.canonicalMetadataGenerationCheck.details.push(`✓ Alias /resize-pdf correctly generates canonical: ${resizeMeta.alternates.canonical}`);
  } else {
    results.canonicalMetadataGenerationCheck.passed = false;
    results.canonicalMetadataGenerationCheck.errors.push(`✗ Alias /resize-pdf generated: ${resizeMeta.alternates?.canonical}`);
  }

  // Test html-to-pdf canonical
  const htmlMeta = await generateMetadata({ params: Promise.resolve({ slug: "html-to-pdf" }) });
  if (htmlMeta.alternates?.canonical === "https://www.converterforall.com/html-to-pdf") {
    results.canonicalMetadataGenerationCheck.details.push(`✓ Canonical /html-to-pdf generates canonical: ${htmlMeta.alternates.canonical}`);
    results.canonicalMetadataGenerationCheck.details.push(`✓ /html-to-pdf meta description: ${htmlMeta.description?.slice(0, 70)}...`);
  } else {
    results.canonicalMetadataGenerationCheck.passed = false;
    results.canonicalMetadataGenerationCheck.errors.push(`✗ /html-to-pdf generated: ${htmlMeta.alternates?.canonical}`);
  }

  console.log("\n--- VERIFICATION RESULTS SUMMARY ---");
  console.log("1. /html-to-pdf Check:", results.htmlToPdfCheck.passed ? "PASSED" : "FAILED", results.htmlToPdfCheck.details);
  console.log("2. 7 PDF Resize/Scale Aliases Check:", results.sevenAliasesCheck.passed ? "PASSED" : "FAILED", results.sevenAliasesCheck.details);
  console.log("3. 87 Aliases Redirect Check:", results.allAliasesRedirectCheck.passed ? `PASSED (${results.allAliasesRedirectCheck.verifiedAliases}/87 verified)` : "FAILED", results.allAliasesRedirectCheck.errors);
  console.log("4. 154 Canonical Pages Do NOT Redirect Check:", results.canonicalPagesDoNotRedirectCheck.passed ? `PASSED (${results.canonicalPagesDoNotRedirectCheck.canonicalCount} verified safe)` : "FAILED", results.canonicalPagesDoNotRedirectCheck.errors);
  console.log("5. Canonical Tag Generation Check:", results.canonicalMetadataGenerationCheck.passed ? "PASSED" : "FAILED", results.canonicalMetadataGenerationCheck.details, results.canonicalMetadataGenerationCheck.errors);

  const allPassed = 
    results.htmlToPdfCheck.passed &&
    results.sevenAliasesCheck.passed &&
    results.allAliasesRedirectCheck.passed &&
    results.canonicalPagesDoNotRedirectCheck.passed &&
    results.canonicalMetadataGenerationCheck.passed;

  console.log("\nOVERALL STATUS:", allPassed ? "ALL 5 PRODUCTION VERIFICATIONS PASSED" : "ONE OR MORE VERIFICATIONS FAILED");
}

main().catch(err => {
  console.error("Verification script error:", err);
  process.exit(1);
});
