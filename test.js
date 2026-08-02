const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('requestfailed', request => console.log('NETWORK FAILED:', request.url(), request.failure()?.errorText));
  page.on('response', response => {
    if (response.status() >= 400) console.log('HTTP ERROR:', response.status(), response.url());
  });
  await page.goto('http://localhost:3000/mp4-to-mp3');
  console.log("Page loaded. Uploading file...");
  await page.setInputFiles('input[type="file"]', 'sample.mp4');
  console.log("File uploaded. Clicking process button...");
  await page.click('button:has-text("Extract Audio")');
  console.log("Clicked! Waiting 15 seconds...");
  await page.waitForTimeout(15000);
  await browser.close();
  console.log("Test finished.");
})();
