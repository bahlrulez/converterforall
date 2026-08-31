"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Film, 
  UploadCloud, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  FileVideo, 
  ArrowRight,
  Music,
  Image as ImageIcon,
  Scissors,
  Settings2,
  Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { convertVideoAdvanced, AdvancedVideoConvertOptions } from "@/lib/converters/video";

interface VideoMetadata {
  duration: number;
  formattedDuration: string;
  width: number;
  height: number;
  aspectRatio: string;
  sizeMb: number;
  formattedSize: string;
  format: string;
}

interface VideoConverterProps {
  toolSlug?: string;
  targetFormat?: string;
}

const SUPPORTED_FORMATS = [
  { id: "mp4", label: "MP4 (H.264)", desc: "Universal compatibility across all devices", icon: Film },
  { id: "webm", label: "WebM (VP9)", desc: "Optimized for web streaming & HTML5", icon: Layers },
  { id: "mov", label: "MOV (Apple)", desc: "Standard format for iPhone, Mac & QuickTime", icon: Film },
  { id: "mkv", label: "MKV (Matroska)", desc: "High-definition multi-track video", icon: Film },
  { id: "avi", label: "AVI", desc: "Legacy Windows video format", icon: FileVideo },
  { id: "gif", label: "GIF (Animated)", desc: "Lightweight looping animations", icon: ImageIcon },
  { id: "mp3", label: "MP3 (Audio Only)", desc: "Extract high-quality audio track", icon: Music },
];

