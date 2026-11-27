export type EditableImageMime = "image/jpeg" | "image/png" | "image/webp";
export type ImageFormatChoice = "original" | EditableImageMime;

export interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderedImageResult {
  blob: Blob;
  width: number;
  height: number;
  mime: EditableImageMime;
  ext: string;
}

const MIME_TO_EXT: Record<EditableImageMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Resolve output MIME type and file extension from a source File and user choice. */
export function resolveImageFormat(
  file: File,
  choice: ImageFormatChoice
): { mime: EditableImageMime; ext: string } {
  if (choice !== "original") {
    return { mime: choice, ext: MIME_TO_EXT[choice] };
  }
  const lower = file.name.toLowerCase();
  if (file.type === "image/png" || lower.endsWith(".png")) {
    return { mime: "image/png", ext: "png" };
  }
  if (file.type === "image/webp" || lower.endsWith(".webp")) {
    return { mime: "image/webp", ext: "webp" };
  }
  return { mime: "image/jpeg", ext: "jpg" };
}

/** Load an image element from an object URL or data URL. */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the selected image."));
    img.src = src;
  });
}

/** Format byte size into a compact KB or MB label. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/** Build a clean output filename with a descriptive suffix and extension. */
export function buildEditedFilename(originalName: string, suffix: string, ext: string): string {
  const dotIdx = originalName.lastIndexOf(".");
  const base = dotIdx > 0 ? originalName.slice(0, dotIdx) : originalName;
  const safeBase = base.trim() || "image";
  return `${safeBase}-${suffix}.${ext}`;
}

/** Export an HTML5 canvas to a typed Blob. */
export function exportCanvasBlob(
  canvas: HTMLCanvasElement,
  mime: EditableImageMime,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const clampedQuality = Math.min(1, Math.max(0.1, quality));
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Browser failed to encode the output image."));
          return;
        }
        resolve(blob);
      },
      mime,
      mime === "image/png" ? undefined : clampedQuality
    );
  });
}

function getRotatedBoundingBox(width: number, height: number, rotationDeg: number) {
  const rotRad = (rotationDeg * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/** Render a cropped, rotated, and flipped image region onto an offscreen canvas. */
export async function renderCroppedImage(options: {
  imageSrc: string;
  cropArea: PixelArea;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  mime: EditableImageMime;
  quality: number;
}): Promise<RenderedImageResult> {
  const {
    imageSrc,
    cropArea,
    rotation = 0,
    flipH = false,
    flipV = false,
    mime,
    quality,
  } = options;

  const image = await loadImageElement(imageSrc);
  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = getRotatedBoundingBox(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    rotation
  );

  const transformCanvas = document.createElement("canvas");
  transformCanvas.width = Math.max(1, Math.round(bBoxWidth));
  transformCanvas.height = Math.max(1, Math.round(bBoxHeight));
  const tCtx = transformCanvas.getContext("2d");
  if (!tCtx) {
    throw new Error("Canvas 2D context is not available in this browser.");
  }

  tCtx.translate(transformCanvas.width / 2, transformCanvas.height / 2);
  tCtx.rotate(rotRad);
  tCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  tCtx.translate(
    -(image.naturalWidth || image.width) / 2,
    -(image.naturalHeight || image.height) / 2
  );
  tCtx.drawImage(image, 0, 0);

  const outWidth = Math.max(1, Math.round(cropArea.width));
  const outHeight = Math.max(1, Math.round(cropArea.height));
  const sx = Math.max(0, Math.round(cropArea.x));
  const sy = Math.max(0, Math.round(cropArea.y));
  const sw = Math.max(1, Math.min(outWidth, transformCanvas.width - sx));
  const sh = Math.max(1, Math.min(outHeight, transformCanvas.height - sy));

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = sw;
  outputCanvas.height = sh;
  const oCtx = outputCanvas.getContext("2d");
  if (!oCtx) {
    throw new Error("Canvas 2D context is not available in this browser.");
  }

  if (mime === "image/jpeg") {
    oCtx.fillStyle = "#ffffff";
    oCtx.fillRect(0, 0, sw, sh);
  }
  oCtx.drawImage(transformCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  const blob = await exportCanvasBlob(outputCanvas, mime, quality);
  return {
    blob,
    width: sw,
    height: sh,
    mime,
    ext: MIME_TO_EXT[mime],
  };
}

/** Resize an image to exact pixel dimensions on an HTML5 canvas. */
export async function renderResizedImage(options: {
  imageSrc: string;
  targetWidth: number;
  targetHeight: number;
  mime: EditableImageMime;
  quality: number;
}): Promise<RenderedImageResult> {
  const { imageSrc, targetWidth, targetHeight, mime, quality } = options;
  const width = Math.max(1, Math.min(12000, Math.round(targetWidth)));
  const height = Math.max(1, Math.min(12000, Math.round(targetHeight)));

  const image = await loadImageElement(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is not available in this browser.");
  }

  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);

  const blob = await exportCanvasBlob(canvas, mime, quality);
  return {
    blob,
    width,
    height,
    mime,
    ext: MIME_TO_EXT[mime],
  };
}
