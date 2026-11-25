"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";
type CropRect = { x: number; y: number; width: number; height: number };
type GifFrame = { id: string; file: File; url: string };

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_EDGE = 8192;
const MAX_PIXELS = 24_000_000;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
const buttonClass = "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50";
const secondaryClass = "rounded-lg border border-border px-3 py-2 text-sm font-medium disabled:opacity-50";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function outputExtension(format: OutputFormat): string {
  return format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The browser could not decode this image."));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error("The browser could not create the selected output format."));
      } else if (blob.type !== format) {
        reject(new Error("This browser does not support the selected output format. Choose PNG or another format."));
      } else {
        resolve(blob);
      }
    }, format, format === "image/png" ? undefined : quality);
  });
}

function validateImageFile(file: File): string | null {
  if (file.size > MAX_FILE_BYTES) return "Choose an image smaller than 25 MB.";
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPG, PNG or WEBP image.";
  return null;
}

function safeOutputSize(width: number, height: number): { width: number; height: number } {
  const scale = Math.min(1, MAX_EDGE / width, MAX_EDGE / height, Math.sqrt(MAX_PIXELS / (width * height)));
  return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)) };
}

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("1200");
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(88);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputInfo, setOutputInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);
  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  const aspectRatio = sourceSize.width > 0 ? sourceSize.width / sourceSize.height : 1;

  const chooseFile = async (nextFile?: File) => {
    if (!nextFile) return;
    const problem = validateImageFile(nextFile);
    if (problem) { setError(problem); return; }
    const url = URL.createObjectURL(nextFile);
    try {
      const image = await loadImage(url);
      setFile(nextFile);
      setSourceSize({ width: image.naturalWidth, height: image.naturalHeight });
      setWidth(String(image.naturalWidth));
      setHeight(String(image.naturalHeight));
      setImageUrl(url);
      setOutputUrl("");
      setOutputInfo(null);
      setError("");
    } catch (cause) {
      URL.revokeObjectURL(url);
      setError(cause instanceof Error ? cause.message : "Could not read this image.");
    }
  };

  const updateWidth = (value: string) => {
    setWidth(value);
    const next = Number(value);
    if (lockRatio && Number.isFinite(next) && next > 0) setHeight(String(Math.max(1, Math.round(next / aspectRatio))));
  };
  const updateHeight = (value: string) => {
    setHeight(value);
    const next = Number(value);
    if (lockRatio && Number.isFinite(next) && next > 0) setWidth(String(Math.max(1, Math.round(next * aspectRatio))));
  };

  const resizeImage = async () => {
    if (!file || !imageUrl) return;
    setBusy(true);
    setError("");
    try {
      const outputWidth = Math.round(Number(width));
      const outputHeight = Math.round(Number(height));
      if (!Number.isFinite(outputWidth) || !Number.isFinite(outputHeight) ||
          outputWidth < 1 || outputHeight < 1 || outputWidth > MAX_EDGE ||
          outputHeight > MAX_EDGE || outputWidth * outputHeight > MAX_PIXELS) {
        throw new Error("Output must be no more than 8,192 pixels per side and 24 megapixels total.");
      }
      if (lockRatio && Math.abs(outputWidth / outputHeight - aspectRatio) > 0.01) {
        throw new Error("The entered dimensions do not match the source aspect ratio. Update a dimension or unlock the ratio.");
      }
      const image = await loadImage(imageUrl);
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, outputWidth, outputHeight);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, outputWidth, outputHeight);
      const blob = await canvasToBlob(canvas, format, quality / 100);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputInfo({ width: outputWidth, height: outputHeight, size: blob.size });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image resizing failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div><h2 className="text-lg font-semibold">Resize an image to custom pixel dimensions</h2><p className="mt-1 text-sm text-muted-foreground">Choose a JPG, PNG or WEBP image, set the output width and height, then export the resized image.</p></div>
      <label className="block space-y-2"><span className="text-sm font-medium">Source image · maximum 25 MB</span><input className={inputClass} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={event => void chooseFile(event.target.files?.[0])} /></label>
      {file && <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-xl bg-muted/40 p-3"><p className="text-sm font-semibold">Original</p><img src={imageUrl} alt="Original upload" className="max-h-64 w-full rounded-lg object-contain" /><p className="text-xs text-muted-foreground">{sourceSize.width} × {sourceSize.height} px · {formatBytes(file.size)}</p></div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm"><span className="font-medium">Width (px)</span><input className={inputClass} type="number" min="1" max={MAX_EDGE} value={width} onChange={event => updateWidth(event.target.value)} /></label>
            <label className="space-y-1 text-sm"><span className="font-medium">Height (px)</span><input className={inputClass} type="number" min="1" max={MAX_EDGE} value={height} onChange={event => updateHeight(event.target.value)} /></label>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lockRatio} onChange={event => setLockRatio(event.target.checked)} /> Lock aspect ratio</label>
          <label className="block space-y-1 text-sm"><span className="font-medium">Output format</span><select className={inputClass} value={format} onChange={event => setFormat(event.target.value as OutputFormat)}><option value="image/jpeg">JPG / JPEG</option><option value="image/png">PNG</option><option value="image/webp">WEBP</option></select></label>
          {format !== "image/png" && <label className="block space-y-1 text-sm"><span className="flex justify-between"><span className="font-medium">Quality</span><span>{quality}%</span></span><input className="w-full" type="range" min="10" max="100" value={quality} onChange={event => setQuality(Number(event.target.value))} /></label>}
          <button className={buttonClass} type="button" disabled={busy} onClick={() => void resizeImage()}>{busy ? "Resizing…" : "Resize image"}</button>
          <p className="text-xs text-muted-foreground">Maximum output: 8,192 px per side and 24 megapixels. Resampling can change detail. JPG uses white for transparent areas.</p>
        </div>
      </div>}
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {outputUrl && outputInfo && <div className="space-y-3 rounded-xl border border-border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">Resized output</p><p className="text-xs text-muted-foreground">{outputInfo.width} × {outputInfo.height} px · {formatBytes(outputInfo.size)}</p></div><img src={outputUrl} alt="Resized output" className="max-h-72 w-full rounded-lg bg-muted/30 object-contain" /><a className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" href={outputUrl} download={"resized-image." + outputExtension(format)}>Download resized image</a></div>}
    </section>
  );
}

