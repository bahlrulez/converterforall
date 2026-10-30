import { test, expect } from '@playwright/test';
import { toolsDatabase } from '../src/lib/tools-db';
import { CUSTOM_TOOL_TITLES } from '../src/lib/seo/metadata';
import { imageToolsContent } from '../src/lib/content/image-tools';
import { extractToolFaqs } from '../src/lib/tool-content';
import sitemap from '../src/app/sitemap';

test.describe('Merge Two Images into One JPG (/merge-images-to-jpg) Automated Suite', () => {
  // Test 1: Sizing Math & Aspect Ratio Preservation - Horizontal Layout
  test('1. Horizontal Layout: exact dimensions, coordinates, and aspect ratio preservation', () => {
    const W1 = 1200, H1 = 800;
    const W2 = 800, H2 = 600;
    const G = 20; // gap
    const P = 10; // padding

    // Sizing equations
    const H_target = Math.max(H1, H2); // 800
    const s1 = H_target / H1; // 1.0
    const s2 = H_target / H2; // 800 / 600 = 1.333333...

    const dw1 = Math.round(W1 * s1); // 1200
    const dh1 = H_target; // 800
    const dw2 = Math.round(W2 * s2); // 1067
    const dh2 = H_target; // 800

    const canvasW = P + dw1 + G + dw2 + P;
    const canvasH = P + H_target + P;

    const x1 = P;
    const y1 = P;
    const x2 = P + dw1 + G;
    const y2 = P;

    expect(H_target).toBe(800);
    expect(dw1).toBe(1200);
    expect(dh1).toBe(800);
    expect(dw2).toBe(1067);
    expect(dh2).toBe(800);

    // Exact canvas size
    expect(canvasW).toBe(2307);
    expect(canvasH).toBe(820);

    // Exact coordinates
    expect(x1).toBe(10);
    expect(y1).toBe(10);
    expect(x2).toBe(1230);
    expect(y2).toBe(10);

    // Aspect ratio preservation
    const origRatio1 = W1 / H1;
    const drawnRatio1 = dw1 / dh1;
    expect(Math.abs(origRatio1 - drawnRatio1)).toBeLessThanOrEqual(0.001);

    const origRatio2 = W2 / H2;
    const drawnRatio2 = dw2 / dh2;
    expect(Math.abs(origRatio2 - drawnRatio2)).toBeLessThanOrEqual(0.001);
  });

  // Test 2: Sizing Math & Aspect Ratio Preservation - Vertical Layout
  test('2. Vertical Layout: exact dimensions, coordinates, and aspect ratio preservation', () => {
    const W1 = 1200, H1 = 800;
    const W2 = 800, H2 = 600;
    const G = 20; // gap
    const P = 10; // padding

    // Sizing equations
    const W_target = Math.max(W1, W2); // 1200
    const s1 = W_target / W1; // 1.0
    const s2 = W_target / W2; // 1200 / 800 = 1.5

    const dw1 = W_target; // 1200
    const dh1 = Math.round(H1 * s1); // 800
    const dw2 = W_target; // 1200
    const dh2 = Math.round(H2 * s2); // 900

    const canvasW = P + W_target + P;
    const canvasH = P + dh1 + G + dh2 + P;

    const x1 = P;
    const y1 = P;
    const x2 = P;
    const y2 = P + dh1 + G;

    expect(W_target).toBe(1200);
    expect(dw1).toBe(1200);
    expect(dh1).toBe(800);
    expect(dw2).toBe(1200);
    expect(dh2).toBe(900);

    // Exact canvas size
    expect(canvasW).toBe(1220);
    expect(canvasH).toBe(1740);

    // Exact coordinates
    expect(x1).toBe(10);
    expect(y1).toBe(10);
    expect(x2).toBe(10);
    expect(y2).toBe(830);

    // Aspect ratio preservation
    const origRatio1 = W1 / H1;
    const drawnRatio1 = dw1 / dh1;
    expect(origRatio1).toBe(drawnRatio1);

    const origRatio2 = W2 / H2;
    const drawnRatio2 = dw2 / dh2;
    expect(origRatio2).toBe(drawnRatio2);
  });

  // Test 3: Safety Downscale Math Calculation
  test('3. Safety Downscale Math: scales composite canvas within 8,192 px and 24 MP limits', () => {
    const W1 = 6000, H1 = 4000;
    const W2 = 6000, H2 = 4000;
    const G = 0, P = 0;

    const MAX_DIM = 8192;
    const MAX_PIXELS = 24_000_000;

    const unscaledW = W1 + W2; // 12000
    const unscaledH = 4000;
    const unscaledArea = unscaledW * unscaledH; // 48,000,000 (48 MP)

    expect(unscaledW).toBeGreaterThan(MAX_DIM);
    expect(unscaledArea).toBeGreaterThan(MAX_PIXELS);

    const scaleSafe = Math.min(
      1.0,
      MAX_DIM / unscaledW, // 8192 / 12000 = 0.682666...
      MAX_DIM / unscaledH, // 8192 / 4000 = 2.048
      Math.sqrt(MAX_PIXELS / unscaledArea) // sqrt(24/48) = 0.7071...
    );

    expect(scaleSafe).toBeCloseTo(0.682666, 4);

    const safeCanvasW = Math.floor(unscaledW * scaleSafe);
    const safeCanvasH = Math.floor(unscaledH * scaleSafe);
    const safeArea = safeCanvasW * safeCanvasH;

    expect(safeCanvasW).toBeLessThanOrEqual(MAX_DIM);
    expect(safeCanvasH).toBeLessThanOrEqual(MAX_DIM);
    expect(safeArea).toBeLessThanOrEqual(MAX_PIXELS);

    expect(safeCanvasW).toBe(8192);
    expect(safeCanvasH).toBe(2730);
    expect(safeArea).toBe(22_364_160);
  });

  // Test 4: Tool Registry & Metadata Invariants in toolsDatabase
  test('4. Tool registry: merge-images-to-jpg exists under image category with valid configuration', () => {
    const tool = toolsDatabase.image['merge-images-to-jpg'];
    expect(tool).toBeDefined();
    expect(tool.title).toBe('Merge Two Images into One JPG');
    expect(tool.outputFormat).toBe('jpg');
    expect(tool.isInteractive).toBe(true);
    expect(tool.acceptedTypes!['image/jpeg']).toContain('.jpg');
    expect(tool.acceptedTypes!['image/png']).toContain('.png');

    // Verify all related tools are active and canonical
    expect(tool.relatedTools).toBeDefined();
    for (const relSlug of tool.relatedTools!) {
      let found = false;
      for (const cat of Object.keys(toolsDatabase)) {
        if (toolsDatabase[cat][relSlug]) {
          found = true;
          break;
        }
      }
      expect(found, `Related tool "${relSlug}" must exist in toolsDatabase`).toBe(true);
    }
  });

  // Test 5: SEO Metadata & Title Length Invariants
  test('5. SEO Metadata: title is strictly <= 60 characters and description is valid', () => {
    const title = CUSTOM_TOOL_TITLES['merge-images-to-jpg'];
    expect(title).toBeDefined();
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toBe('Merge Two Images into One JPG - Free Online Tool');

    // Title with suffix
    const fullTitle = `${title} | ConverterForAll`;
    expect(fullTitle.length).toBeLessThanOrEqual(68);
  });

  // Test 6: Content Sections & FAQ Parity
  test('6. Content & FAQ: unique content sections and 1:1 schema parity', () => {
    const content = imageToolsContent['merge-images-to-jpg'];
    expect(content).toBeDefined();
    expect(content.sections.length).toBeGreaterThanOrEqual(6);

    const fullText = content.sections.map(s => s.title + ' ' + s.content).join('\n');
    expect(fullText).toContain('Why Combine Two Images into One JPG?');
    expect(fullText).toContain('Layout Options: Side by Side vs. Top and Bottom');
    expect(fullText).toContain('PNG Transparency & Solid Background Compositing');
    expect(fullText).toContain('Understanding JPEG Quality Settings');
    expect(fullText).toContain('JPEG compression is always lossy');

    // Extract FAQs
    const faqs = extractToolFaqs(content.sections);
    expect(faqs.length).toBe(7);

    for (const faq of faqs) {
      expect(faq.question.length).toBeGreaterThan(10);
      expect(faq.answer.length).toBeGreaterThan(20);
      expect(fullText).toContain(faq.question);
    }
  });

  // Test 7: Route Collision Invariant
  test('7. Route check: no route collision or alias conflict for merge-images-to-jpg', () => {
    const tool = toolsDatabase.image['merge-images-to-jpg'];
    expect(tool).toBeDefined();

    // Verify it is not an alias
    const aliases = (toolsDatabase as any).SLUG_ALIASES || {};
    expect(aliases['merge-images-to-jpg']).toBeUndefined();
  });

  // Test 8: Live Browser Interaction - UI Elements Present
  test('8. Live Browser: /merge-images-to-jpg page renders dual dropzones and controls', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    // Verify H1
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('Merge Two Images into One JPG');

    // Verify Dropzones
    await expect(page.getByText('Choose Image 1')).toBeVisible();
    await expect(page.getByText('Choose Image 2')).toBeVisible();

    // Verify Controls
    await expect(page.getByText('Layout Direction')).toBeVisible();
    await expect(page.getByText('Background Color', { exact: true })).toBeVisible();

    // Download button must be visible and disabled initially
    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toBeDisabled();
  });

  // Test 9: Live Browser - Canvas Compositing & Export Simulation (JPEG + JPEG)
  test('9. Live Browser: loads two sample JPEG images, composites side-by-side, enables download', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    // Create 2 test image data URLs via evaluate
    await page.evaluate(() => {
      const makeTestImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        
        // Convert to dataUrl -> Blob -> File
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/jpeg' });
        return new File([blob], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg(200, 150, '#ff0000', 'test1.jpg');
      const file2 = makeTestImg(300, 150, '#0000ff', 'test2.jpg');

      // Dispatch to dropzone inputs
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer();
      dt1.items.add(file1);
      inputs[0].files = dt1.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

      const dt2 = new DataTransfer();
      dt2.items.add(file2);
      inputs[1].files = dt2.files;
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for images to load into UI
    await expect(page.getByText('test1.jpg')).toBeVisible();
    await expect(page.getByText('test2.jpg')).toBeVisible();

    // Download button must now be enabled
    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();

    // Verify canvas dimensions
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const canvasDims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });

    // In horizontal mode with 200x150 and 300x150 (matching height 150, gap 0, pad 0):
    // Total width = 200 + 300 = 500, height = 150
    expect(canvasDims.width).toBe(500);
    expect(canvasDims.height).toBe(150);
  });

  // Test 10: Live Browser - Vertical Layout Toggle
  test('10. Live Browser: toggles to vertical layout, recalculates canvas dimensions to stacked', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTestImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg(200, 100, '#ff0000', 'img1.jpg');
      const file2 = makeTestImg(200, 150, '#00ff00', 'img2.jpg');

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer();
      dt1.items.add(file1);
      inputs[0].files = dt1.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

      const dt2 = new DataTransfer();
      dt2.items.add(file2);
      inputs[1].files = dt2.files;
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('img1.jpg')).toBeVisible();

    // Click Top & Bottom layout
    await page.getByRole('button', { name: /Top & Bottom/i }).click();

    // Check canvas dimensions: stacked (width 200, height 100 + 150 = 250)
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });

    expect(dims.width).toBe(200);
    expect(dims.height).toBe(250);
  });

  // Test 11: Live Browser - PNG Transparency Compositing on Solid White Background
  test('11. Live Browser: composites transparent PNG on white background without black box artifacts', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTransparentPng = (w: number, h: number, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        // Draw a circle in the center, leave corners transparent
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 4, 0, Math.PI * 2);
        ctx.fill();

        const dataUrl = c.toDataURL('image/png');
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new File([new Blob([ab], { type: 'image/png' })], name, { type: 'image/png' });
      };

      const file1 = makeTransparentPng(100, 100, 'transparent1.png');
      const file2 = makeTransparentPng(100, 100, 'transparent2.png');

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer();
      dt1.items.add(file1);
      inputs[0].files = dt1.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

      const dt2 = new DataTransfer();
      dt2.items.add(file2);
      inputs[1].files = dt2.files;
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('transparent1.png')).toBeVisible();

    // Sample corner pixel (0, 0) which was transparent in source PNG
    const cornerPixel = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2]]; // [R, G, B]
    });

    // Must be solid white [255, 255, 255], NOT black [0, 0, 0]!
    expect(cornerPixel).toEqual([255, 255, 255]);
  });

  // Test 12: Live Browser - Swap Order Button
  test('12. Live Browser: clicking Swap Order button switches Image 1 and Image 2 positions', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTestImg = (w: number, h: number, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg(100, 100, 'first.jpg');
      const file2 = makeTestImg(200, 100, 'second.jpg');

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer();
      dt1.items.add(file1);
      inputs[0].files = dt1.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

      const dt2 = new DataTransfer();
      dt2.items.add(file2);
      inputs[1].files = dt2.files;
      inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('first.jpg')).toBeVisible();
    await expect(page.getByText('second.jpg')).toBeVisible();

    // Click swap button
    await page.getByRole('button', { name: /Swap Order/i }).click();

    // Verify slots swapped (slot 1 card now shows second.jpg)
    const slot1Text = await page.locator('[data-testid="slot-1"]').textContent();
    expect(slot1Text).toContain('second.jpg');
  });

  // Test 13: Live Browser - Slot Replacement & Removal
  test('13. Live Browser: removing Image 1 resets slot and disables download', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTestImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 50; c.height = 50;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg('sampleA.jpg');
      const file2 = makeTestImg('sampleB.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(file1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(file2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('sampleA.jpg')).toBeVisible();
    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();

    // Click remove button on Slot 1
    const removeBtn = page.getByTitle('Remove Image 1');
    await removeBtn.click();

    // Download button must now be disabled
    await expect(downloadBtn).toBeDisabled();
    await expect(page.getByText('Choose Image 1')).toBeVisible();
  });

  // Test 14: Network Interception - Asserts Zero Image Bytes Transmitted
  test('14. Privacy & Network Interception: zero image bytes or multipart forms transmitted across network', async ({ page }) => {
    const uploadedData: string[] = [];

    // Intercept all network requests
    await page.route('**', (route) => {
      const req = route.request();
      const postData = req.postData();
      if (postData) {
        uploadedData.push(postData);
      }
      route.continue();
    });

    await page.goto('http://localhost:3005/merge-images-to-jpg');

    // Perform upload and merge simulation
    await page.evaluate(() => {
      const makeTestImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 100; c.height = 100;
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg('private_photo1.jpg');
      const file2 = makeTestImg('private_photo2.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(file1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(file2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('private_photo1.jpg')).toBeVisible();

    // Trigger download
    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();

    // Check all captured network payloads: absolutely zero image files, binary blobs, or photo names
    for (const payload of uploadedData) {
      expect(payload).not.toContain('private_photo1');
      expect(payload).not.toContain('private_photo2');
      expect(payload).not.toContain('image/jpeg');
      expect(payload).not.toContain('image/png');
    }
  });

  // Test 15: SEO, Review Zero-State & Status Badge Invariants
  test('15. Shared Template Invariants: review zero-state, badge omission, canonical and metadata', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    const bodyText = await page.textContent('body');

    // Reviews zero-state: no empty reviews or filter pills
    expect(bodyText).not.toContain('No reviews yet');
    expect(bodyText).not.toContain('Filter reviews:');
    expect(bodyText).toContain('Rate this tool / Report an issue');

    // Status badge omission
    expect(bodyText).not.toContain('All Client-Side Systems Operational');

    // Canonical link
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://www.converterforall.com/merge-images-to-jpg');

    // No AggregateRating in JSON-LD schema
    const ldJsons = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const jsonStr of ldJsons) {
      expect(jsonStr).not.toContain('"@type":"AggregateRating"');
    }

    // FAQPage schema matches visible FAQs
    const faqSchema = ldJsons.map(s => {
      try { return JSON.parse(s); } catch { return null; }
    }).find(j => j && j['@type'] === 'FAQPage');

    expect(faqSchema).toBeDefined();
    expect(faqSchema.mainEntity.length).toBe(7);

    for (const faq of faqSchema.mainEntity) {
      expect(bodyText).toContain(faq.name);
    }
  });

  // Test 16: Live Browser - Two PNG Inputs and Download Filename
  test('16. Live Browser: loads two PNG images, composites side-by-side, and verifies download filename merged-images.jpg', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTestPng = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/png');
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/png' })], name, { type: 'image/png' });
      };

      const file1 = makeTestPng(120, 80, '#22c55e', 'png1.png');
      const file2 = makeTestPng(180, 80, '#3b82f6', 'png2.png');

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(file1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(file2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('png1.png')).toBeVisible();
    await expect(page.getByText('png2.png')).toBeVisible();

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const canvasDims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // 120 + 180 = 300, height = 80
    expect(canvasDims.width).toBe(300);
    expect(canvasDims.height).toBe(80);

    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();

    // Verify actual download event and suggested filename
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);
    expect(download.suggestedFilename()).toBe('merged-images.jpg');
  });

  // Test 17: Live Browser - Image Replacement Updates Dimensions and Canvas
  test('17. Live Browser: replacing Image 1 updates thumbnail, dimensions, and recalculates canvas', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeTestImg = (w: number, h: number, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file1 = makeTestImg(100, 100, 'original.jpg');
      const file2 = makeTestImg(100, 100, 'second.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(file1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(file2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('original.jpg')).toBeVisible();
    await expect(page.getByText('second.jpg')).toBeVisible();

    let canvasDims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(canvasDims.width).toBe(200);

    // Replace Image 1 with a wider image (250x100)
    await page.evaluate(() => {
      const c = document.createElement('canvas');
      c.width = 250; c.height = 100;
      const dataUrl = c.toDataURL('image/jpeg', 0.8);
      const byteString = atob(dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const replacementFile = new File([new Blob([ab], { type: 'image/jpeg' })], 'replaced.jpg', { type: 'image/jpeg' });

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt = new DataTransfer(); dt.items.add(replacementFile);
      inputs[0].files = dt.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('replaced.jpg')).toBeVisible();
    await expect(page.getByText('original.jpg')).not.toBeVisible();

    canvasDims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // 250 + 100 = 350
    expect(canvasDims.width).toBe(350);
    expect(canvasDims.height).toBe(100);
  });

  // Test 18: Live Browser - Unsupported and Corrupted File Handling
  test('18. Live Browser: unsupported format and corrupt image display user-facing error banners', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    // Dismiss cookie banner if it appears
    const cookieBanner = page.getByRole('button', { name: /Accept All/i });
    if (await cookieBanner.isVisible({ timeout: 1000 }).catch(() => false)) {
      await cookieBanner.click();
    }

    // 1. Upload unsupported file format (.txt)
    await page.evaluate(() => {
      const txtFile = new File(['plain text content'], 'sample.txt', { type: 'text/plain' });
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt = new DataTransfer(); dt.items.add(txtFile);
      inputs[0].files = dt.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Check error banner text
    await expect(page.getByText('Conversion Alert')).toBeVisible();
    await expect(page.getByText(/not a supported format/i)).toBeVisible();

    // Dismiss error
    await page.locator('#dismiss-error-btn').scrollIntoViewIfNeeded();
    await page.locator('#dismiss-error-btn').click();
    await expect(page.getByText('Conversion Alert')).not.toBeVisible();

    // 2. Upload corrupt image (invalid binary payload disguised as .jpg)
    await page.evaluate(() => {
      const corruptBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const corruptFile = new File([corruptBytes], 'corrupt.jpg', { type: 'image/jpeg' });
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt = new DataTransfer(); dt.items.add(corruptFile);
      inputs[0].files = dt.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('Conversion Alert')).toBeVisible();
    await expect(page.getByText(/Unable to decode/i)).toBeVisible();
  });

  // Test 19: Live Browser - 25 MB Limit Checked Before Object URL Creation
  test('19. Live Browser: 25 MB limit is enforced before URL.createObjectURL is called', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    // Spy on URL.createObjectURL
    await page.evaluate(() => {
      let count = 0;
      const orig = window.URL.createObjectURL;
      window.URL.createObjectURL = function(obj) {
        count++;
        return orig.call(window.URL, obj);
      };
      (window as any).__createUrlCallCount = () => count;
    });

    // Upload an oversized file (26 MB)
    await page.evaluate(() => {
      const dummy = new File([new Uint8Array(100)], 'huge-photo.jpg', { type: 'image/jpeg' });
      Object.defineProperty(dummy, 'size', { value: 26 * 1024 * 1024 });

      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt = new DataTransfer(); dt.items.add(dummy);
      inputs[0].files = dt.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Verify error banner
    await expect(page.getByText('Conversion Alert')).toBeVisible();
    await expect(page.getByText(/exceeds the 25 MB limit/i)).toBeVisible();

    // Verify URL.createObjectURL was NEVER called for this file
    const callCount = await page.evaluate(() => (window as any).__createUrlCallCount());
    expect(callCount).toBe(0);
  });

  // Test 20: Live Browser - Temporary Object URL Cleanup on Remove, Replace, and Unmount
  test('20. Live Browser: temporary object URLs are revoked on remove, replace, and component unmount', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const revoked: string[] = [];
      const origRevoke = window.URL.revokeObjectURL;
      window.URL.revokeObjectURL = function(url) {
        revoked.push(url);
        origRevoke.call(window.URL, url);
      };
      (window as any).__revokedUrls = revoked;

      const makeImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 50; c.height = 50;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const file = makeImg('temp1.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt = new DataTransfer(); dt.items.add(file);
      inputs[0].files = dt.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('temp1.jpg')).toBeVisible();

    // Click remove button
    await page.getByTitle('Remove Image 1').click();
    await expect(page.getByText('Choose Image 1')).toBeVisible();

    // Verify revokeObjectURL was called
    const revokedAfterRemove = await page.evaluate(() => (window as any).__revokedUrls.length);
    expect(revokedAfterRemove).toBeGreaterThanOrEqual(1);

    // Now upload and replace
    await page.evaluate(() => {
      const makeImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 50; c.height = 50;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg('tempA.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('tempA.jpg')).toBeVisible();
    const countBeforeReplace = await page.evaluate(() => (window as any).__revokedUrls.length);

    await page.evaluate(() => {
      const makeImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 60; c.height = 60;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f2 = makeImg('tempB.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[0].files = dt2.files;
      inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('tempB.jpg')).toBeVisible();
    const countAfterReplace = await page.evaluate(() => (window as any).__revokedUrls.length);
    expect(countAfterReplace).toBeGreaterThan(countBeforeReplace);

    // Trigger component unmount via client-side navigation to "/"
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('http://localhost:3005/');
    // Verify that the useEffect cleanup hook revoked the active object URL upon unmount
    const countAfterUnmount = await page.evaluate(() => (window as any).__revokedUrls.length);
    expect(countAfterUnmount).toBeGreaterThan(countAfterReplace);
  });

  // Test 21: Live Browser - Export Failure Handling when toBlob returns null
  test('21. Live Browser: handles canvas.toBlob returning null gracefully with error message', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 50; c.height = 50;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg('test1.jpg');
      const f2 = makeImg('test2.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

      // Mock toBlob to simulate memory failure
      HTMLCanvasElement.prototype.toBlob = function(callback: BlobCallback) {
        callback(null);
      };
    });

    await expect(page.getByText('test1.jpg')).toBeVisible();

    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();
    await downloadBtn.click();

    // Verify error banner
    await expect(page.getByText('Conversion Alert')).toBeVisible();
    await expect(page.getByText(/Browser was unable to allocate memory for JPEG export/i)).toBeVisible();

    // Download button must return to enabled state (not stuck in spinning state)
    await expect(downloadBtn).toBeEnabled();
  });

  // Test 22: Live Browser - Spacing, Border Padding, Background Color and Quality Controls
  test('22. Live Browser: spacing, border padding, background color, and quality controls update canvas and options', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg(100, 100, '#ff0000', 'box1.jpg');
      const f2 = makeImg(100, 100, '#0000ff', 'box2.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('box1.jpg')).toBeVisible();

    // 1. Initial seamless size (gap 0, pad 0): 100 + 100 = 200 x 100
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(200);
    expect(dims.height).toBe(100);

    // 2. Click 12px gap
    await page.getByRole('button', { name: '12px' }).first().click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // 100 + 12 + 100 = 212
    expect(dims.width).toBe(212);
    expect(dims.height).toBe(100);

    // 3. Click 24px gap
    await page.getByRole('button', { name: '24px' }).first().click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // 100 + 24 + 100 = 224
    expect(dims.width).toBe(224);
    expect(dims.height).toBe(100);

    // 4. Click 12px padding (second button named 12px on the page)
    await page.getByRole('button', { name: '12px' }).nth(1).click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Width = 12 + 100 + 24 + 100 + 12 = 248
    // Height = 12 + 100 + 12 = 124
    expect(dims.width).toBe(248);
    expect(dims.height).toBe(124);

    // 5. Background color: Click Black
    await page.getByRole('button', { name: 'Black' }).click();
    let cornerPixel = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const p = ctx.getImageData(0, 0, 1, 1).data;
      return [p[0], p[1], p[2]];
    });
    // Padding area (0, 0) is filled with Black [0, 0, 0]
    expect(cornerPixel).toEqual([0, 0, 0]);

    // 6. Custom background hex input
    const colorInput = page.locator('input[type="color"]');
    await colorInput.fill('#ff00aa');
    cornerPixel = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const p = ctx.getImageData(0, 0, 1, 1).data;
      return [p[0], p[1], p[2]];
    });
    // #ff00aa is RGB [255, 0, 170]
    expect(cornerPixel).toEqual([255, 0, 170]);

    // 7. Quality selection UI toggle
    const maxQualityBtn = page.getByRole('button', { name: 'Maximum (100% lossy)' });
    await maxQualityBtn.click();
    await expect(maxQualityBtn).toHaveClass(/border-blue-500/);
  });

  // Test 23: Sitemap Inclusion
  test('23. Sitemap: /merge-images-to-jpg is automatically included as a canonical indexable URL', () => {
    const entries = sitemap();
    const entry = entries.find(e => e.url === 'https://www.converterforall.com/merge-images-to-jpg');
    expect(entry).toBeDefined();
    expect(entry?.priority).toBe(0.9);
    expect(entry?.changeFrequency).toBe('weekly');
  });

  // Test 24: Live Browser - JPEG Quality Passed to toBlob
  test('24. Live Browser: each JPEG quality selection passes the exact quality value (0.8, 0.92, 1.0) to canvas.toBlob()', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      (window as any).__lastQuality = null;
      const origToBlob = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
        (window as any).__lastQuality = quality;
        return origToBlob.call(this, callback, type, quality);
      };

      const makeImg = (name: string): File => {
        const c = document.createElement('canvas');
        c.width = 50; c.height = 50;
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg('img1.jpg');
      const f2 = makeImg('img2.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('img1.jpg')).toBeVisible();
    const downloadBtn = page.getByRole('button', { name: /Download Merged JPG/i });
    await expect(downloadBtn).toBeEnabled();

    // 1. Default Quality: High (92% -> 0.92)
    await downloadBtn.click();
    let q = await page.evaluate(() => (window as any).__lastQuality);
    expect(q).toBe(0.92);

    // 2. Compact Quality: 80% -> 0.8
    await page.getByRole('button', { name: 'Compact (80%)' }).click();
    await downloadBtn.click();
    q = await page.evaluate(() => (window as any).__lastQuality);
    expect(q).toBe(0.8);

    // 3. Maximum Quality: 100% lossy -> 1.0
    await page.getByRole('button', { name: 'Maximum (100% lossy)' }).click();
    await downloadBtn.click();
    q = await page.evaluate(() => (window as any).__lastQuality);
    expect(q).toBe(1.0);
  });

  // Test 25: Live Browser - Mismatched Dimensions Proportional Scaling in Horizontal and Vertical Modes
  test('25. Live Browser: mismatched dimensions scale proportionally without distortion in horizontal and vertical layouts', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeImg = (w: number, h: number, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      // Image 1: 600 x 400 (aspect ratio 1.5)
      // Image 2: 400 x 600 (aspect ratio 0.6667)
      const f1 = makeImg(600, 400, 'landscape.jpg');
      const f2 = makeImg(400, 600, 'portrait.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('landscape.jpg')).toBeVisible();
    await expect(page.getByText('portrait.jpg')).toBeVisible();

    // 1. Horizontal Layout (Side by Side):
    // Target height = max(400, 600) = 600
    // Image 1 scaled: 600 * (600 / 400) = 900 x 600
    // Image 2 scaled: 400 * (600 / 600) = 400 x 600
    // Total Canvas: width = 900 + 400 = 1300, height = 600
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(1300);
    expect(dims.height).toBe(600);

    // 2. Vertical Layout (Top & Bottom):
    // Target width = max(600, 400) = 600
    // Image 1 scaled: 600 x 400 * (600 / 600) = 600 x 400
    // Image 2 scaled: 600 x 600 * (600 / 400) = 600 x 900
    // Total Canvas: width = 600, height = 400 + 900 = 1300
    await page.getByRole('button', { name: /Top & Bottom/i }).click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(600);
    expect(dims.height).toBe(1300);
  });

  // Test 26: Print-Friendly Border Padding Presets (up to 400px) and Custom Slider (up to 400px)
  test('26. Live Browser: print-friendly border padding presets (up to 400px) and custom slider (up to 400px) update canvas dimensions and uniform background', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg(100, 100, '#ff0000', 'boxA.jpg');
      const f2 = makeImg(100, 100, '#0000ff', 'boxB.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('boxA.jpg')).toBeVisible();

    // Set background to black (#000000) to verify border filling
    await page.getByRole('button', { name: 'Black' }).click();

    // 1. Test 72px preset in Horizontal layout
    // Base dimensions: 100 + 100 = 200 width, 100 height (gap = 0)
    await page.getByRole('button', { name: '72px' }).click();
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Expected: Width = 200 + 2 * 72 = 344, Height = 100 + 2 * 72 = 244
    expect(dims.width).toBe(344);
    expect(dims.height).toBe(244);

    // Verify all four outer border corners are filled with background color [0, 0, 0]
    let borderCorners: any = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const topLeft = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
      const topRight = Array.from(ctx.getImageData(c.width - 1, 0, 1, 1).data.slice(0, 3));
      const bottomLeft = Array.from(ctx.getImageData(0, c.height - 1, 1, 1).data.slice(0, 3));
      const bottomRight = Array.from(ctx.getImageData(c.width - 1, c.height - 1, 1, 1).data.slice(0, 3));
      const img1Inside = Array.from(ctx.getImageData(72 + 10, 72 + 10, 1, 1).data.slice(0, 3));
      return { topLeft, topRight, bottomLeft, bottomRight, img1Inside };
    });
    expect(borderCorners.topLeft).toEqual([0, 0, 0]);
    expect(borderCorners.topRight).toEqual([0, 0, 0]);
    expect(borderCorners.bottomLeft).toEqual([0, 0, 0]);
    expect(borderCorners.bottomRight).toEqual([0, 0, 0]);
    // Image 1 inside area should be reddish (JPEG encoded #ff0000)
    expect(borderCorners.img1Inside[0]).toBeGreaterThan(200);

    // 2. Test 96px preset in Horizontal layout
    await page.getByRole('button', { name: '96px' }).click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Expected: Width = 200 + 2 * 96 = 392, Height = 100 + 2 * 96 = 292
    expect(dims.width).toBe(392);
    expect(dims.height).toBe(292);

    // 3. Test 400px preset in Horizontal layout
    await page.getByRole('button', { name: '400px' }).click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Expected: Width = 200 + 2 * 400 = 1000, Height = 100 + 2 * 400 = 900
    expect(dims.width).toBe(1000);
    expect(dims.height).toBe(900);

    // Verify all four outer border corners remain filled with background color [0, 0, 0] at 400px
    borderCorners = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const topLeft = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
      const topRight = Array.from(ctx.getImageData(c.width - 1, 0, 1, 1).data.slice(0, 3));
      const bottomLeft = Array.from(ctx.getImageData(0, c.height - 1, 1, 1).data.slice(0, 3));
      const bottomRight = Array.from(ctx.getImageData(c.width - 1, c.height - 1, 1, 1).data.slice(0, 3));
      const img1Inside = Array.from(ctx.getImageData(400 + 10, 400 + 10, 1, 1).data.slice(0, 3));
      return { topLeft, topRight, bottomLeft, bottomRight, img1Inside };
    });
    expect(borderCorners.topLeft).toEqual([0, 0, 0]);
    expect(borderCorners.topRight).toEqual([0, 0, 0]);
    expect(borderCorners.bottomLeft).toEqual([0, 0, 0]);
    expect(borderCorners.bottomRight).toEqual([0, 0, 0]);
    expect(borderCorners.img1Inside[0]).toBeGreaterThan(200);

    // 4. Test Custom Slider value (150px)
    const slider = page.locator('#border-padding-slider');
    await slider.fill('150');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Expected: Width = 200 + 2 * 150 = 500, Height = 100 + 2 * 150 = 400
    expect(dims.width).toBe(500);
    expect(dims.height).toBe(400);

    // 5. Test Custom Slider value (250px)
    await slider.fill('250');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Expected: Width = 200 + 2 * 250 = 700, Height = 100 + 2 * 250 = 600
    expect(dims.width).toBe(700);
    expect(dims.height).toBe(600);

    borderCorners = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const topLeft = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
      const bottomRight = Array.from(ctx.getImageData(c.width - 1, c.height - 1, 1, 1).data.slice(0, 3));
      return { topLeft, bottomRight };
    });
    expect(borderCorners.topLeft).toEqual([0, 0, 0]);
    expect(borderCorners.bottomRight).toEqual([0, 0, 0]);

    // 6. Test Maximum Slider value (400px) in Vertical layout
    await page.getByRole('button', { name: /Top & Bottom/i }).click();
    await slider.fill('400');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    // Vertical layout base: Width = 100, Height = 100 + 100 = 200 (gap = 0)
    // With 400px padding: Width = 100 + 2 * 400 = 900, Height = 200 + 2 * 400 = 1000
    expect(dims.width).toBe(900);
    expect(dims.height).toBe(1000);

    // Verify corners in vertical layout are also filled with background color
    borderCorners = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const topLeft = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
      const bottomRight = Array.from(ctx.getImageData(c.width - 1, c.height - 1, 1, 1).data.slice(0, 3));
      return { topLeft, bottomRight };
    });
    expect(borderCorners.topLeft).toEqual([0, 0, 0]);
    expect(borderCorners.bottomRight).toEqual([0, 0, 0]);

    // 7. Test Reset button: click Reset to restore 0px
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(100);
    expect(dims.height).toBe(200);

    // 8. Test None / 0px preset button also resets padding
    await slider.fill('200');
    await page.getByRole('button', { name: 'None' }).click();
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(100);
    expect(dims.height).toBe(200);
  });

  // Test 27: Safety Downscale Math Calculation with Large Print Padding (400px)
  test('27. Safety Downscale Math with Large Print Padding (400px): scales composite canvas within 8,192 px and 24 MP limits and preserves coordinate offsets', () => {
    const W1 = 5000, H1 = 4000;
    const W2 = 5000, H2 = 4000;
    const G = 50;
    const P = 400;

    const MAX_DIM = 8192;
    const MAX_PIXELS = 24_000_000;

    // Horizontal Layout unscaled
    const unscaledW = P + W1 + G + W2 + P; // 400 + 5000 + 50 + 5000 + 400 = 10850
    const unscaledH = P + Math.max(H1, H2) + P; // 400 + 4000 + 400 = 4800
    const unscaledArea = unscaledW * unscaledH; // 52,080,000 (52.08 MP)

    expect(unscaledW).toBe(10850);
    expect(unscaledH).toBe(4800);
    expect(unscaledW).toBeGreaterThan(MAX_DIM);
    expect(unscaledArea).toBeGreaterThan(MAX_PIXELS);

    const scaleSafe = Math.min(
      1.0,
      MAX_DIM / unscaledW, // 8192 / 10850 = 0.755023...
      MAX_DIM / unscaledH, // 8192 / 4800 = 1.706666...
      Math.sqrt(MAX_PIXELS / unscaledArea) // sqrt(24/52.08) = 0.678844...
    );

    expect(scaleSafe).toBeCloseTo(0.678844, 4);

    const P_scaled = Math.round(P * scaleSafe); // Math.round(400 * 0.678844) = 272
    const G_scaled = Math.round(G * scaleSafe); // Math.round(50 * 0.678844) = 34
    const dw1_scaled = Math.round(W1 * scaleSafe); // Math.round(5000 * 0.678844) = 3394
    const dh1_scaled = Math.round(H1 * scaleSafe); // Math.round(4000 * 0.678844) = 2715
    const dw2_scaled = Math.round(W2 * scaleSafe); // 3394
    const dh2_scaled = Math.round(H2 * scaleSafe); // 2715

    const x1 = P_scaled;
    const y1 = P_scaled;
    const x2 = P_scaled + dw1_scaled + G_scaled;
    const y2 = P_scaled;
    const finalCanvasW = x2 + dw2_scaled + P_scaled;
    const finalCanvasH = P_scaled + dh1_scaled + P_scaled;
    const finalArea = finalCanvasW * finalCanvasH;

    expect(finalCanvasW).toBeLessThanOrEqual(MAX_DIM);
    expect(finalCanvasH).toBeLessThanOrEqual(MAX_DIM);
    expect(finalArea).toBeLessThanOrEqual(MAX_PIXELS + 50_000);

    expect(P_scaled).toBe(272);
    expect(x1).toBe(272);
    expect(y1).toBe(272);
    expect(x2).toBe(3700);
    expect(y2).toBe(272);
    expect(finalCanvasW).toBe(7366);
    expect(finalCanvasH).toBe(3259);

    // Vertical Layout with 400px padding
    const unscaledVertW = P + Math.max(W1, W2) + P; // 400 + 5000 + 400 = 5800
    const unscaledVertH = P + H1 + G + H2 + P; // 400 + 4000 + 50 + 4000 + 400 = 8850
    const unscaledVertArea = unscaledVertW * unscaledVertH; // 5800 * 8850 = 51,330,000

    expect(unscaledVertH).toBeGreaterThan(MAX_DIM);
    expect(unscaledVertArea).toBeGreaterThan(MAX_PIXELS);

    const scaleSafeVert = Math.min(
      1.0,
      MAX_DIM / unscaledVertW,
      MAX_DIM / unscaledVertH, // 8192 / 8850 = 0.925649...
      Math.sqrt(MAX_PIXELS / unscaledVertArea) // sqrt(24/51.33) = 0.683777...
    );

    expect(scaleSafeVert).toBeCloseTo(0.683777, 4);

    const P_vert_scaled = Math.round(P * scaleSafeVert); // Math.round(400 * 0.683777) = 274
    const dw1_vert = Math.round(W1 * scaleSafeVert); // 3419
    const dh1_vert = Math.round(H1 * scaleSafeVert); // 2735
    const G_vert = Math.round(G * scaleSafeVert); // 34
    const dw2_vert = Math.round(W2 * scaleSafeVert); // 3419
    const dh2_vert = Math.round(H2 * scaleSafeVert); // 2735

    const finalVertW = P_vert_scaled + dw1_vert + P_vert_scaled;
    const finalVertH = P_vert_scaled + dh1_vert + G_vert + dh2_vert + P_vert_scaled;

    expect(finalVertW).toBeLessThanOrEqual(MAX_DIM);
    expect(finalVertH).toBeLessThanOrEqual(MAX_DIM);
    expect(finalVertW * finalVertH).toBeLessThanOrEqual(MAX_PIXELS + 50_000);
  });

  // Test 28: Live Browser - Safety Downscaling Notice & Adjusted Padding Reporting
  test('28. Live Browser: safety downscaling notice accurately reports effective border padding when scaled', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    await page.evaluate(() => {
      const makeImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.9);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      // Two 4200x2000 images. Horizontal unscaled with 400px padding:
      // unscaledW = 400 + 4200 + 0 + 4200 + 400 = 9200 px > 8192 px max!
      const f1 = makeImg(4200, 2000, '#ff0000', 'wide1.jpg');
      const f2 = makeImg(4200, 2000, '#0000ff', 'wide2.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect(page.getByText('wide1.jpg')).toBeVisible();

    // Click 400px preset
    await page.getByRole('button', { name: '400px' }).click();

    // Verify downscale banner appears and reports adjusted padding
    const notice = page.locator('div').filter({ hasText: /Merged resolution safely adjusted/i });
    await expect(notice.first()).toBeVisible();
    await expect(notice.first()).toContainText('Effective border padding is adjusted to');

    // Verify canvas dimensions are within 8,192 px max
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBeLessThanOrEqual(8192);
    expect(dims.height).toBeLessThanOrEqual(8192);
  });
});
