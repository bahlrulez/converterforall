import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { posts } from "@/lib/blog-data";
import { BlogCard } from "./blog-card";

export const metadata: Metadata = {
  title: "Blog & Conversion Guides | ConverterForAll",
  description: "Read the latest articles on file conversion, productivity, tech trends, and privacy from the ConverterForAll team.",
  alternates: {
    canonical: "https://converterforall.com/blog",
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
    "blogPost": sortedPosts.map(post => ({
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background ambient light */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="relative border-b border-border/40 overflow-hidden bg-background/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container relative mx-auto px-4 py-24 max-w-5xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-8 ring-1 ring-inset ring-primary/20 shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-shadow duration-500 cursor-default">
            <BookOpen className="mr-2 h-4 w-4 animate-pulse" />
            Learn & Discover
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-secondary animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The ConverterForAll Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Insights, guides, and tech news to help you work faster, secure your privacy, and master your digital files.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
