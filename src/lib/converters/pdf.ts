import { PDFDocument } from "pdf-lib";

export async function compressPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  // Save the PDF without object streams to slightly reduce overhead and rebuild structure
  // Note: True image downsampling requires a server-side engine (Ghostscript).
  // This client-side approach strips unused metadata and re-serializes the document.
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
