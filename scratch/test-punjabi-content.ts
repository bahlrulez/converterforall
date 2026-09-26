import { getToolContent } from "../src/lib/tool-content";

const slugs = [
  "joy-to-unicode",
  "unicode-to-satluj",
  "satluj-to-unicode",
  "asees-to-unicode",
  "unicode-to-gurbani-akhar",
];

let failed = false;

for (const slug of slugs) {
  const content = getToolContent(slug, `Test Title ${slug}`, `Test Desc ${slug}`);
  const combinedText = content.map((c: any) => c.content).join(" ");
  
  if (combinedText.includes("Before Unicode became the global standard")) {
    console.error(`❌ FAILED: ${slug} contains generic fallback boilerplate!`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${slug} successfully bypassed boilerplate and rendered custom profile.`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("All 5 targeted pages successfully implemented the Content-Profile Architecture without generic SEO padding.");
}
