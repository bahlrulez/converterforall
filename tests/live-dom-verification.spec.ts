import { test, expect } from '@playwright/test';
import { KRUTIDEV_SNAPSHOT_DATA, UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA, CHANAKYA_SNAPSHOT_DATA } from '../src/lib/content/font-tools-data';
import { getToolContent, extractToolFaqs } from '../src/lib/tool-content';

test.describe('Live DOM Inspection & SEO Parity Verification', () => {
  test('1. krutidev-to-unicode live DOM contains exact literal, backtick, and charCodes [100, 96, 105, 59, 107]', async ({ page }) => {
    await page.goto('http://localhost:3005/krutidev-to-unicode');

    await page.waitForSelector('textarea', { timeout: 10000 });
    const textareas = page.locator('textarea');
    expect(await textareas.count()).toBeGreaterThanOrEqual(2);

    const exampleInput = KRUTIDEV_SNAPSHOT_DATA.naturalOfficeInput;
    const exampleFirst5Codes = exampleInput.substring(0, 5).split('').map(c => c.charCodeAt(0));
    expect(exampleFirst5Codes).toEqual([100, 96, 105, 59, 107]);

    await textareas.nth(0).fill(exampleInput);
    await page.waitForTimeout(300);

    const exampleOutput = await textareas.nth(1).inputValue();
    expect(exampleOutput).toBe(KRUTIDEV_SNAPSHOT_DATA.expectedUnicode);

    // Verify rendered Hindi section explanation and literal sample character code hints in live DOM
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Kruti Dev to Unicode');
    expect(bodyText).toContain("English letters like 'd', 'j', 'k'");
  });

  test('2. unicode-to-krutidev live DOM displays exact converter output for verified sentence', async ({ page }) => {
    await page.goto('http://localhost:3005/unicode-to-krutidev');

    await page.waitForSelector('textarea', { timeout: 10000 });
    const textareas = page.locator('textarea');
    expect(await textareas.count()).toBeGreaterThanOrEqual(2);

    await textareas.nth(0).fill(UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.unicodeInput);
    await page.waitForTimeout(300);

    const exampleOutput = await textareas.nth(1).inputValue();
    expect(exampleOutput).toBe(UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.krutiOutput);

    // Output starts with em dash (8212), i (105), ; (59), k (107)
    const firstWordCodes = exampleOutput.split(' ')[0].split('').map(c => c.charCodeAt(0));
    expect(firstWordCodes).toEqual([8212, 105, 59, 107]);
  });

  test('3. chanakya-to-unicode converts Walkman-Chanakya text cleanly without experimental warning while remaining noindex', async ({ page }) => {
    await page.goto('http://localhost:3005/chanakya-to-unicode');

    await page.waitForSelector('textarea', { timeout: 10000 });
    const textareas = page.locator('textarea');
    expect(await textareas.count()).toBeGreaterThanOrEqual(2);
    await textareas.nth(0).fill(CHANAKYA_SNAPSHOT_DATA.sampleInput);
    await page.waitForTimeout(300);
    expect(await textareas.nth(1).inputValue()).toBe(CHANAKYA_SNAPSHOT_DATA.expectedUnicode);

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('This converter is being verified. Please check the output before relying on it.');

    const robotsContent = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsContent).toContain('noindex');
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
    const slugs = ['krutidev-to-unicode', 'unicode-to-krutidev', 'chanakya-to-unicode'];

    for (const slug of slugs) {
      const expectedFaqs = extractToolFaqs(getToolContent(slug, slug, ''));
      expect(expectedFaqs.length).toBeGreaterThan(0);

      await page.goto(`http://localhost:3005/${slug}`);
      const bodyText = await page.textContent('body');

      const ldJsons = await page.locator('script[type="application/ld+json"]').allTextContents();
      const faqObj = ldJsons.map(s => {
        try { return JSON.parse(s); } catch { return null; }
      }).find(j => j && j['@type'] === 'FAQPage');

      expect(faqObj).toBeDefined();
      expect(faqObj.mainEntity.length).toBe(expectedFaqs.length);

      for (const faq of faqObj.mainEntity) {
        expect(bodyText).toContain(faq.name);
        expect(bodyText).toContain(faq.acceptedAnswer.text);
      }
    }
  });

  test('7. Raavi renders as a focused editorial guide, not a converter template', async ({ page }) => {
    await page.goto('http://localhost:3005/unicode-to-raavi');

    await expect(page.getByRole('heading', { name: 'Raavi Font Guide', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Fonts & Text' })).toHaveAttribute('href', '/category/fonts');
    await expect(page.getByText('Punjabi typography', { exact: true })).toBeVisible();

    const article = page.locator('article');
    await expect(article).toBeVisible();
    await expect(article.getByRole('heading', { name: 'Understanding Raavi Font and Unicode Gurmukhi' })).toBeVisible();
    await expect(article.getByRole('heading', { name: 'How to Display and Format Unicode Text in Raavi Font' })).toBeVisible();
    await expect(article.getByRole('link', { name: 'Asees to Unicode Converter' })).toHaveAttribute('href', '/asees-to-unicode');

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('No text conversion is required.');
    expect(bodyText).not.toContain('No account required');
    expect(bodyText).not.toContain('Related & Recommended Utilities');
    expect(bodyText).not.toContain('Rate this tool / Report an issue');
    expect(bodyText).not.toContain('This tool is not available yet.');

    await expect(article.locator(':scope > div > section')).toHaveCount(4);

    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const jsonText of structuredData) {
      expect(jsonText).not.toContain('"@type":"SoftwareApplication"');
    }
    expect(structuredData.some(jsonText => jsonText.includes('"@type":"FAQPage"'))).toBe(true);
  });

});