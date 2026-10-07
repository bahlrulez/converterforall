import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Attachment and Redaction Safety', () => {
  test.setTimeout(60000); // 60s per test
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/edit-pdf');
    // Dismiss cookie banner
    const cookieBanner = page.getByRole('button', { name: /Accept All/i });
    if (await cookieBanner.isVisible()) {
      await cookieBanner.click();
    }
  });

  test('TEST 1: Normal PDF, no attachment, no redaction -> normal export works', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('input[type="file"]').setInputFiles('./test-source.pdf');
    await expect(page.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
    
    // Add text (no redaction)
    await page.getByTitle('Add Text').click();
    const canvasLocator = page.locator('.min-h-\\[600px\\]');
    await canvasLocator.click({ position: { x: 200, y: 200 } });
    
    await page.getByRole('button', { name: /Download PDF/i }).click({ force: true });
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('TEST 2: Normal PDF, no attachment, with redaction -> secure redaction works', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('input[type="file"]').setInputFiles('./test-source.pdf');
    await expect(page.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
    
    await page.getByTitle('Redact Blackout').click();
    const canvasLocator = page.locator('.min-h-\\[600px\\]');
    await canvasLocator.click({ position: { x: 200, y: 200 } });
    
    await page.getByRole('button', { name: /Download PDF/i }).click({ force: true });
    await expect(page.getByText(/Confirm Secure Redaction/i)).toBeVisible();
    await page.getByRole('button', { name: /Accept & Export/i }).click();
    
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('TEST 3: PDF with attachment, no redaction -> normal editor behavior', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('input[type="file"]').setInputFiles('./security-test-source.pdf');
    await expect(page.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
    
    await page.getByRole('button', { name: /Download PDF/i }).click({ force: true });
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('TEST 4: PDF with attachment + redaction -> export BLOCKED', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./security-test-source.pdf');
    await expect(page.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
    
    await page.getByTitle('Redact Blackout').click();
    const canvasLocator = page.locator('.min-h-\\[600px\\]');
    await canvasLocator.click({ position: { x: 200, y: 200 } });
    
    // Override window.alert to detect block
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByRole('button', { name: /Download PDF/i }).click({ force: true });
    
    // Check for loader and alert
    await expect(async () => {
      expect(alertMessage).toContain('embedded attachments');
    }).toPass({ timeout: 10000 });
    
    // Verify warning dialog did NOT open
    await expect(page.getByText(/Confirm Secure Redaction/i)).not.toBeVisible();
  });

  test('TEST 5: PDF with multiple attachments + redaction -> export BLOCKED', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./multiple-attachments-test-source.pdf');
    await expect(page.getByText('Page 1 of 1')).toBeVisible({ timeout: 15000 });
    
    await page.getByTitle('Redact Blackout').click();
    const canvasLocator = page.locator('.min-h-\\[600px\\]');
    await canvasLocator.click({ position: { x: 200, y: 200 } });
    
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByRole('button', { name: /Download PDF/i }).click({ force: true });
    
    await expect(async () => {
      expect(alertMessage).toContain('embedded attachments');
    }).toPass({ timeout: 10000 });
  });

});
