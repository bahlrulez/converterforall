"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  FileCode,
  Clipboard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Loader2,
  Zap,
} from "lucide-react";
import { detectFileTools, DetectedFileInfo, ConversionOption } from "@/lib/file-detection";
import { storePendingFile } from "@/lib/file-transfer";

const POPULAR_FORMATS = [
  { label: "PDF", ext: ".pdf", icon: FileText, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  { label: "JPG", ext: ".jpg,.jpeg", icon: ImageIcon, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { label: "PNG", ext: ".png", icon: ImageIcon, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { label: "MP4", ext: ".mp4,.mov,.mkv", icon: Video, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  { label: "DOCX", ext: ".docx,.doc", icon: FileText, color: "text-sky-500 bg-sky-500/10 border-sky-500/20" },
  { label: "WEBP", ext: ".webp", icon: ImageIcon, color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
  { label: "MP3", ext: ".mp3,.wav,.ogg", icon: Music, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
];

export function ModernDropzone() {
  const router = useRouter();
  const [detected, setDetected] = useState<DetectedFileInfo | null>(null);
  const [selectedTool, setSelectedTool] = useState<ConversionOption | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = useCallback((file: File) => {
    const info = detectFileTools(file);
    setDetected(info);
    setSelectedTool(info.defaultTool);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleFileSelection(acceptedFiles[0]);
      }
    },
    [handleFileSelection]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !!detected,
  });

  // Handle Clipboard Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const pastedFile = e.clipboardData.files[0];
        handleFileSelection(pastedFile);
        setPasteNotice("File pasted from clipboard!");
        setTimeout(() => setPasteNotice(null), 3000);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileSelection]);

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith("image/") || type.startsWith("application/")) {
              const blob = await item.getType(type);
              const file = new window.File([blob], `pasted_file.${type.split("/")[1] || "png"}`, { type });
              handleFileSelection(file);
              return;
            }
          }
        }
      }
      setPasteNotice("Press Ctrl+V to paste a copied image or file.");
      setTimeout(() => setPasteNotice(null), 4000);
    } catch {
      setPasteNotice("Press Ctrl+V to paste a copied image or file.");
      setTimeout(() => setPasteNotice(null), 4000);
    }
  };

  const handleFormatClick = (ext: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.accept = ext;
      fileInputRef.current.click();
    }
  };

  const handleStartConversion = async () => {
    if (!detected || !selectedTool) return;
    setIsNavigating(true);

    // Save pending file to transfer cache for automatic instant start
    await storePendingFile(detected.file, selectedTool.slug);

    // Navigate to target tool page with autostart parameter
    router.push(`/${selectedTool.slug}?autostart=true`);
  };

  const resetSelection = () => {
    if (detected?.previewUrl) {
      URL.revokeObjectURL(detected.previewUrl);
    }
    setDetected(null);
    setSelectedTool(null);
    setIsNavigating(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4">
      {/* Hidden File Input for Format Buttons */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
          }
        }}
      />

      {/* Glow Backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-purple-600/30 rounded-[2rem] blur-xl opacity-70 pointer-events-none -z-10 animate-pulse" />

      {/* Main Glass Container Box */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border transition-all duration-500 backdrop-blur-2xl shadow-2xl ${
          isDragActive
            ? "border-blue-400 bg-[#0a1228]/95 scale-[1.01] shadow-[0_0_80px_rgba(59,130,246,0.35)]"
            : "border-blue-500/30 bg-[#070c1b]/90 hover:border-blue-500/50 shadow-[0_0_50px_rgba(30,58,138,0.25)]"
        }`}
      >
        {!detected ? (
          /* IDLE / EMPTY STATE MATCHING SCREENSHOT - VIEWPORT OPTIMIZED */
          <div className="relative p-5 sm:p-7 md:p-9 flex flex-col items-center justify-center text-center cursor-pointer min-h-[350px] sm:min-h-[380px]">
            <input {...getInputProps()} />

            {/* Orbit / Rings Background Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              {/* Radial Glow */}
              <div className="absolute w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Concentric Elliptical Perspective Rings */}
              <div className="absolute w-[600px] h-[300px] rounded-full border border-blue-500/10 [transform:rotateX(65deg)]" />
              <div className="absolute w-[460px] h-[230px] rounded-full border border-blue-500/20 [transform:rotateX(65deg)]" />
              <div className="absolute w-[320px] h-[160px] rounded-full border border-indigo-500/25 [transform:rotateX(65deg)]" />
            </div>

            {/* Floating Orbit Format Badges & Center Pedestal */}
            <div className="relative w-full max-w-md h-24 sm:h-28 flex items-center justify-center mb-1.5">
              {/* PDF Badge - Left */}
              <div className="absolute left-4 sm:left-10 top-6 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#141d33]/90 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-bounce [animation-duration:3s]">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-red-400">PDF</span>
              </div>

              {/* Gallery Badge - Top Left */}
              <div className="absolute left-20 sm:left-28 -top-1 flex items-center p-1.5 rounded-lg bg-[#141d33]/90 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              {/* Video Badge - Top Center Left */}
              <div className="absolute left-32 sm:left-38 -top-4 flex items-center p-1.5 rounded-lg bg-[#141d33]/90 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Video className="w-3.5 h-3.5 text-blue-400" />
              </div>

              {/* Glowing Pedestal & Center Document Icon */}
              <div className="relative flex flex-col items-center">
                {/* 3D Glowing Neon Center Icon */}
                <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-blue-500/80 to-indigo-700/80 p-0.5 shadow-[0_0_35px_rgba(59,130,246,0.55)] flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <div className="w-full h-full bg-[#0d1733] rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-indigo-400/20" />
                    <FileText className="w-8 h-8 sm:w-9 sm:h-9 text-blue-400 relative z-10 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  </div>
                </div>

                {/* Glowing Illuminated Pedestal Disc */}
                <div className="w-28 sm:w-32 h-5 -mt-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 blur-sm opacity-80" />
                <div className="w-20 sm:w-24 h-3.5 -mt-3.5 rounded-full bg-cyan-300 blur-xs opacity-90" />
              </div>

              {/* Music Badge - Top Right */}
              <div className="absolute right-20 sm:right-28 -top-1 flex items-center p-1.5 rounded-lg bg-[#141d33]/90 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse">
                <Music className="w-3.5 h-3.5 text-purple-400" />
              </div>

              {/* Doc Badge - Right */}
              <div className="absolute right-4 sm:right-10 top-6 flex items-center p-1.5 rounded-lg bg-[#141d33]/90 border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)] animate-bounce [animation-duration:3.5s]">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>

            {/* Main Prompt Titles */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1">
              Drop any file <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">here</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-5">
              We&apos;ll automatically identify your file and recommend the best conversion.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-7 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                Choose File
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePasteClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-medium text-slate-300 bg-[#131d38]/80 hover:bg-[#1c294e] border border-slate-700/60 hover:border-slate-500 shadow-md transition-all duration-200"
              >
                <Clipboard className="w-4 h-4 text-slate-400" />
                Paste / Drop
              </button>
            </div>

            {pasteNotice && (
              <div className="mb-3 text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3.5 py-1 rounded-full animate-fade-in">
                {pasteNotice}
              </div>
            )}

            {/* Separator */}
            <div className="flex items-center gap-3 w-full max-w-xs mb-4 text-[11px] text-slate-500 font-medium">
              <div className="flex-1 h-[1px] bg-slate-800" />
              <span>or convert directly</span>
              <div className="flex-1 h-[1px] bg-slate-800" />
            </div>

            {/* Quick Format Pills Row */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl">
              {POPULAR_FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.label}
                    type="button"
                    onClick={(e) => handleFormatClick(fmt.ext, e)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#11192e] hover:bg-[#192442] border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <Icon className="w-3 h-3 text-blue-400" />
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* DETECTED FILE STATE WITH SMART TOOL SELECTOR */
          <div className="p-5 sm:p-7 md:p-8 text-left">
            {/* Top Bar with File Details */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>File Detected & Analyzed</span>
              </div>
              <button
                onClick={resetSelection}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Choose different file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
              {/* Thumbnail / File Card Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden bg-[#0d162e] border border-blue-500/30 p-3 flex flex-col items-center justify-center relative shadow-xl group">
                  {detected.category === "image" && detected.previewUrl ? (
                    <img
                      src={detected.previewUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : detected.category === "video" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                        {detected.extension} Video
                      </span>
                    </div>
                  ) : detected.category === "audio" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Music className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        {detected.extension} Audio
                      </span>
                    </div>
                  ) : detected.category === "document" && detected.extension === "pdf" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-300">
                        PDF Document
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                        {detected.extension.toUpperCase() || "File"}
                      </span>
                    </div>
                  )}

                  {/* Format Badge Overlay */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#070c1b]/90 border border-slate-700 text-slate-300 shadow">
                    {detected.extension.toUpperCase()}
                  </div>
                </div>

                <div className="mt-2 text-center max-w-[220px]">
                  <p className="text-xs font-semibold text-white truncate" title={detected.name}>
                    {detected.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{detected.sizeFormatted}</p>
                </div>
              </div>

              {/* Conversion Selector & Action */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60 mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Instant Smart Matching</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    What would you like to do?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Select your target format or conversion action below:
                  </p>
                </div>

                {/* Conversion Tools Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Select Target Action:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTool?.slug || ""}
                      onChange={(e) => {
                        const match = detected.tools.find((t) => t.slug === e.target.value);
                        if (match) setSelectedTool(match);
                      }}
                      className="w-full h-12 pl-3.5 pr-10 rounded-xl bg-[#0d162e] border border-blue-500/40 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none cursor-pointer shadow-inner"
                    >
                      {detected.tools.map((tool) => (
                        <option key={tool.slug} value={tool.slug} className="bg-[#070c1b] text-white py-2">
                          {tool.badge ? `[${tool.badge}] ` : ""} {tool.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-xs font-bold">
                      ▼
                    </div>
                  </div>
                  {selectedTool && (
                    <p className="text-[11px] text-slate-400 pl-1">{selectedTool.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    disabled={isNavigating || !selectedTool}
                    onClick={handleStartConversion}
                    className="w-full sm:flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading Tool & Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-yellow-300" />
                        Start Tool & Convert
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetSelection}
                    className="w-full sm:w-auto h-12 px-5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-[#0d162e] hover:bg-[#132042] border border-slate-800 transition-colors"
                  >
                    Change File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
