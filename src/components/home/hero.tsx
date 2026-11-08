"use client";

import React, { useState, useRef } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Infinity as InfinityIcon, 
  Smartphone,
  ArrowRight,
  Layers
} from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";
import Link from "next/link";

export function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-36 bg-[#060b1d] text-white">
      {/* Cinematic Sunset Mountain Background Image with Fallback Gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-90 dark:opacity-80 transition-opacity"
        style={{ backgroundImage: "url('/images/hero-sunset-mountains.jpg')" }}
      />

      {/* Atmospheric Vignette & Color Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b1d]/85 via-[#060b1d]/40 to-[#060b1d]/90 pointer-events-none" />
      
      {/* Warm Sunset Radial Glow in the Horizon */}
      <div 
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-t from-amber-500/25 via-orange-500/15 to-transparent blur-[110px] pointer-events-none" 
      />

      {/* Subtle Starry Dust Glow at the Top */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & CTAs (7 Cols) */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-2 lg:pt-6">
            
            {/* Privacy Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold backdrop-blur-md mb-5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="tracking-tight">100% In-Browser • No Uploads • Complete Privacy</span>
            </div>

            {/* Headline (Preserving exact text) */}
            <h1 className="font-jakarta text-3xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight text-white mb-4 lg:mb-6">
              Fast, Private,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300">
                In-Browser Utilities.
              </span>
            </h1>

            {/* Subtitle (Preserving exact text) */}
            <p className="max-w-xl text-sm sm:text-base lg:text-lg text-slate-300 mb-6 lg:mb-8 leading-relaxed px-2 sm:px-0 font-normal">
              Zero uploads to external servers. High-performance regional font converters, Sarkari exam photo tools, and privacy-first file utilities.
            </p>

            {/* CTA Buttons (Pill styling matching screenshot) */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3.5 text-sm w-full px-4 sm:px-0">
              <Link 
                href="/exam-photo-resizer" 
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] hover:brightness-110 text-white font-bold transition-all shadow-[0_0_25px_rgba(139,92,246,0.55)] hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <span>🎯</span> Sarkari Exam Suite <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              
              <Link 
                href="/font-text-fixer" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 backdrop-blur-md font-semibold transition-all shadow-sm hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <span>🇮🇳</span> Regional Font Auto-Fixer
              </Link>
            </div>
          </div>

          {/* Right Column: Frosted Glassmorphism Card (5 Cols) */}
          <div className="lg:col-span-5 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto relative">
            {/* Ambient Cyan/Purple Breathing Glow */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 blur-[100px] pointer-events-none -z-10" 
            />

            {/* Glassmorphic Dropzone Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative rounded-3xl p-5 sm:p-7 bg-white/10 dark:bg-black/35 backdrop-blur-2xl border border-white/25 dark:border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_35px_rgba(99,102,241,0.25)] transition-all duration-300"
              style={{
                boxShadow: isHovered
                  ? "0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.35)"
                  : undefined,
              }}
            >
              {/* Inner Surface Spotlight on Hover */}
              {isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
                  style={{
                    background: `radial-gradient(550px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.08), transparent 60%)`,
                  }}
                />
              )}

              <div className="relative z-10 w-full flex flex-col items-center">
                <ModernDropzone />

                {/* Supported Formats Pills */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-5">
                  {['PDF', 'DOCX', 'JPG', 'PNG', 'MP4', 'MP3', '...'].map((ext) => (
                    <span 
                      key={ext} 
                      className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white/90 backdrop-blur-sm shadow-xs"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Features Bar (Horizontal on Dark Landscape) */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-blue-400 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Your Files Stay Private</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">Processed directly in your browser</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-400 shadow-xs">
              <Zap className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Instant &amp; Fast</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">No waiting, zero server queues</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-purple-400 shadow-xs">
              <InfinityIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Unlimited Conversions</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">Convert as much as you need</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-emerald-400 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Works Everywhere</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">Desktop, tablet &amp; mobile ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sweeping Organic Wave Transition into the Section Below */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg 
          viewBox="0 0 1440 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative block w-full h-10 sm:h-16 lg:h-24 text-white dark:text-[#030714] transition-colors"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,32 C320,80 600,15 960,45 C1200,65 1360,35 1440,30 L1440,100 L0,100 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>
    </section>
  );
}
