import { Hero } from "@/components/home/hero";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

export default function Home() {
  const imageTools = Object.entries(toolsDatabase.image);

  return (
    <>
      <Hero />
      
      <section id="featured-tools" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Converters</h2>
              <p className="text-muted-foreground">Try our most popular conversion tools, working instantly in your browser.</p>
            </div>
            <Link href="/tools" className="hidden sm:flex items-center text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageTools.map(([slug, tool]) => (
              <Link 
                key={slug}
                href={`/tools/image/${slug}`}
                className="group rounded-2xl border bg-card p-6 hover:shadow-md transition-all hover:border-primary/50 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-500">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title.replace('Convert ', '')}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                <div className="mt-auto flex items-center text-sm font-medium text-primary">
                  Convert now <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
