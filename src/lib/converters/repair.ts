import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker is available for pdf.js
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export type RepairResult = {
  blob: Blob;
  strategyUsed: 'tier1-pdflib' | 'tier2-rasterize';
};

/**
 * Attempts to repair a corrupted PDF document.
 */
export async function repairPdf(
  file: File,
  onProgress?: (msg: string, progress: number) => void
): Promise<RepairResult> {
  onProgress?.("Analyzing file...", 5);
  const arrayBuffer = await file.arrayBuffer();
  
  // TIER 1: Try pdf-lib structural rebuild
  try {
    onProgress?.("Attempting structural repair...", 15);
    // ignoreEncryption allows pdf-lib to bypass some malformed dictionaries
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    
    // Saving it inherently rebuilds the XRef tables and object streams
    const repairedBytes = await pdfDoc.save();
    
    onProgress?.("Structural repair successful!", 100);
    return {
      blob: new Blob([repairedBytes as unknown as BlobPart], { type: 'application/pdf' }),
      strategyUsed: 'tier1-pdflib'
    };
  } catch (err) {
    console.warn("Tier 1 structural repair failed. Falling back to Tier 2 rasterization.", err);
  }

  // TIER 2: Fallback to pdf.js rasterization
  // pdf.js is highly resilient to corruption and will often render what pdf-lib rejects
  onProgress?.("Structural repair failed. Starting deep image reconstruction...", 25);
  
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    if (numPages === 0) {
      throw new Error("The PDF is completely empty or completely unreadable.");
    }
    if (numPages > 50) {
      throw new Error("This file has more than 50 pages. Deep reconstruction is too memory-intensive for files this large in the browser.");
    }

    const finalPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      onProgress?.(`Reconstructing page ${i} of ${numPages}...`, 25 + ((i - 1) / numPages) * 70);
      
      const page = await pdfDoc.getPage(i);
      
      // Use scale 2.0 to maintain crispness when rasterizing
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context.");
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // @ts-ignore
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      
      // We use JPEG for smaller file size on the resulting PDF since we are rasterizing
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Embed into new PDF
      const img = await finalPdf.embedJpg(imageDataUrl);
      
      // Create a page with the original dimensions (not the 2.0 scale dimensions)
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPage = finalPdf.addPage([originalViewport.width, originalViewport.height]);
      
      newPage.drawImage(img, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });

      page.cleanup();
      canvas.width = 0;
      canvas.height = 0;
    }

    onProgress?.("Finalizing rebuilt document...", 98);
    const finalBytes = await finalPdf.save();
    
    onProgress?.("Reconstruction complete!", 100);
    return {
      blob: new Blob([finalBytes as unknown as BlobPart], { type: 'application/pdf' }),
      strategyUsed: 'tier2-rasterize'
    };

  } catch (fallbackErr: any) {
    console.error("Both repair tiers failed.", fallbackErr);
    throw new Error(`The file is too corrupted to be repaired in the browser: ${fallbackErr.message || "Unknown error"}`);
  }
}
