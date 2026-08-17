"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Laptop, Infinity as InfinityIcon, Layers, Gift, TrendingUp, Users, Grid, CheckCircle2 } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

// Folded-Corner Document Outline Component matching user's mockup
function FileDocOutline({ label, className, style }: { label: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg 
        viewBox="0 0 100 130" 
        className="w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 text-slate-400 dark:text-slate-500 hover:text-blue-400 transition-colors duration-300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Folded Corner Document Path */}
        <path 
          d="M12 6 H64 L88 30 V122 H12 Z" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
          fill="none" 
        />
        {/* Corner Fold Flap */}
        <path 
          d="M64 6 V30 H88" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
          fill="none" 
        />
        {/* File Extension Text */}
        <text 
          x="50" 
          y="82" 
          textAnchor="middle" 
          fill="currentColor" 
          fontSize="19" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="0.05em"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

// Outline Image Icon Component
function OutlinePhoto({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.2" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="48" height="48" rx="8" />
        <circle cx="20" cy="20" r="4.5" />
        <path d="M12 46 L26 30 L38 42 L48 32" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Outline Music Note Component
function OutlineMusic({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 50 50" className="w-9 h-9 sm:w-11 sm:h-11 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.2" xmlns="http://www.w3.org/2000/svg">
        <path d="M34 10 V36 A 5.5 5.5 0 1 1 28.5 30.5 H34 V18 L16 22 V40 A 5.5 5.5 0 1 1 10.5 34.5 H16 V14 Z" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Outline Video Play Component
function OutlinePlay({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 60 48" className="w-10 h-8 sm:w-12 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.2" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="50" height="40" rx="8" />
        <polygon points="24,16 38,24 24,32" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 md:py-12 bg-slate-50/50 dark:bg-[#040814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Ambient Gradient Glow Behind Hero */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 dark:from-blue-600/20 dark:via-indigo-600/10 to-transparent blur-[90px] pointer-events-none -z-10" />

      {/* Abstract Outline File Background Icons (Matching User Mockup 1:1) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        
        {/* LEFT SIDE BACKGROUND ELEMENTS */}
        {/* PDF Document (Top Left) */}
        <FileDocOutline 
          label="PDF" 
          className="absolute top-[4%] left-[2%] sm:left-[4%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "-14deg" } as any}
        />
        {/* Photo Outline (Top Mid-Left) */}
        <OutlinePhoto 
          className="absolute top-[12%] left-[18%] opacity-[0.14] dark:opacity-[0.12] animate-float-drift-2 hidden md:block" 
          style={{ "--rot": "8deg" } as any}
        />
        {/* Music Outline (Mid-High Left) */}
        <OutlineMusic 
          className="absolute top-[26%] left-[19%] opacity-[0.15] dark:opacity-[0.13] animate-float-drift-1 hidden lg:block" 
          style={{ "--rot": "-10deg" } as any}
        />
        {/* MP4 Document (Middle Left) */}
        <FileDocOutline 
          label="MP4" 
          className="absolute top-[32%] left-[3%] sm:left-[5%] opacity-[0.17] dark:opacity-[0.15] animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "-16deg" } as any}
        />
        {/* Play Video Outline (Mid-Low Left) */}
        <OutlinePlay 
          className="absolute top-[48%] left-[18%] opacity-[0.14] dark:opacity-[0.12] animate-float-drift-1 hidden md:block" 
          style={{ "--rot": "12deg" } as any}
        />
        {/* PNG Document (Low Left) */}
        <FileDocOutline 
          label="PNG" 
          className="absolute top-[56%] left-[2%] sm:left-[4%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "10deg" } as any}
        />
        {/* ZIP Document (Bottom Left) */}
        <FileDocOutline 
          label="ZIP" 
          className="absolute top-[76%] left-[12%] sm:left-[14%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "14deg" } as any}
        />

        {/* RIGHT SIDE BACKGROUND ELEMENTS */}
        {/* Photo Outline (Top Right) */}
        <OutlinePhoto 
          className="absolute top-[6%] right-[18%] opacity-[0.14] dark:opacity-[0.12] animate-float-drift-1 hidden md:block" 
          style={{ "--rot": "-6deg" } as any}
        />
        {/* JPG Document (Top Right) */}
        <FileDocOutline 
          label="JPG" 
          className="absolute top-[14%] right-[4%] sm:right-[6%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "12deg" } as any}
        />
        {/* Video Play Outline (Mid-High Right) */}
        <OutlinePlay 
          className="absolute top-[24%] right-[16%] opacity-[0.14] dark:opacity-[0.12] animate-float-drift-1 hidden lg:block" 
          style={{ "--rot": "-12deg" } as any}
        />
        {/* DOCX Document (Middle Right) */}
        <FileDocOutline 
          label="DOCX" 
          className="absolute top-[38%] right-[3%] sm:right-[5%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "-14deg" } as any}
        />
        {/* Music Outline (Mid-Low Right) */}
        <OutlineMusic 
          className="absolute top-[50%] right-[18%] opacity-[0.15] dark:opacity-[0.13] animate-float-drift-1 hidden md:block" 
          style={{ "--rot": "-8deg" } as any}
        />
        {/* Photo Outline (Low Right) */}
        <OutlinePhoto 
          className="absolute top-[62%] right-[7%] opacity-[0.14] dark:opacity-[0.12] animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "10deg" } as any}
        />
        {/* TXT / TXP Document (Bottom Right) */}
        <FileDocOutline 
          label="TXT" 
          className="absolute top-[74%] right-[12%] sm:right-[15%] opacity-[0.18] dark:opacity-[0.16] animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "8deg" } as any}
        />

      </div>

      <div className="container relative mx-auto px-4 text-center max-w-6xl">
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50/80 dark:bg-[#0c1630]/80 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm dark:shadow-[0_0_20px_rgba(59,130,246,0.25)] mb-3 sm:mb-4 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />
          <span>The next generation file converter</span>
        </div>

        {/* Hero Title Matching User Design */}
        <h1 className="font-jakarta text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white mb-3 sm:mb-4 leading-[1.15] max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="font-script text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] drop-shadow-sm pr-2">
              100% Private &amp; Secure.
            </span>
            {/* Glowing Accent Swoosh Underline */}
            <svg 
              className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-5 text-blue-400 opacity-90 overflow-visible pointer-events-none" 
              viewBox="0 0 320 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M4 14 Q 160 26, 316 8" 
                stroke="url(#heroSwooshGradient)" 
                strokeWidth="4.5" 
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
        <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Convert, merge, and compress PDF, image, video, and audio files securely in your browser.
        </p>

        {/* 4 Mini Feature Pills Row Above Drop Box */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-6 sm:mb-8 text-left">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">100% Private</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Your files stay local</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Lightning Fast</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Instant conversion</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Secure & Safe</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">256-bit encryption</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Works Anywhere</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">No installation</div>
            </div>
          </div>
        </div>

        {/* Drop Box Hero Container */}
        <div className="mb-8">
          <ModernDropzone />
        </div>

        {/* 4 Bottom Stats Bar Banner (Matching Mockup 1:1) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto text-left p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800/90 shadow-sm dark:shadow-md backdrop-blur-md">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">10M+</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Files Converted</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">500K+</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Happy Users</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">150+</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Tools Available</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">99.9%</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Uptime Guarantee</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
