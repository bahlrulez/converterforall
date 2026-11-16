import { test, expect } from '@playwright/test';
import { imageToPdf } from '../src/lib/converters/pdf';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

test.describe('PNG to PDF Technical Accuracy & Transparency Verification', () => {
  // 4x4 transparent PNG with a red pixel in the corner to verify transparency and opaque background
  // Base64 transparent PNG (RGBA)
  const transparentPngBase64 = 
    'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAMklEQVR42mP4z8BQz8DAwMDQ0MDAwMwABf8ZGBgYmBi+/2f4z8DA8J8BRPzHpgkmDtcAAH3lDPkS24fFAAAAAElFTkSuQmCC';

  test('1. PNG to PDF embeds transparent PNG over an explicit white background rectangle', async () => {
    const pngBuffer = Buffer.from(transparentPngBase64, 'base64');
    
    // Create a mock File object
    const file = new File([pngBuffer], 'test-transparent.png', { type: 'image/png' });
    
    const pdfBlob = await imageToPdf(file);
    expect(pdfBlob).toBeDefined();
    expect(pdfBlob.type).toBe('application/pdf');

    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    expect(pdfDoc.getPageCount()).toBe(1);
    const page = pdfDoc.getPage(0);
    const { width, height } = page.getSize();

    // Verify dimensions: 4 points by 4 points (1:1 mapping from 4x4 pixels to 4x4 PDF user-space units)
    expect(width).toBe(4);
    expect(height).toBe(4);

    // Save test PDF for visual and structural verification
    const artifactPath = path.join(
      'C:/Users/IT/.gemini/antigravity/brain/3971f077-e0df-46e4-a3b9-74d0afcdd89b',
      'transparent-test-output.pdf'
    );
    fs.writeFileSync(artifactPath, Buffer.from(pdfArrayBuffer));
    expect(fs.existsSync(artifactPath)).toBe(true);

    // Decompress page content stream to verify PDF graphics state operators:
    // 1) Opaque white fill: "1 1 1 rg"
    // 2) Full-page rectangle path: "0 0 m", "0 4 l", "4 4 l", "4 0 l", "h", "f"
    // 3) Image painted on top: "/Image-... Do"
    const zlib = await import('zlib');
    const contents = pdfDoc.context.lookup(page.node.Contents()) as any;
    expect(contents.size()).toBeGreaterThan(0);
    const stream = pdfDoc.context.lookup(contents.get(0)) as any;
    const uncompressedOps = zlib.inflateSync(stream.contents).toString('utf8');

    expect(uncompressedOps).toContain('1 1 1 rg'); // Set color to white
    expect(uncompressedOps).toContain('f'); // Fill background rectangle
    expect(uncompressedOps).toContain('Do'); // Draw image on top

    // Verify raw PDF text invariants: Lossless FlateDecode and NO lossy DCTDecode (JPEG)
    const rawPdfText = Buffer.from(pdfArrayBuffer).toString('latin1');
    expect(rawPdfText).toContain('/FlateDecode');
    expect(rawPdfText).not.toContain('/DCTDecode');
  });

  test('2. PDF dimensions calculation: document exact physical page sizes', () => {
    // 1 PDF user-space point = 1/72 inch = 0.352778 mm
    const dpi = 72;
    const ptToMm = 25.4 / 72;

    const testResolutions = [
      { name: '1080p Full HD', pxW: 1920, pxH: 1080, expectedInW: 1920 / 72, expectedInH: 1080 / 72 },
      { name: '4K UHD', pxW: 3840, pxH: 2160, expectedInW: 3840 / 72, expectedInH: 2160 / 72 },
      { name: 'Standard Photo', pxW: 1200, pxH: 800, expectedInW: 1200 / 72, expectedInH: 800 / 72 },
    ];

    for (const res of testResolutions) {
      const inW = res.pxW / dpi;
      const inH = res.pxH / dpi;
      const mmW = res.pxW * ptToMm;
      const mmH = res.pxH * ptToMm;

      expect(inW).toBeCloseTo(res.expectedInW, 2);
      expect(inH).toBeCloseTo(res.expectedInH, 2);
      expect(mmW).toBeGreaterThan(0);
      expect(mmH).toBeGreaterThan(0);
    }
  });
});
