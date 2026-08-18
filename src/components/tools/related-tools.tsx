"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Image as ImageIcon, Video, Music, Wrench, Type, Code2, Zap, ShieldCheck } from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

interface RelatedToolsProps {
  currentSlug: string;
  categorySlug: string;
}

export function RelatedTools({ currentSlug, categorySlug }: RelatedToolsProps) {
  // Extract related tools from the same category + popular cross-category tools
  const relatedList = React.useMemo(() => {
    const list: Array<{ slug: string; title: string; description: string; category: string; badge?: string }> = [];
    const categoryTools = (toolsDatabase as any)[categorySlug] || {};

    const badges = ["Popular", "Instant", "100% Free", "Top Pick"];

    // 1. First add tools from same category (excluding current tool)
    Object.entries(categoryTools).forEach(([slug, tool]: [string, any], idx) => {
      if (slug !== currentSlug && list.length < 4) {
        list.push({
          slug,
          title: tool.title || slug,
          description: tool.description || "",
          category: categorySlug,
          badge: badges[idx % badges.length],
        });
      }
    });

    // 2. If fewer than 4, pull high-utility cross-category recommendations
    if (list.length < 4) {
      const fallbackCategories = ["developer", "document", "image", "utilities"];
      for (const cat of fallbackCategories) {
        if (cat !== categorySlug) {
          const tools = (toolsDatabase as any)[cat] || {};
          for (const [slug, tool] of Object.entries(tools as any)) {
            if (slug !== currentSlug && !list.some((i) => i.slug === slug) && list.length < 4) {
              list.push({
                slug,
                title: (tool as any).title || slug,
                description: (tool as any).description || "",
                category: cat,
                badge: badges[list.length % badges.length],
              });
            }
          }
        }
      }
    }

    return list;
  }, [currentSlug, categorySlug]);

  if (relatedList.length === 0) return null;

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "developer":
        return {
          icon: <Code2 className="w-5 h-5 text-cyan-400" />,
          glow: "from-cyan-500/20 via-blue-500/10 to-transparent",
          border: "group-hover:border-cyan-500/50",
          badgeBg: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
          iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        };
      case "document":
        return {
          icon: <FileText className="w-5 h-5 text-blue-400" />,
          glow: "from-blue-500/20 via-indigo-500/10 to-transparent",
          border: "group-hover:border-blue-500/50",
          badgeBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        };
      case "image":
        return {
          icon: <ImageIcon className="w-5 h-5 text-emerald-400" />,
          glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
          border: "group-hover:border-emerald-500/50",
          badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        };
      case "video":
        return {
          icon: <Video className="w-5 h-5 text-rose-400" />,
          glow: "from-rose-500/20 via-pink-500/10 to-transparent",
          border: "group-hover:border-rose-500/50",
          badgeBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
        };
      case "audio":
        return {
          icon: <Music className="w-5 h-5 text-purple-400" />,
          glow: "from-purple-500/20 via-violet-500/10 to-transparent",
          border: "group-hover:border-purple-500/50",
          badgeBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        };
      case "fonts":
        return {
          icon: <Type className="w-5 h-5 text-indigo-400" />,
          glow: "from-indigo-500/20 via-sky-500/10 to-transparent",
          border: "group-hover:border-indigo-500/50",
          badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        };
      default:
        return {
          icon: <Wrench className="w-5 h-5 text-amber-400" />,
          glow: "from-amber-500/20 via-orange-500/10 to-transparent",
          border: "group-hover:border-amber-500/50",
          badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        };
    }
  };

  return (
    <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#070d1e]/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Power Up Your Workflow</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Related &amp; Recommended Utilities
          </h3>
        </div>

        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm group w-fit"
        >
          <span>View All {categorySlug === "developer" ? "Data & Code" : categorySlug} Tools</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 4-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedList.map((tool) => {
          const theme = getCategoryTheme(tool.category);
          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0a122c] border border-slate-200/90 dark:border-slate-800/90 ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Card Top Glow on Hover */}
              <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${theme.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className={`w-10 h-10 rounded-xl ${theme.iconBg} border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    {theme.icon}
                  </div>

                  {tool.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${theme.badgeBg}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1 mb-1.5">
                  {tool.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Launch Tool</span>
                <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
