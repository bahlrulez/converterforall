import { compress } from "@quicktoolsone/pdf-compress";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export type CompressionPreset = "lossless" | "balanced" | "max";

export async function compressPdf(
  file: File, 
  preset: CompressionPreset = "balanced",
  onProgress?: (progress: number, message?: string) => void
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  const result = await compress(arrayBuffer, {
    preset,
    onProgress: (event) => {
      if (onProgress) {
        onProgress(event.progress, event.message);
      }
    }
  });

  return new Blob([result.pdf], { type: "application/pdf" });
}

export async function imageToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.create();
  
  let image;
  if (file.type === "image/png") {
    image = await pdfDoc.embedPng(arrayBuffer);
  } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
    image = await pdfDoc.embedJpg(arrayBuffer);
  } else {
    throw new Error("Unsupported image format for PDF conversion. Only JPG and PNG are supported.");
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
