import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "datePublished": new Date(post.date).toISOString(),
            "author": {
              "@type": "Organization",
              "name": "ConverterForAll"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ConverterForAll",
              "logo": {
                "@type": "ImageObject",
                "url": "https://converterforall.com/favicon.ico"
              }
            }
          })
        }}
      />
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          {post.title}
        </h1>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      <div className="mt-16 pt-8 border-t">
        <h3 className="text-lg font-bold mb-4">About the Author</h3>
        <AuthorProfile />
      </div>
    </div>
  );
}
