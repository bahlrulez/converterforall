"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  Sparkles, 
  Type, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  ArrowRight 
} from "lucide-react";

// The 11 Core Tier A Tools directly linked as normal HTML links
export const TIER_A_TOOLS = [
  { slug: "krutidev-to-unicode", title: "Kruti Dev to Unicode", category: "Fonts", icon: Type },
  { slug: "unicode-to-krutidev", title: "Unicode to Kruti Dev", category: "Fonts", icon: Type },
  { slug: "chanakya-to-unicode", title: "Chanakya to Unicode", category: "Fonts", icon: Type },
  { slug: "asees-to-unicode", title: "Asees to Unicode", category: "Fonts", icon: Type },
  { slug: "font-text-fixer", title: "Font & Text Fixer", category: "Fonts", icon: Type },
  { slug: "exam-photo-resizer", title: "Exam Photo Resizer", category: "Exam", icon: Award },
  { slug: "exam-signature-resizer", title: "Exam Signature Resizer", category: "Exam", icon: Award },
  { slug: "photo-name-date-stamper", title: "Photo Name & Date", category: "Exam", icon: Award },
  { slug: "compress-pdf-100kb", title: "Compress PDF to 100KB", category: "PDF", icon: FileText },
  { slug: "image-dpi-converter", title: "Image DPI Converter", category: "Image", icon: ImageIcon },
  { slug: "video-caption-generator", title: "AI Caption Studio", category: "Video", icon: Video },
];

export function CompactToolNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group/compact relative flex h-full items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link 
        href="/tools" 
        className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
        aria-expanded={isOpen}
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        <span>Featured Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </Link>

      {/* Lightweight dropdown containing normal HTML links to every Tier A page */}
      <div 
        className={`absolute left-0 top-full pt-2 w-80 transition-all duration-200 origin-top z-50 ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c1630]/95 backdrop-blur-xl p-3 shadow-xl">
          <div className="px-3 py-1.5 mb-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Utilities
            </span>
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              In-Browser
            </span>
          </div>

          <div className="grid grid-cols-1 gap-0.5 max-h-[380px] overflow-y-auto pr-1">
            {TIER_A_TOOLS.map((t) => {
              const IconComponent = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/item"
                >
                  <span className="flex items-center gap-2 truncate">
                    <IconComponent className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-500 shrink-0" />
                    <span className="font-medium truncate">{t.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                    {t.category}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
            >
              <span>Explore All 150+ Converters</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
