"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { FileText, Image as ImageIcon, Video, Music, Calculator, Zap, Type } from "lucide-react";

const CATEGORIES = [
  { icon: FileText, label: "PDF", color: "text-blue-500", bg: "bg-blue-500/10", borderHover: "group-hover:border-blue-500/50", glow: "from-blue-500/20", href: "/category/document" },
  { icon: ImageIcon, label: "Images", color: "text-emerald-500", bg: "bg-emerald-500/10", borderHover: "group-hover:border-emerald-500/50", glow: "from-emerald-500/20", href: "/category/image" },
  { icon: Video, label: "Video", color: "text-rose-500", bg: "bg-rose-500/10", borderHover: "group-hover:border-rose-500/50", glow: "from-rose-500/20", href: "/category/video" },
  { icon: Music, label: "Audio", color: "text-purple-500", bg: "bg-purple-500/10", borderHover: "group-hover:border-purple-500/50", glow: "from-purple-500/20", href: "/category/audio" },
  { icon: Calculator, label: "Utilities", color: "text-amber-500", bg: "bg-amber-500/10", borderHover: "group-hover:border-amber-500/50", glow: "from-amber-500/20", href: "/#utility-tools" },
  { icon: Type, label: "Fonts", color: "text-indigo-500", bg: "bg-indigo-500/10", borderHover: "group-hover:border-indigo-500/50", glow: "from-indigo-500/20", href: "/#font-converters" },
  { icon: Zap, label: "More Tools", color: "text-primary", bg: "bg-primary/10", borderHover: "group-hover:border-primary/50", glow: "from-primary/20", href: "/#featured-tools" },
];

function CategoryCard({ category }: { category: typeof CATEGORIES[0] }) {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

  return (
    <Link
      ref={divRef}
      href={category.href}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col items-center justify-center gap-4 rounded-[2rem] border bg-card/40 p-8 transition-all duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl overflow-hidden ${category.borderHover}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-[2rem]"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.15), transparent 40%)`,
        }}
      />
      
      {/* Background glow specific to the category color */}
      <div 
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${category.glow} to-transparent dark:opacity-0 dark:group-hover:opacity-50`}
      />

      <div className={`relative z-10 rounded-2xl p-4 ${category.bg} transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
        <category.icon className={`h-8 w-8 ${category.color}`} />
      </div>
      <span className="relative z-10 text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
        {category.label}
      </span>
    </Link>
  );
}

export function HeroCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
      {CATEGORIES.map((category, i) => (
        <CategoryCard key={i} category={category} />
      ))}
    </div>
  );
}
