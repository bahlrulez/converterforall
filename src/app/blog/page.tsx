import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Conversion Guides & Tech News",
  description: "Read the latest articles on file conversion, productivity, and tech trends from ConverterForAll.",
};

const posts = [
  {
    slug: "how-to-remove-image-backgrounds-for-ecommerce",
    title: "How to Remove Image Backgrounds for E-Commerce",
    date: "August 1, 2026",
    excerpt: "Learn the easiest and fastest way to optimize your product photos by removing messy backgrounds.",
    category: "Conversion Guides"
  },
  {
    slug: "why-client-side-conversion-is-the-future",
    title: "Why Client-Side Conversion is the Future of Privacy",
    date: "July 25, 2026",
    excerpt: "Discover how processing files locally in your browser protects your sensitive data from hackers.",
    category: "Technology"
  },
  {
    slug: "word-to-pdf-formatting-tips",
    title: "5 Tips for Preserving Word Formatting when Converting to PDF",
    date: "July 12, 2026",
    excerpt: "Ensure your resumes and contracts look perfect on every device by following these simple formatting rules.",
    category: "Productivity"
  }
];

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Blog</h1>
      <p className="text-xl text-muted-foreground mb-12">Insights, guides, and news from the ConverterForAll team.</p>
      
      <div className="grid gap-8">
        {posts.map(post => (
          <article key={post.slug} className="group relative border rounded-2xl p-6 hover:shadow-md transition-all hover:border-primary/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">{post.category}</span>
              <span className="text-sm text-muted-foreground">{post.date}</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>
                <span className="absolute inset-0"></span>
                {post.title}
              </Link>
            </h2>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
