import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Image to Text (OCR) Security & Accuracy', () => {

  const testFileCleanEng = path.resolve(__dirname, 'benchmarks', 'eng_clean.png');
  const testFileCleanHin = path.resolve(__dirname, 'benchmarks', 'hin_clean.png');
  const testFileCleanPan = path.resolve(__dirname, 'benchmarks', 'pan_clean.png');
  const testFileLarge = path.resolve(__dirname, 'benchmarks', 'eng_large.png');

  test.beforeAll(() => {
    expect(fs.existsSync(testFileCleanEng)).toBeTruthy();
  });

  test('Page loads and UI is present', async ({ page }) => {
    await page.goto('http://localhost:3000/image-to-text');
    await expect(page.locator('text=Upload your Image')).toBeVisible();
    await expect(page.locator('text=Processing runs 100% locally')).toBeVisible();
  });

  test('Privacy Check: No external OCR API calls during processing', async ({ page }) => {
    const externalRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1') && !url.startsWith('blob:')) {
        if (!url.includes('google') && !url.includes('gstatic') && !url.includes('vercel')) {
          console.log('EXTERNAL REQUEST:', url);
          externalRequests.push(url);
        }
      }
    });

    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    
    // upload file first, then select language
    await page.locator('select').selectOption('eng');
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    
    expect(externalRequests.length).toBe(0);
  });

  test('English OCR extraction', async ({ page }) => {
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    
    await page.locator('select').selectOption('eng');
    await page.locator('button:has-text("Extract Text")').click();
    
    // Progress should appear (it can be Initializing, Extracting, etc)
    // we wait for textarea instead to be more stable
    // Extracted text area appears
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text).toContain('Confidential Report');
    expect(text).toContain('Accuracy is the primary goal');
  });

  test('Hindi OCR extraction', async ({ page }) => {
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanHin);
    
    await page.locator('select').selectOption('hin');
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text).toContain('महत्वपूर्ण सूचना');
  });

  test('Punjabi OCR extraction', async ({ page }) => {
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanPan);
    
    await page.locator('select').selectOption('pan');
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text).toContain('ਪੰਜਾਬੀ ਦਸਤਾਵੇਜ਼');
  });

  test('Copy and Download buttons work', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    
    // Copy button
    await page.locator('button:has-text("Copy")').click({ force: true });
    await expect(page.locator('button:has-text("Copied!")')).toBeVisible();
    
    // Download TXT
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download .TXT")').click({ force: true })
    ]);
    expect(download.suggestedFilename()).toContain('eng_clean');
    expect(download.suggestedFilename()).toContain('.txt');
  });

  test('Large image stability (No crash)', async ({ page }) => {
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileLarge);
    
    await page.locator('button:has-text("Extract Text")').click();
    
    // If it crashes due to OOM, the page will close or the textarea won't appear.
    // The downscaler should reduce it to max 3500px, avoiding the crash.
    await expect(page.locator('textarea')).toBeVisible({ timeout: 35000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text).toContain('High Resolution');
  });

  test('Invalid file handling', async ({ page }) => {
    // create a fake invalid file
    const invalidPath = path.resolve(__dirname, 'invalid_test.txt');
    fs.writeFileSync(invalidPath, 'This is a text file, not an image.');
    
    await page.goto('http://localhost:3000/image-to-text');
    const fileInput = page.locator('input[type="file"]');
    
    // React dropzone should reject .txt due to accept config
    await fileInput.setInputFiles(invalidPath);
    // UI remains idle, file not loaded
    await expect(page.locator('text=Upload your Image')).toBeVisible();
    
    fs.unlinkSync(invalidPath);
  });
});
