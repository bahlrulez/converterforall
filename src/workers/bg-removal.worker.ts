import { pipeline, env, RawImage } from "@huggingface/transformers";
import { removeBackground } from "@imgly/background-removal";

// Configure Hugging Face Transformers.js environment
env.allowLocalModels = false;

let rmbgPipeline: any = null;

async function removeWithBriaRMBG(file: File): Promise<Blob> {
  if (!rmbgPipeline) {
    rmbgPipeline = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
      device: "webgpu",
    });
  }

  const image = await RawImage.fromBlob(file);
  const output = await rmbgPipeline(image);
  
  if (!output || !output[0] || !output[0].mask) {
    throw new Error("RMBG failed to produce a valid mask");
  }

  const mask = output[0].mask;
  const resultImage = image.clone().rgba().putAlpha(mask);
  return await resultImage.toBlob("image/png");
}

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
        if (a >= 75) {
          // Foreground core (jackets, skin, hair, clothes) -> 100% solid opacity
          data[i + 3] = 255;
        } else if (a > 12) {
          // Smooth edge feathering curve
          const norm = (a - 12) / 63;
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
  
  // 1. Try High-Precision BRIA RMBG-1.4 model
  try {
    const briaBlob = await removeWithBriaRMBG(file);
    self.postMessage({ id, success: true, blob: briaBlob, model: "bria-rmbg-1.4" });
    return;
  } catch (briaError) {
    console.warn("BRIA RMBG-1.4 failed or unsupported, falling back to refined ISNet engine:", briaError);
  }

  // 2. Fallback to ISNet with Studio Alpha Refinement
  try {
    const validModel = (quality === "isnet" || quality === "isnet_fp16" || quality === "isnet_quint8") ? quality : "isnet_fp16";
    const rawBlob = await removeBackground(file, { 
      model: validModel,
      proxyToWorker: false
    });
    
    // Apply studio-grade alpha mask solidifying
    const refinedBlob = await refineAlphaMask(rawBlob);
    self.postMessage({ id, success: true, blob: refinedBlob, model: "isnet-refined" });
  } catch (fallbackError: any) {
    self.postMessage({ id, success: false, error: fallbackError?.message || String(fallbackError) || "Failed to remove background" });
  }
});
