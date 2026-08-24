"use client";

import React from "react";
import { Sparkles, Shield, Zap, Lock, Infinity as InfinityIcon, Gift, UserX } from "lucide-react";
import { ModernDropzone } from "./modern-dropzone";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 bg-[#030714] text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-[#080e22]/80 text-blue-400 text-[11px] sm:text-xs font-semibold backdrop-blur-md mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-bold tracking-tight">150+ FREE BROWSER-BASED TOOLS</span>
            </div>

            <h1 className="font-jakarta text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Convert Anything.<br />
              Keep It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Simple.</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
              Free online converters for PDF, images, video, audio, documents and fonts — private, secure and easy to use.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
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

          {/* Right Column: Dropzone Container */}
          <div className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
            <div className="relative p-[1px] rounded-3xl bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent shadow-[0_0_40px_rgba(37,99,235,0.15)] group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative rounded-[23px] bg-[#080e22]/95 backdrop-blur-xl border border-slate-800/80 p-8 flex flex-col items-center text-center">
                
                <ModernDropzone />
                
                <p className="text-xs text-slate-400 mt-6 mb-4">Your file stays on your device whenever possible.</p>
                
                {/* Supported Formats */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {['PDF', 'DOCX', 'JPG', 'PNG', 'MP4', 'MP3', '...'].map(ext => (
                    <span key={ext} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] font-semibold text-slate-300">
                      {ext}
                    </span>
                  ))}
                </div>

                {/* Features inline */}
                <div className="w-full flex items-center justify-between border-t border-slate-800/80 pt-5 text-[11px] font-medium text-blue-400">
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Secure & Private</span>
                  <span className="w-px h-3 bg-slate-800" />
                  <span className="flex items-center gap-1.5 text-slate-400">No Watermarks</span>
                  <span className="w-px h-3 bg-slate-800" />
                  <span className="flex items-center gap-1.5 text-slate-400">No Registration</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
