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
      canonical: `https://converterforall.com/blog/${resolvedParams.slug}`,
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
      "@id": `https://converterforall.com/blog/${params.slug}`
    },
    "headline": post.title,
    "description": excerpt,
    "image": "https://converterforall.com/icon.png",
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": "ConverterForAll Team",
      "url": "https://converterforall.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "logo": {
        "@type": "ImageObject",
        "url": "https://converterforall.com/icon.png"
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
      <div className="relative border-b overflow-hidden bg-muted/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-70"></div>
        <div className="container relative mx-auto px-4 pt-12 pb-20 max-w-4xl">
          
          <div className="flex items-center text-sm font-medium text-muted-foreground mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            <Link href="/blog" className="hover:text-primary transition-colors flex items-center">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
            <span className="text-foreground truncate">{post.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full ring-1 ring-primary/20">
              <Tag className="mr-1.5 h-3 w-3" />
              {post.category}
            </span>
            <span className="inline-flex items-center text-sm text-muted-foreground font-medium">
              <Clock className="mr-1.5 h-4 w-4" />
              {post.date}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 pt-6 border-t border-border/50">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
               CF
             </div>
             <div>
               <p className="text-sm font-semibold">ConverterForAll Team</p>
               <p className="text-xs text-muted-foreground">Expert Editorial</p>
             </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <article 
          className="prose prose-slate dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        <div className="mt-20 pt-10 border-t">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold tracking-tight">About the Author</h3>
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              More Articles
            </Link>
          </div>
          <AuthorProfile />
        </div>
      </div>
    </div>
  );
}
