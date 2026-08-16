"use client";

import Link from "next/link";
import { toolsDatabase } from "@/lib/tools-db";
import { Moon, Sun, Monitor, Menu, ChevronDown } from "lucide-react";
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
            className="flex items-center gap-2" 
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Monitor className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConverterForAll</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 relative h-16">
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button 
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 h-full cursor-pointer"
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isToolsOpen ? "-rotate-180 text-primary" : ""}`} />
            </button>
            
            {isToolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                <ToolsMegaMenu onClose={() => setIsToolsOpen(false)} />
              </div>
            )}
          </div>

          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="https://www.facebook.com/converterforall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-blue-600 transition-colors hidden md:inline-flex"
            title="Follow us on Facebook"
            aria-label="Follow us on Facebook"
          >
            <FacebookIcon className="h-5 w-5" />
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hidden md:inline-flex"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Link href="/#featured-tools" className={cn(buttonVariants({ variant: "default" }), "hidden md:inline-flex rounded-full px-4")}>
            Get Started
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle mobile menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Modern Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}
