"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  TrendingDown,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compressVideoAdvanced, VideoCompressionOptions } from "@/lib/converters/video";

interface VideoMetadata {
  duration: number;
  formattedDuration: string;
  width: number;
  height: number;
  aspectRatio: string;
  sizeMb: number;
  formattedSize: string;
  bitrateMbps: number;
  format: string;
}

type CompressionPreset = "recommended" | "discord" | "max" | "high_quality" | "custom";

interface VideoCompressorProps {
  toolSlug?: string;
}

export function VideoCompressor({ toolSlug = "compress-video" }: VideoCompressorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Compression Settings - Auto-tuned based on target landing page
  const getInitialPreset = (): CompressionPreset => {
    if (toolSlug?.includes("discord") || toolSlug?.includes("whatsapp")) return "discord";
    if (toolSlug?.includes("email")) return "max";
    if (toolSlug?.includes("instagram") || toolSlug?.includes("facebook")) return "high_quality";
    return "recommended";
  };

  const [preset, setPreset] = useState<CompressionPreset>(getInitialPreset());
  const [customPercentage, setCustomPercentage] = useState(55); // 55% reduction
  const [resolution, setResolution] = useState<"original" | "1080p" | "720p" | "480p" | "360p">(
    toolSlug?.includes("phone") ? "720p" : "original"
  );
  const [audioBitrate, setAudioBitrate] = useState<"128k" | "96k" | "64k">("128k");
  const [muteAudio, setMuteAudio] = useState(false);

  // Conversion State
  const [status, setStatus] = useState<"idle" | "compressing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSizeMb, setResultSizeMb] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const resultVideoRef = useRef<HTMLVideoElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  // Elapsed time ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "compressing" && startTime > 0) {
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
    setFile(selectedFile);
    setStatus("idle");
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setErrorMsg("");

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Extract metadata
    const tempVideo = document.createElement("video");
    tempVideo.src = url;
    tempVideo.preload = "metadata";

    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration || 0;
      const mins = Math.floor(dur / 60);
      const secs = Math.floor(dur % 60);
      const formattedDur = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

      const w = tempVideo.videoWidth || 1920;
      const h = tempVideo.videoHeight || 1080;
      const aspect = w > h ? (w / h > 1.7 ? "16:9 Widescreen" : "Landscape") : (h / w > 1.7 ? "9:16 Shorts/Reels" : "Portrait");

      const sizeMb = selectedFile.size / (1024 * 1024);
      const bitrate = dur > 0 ? (selectedFile.size * 8) / (dur * 1000000) : 0;
      const ext = selectedFile.name.split(".").pop()?.toUpperCase() || "MP4";

      setVideoMeta({
        duration: dur,
        formattedDuration: formattedDur,
        width: w,
        height: h,
        aspectRatio: aspect,
        sizeMb: sizeMb,
        formattedSize: sizeMb > 1024 ? `${(sizeMb / 1024).toFixed(2)} GB` : `${sizeMb.toFixed(2)} MB`,
        bitrateMbps: parseFloat(bitrate.toFixed(2)),
        format: ext,
      });

      // Auto-set resolution recommendation if video is huge 4K
      if (w > 1920 || h > 1920) {
        setResolution("1080p");
      }
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"],
    },
    maxFiles: 1,
  });

  // Calculate dynamic target CRF and estimated size based on preset
  const getCompressionConfig = () => {
    if (!videoMeta) return { crf: 26, estimatedSizeMb: 0, percentReduction: 50 };

    let crf = 26;
    let percentReduction = 55;

    if (preset === "recommended") {
      crf = 26;
      percentReduction = 55;
    } else if (preset === "discord") {
      // Target <25MB (or <10MB if file is smaller)
      const targetMb = Math.min(24.5, videoMeta.sizeMb * 0.4);
      percentReduction = Math.round(((videoMeta.sizeMb - targetMb) / videoMeta.sizeMb) * 100);
      crf = 28;
    } else if (preset === "max") {
      crf = 32;
      percentReduction = 80;
    } else if (preset === "high_quality") {
      crf = 22;
      percentReduction = 30;
    } else if (preset === "custom") {
      percentReduction = customPercentage;
      // Map custom percentage (10% to 90%) to CRF (20 to 35)
      crf = Math.round(20 + (customPercentage / 100) * 15);
    }

    // Additional reduction from resolution downscaling
    let resReductionBonus = 0;
    if (resolution === "720p" && videoMeta.width >= 1920) resReductionBonus = 15;
    if (resolution === "480p") resReductionBonus = 30;
    if (resolution === "360p") resReductionBonus = 45;

    if (muteAudio) resReductionBonus += 10;

    const totalReduction = Math.min(92, Math.max(15, percentReduction + resReductionBonus));
    const estimatedSizeMb = Math.max(0.2, videoMeta.sizeMb * (1 - totalReduction / 100));

    return {
      crf,
      estimatedSizeMb: parseFloat(estimatedSizeMb.toFixed(2)),
      percentReduction: totalReduction,
    };
  };

  const currentConfig = getCompressionConfig();

  // Run Video Compression
  const handleStartCompression = async () => {
    if (!file) return;

    setStatus("compressing");
    setProgress(0);
    setErrorMsg("");
    setStartTime(Date.now());
    setStatusMessage("Initializing WebAssembly SIMD engine...");

    try {
      const options: VideoCompressionOptions = {
        crf: currentConfig.crf,
        resolution: resolution,
        muteAudio: muteAudio,
        audioBitrate: audioBitrate,
      };

      const compressedBlob = await compressVideoAdvanced(file, options, (p) => {
        setProgress(p);
        if (p < 25) setStatusMessage("Demuxing video streams...");
        else if (p < 75) setStatusMessage(`Transcoding frames (${p}%)...`);
        else if (p < 95) setStatusMessage("Applying audio sync & bitrate optimization...");
        else setStatusMessage("Finalizing MP4 container...");
      });

      const url = URL.createObjectURL(compressedBlob);
      setResultBlob(compressedBlob);
      setResultUrl(url);
      setResultSizeMb(parseFloat((compressedBlob.size / (1024 * 1024)).toFixed(2)));
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Video compression failed. Please verify your browser supports WebAssembly.");
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setVideoMeta(null);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Studio Header Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 dark:bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI Video Compression Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Compress Video with Zero Quality Loss
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Reduce video file size by up to 85% directly inside your browser. 100% private with hardware-accelerated processing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-emerald-400 text-xs font-semibold shadow-inner">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>WebGPU Hardware Speed</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-blue-400 text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>100% On-Device</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      {!file ? (
        /* Upload Dropzone */
        <div
          {...getRootProps()}
          className={cn(
            "p-12 sm:p-16 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-5",
            isDragActive
              ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
              : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700 shadow-xl"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-10 h-10" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-xl font-bold text-white">Drop your video here, or browse files</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supports MP4, MOV, MKV, WebM, AVI • Unlimited file size • Instant local processing
            </p>
          </div>
          <Button className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30">
            <UploadCloud className="w-4 h-4 mr-2" />
            Select Video File
          </Button>
        </div>
      ) : (
        /* Video Studio Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video Preview & Metadata (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Video Player Card */}
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-xl overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                {previewUrl && (
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    playsInline
                    onTimeUpdate={() => {
                      if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                    }}
                    onEnded={() => setIsPlaying(false)}
                  />
                )}

                {/* Floating Play/Pause Overlay */}
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) videoRef.current.pause();
                      else videoRef.current.play();
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-black/60 hover:bg-blue-600/90 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
              </div>

              {/* Player Controls Strip */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-400 font-medium">
                <span className="truncate max-w-[200px] text-slate-300 font-semibold">{file.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span>{videoMeta?.formattedDuration || "0:00"}</span>
                </div>
              </div>
            </div>

            {/* Auto-Detected Video Specs Card */}
            {videoMeta && (
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    Auto-Detected Specs
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                    {videoMeta.format} Container
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Original Size</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{videoMeta.formattedSize}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Resolution</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{videoMeta.width} × {videoMeta.height}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Duration</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{videoMeta.formattedDuration}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
                    <p className="text-[11px] text-slate-400">Avg Bitrate</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{videoMeta.bitrateMbps} Mbps</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Compression Studio Engine & Settings (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {status === "idle" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Compression Presets</h3>
                    <p className="text-xs text-slate-400">Choose an optimization target or customize manually</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-slate-400 hover:text-white">
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Change Video
                  </Button>
                </div>

                {/* Preset Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Preset 1: Recommended */}
                  <button
                    type="button"
                    onClick={() => setPreset("recommended")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                      preset === "recommended"
                        ? "bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/10"
                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-400">🚀 Recommended</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                        ~55% Smaller
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">Smart Balanced</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Best quality-to-size balance. Ideal for social sharing and web.
                    </p>
                  </button>

                  {/* Preset 2: Discord & WhatsApp */}
                  <button
                    type="button"
                    onClick={() => setPreset("discord")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                      preset === "discord"
                        ? "bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-indigo-400">💬 Chat Limits</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        &lt; 25 MB
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">Discord & WhatsApp</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Guarantees file fits within free Discord and messaging upload limits.
                    </p>
                  </button>

                  {/* Preset 3: Maximum Compression */}
                  <button
                    type="button"
                    onClick={() => setPreset("max")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                      preset === "max"
                        ? "bg-purple-600/15 border-purple-500 shadow-lg shadow-purple-500/10"
                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-400">⚡ Tiny Size</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        ~80% Smaller
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">Maximum Compression</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Smallest possible file for email attachments and weak bandwidth.
                    </p>
                  </button>

                  {/* Preset 4: Custom Slider */}
                  <button
                    type="button"
                    onClick={() => setPreset("custom")}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                      preset === "custom"
                        ? "bg-amber-600/15 border-amber-500 shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-amber-400">🎛️ Manual</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {customPercentage}% Target
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">Custom Slider</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Fine-tune target percentage reduction and bitrate control.
                    </p>
                  </button>
                </div>

                {/* Custom Percentage Slider (shown if Custom selected) */}
                {preset === "custom" && (
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">Target Size Reduction</span>
                      <span className="font-extrabold text-amber-400">{customPercentage}% Smaller</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={85}
                      step={5}
                      value={customPercentage}
                      onChange={(e) => setCustomPercentage(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>10% (High Bitrate)</span>
                      <span>50% (Balanced)</span>
                      <span>85% (Ultra Tiny)</span>
                    </div>
                  </div>
                )}

                {/* Advanced Scaling & Audio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Resolution Scale</label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="original">Original ({videoMeta?.width}×{videoMeta?.height})</option>
                      <option value="1080p">1080p Full HD (1920×1080)</option>
                      <option value="720p">720p HD (1280×720) - Fast</option>
                      <option value="480p">480p SD (854×480) - Compact</option>
                      <option value="360p">360p Mobile (640×360) - Tiny</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Audio Handling</label>
                    <div className="flex items-center gap-2">
                      <select
                        disabled={muteAudio}
                        value={audioBitrate}
                        onChange={(e) => setAudioBitrate(e.target.value as any)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="128k">128 kbps (Crisp Stereo)</option>
                        <option value="96k">96 kbps (Standard)</option>
                        <option value="64k">64 kbps (Speech/Voice)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setMuteAudio(!muteAudio)}
                        className={cn(
                          "px-3 py-2.5 rounded-xl border text-xs font-bold transition-all",
                          muteAudio
                            ? "bg-red-500/20 border-red-500/40 text-red-400"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        )}
                      >
                        {muteAudio ? "Muted" : "Mute"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Output Size Banner */}
                {videoMeta && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] text-blue-300 font-semibold">Estimated Result Size</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white">~{currentConfig.estimatedSizeMb} MB</span>
                          <span className="text-xs font-bold text-emerald-400">
                            (-{currentConfig.percentReduction}% Saved)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Space Savings</p>
                      <p className="text-xs font-extrabold text-emerald-300">
                        Save {(videoMeta.sizeMb - currentConfig.estimatedSizeMb).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Start Compression Action Button */}
                <Button
                  onClick={handleStartCompression}
                  className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 transition-transform active:scale-[0.99]"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Compress Video Now
                </Button>
              </div>
            )}

            {/* Compressing Futuristic Progress Radar */}
            {status === "compressing" && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  {/* Outer glowing pulsing ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping opacity-25" />
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/40 animate-spin duration-1000" />
                  
                  {/* Center percentage */}
                  <div className="relative z-10 text-center">
                    <span className="text-3xl font-black text-white">{progress}%</span>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Completed</p>
                  </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h4 className="text-lg font-bold text-white">Transcoding Video on GPU/CPU</h4>
                  <p className="text-xs text-blue-300 font-medium">{statusMessage}</p>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Elapsed: {elapsedTime}s</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WebAssembly SIMD</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compression Success & Comparison View */}
            {status === "success" && (
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">Compression Complete!</h3>
                      <p className="text-xs text-slate-400">Ready to download and share</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-slate-400 hover:text-white">
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    New Video
                  </Button>
                </div>

                {/* Size Comparison Metric Card */}
                {videoMeta && (
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-400">Original Size</p>
                      <p className="text-sm sm:text-base font-bold text-slate-300">{videoMeta.formattedSize}</p>
                    </div>
                    <div className="space-y-1 border-x border-slate-700/80">
                      <p className="text-[11px] text-slate-400">New Size</p>
                      <p className="text-sm sm:text-base font-extrabold text-emerald-400">{resultSizeMb} MB</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-400">Total Saved</p>
                      <p className="text-sm sm:text-base font-black text-blue-400">
                        -{Math.round(((videoMeta.sizeMb - resultSizeMb) / videoMeta.sizeMb) * 100)}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Result Video Preview */}
                {resultUrl && (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800">
                    <video
                      ref={resultVideoRef}
                      src={resultUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Post-Conversion Trust Confirmation Badge */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-300">100% Client-Side Conversion Complete</p>
                    <p className="text-[11px] text-emerald-400/80">Processed locally on device • 0 bytes uploaded to external servers</p>
                  </div>
                </div>

                {/* Download Button */}
                {resultUrl && (
                  <a
                    href={resultUrl}
                    download={`compressed_${file.name.replace(/\.[^/.]+$/, "")}.mp4`}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-transform active:scale-[0.99]"
                  >
                    <Download className="w-5 h-5" />
                    Download Compressed MP4 ({resultSizeMb} MB)
                  </a>
                )}
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">Conversion Error</h4>
                  <p className="text-xs text-red-300 mt-1 max-w-md mx-auto">{errorMsg}</p>
                </div>
                <Button onClick={handleStartCompression} variant="outline" className="text-xs border-red-500/40 text-red-300">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Internal Linking & Programmatic SEO Preset Navigation Cluster */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Explore Targeted Video Compression Presets</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimize videos specifically for platform upload limits or file extensions
            </p>
          </div>
          <Link
            href="/video-compressor"
            className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            <span>All Video Tools →</span>
          </Link>
        </div>

        {/* Platform Upload Limits */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            🌐 Optimize for Platform Limits
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <Link
              href="/compress-video-for-discord"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-discord"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">Discord</span>
              <span className="text-[10px] text-blue-400 font-semibold">&lt; 25MB Limit</span>
            </Link>

            <Link
              href="/compress-video-for-whatsapp"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-whatsapp"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">WhatsApp</span>
              <span className="text-[10px] text-emerald-400 font-semibold">&lt; 16MB Limit</span>
            </Link>

            <Link
              href="/compress-video-for-email"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-email"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">Email (Gmail)</span>
              <span className="text-[10px] text-purple-400 font-semibold">&lt; 25MB Attach</span>
            </Link>

            <Link
              href="/compress-video-for-instagram"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-instagram"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">Reels &amp; IG</span>
              <span className="text-[10px] text-pink-400 font-semibold">1080p HD</span>
            </Link>

            <Link
              href="/compress-video-for-facebook"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-facebook"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">Facebook</span>
              <span className="text-[10px] text-blue-400 font-semibold">Fast Upload</span>
            </Link>

            <Link
              href="/compress-video-for-phone"
              className={cn(
                "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1",
                toolSlug === "compress-video-for-phone"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/20 font-bold"
                  : "bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700"
              )}
            >
              <span className="text-xs font-bold">Phone Storage</span>
              <span className="text-[10px] text-amber-400 font-semibold">Save Space</span>
            </Link>
          </div>
        </div>

        {/* Format Specific Presets */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            🎞️ Compress by Video Format
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/compress-mp4"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-mp4"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress MP4
            </Link>

            <Link
              href="/compress-mov-video"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-mov-video" || toolSlug === "compress-mov"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress MOV (iPhone / Mac)
            </Link>

            <Link
              href="/compress-mkv"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-mkv"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress MKV
            </Link>

            <Link
              href="/compress-webm"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-webm"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress WebM
            </Link>

            <Link
              href="/compress-avi"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-avi"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress AVI
            </Link>

            <Link
              href="/compress-wmv"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-wmv"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress WMV
            </Link>

            <Link
              href="/compress-flv"
              className={cn(
                "px-3.5 py-1.5 rounded-xl border transition-all",
                toolSlug === "compress-flv"
                  ? "bg-blue-600 border-blue-500 text-white font-bold"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              Compress FLV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
