"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  Sliders,
  ArrowRight,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { compressPdf, CompressionPreset } from "@/lib/converters/pdf";

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<CompressionPreset>("balanced");
  const [useTargetSize, setUseTargetSize] = useState(false);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setResultBlob(null);
    setError(null);
    setProgress(0);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(10);
    setStatusMessage("Starting compression...");

    try {
      const compressedBlob = await compressPdf(file, {
        preset,
        targetSizeKb: useTargetSize ? targetSizeKb : undefined,
        onProgress: (p, msg) => {
          setProgress(p);
          if (msg) setStatusMessage(msg);
        }
      });

      setResultBlob(compressedBlob);
      setProgress(100);
      setStatusMessage("Compression complete!");
    } catch (err: any) {
      console.error("Compression error:", err);
      setError(err?.message || "Failed to compress PDF. Please try another preset.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    window.open(url, "_blank");
  };

  const resetAll = () => {
    setFile(null);
    setResultBlob(null);
    setError(null);
    setProgress(0);
    setStatusMessage("");
  };

  // Calculate percentage reduction
  const originalSize = file?.size || 0;
  const compressedSize = resultBlob?.size || 0;
  const sizeDiff = originalSize - compressedSize;
  const percentSaved = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Box */}
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-5 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Select PDF file to compress
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            Drag & drop your PDF here, or click to browse. Real on-device compression without quality loss.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Private & Free • Files never leave your browser
          </div>
        </div>
      )}

      {/* Configuration & Options */}
      {file && !resultBlob && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          {/* File Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base md:text-lg truncate max-w-[280px] sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Original Size: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatBytes(file.size)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              disabled={isProcessing}
              className="text-xs font-semibold text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Presets */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              Select Compression Level
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Extreme */}
              <button
                type="button"
                onClick={() => {
                  setPreset("max");
                  setUseTargetSize(false);
                }}
                disabled={isProcessing}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  preset === "max" && !useTargetSize
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-md shadow-blue-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Extreme
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    ~75% Smaller
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maximum file reduction. Best for strict email limits & portals.
                </p>
              </button>

              {/* Recommended */}
              <button
                type="button"
                onClick={() => {
                  setPreset("balanced");
                  setUseTargetSize(false);
                }}
                disabled={isProcessing}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  preset === "balanced" && !useTargetSize
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-md shadow-blue-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    Recommended
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    Optimal Balance
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Great compression while maintaining razor-sharp text clarity.
                </p>
              </button>

              {/* Lossless / Less */}
              <button
                type="button"
                onClick={() => {
                  setPreset("lossless");
                  setUseTargetSize(false);
                }}
                disabled={isProcessing}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  preset === "lossless" && !useTargetSize
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 shadow-md shadow-blue-500/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    High Quality
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    Pristine
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cleans structural bloat and preserves maximum original resolution.
                </p>
              </button>
            </div>
          </div>

          {/* Optional Target Size Mode */}
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useTargetSize}
                  onChange={(e) => setUseTargetSize(e.target.checked)}
                  disabled={isProcessing}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Compress to specific target file size (e.g. for job/gov portals)
              </label>
            </div>

            {useTargetSize && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[100, 200, 500, 1000, 2000].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetSizeKb(kb)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      targetSizeKb === kb
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300"
                    }`}
                  >
                    &lt; {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>{statusMessage || "Compressing PDF..."}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Compressing PDF...
              </>
            ) : (
              <>
                Compress PDF Now
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Result Showcase Card */}
      {resultBlob && file && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              PDF Compressed Successfully!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your document has been optimized with maximal visual clarity.
            </p>
          </div>

          {/* Savings Metric Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 max-w-lg mx-auto grid grid-cols-2 gap-4 items-center">
            <div className="text-left border-r border-slate-200 dark:border-slate-700 pr-4">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Before</span>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300 line-through">
                {formatBytes(originalSize)}
              </p>
            </div>
            <div className="text-left pl-2">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">After</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatBytes(compressedSize)}
              </p>
            </div>
          </div>

          {percentSaved > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <TrendingDown className="w-4 h-4" />
              {percentSaved}% Size Reduction ({formatBytes(sizeDiff)} saved)
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-5 h-5" />
              Download Compressed PDF
            </button>

            <button
              onClick={handlePreview}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              Preview PDF
            </button>

            <button
              onClick={resetAll}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompressPdfTool;
