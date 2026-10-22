"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { 
  Upload, 
  Download, 
  ArrowLeftRight, 
  ArrowUpDown, 
  RefreshCw, 
  Sliders, 
  Check, 
  AlertCircle, 
  Trash2, 
  Image as ImageIcon,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LoadedImage {
  file: File;
  url: string;
  img: HTMLImageElement;
  name: string;
  width: number;
  height: number;
  size: number;
}

export type MergeLayout = "horizontal" | "vertical";
export type BgColorChoice = "white" | "black" | "gray" | "custom";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per image
const MAX_SOURCE_DIMENSION = 8000;
const MAX_SOURCE_PIXELS = 24_000_000; // 24 MP
const MAX_OUTPUT_DIMENSION = 8192;
const MAX_OUTPUT_PIXELS = 24_000_000; // 24 MP

export function MergeImagesTool() {
  const [slot1, setSlot1] = useState<LoadedImage | null>(null);
  const [slot2, setSlot2] = useState<LoadedImage | null>(null);

  // Settings
  const [layout, setLayout] = useState<MergeLayout>("horizontal");
  const [spacing, setSpacing] = useState<number>(0); // Gap between images
  const [padding, setPadding] = useState<number>(0); // Outer border padding
  const [bgChoice, setBgChoice] = useState<BgColorChoice>("white");
  const [customBg, setCustomBg] = useState<string>("#FFFFFF");
  const [quality, setQuality] = useState<number>(0.92);

  // Status & Errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downscaleNotice, setDownscaleNotice] = useState<string | null>(null);
  const [outputStats, setOutputStats] = useState<{ width: number; height: number; estimatedKB: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Resolve actual background hex
  const resolvedBgColor = 
    bgChoice === "white" ? "#FFFFFF" :
    bgChoice === "black" ? "#000000" :
    bgChoice === "gray" ? "#F1F5F9" :
    customBg;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (slot1?.url) URL.revokeObjectURL(slot1.url);
      if (slot2?.url) URL.revokeObjectURL(slot2.url);
    };
  }, [slot1, slot2]);

  // Decode file safely with memory limits
  const decodeFile = useCallback(async (file: File): Promise<LoadedImage> => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`"${file.name}" exceeds the 25 MB limit. Please select a smaller photo or compress it first.`);
    }

    const validMimes = ["image/jpeg", "image/png", "image/jpg"];
    const validExts = [".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validMimes.includes(file.type) && !validExts.includes(ext)) {
      throw new Error(`"${file.name}" is not a supported format. Please upload JPG, JPEG, or PNG images.`);
    }

    const objectUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Check if individual source image exceeds limits
        const totalPixels = width * height;
        if (width > MAX_SOURCE_DIMENSION || height > MAX_SOURCE_DIMENSION || totalPixels > MAX_SOURCE_PIXELS) {
          // Calculate proportional scale factor to preserve as much detail as possible
          const scale = Math.min(
            1.0,
            MAX_SOURCE_DIMENSION / Math.max(width, height),
            Math.sqrt(MAX_SOURCE_PIXELS / totalPixels)
          );

          const safeW = Math.max(1, Math.round(width * scale));
          const safeH = Math.max(1, Math.round(height * scale));

          const offscreen = document.createElement("canvas");
          offscreen.width = safeW;
          offscreen.height = safeH;
          const oCtx = offscreen.getContext("2d");
          if (!oCtx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Browser could not initialize offscreen canvas for decoding."));
            return;
          }
          oCtx.drawImage(img, 0, 0, safeW, safeH);

          const preScaledBlob = await new Promise<Blob | null>((res) => offscreen.toBlob(res, "image/png"));
          offscreen.width = 0;
          offscreen.height = 0;

          if (preScaledBlob) {
            URL.revokeObjectURL(objectUrl);
            const scaledUrl = URL.createObjectURL(preScaledBlob);
            const scaledImg = new Image();
            scaledImg.onload = () => {
              resolve({
                file,
                url: scaledUrl,
                img: scaledImg,
                name: file.name,
                width: safeW,
                height: safeH,
                size: file.size,
              });
            };
            scaledImg.onerror = () => {
              URL.revokeObjectURL(scaledUrl);
              reject(new Error(`Failed to decode resized image for "${file.name}".`));
            };
            scaledImg.src = scaledUrl;
            return;
          }
        }

        resolve({
          file,
          url: objectUrl,
          img,
          name: file.name,
          width,
          height,
          size: file.size,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Unable to decode "${file.name}". The file may be corrupt or not a valid image.`));
      };

      img.src = objectUrl;
    });
  }, []);

  // Handle file uploads for Slot 1
  const handleUploadSlot1 = async (acceptedFiles: File[], fileRejections: FileRejection[] = []) => {
    if (fileRejections && fileRejections.length > 0) {
      const rejectedFile = fileRejections[0].file;
      setErrorMessage(`"${rejectedFile.name}" is not a supported format. Please upload JPG, JPEG, or PNG images.`);
      return;
    }
    if (acceptedFiles.length === 0) return;
    setErrorMessage(null);
    try {
      const decoded1 = await decodeFile(acceptedFiles[0]);
      if (slot1?.url) URL.revokeObjectURL(slot1.url);
      setSlot1(decoded1);

      // If user dropped 2 files onto Slot 1, automatically assign second file to Slot 2
      if (acceptedFiles.length > 1) {
        const decoded2 = await decodeFile(acceptedFiles[1]);
        if (slot2?.url) URL.revokeObjectURL(slot2.url);
        setSlot2(decoded2);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load image.");
    }
  };

  // Handle file uploads for Slot 2
  const handleUploadSlot2 = async (acceptedFiles: File[], fileRejections: FileRejection[] = []) => {
    if (fileRejections && fileRejections.length > 0) {
      const rejectedFile = fileRejections[0].file;
      setErrorMessage(`"${rejectedFile.name}" is not a supported format. Please upload JPG, JPEG, or PNG images.`);
      return;
    }
    if (acceptedFiles.length === 0) return;
    setErrorMessage(null);
    try {
      const decoded2 = await decodeFile(acceptedFiles[0]);
      if (slot2?.url) URL.revokeObjectURL(slot2.url);
      setSlot2(decoded2);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load image.");
    }
  };

  const dropzone1 = useDropzone({
    onDrop: handleUploadSlot1,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 2,
    multiple: true,
  });

  const dropzone2 = useDropzone({
    onDrop: handleUploadSlot2,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    multiple: false,
  });

  // Swap Order
  const handleSwap = () => {
    setSlot1(slot2);
    setSlot2(slot1);
  };

  // Remove Slot 1
  const handleRemoveSlot1 = () => {
    if (slot1?.url) URL.revokeObjectURL(slot1.url);
    setSlot1(null);
    setOutputStats(null);
  };

  // Remove Slot 2
  const handleRemoveSlot2 = () => {
    if (slot2?.url) URL.revokeObjectURL(slot2.url);
    setSlot2(null);
    setOutputStats(null);
  };

  // Render & Composite Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !slot1 || !slot2) {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      setOutputStats(null);
      setDownscaleNotice(null);
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      setErrorMessage("Browser does not support 2D canvas context.");
      return;
    }

    setErrorMessage(null);

    const W1 = slot1.width;
    const H1 = slot1.height;
    const W2 = slot2.width;
    const H2 = slot2.height;

    const G = Math.max(0, spacing);
    const P = Math.max(0, padding);

    let dw1 = 0;
    let dh1 = 0;
    let dw2 = 0;
    let dh2 = 0;
    let unscaledCanvasW = 0;
    let unscaledCanvasH = 0;

    if (layout === "horizontal") {
      // Side by Side: Match height to the larger image
      const H_target = Math.max(H1, H2);
      const s1 = H_target / H1;
      const s2 = H_target / H2;

      dw1 = Math.round(W1 * s1);
      dh1 = H_target;
      dw2 = Math.round(W2 * s2);
      dh2 = H_target;

      unscaledCanvasW = P + dw1 + G + dw2 + P;
      unscaledCanvasH = P + H_target + P;
    } else {
      // Top and Bottom: Match width to the larger image
      const W_target = Math.max(W1, W2);
      const s1 = W_target / W1;
      const s2 = W_target / W2;

      dw1 = W_target;
      dh1 = Math.round(H1 * s1);
      dw2 = W_target;
      dh2 = Math.round(H2 * s2);

      unscaledCanvasW = P + W_target + P;
      unscaledCanvasH = P + dh1 + G + dh2 + P;
    }

    // Safety Downscaling Check
    const unscaledArea = unscaledCanvasW * unscaledCanvasH;
    let scaleSafe = 1.0;

    if (
      unscaledCanvasW > MAX_OUTPUT_DIMENSION ||
      unscaledCanvasH > MAX_OUTPUT_DIMENSION ||
      unscaledArea > MAX_OUTPUT_PIXELS
    ) {
      scaleSafe = Math.min(
        1.0,
        MAX_OUTPUT_DIMENSION / unscaledCanvasW,
        MAX_OUTPUT_DIMENSION / unscaledCanvasH,
        Math.sqrt(MAX_OUTPUT_PIXELS / unscaledArea)
      );
      setDownscaleNotice(`Merged resolution safely adjusted to fit browser memory limits (${MAX_OUTPUT_DIMENSION} px max).`);
    } else {
      setDownscaleNotice(null);
    }

    // Calculate consistent scaled dimensions to prevent gaps or overlaps
    const P_scaled = Math.round(P * scaleSafe);
    const G_scaled = Math.round(G * scaleSafe);
    const dw1_scaled = Math.round(dw1 * scaleSafe);
    const dh1_scaled = Math.round(dh1 * scaleSafe);
    const dw2_scaled = Math.round(dw2 * scaleSafe);
    const dh2_scaled = Math.round(dh2 * scaleSafe);

    let finalCanvasW = 0;
    let finalCanvasH = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    if (layout === "horizontal") {
      x1 = P_scaled;
      y1 = P_scaled;
      x2 = P_scaled + dw1_scaled + G_scaled;
      y2 = P_scaled;
      finalCanvasW = x2 + dw2_scaled + P_scaled;
      finalCanvasH = P_scaled + dh1_scaled + P_scaled;
    } else {
      x1 = P_scaled;
      y1 = P_scaled;
      x2 = P_scaled;
      y2 = P_scaled + dh1_scaled + G_scaled;
      finalCanvasW = P_scaled + dw1_scaled + P_scaled;
      finalCanvasH = y2 + dh2_scaled + P_scaled;
    }

    canvas.width = Math.max(1, finalCanvasW);
    canvas.height = Math.max(1, finalCanvasH);

    // 1. Fill solid background (essential for transparent PNGs)
    ctx.fillStyle = resolvedBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. High-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 3. Draw images
    ctx.drawImage(slot1.img, x1, y1, dw1_scaled, dh1_scaled);
    ctx.drawImage(slot2.img, x2, y2, dw2_scaled, dh2_scaled);

    // Estimate file size (approx. 0.15 bytes per pixel at quality 0.92)
    const estKB = Math.round((canvas.width * canvas.height * 0.16 * quality) / 1024);
    setOutputStats({
      width: canvas.width,
      height: canvas.height,
      estimatedKB: Math.max(10, estKB),
    });
  }, [slot1, slot2, layout, spacing, padding, resolvedBgColor, quality]);

  // Download Trigger
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !slot1 || !slot2) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMessage("Browser was unable to allocate memory for JPEG export. Try selecting smaller images or reducing border padding.");
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "merged-images.jpg";
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up blob URL after 1 minute
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        },
        "image/jpeg",
        quality
      );
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || "Failed to generate merged image.");
    }
  };

  const bothLoaded = Boolean(slot1 && slot2);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto text-slate-800 dark:text-slate-100">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Conversion Alert</p>
            <p className="mt-0.5 text-xs sm:text-sm">{errorMessage}</p>
          </div>
          <button 
            type="button" 
            id="dismiss-error-btn"
            onClick={() => setErrorMessage(null)} 
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Zone / Card Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative items-center">
        {/* Slot 1 */}
        <div data-testid="slot-1" className="flex flex-col bg-slate-50/80 dark:bg-[#070d1e] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Image 1 ({layout === "horizontal" ? "Left Side" : "Top Position"})
            </span>
            {slot1 && (
              <button
                type="button"
                onClick={handleRemoveSlot1}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Remove Image 1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {!slot1 ? (
            <div
              {...dropzone1.getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                dropzone1.isDragActive
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                  : "border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-[#0a1128]"
              }`}
            >
              <input {...dropzone1.getInputProps()} />
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Choose Image 1
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Drag &amp; drop JPG or PNG (up to 25 MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-white dark:bg-[#0a1128] rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <img
                src={slot1.url}
                alt={slot1.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {slot1.name}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {slot1.width} × {slot1.height} px • {(slot1.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div {...dropzone1.getRootProps()} className="inline-block">
                    <input {...dropzone1.getInputProps()} />
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Replace photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Central Swap Order Button */}
        <div className="flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 my-[-8px] md:my-0">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!slot1 && !slot2}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-[#0c1430] border border-slate-300 dark:border-slate-700 shadow-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 disabled:opacity-40 transition-all cursor-pointer"
            title="Swap image positions"
          >
            {layout === "horizontal" ? (
              <ArrowLeftRight className="w-4 h-4 text-blue-500" />
            ) : (
              <ArrowUpDown className="w-4 h-4 text-blue-500" />
            )}
            <span className="hidden sm:inline">Swap Order</span>
          </button>
        </div>

        {/* Slot 2 */}
        <div data-testid="slot-2" className="flex flex-col bg-slate-50/80 dark:bg-[#070d1e] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Image 2 ({layout === "horizontal" ? "Right Side" : "Bottom Position"})
            </span>
            {slot2 && (
              <button
                type="button"
                onClick={handleRemoveSlot2}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Remove Image 2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {!slot2 ? (
            <div
              {...dropzone2.getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
                dropzone2.isDragActive
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                  : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-[#0a1128]"
              }`}
            >
              <input {...dropzone2.getInputProps()} />
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Choose Image 2
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Drag &amp; drop JPG or PNG (up to 25 MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-white dark:bg-[#0a1128] rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <img
                src={slot2.url}
                alt={slot2.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {slot2.name}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {slot2.width} × {slot2.height} px • {(slot2.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div {...dropzone2.getRootProps()} className="inline-block">
                    <input {...dropzone2.getInputProps()} />
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Replace photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Settings Strip */}
      <div className="bg-white dark:bg-[#0a1128] rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            Merge Settings
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Aspect ratios are preserved without stretching
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Layout Direction */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Layout Direction
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setLayout("horizontal")}
                className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all ${
                  layout === "horizontal"
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Side by Side
              </button>
              <button
                type="button"
                onClick={() => setLayout("vertical")}
                className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all ${
                  layout === "vertical"
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Top &amp; Bottom
              </button>
            </div>
          </div>

          {/* 2. Spacing / Gap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Image Gap: {spacing}px
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 12, 24].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSpacing(val)}
                  className={`text-xs font-semibold py-1.5 px-1 rounded-xl border transition-all ${
                    spacing === val
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {val === 0 ? "Seamless" : `${val}px`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Outer Border Padding */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Border Padding: {padding}px
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 12, 24].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPadding(val)}
                  className={`text-xs font-semibold py-1.5 px-1 rounded-xl border transition-all ${
                    padding === val
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {val === 0 ? "None" : `${val}px`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Background Color (handles transparent PNGs) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBgChoice("white")}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  bgChoice === "white"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white" />
                White
              </button>
              <button
                type="button"
                onClick={() => setBgChoice("black")}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  bgChoice === "black"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-black" />
                Black
              </button>
              <input
                type="color"
                value={customBg}
                onChange={(e) => {
                  setCustomBg(e.target.value);
                  setBgChoice("custom");
                }}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-800 p-0.5 bg-white"
                title="Choose custom background color"
              />
            </div>
          </div>
        </div>

        {/* Quality selection strip */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">JPEG Quality:</span>
            {[
              { label: "High (92%)", val: 0.92 },
              { label: "Maximum (100% lossy)", val: 1.0 },
              { label: "Compact (80%)", val: 0.8 },
            ].map((q) => (
              <button
                key={q.val}
                type="button"
                onClick={() => setQuality(q.val)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  quality === q.val
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] italic">
            Note: JPEG compression is lossy even at 100% quality.
          </p>
        </div>
      </div>

      {/* Downscale Notice Banner (if applied) */}
      {downscaleNotice && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{downscaleNotice}</span>
        </div>
      )}

      {/* Live Composite Preview & Download Card */}
      <div className="bg-slate-50/80 dark:bg-[#070d1e] rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Merged Image Preview
            </h4>
          </div>
          {outputStats && (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {outputStats.width} × {outputStats.height} px • ~{outputStats.estimatedKB} KB
            </span>
          )}
        </div>

        {/* Live Canvas Element */}
        <div className="w-full min-h-[220px] max-h-[500px] rounded-2xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center justify-center overflow-auto">
          {!bothLoaded ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Select both Image 1 and Image 2 above to view composite preview</p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[460px] object-contain rounded-lg shadow-md border border-slate-200 dark:border-slate-800"
            />
          )}
        </div>

        {/* Download Action Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between w-full gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>Destination Format: <strong>JPEG (.jpg)</strong> • 100% In-Browser Execution</span>
          </div>

          <Button
            type="button"
            disabled={!bothLoaded || isProcessing}
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-3 h-auto rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Exporting JPEG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Merged JPG</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default MergeImagesTool;
