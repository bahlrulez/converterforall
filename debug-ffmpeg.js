const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Create a dummy mp4 file
  const dummyFile = 'dummy.mp4';
  fs.writeFileSync(dummyFile, 'dummy mp4 content');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  
  page.on('request', request => console.log('>>', request.method(), request.url()));
  page.on('response', response => console.log('<<', response.status(), response.url()));
  page.on('requestfailed', request => console.log('FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to local server...');
  await page.goto('http://localhost:3000/mp4-to-mp3', { waitUntil: 'networkidle' });

  console.log('Waiting for file input...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log('Setting dummy mp4...');
    await fileInput.setInputFiles(dummyFile);
  } else {
    console.log('File input not found!');
  }

  console.log('Waiting for Extract Audio button...');
  // Wait a moment for UI to update
  await page.waitForTimeout(1000);
  
  const extractButton = await page.$('button:has-text("Extract Audio")');
  if (extractButton) {
    console.log('Clicking Extract Audio...');
    await extractButton.click();
  } else {
    console.log('Extract Audio button not found!');
  }

  console.log('Waiting 10 seconds for FFmpeg load errors...');
  await page.waitForTimeout(10000);

  await browser.close();
  fs.unlinkSync(dummyFile);
})();
