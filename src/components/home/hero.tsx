"use client";

import { Sparkles, ShieldCheck } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8 lg:py-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-[#040814] text-white">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] pointer-events-none -z-10" />

      <div className="container relative mx-auto px-4 text-center">
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-500/30 bg-[#0c1630]/80 text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-3 sm:mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>The next generation file converter</span>
        </div>

        {/* Hero Title Matching Screenshot */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 leading-tight max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            100% Private &amp; Secure.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-400 mb-5 sm:mb-6 leading-relaxed">
          Convert, merge, and compress PDF, image, video, and audio files securely in your browser.
        </p>

        {/* Drop Box Hero Container */}
        <div className="mb-4">
          <ModernDropzone />
        </div>

        {/* Trust Badge Below Drop Box */}
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Your files are 100% private and automatically deleted after conversion.</span>
        </div>
      </div>
    </section>
  );
}
