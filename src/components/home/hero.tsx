"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Laptop, Infinity as InfinityIcon, Layers, Gift } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

// Folded-Corner Document Outline Component with Crisp High-Contrast Styling
function FileDocOutline({ 
  label, 
  className, 
  style 
}: { 
  label: string; 
  className?: string; 
  style?: React.CSSProperties 
}) {
  return (
    <div className={className} style={style}>
      <svg 
        viewBox="0 0 100 130" 
        className="w-20 h-28 sm:w-28 sm:h-36 md:w-32 md:h-42 drop-shadow-md transition-transform duration-500 hover:scale-105" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Folded Corner Document Path with Translucent Fill */}
        <path 
          d="M12 6 H64 L88 30 V122 H12 Z" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinejoin="round" 
          className="fill-white/5 dark:fill-[#0c1630]/40 backdrop-blur-xs"
        />
        {/* Corner Fold Flap */}
        <path 
          d="M64 6 V30 H88" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinejoin="round" 
          className="fill-black/10 dark:fill-white/10"
        />
        {/* File Extension Text */}
        <text 
          x="50" 
          y="84" 
          textAnchor="middle" 
          fill="currentColor" 
          fontSize="22" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          letterSpacing="0.06em"
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
      <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2.8" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="48" height="48" rx="10" className="fill-white/5 dark:fill-[#0c1630]/30" />
        <circle cx="20" cy="20" r="5" />
        <path d="M12 46 L26 30 L38 42 L48 32" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Outline Music Note Component
function OutlineMusic({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 50 50" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2.8" xmlns="http://www.w3.org/2000/svg">
        <path d="M34 10 V36 A 5.5 5.5 0 1 1 28.5 30.5 H34 V18 L16 22 V40 A 5.5 5.5 0 1 1 10.5 34.5 H16 V14 Z" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Outline Video Play Component
function OutlinePlay({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 60 48" className="w-11 h-9 sm:w-14 sm:h-11 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2.8" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="50" height="40" rx="10" className="fill-white/5 dark:fill-[#0c1630]/30" />
        <polygon points="24,16 38,24 24,32" strokeLinejoin="round" fill="currentColor" opacity="0.3" />
      </svg>
    </div>
  );
}

import { HeroSearch } from "./hero-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 bg-slate-50/50 dark:bg-[#040814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Ambient Gradient Glow Behind Hero */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/15 dark:bg-blue-600/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/15 dark:bg-purple-600/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/20 via-indigo-500/15 dark:from-blue-600/25 dark:via-indigo-600/15 to-transparent blur-[90px] pointer-events-none -z-10" />

      {/* Abstract Outline File Background Icons (Balanced Subtle Opacity) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        
        {/* LEFT SIDE BACKGROUND ELEMENTS */}
        {/* PDF Document (Top Left) */}
        <FileDocOutline 
          label="PDF" 
          className="absolute top-[3%] left-[1%] sm:left-[3%] text-rose-500/28 dark:text-rose-400/25 animate-float-drift-1" 
          style={{ "--rot": "-14deg" } as any}
        />
        {/* Photo Outline (Top Mid-Left) */}
        <OutlinePhoto 
          className="absolute top-[10%] left-[17%] sm:left-[19%] text-sky-500/22 dark:text-sky-400/20 animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "8deg" } as any}
        />
        {/* Music Outline (Mid-High Left) */}
        <OutlineMusic 
          className="absolute top-[26%] left-[18%] sm:left-[21%] text-purple-500/22 dark:text-purple-400/20 animate-float-drift-1 hidden md:block" 
          style={{ "--rot": "-10deg" } as any}
        />
        {/* MP4 Document (Middle Left) */}
        <FileDocOutline 
          label="MP4" 
          className="absolute top-[30%] left-[1%] sm:left-[4%] text-blue-500/28 dark:text-blue-400/25 animate-float-drift-2" 
          style={{ "--rot": "-16deg" } as any}
        />
        {/* Play Video Outline (Mid-Low Left) */}
        <OutlinePlay 
          className="absolute top-[48%] left-[17%] sm:left-[20%] text-blue-500/22 dark:text-blue-400/20 animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "12deg" } as any}
        />
        {/* PNG Document (Low Left) */}
        <FileDocOutline 
          label="PNG" 
          className="absolute top-[56%] left-[1%] sm:left-[3%] text-emerald-500/28 dark:text-emerald-400/25 animate-float-drift-1" 
          style={{ "--rot": "10deg" } as any}
        />
        {/* ZIP Document (Bottom Left) */}
        <FileDocOutline 
          label="ZIP" 
          className="absolute top-[76%] left-[10%] sm:left-[14%] text-amber-500/28 dark:text-amber-400/25 animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "14deg" } as any}
        />

        {/* RIGHT SIDE BACKGROUND ELEMENTS */}
        {/* Photo Outline (Top Right) */}
        <OutlinePhoto 
          className="absolute top-[5%] right-[16%] sm:right-[19%] text-indigo-500/22 dark:text-indigo-400/20 animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "-6deg" } as any}
        />
        {/* JPG Document (Top Right) */}
        <FileDocOutline 
          label="JPG" 
          className="absolute top-[12%] right-[1%] sm:right-[4%] text-cyan-500/28 dark:text-cyan-400/25 animate-float-drift-2" 
          style={{ "--rot": "12deg" } as any}
        />
        {/* Video Play Outline (Mid-High Right) */}
        <OutlinePlay 
          className="absolute top-[23%] right-[15%] sm:right-[18%] text-blue-500/22 dark:text-blue-400/20 animate-float-drift-1 hidden md:block" 
          style={{ "--rot": "-12deg" } as any}
        />
        {/* DOCX Document (Middle Right) */}
        <FileDocOutline 
          label="DOCX" 
          className="absolute top-[36%] right-[1%] sm:right-[4%] text-indigo-500/28 dark:text-indigo-400/25 animate-float-drift-2" 
          style={{ "--rot": "-14deg" } as any}
        />
        {/* Music Outline (Mid-Low Right) */}
        <OutlineMusic 
          className="absolute top-[49%] right-[17%] sm:right-[20%] text-purple-500/22 dark:text-purple-400/20 animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "-8deg" } as any}
        />
        {/* Photo Outline (Low Right) */}
        <OutlinePhoto 
          className="absolute top-[62%] right-[5%] sm:right-[8%] text-emerald-500/22 dark:text-emerald-400/20 animate-float-drift-2 hidden sm:block" 
          style={{ "--rot": "10deg" } as any}
        />
        {/* TXT Document (Bottom Right) */}
        <FileDocOutline 
          label="TXT" 
          className="absolute top-[73%] right-[10%] sm:right-[14%] text-purple-500/28 dark:text-purple-400/25 animate-float-drift-1 hidden sm:block" 
          style={{ "--rot": "8deg" } as any}
        />

      </div>

      <div className="container relative z-10 mx-auto px-4 text-center max-w-5xl">
        {/* Top Feature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50/90 dark:bg-[#0c1630]/90 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm mb-3 sm:mb-4 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />
          <span>The next generation file converter</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-jakarta text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4 leading-[1.18] max-w-4xl mx-auto">
          Free Online File Converter. <br className="hidden sm:inline" />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="font-script text-4xl sm:text-6xl md:text-7xl font-bold tracking-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] drop-shadow-sm pr-2">
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
        <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
          Convert, merge, and compress PDF, image, video, audio, and font files securely in your browser.
        </p>

        {/* Landing Page Tool Search Box */}
        <HeroSearch />

        {/* 4 Mini Feature Pills Row Above Drop Box */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-6 text-left">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">In-Browser Privacy</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Files stay on device</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Lightning Fast</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Instant processing</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">No Sign-Up</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">100% free forever</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Works Anywhere</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">All OS &amp; devices</div>
            </div>
          </div>
        </div>

        {/* Drop Box Hero Container */}
        <div className="mb-6 sm:mb-8 max-w-4xl mx-auto">
          <ModernDropzone />
        </div>

        {/* 4 Bottom Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Client-Side Privacy</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Processed locally</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">No Daily Limits</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Convert as needed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 dark:hover:border-purple-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-200/80 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Watermarks</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Original quality retained</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Free Forever</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">No credit card or login</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
