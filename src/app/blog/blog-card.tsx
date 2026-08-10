"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import React, { useRef, useState } from "react";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export function BlogCard({ post, index }: { post: Post; index: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const isFeatured = index === 0;

  // Calculate estimated reading time (assuming ~150-200 words per minute and typical blog lengths for these excerpts)
  const readingTime = Math.max(2, Math.floor(post.excerpt.length / 50));

  return (
    <article
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between bg-card rounded-3xl border border-border/60 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden ${
        isFeatured ? "md:col-span-2 lg:col-span-3 md:flex-row gap-8 lg:p-12" : ""
      }`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(37,99,235,0.08), transparent 40%)`,
        }}
      />

      {/* Liquid Blobs Background (only visible on hover) */}
      <div className="absolute top-0 right-0 p-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-32 h-32 bg-primary/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-32 h-32 bg-secondary/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-10 w-32 h-32 bg-accent/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`relative z-10 flex flex-col ${isFeatured ? "md:justify-center w-full" : "h-full"}`}>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Tag className="mr-1.5 h-3 w-3" />
            {post.category}
          </span>
          <span className="inline-flex items-center text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Clock className="mr-1.5 h-4 w-4 text-muted-foreground" />
            {post.date} • {readingTime} min read
          </span>
        </div>

        <h2
          className={`font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300 ${
            isFeatured ? "text-3xl lg:text-5xl leading-tight" : "text-2xl"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true"></span>
            {post.title}
          </Link>
        </h2>

        <p className={`text-muted-foreground leading-relaxed ${isFeatured ? "text-lg max-w-3xl mb-8" : "mb-8 flex-grow"}`}>
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 flex items-center text-sm font-bold text-primary group-hover:text-secondary transition-colors duration-300">
          Read Article
          <div className="ml-2 bg-primary/10 rounded-full p-1 group-hover:bg-secondary/20 transition-colors duration-300">
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </article>
  );
}
