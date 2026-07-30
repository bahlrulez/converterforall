import { compress } from "@quicktoolsone/pdf-compress";
import { PDFDocument } from "pdf-lib";

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
