export type BgRemovalQuality = "isnet_quint8" | "isnet_fp16" | "isnet";

export async function removeImageBackground(file: File, quality: BgRemovalQuality = "isnet_fp16"): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("Cannot run background removal on the server.");
  }

  // 1. Attempt running in dedicated Web Worker
  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      const worker = new Worker(new URL("../../workers/bg-removal.worker", import.meta.url), { type: "module" });
      const id = Math.random().toString(36).substring(2, 11);

      worker.onmessage = (e) => {
        const data = e.data;
        if (data.id === id) {
          worker.terminate();
          if (data.success && data.blob) {
            resolve(data.blob);
          } else {
            reject(new Error(data.error || "Failed to remove background"));
          }
        }
      };

      worker.onerror = (err) => {
        worker.terminate();
        reject(err);
      };

      worker.postMessage({ file, quality, id });
    });

    return blob;
  } catch (workerErr) {
    console.warn("Worker background removal failed, attempting main thread fallback:", workerErr);
    // 2. Direct resilient fallback in main thread
    const { removeBackground } = await import("@imgly/background-removal");
    const validModel = (quality === "isnet" || quality === "isnet_fp16" || quality === "isnet_quint8") ? quality : "isnet_fp16";
    const rawBlob = await removeBackground(file, {
      model: validModel,
      proxyToWorker: false
    });
    
    // In-browser canvas alpha refinement
    try {
      const img = new Image();
      const url = URL.createObjectURL(rawBlob);
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a > 0) {
            if (a >= 80) {
              data[i + 3] = 255;
            } else if (a > 12) {
              const norm = (a - 12) / 68;
              data[i + 3] = Math.min(255, Math.round(255 * Math.pow(norm, 0.45)));
            } else {
              data[i + 3] = 0;
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const refinedBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
        URL.revokeObjectURL(url);
        if (refinedBlob) return refinedBlob;
      }
    } catch {
      // Return raw blob if refinement fails
    }
    return rawBlob;
  }
}

export async function processImage(file: File, targetFormat: string): Promise<Blob> {
  // Map target formats to proper MIME types
  let mimeType = `image/${targetFormat.toLowerCase()}`;
  if (targetFormat.toLowerCase() === "jpg") mimeType = "image/jpeg";

  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif") || file.type.includes("heic") || file.type.includes("heif");

  if (isHeic) {
    // Handle HEIC/HEIF completely client-side using heic2any WASM decoder
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
