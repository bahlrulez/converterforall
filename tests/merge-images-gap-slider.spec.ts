import { test, expect } from '@playwright/test';
import sharp from 'sharp';

test.describe('Image Gap Slider (/merge-images-to-jpg) Comprehensive Suite', () => {

  // Helper function to inject two test images into the dropzones
  async function loadTestImages(page: any, w1 = 100, h1 = 100, w2 = 100, h2 = 100) {
    await page.evaluate(({ w1, h1, w2, h2 }: { w1: number; h1: number; w2: number; h2: number }) => {
      const makeImg = (w: number, h: number, color: string, name: string): File => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        const dataUrl = c.toDataURL('image/jpeg', 0.95);
        const byteString = atob(dataUrl.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new File([new Blob([ab], { type: 'image/jpeg' })], name, { type: 'image/jpeg' });
      };

      const f1 = makeImg(w1, h1, '#ff0000', 'red-box.jpg');
      const f2 = makeImg(w2, h2, '#0000ff', 'blue-box.jpg');
      const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      const dt1 = new DataTransfer(); dt1.items.add(f1);
      inputs[0].files = dt1.files; inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      const dt2 = new DataTransfer(); dt2.items.add(f2);
      inputs[1].files = dt2.files; inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
    }, { w1, h1, w2, h2 });

    await expect(page.getByText('red-box.jpg')).toBeVisible();
    await expect(page.getByText('blue-box.jpg')).toBeVisible();
  }

  test('1. Slider attributes, label, and default 0px (Seamless) state', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');

    const slider = page.locator('#image-gap-slider');
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute('type', 'range');
    await expect(slider).toHaveAttribute('min', '0');
    await expect(slider).toHaveAttribute('max', '200');
    await expect(slider).toHaveAttribute('step', '1');
    await expect(slider).toHaveAttribute('aria-label', 'Custom image gap in pixels');
    await expect(slider).toHaveValue('0');

    // Label reflects default gap 0px
    const label = page.locator('label[for="image-gap-slider"]');
    await expect(label).toContainText('Image Gap:');
    await expect(label).toContainText('0px');

    // "Seamless" preset button is highlighted by default
    const seamlessBtn = page.getByRole('button', { name: 'Seamless' });
    await expect(seamlessBtn).toHaveClass(/border-blue-500/);

    // Reset button is not visible when gap is 0px
    const resetBtn = page.getByRole('button', { name: 'Reset' }).filter({ hasText: 'Reset' });
    await expect(page.locator('button[title="Reset gap to 0px"]')).toHaveCount(0);
  });

  test('2. Bidirectional synchronization: preset clicks update slider, display, and reset button', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    const slider = page.locator('#image-gap-slider');
    const label = page.locator('label[for="image-gap-slider"]');

    // Click 12px preset (first 12px button on page is Image Gap preset)
    const gap12Btn = page.getByRole('button', { name: '12px' }).first();
    await gap12Btn.click();
    await expect(slider).toHaveValue('12');
    await expect(label).toContainText('12px');
    await expect(gap12Btn).toHaveClass(/border-blue-500/);
    await expect(page.getByRole('button', { name: 'Seamless' })).not.toHaveClass(/border-blue-500/);
    await expect(page.locator('button[title="Reset gap to 0px"]')).toBeVisible();

    // Click 24px preset (first 24px button on page)
    const gap24Btn = page.getByRole('button', { name: '24px' }).first();
    await gap24Btn.click();
    await expect(slider).toHaveValue('24');
    await expect(label).toContainText('24px');
    await expect(gap24Btn).toHaveClass(/border-blue-500/);
    await expect(gap12Btn).not.toHaveClass(/border-blue-500/);

    // Click Seamless preset -> returns to 0px
    const seamlessBtn = page.getByRole('button', { name: 'Seamless' });
    await seamlessBtn.click();
    await expect(slider).toHaveValue('0');
    await expect(label).toContainText('0px');
    await expect(seamlessBtn).toHaveClass(/border-blue-500/);
    await expect(gap24Btn).not.toHaveClass(/border-blue-500/);
    await expect(page.locator('button[title="Reset gap to 0px"]')).toHaveCount(0);
  });

  test('3. Bidirectional synchronization: dragging slider updates presets, display, and supports keyboard', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    const slider = page.locator('#image-gap-slider');
    const label = page.locator('label[for="image-gap-slider"]');
    const seamlessBtn = page.getByRole('button', { name: 'Seamless' });
    const gap12Btn = page.getByRole('button', { name: '12px' }).first();
    const gap24Btn = page.getByRole('button', { name: '24px' }).first();

    // Set slider to 12 -> 12px preset becomes active
    await slider.fill('12');
    await expect(slider).toHaveValue('12');
    await expect(label).toContainText('12px');
    await expect(gap12Btn).toHaveClass(/border-blue-500/);
    await expect(seamlessBtn).not.toHaveClass(/border-blue-500/);

    // Set slider to 24 -> 24px preset becomes active
    await slider.fill('24');
    await expect(slider).toHaveValue('24');
    await expect(label).toContainText('24px');
    await expect(gap24Btn).toHaveClass(/border-blue-500/);

    // Set slider to custom value 80 -> no preset active, shows 80px
    await slider.fill('80');
    await expect(slider).toHaveValue('80');
    await expect(label).toContainText('80px');
    await expect(seamlessBtn).not.toHaveClass(/border-blue-500/);
    await expect(gap12Btn).not.toHaveClass(/border-blue-500/);
    await expect(gap24Btn).not.toHaveClass(/border-blue-500/);
    await expect(page.getByText('Custom: 80px')).toBeVisible();

    // Click Reset button to return to 0px
    const resetBtn = page.locator('button[title="Reset gap to 0px"]');
    await resetBtn.click();
    await expect(slider).toHaveValue('0');
    await expect(label).toContainText('0px');
    await expect(seamlessBtn).toHaveClass(/border-blue-500/);

    // Keyboard support: focus and arrow right increases value
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('1');
    await expect(label).toContainText('1px');

    // Maximum value 200px
    await slider.fill('200');
    await expect(slider).toHaveValue('200');
    await expect(label).toContainText('200px');
    await expect(page.getByText('Custom: 200px')).toBeVisible();
  });

  test('4. Horizontal layout: canvas dimensions, image positions, and gap isolation at 0px, 80px, and 200px', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    await loadTestImages(page, 100, 100, 100, 100);

    const slider = page.locator('#image-gap-slider');

    // A) At 0px gap (Seamless), 0px padding:
    // W = 100 + 0 + 100 = 200, H = 100
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(200);
    expect(dims.height).toBe(100);

    // B) At 80px gap, 0px padding:
    // W = 100 + 80 + 100 = 280, H = 100
    await slider.fill('80');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(280);
    expect(dims.height).toBe(100);

    // Inspect pixel positions:
    // x = 0..99 is red (Image 1)
    // x = 100..179 is gap (background color: white [255, 255, 255])
    // x = 180..279 is blue (Image 2)
    // Outer margins at x=0 (left) and x=279 (right) must have image pixels, not gap!
    const pixelsH = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const pLeftEdge = ctx.getImageData(0, 50, 1, 1).data;
      const pImg1 = ctx.getImageData(50, 50, 1, 1).data;
      const pGap = ctx.getImageData(140, 50, 1, 1).data;
      const pImg2 = ctx.getImageData(220, 50, 1, 1).data;
      const pRightEdge = ctx.getImageData(279, 50, 1, 1).data;
      return {
        leftEdge: [pLeftEdge[0], pLeftEdge[1], pLeftEdge[2]],
        img1: [pImg1[0], pImg1[1], pImg1[2]],
        gap: [pGap[0], pGap[1], pGap[2]],
        img2: [pImg2[0], pImg2[1], pImg2[2]],
        rightEdge: [pRightEdge[0], pRightEdge[1], pRightEdge[2]]
      };
    });

    // Left edge (x=0) is Image 1 (Red)
    expect(pixelsH.leftEdge[0]).toBeGreaterThan(200);
    expect(pixelsH.leftEdge[2]).toBeLessThan(50);
    // Inside Image 1 (x=50) is Red
    expect(pixelsH.img1[0]).toBeGreaterThan(200);
    expect(pixelsH.img1[2]).toBeLessThan(50);
    // Gap region (x=140) is White background [255, 255, 255]
    expect(pixelsH.gap[0]).toBeGreaterThan(240);
    expect(pixelsH.gap[1]).toBeGreaterThan(240);
    expect(pixelsH.gap[2]).toBeGreaterThan(240);
    // Inside Image 2 (x=220) is Blue
    expect(pixelsH.img2[2]).toBeGreaterThan(200);
    expect(pixelsH.img2[0]).toBeLessThan(50);
    // Right edge (x=279) is Image 2 (Blue)
    expect(pixelsH.rightEdge[2]).toBeGreaterThan(200);
    expect(pixelsH.rightEdge[0]).toBeLessThan(50);

    // C) At 200px gap (maximum):
    // W = 100 + 200 + 100 = 400, H = 100
    await slider.fill('200');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(400);
    expect(dims.height).toBe(100);

    const gapMid200 = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const p = ctx.getImageData(200, 50, 1, 1).data;
      return [p[0], p[1], p[2]];
    });
    // Center of 200px gap is white background
    expect(gapMid200[0]).toBeGreaterThan(240);
    expect(gapMid200[1]).toBeGreaterThan(240);
    expect(gapMid200[2]).toBeGreaterThan(240);
  });

  test('5. Vertical layout: canvas dimensions, image positions, and gap isolation at 0px, 80px, and 200px', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    await loadTestImages(page, 100, 100, 100, 100);

    // Switch to Vertical Layout (Top & Bottom)
    await page.getByRole('button', { name: 'Top & Bottom' }).click();

    const slider = page.locator('#image-gap-slider');

    // A) At 0px gap (Seamless), 0px padding:
    // W = 100, H = 100 + 0 + 100 = 200
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(100);
    expect(dims.height).toBe(200);

    // B) At 80px gap, 0px padding:
    // W = 100, H = 100 + 80 + 100 = 280
    await slider.fill('80');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(100);
    expect(dims.height).toBe(280);

    // Inspect pixel positions:
    // y = 0..99 is red (Image 1)
    // y = 100..179 is gap (background color: white)
    // y = 180..279 is blue (Image 2)
    // Outer margins at y=0 (top) and y=279 (bottom) must have image pixels, not gap!
    const pixelsV = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = c.getContext('2d')!;
      const pTopEdge = ctx.getImageData(50, 0, 1, 1).data;
      const pImg1 = ctx.getImageData(50, 50, 1, 1).data;
      const pGap = ctx.getImageData(50, 140, 1, 1).data;
      const pImg2 = ctx.getImageData(50, 220, 1, 1).data;
      const pBottomEdge = ctx.getImageData(50, 279, 1, 1).data;
      return {
        topEdge: [pTopEdge[0], pTopEdge[1], pTopEdge[2]],
        img1: [pImg1[0], pImg1[1], pImg1[2]],
        gap: [pGap[0], pGap[1], pGap[2]],
        img2: [pImg2[0], pImg2[1], pImg2[2]],
        bottomEdge: [pBottomEdge[0], pBottomEdge[1], pBottomEdge[2]]
      };
    });

    // Top edge (y=0) is Image 1 (Red)
    expect(pixelsV.topEdge[0]).toBeGreaterThan(200);
    expect(pixelsV.topEdge[2]).toBeLessThan(50);
    // Inside Image 1 (y=50) is Red
    expect(pixelsV.img1[0]).toBeGreaterThan(200);
    expect(pixelsV.img1[2]).toBeLessThan(50);
    // Gap region (y=140) is White background [255, 255, 255]
    expect(pixelsV.gap[0]).toBeGreaterThan(240);
    expect(pixelsV.gap[1]).toBeGreaterThan(240);
    expect(pixelsV.gap[2]).toBeGreaterThan(240);
    // Inside Image 2 (y=220) is Blue
    expect(pixelsV.img2[2]).toBeGreaterThan(200);
    expect(pixelsV.img2[0]).toBeLessThan(50);
    // Bottom edge (y=279) is Image 2 (Blue)
    expect(pixelsV.bottomEdge[2]).toBeGreaterThan(200);
    expect(pixelsV.bottomEdge[0]).toBeLessThan(50);

    // C) At 200px gap (maximum):
    // W = 100, H = 100 + 200 + 100 = 400
    await slider.fill('200');
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(100);
    expect(dims.height).toBe(400);
  });

  test('6. Independent controls: Image Gap and Border Padding operate together without interference', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    await loadTestImages(page, 100, 100, 100, 100);

    const gapSlider = page.locator('#image-gap-slider');
    const paddingSlider = page.locator('#border-padding-slider');

    // Set gap to 50px and border padding to 20px
    await gapSlider.fill('50');
    await paddingSlider.fill('20');

    // Horizontal Layout:
    // W = P(20) + W1(100) + G(50) + W2(100) + P(20) = 290 px
    // H = P(20) + H(100) + P(20) = 140 px
    let dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(290);
    expect(dims.height).toBe(140);

    // Switch to Vertical Layout:
    await page.getByRole('button', { name: 'Top & Bottom' }).click();

    // Vertical Layout:
    // W = P(20) + W(100) + P(20) = 140 px
    // H = P(20) + H1(100) + G(50) + H2(100) + P(20) = 290 px
    dims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(dims.width).toBe(140);
    expect(dims.height).toBe(290);
  });

  test('7. Downloaded JPEG output matches preview dimensions with custom gap and is a valid JPEG', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    await loadTestImages(page, 100, 100, 100, 100);

    // Set custom gap to 80px
    const gapSlider = page.locator('#image-gap-slider');
    await gapSlider.fill('80');

    // Canvas dimensions should be 280 x 100
    const canvasDims = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      return { width: c.width, height: c.height };
    });
    expect(canvasDims.width).toBe(280);
    expect(canvasDims.height).toBe(100);

    // Trigger download and intercept file
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download Merged JPG/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('merged-images.jpg');

    const downloadStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Verify JPEG SOI marker (0xFF, 0xD8, 0xFF)
    expect(buffer.length).toBeGreaterThan(100);
    expect(buffer[0]).toBe(0xFF);
    expect(buffer[1]).toBe(0xD8);
    expect(buffer[2]).toBe(0xFF);

    // Parse image with Sharp to assert exact dimensions and format
    const metadata = await sharp(buffer).metadata();
    expect(metadata.format).toBe('jpeg');
    expect(metadata.width).toBe(280);
    expect(metadata.height).toBe(100);
  });

  test('8. Live preview updates dynamically on gap change without page reload', async ({ page }) => {
    await page.goto('http://localhost:3005/merge-images-to-jpg');
    await loadTestImages(page, 80, 80, 80, 80);

    const slider = page.locator('#image-gap-slider');

    // Initial 0px gap: 80 + 80 = 160 px
    let width = await page.evaluate(() => (document.querySelector('canvas') as HTMLCanvasElement).width);
    expect(width).toBe(160);

    // Change to 35px gap
    await slider.fill('35');
    width = await page.evaluate(() => (document.querySelector('canvas') as HTMLCanvasElement).width);
    expect(width).toBe(195); // 80 + 35 + 80

    // Change to 120px gap
    await slider.fill('120');
    width = await page.evaluate(() => (document.querySelector('canvas') as HTMLCanvasElement).width);
    expect(width).toBe(280); // 80 + 120 + 80

    // Change back to 0px
    await page.getByRole('button', { name: 'Seamless' }).click();
    width = await page.evaluate(() => (document.querySelector('canvas') as HTMLCanvasElement).width);
    expect(width).toBe(160);
  });

});
