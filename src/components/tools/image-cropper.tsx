"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
  Crop,
  RefreshCw,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ImageFormatChoice,
  PixelArea,
  RenderedImageResult,
  buildEditedFilename,
  formatBytes,
  renderCroppedImage,
  resolveImageFormat,
} from "@/lib/converters/image-edit";

interface AspectOption {
  id: string;
  label: string;
  value: number | null; // null = original or custom
}

const ASPECT_OPTIONS: AspectOption[] = [
  { id: "original", label: "Original", value: null },
  { id: "1:1", label: "1:1 Square", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:2", label: "3:2", value: 3 / 2 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "3:4", label: "3:4 Portrait", value: 3 / 4 },
  { id: "9:16", label: "9:16 Story", value: 9 / 16 },
  { id: "custom", label: "Custom Ratio", value: null },
];

export function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalDims, setNaturalDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [aspectId, setAspectId] = useState<string>("original");
  const [customRatioW, setCustomRatioW] = useState<number>(4);
  const [customRatioH, setCustomRatioH] = useState<number>(5);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelArea | null>(null);

  const [formatChoice, setFormatChoice] = useState<ImageFormatChoice>("original");
  const [quality, setQuality] = useState<number>(0.92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [result, setResult] = useState<RenderedImageResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [imageSrc, resultUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0];
      if (!selected) return;

      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      const url = URL.createObjectURL(selected);
      setFile(selected);
      setImageSrc(url);
      setResult(null);
      setResultUrl(null);
      setErrorMsg("");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setAspectId("original");
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

  const activeAspect = (() => {
    const preset = ASPECT_OPTIONS.find((opt) => opt.id === aspectId);
    if (preset?.value) return preset.value;
    if (aspectId === "custom") {
      const w = Math.max(1, customRatioW || 1);
      const h = Math.max(1, customRatioH || 1);
      return w / h;
    }
    if (naturalDims.w > 0 && naturalDims.h > 0) {
      return naturalDims.w / naturalDims.h;
    }
    return 4 / 3;
  })();

  const onCropComplete = useCallback((_: PixelArea, areaPixels: PixelArea) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCropImage = async () => {
    if (!file || !imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const { mime } = resolveImageFormat(file, formatChoice);
      const output = await renderCroppedImage({
        imageSrc,
        cropArea: croppedAreaPixels,
        rotation,
        flipH,
        flipV,
        mime,
        quality,
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const nextUrl = URL.createObjectURL(output.blob);
      setResult(output);
      setResultUrl(nextUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to crop image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = buildEditedFilename(file.name, "cropped", result.ext);
    link.click();
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setImageSrc(null);
    setResult(null);
    setResultUrl(null);
    setNaturalDims({ w: 0, h: 0 });
    setErrorMsg("");
  };

  const effectiveMime = file ? resolveImageFormat(file, formatChoice).mime : "image/jpeg";

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
            Drop an image to crop
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Supports JPG, PNG, and WebP. Runs directly in your browser using HTML5 Canvas.
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
            Original: {naturalDims.w} × {naturalDims.h} px • {formatBytes(file.size)}
            {croppedAreaPixels
              ? ` | Selection: ${Math.round(croppedAreaPixels.width)} × ${Math.round(croppedAreaPixels.height)} px`
              : ""}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
          <RefreshCw className="w-4 h-4" />
          Choose Another Image
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Cropper Stage */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-[360px] sm:h-[430px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={activeAspect}
              transform={
                flipH || flipV
                  ? `translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom * (flipH ? -1 : 1)}, ${zoom * (flipV ? -1 : 1)})`
                  : undefined
              }
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onMediaLoaded={(mediaSize) => {
                setNaturalDims({
                  w: mediaSize.naturalWidth,
                  h: mediaSize.naturalHeight,
                });
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Rotate -90°
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="gap-1.5"
            >
              <RotateCw className="w-4 h-4" />
              Rotate +90°
            </Button>
            <Button
              type="button"
              variant={flipH ? "default" : "outline"}
              size="sm"
              onClick={() => setFlipH((v) => !v)}
              className="gap-1.5"
            >
              <FlipHorizontal2 className="w-4 h-4" />
              Flip H
            </Button>
            <Button
              type="button"
              variant={flipV ? "default" : "outline"}
              size="sm"
              onClick={() => setFlipV((v) => !v)}
              className="gap-1.5"
            >
              <FlipVertical2 className="w-4 h-4" />
              Flip V
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-5 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAspectId(opt.id)}
                  className={`px-2.5 py-2 text-xs font-medium rounded-xl border transition-colors ${
                    aspectId === opt.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {aspectId === "custom" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Width Ratio</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customRatioW}
                    onChange={(e) => setCustomRatioW(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Height Ratio</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customRatioH}
                    onChange={(e) => setCustomRatioH(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 dark:text-slate-300">Zoom</span>
              <span className="text-slate-500">{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
              Output Format
            </label>
            <select
              value={formatChoice}
              onChange={(e) => setFormatChoice(e.target.value as ImageFormatChoice)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="original">Keep Original Format</option>
              <option value="image/jpeg">JPG (smaller size, white fill on transparent edges)</option>
              <option value="image/png">PNG (keeps transparency)</option>
              <option value="image/webp">WebP (compact with transparency)</option>
            </select>
          </div>

          {effectiveMime !== "image/png" && (
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 dark:text-slate-300">Export Quality</span>
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

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="button"
            onClick={handleCropImage}
            disabled={isProcessing || !croppedAreaPixels}
            className="w-full gap-2 rounded-xl"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crop className="w-4 h-4" />}
            Crop &amp; Preview
          </Button>
        </div>
      </div>

      {result && resultUrl && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={resultUrl}
              alt="Cropped preview"
              className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                Cropped Image Ready
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Output: {result.width} × {result.height} px • {formatBytes(result.blob.size)} ({result.ext.toUpperCase()})
              </p>
            </div>
          </div>
          <Button type="button" onClick={handleDownload} className="gap-2 rounded-xl w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Download Cropped Image
          </Button>
        </div>
      )}
    </div>
  );
}
