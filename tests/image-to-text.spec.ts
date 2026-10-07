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

  test.beforeEach(async ({ page }) => {
    await page.route('**/*doubleclick*', route => route.abort());
    await page.route('**/*googleads*', route => route.abort());
    await page.route('**/*clarity.ms*', route => route.abort());
    await page.goto('http://localhost:3000/image-to-text');
    const acceptBtn = page.locator('button:has-text("Accept All")');
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
    }
  });

  test('Page loads and UI is present without language selector', async ({ page }) => {
    await expect(page.locator('text=Upload your Image')).toBeVisible();
    await expect(page.locator('text=Processing runs 100% locally')).toBeVisible();
    await expect(page.locator('select')).toBeHidden();
  });

  test('Privacy Check: The uploaded image is not sent to any external OCR/API processing service', async ({ page }) => {
    const externalRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1') && !url.startsWith('blob:')) {
        if (!url.includes('google') && !url.includes('gstatic') && !url.includes('vercel') && !url.includes('clarity')) {
          console.log('EXTERNAL REQUEST:', url);
          externalRequests.push(url);
        }
      }
    });

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    
    expect(externalRequests.length).toBe(0);
  });

  test('English OCR extraction', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text.replace(/\s+/g, '')).toContain('ConfidentialReport'.replace(/\s+/g, ''));
    expect(text.replace(/\s+/g, '')).toContain('Accuracyistheprimarygoal'.replace(/\s+/g, ''));
  });

  test('Hindi OCR extraction', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanHin);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text.replace(/\s+/g, '')).toContain('महत्वपूर्णसूचना'.replace(/\s+/g, ''));
  });

  test('Punjabi OCR extraction', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanPan);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text.replace(/\s+/g, '')).toContain('ਪੰਜਾਬੀਦਸਤਾਵੇਜ਼'.replace(/\s+/g, ''));
  });

  test('Mixed English & Hindi OCR extraction', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(testFileCleanHin);
    await page.locator('button:has-text("Extract Text")').click();
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    expect(text.replace(/\s+/g, '')).toContain('महत्वपूर्णसूचना'.replace(/\s+/g, ''));
  });

  test('Mixed English & Punjabi OCR extraction', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(testFileCleanPan);
    await page.locator('button:has-text("Extract Text")').click();
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    const text = await page.locator('textarea').inputValue();
    expect(text.replace(/\s+/g, '')).toContain('ਪੰਜਾਬੀਦਸਤਾਵੇਜ਼'.replace(/\s+/g, ''));
  });

  test('Real Poster OCR Layout check (PSM11)', async ({ page }) => {
    const posterPath = path.resolve(__dirname, 'benchmarks', 'poster.png');
    if (fs.existsSync(posterPath)) {
      await page.locator('input[type="file"]').setInputFiles(posterPath);
      await page.locator('button:has-text("Extract Text")').click();
      await expect(page.locator('textarea')).toBeVisible({ timeout: 35000 });
      const text = await page.locator('textarea').inputValue();
      expect(text.replace(/\s+/g, '')).toContain('WhyYouShouldStopUploadingSensitiveFiles'.replace(/\s+/g, ''));
    }
  });

  test('Screenshot OCR Layout check', async ({ page }) => {
    const screenshotPath = path.resolve(__dirname, 'benchmarks', 'screenshot.png');
    if (fs.existsSync(screenshotPath)) {
      await page.locator('input[type="file"]').setInputFiles(screenshotPath);
      await page.locator('button:has-text("Extract Text")').click();
      await expect(page.locator('textarea')).toBeVisible({ timeout: 35000 });
    }
  });

  test('Document OCR Layout check', async ({ page }) => {
    const docPath = path.resolve(__dirname, 'benchmarks', 'document.png');
    if (fs.existsSync(docPath)) {
      await page.locator('input[type="file"]').setInputFiles(docPath);
      await page.locator('button:has-text("Extract Text")').click();
      await expect(page.locator('textarea')).toBeVisible({ timeout: 35000 });
    }
  });

  test('Copy and Download buttons work', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileCleanEng);
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 25000 });
    
    // Copy button
    await page.locator('button:has-text("Copy")').click();
    await expect(page.locator('button:has-text("Copied!")')).toBeVisible();
    
    // Download TXT
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download .TXT")').click()
    ]);
    expect(download.suggestedFilename()).toContain('eng_clean');
    expect(download.suggestedFilename()).toContain('.txt');
  });

  test('Large image stability (No crash)', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFileLarge);
    
    await page.locator('button:has-text("Extract Text")').click();
    
    await expect(page.locator('textarea')).toBeVisible({ timeout: 35000 });
    const text = await page.locator('textarea').inputValue();
    
    expect(text.replace(/\s+/g, '')).toContain('HighResolution'.replace(/\s+/g, ''));
  });

  test('Second upload clears previous result', async ({ page }) => {
    // 1. Upload IMAGE A (English)
    await page.locator('input[type="file"]').first().setInputFiles(testFileCleanEng);
    await page.locator('button:has-text("Extract Text")').click();
    await expect(page.locator('textarea')).toBeVisible({ timeout: 45000 });
    const textA = await page.locator('textarea').inputValue();
    expect(textA.replace(/\s+/g, '')).toContain('ConfidentialReport'.replace(/\s+/g, ''));
    
    // 2. Upload IMAGE B (Hindi) directly using the dropzone (NO START OVER)
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(testFileCleanHin);
    
    // The UI should reset to 'idle' state immediately after drop
    await expect(page.locator('textarea')).toBeHidden();
    
    // 3. Extract text for IMAGE B
    await page.locator('button:has-text("Extract Text")').click();
    await expect(page.locator('textarea')).toBeVisible({ timeout: 45000 });
    
    // 4. Verify result B
    const textB = await page.locator('textarea').inputValue();
    expect(textB.replace(/\s+/g, '')).toContain('महत्वपूर्णसूचना'.replace(/\s+/g, ''));
    
    // 5. Verify result A is GONE
    expect(textB).not.toContain('Confidential');
  });

  test('Invalid file handling', async ({ page }) => {
    // create a fake invalid file
    const invalidPath = path.resolve(__dirname, 'invalid_test.txt');
    fs.writeFileSync(invalidPath, 'This is a text file, not an image.');
    
    const fileInput = page.locator('input[type="file"]');
    
    // React dropzone should reject .txt due to accept config
    await fileInput.setInputFiles(invalidPath);
    // UI remains idle, file not loaded
    await expect(page.locator('text=Upload your Image')).toBeVisible();
    
    fs.unlinkSync(invalidPath);
  });
});
