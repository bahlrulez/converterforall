"use client";

import Link from "next/link";
import { toolsDatabase } from "@/lib/tools-db";
import { Moon, Sun, Monitor, Menu, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
          <div className="relative group h-full flex items-center">
            <button className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 h-full">
              Tools
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
            </button>
            
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-background/95 backdrop-blur-xl border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-8 z-50 grid grid-cols-4 gap-x-8 gap-y-10 translate-y-2 group-hover:translate-y-0 max-h-[80vh] overflow-y-auto">
              {Object.entries(toolsDatabase).map(([categoryName, tools]) => (
                <div key={categoryName}>
                  <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">{categoryName}</h4>
                  <div className="flex flex-col gap-3">
                    {Object.entries(tools as any).map(([slug, tool]: any) => (
                      <Link key={slug} href={`/${slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors truncate" title={tool.title}>
                        {tool.title.replace('Convert ', '')}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
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
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md absolute w-full shadow-lg">
          <nav className="flex flex-col p-4 gap-4">
            <Link 
              href="/#featured-tools" 
              className="text-base font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Converters
            </Link>
            <Link 
              href="/about" 
              className="text-base font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-base font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="https://www.facebook.com/converterforall" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2 text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FacebookIcon className="h-5 w-5" />
              Follow us on Facebook
            </Link>
            <div className="flex items-center justify-between p-2 border-t mt-2">
              <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
