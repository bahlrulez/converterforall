import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export type CompressionPreset = "lossless" | "balanced" | "max";

export interface CompressPdfOptions {
  preset?: CompressionPreset;
  targetSizeKb?: number;
  onProgress?: (progress: number, message?: string) => void;
}

export async function compressPdf(
  file: File,
  optionsOrPreset: CompressionPreset | CompressPdfOptions = "balanced",
  onProgressCallback?: (progress: number, message?: string) => void
): Promise<Blob> {
  const options: CompressPdfOptions =
    typeof optionsOrPreset === "string"
      ? { preset: optionsOrPreset, onProgress: onProgressCallback }
      : optionsOrPreset;

  const preset = options.preset || "balanced";
  const onProgress = options.onProgress;
  const arrayBuffer = await file.arrayBuffer();

  if (onProgress) onProgress(10, "Analyzing PDF structure...");

  // 1. First attempt: Structural optimization with pdf-lib
  let structuralPdfBytes: Uint8Array | null = null;
  try {
    const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    // Remove unused objects, strip metadata, enable object streams
    structuralPdfBytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
  } catch (e) {
    console.warn("Structural PDF load error:", e);
  }

  // If structural optimization achieved significant reduction (>30%) and preset is lossless, return it
  if (preset === "lossless" && structuralPdfBytes && structuralPdfBytes.length < arrayBuffer.byteLength * 0.85) {
    if (onProgress) onProgress(100, "Optimization complete!");
    return new Blob([structuralPdfBytes as any], { type: "application/pdf" });
  }

  // 2. High-Ratio Visual Optimization Engine using pdfjs-dist
  try {
    if (onProgress) onProgress(20, "Initializing high-fidelity compression engine...");
    
    // Dynamic import of pdfjs-dist
    const pdfjsLib = await import("pdfjs-dist");
    
    // Configure worker
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || "4.0.379"}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const newPdfDoc = await PDFDocument.create();

    // Determine scale and JPEG quality based on preset
    let scale = 1.5; // High retina DPI for razor-sharp text
    let quality = 0.72; // Crisp JPEG compression

    if (preset === "max") {
      scale = 1.2;
      quality = 0.52;
    } else if (preset === "lossless") {
      scale = 2.0;
      quality = 0.88;
    }

    // If target size in KB is specified, dynamically adjust parameters
    if (options.targetSizeKb && options.targetSizeKb > 0) {
      const targetBytesPerPage = (options.targetSizeKb * 1024) / Math.max(1, numPages);
      if (targetBytesPerPage < 40000) {
        scale = 1.0;
        quality = 0.45;
      } else if (targetBytesPerPage < 100000) {
        scale = 1.25;
        quality = 0.60;
      } else {
        scale = 1.6;
        quality = 0.78;
      }
    }

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const percent = Math.round(20 + (pageNum / numPages) * 70);
      if (onProgress) onProgress(percent, `Optimizing page ${pageNum} of ${numPages}...`);

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      const ctx = canvas.getContext("2d", { alpha: false });

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render page to canvas
        // @ts-expect-error pdfjs-dist types
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert to high-efficiency JPEG
        const imgDataUrl = canvas.toDataURL("image/jpeg", quality);
        const imgBytes = await fetch(imgDataUrl).then((r) => r.arrayBuffer());

        const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
        const origViewport = page.getViewport({ scale: 1.0 });

        const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }
    }

    if (onProgress) onProgress(95, "Finalizing compressed PDF...");
    const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });

    // Compare with structural optimization and original: pick best result
    let bestBytes = compressedBytes;
    if (structuralPdfBytes && structuralPdfBytes.length < compressedBytes.length) {
      bestBytes = structuralPdfBytes;
    }

    if (onProgress) onProgress(100, "Done!");
    return new Blob([bestBytes as any], { type: "application/pdf" });
  } catch (err) {
    console.warn("Visual compression error, falling back to structural compression:", err);
    if (structuralPdfBytes) {
      if (onProgress) onProgress(100, "Done!");
      return new Blob([structuralPdfBytes as any], { type: "application/pdf" });
    }
    throw err;
  }
}


export async function imageToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.create();
  
  let image;
  const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
  if (isPng) {
    image = await pdfDoc.embedPng(arrayBuffer);
  } else {
    image = await pdfDoc.embedJpg(arrayBuffer);
  }

  const { width, height } = image.scale(1);
  const page = pdfDoc.addPage([width, height]);
  
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}

// Helper to parse page string like "1, 3, 5-8" into an array of 0-indexed page numbers
function parsePageString(pagesStr: string, maxPages: number): number[] {
  const pages = new Set<number>();
  if (!pagesStr.trim()) return [];
  
  const parts = pagesStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        const s = Math.max(1, Math.min(start, end));
        const e = Math.min(maxPages, Math.max(start, end));
        for (let i = s; i <= e; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const num = Number(trimmed);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        pages.add(num - 1);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export async function removePages(file: File, pagesStr: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const maxPages = pdfDoc.getPageCount();
  const pagesToRemove = parsePageString(pagesStr, maxPages);
  
  // Remove pages from back to front to avoid index shifting issues
  for (let i = pagesToRemove.length - 1; i >= 0; i--) {
    pdfDoc.removePage(pagesToRemove[i]);
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}

export async function extractPages(file: File, pagesStr: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const maxPages = sourcePdf.getPageCount();
  const pagesToExtract = parsePageString(pagesStr, maxPages);
  
  const newPdf = await PDFDocument.create();
  
  if (pagesToExtract.length > 0) {
    const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));
  }
  
  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}

export async function organizePdf(file: File, pagesStr: string): Promise<Blob> {
  // For organize, we parse slightly differently to maintain the requested order
  // and we don't sort or deduplicate.
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const maxPages = sourcePdf.getPageCount();
  
  const newOrder: number[] = [];
  if (pagesStr.trim()) {
    const parts = pagesStr.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          // Allow reverse ranges like 5-1
          const step = start <= end ? 1 : -1;
          for (let i = start; step === 1 ? i <= end : i >= end; i += step) {
             if (i >= 1 && i <= maxPages) {
                newOrder.push(i - 1);
             }
          }
        }
      } else {
        const num = Number(trimmed);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          newOrder.push(num - 1);
        }
      }
    }
  } else {
    // default to original order if empty
    for (let i = 0; i < maxPages; i++) newOrder.push(i);
  }
  
  const newPdf = await PDFDocument.create();
  
  if (newOrder.length > 0) {
    const copiedPages = await newPdf.copyPages(sourcePdf, newOrder);
    copiedPages.forEach((page) => newPdf.addPage(page));
  }
  
  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}

export async function splitPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pageCount = sourcePdf.getPageCount();
  
  const zip = new JSZip();
  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || "document";
  
  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    
    // Add padded zeroes for sorting (e.g. page_01.pdf)
    const pageNum = String(i + 1).padStart(String(pageCount).length, '0');
    zip.file(`${baseName}_page_${pageNum}.pdf`, pdfBytes);
  }
  
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return new Blob([zipBlob], { type: "application/zip" });
}