export function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [ratioChoice, setRatioChoice] = useState("1:1");
  const [customWidth, setCustomWidth] = useState("4");
  const [customHeight, setCustomHeight] = useState("3");
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(90);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputInfo, setOutputInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);
  useEffect(() => () => { if (outputUrl) URL.revokeObjectURL(outputUrl); }, [outputUrl]);

  const aspect = useMemo(() => {
    if (ratioChoice === "free") return undefined;
    if (ratioChoice === "custom") return Math.max(1, Number(customWidth) || 1) / Math.max(1, Number(customHeight) || 1);
    const [w, h] = ratioChoice.split(":").map(Number);
    return w / h;
  }, [ratioChoice, customWidth, customHeight]);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => setCropArea(pixels), []);

  const chooseFile = async (nextFile?: File) => {
    if (!nextFile) return;
    const problem = validateImageFile(nextFile);
    if (problem) { setError(problem); return; }
    const url = URL.createObjectURL(nextFile);
    try {
      await loadImage(url);
      setFile(nextFile);
      setImageUrl(url);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropArea(null);
      setOutputUrl("");
      setOutputInfo(null);
      setError("");
    } catch (cause) {
      URL.revokeObjectURL(url);
      setError(cause instanceof Error ? cause.message : "Could not read this image.");
    }
  };

  const cropImage = async () => {
    if (!file || !imageUrl || !cropArea) { setError("Choose an image and adjust the crop selection before exporting."); return; }
    setBusy(true);
    setError("");
    try {
      const image = await loadImage(imageUrl);
      const cropWidth = Math.max(1, Math.round(cropArea.width));
      const cropHeight = Math.max(1, Math.round(cropArea.height));
      const output = safeOutputSize(cropWidth, cropHeight);
      const canvas = document.createElement("canvas");
      canvas.width = output.width;
      canvas.height = output.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, output.width, output.height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, output.width, output.height);
      const blob = await canvasToBlob(canvas, format, quality / 100);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputInfo({ width: output.width, height: output.height, size: blob.size });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image cropping failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div><h2 className="text-lg font-semibold">Crop an image with a movable selection</h2><p className="mt-1 text-sm text-muted-foreground">Drag the image to position the crop, adjust zoom and choose a preset or custom aspect ratio.</p></div>
      <label className="block space-y-2"><span className="text-sm font-medium">Source image · maximum 25 MB</span><input className={inputClass} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={event => void chooseFile(event.target.files?.[0])} /></label>
      {imageUrl && <div className="space-y-4">
        <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-slate-950"><Cropper image={imageUrl} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} restrictPosition /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm"><span className="font-medium">Aspect ratio</span><select className={inputClass} value={ratioChoice} onChange={event => { setRatioChoice(event.target.value); setCropArea(null); }}><option value="free">Free crop</option><option value="1:1">Square · 1:1</option><option value="4:3">Landscape · 4:3</option><option value="3:2">Photo · 3:2</option><option value="16:9">Widescreen · 16:9</option><option value="4:5">Portrait · 4:5</option><option value="3:4">Portrait · 3:4</option><option value="custom">Custom ratio</option></select></label>
          <label className="space-y-1 text-sm"><span className="font-medium">Zoom · {zoom.toFixed(1)}×</span><input className="w-full" type="range" min="1" max="3" step="0.1" value={zoom} onChange={event => { setZoom(Number(event.target.value)); setCropArea(null); }} /></label>
        </div>
        {ratioChoice === "custom" && <div className="grid grid-cols-2 gap-3"><label className="space-y-1 text-sm">Ratio width<input className={inputClass} type="number" min="1" max="100" value={customWidth} onChange={event => { setCustomWidth(event.target.value); setCropArea(null); }} /></label><label className="space-y-1 text-sm">Ratio height<input className={inputClass} type="number" min="1" max="100" value={customHeight} onChange={event => { setCustomHeight(event.target.value); setCropArea(null); }} /></label></div>}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm"><span className="font-medium">Output format</span><select className={inputClass} value={format} onChange={event => setFormat(event.target.value as OutputFormat)}><option value="image/png">PNG</option><option value="image/jpeg">JPG / JPEG</option><option value="image/webp">WEBP</option></select></label>
          {format !== "image/png" && <label className="space-y-1 text-sm"><span className="font-medium">Quality · {quality}%</span><input className="w-full" type="range" min="10" max="100" value={quality} onChange={event => setQuality(Number(event.target.value))} /></label>}
        </div>
        <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} disabled={busy} onClick={() => void cropImage()}>{busy ? "Cropping…" : "Crop image"}</button><button type="button" className={secondaryClass} onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); setCropArea(null); }}>Reset crop</button></div>
        <p className="text-xs text-muted-foreground">Large crop outputs are scaled down to at most 8,192 pixels per side and 24 megapixels. JPEG uses white for transparent areas; PNG and WEBP can retain alpha.</p>
      </div>}
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {outputUrl && outputInfo && <div className="space-y-3 rounded-xl border border-border p-3"><p className="font-semibold">Cropped output · {outputInfo.width} × {outputInfo.height} px · {formatBytes(outputInfo.size)}</p><img src={outputUrl} alt="Cropped image preview" className="max-h-72 w-full rounded-lg object-contain" /><a className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" href={outputUrl} download={"cropped-image." + outputExtension(format)}>Download cropped image</a></div>}
    </section>
  );
}

