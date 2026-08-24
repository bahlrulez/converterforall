"use client";

import Link from "next/link";
import { toolsDatabase } from "@/lib/tools-db";
import { Moon, Sun, Monitor, Menu, ChevronDown, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ToolsMegaMenu } from "./tools-mega-menu";
import { MobileNav } from "./mobile-nav";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 8a10 10 0 1 0 0 8" />
      <path d="M21 12V8h-4" />
      <path d="M17 16h4v-4" />
    </svg>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <LogoIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ConverterForAll</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-5 relative h-16">
          {/* All Tools Mega Menu Dropdown Wrapper */}
          <div className="group/mega flex h-full items-center">
            <Link href="/#featured-tools" className="flex items-center gap-1 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-2">
              All Tools <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover/mega:rotate-180 transition-transform duration-200" />
            </Link>
            
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-2 group-hover/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 transition-all duration-300 origin-top">
              <ToolsMegaMenu onClose={() => setIsToolsOpen(false)} />
            </div>
          </div>
          <Link href="/category/document" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            PDF
          </Link>
          <Link href="/category/image" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Image
          </Link>
          <Link href="/category/video" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Video
          </Link>
          <Link href="/category/audio" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Audio
          </Link>
          <Link href="/category/document" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Documents
          </Link>
          <Link href="/category/fonts" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Fonts & Text
          </Link>
          <Link href="/blog" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hidden md:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span className="sr-only">Search</span>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hidden md:inline-flex h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <div className="hidden lg:flex items-center gap-1 border-l border-border pl-3 ml-1">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">
              <FacebookIcon className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 transition-colors">
              <InstagramIcon className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
          
          <Link 
            href="/#featured-tools" 
            className={cn(
              buttonVariants({ variant: "default" }), 
              "hidden md:inline-flex rounded-full px-5 py-2 font-semibold text-[13px] h-9 transition-all hover:scale-105 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-[0_0_15px_rgba(37,99,235,0.4)]"
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
    </header>
  );
}
