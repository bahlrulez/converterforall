const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('BROWSER ERROR: Failed to load resource:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000/mp4-to-mp3');
  console.log('Setting input file...');
  // Adjust path relative to e:\converter for all since we'll run from there
  await page.setInputFiles('input[type="file"]', 'sample.mp4');
  console.log('Waiting for Extract Audio button...');
  await page.waitForSelector('button:has-text("Extract Audio")');
  console.log('Clicking Extract Audio...');
  await page.click('button:has-text("Extract Audio")');

  console.log('Waiting for Download link to appear...');
  await page.waitForSelector('a[download]', { timeout: 60000 });
  
  const downloadLink = await page.$('a[download]');
  const outerHTML = await downloadLink.evaluate(el => el.outerHTML);
  console.log('\n\n========== DOWNLOAD LINK HTML ==========\n');
  console.log(outerHTML);
  console.log('\n========================================\n\n');

  await browser.close();
})();
