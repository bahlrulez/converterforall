"use client";

import Link from "next/link";
import { Moon, Sun, Menu, ChevronDown, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ToolsMegaMenu } from "./tools-mega-menu";
import { MobileNav } from "./mobile-nav";
import { CompactToolNav } from "./compact-tool-nav";
import { HeroSearch } from "@/components/home/hero-search";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isDark = (resolvedTheme || theme) === "dark";
  const isHomeOrTools = pathname === "/" || pathname === "/tools";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                e.preventDefault();
                window.location.reload();
              }
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-base shadow-[0_0_12px_rgba(99,102,241,0.45)] group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ConverterForAll</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-5 relative h-16">
          {isHomeOrTools ? (
            /* Full Tools Mega Menu Dropdown for Homepage & Tools Directory */
            <div className="group/mega flex h-full items-center">
              <Link href="/tools" className="flex items-center gap-1 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2">
                All Tools <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover/mega:rotate-180 transition-transform duration-200" />
              </Link>

              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-2 group-hover/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 transition-all duration-300 origin-top">
                <ToolsMegaMenu />
              </div>
            </div>
          ) : (
            /* Compact Nav on Tool & Content Pages (Links to all Tier A tools without DOM bloat) */
            <CompactToolNav />
          )}

          <Link href="/category/exam" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Exam Tools
          </Link>
          <Link href="/krutidev-to-unicode" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Hindi Fonts
          </Link>
          <Link href="/asees-to-unicode" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Punjabi Fonts
          </Link>
          <Link href="/video-caption-generator" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Caption Studio
          </Link>
          <Link href="/video-compressor" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Video
          </Link>
          <Link href="/trim-audio" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Audio
          </Link>
          <Link href="/blog" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-full hidden md:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
            title="Search tools (Ctrl+K)"
            aria-label="Search tools"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span className="sr-only">Search tools</span>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="rounded-full inline-flex h-9 w-9 text-muted-foreground hover:text-foreground transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 hover:-rotate-12 transition-transform duration-200" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <Link
            href="/tools"
            className={cn(
              buttonVariants({ variant: "default" }),
              "hidden md:inline-flex rounded-full px-5 py-2 font-bold text-[13px] h-9 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white border-none shadow-[0_0_18px_rgba(99,102,241,0.5)]"
            )}
          >
            Convert File &rarr;
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Modern Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Header Quick Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4"
          onClick={() => setIsSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#080f26] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Quick Tool Finder
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <HeroSearch autoFocus onSelect={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
