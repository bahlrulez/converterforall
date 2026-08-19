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
  { slug: "merge-pdf", title: "Merge PDF (JPG + PNG)", icon: FileStack, color: "text-red-400" },
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
    <div className="w-[900px] max-w-[96vw] bg-[#070d1e]/98 backdrop-blur-2xl border border-blue-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-slate-200 overflow-hidden flex flex-col p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
      {/* Search Bar Header */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a tool (e.g., 'PDF to Word', 'JPG to PNG', 'Compress')..."
          className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#0e1730] border border-blue-500/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-full"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Content: Search Mode vs Standard Mega Menu Mode */}
      {searchResults !== null ? (
        /* Search Results Grid */
        <div className="min-h-[280px] max-h-[420px] overflow-y-auto pr-2 space-y-2">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {searchResults.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0e1730]/60 hover:bg-blue-600/15 border border-slate-800 hover:border-blue-500/40 transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white group-hover:text-blue-400 truncate">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium">No tools found matching &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for keywords like pdf, jpg, word, audio</p>
            </div>
          )}
        </div>
      ) : (
        /* Standard Layout: Popular Sidebar + Category Columns */
        <div className="grid grid-cols-12 gap-6 min-h-[300px] max-h-[440px] overflow-y-auto pr-2">
          {/* Left Column: POPULAR Tools */}
          <div className="col-span-12 md:col-span-4 border-b md:border-b-0 md:border-r border-slate-800/80 pr-0 md:pr-4 pb-4 md:pb-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Popular</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {POPULAR_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-950/40 border border-transparent hover:border-blue-500/20 text-slate-200 hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Area: Categorized Tools Grid */}
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {Object.entries(toolsDatabase).map(([categoryKey, tools]) => {
              const meta = CATEGORY_META[categoryKey] || {
                label: categoryKey,
                icon: FileText,
                color: "text-blue-400",
              };
              const Icon = meta.icon;
              const toolEntries = Object.entries(tools as any);
              const previewTools = toolEntries.slice(0, 4);
              const remainingCount = toolEntries.length - previewTools.length;

              return (
                <div key={categoryKey} className="flex flex-col">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-800/60">
                    <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                    <span>{meta.label}</span>
                  </div>

                  {/* Tool List with Blue Accent Indicator */}
                  <div className="flex flex-col gap-1.5">
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
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white group transition-colors py-0.5"
                        >
                          <span className="text-blue-500 font-bold text-xs select-none">|</span>
                          <span className="truncate group-hover:text-blue-400 transition-colors" title={tool.title}>
                            {cleanTitle}
                          </span>
                        </Link>
                      );
                    })}

                    {remainingCount > 0 && (
                      <Link
                        href="/#featured-tools"
                        onClick={onClose}
                        className="text-[11px] font-semibold text-blue-400 hover:text-cyan-300 transition-colors mt-0.5 pl-3"
                      >
                        + {remainingCount} more
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
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center">
        <Link
          href="/#featured-tools"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 hover:text-cyan-300 transition-colors"
        >
          <span>Explore All 150+ Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
