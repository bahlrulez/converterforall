"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Type, Settings, Shield, Image as ImageIcon, Eraser, FileText, Camera, Scan, FileJson, FileArchive, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOLS } from "@/config/tools";

const SARKARI_CARDS = [
  { id: 'exam-photo-resizer', tag: "SSC • UPSC • IBPS", icon: Scan, colorClass: "bg-blue-600" },
  { id: 'photo-name-date-stamper', tag: "Police • Defense • SSC", icon: Camera, colorClass: "bg-indigo-600" },
  { id: 'exam-signature-resizer', tag: "SSC • IBPS • State", icon: Eraser, colorClass: "bg-violet-600" },
  { id: 'compress-pdf-100kb', tag: "UPSC • PSC • NTA", icon: FileArchive, colorClass: "bg-sky-600" }
];

const TYPOGRAPHY_CARDS = [
  { id: 'font-text-fixer', tag: "AI Detection", icon: Wand2, colorClass: "bg-violet-600" },
  { id: 'krutidev-to-unicode', tag: "Hindi", icon: Type, colorClass: "bg-indigo-600" },
  { id: 'chanakya-to-unicode', tag: "Publishing", icon: FileText, colorClass: "bg-purple-600" },
  { id: 'asees-to-unicode', tag: "Punjabi", icon: Type, colorClass: "bg-fuchsia-600" }
];

// Reusable component for Hub Cards
function HubCard({ href, title, description, tag, icon: Icon, colorClass }: { href: string; title: string; description: string; tag: string; icon: React.ElementType; colorClass: string }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-[#0a1128]/90 hover:bg-slate-50 dark:hover:bg-[#0f1a3d] border border-slate-200/80 dark:border-slate-800/90 hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors">
          {tag}
        </span>
      </div>

      <div className="relative z-10 mb-4 flex-1">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-sm relative z-10">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
          <span>Open Tool</span>
        </div>
        <span className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export function SpecializedHubs() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-slate-50/50 dark:bg-[#030714] transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl space-y-20">
        
        {/* Featured Hub 1: Sarkari Exam & Application Utilities */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="text-sm">🎯</span> Top Requested
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sarkari Exam &amp; Application Utilities
              </h2>
            </div>
            <Link href="/category/exam" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
              View all exam tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SARKARI_CARDS.map(card => {
              const tool = TOOLS[card.id];
              if (!tool) return null;
              return (
                <HubCard 
                  key={card.id}
                  href={tool.path}
                  title={tool.name}
                  description={tool.description}
                  tag={card.tag}
                  icon={card.icon}
                  colorClass={card.colorClass}
                />
              );
            })}
          </div>
        </div>

        {/* Featured Hub 2: Indian Typography & Publishing Suite */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="text-sm">✒️</span> Regional Tools
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Indian Typography &amp; Publishing Suite
              </h2>
            </div>
            <Link href="/category/fonts" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
              View all font tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TYPOGRAPHY_CARDS.map(card => {
              const tool = TOOLS[card.id];
              if (!tool) return null;
              return (
                <HubCard 
                  key={card.id}
                  href={tool.path}
                  title={tool.name}
                  description={tool.description}
                  tag={card.tag}
                  icon={card.icon}
                  colorClass={card.colorClass}
                />
              );
            })}
          </div>
        </div>

        {/* Featured Hub 3: Privacy-First Core Utilities */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="text-sm">🔒</span> Local Processing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Privacy-First Core Utilities
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <HubCard 
              href="/image-to-text"
              title="Client-Side OCR"
              description="Extract text from images entirely within your browser."
              tag="AI Vision"
              icon={ImageIcon}
              colorClass="bg-emerald-500"
            />
            <HubCard 
              href="/remove-background"
              title="Background Remover"
              description="Cut out subjects from photos instantly with local AI."
              tag="Image Edit"
              icon={Eraser}
              colorClass="bg-teal-500"
            />
            <HubCard 
              href="/edit-pdf"
              title="True PDF Redaction"
              description="Black out sensitive information locally before sharing."
              tag="Document Security"
              icon={Shield}
              colorClass="bg-purple-500"
            />
            <HubCard 
              href="/csv-to-json"
              title="CSV to JSON"
              description="Convert spreadsheets to developer formats privately."
              tag="Data formatting"
              icon={FileJson}
              colorClass="bg-sky-500"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-12 text-center">
          <Link 
            href="/tools" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 border border-transparent"
          >
            <span>Looking for Unit Converters or Media Tools?</span>
            <span className="font-normal opacity-90 hidden sm:inline">Browse our Complete Directory of 150+ Tools</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 block sm:hidden">
            Browse our Complete Directory of 150+ Tools
          </p>
        </div>

      </div>
    </section>
  );
}
