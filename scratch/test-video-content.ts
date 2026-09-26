import { getToolContent } from "../src/lib/tool-content";
import { SLUG_ALIASES } from "../src/lib/tools-db";

async function runTests() {
  let passed = true;

  console.log("Starting Phase 3 Regression Tests...");

  function checkContent(slug: string, title: string, description: string, expectedToContain: string[], expectedToNotContain: string[]) {
    const sections = getToolContent(slug, title, description);
    const fullHtml = sections.map(s => s.title + " " + s.content).join(" ").toLowerCase();
    
    let localPassed = true;

    for (const exp of expectedToContain) {
      if (!fullHtml.includes(exp.toLowerCase())) {
        console.error(`[FAIL] ${slug}: Missing expected content "${exp}"`);
        localPassed = false;
        passed = false;
      }
    }

    for (const exp of expectedToNotContain) {
      if (fullHtml.includes(exp.toLowerCase())) {
        console.error(`[FAIL] ${slug}: Contains forbidden content "${exp}"`);
        localPassed = false;
        passed = false;
      }
    }

    if (localPassed) {
      console.log(`[PASS] ${slug}`);
    }
  }

  // 1. /compress-video alias check
  const resolvedSlug = SLUG_ALIASES["compress-video"] || "compress-video";
  if (resolvedSlug !== "video-compressor") {
    console.error(`[FAIL] /compress-video did not resolve to video-compressor (resolved to ${resolvedSlug})`);
    passed = false;
  } else {
    console.log(`[PASS] /compress-video correctly resolves to video-compressor`);
  }

  checkContent(resolvedSlug, "Compress Video Size", "Compress video files", 
    ["reduces video file sizes so they are easier to email"], 
    ["h.264 video and aac audio plays reliably", "understanding containers, codecs"]
  );

  // 2. /video-to-mp4
  checkContent("video-to-mp4", "Convert to MP4", "Convert any video", 
    ["universally supported across smartphones"], 
    ["understanding containers, codecs", "audio frame timestamps", "will my audio stay in sync"]
  );

  // 3. /video-to-jpg
  checkContent("video-to-jpg", "Video to JPG Sequence", "Extract frames", 
    ["captures still image frames"], 
    ["understanding containers, codecs", "will my audio stay in sync"]
  );

  // 4. Unrelated tool (e.g., video-to-avi which we didn't override)
  checkContent("video-to-avi", "Convert to AVI", "Convert any video format to AVI format.", 
    ["what is this video tool?", "understanding containers, codecs"], 
    []
  );

  // 5. Unrelated tool (e.g., inches-to-centimeters)
  checkContent("inches-to-centimeters", "Inches to Centimeters", "Convert", 
    ["the exact conversion formula"], 
    []
  );

  // 6. Phase 2C Punjabi profiles
  checkContent("joy-to-unicode", "Joy to Unicode", "Convert Joy", 
    ["a popular non-unicode punjabi font"], 
    ["legacy font mapping systems", "helpful tips for using this tool"]
  );

  if (passed) {
    console.log("All Phase 3 Video Content Regression Tests PASSED.");
    process.exit(0);
  } else {
    console.error("Some tests FAILED.");
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
