"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Infinity as InfinityIcon, Gift } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";
import { HeroSearch } from "./hero-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8 bg-slate-50/60 dark:bg-[#030714] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Clean Ambient Radial Glows & Background Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 dark:from-blue-600/20 dark:via-indigo-600/10 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
        {/* Top Feature Pill Badge with Glowing Shimmer Dot */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-200/90 dark:border-blue-500/30 bg-white/90 dark:bg-[#0c1630]/90 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-semibold backdrop-blur-md shadow-xs mb-2 sm:mb-2.5 animate-fade-in group hover:border-blue-400 transition-all">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-bold tracking-tight">150+ Free In-Browser Conversion Tools</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-jakarta text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-2.5 leading-[1.18] max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="relative inline-block mt-0.5 sm:mt-1">
            <span className="font-script text-3xl sm:text-5xl md:text-6xl font-bold tracking-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] drop-shadow-xs pr-2">
              100% Private &amp; Secure.
            </span>
            {/* Glowing Accent Swoosh Underline */}
            <svg 
              className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-4 text-blue-400 opacity-90 overflow-visible pointer-events-none" 
              viewBox="0 0 320 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M4 14 Q 160 26, 316 8" 
                stroke="url(#heroSwooshGradient)" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="heroSwooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3.5 sm:mb-4 leading-relaxed">
          Convert, merge, and compress PDF, image, video, audio, and font files securely in your browser.
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
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Client-Side Privacy</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Processed locally</p>
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
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Free Forever</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">No account required</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
