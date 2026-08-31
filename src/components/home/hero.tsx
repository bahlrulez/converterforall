"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Shield, Zap, Lock, Infinity as InfinityIcon, UserX } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

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
    <section className="relative overflow-hidden pt-4 pb-12 sm:py-12 md:py-16 bg-[#030714] text-white">
      {/* Soft Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-start">
          
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start lg:pt-16">
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-[#080e22]/80 text-blue-400 text-[11px] sm:text-xs font-semibold backdrop-blur-md mb-4 lg:mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-bold tracking-tight">150+ FREE BROWSER-BASED TOOLS</span>
            </div>

            <h1 className="font-jakarta text-[2.1rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-white mb-3 lg:mb-6 mt-2 sm:mt-0">
              Convert Anything.<br />
              Keep It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Simple.</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-lg text-slate-400 mb-5 lg:mb-8 leading-relaxed px-2 sm:px-0">
              Free online converters for PDF, images, video, audio, documents and fonts — private, secure and easy to use.
            </p>

            <div className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-6 text-sm mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-200">Private Processing</span>
                  <span className="text-[10px] text-slate-500">Your files stay on your device</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <InfinityIcon className="w-4 h-4 text-purple-400" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-200">No Limits</span>
                  <span className="text-[10px] text-slate-500">Convert as much as you need</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-200">No Sign Up</span>
                  <span className="text-[10px] text-slate-500">100% free to use</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Spotlight Dropzone Card */}
          <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto relative">
            {/* Pure Circular Ambient Breathing Glow (Zero Square Edge Artifacts) */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-purple-600/20 blur-[90px] pointer-events-none -z-10 animate-ambient-breathe" 
            />

            {/* Main Interactive Spotlight Wrapper */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative rounded-3xl p-[1.5px] transition-all duration-300 ease-out group"
              style={{
                background: isHovered
                  ? `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(96, 165, 250, 0.7), rgba(99, 102, 241, 0.35) 40%, rgba(51, 65, 85, 0.4) 80%)`
                  : "rgba(51, 65, 85, 0.45)",
                transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
                boxShadow: isHovered
                  ? "0 20px 50px -10px rgba(37, 99, 235, 0.35), 0 0 30px rgba(99, 102, 241, 0.2)"
                  : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Inner Card Container with Subtle Moving Spotlight */}
              <div 
                className="relative rounded-[22.5px] bg-[#070d20]/95 backdrop-blur-2xl p-5 sm:p-8 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Dynamic Inner Surface Spotlight */}
                {isHovered && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.09), transparent 60%)`,
                    }}
                  />
                )}

                <div className="relative z-10 w-full flex flex-col items-center">
                  <ModernDropzone />
                  
                  <p className="text-xs text-slate-400 mt-6 mb-4 font-medium">Your file stays on your device whenever possible.</p>
                  
                  {/* Supported Formats */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {['PDF', 'DOCX', 'JPG', 'PNG', 'MP4', 'MP3', '...'].map(ext => (
                      <span key={ext} className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/80 text-[10px] font-semibold text-slate-300 shadow-sm transition-all group-hover:border-slate-600">
                        {ext}
                      </span>
                    ))}
                  </div>

                  {/* Features inline */}
                  <div className="w-full flex items-center justify-between border-t border-slate-800/90 pt-5 text-[11px] font-medium text-blue-400">
                    <span className="flex items-center gap-1.5 font-semibold"><Shield className="w-3.5 h-3.5 text-blue-400" /> Secure &amp; Private</span>
                    <span className="w-px h-3 bg-slate-800" />
                    <span className="flex items-center gap-1.5 text-slate-400 font-semibold">No Watermarks</span>
                    <span className="w-px h-3 bg-slate-800" />
                    <span className="flex items-center gap-1.5 text-slate-400 font-semibold">No Registration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