function gifPalette(): Uint8Array {
  const palette = new Uint8Array(256 * 3);
  for (let index = 0; index < 256; index++) {
    palette[index * 3] = Math.round(((index >> 5) & 7) * 255 / 7);
    palette[index * 3 + 1] = Math.round(((index >> 2) & 7) * 255 / 7);
    palette[index * 3 + 2] = Math.round((index & 3) * 255 / 3);
  }
  return palette;
}

function quantizeFrame(imageData: ImageData): Uint8Array {
  const source = imageData.data;
  const result = new Uint8Array(imageData.width * imageData.height);
  for (let i = 0; i < result.length; i++) {
    const offset = i * 4;
    const alpha = source[offset + 3] / 255;
    const red = Math.round(source[offset] * alpha + 255 * (1 - alpha));
    const green = Math.round(source[offset + 1] * alpha + 255 * (1 - alpha));
    const blue = Math.round(source[offset + 2] * alpha + 255 * (1 - alpha));
    result[i] = ((red >> 5) << 5) | ((green >> 5) << 2) | (blue >> 6);
  }
  return result;
}

function lzwEncode(indices: Uint8Array): Uint8Array {
  const minSize = 8;
  const clearCode = 1 << minSize;
  const endCode = clearCode + 1;
  let codeSize = minSize + 1;
  let nextCode = endCode + 1;
  let dictionary = new Map<number, number>();
  const output: number[] = [];
  let accumulator = 0;
  let bitCount = 0;
  const writeCode = (code: number) => {
    accumulator |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      output.push(accumulator & 255);
      accumulator >>>= 8;
      bitCount -= 8;
    }
  };
  writeCode(clearCode);
  if (indices.length === 0) {
    writeCode(endCode);
  } else {
    let prefix = indices[0];
    for (let position = 1; position < indices.length; position++) {
      const symbol = indices[position];
      const key = (prefix << 8) | symbol;
      const existing = dictionary.get(key);
      if (existing !== undefined) { prefix = existing; continue; }
      writeCode(prefix);
      if (nextCode < 4096) {
        dictionary.set(key, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
      } else {
        writeCode(clearCode);
        dictionary = new Map<number, number>();
        codeSize = minSize + 1;
        nextCode = endCode + 1;
      }
      prefix = symbol;
    }
    writeCode(prefix);
    writeCode(endCode);
  }
  if (bitCount > 0) output.push(accumulator & 255);
  return new Uint8Array(output);
}

