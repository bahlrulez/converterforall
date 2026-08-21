"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, FileText, Image as ImageIcon, Video, Music, Code2, Wrench, Type, Sparkles } from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

const POPULAR_SHORTCUTS = [
  { label: "PDF to Word", slug: "pdf-to-word" },
  { label: "Compress Video", slug: "video-compressor" },
  { label: "Remove Background", slug: "remove-background" },
  { label: "Merge PDF", slug: "merge-pdf" },
  { label: "HEIC to JPG", slug: "heic-to-jpg" },
  { label: "Compress PDF", slug: "compress-pdf" },
  { label: "Kruti Dev to Unicode", slug: "krutidev-to-unicode" },
];

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  image: { label: "Image", icon: ImageIcon, color: "text-emerald-500" },
  document: { label: "Document", icon: FileText, color: "text-blue-500" },
  developer: { label: "Data & Code", icon: Code2, color: "text-cyan-500" },
  audio: { label: "Audio", icon: Music, color: "text-purple-500" },
  video: { label: "Video", icon: Video, color: "text-rose-500" },
  utilities: { label: "Utilities", icon: Wrench, color: "text-amber-500" },
  fonts: { label: "Fonts", icon: Type, color: "text-indigo-500" },
};

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten tools for instant search
  const allTools = useMemo(() => {
    const list: Array<{ slug: string; title: string; category: string; description?: string }> = [];
    Object.entries(toolsDatabase).forEach(([catKey, tools]) => {
      Object.entries(tools as any).forEach(([slug, tool]: any) => {
        list.push({
          slug,
          title: tool.title || slug,
          category: catKey,
          description: tool.description,
        });
      });
    });
    return list;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allTools
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
      .slice(0, 9);
  }, [allTools, query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-8 sm:mb-10 text-left z-30">
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-blue-600 dark:text-blue-400 pointer-events-none transition-colors" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsFocused(true);
            }}
            placeholder="Search 150+ tools (e.g. PDF to Word, Video Compressor, Remove BG)..."
            className="w-full h-12 sm:h-14 pl-12 pr-20 rounded-2xl bg-white dark:bg-[#0b132b] border-2 border-slate-200 dark:border-blue-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm sm:text-base font-medium shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-all"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md pointer-events-none">
              <span>Quick Search</span>
            </div>
          )}
        </div>
      </div>

      {/* Instant Dropdown Results when Typing or Focused with Input */}
      {isFocused && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#070e24] border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Matching Tools ({filteredResults.length})</span>
            <span className="text-[10px] text-slate-400">Press tool to open</span>
          </div>

          <div className="max-h-[340px] overflow-y-auto p-2 space-y-1.5">
            {filteredResults.length > 0 ? (
              filteredResults.map((tool) => {
                const meta = CATEGORY_META[tool.category] || {
                  label: tool.category,
                  icon: FileText,
                  color: "text-blue-600 dark:text-blue-400",
                };
                const Icon = meta.icon;

                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={() => {
                      setIsFocused(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/90 dark:hover:bg-blue-900/25 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {tool.title}
                        </span>
                        {tool.description && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {meta.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm font-medium">No tools found matching &quot;{query}&quot;</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for pdf, video, image, word, compress, or font</p>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/#featured-tools"
              onClick={() => {
                setIsFocused(false);
                setQuery("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              <span>Explore All 150+ Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Clickable Popular Filter Chips Under Search Bar */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Popular:
        </span>
        {POPULAR_SHORTCUTS.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0c142c] hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all shadow-xs hover:border-blue-300"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
