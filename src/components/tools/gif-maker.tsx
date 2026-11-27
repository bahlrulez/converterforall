"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Film,
  Loader2,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAnimatedGifFromImages } from "@/lib/converters/video";
import { formatBytes } from "@/lib/converters/image-edit";

interface FrameItem {
  id: string;
  file: File;
  previewUrl: string;
}

export function GifMaker() {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [delayMs, setDelayMs] = useState<number>(500);
  const [widthPx, setWidthPx] = useState<number>(640);
  const [loopCount, setLoopCount] = useState<number>(0);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    return () => {
      frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setErrorMsg("");
    setFrames((prev) => {
      const remainingSlots = Math.max(0, 30 - prev.length);
      const sliced = acceptedFiles.slice(0, remainingSlots);
      const nextItems = sliced.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...nextItems];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: addFiles,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 30,
    multiple: true,
    noClick: frames.length > 0,
  });

  const moveFrame = (index: number, delta: -1 | 1) => {
    setFrames((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  };

  const removeFrame = (index: number) => {
    setFrames((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  const clearAll = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFrames([]);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg("");
    setProgress(0);
  };

  const handleCreateGif = async () => {
    if (frames.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setErrorMsg("");
    try {
      const output = await createAnimatedGifFromImages(
        frames.map((f) => f.file),
        {
          delayMs,
          width: widthPx,
          loopCount,
          backgroundColor,
        },
        (p) => setProgress(p)
      );
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(output.blob);
      setResultBlob(output.blob);
      setResultUrl(url);
      setResultDims({ w: output.width, h: output.height });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to encode animated GIF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "animated-sequence.gif";
    a.click();
  };

  if (frames.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div
          {...getRootProps()}
          onClick={open}
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
            Drop multiple images to make an animated GIF
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Supports JPG, PNG, and WebP (up to 30 frames). Reorder frames, set delay, and export via FFmpeg WebAssembly in your browser.
          </p>
          <Button type="button" className="rounded-xl">
            Select Images
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="max-w-5xl mx-auto bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
      <input {...getInputProps()} />
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {frames.length} {frames.length === 1 ? "Frame" : "Frames"} Loaded
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Frames are centered inside uniform dimensions before FFmpeg palette generation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={open} disabled={frames.length >= 30} className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Frames
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearAll} className="gap-1.5 text-red-600 dark:text-red-400">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frame Timeline List */}
        <div className="lg:col-span-2 space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {frames.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 text-center text-xs font-bold text-slate-500">{idx + 1}</span>
                <img
                  src={item.previewUrl}
                  alt={`Frame ${idx + 1}`}
                  className="w-12 h-12 rounded-xl object-cover bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.file.name}</p>
                  <p className="text-[11px] text-slate-500">{formatBytes(item.file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button type="button" variant="ghost" size="icon" onClick={() => moveFrame(idx, -1)} disabled={idx === 0} title="Move up">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => moveFrame(idx, 1)} disabled={idx === frames.length - 1} title="Move down">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFrame(idx)} title="Remove frame" className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 dark:text-slate-300">Frame Delay</span>
              <span className="text-slate-500">{delayMs} ms ({(1000 / delayMs).toFixed(1)} fps)</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1.5">
              Output Width
            </label>
            <select
              value={widthPx}
              onChange={(e) => setWidthPx(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
            >
              <option value={480}>480 px wide (smaller file)</option>
              <option value={640}>640 px wide (balanced)</option>
              <option value={800}>800 px wide (higher detail)</option>
              <option value={0}>First image width (capped at 800 px)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1.5">
              Loop Behavior
            </label>
            <select
              value={loopCount}
              onChange={(e) => setLoopCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
            >
              <option value={0}>Loop Forever</option>
              <option value={-1}>Play Once (No Loop)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-1.5">
              Background Fill
            </label>
            <div className="flex gap-2">
              {[
                { label: "White", val: "#ffffff" },
                { label: "Black", val: "#000000" },
              ].map((bg) => (
                <button
                  key={bg.val}
                  type="button"
                  onClick={() => setBackgroundColor(bg.val)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-xl border ${
                    backgroundColor === bg.val
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Encoding GIF via FFmpeg WASM...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleCreateGif}
            disabled={isProcessing}
            className="w-full gap-2 rounded-xl"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
            Generate Animated GIF
          </Button>
        </div>
      </div>

      {resultBlob && resultUrl && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={resultUrl}
              alt="Generated animated GIF preview"
              className="w-20 h-20 object-contain rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                Animated GIF Ready
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {resultDims.w} × {resultDims.h} px • {frames.length} frames • {formatBytes(resultBlob.size)}
              </p>
            </div>
          </div>
          <Button type="button" onClick={handleDownload} className="gap-2 rounded-xl w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Download Animated GIF
          </Button>
        </div>
      )}
    </div>
  );
}
