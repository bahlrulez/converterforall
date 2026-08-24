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
  const [activeMode, setActiveMode] = useState<'file' | 'text'>('file');
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = (toolSlug: string) => {
    if (!pastedText.trim()) return;
    sessionStorage.setItem("font_input_text", pastedText);
    router.push(`/${toolSlug}`);
  };

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
        id="global-file-input"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
          }
        }}
      />

      {/* Premium Segmented Control / Tab Switcher */}
      <div className="flex justify-center mb-4 sm:mb-6 relative z-10">
        <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveMode('file')}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              activeMode === 'file'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Convert Files
          </button>
          <button
            onClick={() => setActiveMode('text')}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              activeMode === 'text'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Convert Text &amp; Fonts
          </button>
        </div>
      </div>

      {/* Main Container Box */}
      {activeMode === 'file' ? (
        <div
          {...getRootProps()}
          className="relative overflow-hidden transition-all duration-300 w-full flex flex-col items-center"
        >
          {!detected ? (
            <div className="relative flex flex-col items-center justify-center text-center cursor-pointer min-h-[170px] sm:min-h-[220px] w-full">
              <input {...getInputProps()} />

              <div className="w-14 h-14 rounded-full border-2 border-slate-700/50 bg-[#0c1630] text-slate-300 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-blue-500/50 group-hover:text-blue-400">
                <UploadCloud className="w-6 h-6" />
              </div>

              {/* Main Prompt Heading */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
                Drop your file here
              </h2>
              
              <div className="flex items-center w-full max-w-[200px] mb-4 opacity-50">
                <div className="h-px flex-1 bg-slate-600"></div>
                <span className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-widest">or</span>
                <div className="h-px flex-1 bg-slate-600"></div>
              </div>

              {/* Action Buttons Row */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                Choose File
              </button>
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
                      className="w-full h-12 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isNavigating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Opening {selectedTool?.title}...</span>
                        </>
                      ) : (
                        <>
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
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] shadow-sm p-4 sm:p-6 flex flex-col gap-4 min-h-[270px] sm:min-h-[300px]">
          <textarea
            autoFocus
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste Text Here... (e.g. Kruti Dev, Satluj, Preeti)"
            className="w-full flex-1 min-h-[150px] resize-none outline-none bg-transparent text-slate-800 dark:text-slate-100 text-lg placeholder:text-slate-400"
          />
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-500"/> Convert To:</span>
            <div className="flex flex-wrap gap-2">
              <button disabled={!pastedText.trim()} onClick={() => handleTextSubmit('krutidev-to-unicode')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/90 hover:border-blue-300 dark:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Kruti Dev → Unicode</button>
              <button disabled={!pastedText.trim()} onClick={() => handleTextSubmit('unicode-to-satluj')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/90 hover:border-blue-300 dark:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Unicode → Satluj</button>
              <button disabled={!pastedText.trim()} onClick={() => handleTextSubmit('preeti-to-unicode')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/90 hover:border-blue-300 dark:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Preeti → Unicode</button>
              <button disabled={!pastedText.trim()} onClick={() => handleTextSubmit('satluj-to-unicode')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/30 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 border border-slate-200/90 hover:border-blue-300 dark:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Satluj → Unicode</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
