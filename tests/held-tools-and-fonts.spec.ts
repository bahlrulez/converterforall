import { test, expect } from "@playwright/test";
import path from "path";
import { convertBurmese } from "../src/lib/fonts/burmese-mappings";
import { chanakyaToUnicode, unicodeToChanakya } from "../src/lib/fonts/chanakya-converter";
import { convertNepali } from "../src/lib/fonts/nepali-mappings";
import { convertBengali } from "../src/lib/fonts/bengali-mappings";

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

  test("2. Walkman-Chanakya converter handles conjuncts, Reph, pre-base vowels, and nuktas bidirectionally", () => {
    const externalSamples = [
      { chanakya: "ç·¤ÌæÕ", uni: "किताब" },
      { chanakya: "Ù×SÌð", uni: "नमस्ते" },
      { chanakya: "ÖæÚÌ", uni: "भारत" },
      { chanakya: "·¤×ü", uni: "कर्म" },
      { chanakya: "Ï×ü", uni: "धर्म" },
      { chanakya: "âêØü", uni: "सूर्य" },
      { chanakya: "ÚæCþ", uni: "राष्ट्र" },
      { chanakya: "ÂýçßçÏ", uni: "प्रविधि" },
    ];
    for (const s of externalSamples) {
      expect(chanakyaToUnicode(s.chanakya)).toBe(s.uni);
    }

    const roundtripSamples = [
      "नमस्ते", "भारत", "किताब", "कर्म", "धर्म", "अर्थ", "सूर्य", "धार्मिक", "आशीर्वाद",
      "पुनर्जन्म", "क्षत्रिय", "विज्ञान", "प्रविधि", "शिक्षा", "विद्यालय", "श्रीमती",
      "कृपया", "हृदय", "राष्ट्र", "राष्ट्रीय", "बुद्धि", "द्वारा", "भक्ति", "प्रेम",
      "क्रोध", "उदाहरण", "अंतर्राष्ट्रीय", "कर्त्तव्य", "ऑफिस", "सड़क", "फ़ाइल",
      "ब्रह्म", "ब्राह्मण", "२०२६", "2026", "यह एक परीक्षण वाक्य है।",
    ];
    for (const word of roundtripSamples) {
      const encoded = unicodeToChanakya(word);
      expect(chanakyaToUnicode(encoded)).toBe(word.normalize("NFC"));
    }

    expect(chanakyaToUnicode("")).toBe("");
    expect(unicodeToChanakya("")).toBe("");
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

  test("7. Nepali Preeti engine converts conjuncts, pre-base vowels, reph, and digits bidirectionally", () => {
    const samples = [
      { preeti: "g]kfn", uni: "नेपाल" },
      { preeti: "gd:t]", uni: "नमस्ते" },
      { preeti: "sf7df8f}+", uni: "काठमाडौं" },
      { preeti: "laxfg", uni: "बिहान" },
      { preeti: "ld7f]", uni: "मिठो" },
      { preeti: "clwsf/", uni: "अधिकार" },
      { preeti: "sDKo'6/", uni: "कम्प्युटर" },
      { preeti: ";/sf/", uni: "सरकार" },
      { preeti: "lj1fg", uni: "विज्ञान" },
      { preeti: "k|ljlw", uni: "प्रविधि" },
      { preeti: "g]kfnL", uni: "नेपाली" },
      { preeti: "cIf/", uni: "अक्षर" },
      { preeti: "sd{", uni: "कर्म" },
      { preeti: "wd{", uni: "धर्म" },
      { preeti: "cy{", uni: "अर्थ" },
      { preeti: ";\"o{", uni: "सूर्य" },
      { preeti: "lzIff", uni: "शिक्षा" },
      { preeti: "ljBfno", uni: "विद्यालय" },
      { preeti: "efiff", uni: "भाषा" },
      { preeti: "k':ts", uni: "पुस्तक" },
      { preeti: ")!@#$%^&*(", uni: "०१२३४५६७८९" },
      { preeti: "/fi6«", uni: "राष्ट्र" },
      { preeti: "s[i0f", uni: "कृष्ण" },
      { preeti: "If]q", uni: "क्षेत्र" },
    ];

    for (const s of samples) {
      expect(convertNepali(s.preeti, "preeti", "toUnicode")).toBe(s.uni);
      expect(convertNepali(s.uni, "preeti", "fromUnicode")).toBe(s.preeti);
    }
    expect(convertNepali("", "preeti", "toUnicode")).toBe("");
    expect(convertNepali("", "preeti", "fromUnicode")).toBe("");
  });

  test("8. Bengali Bijoy/SutonnyMJ engine converts conjuncts, vowel signs, reph, and digits bidirectionally", () => {
    const samples = [
      { bijoy: "evsjv", uni: "বাংলা" },
      { bijoy: "evsjv‡`k", uni: "বাংলাদেশ" },
      { bijoy: "XvKv", uni: "ঢাকা" },
      { bijoy: "KjKvZv", uni: "কলকাতা" },
      { bijoy: "Agi", uni: "অমর" },
      { bijoy: "m^vaxb", uni: "স্বাধীন" },
      { bijoy: "KwgúDUvi", uni: "কম্পিউটার" },
      { bijoy: "weÁvb", uni: "বিজ্ঞান" },
      { bijoy: "cÖhyw³", uni: "প্রযুক্তি" },
      { bijoy: "wk¶v", uni: "শিক্ষা" },
      { bijoy: "we`¨vjq", uni: "বিদ্যালয়" },
      { bijoy: "fvlv", uni: "ভাষা" },
      { bijoy: "eB", uni: "বই" },
      { bijoy: "Kg©", uni: "কর্ম" },
      { bijoy: "ag©", uni: "ধর্ম" },
      { bijoy: "m~h©", uni: "সূর্য" },
      { bijoy: "0123456789", uni: "০১২৩৪৫৬৭৮৯" },
      { bijoy: "b`x", uni: "নদী" },
    ];

    for (const s of samples) {
      expect(convertBengali(s.bijoy, "bijoy", "toUnicode").normalize("NFC")).toBe(s.uni.normalize("NFC"));
      expect(convertBengali(s.uni, "bijoy", "fromUnicode")).toBe(s.bijoy);
    }
    expect(convertBengali("", "bijoy", "toUnicode")).toBe("");
    expect(convertBengali("", "bijoy", "fromUnicode")).toBe("");
  });
});
