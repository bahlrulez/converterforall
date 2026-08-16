"use client";

import { Sparkles, ShieldCheck } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 bg-[#040814] text-white">
      {/* Ambient background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="container relative mx-auto px-4 text-center">
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-[#0c1630]/80 text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>The next generation file converter</span>
        </div>

        {/* Hero Title Matching Screenshot */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            100% Private &amp; Secure.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
          Convert, merge, and compress PDF, image, video, and audio files securely in your browser.
        </p>

        {/* Drop Box Hero Container */}
        <div className="mb-8">
          <ModernDropzone />
        </div>

        {/* Trust Badge Below Drop Box */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Your files are 100% private and automatically deleted after conversion.</span>
        </div>
      </div>
    </section>
  );
}
