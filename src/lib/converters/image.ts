import heic2any from "heic2any";
import { removeBackground } from "@imgly/background-removal";

export async function removeImageBackground(file: File): Promise<Blob> {
  const blob = await removeBackground(file);
  return blob;
}

export async function processImage(file: File, targetFormat: string): Promise<Blob> {
  // Map target formats to proper MIME types
  let mimeType = `image/${targetFormat.toLowerCase()}`;
  if (targetFormat.toLowerCase() === "jpg") mimeType = "image/jpeg";

  if (file.name.toLowerCase().endsWith(".heic")) {
    // Handle HEIC completely client-side using heic2any WASM decoder
    const converted = await heic2any({
      blob: file,
      toType: mimeType,
      quality: 1
    });
    
    return Array.isArray(converted) ? converted[0] : converted;
  } else {
    // Perform 100% Client-Side Conversion using HTML5 Canvas for standard formats
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image into canvas."));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context is not supported in this browser.");
    }

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Convert the canvas to the new format
    const blob = await new Promise<Blob | null>((resolve) => {
      // High quality output
      canvas.toBlob(
        (b) => resolve(b),
        mimeType,
        1.0 
      );
    });

    URL.revokeObjectURL(objectUrl);

    if (!blob) {
      throw new Error(`Browser failed to encode the image to ${targetFormat.toUpperCase()}.`);
    }

    return blob;
  }
}
