import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FAQ } from "@/components/home/faq";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, FileText, Music, Video, Type } from "lucide-react";
import { toolsDatabase } from "@/lib/tools-db";

export default function Home() {
  const imageTools = Object.entries(toolsDatabase.image);
  const documentTools = Object.entries(toolsDatabase.document);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://converterforall.com/#website",
                "url": "https://converterforall.com/",
                "name": "ConverterForAll",
                "description": "One Platform. Every Conversion. Fast, Secure, and Free.",
                "publisher": {
                  "@id": "https://converterforall.com/#organization"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://converterforall.com/#organization",
                "name": "ConverterForAll",
                "url": "https://converterforall.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://converterforall.com/favicon.ico"
                }
              }
            ]
          })
        }}
      />
      <Hero />
      
      <HowItWorks />
      
      <section id="featured-tools" className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Document Tools Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Document & PDF Converters</h2>
                <p className="text-muted-foreground">Secure, client-side document conversions.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTools.slice(0, 6).map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-blue-500/10 text-blue-500">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Image Tools Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Image Utilities</h2>
                <p className="text-muted-foreground">Fast, high-quality image processing in your browser.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageTools.map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-emerald-500/10 text-emerald-500">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title.replace('Convert ', '')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Video Tools Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Video Tools</h2>
                <p className="text-muted-foreground">Fast, high-quality video conversion in your browser.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries((toolsDatabase as any).video || {}).map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-red-500/10 text-red-500">
                      <Video className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title.replace('Convert ', '')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Audio Tools Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Audio Tools</h2>
                <p className="text-muted-foreground">Extract and convert audio files seamlessly.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries((toolsDatabase as any).audio || {}).map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-purple-500/10 text-purple-500">
                      <Music className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title.replace('Convert ', '')}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Font Converters Section */}
          <div id="font-converters" className="mb-20 scroll-mt-24">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Font Converters</h2>
                <p className="text-muted-foreground">Convert between Unicode and legacy Hindi/Punjabi fonts instantly.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries((toolsDatabase as any).fonts || {}).map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-indigo-500/10 text-indigo-500">
                      <Type className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Utility Tools Section */}
          <div id="utility-tools" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Utility Tools</h2>
                <p className="text-muted-foreground">Handy tools for measuring and analyzing.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries((toolsDatabase as any).utilities || {}).map(([slug, tool]: any) => (
                <Link 
                  key={slug}
                  href={`/${slug}`}
                  className="group rounded-2xl border bg-card p-6 md:hover:shadow-md transition-all md:hover:border-primary/50 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-xl p-3 bg-amber-500/10 text-amber-500">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{tool.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Features />
      
      <FAQ />
    </>
  );
}
