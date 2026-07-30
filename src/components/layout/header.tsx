"use client";

import Link from "next/link";
import { Moon, Sun, Monitor, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Monitor className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConverterForAll</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/converters" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Converters
          </Link>
          <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link href="/api" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            API
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Button className="hidden md:inline-flex rounded-full">Get Started</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
