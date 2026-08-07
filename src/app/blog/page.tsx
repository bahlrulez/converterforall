import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { posts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog & Conversion Guides | ConverterForAll",
  description: "Read the latest articles on file conversion, productivity, tech trends, and privacy from the ConverterForAll team.",
  alternates: {
    canonical: "https://converterforall.com/blog",
  }
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ConverterForAll Blog",
    "url": "https://converterforall.com/blog",
    "description": metadata.description,
    "publisher": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "logo": {
        "@type": "ImageObject",
        "url": "https://converterforall.com/icon.png"
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://converterforall.com/blog/${post.slug}`,
      "datePublished": new Date(post.date).toISOString(),
      "description": post.excerpt,
      "author": {
        "@type": "Organization",
        "name": "ConverterForAll Team"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="relative border-b overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
        <div className="container relative mx-auto px-4 py-20 max-w-5xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 ring-1 ring-inset ring-primary/20">
            <BookOpen className="mr-2 h-4 w-4" />
            Learn & Discover
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            The ConverterForAll Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, guides, and tech news to help you work faster, secure your privacy, and master your digital files.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article 
              key={post.slug} 
              className={`group relative flex flex-col justify-between bg-card rounded-3xl border p-8 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden ${i === 0 ? 'md:col-span-2 lg:col-span-3 md:flex-row gap-8 lg:p-12' : ''}`}
            >
              <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
              
              <div className={`relative z-10 flex flex-col ${i === 0 ? 'md:justify-center' : ''}`}>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    <Tag className="mr-1.5 h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="inline-flex items-center text-sm text-muted-foreground font-medium">
                    <Clock className="mr-1.5 h-4 w-4" />
                    {post.date}
                  </span>
                </div>
                
                <h2 className={`font-bold mb-4 group-hover:text-primary transition-colors ${i === 0 ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
                  <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    {post.title}
                  </Link>
                </h2>
                
                <p className={`text-muted-foreground mb-8 ${i === 0 ? 'text-lg max-w-3xl' : ''}`}>
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-primary">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
