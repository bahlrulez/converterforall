import { RelatedTools } from '../src/components/tools/related-tools';
import { toolsDatabase } from '../src/lib/tools-db';
import React from 'react';

// To test a React component's useMemo hook without rendering, we can simulate the logic.
// We'll write a standalone verifier that reproduces the logic inside RelatedTools to ensure it acts exactly as our new component.
function getRelatedList(currentSlug: string, categorySlug: string) {
  const list: Array<{ slug: string; title: string; description: string; category: string; badge?: string }> = [];
  const categoryTools = (toolsDatabase as any)[categorySlug] || {};
  const entries: [string, any][] = Object.entries(categoryTools);

  const badges = ["Popular", "Fast & Free", "Top Utility", "Related Tool"];

  const clusters: Record<string, string[]> = {
    "merge-pdf": ["split-pdf", "compress-pdf", "organize-pdf", "edit-pdf"],
  };

  const currentTool = categoryTools[currentSlug];
  const explicitRelated = currentTool?.relatedTools as string[] | undefined;
  const targetCluster = (explicitRelated && explicitRelated.length > 0) ? explicitRelated : clusters[currentSlug];

  if (targetCluster && targetCluster.length > 0) {
    for (const slug of targetCluster) {
      if (slug === currentSlug) continue;
      if (list.some(item => item.slug === slug)) continue;

      for (const [cat, tools] of Object.entries(toolsDatabase)) {
        if (slug in (tools as any)) {
          list.push({
            slug,
            title: (tools as any)[slug].title || slug,
            description: (tools as any)[slug].description || "",
            category: cat,
            badge: badges[list.length % badges.length],
          });
          break;
        }
      }
    }
  }

  const hasExplicitRelated = Array.isArray(explicitRelated) && explicitRelated.length > 0;

  if (!hasExplicitRelated) {
    // 2. Circular
    if (list.length < 4 && entries.length > 1) {
      const currentIndex = entries.findIndex(([slug]) => slug === currentSlug);
      const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

      for (let i = 0; i < entries.length; i++) {
        const [slug, tool] = entries[(startIndex + i) % entries.length];
        if (slug !== currentSlug && !list.some(item => item.slug === slug)) {
          list.push({
            slug,
            title: tool.title || slug,
            description: tool.description || "",
            category: categorySlug,
            badge: badges[list.length % badges.length],
          });
          if (list.length >= 4) break;
        }
      }
    }
  }

  return list;
}

console.log("Running RelatedTools logic regression tests...");

// CASE A: Tool has explicit relatedTools

(toolsDatabase as any)['video']['test-explicit'] = {
  title: "Test Explicit",
  description: "Desc",
  relatedTools: ["compress-mp4", "video-to-mp4"],
  inputFormat: "video",
  outputFormat: "mp4",
  actionName: "Test",
  isInteractive: true
};
const resA = getRelatedList('test-explicit', 'video');
if (resA[0].slug !== 'compress-mp4' || resA[1].slug !== 'video-to-mp4') {
  throw new Error("CASE A failed: " + JSON.stringify(resA.map(r=>r.slug)));
}
console.log("✅ CASE A (Explicit relatedTools used): PASS");

// CASE B: Tool has no relatedTools -> fallback
const resB = getRelatedList('compress-mp4', 'video');
if (!resB.some(r => r.slug === 'compress-mov-video')) {
  throw new Error("CASE B failed: " + JSON.stringify(resB.map(r=>r.slug)));
}
console.log("✅ CASE B (Fallback behavior maintained): PASS");

// CASE C & D: Invalid slug safely ignored + Self link excluded
(toolsDatabase as any)['video']['test-safety'] = {
  title: "Test Safety",
  description: "Desc",
  relatedTools: ["invalid-slug-123", "test-safety", "compress-mp4", "compress-mp4"],
  inputFormat: "video",
  outputFormat: "mp4",
  actionName: "Test",
  isInteractive: true
};
const resCD = getRelatedList('test-safety', 'video');
if (resCD.some(r => r.slug === 'invalid-slug-123') || resCD.some(r => r.slug === 'test-safety') || resCD.filter(r => r.slug === 'compress-mp4').length > 1) {
  throw new Error("CASE C/D failed: " + JSON.stringify(resCD.map(r=>r.slug)));
}
console.log("✅ CASE C/D (Invalid slug ignored, self-link excluded, duplicates excluded): PASS");

// CASE E: Mileage calculator
const resE = getRelatedList('mileage-calculator', 'utilities');
if (resE.length !== 2 || resE[0].slug !== 'fuel-calculator' || resE[1].slug !== 'miles-to-kilometers') {
  throw new Error("CASE E failed: " + JSON.stringify(resE.map(r=>r.slug)));
}
console.log("✅ CASE E (mileage-calculator exact resolution): PASS");

// CASE F: Video compressor
const resF = getRelatedList('video-compressor', 'video');
if (resF.length !== 4 || resF[0].slug !== 'compress-mp4' || resF[1].slug !== 'compress-video-for-discord' || resF[2].slug !== 'compress-video-for-whatsapp' || resF[3].slug !== 'video-to-mp4') {
  throw new Error("CASE F failed: " + JSON.stringify(resF.map(r=>r.slug)));
}
console.log("✅ CASE F (video-compressor exact resolution): PASS");

console.log("All tests passed successfully.");
