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
  ChevronRight,
} from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";
import { cn } from "@/lib/utils";

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
    <section id="featured-tools" className="py-12 relative bg-[#030714]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Header & Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-6 rounded-3xl bg-[#080e22]/90 border border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
              All 150+ Conversion Tools
            </h2>
            <p className="text-slate-400 text-sm">
              Search a converter or browse by category
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search converters..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-[#0c1630] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Cards (Replacing Pills) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { key: "pdf", label: "PDF Tools", count: "20+ tools", icon: FileText, color: "bg-red-500", shadow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]" },
            { key: "image", label: "Image Tools", count: "30+ tools", icon: ImageIcon, color: "bg-emerald-500", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
            { key: "video", label: "Video Tools", count: "25+ tools", icon: Video, color: "bg-orange-500", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]" },
            { key: "audio", label: "Audio Tools", count: "15+ tools", icon: Music, color: "bg-purple-500", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]" },
            { key: "document", label: "Document Tools", count: "20+ tools", icon: FileText, color: "bg-blue-500", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
            { key: "fonts", label: "Fonts & Text", count: "20+ tools", icon: Type, color: "bg-pink-500", shadow: "shadow-[0_0_15px_rgba(236,72,153,0.2)]" }
          ].map((cat) => {
            const isActive = activeTab === cat.key && !searchQuery;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveTab(isActive ? "all" : cat.key as CategoryFilter);
                  setSearchQuery("");
                }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-all text-left group",
                  isActive 
                    ? "bg-[#0c1630] border-slate-600" 
                    : "bg-[#080e22]/90 border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1630]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", cat.color, cat.shadow)}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{cat.label}</h4>
                    <p className="text-[10px] text-slate-400">{cat.count}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
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

        {/* SEO Trust Features Bar -> Removed because it is now standalone */}
      </div>
    </section>
  );
}
