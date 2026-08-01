const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'src', 'app', 'blog');
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// Blog Index Page
const indexCode = `import Link from "next/link";
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
              <Link href={\`/blog/\${post.slug}\`}>
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
`;

fs.writeFileSync(path.join(basePath, 'page.tsx'), indexCode);

// Blog Post Slug Directory
const slugPath = path.join(basePath, '[slug]');
if (!fs.existsSync(slugPath)) {
  fs.mkdirSync(slugPath, { recursive: true });
}

const postCode = `import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

// Mock Database for Blog Posts
const blogDatabase: Record<string, { title: string, content: string, date: string, category: string }> = {
  "how-to-remove-image-backgrounds-for-ecommerce": {
    title: "How to Remove Image Backgrounds for E-Commerce",
    date: "August 1, 2026",
    category: "Conversion Guides",
    content: \`
      <p>In the competitive world of e-commerce, product presentation is everything. Shoppers rely entirely on visual cues to assess the quality of a product, making high-quality, professional photography essential.</p>
      <h2>Why Backgrounds Matter</h2>
      <p>A cluttered background distracts the eye and makes a product look cheap. The industry standard for platforms like Amazon and Shopify is a pure white or fully transparent background. This not only looks clean but allows you to seamlessly integrate the product image into various marketing materials, banners, and digital ads.</p>
      <h2>The Easy Way to Isolate Products</h2>
      <p>Traditionally, removing a background required expensive software and advanced skills with a 'pen tool' to manually trace the item. Today, AI has completely revolutionized this workflow.</p>
      <p>By using our <a href="/remove-background">Remove Background tool</a>, you can achieve pixel-perfect cutouts in seconds. Our AI is specifically trained to recognize product edges—even tricky elements like transparent glass or fine fibers.</p>
      <h2>Step-by-step Optimization</h2>
      <ol>
        <li>Take your product photo in well-lit conditions, preferably with a contrasting background.</li>
        <li>Upload the photo to the background remover.</li>
        <li>Download the resulting transparent PNG.</li>
        <li>(Optional) Use our <a href="/png-to-jpg">PNG to JPG converter</a> to convert the transparent image to a solid white JPG for faster loading times on your storefront.</li>
      </ol>
      <p>By optimizing your imagery, you can significantly boost your conversion rates and build trust with your customers.</p>
    \`
  },
  "why-client-side-conversion-is-the-future": {
    title: "Why Client-Side Conversion is the Future of Privacy",
    date: "July 25, 2026",
    category: "Technology",
    content: \`
      <p>For over a decade, online file conversion has followed a simple, flawed model: you upload your file to a remote server, wait in a queue, the server converts the file, and then you download it back.</p>
      <h2>The Privacy Problem</h2>
      <p>This model is inherently insecure. Every time you upload a tax document, a confidential business contract, or a personal photo to a third-party server, you are placing immense trust in their infrastructure. Data breaches, insecure storage, and aggressive data mining policies mean your private files could be exposed.</p>
      <h2>Enter Client-Side Processing</h2>
      <p>With the advent of WebAssembly (WASM) and modern Web APIs, we can now run complex software directly inside your web browser. This means the conversion engine is downloaded to your device, and the processing happens on your local CPU and GPU.</p>
      <ul>
        <li><strong>Zero Uploads:</strong> Your files never leave your device. They are not transmitted across the internet.</li>
        <li><strong>Instant Processing:</strong> Without network latency or server queues, conversions happen in milliseconds.</li>
        <li><strong>Unhackable:</strong> Since there is no centralized database holding user files, there is nothing for hackers to steal.</li>
      </ul>
      <p>At ConverterForAll, our <a href="/word-to-pdf">Word to PDF converter</a> and <a href="/remove-background">Image utilities</a> are pioneering this client-side revolution, ensuring your sensitive data remains yours alone.</p>
    \`
  },
  "word-to-pdf-formatting-tips": {
    title: "5 Tips for Preserving Word Formatting when Converting to PDF",
    date: "July 12, 2026",
    category: "Productivity",
    content: \`
      <p>Converting a Microsoft Word document to a PDF is usually a seamless process, but sometimes complex formatting can get lost in translation. Here are five pro-tips to ensure your final PDF looks exactly like your original draft.</p>
      <h2>1. Embed Your Fonts</h2>
      <p>If you use a custom or non-standard font, the conversion engine might substitute it with a generic one if it can't find it. In Word, go to Options > Save, and check "Embed fonts in the file". This packages the font data directly into the .docx file.</p>
      <h2>2. Use Page Breaks, Not Enter Keys</h2>
      <p>Don't press "Enter" repeatedly to force text onto a new page. This often leads to awkward spacing issues during conversion. Instead, use the official Page Break feature (Ctrl+Enter or Cmd+Enter) to ensure precise pagination.</p>
      <h2>3. Anchor Your Images</h2>
      <p>Images that are set to "In Line with Text" convert much more reliably than floating images. If you must have text wrap around an image, ensure the image is properly anchored to a specific paragraph.</p>
      <h2>4. Standardize Your Margins</h2>
      <p>Ensure your page size (e.g., A4 or Letter) and margins are explicitly set in the document properties. Relying on default printer settings can cause unexpected wrapping.</p>
      <h2>5. Use a Reliable Converter</h2>
      <p>Not all converters are created equal. Our <a href="/word-to-pdf">Word to PDF tool</a> uses advanced layout reconstruction algorithms to ensure high fidelity between your original document and the generated PDF.</p>
    \`
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogDatabase[resolvedParams.slug];
  
  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: \`\${post.title} | ConverterForAll Blog\`,
    description: post.content.substring(0, 150).replace(/<[^>]+>/g, '') + '...',
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
    </div>
  );
}
`;

fs.writeFileSync(path.join(slugPath, 'page.tsx'), postCode);
console.log("Blog system created successfully.");
