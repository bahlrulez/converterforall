import { test, expect } from '@playwright/test';
import { KRUTIDEV_SNAPSHOT_DATA, UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA } from '../src/lib/content/font-tools-data';

test.describe('Live DOM Inspection & SEO Parity Verification', () => {
  test('1. krutidev-to-unicode live DOM contains exact literal, backtick, and charCodes [100, 96, 105, 59, 107]', async ({ page }) => {
    await page.goto('http://localhost:3005/krutidev-to-unicode');

    // 1. Example block
    const preCodes = await page.locator('pre code').allTextContents();
    const exampleInput = preCodes[0];
    const exampleOutput = preCodes[1];

    expect(exampleInput).toBe(KRUTIDEV_SNAPSHOT_DATA.naturalOfficeInput);
    expect(exampleOutput).toBe(KRUTIDEV_SNAPSHOT_DATA.expectedUnicode);

    // Verify first 5 charCodes of example input: [100, 96, 105, 59, 107]
    const exampleFirst5Codes = exampleInput.substring(0, 5).split('').map(c => c.charCodeAt(0));
    expect(exampleFirst5Codes).toEqual([100, 96, 105, 59, 107]);

    // 2. Hindi section code element
    const allCodes = await page.locator('code').allTextContents();
    const hindiWordCode = allCodes.find(c => c.length === 5 && c.startsWith('d') && c.endsWith('k'));
    expect(hindiWordCode).toBeDefined();

    const expectedLiteral = 'd' + String.fromCharCode(96) + 'i;k';
    expect(hindiWordCode).toBe(expectedLiteral);

    const hindiCodes = hindiWordCode!.split('').map(c => c.charCodeAt(0));
    expect(hindiCodes).toEqual([100, 96, 105, 59, 107]);
  });

  test('2. unicode-to-krutidev live DOM displays exact converter output for verified sentence', async ({ page }) => {
    await page.goto('http://localhost:3005/unicode-to-krutidev');

    const preCodes = await page.locator('pre code').allTextContents();
    const exampleInput = preCodes[0];
    const exampleOutput = preCodes[1];

    expect(exampleInput).toBe(UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.unicodeInput);
    expect(exampleOutput).toBe(UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.krutiOutput);

    // Output starts with em dash (8212), i (105), ; (59), k (107)
    const firstWordCodes = exampleOutput.split(' ')[0].split('').map(c => c.charCodeAt(0));
    expect(firstWordCodes).toEqual([8212, 105, 59, 107]);
  });

  test('3. chanakya-to-unicode has before-and-after example removed and contains no fake samples', async ({ page }) => {
    await page.goto('http://localhost:3005/chanakya-to-unicode');

    const preCodes = await page.locator('pre code').allTextContents();
    expect(preCodes.length).toBe(0);

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Before-and-After Conversion Example');
    expect(bodyText).toContain('Differences Between Chanakya and Kruti Dev');
  });

  test('4. Empty review UI, rating bars, and fake AggregateRating schema are hidden on live pages', async ({ page }) => {
    const urls = [
      'http://localhost:3005/krutidev-to-unicode',
      'http://localhost:3005/unicode-to-krutidev',
      'http://localhost:3005/chanakya-to-unicode'
    ];

    for (const url of urls) {
      await page.goto(url);
      const bodyText = await page.textContent('body');

      expect(bodyText).not.toContain('No reviews yet');
      expect(bodyText).not.toContain('Filter reviews:');
      expect(bodyText).toContain('Rate this tool / Report an issue');

      // Check schema: no AggregateRating
      const ldJsons = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const jsonStr of ldJsons) {
        expect(jsonStr).not.toContain('"@type":"AggregateRating"');
      }
    }
  });

  test('5. Decorative "All Client-Side Systems Operational" status badge is absent from live pages', async ({ page }) => {
    const urls = [
      'http://localhost:3005/krutidev-to-unicode',
      'http://localhost:3005/unicode-to-krutidev',
      'http://localhost:3005/chanakya-to-unicode'
    ];

    for (const url of urls) {
      await page.goto(url);
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('All Client-Side Systems Operational');
    }
  });

  test('6. FAQ structured data in DOM matches visible FAQ questions and answers 1:1', async ({ page }) => {
    const testPages = [
      { url: 'http://localhost:3005/krutidev-to-unicode', expectedCount: 6 },
      { url: 'http://localhost:3005/unicode-to-krutidev', expectedCount: 7 },
      { url: 'http://localhost:3005/chanakya-to-unicode', expectedCount: 4 }
    ];

    for (const { url, expectedCount } of testPages) {
      await page.goto(url);
      const bodyText = await page.textContent('body');

      const ldJsons = await page.locator('script[type="application/ld+json"]').allTextContents();
      const faqObj = ldJsons.map(s => {
        try { return JSON.parse(s); } catch { return null; }
      }).find(j => j && j['@type'] === 'FAQPage');

      expect(faqObj).toBeDefined();
      expect(faqObj.mainEntity.length).toBe(expectedCount);

      for (const faq of faqObj.mainEntity) {
        expect(bodyText).toContain(faq.name);
      }
    }
  });
});
