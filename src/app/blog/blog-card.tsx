"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag, ShieldCheck, Sparkles, BookOpen, FileText } from "lucide-react";
import React, { useRef, useState } from "react";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

const CATEGORY_STYLES: Record<string, { badge: string, iconColor: string, gradient: string }> = {
  "privacy & security": {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
  "guides & tutorials": {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconColor: "text-blue-500",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
  },
  "conversion guides": {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconColor: "text-purple-500",
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
  },
  "technology": {
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconColor: "text-cyan-500",
    gradient: "from-cyan-500/10 via-sky-500/5 to-transparent",
  },
  "productivity": {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconColor: "text-amber-500",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
};

export function BlogCard({ post, index, isFirstItem = false }: { post: Post; index: number; isFirstItem?: boolean }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const normalizedCategory = post.category.toLowerCase();
  const style = CATEGORY_STYLES[normalizedCategory] || {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconColor: "text-blue-500",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
  };

  const readingTime = Math.max(3, Math.floor(post.excerpt.length / 45));

  if (isFirstItem) {
    return (
      <article
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative md:col-span-2 lg:col-span-3 flex flex-col lg:flex-row gap-8 items-stretch justify-between bg-white dark:bg-[#0a1128]/95 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-md hover:shadow-2xl hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
      >
        {/* Spotlight cursor glow */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(650px circle at ${position.x}px ${position.y}px, rgba(37,99,235,0.07), transparent 40%)`,
          }}
        />

        {/* Subtle ambient gradient */}
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${style.gradient} rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        {/* Left / Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/30">
                <Sparkles className="w-3 h-3" />
                Featured Guide
              </span>
              <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${style.badge}`}>
                <Tag className="mr-1.5 h-3 w-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                {post.date} • {readingTime} min read
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 tracking-tight leading-tight mb-4">
              <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {post.title}
              </Link>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>
          </div>

          {/* Author info & Read Article CTA */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                CF
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">ConverterForAll Editorial</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  100% Client-Side Verified
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              <span>Read Full Article</span>
              <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card Layout
  return (
    <article
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#0a1128]/95 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(37,99,235,0.06), transparent 40%)`,
        }}
      />

      {/* Card Header: Category & Read Time */}
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style.badge}`}>
            <Tag className="mr-1 h-3 w-3" />
            {post.category}
          </span>
          <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Clock className="mr-1 h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        {/* Post Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-snug mb-3">
          <Link href={`/blog/${post.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
          {post.excerpt}
        </p>
      </div>

      {/* Card Footer: Date & Arrow CTA */}
      <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {post.date}
        </span>
        <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
}
