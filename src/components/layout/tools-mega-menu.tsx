"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Zap,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Wrench,
  Type,
  ArrowRight,
  Sparkles,
  Eraser,
  Camera,
  FileStack,
  Layers,
  Code2,
} from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

const POPULAR_TOOLS = [
  { slug: "video-compressor", title: "Video Compressor", icon: Video, color: "text-rose-400" },
  { slug: "compress-video-for-discord", title: "Discord Video Compressor", icon: Video, color: "text-indigo-400" },
  { slug: "heic-to-jpg", title: "HEIC to JPG", icon: ImageIcon, color: "text-amber-400" },
  { slug: "heic-to-png", title: "HEIC to PNG", icon: ImageIcon, color: "text-rose-400" },
  { slug: "jwt-decoder", title: "JWT Decoder", icon: Code2, color: "text-cyan-400" },
  { slug: "json-formatter", title: "JSON Formatter", icon: Code2, color: "text-emerald-400" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", icon: FileText, color: "text-emerald-400" },
  { slug: "edit-pdf", title: "Edit PDF Online", icon: FileText, color: "text-blue-400" },
  { slug: "remove-background", title: "Remove Background", icon: Eraser, color: "text-purple-400" },
  { slug: "merge-pdf", title: "Merge PDF, Word & Images", icon: FileStack, color: "text-red-400" },
  { slug: "compress-pdf", title: "Compress PDF Size", icon: Zap, color: "text-amber-400" },
  { slug: "pdf-to-word", title: "PDF to Word (DOCX)", icon: FileText, color: "text-indigo-400" },
];

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  image: { label: "Image", icon: ImageIcon, color: "text-emerald-400" },
  document: { label: "Document", icon: FileText, color: "text-blue-400" },
  developer: { label: "Data & Code", icon: Code2, color: "text-cyan-400" },
  audio: { label: "Audio", icon: Music, color: "text-purple-400" },
  video: { label: "Video", icon: Video, color: "text-red-400" },
  utilities: { label: "Utilities", icon: Wrench, color: "text-amber-400" },
  fonts: { label: "Fonts", icon: Type, color: "text-indigo-400" },
};

interface ToolsMegaMenuProps {
  onClose?: () => void;
}

export function ToolsMegaMenu({ onClose }: ToolsMegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Flattened tools for search
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

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [allTools, searchQuery]);

  return (
    <div className="w-[980px] max-w-[96vw] bg-white dark:bg-[#070d1e] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.22)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.95)] ring-1 ring-slate-900/10 dark:ring-white/10 text-slate-800 dark:text-slate-200 overflow-hidden flex flex-col p-6 sm:p-7 z-50 animate-in fade-in zoom-in-95 duration-200">
      {/* Search Bar Header */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for any tool (e.g., 'PDF to Word', 'JPG to PNG', 'Video Compressor', 'Kruti Dev')..."
          className="w-full h-12 pl-12 pr-20 rounded-2xl bg-slate-100 dark:bg-[#0e1730] border-2 border-slate-200 dark:border-blue-500/30 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:bg-white dark:focus:bg-[#0e1730] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-400 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-1 rounded-full transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Content: Search Mode vs Standard Mega Menu Mode */}
      {searchResults !== null ? (
        /* Search Results Grid with Rich Cards */
        <div className="min-h-[320px] max-h-[500px] overflow-y-auto pr-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            <span>Found {searchResults.length} {searchResults.length === 1 ? "matching tool" : "matching tools"}</span>
            <span className="text-[11px] font-medium text-slate-400">Click to launch</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {searchResults.map((tool) => {
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
                    onClick={onClose}
                    className="flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/90 dark:bg-[#0e1730]/70 dark:hover:bg-blue-600/20 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {tool.title}
                          </span>
                        </div>
                      </div>
                      {tool.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {meta.label}
                      </span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Open <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-56 text-center text-slate-500 dark:text-slate-400">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">No tools found for &quot;{searchQuery}&quot;</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Try keywords like pdf, jpg, word, video, merge, compress, or font</p>
            </div>
          )}
        </div>
      ) : (
        /* Standard Layout: Popular Sidebar + Category Columns */
        <div className="grid grid-cols-12 gap-6 min-h-[360px] max-h-[520px] overflow-y-auto pr-2">
          {/* Left Column: POPULAR Tools */}
          <div className="col-span-12 md:col-span-4 bg-slate-50/90 dark:bg-[#0c142c]/70 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />
              <span>Most Popular</span>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              {POPULAR_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#131f42] border border-transparent hover:border-slate-200 dark:hover:border-blue-500/30 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white shadow-none hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {tool.title}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Area: Categorized Tools Grid */}
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-6 py-1">
            {Object.entries(toolsDatabase).map(([categoryKey, tools]) => {
              const meta = CATEGORY_META[categoryKey] || {
                label: categoryKey,
                icon: FileText,
                color: "text-blue-600 dark:text-blue-400",
              };
              const Icon = meta.icon;
              const toolEntries = Object.entries(tools as any);
              const previewTools = toolEntries.slice(0, 4);
              const remainingCount = toolEntries.length - previewTools.length;

              return (
                <div key={categoryKey} className="flex flex-col">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 pb-1.5 border-b-2 border-slate-200/80 dark:border-slate-800/80">
                    <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                      <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                    </div>
                    <span>{meta.label}</span>
                  </div>

                  {/* Tool List */}
                  <div className="flex flex-col gap-1">
                    {previewTools.map(([slug, tool]: any) => {
                      let cleanTitle = tool.title.replace(/^Convert /i, "");
                      if (cleanTitle.includes(" – ")) cleanTitle = cleanTitle.split(" – ")[0];
                      else if (cleanTitle.includes(" - ")) cleanTitle = cleanTitle.split(" - ")[0];
                      else if (cleanTitle.includes(" — ")) cleanTitle = cleanTitle.split(" — ")[0];
                      cleanTitle = cleanTitle.replace(/^Free Online /i, "");
                      if (cleanTitle.includes(" (") && cleanTitle.length > 22) {
                        cleanTitle = cleanTitle.split(" (")[0];
                      }

                      return (
                        <Link
                          key={slug}
                          href={`/${slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white group transition-colors py-1 px-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:scale-125 transition-all shrink-0" />
                          <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={tool.title}>
                            {cleanTitle}
                          </span>
                        </Link>
                      );
                    })}

                    {remainingCount > 0 && (
                      <Link
                        href="/#featured-tools"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:underline mt-1 pl-4"
                      >
                        <span>+ {remainingCount} more in {meta.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Footer Bar */}
      <div className="mt-6 pt-4 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          ⚡ 100% Free &amp; Private in-browser utilities
        </div>
        <Link
          href="/#featured-tools"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-4 py-2 rounded-xl transition-all ml-auto"
        >
          <span>Explore All 150+ Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
