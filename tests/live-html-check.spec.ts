import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Static HTML Verification for Audited URLs', () => {
  test('unicode-to-inpage HTML has zero PDF content and valid Urdu FAQ schema', () => {
    const htmlPath = path.join(process.cwd(), '.next/server/app/unicode-to-inpage.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).not.toContain('removing pages');
    expect(html).not.toContain('scanned sideways');
    expect(html).not.toContain('update the document index');
    expect(html).not.toContain('reordering pages');
    expect(html).toContain('Urdu Unicode to InPage');
    expect(html).toContain('"@type":"FAQPage"');
  });

  test('png-to-pdf HTML has no page management FAQs and no duplicate guide', () => {
    const htmlPath = path.join(process.cwd(), '.next/server/app/png-to-pdf.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).not.toContain('update the document index');
    expect(html).not.toContain('scanned sideways');

    // In Next.js SSG HTML, the heading appears once in the DOM and once in the RSC stream (2 times total in the file)
    // The duplicate "Step-by-step usage guide" is completely absent (0 times)
    const guideMatches = html.match(/Step-by-step guide/gi) || [];
    expect(guideMatches.length).toBe(2);
    expect(html).not.toContain('Step-by-step usage guide');
  });

  test('jwt-decoder HTML title and H1 are aligned without Offline contradiction', () => {
    const htmlPath = path.join(process.cwd(), '.next/server/app/jwt-decoder.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
    const html = fs.readFileSync(htmlPath, 'utf8');

    expect(html).toContain('Browser-Based JWT Decoder &amp; Parser');
    expect(html).not.toContain('JWT Decoder (Offline)');
    expect(html).not.toContain('JWT Decoder Online (JSON Web Token)');
  });
});
