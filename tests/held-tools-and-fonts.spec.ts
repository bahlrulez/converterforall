import { test, expect } from "@playwright/test";
import path from "path";
import { convertBurmese } from "../src/lib/fonts/burmese-mappings";
import { chanakyaToUnicode, unicodeToChanakya } from "../src/lib/fonts/chanakya-converter";

const BASE_URL = process.env.BASE_URL || "http://localhost:3005";

async function dismissCookieBanner(page: import("@playwright/test").Page) {
  const btn = page.getByRole("button", { name: /Accept All/i });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
  }
}

test.describe("Held Noindex Tools & Burmese/Chanakya Engine Upgrades", () => {
  test("1. Burmese Rabbit engine converts Kinzi, medials, pat-sint, and vowels bidirectionally", () => {
    const samples = [
      { zg: "မဂၤလာပါ ျမန္မာ", uni: "မင်္ဂလာပါ မြန်မာ" },
      { zg: "ေနာက္ဆုံး", uni: "နောက်ဆုံး" },
      { zg: "တကၠသိုလ္", uni: "တက္ကသိုလ်" },
      { zg: "ရန္ကုန္", uni: "ရန်ကုန်" },
    ];

    for (const s of samples) {
      expect(convertBurmese(s.zg, "zawgyi", "toUnicode")).toBe(s.uni);
      expect(convertBurmese(s.uni, "zawgyi", "fromUnicode")).toBe(s.zg);
    }
    expect(convertBurmese("", "zawgyi", "toUnicode")).toBe("");
  });

  test("2. Chanakya converter handles edge-case Z/f positions without hanging", () => {
    expect(chanakyaToUnicode("Z")).toBe("र्");
    expect(chanakyaToUnicode("f")).toBe("f");
    expect(chanakyaToUnicode("")).toBe("");
    expect(unicodeToChanakya("")).toBe("");
    expect(unicodeToChanakya("कर्म")).toBe("deZ");
  });

  test("3. Interactive /image-cropper renders crop controls, crops a PNG/JPG, and downloads", async ({ page }) => {
    await page.goto(`${BASE_URL}/image-cropper`);
    await dismissCookieBanner(page);
    await expect(page.getByText("Drop an image to crop")).toBeVisible();

    const imgPath = path.resolve(__dirname, "benchmarks", "eng_clean.png");
    await page.locator('input[type="file"]').setInputFiles(imgPath);

    await expect(page.getByRole("button", { name: "1:1 Square" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "1:1 Square" }).click();
    await page.getByRole("button", { name: /Crop & Preview/i }).click();

    await expect(page.getByText("Cropped Image Ready")).toBeVisible({ timeout: 10000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download Cropped Image/i }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("-cropped.");
  });

  test("4. Interactive /image-resizer resizes proportionally and downloads", async ({ page }) => {
    await page.goto(`${BASE_URL}/image-resizer`);
    await dismissCookieBanner(page);
    await expect(page.getByText("Drop an image to resize")).toBeVisible();

    const imgPath = path.resolve(__dirname, "benchmarks", "eng_clean.png");
    await page.locator('input[type="file"]').setInputFiles(imgPath);

    const widthInput = page.locator("#resize-width");
    await expect(widthInput).toBeVisible({ timeout: 10000 });
    await widthInput.fill("320");
    await page.getByRole("button", { name: /Resize Image/i }).click();

    await expect(page.getByText("Resized Image Ready")).toBeVisible({ timeout: 10000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download Resized Image/i }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("-320x");
  });

  test("5. Interactive /gif-maker accepts multiple frames and encodes real animated GIF", async ({ page }) => {
    test.setTimeout(90000);
    await page.goto(`${BASE_URL}/gif-maker`);
    await dismissCookieBanner(page);
    await expect(page.getByText("Drop multiple images to make an animated GIF")).toBeVisible();

    const img1 = path.resolve(__dirname, "benchmarks", "eng_clean.png");
    const img2 = path.resolve(__dirname, "benchmarks", "hin_clean.png");
    await page.locator('input[type="file"]').setInputFiles([img1, img2]);

    await expect(page.getByText("2 Frames Loaded")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /Generate Animated GIF/i }).click();

    await expect(page.getByText("Animated GIF Ready")).toBeVisible({ timeout: 60000 });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download Animated GIF/i }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("animated-sequence.gif");
  });

  test("6. /video-to-wmv and /video-to-flv load default WMV/FLV formats and encode real outputs", async ({ page }) => {
    test.setTimeout(120000);
    const sampleVideo = path.resolve(process.cwd(), "public/assets/sample-reel.mp4");

    for (const target of ["wmv", "flv"] as const) {
      await page.goto(`${BASE_URL}/video-to-${target}`);
      await dismissCookieBanner(page);
      await expect(page.getByText("Drop your video here")).toBeVisible();

      await page.locator('input[type="file"]').setInputFiles(sampleVideo);
      const startBtn = page.getByRole("button", { name: new RegExp(`Convert to ${target}\\s+Now`, "i") });
      await expect(startBtn).toBeVisible({ timeout: 15000 });
      await startBtn.click();

      const downloadBtn = page.getByRole("button", { name: new RegExp(`Download\\s+${target}\\s+Video`, "i") });
      await expect(downloadBtn).toBeVisible({ timeout: 60000 });

      const [download] = await Promise.all([
        page.waitForEvent("download"),
        downloadBtn.click(),
      ]);
      expect(download.suggestedFilename().endsWith(`.${target}`)).toBe(true);
    }
  });
});
