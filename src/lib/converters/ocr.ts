import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Initialize the worker globally for browser environments
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  // Try to match the exact installed version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function processOcrPdf(
  file: File,
  onProgress?: (msg: string, progress: number) => void
): Promise<Blob> {
  onProgress?.("Reading PDF...", 5);
  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF via pdf.js
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) {
    throw new Error("The PDF is empty.");
  }
  if (numPages > 50) {
    throw new Error("This file has more than 50 pages. Client-side OCR is too memory-intensive for files this large.");
  }

  onProgress?.("Initializing AI Models...", 10);
  
  // Tesseract logger updates progress quickly
  let currentPage = 1;
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        // Tesseract progress goes 0 to 1 for each page
        // We calculate global progress based on current page
        const baseProgress = 10 + ((currentPage - 1) / numPages) * 85;
        const pageProgress = m.progress * (85 / numPages);
        onProgress?.(`Running OCR on page ${currentPage} of ${numPages}...`, Math.min(95, baseProgress + pageProgress));
      }
    }
  });

  const finalPdf = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    currentPage = i;
    onProgress?.(`Extracting page ${i} of ${numPages}...`, 10 + ((i - 1) / numPages) * 85);
    
    // 1. Render page to Canvas
    const page = await pdfDoc.getPage(i);
    // Scale up for better OCR accuracy. 2.0 is usually a good balance between accuracy and performance
    const viewport = page.getViewport({ scale: 2.0 });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not create canvas context.");
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // @ts-ignore - newer pdf.js typings might strictly require different params but canvasContext works
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    
    // Convert to Image URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Cleanup memory
    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;

    // 2. Run Tesseract to generate a 1-page PDF
    const result = await worker.recognize(imageDataUrl, { pdfTitle: `Scanned Page ${i}` }, { pdf: true });
    const pdfBytes = result.data.pdf;
    
    if (!pdfBytes) {
      throw new Error(`Failed to generate searchable layer for page ${i}`);
    }

    // 3. Load the 1-page PDF and copy into final document
    const tempDoc = await PDFDocument.load(new Uint8Array(pdfBytes));
    const copiedPages = await finalPdf.copyPages(tempDoc, tempDoc.getPageIndices());
    copiedPages.forEach(p => finalPdf.addPage(p));
  }

  onProgress?.("Finalizing Document...", 98);
  await worker.terminate();

  // Save the final PDF
  const finalBytes = await finalPdf.save();
  onProgress?.("Complete!", 100);

  return new Blob([finalBytes as unknown as BlobPart], { type: 'application/pdf' });
}
