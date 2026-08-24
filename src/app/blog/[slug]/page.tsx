import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";

import { blogDatabase } from "@/lib/blog-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogDatabase[resolvedParams.slug];
  
  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: `${post.title} | ConverterForAll Blog`,
    description: post.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
    alternates: {
      canonical: `https://www.converterforall.com/blog/${resolvedParams.slug}`,
    }
  };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = blogDatabase[params.slug];
  
  if (!post) {
    notFound();
  }

  const excerpt = post.content.substring(0, 200).replace(/<[^>]+>/g, '') + '...';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.converterforall.com/blog/${params.slug}`
    },
    "headline": post.title,
    "description": excerpt,
    "image": "https://www.converterforall.com/icon.png",
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "ConverterForAll Team",
      "url": "https://www.converterforall.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.converterforall.com/icon.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Article Hero */}
      <div className="relative border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-[#080e22]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-70 pointer-events-none" />
        <div className="container relative mx-auto px-4 pt-12 pb-16 max-w-4xl z-10">
          
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-slate-400 dark:text-slate-600 shrink-0" />
            <span className="text-slate-900 dark:text-white font-semibold truncate">{post.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 shadow-sm">
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              {post.category}
            </span>
            <span className="inline-flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/60">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {post.date}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.2]">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              CF
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">ConverterForAll Editorial Team</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">100% Client-Side Verified Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <article 
          className="prose prose-slate dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-img:rounded-2xl" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Hub-and-Spoke Contextual Tool Card */}
        {(() => {
          const lower = (post.title + " " + post.content).toLowerCase();
          let toolTarget = { slug: "passport-photo-maker", title: "Passport Photo Maker", desc: "Create official biometric passport and ID photos in 1-click on your device." };
          
          if (lower.includes("video") && lower.includes("compress")) {
            toolTarget = { slug: "video-compressor", title: "Free Online Video Compressor", desc: "Reduce MP4, MOV & WebM video size by up to 80% on-device with zero quality loss." };
          } else if (lower.includes("pdf") && lower.includes("compress")) {
            toolTarget = { slug: "compress-pdf", title: "Compress PDF Online", desc: "Reduce PDF file size in seconds without quality loss." };
          } else if (lower.includes("pdf") && (lower.includes("edit") || lower.includes("sign"))) {
            toolTarget = { slug: "edit-pdf", title: "Free Online PDF Editor", desc: "Annotate, draw, sign, and blackout sensitive PDF records offline." };
          } else if (lower.includes("pdf")) {
            toolTarget = { slug: "pdf-to-word", title: "PDF to Word (DOCX)", desc: "Extract clean editable Word documents from any PDF file." };
          } else if (lower.includes("background") || lower.includes("remove-bg")) {
            toolTarget = { slug: "remove-background", title: "AI Background Remover", desc: "Automatically isolate subjects and remove image backgrounds with high precision." };
          } else if (lower.includes("kruti") || lower.includes("mangal") || lower.includes("hindi")) {
            toolTarget = { slug: "krutidev-to-unicode", title: "Kruti Dev to Unicode Converter", desc: "Convert legacy font typing into standard Unicode Hindi instantly." };
          } else if (lower.includes("jwt") || lower.includes("token")) {
            toolTarget = { slug: "jwt-decoder", title: "JWT Token Decoder", desc: "Safely decode JWT headers and payload claims without sending data to servers." };
          }

          return (
            <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-32 bg-blue-500/20 blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    ⚡ Live Interactive Tool
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white">{toolTarget.title}</h4>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">{toolTarget.desc}</p>
                </div>
                
                <Link
                  href={`/${toolTarget.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 active:scale-95"
                >
                  <span>Launch Tool Free →</span>
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Global Conversion CTA Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold">Ready to convert other files for free?</h4>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">No uploads, 100% private, and completely free forever.</p>
          </div>
          <Link
            href="/#featured-tools"
            className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 shrink-0 shadow transition-transform active:scale-95"
          >
            Explore 150+ Tools
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">About the Author</h3>
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Articles
            </Link>
          </div>
          <AuthorProfile />
        </div>
      </div>
    </div>
  );
}
