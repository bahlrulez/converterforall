const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));
  page.on('request', request => {
    if (request.url().includes('ffmpeg')) {
      console.log(`>> GET ${request.url()}`);
    }
  });
  page.on('response', response => {
    if (response.url().includes('ffmpeg')) {
      console.log(`<< ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('http://localhost:3000/test-ffmpeg.html');
  console.log("Waiting 10 seconds...");
  await new Promise(r => setTimeout(r, 10000));
  await browser.close();
})();
