const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`BROWSER ERROR: ${msg.text()}`);
    } else {
      console.log(`BROWSER CONSOLE: ${msg.text()}`);
    }
  });

  await page.goto('http://localhost:3000/mp4-to-mp3');
  
  console.log("Setting input file...");
  const input = await page.$('input[type="file"]');
  // I need to use the absolute path of sample.mp4
  const samplePath = "e:\\converter for all\\sample.mp4";
  await input.setInputFiles(samplePath);
  
  console.log("Waiting for Extract Audio button...");
  await page.waitForSelector('button:has-text("Extract Audio")');
  
  console.log("Clicking Extract Audio...");
  await page.click('button:has-text("Extract Audio")');
  
  // Wait for success status first to get the download link
  await page.waitForSelector('.text-success', { timeout: 60000 });
  console.log("Conversion successful! Triggering download...");

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 60000 }), // wait for download to start
    page.click('a:has-text("Download File")')
  ]);
  
  console.log(`Download started: ${download.suggestedFilename()}`);
  
  const downloadPath = path.join(__dirname, 'downloaded_' + download.suggestedFilename());
  await download.saveAs(downloadPath);
  console.log(`Saved as: ${downloadPath}`);
  
  await browser.close();
})();
