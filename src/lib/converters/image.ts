export type BgRemovalQuality = "isnet_quint8" | "isnet_fp16" | "isnet";

export async function removeImageBackground(file: File, quality: BgRemovalQuality = "isnet_fp16"): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(file, { model: quality });
  return blob;
}

export async function processImage(file: File, targetFormat: string): Promise<Blob> {
  // Map target formats to proper MIME types
  let mimeType = `image/${targetFormat.toLowerCase()}`;
  if (targetFormat.toLowerCase() === "jpg") mimeType = "image/jpeg";

  if (file.name.toLowerCase().endsWith(".heic")) {
    // Handle HEIC completely client-side using heic2any WASM decoder
    const heic2any = (await import("heic2any")).default;
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

export async function compressImageFile(file: File, qualityPercentage: number = 80): Promise<Blob> {
  const imageCompression = (await import("browser-image-compression")).default;
  // Convert quality percentage (0-100) to decimal (0.01-1.0)
  const decimalQuality = Math.max(0.01, qualityPercentage / 100);

  const options = {
    maxSizeMB: Number.POSITIVE_INFINITY,
    useWebWorker: true,
    initialQuality: decimalQuality,
    alwaysKeepResolution: true,
    fileType: file.type // ensures PNG stays PNG
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    
    // Fallback: If compression somehow increases the file size (common with already optimized PNGs), 
    // just return the original file.
    if (compressedFile.size >= file.size) {
      return file;
    }
    
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw new Error("Failed to compress the image.");
  }
}
