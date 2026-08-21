"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Infinity as InfinityIcon, Gift, FileText, Image as ImageIcon, Video, Music, FileCode, Type, ArrowRight } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";
import { HeroSearch } from "./hero-search";

// Modern Floating Glass Token Component
function FloatingFormatToken({
  label,
  ext,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  className,
  style,
}: {
  label: string;
  ext: string;
  icon: any;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      <div className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl bg-white/80 dark:bg-[#0a1228]/75 backdrop-blur-md border ${borderClass} shadow-md dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-110 select-none group`}>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
            {label}
          </span>
          <span className={`text-[10px] font-bold ${colorClass} tracking-wider leading-tight mt-0.5`}>
            {ext}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8 bg-slate-50/60 dark:bg-[#030714] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Dynamic Ambient Mesh Glows */}
      <div className="absolute top-1/4 left-1/10 w-[550px] h-[550px] bg-blue-500/15 dark:bg-blue-600/20 blur-[130px] pointer-events-none -z-10 rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 right-1/10 w-[550px] h-[550px] bg-purple-500/15 dark:bg-purple-600/20 blur-[130px] pointer-events-none -z-10 rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-blue-500/20 via-indigo-500/15 dark:from-blue-600/25 dark:via-indigo-600/15 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Modern Floating Format Tokens (Left and Right Flanks) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* LEFT SIDE TOKENS */}
        <FloatingFormatToken
          label="PDF"
          ext=".pdf"
          icon={FileText}
          colorClass="text-rose-600 dark:text-rose-400"
          bgClass="bg-rose-500/15 dark:bg-rose-500/20"
          borderClass="border-rose-200/80 dark:border-rose-500/30"
          className="absolute top-[4%] left-[2%] sm:left-[4%] animate-float-drift-1"
          style={{ "--rot": "-8deg" } as any}
        />

        <FloatingFormatToken
          label="MP4"
          ext=".mp4"
          icon={Video}
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-500/15 dark:bg-blue-500/20"
          borderClass="border-blue-200/80 dark:border-blue-500/30"
          className="absolute top-[32%] left-[1%] sm:left-[3%] animate-float-drift-2"
          style={{ "--rot": "6deg" } as any}
        />

        <FloatingFormatToken
          label="PNG"
          ext=".png"
          icon={ImageIcon}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-500/15 dark:bg-emerald-500/20"
          borderClass="border-emerald-200/80 dark:border-emerald-500/30"
          className="absolute top-[60%] left-[2%] sm:left-[4%] animate-float-drift-1"
          style={{ "--rot": "-6deg" } as any}
        />

        {/* RIGHT SIDE TOKENS */}
        <FloatingFormatToken
          label="JPG"
          ext=".jpg"
          icon={ImageIcon}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="bg-amber-500/15 dark:bg-amber-500/20"
          borderClass="border-amber-200/80 dark:border-amber-500/30"
          className="absolute top-[5%] right-[2%] sm:right-[4%] animate-float-drift-2"
          style={{ "--rot": "8deg" } as any}
        />

        <FloatingFormatToken
          label="DOCX"
          ext=".docx"
          icon={FileText}
          colorClass="text-sky-600 dark:text-sky-400"
          bgClass="bg-sky-500/15 dark:bg-sky-500/20"
          borderClass="border-sky-200/80 dark:border-sky-500/30"
          className="absolute top-[34%] right-[1%] sm:right-[3%] animate-float-drift-1"
          style={{ "--rot": "-6deg" } as any}
        />

        <FloatingFormatToken
          label="MP3"
          ext=".mp3"
          icon={Music}
          colorClass="text-purple-600 dark:text-purple-400"
          bgClass="bg-purple-500/15 dark:bg-purple-500/20"
          borderClass="border-purple-200/80 dark:border-purple-500/30"
          className="absolute top-[62%] right-[2%] sm:right-[4%] animate-float-drift-2"
          style={{ "--rot": "7deg" } as any}
        />
      </div>

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
