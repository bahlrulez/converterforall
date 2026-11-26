import { test, expect } from "@playwright/test";
import fs from "fs";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3005";

test.describe("Phase 2: Open-Source Authority, Font Upgrades, Exam Presets & Caption Studio Polish", () => {
  test("1. Punjabi converter pages render GitHub link and Raavi (Unicode) search intent on /asees-to-unicode", async ({ page }) => {
    const allowlistedPunjabiRoutes = [
      "/asees-to-unicode",
      "/unicode-to-asees",
      "/anmollipi-to-unicode",
      "/satluj-to-unicode",
      "/unicode-to-satluj",
      "/joy-to-unicode",
      "/unicode-to-joy",
    ];

    for (const route of allowlistedPunjabiRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      const ghLink = page.getByRole("link", { name: "Open-source Gurmukhi engine on GitHub" });
      await expect(ghLink, `${route} must show GitHub engine link`).toBeVisible();
      await expect(ghLink).toHaveAttribute("href", "https://github.com/bahlrulez/gurmukhi-legacy-to-unicode");
    }

    // Raavi (Unicode) subheading & FAQ on /asees-to-unicode
    await page.goto(`${BASE_URL}/asees-to-unicode`);
    await expect(
      page.getByRole("heading", { name: /Raavi \(Unicode\)/i })
    ).toBeVisible();

    const bodyText = await page.textContent("body");
    expect(bodyText).toContain("Does converting Asees to Unicode work with Windows Raavi (Unicode) font?");
    expect(bodyText).toContain("Microsoft Windows Raavi is a standard OpenType Gurmukhi Unicode font");
  });

  test("2. /asees-to-unicode and /krutidev-to-unicode support 1-click Copy, Download .txt, and Download .docx next to Copy", async ({ page }) => {
    const scenarios = [
      { route: "/asees-to-unicode", input: ";fs ;qh nekb", expected: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
      { route: "/krutidev-to-unicode", input: "Hkkjr gekjk ns'k gSA", expected: "भारत हमारा देश है।" },
    ];

    for (const s of scenarios) {
      await page.goto(`${BASE_URL}${s.route}`);
      await page.waitForSelector("textarea", { timeout: 10000 });
      const textareas = page.locator("textarea");
      await textareas.nth(0).fill(s.input);
      await expect(textareas.nth(1)).toHaveValue(s.expected);

      const copyBtn = page.getByRole("button", { name: "Copy" });
      const txtBtn = page.getByRole("button", { name: "Download .txt" });
      const docxBtn = page.getByRole("button", { name: "Download .docx" });

      await expect(copyBtn).toBeVisible();
      await expect(txtBtn).toBeEnabled();
      await expect(docxBtn).toBeEnabled();

      const [txtDownload] = await Promise.all([
        page.waitForEvent("download"),
        txtBtn.click(),
      ]);
      expect(txtDownload.suggestedFilename()).toMatch(/\.txt$/);
      const txtPath = await txtDownload.path();
      expect(txtPath).toBeTruthy();
      expect(fs.readFileSync(txtPath!, "utf8")).toBe(s.expected);

      const [docxDownload] = await Promise.all([
        page.waitForEvent("download"),
        docxBtn.click(),
      ]);
      expect(docxDownload.suggestedFilename()).toMatch(/\.docx$/);
      const docxPath = await docxDownload.path();
      expect(docxPath).toBeTruthy();
      const docxBytes = fs.readFileSync(docxPath!);
      // Genuine OOXML .docx archive starts with ZIP header "PK"
      expect(docxBytes.subarray(0, 2).toString("utf8")).toBe("PK");
    }
  });

  test("3. /exam-photo-resizer and /exam-signature-resizer expose SSC, UPSC, IBPS, PSSSB, Punjab Police, and UP Police presets", async ({ page }) => {
    const expectedLabels = [
      /SSC CGL \/ CHSL/i,
      /UPSC/i,
      /IBPS \/ SBI/i,
      /PSSSB/i,
      /Punjab Police/i,
      /UP Police/i,
    ];

    for (const route of ["/exam-photo-resizer", "/exam-signature-resizer"]) {
      await page.goto(`${BASE_URL}${route}`);
      for (const pattern of expectedLabels) {
        await expect(
          page.getByRole("button", { name: pattern }).first(),
          `${route} missing preset matching ${pattern}`
        ).toBeVisible();
      }
    }
  });

  test("4. /video-caption-generator shows above-the-fold value props, browser compatibility note, and clean OG/Twitter tags", async ({ page }) => {
    await page.goto(`${BASE_URL}/video-caption-generator`);

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    const bodyText = await page.textContent("body");
    expect(bodyText).toContain("100% In-Browser");
    expect(bodyText).toContain("0 Bytes Uploaded");
    expect(bodyText).toContain("No Watermark");
    expect(bodyText).toContain("No Sign-Up");
    expect(bodyText).toContain("Best on desktop Chrome/Edge via WebCodecs; large files depend on device RAM.");

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute("content");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");

    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toContain("/og?title=AI%20Video%20Caption%20Studio&cat=Video");
    expect(twitterCard).toBe("summary_large_image");
    expect(twitterImage).toContain("/og?title=AI%20Video%20Caption%20Studio&cat=Video");

    const ogRes = await fetch(`${BASE_URL}/og?title=AI%20Video%20Caption%20Studio&cat=Video`);
    expect(ogRes.status).toBe(200);
    expect(ogRes.headers.get("content-type")).toContain("image/png");
    expect(ogRes.headers.get("x-robots-tag")).toContain("noindex");
  });
});
