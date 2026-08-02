const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));

  await page.goto('http://localhost:3000/mp4-to-mp3');
  
  await page.evaluate(() => {
    // wait for ffmpeg to be defined if it's dynamic, but it's bundled.
    // Instead, let's intercept Worker
    const OriginalWorker = window.Worker;
    window.Worker = function(url, options) {
      console.log(`Intercepted new Worker: ${url}, options: ${JSON.stringify(options)}`);
      return new OriginalWorker(url, options);
    };
  });

  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test.mp4',
    mimeType: 'video/mp4',
    buffer: Buffer.from('')
  });

  await page.click('button:has-text("Extract Audio")');

  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
