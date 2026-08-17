"use client";

import { Sparkles, Shield, Zap, Lock, Laptop, Infinity as InfinityIcon, Layers, Gift, FileText, Image as ImageIcon, Film, Music, FolderArchive, Code2, Presentation } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 md:py-12 bg-slate-50/50 dark:bg-[#040814] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Dynamic Ambient Glow Behind Hero - Blue on Left, Magenta/Purple on Right */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 dark:from-blue-600/20 dark:via-indigo-600/10 to-transparent blur-[90px] pointer-events-none -z-10" />

      {/* Abstract Floating File Icons Background (Subtle Low-Opacity Decorative Elements) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        
        {/* Left Side Floating Icons */}
        <div 
          className="absolute top-[8%] left-[3%] sm:left-[6%] p-3 sm:p-4 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-rose-500/20 dark:border-rose-500/15 backdrop-blur-xs opacity-[0.15] dark:opacity-[0.14] animate-float-drift-1 shadow-lg shadow-rose-500/5 hidden sm:flex flex-col items-center gap-1"
          style={{ "--rot": "-12deg" } as any}
        >
          <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
          <span className="text-[9px] font-extrabold tracking-widest text-rose-400">PDF</span>
        </div>

        <div 
          className="absolute top-[42%] left-[2%] sm:left-[4%] p-3 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-emerald-500/20 dark:border-emerald-500/15 backdrop-blur-xs opacity-[0.12] dark:opacity-[0.12] animate-float-drift-2 shadow-lg shadow-emerald-500/5 hidden md:flex flex-col items-center gap-1"
          style={{ "--rot": "8deg" } as any}
        >
          <ImageIcon className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-400" />
          <span className="text-[9px] font-extrabold tracking-widest text-emerald-400">PNG</span>
        </div>

        <div 
          className="absolute top-[72%] left-[4%] sm:left-[7%] p-3 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-purple-500/20 dark:border-purple-500/15 backdrop-blur-xs opacity-[0.14] dark:opacity-[0.13] animate-float-drift-1 shadow-lg shadow-purple-500/5 hidden sm:flex flex-col items-center gap-1"
          style={{ "--rot": "-6deg" } as any}
        >
          <Music className="w-7 h-7 sm:w-9 sm:h-9 text-purple-400" />
          <span className="text-[9px] font-extrabold tracking-widest text-purple-400">MP3</span>
        </div>

        {/* Right Side Floating Icons */}
        <div 
          className="absolute top-[10%] right-[3%] sm:right-[6%] p-3 sm:p-4 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-blue-500/20 dark:border-blue-500/15 backdrop-blur-xs opacity-[0.15] dark:opacity-[0.14] animate-float-drift-2 shadow-lg shadow-blue-500/5 hidden sm:flex flex-col items-center gap-1"
          style={{ "--rot": "14deg" } as any}
        >
          <Film className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
          <span className="text-[9px] font-extrabold tracking-widest text-blue-400">MP4</span>
        </div>

        <div 
          className="absolute top-[44%] right-[2%] sm:right-[4%] p-3 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-indigo-500/20 dark:border-indigo-500/15 backdrop-blur-xs opacity-[0.12] dark:opacity-[0.12] animate-float-drift-1 shadow-lg shadow-indigo-500/5 hidden md:flex flex-col items-center gap-1"
          style={{ "--rot": "-10deg" } as any}
        >
          <FileText className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-400" />
          <span className="text-[9px] font-extrabold tracking-widest text-indigo-400">DOCX</span>
        </div>

        <div 
          className="absolute top-[74%] right-[4%] sm:right-[7%] p-3 rounded-2xl bg-white/5 dark:bg-white/[0.03] border border-amber-500/20 dark:border-amber-500/15 backdrop-blur-xs opacity-[0.14] dark:opacity-[0.13] animate-float-drift-2 shadow-lg shadow-amber-500/5 hidden sm:flex flex-col items-center gap-1"
          style={{ "--rot": "8deg" } as any}
        >
          <FolderArchive className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400" />
          <span className="text-[9px] font-extrabold tracking-widest text-amber-400">ZIP</span>
        </div>

        {/* Top-Mid Ambient Subtle Floaters */}
        <div 
          className="absolute top-[2%] left-[22%] p-2 rounded-xl bg-white/5 border border-cyan-500/15 opacity-[0.08] dark:opacity-[0.07] animate-float-drift-2 hidden lg:flex items-center gap-1"
          style={{ "--rot": "-4deg" } as any}
        >
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span className="text-[8px] font-bold text-cyan-400">SVG</span>
        </div>

        <div 
          className="absolute top-[3%] right-[22%] p-2 rounded-xl bg-white/5 border border-orange-500/15 opacity-[0.08] dark:opacity-[0.07] animate-float-drift-1 hidden lg:flex items-center gap-1"
          style={{ "--rot": "6deg" } as any}
        >
          <Presentation className="w-5 h-5 text-orange-400" />
          <span className="text-[8px] font-bold text-orange-400">PPTX</span>
        </div>

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

        {/* 4 Mini Feature Pills Row Above Drop Box (Matching Image 3) */}
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

        {/* 4 Bottom Trust Cards Grid (Matching Image 3) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">100% Private</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Files never leave your device</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Unlimited Usage</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">No limits on files or sizes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">150+ Tools</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">All file formats supported</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#080e22]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Free Forever</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">No subscriptions or ads</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
