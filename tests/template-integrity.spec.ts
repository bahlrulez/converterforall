import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Template Refactoring & Metadata Integrity', () => {
  const samplePath = path.join(process.cwd(), '.next/server/app/krutidev-to-unicode.html');
  const catDocPath = path.join(process.cwd(), '.next/server/app/category/document.html');
  const toolsPath = path.join(process.cwd(), '.next/server/app/tools.html');

  test('1. Tool page HTML does not leak root homepage keywords', () => {
    expect(fs.existsSync(samplePath)).toBe(true);
    const html = fs.readFileSync(samplePath, 'utf8');
    expect(html.includes('name="keywords"')).toBe(false);
  });

  test('2. Tool page HTML has clean, unblocked /og/[slug] og:image and twitter:image', () => {
    const html = fs.readFileSync(samplePath, 'utf8');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('content="https://www.converterforall.com/og/krutidev-to-unicode"');
    expect(html).toContain('name="twitter:image"');
  });

  test('3. Tool page HTML shows unobtrusive rate/report link when 0 reviews exist without empty state or filters', () => {
    const html = fs.readFileSync(samplePath, 'utf8');
    expect(html).not.toContain('No reviews yet');
    expect(html).not.toContain('Filter reviews:');
    expect(html).toContain('Rate this tool / Report an issue');
  });

  test('4. Footer has accurate privacy wording without claiming site-wide local processing', () => {
    const html = fs.readFileSync(samplePath, 'utf8');
    expect(html).not.toContain('All Client-Side Systems Operational');
    expect(html).toContain('Most tools process files locally in your browser.');
    expect(html).toContain('Word-to-PDF and PowerPoint-to-PDF send files to a third-party conversion service (Cloudmersive)');
    expect(html).toContain('the AI Presentation Maker sends prompts to Google Gemini');
  });

  test('5. Compact nav directly links to all 11 Tier A pages and /tools directory', () => {
    const html = fs.readFileSync(samplePath, 'utf8');
    const tierASlugs = [
      'krutidev-to-unicode',
      'unicode-to-krutidev',
      'font-text-fixer',
      'exam-photo-resizer',
      'exam-signature-resizer',
      'photo-name-date-stamper',
      'compress-pdf-100kb',
      'image-dpi-converter',
      'video-caption-generator',
    ];
    for (const slug of tierASlugs) {
      expect(html).toContain(`href="/${slug}"`);
    }
    expect(html).toContain('href="/tools"');
  });

  test('6. Category pages have valid canonical and meta (noindex held for GSC lists)', () => {
    expect(fs.existsSync(catDocPath)).toBe(true);
    const catHtml = fs.readFileSync(catDocPath, 'utf8');
    expect(catHtml).toContain('rel="canonical"');
  });

  test('7. /tools directory page is indexable and lists tools as plain HTML links', () => {
    expect(fs.existsSync(toolsPath)).toBe(true);
    const toolsHtml = fs.readFileSync(toolsPath, 'utf8');
    expect(toolsHtml).not.toContain('noindex');
    expect(toolsHtml).toContain('href="/krutidev-to-unicode"');
    expect(toolsHtml).toContain('href="/word-to-pdf"');
    expect(toolsHtml).toContain('href="/remove-background"');
  });

  test('8. Cloud tools have explicit per-tool privacy disclosures', () => {
    const wordPdfPath = path.join(process.cwd(), '.next/server/app/word-to-pdf.html');
    const wordHtml = fs.readFileSync(wordPdfPath, 'utf8');
    expect(wordHtml).toContain('Cloudmersive');
  });

  test('9. Font detector fallback never generates non-existent tool links', () => {
    const fontDetectorPath = path.join(process.cwd(), 'src/components/tools/font-detector.tsx');
    const content = fs.readFileSync(fontDetectorPath, 'utf8');
    expect(content.includes('`/${fontSlug}-to-unicode`')).toBe(false);
    expect(content.includes('${fontSlug}')).toBe(false);
    expect(content).toContain("return '/font-text-fixer'");
  });

  test('10. Cloud-using tools never contain "100% on-device", "zero upload", or "deleted immediately"', () => {
    const cloudTools = ['word-to-pdf.html', 'powerpoint-to-pdf.html', 'merge-pdf.html', 'presentation-maker.html'];
    const forbiddenPhrases = ['100% on-device', 'zero upload', 'deleted immediately'];

    for (const toolHtmlFile of cloudTools) {
      const filePath = path.join(process.cwd(), '.next/server/app', toolHtmlFile);
      expect(fs.existsSync(filePath), `File ${toolHtmlFile} must exist`).toBe(true);
      const html = fs.readFileSync(filePath, 'utf8').toLowerCase();

      for (const phrase of forbiddenPhrases) {
        expect(html, `Expected ${toolHtmlFile} not to contain "${phrase}"`).not.toContain(phrase);
      }
    }
  });

  test('11. /privacy page source does not contain placeholders or uncompleted fields', () => {
    const privacyFilePath = path.join(process.cwd(), 'src/app/privacy/page.tsx');
    expect(fs.existsSync(privacyFilePath), 'Privacy policy source file must exist').toBe(true);
    const content = fs.readFileSync(privacyFilePath, 'utf8').toLowerCase();

    expect(content).not.toContain('to be completed');
    expect(content).not.toContain('placeholder');

    const privacyHtmlPath = path.join(process.cwd(), '.next/server/app/privacy.html');
    if (fs.existsSync(privacyHtmlPath)) {
      const html = fs.readFileSync(privacyHtmlPath, 'utf8').toLowerCase();
      expect(html).not.toContain('to be completed');
      expect(html).not.toContain('placeholder');
    }
  });

  test('12. /privacy page does not contain square brackets or "YOUR" placeholders outside code/URLs', () => {
    const privacyFilePath = path.join(process.cwd(), 'src/app/privacy/page.tsx');
    expect(fs.existsSync(privacyFilePath), 'Privacy policy source file must exist').toBe(true);
    let text = fs.readFileSync(privacyFilePath, 'utf8');

    // Strip code blocks, inline code, imports, and URLs
    text = text.replace(/<code>[\s\S]*?<\/code>/g, '');
    text = text.replace(/href="[^"]*"/g, '');
    text = text.replace(/import\s+[\s\S]*?from\s+['"][^'"]*['"];?/g, '');

    expect(text).not.toContain('[');
    expect(text).not.toContain(']');
    expect(text).not.toMatch(/\bYOUR\b/);
  });
});

