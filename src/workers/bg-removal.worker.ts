import { removeBackground } from "@imgly/background-removal";

async function refineAlphaMask(blob: Blob): Promise<Blob> {
  try {
    if (typeof createImageBitmap === "undefined" || typeof OffscreenCanvas === "undefined") {
      return blob;
    }

    const imageBitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return blob;

    ctx.drawImage(imageBitmap, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Solidify foreground clothing and body elements while preserving anti-aliased edges
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a > 0) {
        if (a >= 80) {
          // Foreground core (jackets, skin, hair, clothes) -> 100% solid opacity
          data[i + 3] = 255;
        } else if (a > 12) {
          // Smooth edge feathering curve
          const norm = (a - 12) / 68;
          data[i + 3] = Math.min(255, Math.round(255 * Math.pow(norm, 0.45)));
        } else {
          // Pure transparent background
          data[i + 3] = 0;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return await canvas.convertToBlob({ type: "image/png" });
  } catch (err) {
    console.warn("Alpha refinement fallback to raw blob:", err);
    return blob;
  }
}

self.addEventListener("message", async (e: MessageEvent) => {
  const { file, quality, id } = e.data;
  
  try {
    const validModel = (quality === "isnet" || quality === "isnet_fp16" || quality === "isnet_quint8") ? quality : "isnet_fp16";
    const rawBlob = await removeBackground(file, { 
      model: validModel,
      proxyToWorker: false
    });
    
    // Apply studio-grade alpha mask solidifying
    const refinedBlob = await refineAlphaMask(rawBlob);
    self.postMessage({ id, success: true, blob: refinedBlob });
  } catch (error: any) {
    self.postMessage({ id, success: false, error: error?.message || String(error) || "Failed to remove background" });
  }
});
