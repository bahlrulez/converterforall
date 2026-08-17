"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, BookOpen, ShieldCheck, Zap, ArrowRight, Tag, Clock, CheckCircle2 } from "lucide-react";
import { BlogCard } from "./blog-card";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const CATEGORIES = [
  "All",
  "Guides & Tutorials",
  "Privacy & Security",
  "Conversion Guides",
  "Technology",
  "Productivity",
];

export function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Search & Filter Controls Bar */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 mb-14 relative z-20">
        <div className="bg-white/95 dark:bg-[#0a1128]/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides & font tips..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 dark:bg-[#0c142c] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Count */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing {filteredPosts.length} of {initialPosts.length} Articles</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar -mx-2 px-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400 scale-[1.02]"
                      : "bg-slate-100 dark:bg-[#0c142c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#132044] border border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="container mx-auto px-4 pb-20 max-w-7xl relative z-10">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} isFirstItem={i === 0 && !searchQuery && selectedCategory === "All"} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0a1128]/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <Search className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">
              We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Fast Conversion Callout */}
        <div className="mt-20 rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>150+ Free Tools Ready to Use</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Need to convert or edit a file right now?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
              Convert PDFs, images, videos, audio, and regional fonts directly in your browser. 100% free, unlimited, and completely private.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/#featured-tools"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-lg transition-transform active:scale-95"
              >
                <span>Explore All Tools</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-100">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Zero uploads • 100% Client-Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
