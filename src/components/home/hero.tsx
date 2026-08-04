import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, FileText, Image as ImageIcon, Video, Music, Eraser, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { HeroCategories } from "./hero-categories";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            <Zap className="mr-2 h-4 w-4 text-warning" />
            <span>The next generation file converter</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Convert <span className="text-primary">Anything</span>.<br />
            Anywhere. Instantly.
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            One platform for every conversion. Fast, secure, and completely free. 
            Transform documents, images, audio, video, and more with unparalleled quality and speed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="#featured-tools"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full w-full sm:w-auto h-12 px-8 text-base")}
            >
              Start Converting <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#featured-tools"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full w-full sm:w-auto h-12 px-8 text-base")}
            >
              Explore Tools
            </a>
          </div>
        </div>

        {/* Feature Grid / Demo */}
        <div className="mx-auto mt-20 max-w-5xl">
          <HeroCategories />
        </div>
      </div>
    </section>
  );
}
