"use client";

import { Sparkles, Shield, Zap, Lock, Laptop, Infinity as InfinityIcon, Layers, Gift } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 md:py-12 bg-[#040814] text-white">
      {/* Dynamic Ambient Glow Behind Hero - Blue on Left, Magenta/Purple on Right */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[90px] pointer-events-none -z-10" />

      <div className="container relative mx-auto px-4 text-center max-w-6xl">
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-[#0c1630]/80 text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] mb-3 sm:mb-4 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          <span>The next generation file converter</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 leading-tight max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            100% Private &amp; Secure.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-400 mb-6 leading-relaxed">
          Convert, merge, and compress PDF, image, video, and audio files securely in your browser.
        </p>

        {/* 4 Mini Feature Pills Row Above Drop Box (Matching Image 3) */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-6 sm:mb-8 text-left">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a1128]/70 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Private</div>
              <div className="text-[10px] text-slate-400">Your files stay local</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a1128]/70 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Lightning Fast</div>
              <div className="text-[10px] text-slate-400">Instant conversion</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a1128]/70 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Secure & Safe</div>
              <div className="text-[10px] text-slate-400">256-bit encryption</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0a1128]/70 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Works Anywhere</div>
              <div className="text-[10px] text-slate-400">No installation</div>
            </div>
          </div>
        </div>

        {/* Drop Box Hero Container */}
        <div className="mb-8">
          <ModernDropzone />
        </div>

        {/* 4 Bottom Trust Cards Grid (Matching Image 3) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080e22]/90 border border-slate-800/90 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Private</h4>
              <p className="text-[11px] text-slate-400">Files never leave your device</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080e22]/90 border border-slate-800/90 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Unlimited</h4>
              <p className="text-[11px] text-slate-400">Convert as many files as you want</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080e22]/90 border border-slate-800/90 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">50+ Formats</h4>
              <p className="text-[11px] text-slate-400">Support for 50+ file formats</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080e22]/90 border border-slate-800/90 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Always Free</h4>
              <p className="text-[11px] text-slate-400">Powerful tools completely free</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