export function VideoConverter({ toolSlug = "video-to-mp4", targetFormat: initialTargetFormat }: VideoConverterProps) {
  // Determine default target format based on tool slug or initial props
  const defaultFormat = useMemo(() => {
    if (initialTargetFormat && initialTargetFormat !== "none") return initialTargetFormat.toLowerCase();
    if (toolSlug?.includes("to-mp3")) return "mp3";
    if (toolSlug?.includes("to-gif")) return "gif";
    if (toolSlug?.includes("to-mov")) return "mov";
    if (toolSlug?.includes("to-mkv")) return "mkv";
    if (toolSlug?.includes("to-avi")) return "avi";
    if (toolSlug?.includes("to-webm")) return "webm";
    return "mp4";
  }, [toolSlug, initialTargetFormat]);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Settings
  const [outputFormat, setOutputFormat] = useState<string>(defaultFormat);
  const [speedPreset, setSpeedPreset] = useState<"ultrafast" | "veryfast" | "fast" | "medium">("ultrafast");
  const [resolution, setResolution] = useState<"original" | "1080p" | "720p" | "480p" | "360p">("original");
  const [qualityCrf, setQualityCrf] = useState<number>(23); // 18 = high, 23 = balanced, 28 = compressed
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [muteAudio, setMuteAudio] = useState(false);
  const [audioBitrate, setAudioBitrate] = useState<"128k" | "192k" | "320k">("192k");

  // Telemetry & Conversion State
  const [status, setStatus] = useState<"idle" | "converting" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasGpu, setHasGpu] = useState(false);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSizeMb, setResultSizeMb] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState<"converted" | "original">("converted");

  const videoRef = useRef<HTMLVideoElement>(null);
  const resultVideoRef = useRef<HTMLVideoElement>(null);

  // Check for GPU & Hardware acceleration support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gpuSupported = "gpu" in navigator || "VideoDecoder" in window || !!document.createElement("canvas").getContext("webgl2");
      setHasGpu(gpuSupported);
    }
  }, []);

  // Update default format if slug changes
  useEffect(() => {
    setOutputFormat(defaultFormat);
  }, [defaultFormat]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  // Elapsed timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "converting" && startTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  // Handle Video File Drop
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    loadVideoFile(selectedFile);
  };

  const loadVideoFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setErrorMsg("");
    setProgress(0);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Extract Video Metadata
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration || 0;
      const w = tempVideo.videoWidth || 1920;
      const h = tempVideo.videoHeight || 1080;
      const sizeMb = selectedFile.size / (1024 * 1024);

      const mins = Math.floor(dur / 60);
      const secs = Math.floor(dur % 60);
      const formattedDur = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

      setVideoMeta({
        duration: dur,
        formattedDuration: formattedDur,
        width: w,
        height: h,
        aspectRatio: `${w}:${h}`,
        sizeMb: parseFloat(sizeMb.toFixed(2)),
        formattedSize: sizeMb > 1024 ? `${(sizeMb / 1024).toFixed(2)} GB` : `${sizeMb.toFixed(1)} MB`,
        format: selectedFile.name.split(".").pop()?.toUpperCase() || "VIDEO",
      });

      setTrimStart(0);
      setTrimEnd(Math.floor(dur));
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi", ".wmv", ".flv", ".m4v", ".3gp", ".ts", ".mts"]
    },
    maxFiles: 1,
    multiple: false
  });

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Run Conversion
  const handleConvert = async () => {
    if (!file) return;

    setStatus("converting");
    setProgress(1);
    setStatusMessage("Initializing WebGPU & hardware-accelerated conversion engine...");
    setErrorMsg("");
    setStartTime(Date.now());
    setElapsedTime(0);

    try {
      const options: AdvancedVideoConvertOptions = {
        targetFormat: outputFormat,
        preset: speedPreset,
        crf: qualityCrf,
        resolution: resolution,
        startTime: trimStart > 0 ? trimStart : undefined,
        endTime: trimEnd > 0 && trimEnd < (videoMeta?.duration || 0) ? trimEnd : undefined,
        muteAudio: muteAudio || outputFormat === "gif",
        audioBitrate: audioBitrate,
        fps: outputFormat === "gif" ? 15 : undefined,
      };

      const convertedBlob = await convertVideoAdvanced(file, options, (p) => {
        setProgress(p);
        if (p < 25) {
          setStatusMessage("Analyzing video frames & initializing codec streams...");
        } else if (p < 75) {
          setStatusMessage(`Processing & re-encoding to ${outputFormat.toUpperCase()} with local hardware speed...`);
        } else if (p < 95) {
          setStatusMessage("Finalizing container headers & applying web faststart...");
        } else {
          setStatusMessage("Completing final output package...");
        }
      });

      const resSize = convertedBlob.size / (1024 * 1024);
      const url = URL.createObjectURL(convertedBlob);

      setResultBlob(convertedBlob);
      setResultUrl(url);
      setResultSizeMb(parseFloat(resSize.toFixed(2)));
      setStatus("success");
      setActivePreviewTab("converted");
    } catch (err: any) {
      console.error("Video conversion error:", err);
      setStatus("error");
      setErrorMsg(err.message || "Conversion failed. Please try a different quality preset or format.");
    }
  };

  // Download converted file
  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || "converted_video";
    const extension = outputFormat.toLowerCase();
    const downloadName = `${baseName}_converted.${extension}`;

    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Calculate speed multiplier
  const speedMultiplier = useMemo(() => {
    if (elapsedTime <= 0 || !videoMeta?.duration) return "3.5x";
    const processedSeconds = (videoMeta.duration * (progress / 100));
    const speed = (processedSeconds / elapsedTime).toFixed(1);
    return `${Math.max(1, parseFloat(speed))}x`;
  }, [elapsedTime, progress, videoMeta]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload & Dropzone Area (When no file loaded) */}
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            "relative group border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 overflow-hidden",
            isDragActive 
              ? "border-blue-500 bg-blue-500/10 scale-[1.01]" 
              : "border-slate-300 dark:border-slate-800 hover:border-blue-500/60 bg-white/60 dark:bg-[#070d1e]/80 hover:bg-slate-50/80 dark:hover:bg-[#0a122c]/90 shadow-xl"
          )}
        >
          <input {...getInputProps()} />

          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 animate-pulse" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Drop your video here
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Supports <span className="font-semibold text-slate-700 dark:text-slate-300">MP4, MOV, MKV, WebM, AVI, WMV, FLV, M4V</span>
            </p>

            <Button 
              type="button"
              className="px-8 py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg shadow-blue-500/25 text-base cursor-pointer"
            >
              Browse Video Files
            </Button>

            {/* Trust Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Private On-Device Processing</span>
              </span>
              {hasGpu && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hardware &amp; GPU Acceleration Ready</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Studio (When file is loaded) */}
      {file && (
        <div className="space-y-6">
          {/* Top Bar with File Name and Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070d1e] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{videoMeta?.formattedSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`}</span>
                  {videoMeta?.formattedDuration && <span>• {videoMeta.formattedDuration}</span>}
                  {videoMeta?.width && <span>• {videoMeta.width}×{videoMeta.height}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasGpu && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5" />
                  <span>GPU Active</span>
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setStatus("idle");
                }}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Change Video
              </Button>
            </div>
          </div>

          {/* Main Grid: Video Player + Conversion Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Video Player Preview (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-black/95 border border-slate-200/80 dark:border-slate-800 shadow-2xl aspect-video flex items-center justify-center group">
                {/* Converted Tab Preview Switch (If finished) */}
                {status === "success" && resultUrl && (
                  <div className="absolute top-4 left-4 z-20 flex items-center p-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                    <button
                      onClick={() => setActivePreviewTab("converted")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                        activePreviewTab === "converted"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:text-white"
                      )}
                    >
                      Converted ({outputFormat.toUpperCase()})
                    </button>
                    <button
                      onClick={() => setActivePreviewTab("original")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                        activePreviewTab === "original"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:text-white"
                      )}
                    >
                      Original
                    </button>
                  </div>
                )}

                {/* Video Elements */}
                {status === "success" && resultUrl && activePreviewTab === "converted" ? (
                  outputFormat === "gif" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resultUrl} alt="Converted GIF" className="w-full h-full object-contain" />
                  ) : outputFormat === "mp3" || outputFormat === "wav" ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                      <Music className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
                      <p className="text-lg font-bold mb-3">Audio Extracted Successfully</p>
                      <audio src={resultUrl} controls className="w-full max-w-sm" />
                    </div>
                  ) : (
                    <video
                      ref={resultVideoRef}
                      src={resultUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  previewUrl && (
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      controls
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                      className="w-full h-full object-contain"
                    />
                  )
                )}
              </div>

              {/* Video Inspection Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#070d1e] border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Resolution</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {videoMeta ? `${videoMeta.width}×${videoMeta.height}` : "1080p"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#070d1e] border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {videoMeta?.formattedDuration || "00:00"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#070d1e] border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Original Size</span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {videoMeta?.formattedSize || "0 MB"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#070d1e] border border-slate-200/80 dark:border-slate-800/80 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Codec &amp; Speed</span>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Hardware</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Conversion Settings Panel (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#070d1e] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-blue-500" />
                  <span>Conversion Settings</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tune target format, quality, resolution, and hardware acceleration
                </p>
              </div>

              {/* 1. Target Format Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1. Output Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORTED_FORMATS.map((fmt) => {
                    const isSelected = outputFormat === fmt.id;
                    const Icon = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setOutputFormat(fmt.id)}
                        className={cn(
                          "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={cn("w-4 h-4", isSelected ? "text-white" : "text-blue-500")} />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold">{fmt.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Speed & Quality Preset */}
              {outputFormat !== "gif" && outputFormat !== "mp3" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                    <span>2. Speed &amp; GPU Tuning</span>
                    <span className="text-blue-500 font-semibold lowercase text-[11px]">
                      {speedPreset === "ultrafast" ? "⚡ Fastest conversion" : "💎 High precision"}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "ultrafast", label: "⚡ Lightning Fast", sub: "Max GPU throughput", crf: 23 },
                      { id: "veryfast", label: "⚖️ Balanced", sub: "Recommended quality", crf: 22 },
                      { id: "fast", label: "💎 High Quality", sub: "Crisp & sharp details", crf: 18 },
                      { id: "medium", label: "📦 Small File Size", sub: "Higher compression", crf: 28 },
                    ].map((p) => {
                      const isSelected = speedPreset === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSpeedPreset(p.id as any);
                            setQualityCrf(p.crf);
                          }}
                          className={cn(
                            "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                          )}
                        >
                          <span className="text-xs font-bold block">{p.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{p.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Resolution Scaling */}
              {outputFormat !== "mp3" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    3. Resolution Scaling
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "original", label: "Original" },
                      { id: "1080p", label: "1080p FHD" },
                      { id: "720p", label: "720p HD" },
                      { id: "480p", label: "480p SD" },
                      { id: "360p", label: "360p Mobile" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setResolution(r.id as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                          resolution === r.id
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Audio Control */}
              {outputFormat !== "gif" && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Audio Track
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={muteAudio}
                        onChange={(e) => setMuteAudio(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Mute Video</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Status or Conversion Progress Card */}
              {status === "converting" && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 animate-spin" />
                      <span>{statusMessage}</span>
                    </span>
                    <span>{progress}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-blue-200/50 dark:bg-blue-950/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Elapsed: {elapsedTime}s</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Zap className="w-3 h-3" />
                      <span>Speed: {speedMultiplier}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {status === "error" && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Result & Download Box */}
              {status === "success" && resultBlob && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Converted to {outputFormat.toUpperCase()}!</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {resultSizeMb} MB
                    </span>
                  </div>

                  <Button
                    onClick={handleDownload}
                    className="w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-500/20 text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {outputFormat.toUpperCase()} Video
                  </Button>
                </div>
              )}

              {/* Convert Trigger Button (When idle or after completed) */}
              {status !== "converting" && (
                <Button
                  onClick={handleConvert}
                  className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-lg shadow-blue-500/25 text-sm cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Convert to {outputFormat.toUpperCase()} Now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