function encodeAnimatedGif(width: number, height: number, frames: Uint8Array[], delayMs: number, loopForever: boolean): Blob {
  const bytes: number[] = [];
  const push16 = (value: number) => { bytes.push(value & 255, (value >> 8) & 255); };
  const pushText = (value: string) => { for (let i = 0; i < value.length; i++) bytes.push(value.charCodeAt(i)); };
  pushText("GIF89a");
  push16(width);
  push16(height);
  bytes.push(0xf7, 255, 0);
  for (const value of gifPalette()) bytes.push(value);
  if (loopForever) {
    bytes.push(0x21, 0xff, 0x0b);
    pushText("NETSCAPE2.0");
    bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);
  }
  const delayCs = Math.max(1, Math.min(65535, Math.round(delayMs / 10)));
  for (const indices of frames) {
    bytes.push(0x21, 0xf9, 0x04, 0x04);
    push16(delayCs);
    bytes.push(0x00, 0x00);
    bytes.push(0x2c);
    push16(0); push16(0); push16(width); push16(height);
    bytes.push(0x00, 0x08);
    const compressed = lzwEncode(indices);
    for (let offset = 0; offset < compressed.length; offset += 255) {
      const length = Math.min(255, compressed.length - offset);
      bytes.push(length);
      for (let index = 0; index < length; index++) bytes.push(compressed[offset + index]);
    }
    bytes.push(0x00);
  }
  bytes.push(0x3b);
  return new Blob([new Uint8Array(bytes)], { type: "image/gif" });
}

