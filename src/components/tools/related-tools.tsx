"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Image as ImageIcon, Video, Music, Wrench, Type, Code2, Lock, Zap, Layers } from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

interface RelatedToolsProps {
  currentSlug: string;
  categorySlug: string;
}

export function RelatedTools({ currentSlug, categorySlug }: RelatedToolsProps) {
  // Extract related tools from the same category + popular cross-category tools
  const relatedList = React.useMemo(() => {
    const list: Array<{ slug: string; title: string; description: string; category: string }> = [];
    const categoryTools = (toolsDatabase as any)[categorySlug] || {};

    // 1. First add tools from same category (excluding current tool)
    Object.entries(categoryTools).forEach(([slug, tool]: [string, any]) => {
      if (slug !== currentSlug && list.length < 4) {
        list.push({
          slug,
          title: tool.title || slug,
          description: tool.description || "",
          category: categorySlug,
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
              });
            }
          }
        }
      }
    }

    return list;
  }, [currentSlug, categorySlug]);

  if (relatedList.length === 0) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "developer":
        return <Code2 className="w-4 h-4 text-cyan-500" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case "video":
        return <Video className="w-4 h-4 text-rose-500" />;
      case "audio":
        return <Music className="w-4 h-4 text-purple-500" />;
      case "fonts":
        return <Type className="w-4 h-4 text-indigo-500" />;
      default:
        return <Wrench className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover More Utilities</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Related Tools &amp; Converters
          </h3>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <span>Explore all {categorySlug === "developer" ? "Data & Code" : categorySlug} tools</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {relatedList.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group relative flex flex-col p-4 rounded-2xl bg-white dark:bg-[#080e22] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getCategoryIcon(tool.category)}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
              {tool.title}
            </h4>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}
