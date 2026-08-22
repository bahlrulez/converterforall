"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Infinity as InfinityIcon, Gift } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";
import { HeroSearch } from "./hero-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8 bg-slate-50/60 dark:bg-[#030714] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Ambient Lighting Removed for cleaner look */}

      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
        {/* Top Feature Pill Badge with Glowing Shimmer Dot */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-200/90 dark:border-blue-500/30 bg-white/90 dark:bg-[#0c1630]/90 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md shadow-xs mb-2 sm:mb-2.5 animate-fade-in group hover:border-blue-400 transition-all">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-bold tracking-tight">150+ Free In-Browser Conversion Tools</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6 leading-[1.18] max-w-4xl mx-auto">
          Free Online File &amp; Font Converter.
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
          Convert PDF, images, video, audio and Indian legacy fonts privately in your browser.
        </p>

        {/* Landing Page Tool Search Box */}
        <HeroSearch />

        {/* Drop Box Hero Container */}
        <div className="mb-4 sm:mb-6 max-w-4xl mx-auto">
          <ModernDropzone />
        </div>

        {/* 4 Bottom Trust Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/40 hover:-translate-y-0.5 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Files stay on your device</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Conversions run locally in your browser for supported tools</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No Daily Limits</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Convert as needed</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500/40 hover:-translate-y-0.5 transition-all">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-200/80 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Watermarks</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Original quality</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Free to use</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">No account required</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
