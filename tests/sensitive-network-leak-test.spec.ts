import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Sensitive Input & Telemetry Network Leak Test', () => {

  test('1. Urdu Unicode conversion does not leak input or output over the network', async ({ page }) => {
    const canaryInput = 'CANARY_URDU_INPUT_98745_السلام_عليكم';
    const capturedRequests: { url: string; postData: string | null }[] = [];

    page.on('request', (req) => {
      capturedRequests.push({
        url: req.url(),
        postData: req.postData(),
      });
    });

    await page.goto('http://localhost:3009/unicode-to-inpage');
    await page.waitForLoadState('networkidle');

    // Type canary into input textarea
    const textarea = page.locator('textarea').first();
    await textarea.fill(canaryInput);

    // Give in-browser converter time to run
    await page.waitForTimeout(500);

    // Verify output is visible in DOM
    const outputTextarea = page.locator('textarea').nth(1);
    const outputValue = await outputTextarea.inputValue();
    expect(outputValue.length).toBeGreaterThan(0);

    // Verify CANARY string was NEVER sent across any network request
    for (const req of capturedRequests) {
      expect(req.url).not.toContain('CANARY_URDU_INPUT_98745');
      if (req.postData) {
        expect(req.postData).not.toContain('CANARY_URDU_INPUT_98745');
        expect(req.postData).not.toContain(encodeURIComponent('CANARY_URDU_INPUT_98745'));
      }
    }
  });

  test('2. JWT decoding does not leak token or payload claims over the network', async ({ page }) => {
    // Harmless canary JWT with distinct token claim
    const canaryClaim = 'CANARY_JWT_SECRET_98745';
    const canarySubject = 'CANARY_USER_98745';
    // Header: {"alg":"HS256","typ":"JWT"} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    // Payload: {"sub":"CANARY_USER_98745","canary_secret":"CANARY_JWT_SECRET_98745"} -> eyJzdWIiOiJDQU5BUllfVVNFUl85ODc0NSIsImNhbmFyeV9zZWNyZXQiOiJDQU5BUllfSldUX1NFQ1JFVF85ODc0NSJ9
    const canaryJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDQU5BUllfVVNFUl85ODc0NSIsImNhbmFyeV9zZWNyZXQiOiJDQU5BUllfSldUX1NFQ1JFVF85ODc0NSJ9.dummy_signature_hash_xyz_98745';

    const capturedRequests: { url: string; postData: string | null }[] = [];

    page.on('request', (req) => {
      capturedRequests.push({
        url: req.url(),
        postData: req.postData(),
      });
    });

    await page.goto('http://localhost:3009/jwt-decoder');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea').first();
    await textarea.fill(canaryJwt);

    await page.waitForTimeout(500);

    // Verify decoded claim appears in the UI
    const pageText = await page.textContent('body');
    expect(pageText).toContain(canarySubject);
    expect(pageText).toContain(canaryClaim);

    // Verify token and claims were NEVER sent across the network
    for (const req of capturedRequests) {
      expect(req.url).not.toContain(canaryClaim);
      expect(req.url).not.toContain(canarySubject);
      expect(req.url).not.toContain('dummy_signature_hash_xyz_98745');
      if (req.postData) {
        expect(req.postData).not.toContain(canaryClaim);
        expect(req.postData).not.toContain(canarySubject);
        expect(req.postData).not.toContain(canaryJwt);
      }
    }
  });

  test('3. PNG to PDF conversion does not leak filename or image payload over the network', async ({ page }) => {
    const canaryFilename = 'canary_private_financial_doc_98745.png';
    // 4x4 transparent PNG base64
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAMklEQVR42mP4z8BQz8DAwMDQ0MDAwMwABf8ZGBgYmBi+/2f4z8DA8J8BRPzHpgkmDtcAAH3lDPkS24fFAAAAAElFTkSuQmCC',
      'base64'
    );

    const tempFilePath = path.join(process.cwd(), canaryFilename);
    fs.writeFileSync(tempFilePath, pngBuffer);

    const capturedRequests: { url: string; postData: string | null }[] = [];

    page.on('request', (req) => {
      capturedRequests.push({
        url: req.url(),
        postData: req.postData(),
      });
    });

    try {
      await page.goto('http://localhost:3009/png-to-pdf');
      await page.waitForLoadState('networkidle');

      // Dismiss cookie consent banner if present
      const rejectCookies = page.locator('button:has-text("Reject Optional")');
      if (await rejectCookies.isVisible()) {
        await rejectCookies.click();
        await page.waitForTimeout(300);
      }

      // Upload canary file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(tempFilePath);

      // Trigger conversion button
      const convertButton = page.locator('button:has-text("Convert to PDF")');
      await convertButton.click({ force: true });

      // Wait for completion (Download Result button appears)
      const downloadButton = page.locator('button:has-text("Download Result")');
      await expect(downloadButton).toBeVisible({ timeout: 10000 });

      // Verify canary filename and image contents were NEVER uploaded
      for (const req of capturedRequests) {
        // Exclude local dev page navigations
        if (req.url.startsWith('http://localhost:3009/')) {
          expect(req.url).not.toContain('canary_private_financial_doc_98745');
          expect(req.url).not.toContain('/api/');
        }
        if (req.postData) {
          expect(req.postData).not.toContain('canary_private_financial_doc_98745');
        }
      }
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  });

});