export function GifMakerTool() {
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const framesRef = useRef<GifFrame[]>([]);
  const [delay, setDelay] = useState(150);
  const [loopForever, setLoopForever] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [gifSize, setGifSize] = useState(0);
  framesRef.current = frames;
  useEffect(() => () => { for (const frame of framesRef.current) URL.revokeObjectURL(frame.url); }, []);
  useEffect(() => () => { if (gifUrl) URL.revokeObjectURL(gifUrl); }, [gifUrl]);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const chosen = Array.from(list);
    const valid = chosen.filter(file =>
      file.size <= MAX_FILE_BYTES &&
      ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
    );
    if (valid.length !== chosen.length) setError("Some files were skipped. Use JPG, PNG, WEBP or AVIF images smaller than 25 MB each.");
    else setError("");
    if (frames.length + valid.length > 20) {
      setError("An animation can contain up to 20 images.");
      return;
    }
    const next = valid.map((file, index) => ({ id: String(Date.now()) + "-" + index + "-" + file.name, file, url: URL.createObjectURL(file) }));
    setGifUrl("");
    setGifSize(0);
    setFrames(previous => [...previous, ...next]);
  };

  const removeFrame = (id: string) => {
    const frame = frames.find(item => item.id === id);
    if (frame) URL.revokeObjectURL(frame.url);
    setFrames(previous => previous.filter(item => item.id !== id));
    setGifUrl("");
    setGifSize(0);
  };

  const moveFrame = (index: number, direction: -1 | 1) => {
    const next = [...frames];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFrames(next);
    setGifUrl("");
    setGifSize(0);
  };

  const createGif = async () => {
    if (frames.length < 2) { setError("Add at least two images to create an animation."); return; }
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const selected = [...frames];
      const decoded: HTMLImageElement[] = [];
      for (let index = 0; index < selected.length; index++) {
        decoded.push(await loadImage(selected[index].url));
        setProgress(Math.round(((index + 1) / selected.length) * 20));
      }
      const first = decoded[0];
      const scale = Math.min(1, 512 / first.naturalWidth, 512 / first.naturalHeight);
      const width = Math.max(1, Math.round(first.naturalWidth * scale));
      const height = Math.max(1, Math.round(first.naturalHeight * scale));
      const rasterFrames: Uint8Array[] = [];
      for (let index = 0; index < decoded.length; index++) {
        const image = decoded[index];
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Canvas is unavailable in this browser.");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * fit;
        const drawHeight = image.naturalHeight * fit;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
        rasterFrames.push(quantizeFrame(context.getImageData(0, 0, width, height)));
        setProgress(20 + Math.round(((index + 1) / decoded.length) * 65));
        await new Promise<void>(resolve => window.setTimeout(resolve, 0));
      }
      const blob = encodeAnimatedGif(width, height, rasterFrames, delay, loopForever);
      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setProgress(100);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "GIF creation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div><h2 className="text-lg font-semibold">Create an animated GIF from image frames</h2><p className="mt-1 text-sm text-muted-foreground">Add 2–20 images, arrange their order and choose how long each frame appears.</p></div>
      <label className="block space-y-2"><span className="text-sm font-medium">Add image frames</span><input className={inputClass} type="file" accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif" multiple disabled={busy} onChange={event => { addFiles(event.target.files); event.currentTarget.value = ""; }} /></label>
      {frames.length > 0 && <div className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{frames.length} / 20 frames</p><button className={secondaryClass} type="button" disabled={busy} onClick={() => { frames.forEach(frame => URL.revokeObjectURL(frame.url)); setFrames([]); setGifUrl(""); setGifSize(0); }}>Clear all</button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{frames.map((frame, index) => <div key={frame.id} className="space-y-2 rounded-lg border border-border p-2"><img src={frame.url} alt={"Frame " + (index + 1)} className="h-24 w-full rounded bg-muted/30 object-contain" /><p className="truncate text-xs" title={frame.file.name}>{index + 1}. {frame.file.name}</p><div className="flex flex-wrap gap-1"><button type="button" className={secondaryClass} disabled={busy || index === 0} onClick={() => moveFrame(index, -1)}>↑</button><button type="button" className={secondaryClass} disabled={busy || index === frames.length - 1} onClick={() => moveFrame(index, 1)}>↓</button><button type="button" className={secondaryClass} disabled={busy} onClick={() => removeFrame(frame.id)}>Remove</button></div></div>)}</div></div>}
      <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-sm"><span className="font-medium">Frame delay</span><select className={inputClass} value={delay} onChange={event => setDelay(Number(event.target.value))}><option value="100">100 ms · Fast</option><option value="150">150 ms</option><option value="200">200 ms</option><option value="300">300 ms · Slow</option><option value="500">500 ms · Very slow</option></select></label><label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" checked={loopForever} onChange={event => setLoopForever(event.target.checked)} /> Loop continuously</label></div>
      <button type="button" className={buttonClass} disabled={busy || frames.length < 2} onClick={() => void createGif()}>{busy ? "Creating GIF…" : "Create animated GIF"}</button>
      {busy && <div className="space-y-1"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: progress + "%" }} /></div><p className="text-xs text-muted-foreground">Processing frames · {progress}%</p></div>}
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {gifUrl && <div className="space-y-3 rounded-xl border border-border p-3"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">Animated GIF preview</p><p className="text-xs text-muted-foreground">{formatBytes(gifSize)} · 512 px maximum side</p></div><img src={gifUrl} alt="Generated animated GIF preview" className="max-h-72 w-full rounded-lg bg-muted/30 object-contain" /><a className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" href={gifUrl} download="animated-image.gif">Download animated GIF</a></div>}
      <p className="text-xs text-muted-foreground">GIF uses a shared 256-colour 3-3-2 palette and a maximum frame side of 512 px. Images with different proportions are fitted onto a white canvas. Small colour shifts are normal.</p>
    </section>
  );
}
