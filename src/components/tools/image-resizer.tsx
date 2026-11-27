"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Download,
  Lock,
  Unlock,
  Maximize2,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ImageFormatChoice,
  RenderedImageResult,
  buildEditedFilename,
  formatBytes,
  loadImageElement,
  renderResizedImage,
  resolveImageFormat,
} from "@/lib/converters/image-edit";

type ResizeMode = "pixels" | "percent" | "presets";

const SIZE_PRESETS = [
  { label: "1920 × 1080 (Full HD)", w: 1920, h: 1080 },
  { label: "1280 × 720 (HD)", w: 1280, h: 720 },
  { label: "1080 × 1080 (Square)", w: 1080, h: 1080 },
  { label: "800 × 600 (Web)", w: 800, h: 600 },
];

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [percent, setPercent] = useState<number>(50);

  const [formatChoice, setFormatChoice] = useState<ImageFormatChoice>("original");
  const [quality, setQuality] = useState<number>(0.9);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<RenderedImageResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [imageSrc, resultUrl]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0];
      if (!selected) return;

      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      const url = URL.createObjectURL(selected);
      try {
        const img = await loadImageElement(url);
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        setFile(selected);
        setImageSrc(url);
        setOrigDims({ w, h });
        setWidth(w);
        setHeight(h);
        setPercent(100);
        setResult(null);
        setResultUrl(null);
        setErrorMsg("");
      } catch (err) {
        URL.revokeObjectURL(url);
        setErrorMsg(err instanceof Error ? err.message : "Could not load selected image.");
      }
    },
    [imageSrc, resultUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleWidthChange = (raw: string) => {
    const nextW = Math.max(1, Math.min(12000, Number(raw) || 1));
    setWidth(nextW);
    if (lockAspect && origDims.w > 0 && origDims.h > 0) {
      setHeight(Math.max(1, Math.round((nextW * origDims.h) / origDims.w)));
    }
  };

  const handleHeightChange = (raw: string) => {
    const nextH = Math.max(1, Math.min(12000, Number(raw) || 1));
    setHeight(nextH);
    if (lockAspect && origDims.w > 0 && origDims.h > 0) {
      setWidth(Math.max(1, Math.round((nextH * origDims.w) / origDims.h)));
    }
  };

  const handlePercentChange = (nextPct: number) => {
    const clamped = Math.max(5, Math.min(300, nextPct));
    setPercent(clamped);
    if (origDims.w > 0 && origDims.h > 0) {
      setWidth(Math.max(1, Math.round((origDims.w * clamped) / 100)));
      setHeight(Math.max(1, Math.round((origDims.h * clamped) / 100)));
    }
  };

  const applyPreset = (presetW: number, presetH: number) => {
    if (lockAspect && origDims.w > 0 && origDims.h > 0) {
      const ratio = origDims.w / origDims.h;
      const fitW = Math.min(presetW, Math.round(presetH * ratio));
      const fitH = Math.max(1, Math.round(fitW / ratio));
      setWidth(Math.max(1, fitW));
      setHeight(fitH);
    } else {
      setWidth(presetW);
      setHeight(presetH);
    }
  };

  const handleResize = async () => {
    if (!file || !imageSrc) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const { mime } = resolveImageFormat(file, formatChoice);
      const output = await renderResizedImage({
        imageSrc,
        targetWidth: width,
        targetHeight: height,
        mime,
        quality,
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const nextUrl = URL.createObjectURL(output.blob);
      setResult(output);
      setResultUrl(nextUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to resize image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = buildEditedFilename(file.name, `${result.width}x${result.height}`, result.ext);
    link.click();
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setImageSrc(null);
    setResult(null);
    setResultUrl(null);
    setOrigDims({ w: 0, h: 0 });
    setErrorMsg("");
  };

  const effectiveMime = file ? resolveImageFormat(file, formatChoice).mime : "image/jpeg";
  const isUpscaling = origDims.w > 0 && (width > origDims.w || height > origDims.h);

  if (!file || !imageSrc) {
    return (
      <div className="max-w-4xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-white dark:bg-[#0c1630] ${
            isDragActive
              ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Drop an image to resize
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Supports JPG, PNG, and WebP. Resizes pixels directly in your browser using HTML5 Canvas.
          </p>
          <Button type="button" className="rounded-xl">
            Select Image File
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {file.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Original: {origDims.w} × {origDims.h} px • {formatBytes(file.size)} → Target: {width} × {height} px
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
          <RefreshCw className="w-4 h-4" />
          Choose Another Image
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Preview Pane */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
          <img
            src={resultUrl || imageSrc}
            alt="Image preview"
            className="max-h-[300px] w-auto object-contain rounded-xl"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            {result ? `Resized preview: ${result.width} × ${result.height} px` : `Original preview: ${origDims.w} × ${origDims.h} px`}
          </p>
        </div>

        {/* Controls */}
        <div className="lg:col-span-3 space-y-5 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex gap-2">
            {(["pixels", "percent", "presets"] as ResizeMode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                  mode === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                {tab === "pixels" ? "By Pixels" : tab === "percent" ? "By Percentage" : "Common Presets"}
              </button>
            ))}
          </div>

          {mode === "pixels" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="resize-width" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    id="resize-width"
                    type="number"
                    min={1}
                    max={12000}
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label htmlFor="resize-height" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    id="resize-height"
                    type="number"
                    min={1}
                    max={12000}
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockAspect((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {lockAspect ? "Aspect ratio locked (proportional)" : "Aspect ratio unlocked (may stretch image)"}
              </button>
            </div>
          )}

          {mode === "percent" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100, 150].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentChange(pct)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border ${
                      percent === pct
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Scale Percentage</span>
                  <span>
                    {percent}% ({width} × {height} px)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={percent}
                  onChange={(e) => handlePercentChange(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}

          {mode === "presets" && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIZE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p.w, p.h)}
                    className="px-3 py-2 text-xs font-medium text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                With aspect lock enabled, presets fit proportionally within the chosen bounds.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1.5">
                Output Format
              </label>
              <select
                value={formatChoice}
                onChange={(e) => setFormatChoice(e.target.value as ImageFormatChoice)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              >
                <option value="original">Keep Original Format</option>
                <option value="image/jpeg">JPG (lossy JPEG compression)</option>
                <option value="image/png">PNG (keeps transparency)</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            {effectiveMime !== "image/png" && (
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Compression Quality</span>
                  <span className="text-slate-500">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.02}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}
          </div>

          {isUpscaling && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Target dimensions exceed original pixels ({origDims.w} × {origDims.h} px). Upscaling softens fine detail.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="button"
            onClick={handleResize}
            disabled={isProcessing}
            className="w-full gap-2 rounded-xl"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize2 className="w-4 h-4" />}
            Resize Image
          </Button>
        </div>
      </div>

      {result && resultUrl && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Resized Image Ready
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {result.width} × {result.height} px • {formatBytes(result.blob.size)} ({result.ext.toUpperCase()})
            </p>
          </div>
          <Button type="button" onClick={handleDownload} className="gap-2 rounded-xl w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Download Resized Image
          </Button>
        </div>
      )}
    </div>
  );
}
