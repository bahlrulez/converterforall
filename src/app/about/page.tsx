import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";
import { ShieldCheck, Zap, Sparkles, Cpu, Lock, Globe, Heart, CheckCircle2, ArrowRight, Layers, FileText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | 100% Free & Private File Tools | ConverterForAll",
  description: "Learn about ConverterForAll's mission to eliminate paywalls, slow upload queues, and privacy risks with on-device WebAssembly file conversion tools.",
  alternates: {
    canonical: "https://converterforall.com/about",
  },
  openGraph: {
    title: "About ConverterForAll - Privacy-First In-Browser Conversion",
    description: "Discover why ConverterForAll was built to give everyone 150+ free, fast, and completely private file conversion tools directly in their web browser.",
    type: "website",
    url: "https://converterforall.com/about",
  }
};

export default function AboutPage() {
  const stats = [
    { label: "Free Tools Available", value: "150+", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Data Sent to Servers", value: "0 Bytes", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Hardware Processing", value: "100%", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Free Forever & Unlimited", value: "Free", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Privacy by Design",
      description: "We believe your files belong to you. By running conversion algorithms directly in your browser's WebAssembly engine, your passport photos, identity cards, and financial documents never travel across the internet.",
      color: "text-emerald-500",
      borderColor: "group-hover:border-emerald-500/40",
      glowBg: "from-emerald-500/10 via-teal-500/5 to-transparent",
    },
    {
      icon: Zap,
      title: "Zero Friction & Blazing Speed",
      description: "No mandatory sign-ups, no artificial daily file limits, no waiting in cloud processing queues, and no watermarks. Drop your file, convert, and download instantly.",
      color: "text-amber-500",
      borderColor: "group-hover:border-amber-500/40",
      glowBg: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
    {
      icon: Globe,
      title: "Built for Everyone",
      description: "From government exam aspirants converting Kruti Dev Hindi fonts to students merging last-minute project PDFs and freelancers editing product photos, we build tools that make daily digital tasks effortless.",
      color: "text-blue-500",
      borderColor: "group-hover:border-blue-500/40",
      glowBg: "from-blue-500/10 via-indigo-500/5 to-transparent",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About ConverterForAll",
    "url": "https://converterforall.com/about",
    "description": metadata.description,
    "mainEntity": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "url": "https://converterforall.com",
      "logo": "https://converterforall.com/icon.png",
      "description": "Provider of 150+ free, client-side, privacy-focused file conversion and editing tools.",
      "foundingDate": "2026",
      "knowsAbout": ["File Conversion", "WebAssembly In-Browser Processing", "PDF Utilities", "Font Conversion", "Image Optimization"]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="relative pt-16 pb-20 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Technology</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Building the Fastest,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
              100% Private File Converter
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Every online file tool promises to be fast, free, and secure—yet most lock features behind paywalls or upload your private documents to third-party servers. ConverterForAll was built to fix this permanently.
          </p>

          {/* Key Metric Bento Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color} mb-3 shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Narrative & Story Section */}
      <div className="container mx-auto px-4 py-20 max-w-5xl relative z-10 space-y-16">
        
        {/* Story Part 1: How It Started */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4">
              <span>The Origin Story</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              How ConverterForAll Started
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Like many tech projects, ConverterForAll began out of genuine frustration. We needed to convert a scanned document into a clean PDF, remove the background from a product picture, and extract audio from a video clip.
              </p>
              <p>
                Yet every online &quot;solution&quot; followed the same broken pattern: upload your sensitive file to an unknown remote server, wait in an artificial processing queue while advertisements flashed, and hit a paywall asking for a subscription just to download your own file.
              </p>
              <p>
                None of that made sense for everyday file operations. A PDF merge, image compression, or font conversion isn&apos;t a server-intensive supercomputing task—it&apos;s an operation a modern web browser can execute on your own device in milliseconds.
              </p>
            </div>
          </div>
        </div>

        {/* Story Part 2: The Core Values (3-Card Bento) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              The Principles Behind Everything We Build
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              We design every tool with strict technical constraints that put your privacy and speed first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className={`group relative p-7 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 ${v.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between`}
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${v.glowBg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#080e22] border border-slate-200 dark:border-slate-700/60 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${v.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {v.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/70 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Guaranteed on ConverterForAll</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Part 3: What We Built & Tools Suite */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            A Unified Suite of 150+ Free Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>PDF &amp; Document Utilities</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Merge PDFs, split pages, compress for government job portals, extract pages, convert PDF to editable Word (.docx), and run optical character recognition (OCR).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Image &amp; AI Background Engine</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                AI background removal, 2x2&quot; passport photo maker with standard dimension presets, WEBP/HEIC/AVIF converters, image resizer, and lossless compressors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>Regional Indic &amp; Asian Font Converters</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Accurate bidirectional converters for Hindi (Kruti Dev to Mangal Unicode), Punjabi (AnmolLipi/Satluj), Urdu (InPage Nastaliq), Bengali (Bijoy), Nepali (Preeti), and Burmese (Zawgyi).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Media &amp; Browser Utilities</span>
              </h4>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                MP4 to MP3 audio extraction, video compressor, video to GIF generator, QR &amp; barcode generator, on-screen camera measurement, and AI presentation maker.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need a tool that isn&apos;t here yet? Let us know and we&apos;ll build it for the community.
            </p>
            <Link
              href="/#featured-tools"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Explore All 150+ Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Editorial & Author Profile */}
        <div className="pt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">About the Editorial Team &amp; Author</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Maintained with a commitment to privacy, accuracy, and open-access digital utility.
            </p>
          </div>
          <AuthorProfile />
        </div>

      </div>
    </div>
  );
}
