import { ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, getCanonicalToolSlugs } from "@/lib/tools-db";
import { getToolContent, extractToolFaqs } from "@/lib/tool-content";
import { Metadata } from "next";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { RelatedTools } from "@/components/tools/related-tools";
import { ToolReviews } from "@/components/tools/tool-reviews";
import { getToolReviewStats } from "@/lib/reviews-data";
import { getOptimizedToolTitle, getOptimizedToolDescription } from "@/lib/seo/metadata";
import { getRobotsForPath } from "@/lib/seo-allowlist";
import { SITE_ORIGIN } from "@/lib/seo/site-config";
import { buildBreadcrumbSchema, buildSoftwareAppSchema, buildFaqPageSchema } from "@/lib/seo/schema-builders";
import { getToolProcessingBadges } from "@/lib/seo/tool-processing-classification";

export async function generateStaticParams() {
  return getCanonicalToolSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const toolData = getToolBySlug(resolvedParams.slug);
  
  if (!toolData) {
    return { 
      title: "Page Not Found",
      robots: { index: false, follow: false }
    };
  }

  const { tool, toolSlug, categorySlug } = toolData;
  const pageTitle = getOptimizedToolTitle(tool, toolSlug);
  const pageDescription = getOptimizedToolDescription(tool, toolSlug, categorySlug);

  const ogImageUrl = `${SITE_ORIGIN}/og/${toolSlug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: getRobotsForPath(`/${toolSlug}`),
    openGraph: {
      title: `${pageTitle} | ConverterForAll`,
      description: pageDescription,
      type: "website",
      url: `${SITE_ORIGIN}/${toolSlug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.title} | ConverterForAll`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | ConverterForAll`,
      description: pageDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_ORIGIN}/${toolSlug}`,
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
  const isRaaviGuidePage = toolSlug === "unicode-to-raavi";

  // Extract from/to from slug if it's a length converter (e.g. "inches-to-centimeters")
  let defaultFrom = "inches";
  let defaultTo = "centimeters";
  if (tool.converterType === "length") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFrom = parts[0];
      defaultTo = parts[1];
    }
  }

  // Extract from/to from slug if it's a font converter
  let defaultFontFrom = "unicode";
  let defaultFontTo = "krutidev";
  if (tool.converterType === "font") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFontFrom = parts[0];
      defaultFontTo = parts[1];
    }
  }

  // Generate Breadcrumb Schema
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_ORIGIN, position: 1 },
    { name: tool.title, url: `${SITE_ORIGIN}/${toolSlug}`, position: 2 }
  ]);

  const contentSections = getToolContent(toolSlug, tool.title, tool.description);
  const reviewStats = await getToolReviewStats(toolSlug);
  const extractedFaqs = extractToolFaqs(contentSections);

  // Converter pages use SoftwareApplication schema; informational guides do not.
  const softwareAppSchema = isRaaviGuidePage ? null : buildSoftwareAppSchema({
    name: tool.title,
    description: tool.description,
    url: `${SITE_ORIGIN}/${toolSlug}`,
    applicationCategory: "UtilitiesApplication",
    rating: reviewStats.totalReviews > 0 ? {
      ratingValue: reviewStats.averageRating,
      reviewCount: reviewStats.totalReviews,
      bestRating: 5,
      worstRating: 1
    } : undefined
  });

  // Generate FAQPage Schema via shared builder if FAQs exist
  const faqSchema = extractedFaqs.length > 0 
    ? buildFaqPageSchema(extractedFaqs.map(f => ({ question: f.question, answer: f.answer })))
    : null;

  const processingBadges = getToolProcessingBadges(toolSlug, tool, categorySlug);

  const PUNJABI_EXPERIMENTAL_TOOLS = new Set([
    "anmollipi-to-unicode",
    "unicode-to-anmollipi",
    "joy-to-unicode",
    "unicode-to-joy",
    "asees-to-unicode",
    "unicode-to-asees",
    "gurbani-akhar-to-unicode",
  ]);

  const UNVERIFIED_FONT_TOOLS = new Set([
    "chanakya-to-unicode",
    "unicode-to-chanakya",
    "preeti-to-unicode",
    "unicode-to-preeti",
    "bijoy-to-unicode",
    "unicode-to-bijoy",
    "sutonnymj-to-unicode",
    "unicode-to-sutonnymj",
    "inpage-to-unicode",
    "unicode-to-inpage",
    "zawgyi-to-unicode",
    "unicode-to-zawgyi",
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden py-10">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {softwareAppSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
        )}
        {faqSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        )}

        {isRaaviGuidePage ? (
          <header className="max-w-3xl mx-auto mb-12 print:hidden">
            <Link href="/category/fonts" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Fonts &amp; Text</span>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400 mb-3">Punjabi typography</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-5">{tool.title}</h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">{tool.description}</p>
          </header>
        ) : (
          <div className="mb-10 print:hidden flex flex-col items-center text-center max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all bg-white dark:bg-[#0a1128]/80 px-4 py-2 rounded-full shadow-sm border border-slate-200/90 dark:border-slate-800">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{processingBadges.heroBadge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-[1.15]">{tool.title}</h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">{tool.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{processingBadges.trustBadge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>No account required</span>
              </span>
            </div>
          </div>
        )}

        {!isRaaviGuidePage && (
        <div className="relative mb-14">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[90%] max-w-3xl h-[85%] blur-[90px] opacity-25 dark:opacity-15 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 rounded-full" />
          </div>

          <div className={`${tool.isInteractive ? '' : 'bg-white/90 dark:bg-[#080e22]/95 backdrop-blur-xl rounded-3xl p-5 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl'} relative z-10`}>
            {PUNJABI_EXPERIMENTAL_TOOLS.has(toolSlug) && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm flex items-center justify-center text-center gap-2 font-medium">
                <span className="font-bold text-amber-700 dark:text-amber-400">Notice:</span>
                <span>Experimental: results may contain errors. Check carefully.</span>
              </div>
            )}
            {UNVERIFIED_FONT_TOOLS.has(toolSlug) && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm flex items-center justify-center text-center gap-2 font-medium">
                <span className="font-bold text-amber-700 dark:text-amber-400">Notice:</span>
                <span>Please check the output before relying on it.</span>
              </div>
            )}
            <ToolRenderer
                toolSlug={toolSlug}
                categorySlug={categorySlug}
                tool={tool}
                defaultFrom={defaultFrom}
                defaultTo={defaultTo}
                defaultFontFrom={defaultFontFrom}
                defaultFontTo={defaultFontTo}
            />
            {categorySlug === "fonts" && tool.fontCategory === "punjabi" && !isRaaviGuidePage && (
              <div className="mt-5 text-center">
                <a
                  href="https://github.com/bahlrulez/gurmukhi-legacy-to-unicode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                >
                  <span>Open-source Gurmukhi engine on GitHub</span>
                </a>
              </div>
            )}
          </div>
        </div>
        )}

        {!isRaaviGuidePage && (
          <div className="print:hidden">
            <RelatedTools currentSlug={toolSlug} categorySlug={categorySlug} />
          </div>
        )}

        {!isRaaviGuidePage && (
          <div className="print:hidden">
            <ToolReviews
              toolSlug={toolSlug}
              toolTitle={tool.title}
              initialStats={reviewStats}
            />
          </div>
        )}

        {isRaaviGuidePage ? (
          <article className="max-w-3xl mx-auto print:block">
            <div className="space-y-12">
              {contentSections.map((section, index) => (
                <section key={index} className={index < contentSections.length - 1 ? "pb-10 border-b border-slate-200 dark:border-slate-800" : ""}>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-5">{section.title}</h2>
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none prose-base sm:prose-lg leading-8 text-slate-700 dark:text-slate-300 prose-p:my-5 prose-ol:my-5 prose-ul:my-5 prose-li:my-2 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-slate-900 dark:prose-strong:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}
            </div>
          </article>
        ) : (
          <div className="space-y-8 print:hidden mt-12">
            {contentSections.map((section, index) => (
              <div key={index} className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{section.title}</span>
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base leading-relaxed text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
