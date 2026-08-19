"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search,
  X,
  Zap,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Wrench,
  Type,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Code2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toolsDatabase } from "@/lib/tools-db";

const CATEGORIES = [
  { key: "popular", label: "Popular", icon: Zap, color: "text-amber-400" },
  { key: "document", label: "Document", icon: FileText, color: "text-blue-400" },
  { key: "developer", label: "Data & Code", icon: Code2, color: "text-cyan-400" },
  { key: "image", label: "Image", icon: ImageIcon, color: "text-emerald-400" },
  { key: "audio", label: "Audio", icon: Music, color: "text-purple-400" },
  { key: "video", label: "Video", icon: Video, color: "text-red-400" },
  { key: "utilities", label: "Utilities", icon: Wrench, color: "text-orange-400" },
  { key: "fonts", label: "Fonts", icon: Type, color: "text-indigo-400" },
];

const POPULAR_TOOLS = [
  { slug: "heic-to-jpg", title: "HEIC to JPG", category: "image" },
  { slug: "jwt-decoder", title: "JWT Decoder", category: "developer" },
  { slug: "json-formatter", title: "JSON Formatter", category: "developer" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", category: "document" },
  { slug: "edit-pdf", title: "Edit PDF Online", category: "document" },
  { slug: "remove-background", title: "Remove Background", category: "image" },
  { slug: "merge-pdf", title: "Merge PDF, JPG, and PNG", category: "document" },
  { slug: "compress-pdf", title: "Compress PDF", category: "document" },
  { slug: "word-to-pdf", title: "WORD to PDF", category: "document" },
  { slug: "pdf-to-word", title: "PDF to WORD", category: "document" },
  { slug: "mp4-to-mp3", title: "MP4 to MP3", category: "audio" },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Flatten all tools for instant search
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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [allTools, searchQuery]);

  if (!isOpen || !mounted) return null;

  const currentCategoryTools =
    activeCategory === "popular"
      ? POPULAR_TOOLS
      : Object.entries((toolsDatabase as any)[activeCategory] || {}).map(([slug, tool]: any) => ({
          slug,
          title: tool.title || slug,
          category: activeCategory,
        }));

  return createPortal(
    <div className="md:hidden fixed inset-0 z-[9999] bg-[#040814]/98 backdrop-blur-3xl flex flex-col text-slate-100 overflow-hidden h-[100dvh] w-screen">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#080e22]/95 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <Monitor className="h-4 w-4" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">ConverterForAll</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. PDF to Word, JPG, MP3)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0e162e] border border-blue-500/30 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Mode */}
        {searchResults !== null ? (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Found {searchResults.length} {searchResults.length === 1 ? "tool" : "tools"}
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-1.5">
                {searchResults.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0c142c] hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-blue-400 font-bold text-sm">|</span>
                      <span className="text-sm font-medium text-white group-hover:text-blue-300 truncate">
                        {tool.title}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md ml-2 shrink-0">
                      {tool.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No tools found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        ) : (
          /* Standard Categorized View */
          <>
            {/* Category Pills Slider */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50"
                        : "bg-[#0e162e] text-slate-300 hover:text-white border border-slate-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : cat.color}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Tools List */}
            <div className="space-y-1.5 pt-1">
              {currentCategoryTools.map((tool: any) => {
                let cleanTitle = tool.title.replace(/^Convert /i, "");
                if (cleanTitle.includes(" – ")) cleanTitle = cleanTitle.split(" – ")[0];
                else if (cleanTitle.includes(" - ")) cleanTitle = cleanTitle.split(" - ")[0];
                else if (cleanTitle.includes(" — ")) cleanTitle = cleanTitle.split(" — ")[0];
                cleanTitle = cleanTitle.replace(/^Free Online /i, "");
                if (cleanTitle.includes(" (") && cleanTitle.length > 24) {
                  cleanTitle = cleanTitle.split(" (")[0];
                }

                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0c142c]/90 hover:bg-[#132044] border border-slate-800/80 hover:border-blue-500/30 transition-all group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-blue-400 font-bold text-sm">|</span>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                        {cleanTitle}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Site Navigation Links */}
            <div className="pt-4 border-t border-slate-800/80 space-y-1">
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#0e162e] transition-colors"
              >
                <span>About Us</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#0e162e] transition-colors"
              >
                <span>Contact</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
              <Link
                href="/blog"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-[#0e162e] transition-colors"
              >
                <span>Blog</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080e22]/95 flex items-center justify-between gap-3 shrink-0">
        <Link
          href="/#featured-tools"
          onClick={onClose}
          className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Explore All 150+ Tools</span>
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-[#0e162e] border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon className="h-4 w-4 text-blue-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
        </button>
      </div>
    </div>,
    document.body
  );
}
