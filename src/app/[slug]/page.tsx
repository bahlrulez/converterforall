import { ArrowLeft, ShieldCheck, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-db";
import { getToolContent } from "@/lib/tool-content";
import { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { RelatedTools } from "@/components/tools/related-tools";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const toolData = getToolBySlug(resolvedParams.slug);
  
  if (!toolData) {
    return { title: "Not Found" };
  }

  return {
    title: (toolData.tool as any).seoTitle || `${toolData.tool.title} | 100% Free & Private Online Tool`,
    description: (toolData.tool as any).seoDescription || `${toolData.tool.description} Fast, secure, client-side conversion powered by in-browser WebAssembly & WebGPU hardware acceleration.`,
    openGraph: {
      title: `${toolData.tool.title} - Free Online Converter`,
      description: toolData.tool.description,
      type: "website",
      url: `https://converterforall.com/${resolvedParams.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolData.tool.title} - Free Online Converter`,
      description: toolData.tool.description,
    },
    alternates: {
      canonical: `https://converterforall.com/${resolvedParams.slug}`,
    }
  };
}

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const toolData = getToolBySlug(params.slug);
  
  if (!toolData) {
    notFound();
  }

  const { categorySlug, toolSlug, tool } = toolData;

  // Extract from/to from slug if it's a length converter (e.g. "inches-to-centimeters")
  let defaultFrom = "inches";
  let defaultTo = "centimeters";
  if ((tool as any).converterType === "length") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFrom = parts[0];
      defaultTo = parts[1];
    }
  }

  // Extract from/to from slug if it's a font converter
  let defaultFontFrom = "unicode";
  let defaultFontTo = "krutidev";
  if ((tool as any).converterType === "font") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFontFrom = parts[0];
      defaultFontTo = parts[1];
    }
  }

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://converterforall.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.title,
        "item": `https://converterforall.com/${toolSlug}`
      }
    ]
  };

  // Generate SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "operatingSystem": "All",
    "applicationCategory": "UtilitiesApplication",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": tool.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const contentSections = getToolContent(toolSlug, tool.title, tool.description);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden py-10">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Inject JSON-LD Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />

        {/* Hero Header Section */}
        <div className="mb-10 print:hidden flex flex-col items-center text-center max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all bg-white dark:bg-[#0a1128]/80 px-4 py-2 rounded-full shadow-sm border border-slate-200/90 dark:border-slate-800"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            <span>Back to All 150+ Tools</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free &amp; Private On-Device Tool</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-[1.15]">
            {tool.title}
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            {tool.description}
          </p>

          {/* Quick Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Cloud Uploads</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>WebGPU Hardware Speed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Unlimited &amp; Free Forever</span>
            </span>
          </div>
        </div>

        {/* Main Interactive Tool Engine Box */}
        <div className="relative mb-14">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[90%] max-w-3xl h-[85%] blur-[90px] opacity-25 dark:opacity-15 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 rounded-full" />
          </div>

          <div className={`${(tool as any).isInteractive ? '' : 'bg-white/90 dark:bg-[#080e22]/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl'} relative z-10`}>
            <ToolRenderer
              toolSlug={toolSlug}
              categorySlug={categorySlug}
              tool={tool}
              defaultFrom={defaultFrom}
              defaultTo={defaultTo}
              defaultFontFrom={defaultFontFrom}
              defaultFontTo={defaultFontTo}
            />
          </div>
        </div>

        {/* Lightweight Modern Related Utilities Discovery Strip (Above FAQs & Guides) */}
        <div className="print:hidden">
          <RelatedTools currentSlug={toolSlug} categorySlug={categorySlug} />
        </div>

        {/* Structured SEO Guide & Bento Information Sections */}
        <div className="space-y-8 print:hidden">
          {contentSections.map((section, index) => (
            <div 
              key={index} 
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{section.title}</span>
              </h2>
              <div 
                className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base leading-relaxed text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
