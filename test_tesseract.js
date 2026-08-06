const Tesseract = require('tesseract.js');
async function test() {
  const worker = await Tesseract.createWorker('eng');
  console.log(worker.recognize.toString());
  await worker.terminate();
}
test().catch(console.error);
