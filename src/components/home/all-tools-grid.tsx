"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Ban,
  Gift,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Wrench,
  Type,
  FileStack,
  Lock,
  Unlock,
  Scissors,
  Eraser,
  Camera,
  Layers,
  FileSpreadsheet,
  FileCode,
  Presentation,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

type CategoryFilter = "all" | "popular" | "developer" | "pdf" | "image" | "video" | "audio" | "document" | "utilities" | "fonts";

interface ToolItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
  isPopular?: boolean;
}

const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All Tools" },
  { key: "popular", label: "Popular" },
  { key: "developer", label: "Data & Code" },
  { key: "pdf", label: "PDF" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video" },
  { key: "audio", label: "Audio" },
  { key: "document", label: "Documents" },
  { key: "utilities", label: "Utilities" },
  { key: "fonts", label: "Fonts" },
];

function getToolMeta(slug: string, category: string, tool: any): { icon: any; iconBg: string; iconColor: string; badge: string; isPopular: boolean } {
  const lowerSlug = slug.toLowerCase();
  
  if (category === "developer" || lowerSlug.includes("jwt") || lowerSlug.includes("json") || lowerSlug.includes("base64") || lowerSlug.includes("uuid") || lowerSlug.includes("timestamp")) {
    return { icon: Code2, iconBg: "bg-cyan-500/15 border-cyan-500/30", iconColor: "text-cyan-400", badge: "Data & Code", isPopular: lowerSlug.includes("jwt") || lowerSlug.includes("json") };
  }
  
  if (lowerSlug.includes("remove-bg") || lowerSlug.includes("remove-background")) {
    return { icon: Eraser, iconBg: "bg-purple-500/15 border-purple-500/30", iconColor: "text-purple-400", badge: "AI Magic", isPopular: true };
  }
  if (lowerSlug.includes("passport")) {
    return { icon: Camera, iconBg: "bg-amber-500/15 border-amber-500/30", iconColor: "text-amber-400", badge: "Popular", isPopular: true };
  }
  if (lowerSlug.includes("merge")) {
    return { icon: FileStack, iconBg: "bg-orange-500/15 border-orange-500/30", iconColor: "text-orange-400", badge: "Popular", isPopular: true };
  }
  if (lowerSlug.includes("split") || lowerSlug.includes("remove-pages") || lowerSlug.includes("extract")) {
    return { icon: Scissors, iconBg: "bg-pink-500/15 border-pink-500/30", iconColor: "text-pink-400", badge: "Popular", isPopular: true };
  }
  if (lowerSlug.includes("compress")) {
    return { icon: Zap, iconBg: "bg-amber-500/15 border-amber-500/30", iconColor: "text-amber-400", badge: "Optimize", isPopular: true };
  }
  if (lowerSlug.includes("protect") || lowerSlug.includes("lock")) {
    return { icon: Lock, iconBg: "bg-teal-500/15 border-teal-500/30", iconColor: "text-teal-400", badge: "Security", isPopular: false };
  }
  if (lowerSlug.includes("unlock")) {
    return { icon: Unlock, iconBg: "bg-yellow-500/15 border-yellow-500/30", iconColor: "text-yellow-400", badge: "Security", isPopular: false };
  }
  if (lowerSlug.includes("heic")) {
    return { icon: ImageIcon, iconBg: "bg-amber-500/15 border-amber-500/30", iconColor: "text-amber-400", badge: "Apple Photo", isPopular: true };
  }
  if (lowerSlug.includes("word") || lowerSlug.includes("docx")) {
    return { icon: FileText, iconBg: "bg-blue-500/15 border-blue-500/30", iconColor: "text-blue-400", badge: "Popular", isPopular: true };
  }
  if (lowerSlug.includes("powerpoint") || lowerSlug.includes("ppt")) {
    return { icon: Presentation, iconBg: "bg-red-500/15 border-red-500/30", iconColor: "text-red-400", badge: "Office", isPopular: false };
  }
  if (lowerSlug.includes("excel") || lowerSlug.includes("xls")) {
    return { icon: FileSpreadsheet, iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-400", badge: "Office", isPopular: false };
  }
  if (lowerSlug.includes("html")) {
    return { icon: FileCode, iconBg: "bg-orange-500/15 border-orange-500/30", iconColor: "text-orange-400", badge: "Web", isPopular: false };
  }
  if (category === "document" || lowerSlug.includes("pdf")) {
    return { icon: FileText, iconBg: "bg-red-500/15 border-red-500/30", iconColor: "text-red-400", badge: "Document", isPopular: lowerSlug.includes("jpg-to-pdf") || lowerSlug.includes("png-to-pdf") };
  }
  if (category === "image") {
    return { icon: ImageIcon, iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-400", badge: "Image", isPopular: lowerSlug.includes("webp") || lowerSlug.includes("jpg") };
  }
  if (category === "video") {
    return { icon: Video, iconBg: "bg-purple-500/15 border-purple-500/30", iconColor: "text-purple-400", badge: "Video", isPopular: lowerSlug.includes("mp4") };
  }
  if (category === "audio") {
    return { icon: Music, iconBg: "bg-sky-500/15 border-sky-500/30", iconColor: "text-sky-400", badge: "Audio", isPopular: lowerSlug.includes("mp3") };
  }
  if (category === "fonts") {
    return { icon: Type, iconBg: "bg-cyan-500/15 border-cyan-500/30", iconColor: "text-cyan-400", badge: "Font", isPopular: false };
  }
  
  return { icon: Wrench, iconBg: "bg-slate-500/15 border-slate-500/30", iconColor: "text-slate-400", badge: "Tool", isPopular: false };
}

export function AllToolsGrid() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract all tools from the database
  const allToolsList: ToolItem[] = useMemo(() => {
    const list: ToolItem[] = [];
    Object.entries(toolsDatabase).forEach(([catKey, tools]) => {
      Object.entries(tools as any).forEach(([slug, tool]: any) => {
        const meta = getToolMeta(slug, catKey, tool);
        list.push({
          slug,
          title: tool.title || slug,
          description: tool.description || `Convert and process ${slug} files easily and privately in your browser.`,
          category: catKey,
          subCategory: tool.subCategory,
          icon: meta.icon,
          iconBg: meta.iconBg,
          iconColor: meta.iconColor,
          badge: meta.badge,
          isPopular: meta.isPopular,
        });
      });
    });
    return list;
  }, []);

  // Filter tools based on search and active category tab
  const filteredTools = useMemo(() => {
    let result = allToolsList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    if (activeTab === "popular") {
      result = result.filter((t) => t.isPopular);
    } else if (activeTab === "pdf") {
      result = result.filter((t) => t.category === "document" || t.slug.includes("pdf"));
    } else if (activeTab === "document") {
      result = result.filter((t) => t.category === "document");
    } else if (activeTab !== "all") {
      result = result.filter((t) => t.category === activeTab);
    }

    return result;
  }, [allToolsList, activeTab, searchQuery]);

  // If not searching and not expanded, show top 16 items
  const displayTools = isExpanded || searchQuery.trim() !== "" ? filteredTools : filteredTools.slice(0, 16);

  return (
    <section id="featured-tools" className="py-20 relative bg-slate-50/50 dark:bg-[#060b19] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 dark:from-blue-600/10 dark:via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Header & Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>150+ Free File Tools</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              All the Tools You Need, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
                In One Place.
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              150+ Free online tools to convert, edit, compress and manipulate files. 100% free, unlimited, and privacy-focused.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 150+ tools (e.g. PDF to Word, JPG, MP4)..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-[#0c142c] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key && !searchQuery;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md dark:shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/60 scale-[1.02]"
                    : "bg-white dark:bg-[#0c142c] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#132044] border border-slate-200 dark:border-slate-800 shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-Column Modern Tool Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  title={`${tool.title} - Free Online Tool`}
                  className="group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-[#0a1128]/90 hover:bg-slate-50 dark:hover:bg-[#0f1a3d] border border-slate-200/80 dark:border-slate-800/90 hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

                  {/* Card Header: Icon + Badge */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${tool.iconBg} ${tool.iconColor} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 group-hover:border-blue-400/40 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Tool Title & Description */}
                  <div className="relative z-10 mb-4 flex-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5 leading-snug">
                      {(() => {
                        let clean = tool.title.replace(/^Convert /i, "");
                        if (clean.includes(" – ")) clean = clean.split(" – ")[0];
                        else if (clean.includes(" - ")) clean = clean.split(" - ")[0];
                        else if (clean.includes(" — ")) clean = clean.split(" — ")[0];
                        clean = clean.replace(/^Free Online /i, "");
                        return clean.trim();
                      })()}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Card Footer: Status & Arrow */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      <span>Free & Fast</span>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#0a1128]/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Search className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-slate-800 dark:text-slate-300 font-semibold">No tools found matching &quot;{searchQuery}&quot;</p>
            <p className="text-slate-500 text-xs mt-1">Try searching for keywords like PDF, JPG, Compress, or Word.</p>
          </div>
        )}

        {/* Expand / Explore All 150+ Tools Button */}
        {!searchQuery && filteredTools.length > 16 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-800 dark:text-white bg-white dark:bg-[#0e1733] hover:bg-slate-100 dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-white" />
              <span>{isExpanded ? "Show Less Tools" : `Explore All ${filteredTools.length}+ Tools`}</span>
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`} />
            </button>
          </div>
        )}

        {/* SEO Trust Features Bar */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Private</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Files never leave your device</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lightning Fast</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant on-device processing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Watermarks</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Clean personal & commercial use</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Free</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Unlimited file conversions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
