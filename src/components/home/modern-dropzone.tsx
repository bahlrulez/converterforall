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
  Play,
  AlignLeft,
  Plus,
} from "lucide-react";
import { detectFileTools, DetectedFileInfo, ConversionOption } from "@/lib/file-detection";
import { storePendingFile } from "@/lib/file-transfer";

const POPULAR_FORMATS = [
  { label: "PDF", ext: ".pdf", icon: FileText, color: "text-red-400" },
  { label: "JPG", ext: ".jpg,.jpeg", icon: ImageIcon, color: "text-emerald-400" },
  { label: "PNG", ext: ".png", icon: ImageIcon, color: "text-blue-400" },
  { label: "MP4", ext: ".mp4,.mov,.mkv", icon: Video, color: "text-purple-400" },
  { label: "DOCX", ext: ".docx,.doc", icon: FileText, color: "text-sky-400" },
  { label: "WEBP", ext: ".webp", icon: ImageIcon, color: "text-teal-400" },
  { label: "MP3", ext: ".mp3,.wav,.ogg", icon: Music, color: "text-amber-400" },
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

    // Save pending file to persistent transfer cache for automatic instant start
    await storePendingFile(detected.file, selectedTool.slug);

    // For video & audio tools requiring SharedArrayBuffer headers, use full page load
    // For other tools (image, PDF, documents, etc.), router.push transitions instantly
    if (detected.category === "video" || detected.category === "audio") {
      window.location.href = `/${selectedTool.slug}?autostart=true`;
    } else {
      router.push(`/${selectedTool.slug}?autostart=true`);
    }
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
    <div className="relative w-full max-w-4xl mx-auto">
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

      {/* Dual-Side Glowing Halo Behind Box (Blue on left, Magenta/Purple on right) */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/20 dark:from-blue-600/40 dark:via-indigo-500/25 dark:to-purple-600/40 rounded-[2.25rem] blur-2xl opacity-80 pointer-events-none -z-10" />

      {/* Main Container Box */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-[2.25rem] border-2 transition-all duration-300 ${
          isDragActive
            ? "border-blue-500 bg-blue-50/90 dark:bg-[#0a1228]/95 scale-[1.01] shadow-[0_0_80px_rgba(59,130,246,0.3)]"
            : "border-slate-200 dark:border-blue-500/30 hover:border-blue-400/80 dark:hover:border-blue-400/60 bg-white dark:bg-[#070d1e] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_0_60px_rgba(30,58,138,0.3)]"
        }`}
      >
        {!detected ? (
          /* IDLE / EMPTY STATE */
          <div className="relative p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center text-center cursor-pointer min-h-[270px] sm:min-h-[300px]">
            <input {...getInputProps()} />

            {/* Ambient Lighting Rays Inside Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10">
              <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* 3D Floating Isometric File Cards & Glowing Cloud Center */}
            <div className="relative w-full max-w-md h-20 sm:h-24 flex items-center justify-center mb-1 select-none">
              {/* LEFT SIDE FLOATING 3D CARDS */}

              {/* 1. PDF Card (Top-Left) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".pdf", e)}
                title="Select PDF"
                className="absolute left-3 sm:left-10 top-1 w-9 h-11 sm:w-11 sm:h-13 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#1a1429]/90 dark:to-[#100d1e]/95 border border-red-200 dark:border-red-500/40 p-1 flex flex-col items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(239,68,68,0.25)] animate-float-1 hover:scale-110 hover:border-red-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(15deg) rotateX(10deg)" }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="text-[8px] font-extrabold text-red-500 dark:text-red-400 tracking-wider">PDF</span>
              </button>

              {/* 2. Photo / JPG Card (Mid-Left) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".jpg,.jpeg,.png", e)}
                title="Select Photo/Image"
                className="absolute left-16 sm:left-24 -top-2 w-9 h-10 sm:w-10 sm:h-12 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#0e1938]/90 dark:to-[#0a1128]/95 border border-blue-200 dark:border-blue-500/40 p-1 flex items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(59,130,246,0.25)] animate-float-2 hover:scale-110 hover:border-blue-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(18deg) rotateX(-8deg)" }}
              >
                <div className="w-6 h-6 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button>

              {/* 3. Audio Card (Bottom-Left) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".mp3,.wav", e)}
                title="Select Audio"
                className="absolute left-10 sm:left-16 bottom-0 w-8 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#1c1538]/90 dark:to-[#120e26]/95 border border-purple-200 dark:border-purple-500/40 p-1 flex items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(168,85,247,0.25)] animate-float-3 hover:scale-110 hover:border-purple-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(12deg) rotateX(15deg)" }}
              >
                <div className="w-5 h-5 rounded-md bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </button>

              {/* CENTER GLOWING UPLOAD CLOUD ORB */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(59,130,246,0.35)] dark:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center animate-float-center hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-white dark:bg-[#0c1530] rounded-full flex items-center justify-center relative overflow-hidden border border-blue-200 dark:border-blue-400/40 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 dark:from-blue-500/30 dark:to-purple-500/20" />
                    <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-white relative z-10 drop-shadow-sm" />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE FLOATING 3D CARDS */}

              {/* 4. Video Play Card (Top-Right) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".mp4,.mov", e)}
                title="Select Video"
                className="absolute right-16 sm:right-24 -top-2 w-9 h-10 sm:w-10 sm:h-12 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#1c1332]/90 dark:to-[#120a22]/95 border border-purple-200 dark:border-purple-500/40 p-1 flex items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(168,85,247,0.25)] animate-float-4 hover:scale-110 hover:border-purple-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(-18deg) rotateX(-8deg)" }}
              >
                <div className="w-6 h-6 rounded-md bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-purple-500 dark:fill-purple-400 text-purple-500 dark:text-purple-400" />
                </div>
              </button>

              {/* 5. Document / Lines Card (Mid-Right) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".docx,.doc,.txt", e)}
                title="Select Document"
                className="absolute right-3 sm:right-10 top-1 w-9 h-11 sm:w-11 sm:h-13 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#0c1836]/90 dark:to-[#081024]/95 border border-sky-200 dark:border-sky-500/40 p-1 flex flex-col items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(14,165,233,0.25)] animate-float-5 hover:scale-110 hover:border-sky-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(-15deg) rotateX(10deg)" }}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
                  <AlignLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="text-[8px] font-extrabold text-sky-600 dark:text-sky-400 tracking-wider">DOCX</span>
              </button>

              {/* 6. Gallery / Landscape Card (Bottom-Right) */}
              <button
                type="button"
                onClick={(e) => handleFormatClick(".png,.webp", e)}
                title="Select Image"
                className="absolute right-10 sm:right-16 bottom-0 w-8 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#0c2420]/90 dark:to-[#061412]/95 border border-emerald-200 dark:border-emerald-500/40 p-1 flex items-center justify-center shadow-md dark:shadow-[0_8px_20px_rgba(16,185,129,0.25)] animate-float-2 hover:scale-110 hover:border-emerald-400 transition-all duration-300 cursor-pointer group"
                style={{ transform: "perspective(600px) rotateY(-12deg) rotateX(15deg)" }}
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </button>
            </div>

            {/* Main Prompt Heading */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
              Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300">any file</span> here
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 max-w-sm">
              We&apos;ll automatically identify your file and recommend the best conversion.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-[#121b36]/90 dark:hover:bg-[#1a274c] border border-slate-300 dark:border-slate-700/80 shadow-sm transition-all duration-200"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Paste / Drop
              </button>
            </div>

            {pasteNotice && (
              <div className="mb-2 text-xs font-medium text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/50 border border-blue-200 dark:border-cyan-800/60 px-3 py-0.5 rounded-full animate-fade-in">
                {pasteNotice}
              </div>
            )}

            {/* Separator */}
            <div className="flex items-center gap-3 w-full max-w-xs mb-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800/80" />
              <span>or convert directly</span>
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800/80" />
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#0e162e] dark:hover:bg-[#162244] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:scale-105 shadow-2xs"
                  >
                    <Icon className={`w-3 h-3 ${fmt.color}`} />
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*/*";
                    fileInputRef.current.click();
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 transition-all duration-200 hover:scale-105 shadow-2xs"
              >
                <Plus className="w-3 h-3 text-blue-500" />
                <span>More</span>
              </button>
            </div>
          </div>
        ) : (
          /* DETECTED FILE STATE WITH SMART TOOL SELECTOR */
          <div className="p-6 sm:p-8 text-left">
            {/* Top Bar with File Details */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>File Detected &amp; Analyzed</span>
              </div>
              <button
                onClick={resetSelection}
                className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Choose different file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
              {/* Thumbnail / File Card Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0d162e] border border-slate-200 dark:border-blue-500/30 p-3 flex flex-col items-center justify-center relative shadow-md group">
                  {detected.category === "image" && detected.previewUrl ? (
                    <img
                      src={detected.previewUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : detected.category === "video" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                        {detected.extension} Video
                      </span>
                    </div>
                  ) : detected.category === "audio" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Music className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                        {detected.extension} Audio
                      </span>
                    </div>
                  ) : detected.category === "document" && detected.extension === "pdf" ? (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-300">
                        PDF Document
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                        {detected.extension.toUpperCase() || "File"}
                      </span>
                    </div>
                  )}

                  {/* Format Badge Overlay */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-[#070c1b]/90 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow">
                    {detected.extension.toUpperCase()}
                  </div>
                </div>

                <div className="mt-2 text-center max-w-[220px]">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate" title={detected.name}>
                    {detected.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{detected.sizeFormatted}</p>
                </div>
              </div>

              {/* Conversion Selector Options */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                    Choose Conversion Tool
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {detected.tools.map((tool) => {
                      const isSelected = selectedTool?.slug === tool.slug;
                      return (
                        <div
                          key={tool.slug}
                          onClick={() => setSelectedTool(tool)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-slate-900 dark:text-white shadow-sm"
                              : "bg-slate-50 dark:bg-[#0b1329] border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold truncate">{tool.title}</span>
                              {tool.badge && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{tool.description}</span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 dark:border-slate-600"
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Start Tool Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleStartConversion}
                    disabled={isNavigating || !selectedTool}
                    className="w-full h-12 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Opening {selectedTool?.title}...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
                        <span>Start {selectedTool?.title || "Tool"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                    Your file will load directly and start converting instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
