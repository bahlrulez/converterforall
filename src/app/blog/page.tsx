import { Metadata } from "next";
import { BookOpen, Sparkles, Shield, Cpu, Zap } from "lucide-react";
import { posts } from "@/lib/blog-data";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Blog & File Conversion Guides | 100% Free & Private | ConverterForAll",
  description: "Explore free in-depth guides, PDF workflows, image optimization tutorials, Hindi/Punjabi Unicode conversion tips, and privacy-first tech insights from ConverterForAll.",
  alternates: {
    canonical: "https://www.converterforall.com/blog",
  },
  openGraph: {
    title: "Blog & File Conversion Guides | ConverterForAll",
    description: "Explore free in-depth guides on PDF conversion, background removal, legacy font translation to Unicode, and 100% private local tools.",
    type: "website",
    url: "https://www.converterforall.com/blog",
  }
};

export default function BlogIndex() {
  // Sort posts by date (descending)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ConverterForAll Blog",
    "url": "https://www.converterforall.com/blog",
    "description": metadata.description,
    "publisher": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.converterforall.com/icon.png"
      }
    },
    "blogPost": sortedPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://www.converterforall.com/blog/${post.slug}`,
      "datePublished": new Date(post.date).toISOString(),
      "description": post.excerpt,
      "author": {
        "@type": "Organization",
        "name": "ConverterForAll Editorial Team"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="relative pt-16 pb-20 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-6 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 animate-pulse" />
            <span>High-Impact Privacy &amp; Conversion Guides</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            The ConverterForAll{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Blog &amp; Knowledge Base
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Practical tutorials, font conversion manuals, privacy deep-dives, and productivity workflows to help you master your digital files.
          </p>

          {/* Quick Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>No Cloud Uploads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Blog Cards & Category Filters */}
      <BlogClient initialPosts={sortedPosts} />
    </div>
  );
}
