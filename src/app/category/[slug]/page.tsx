import { toolsDatabase, Tool } from "@/lib/tools-db";
import { ArrowLeft, FileType, Layout, Image as ImageIcon, Combine, Scissors, Wrench, FileText, Code2, KeyRound, Eraser, Camera, Presentation, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NOINDEX_CATEGORIES } from "@/config/sitemap-lastmod";
import { SITE_ORIGIN } from "@/lib/seo/site-config";
import { buildCollectionPageSchema, buildBreadcrumbSchema, buildFaqPageSchema } from "@/lib/seo/schema-builders";

function getIconComponent(iconName: string, className: string = "h-6 w-6") {
  switch(iconName) {
    case "Code2": return <Code2 className={className} />;
    case "Eraser": return <Eraser className={className} />;
    case "Camera": return <Camera className={className} />;
    case "FileStack": return <Combine className={className} />;
    case "Scissors": return <Scissors className={className} />;
    case "Zap": return <Layout className={className} />;
    case "Lock": return <KeyRound className={className} />;
    case "Unlock": return <KeyRound className={className} />;
    case "Image": return <ImageIcon className={className} />;
    case "FileText": return <FileText className={className} />;
    case "Presentation": return <Presentation className={className} />;
    case "FileSpreadsheet": return <FileType className={className} />;
    case "FileCode": return <Code2 className={className} />;
    case "Video": return <Layout className={className} />;
    case "Music": return <Layout className={className} />;
    case "Type": return <FileType className={className} />;
    case "Wrench": default: return <Wrench className={className} />;
  }
}

function getThemeStyles(theme?: string) {
  switch(theme) {
    case "cyan": return "from-cyan-500 to-blue-500 text-cyan-50 bg-cyan-500/10 ring-cyan-500/30";
    case "purple": return "from-purple-500 to-pink-500 text-purple-50 bg-purple-500/10 ring-purple-500/30";
    case "amber": return "from-amber-400 to-orange-500 text-amber-50 bg-amber-500/10 ring-amber-500/30";
    case "orange": return "from-orange-400 to-red-500 text-orange-50 bg-orange-500/10 ring-orange-500/30";
    case "pink": return "from-pink-400 to-rose-500 text-pink-50 bg-pink-500/10 ring-pink-500/30";
    case "teal": return "from-teal-400 to-emerald-500 text-teal-50 bg-teal-500/10 ring-teal-500/30";
    case "yellow": return "from-yellow-400 to-amber-500 text-yellow-50 bg-yellow-500/10 ring-yellow-500/30";
    case "blue": return "from-blue-500 to-indigo-500 text-blue-50 bg-blue-500/10 ring-blue-500/30";
    case "red": return "from-red-500 to-rose-500 text-red-50 bg-red-500/10 ring-red-500/30";
    case "emerald": return "from-emerald-400 to-teal-500 text-emerald-50 bg-emerald-500/10 ring-emerald-500/30";
    case "sky": return "from-sky-400 to-blue-500 text-sky-50 bg-sky-500/10 ring-sky-500/30";
    case "slate": default: return "from-slate-500 to-slate-600 text-slate-50 bg-slate-500/10 ring-slate-500/30";
  }
}

interface CategoryEditorial {
  title: string;
  badge: string;
  intro: string;
  points: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const CATEGORY_EDITORIAL_DATA: Record<string, CategoryEditorial> = {
  document: {
    title: "PDF & Office Document Converters",
    badge: "Document Suite",
    intro: "Managing multiple documents across work and school can be frustrating when file sizes exceed email limits, pages end up scrambled, or formatting breaks when converting between formats. ConverterForAll lets you merge, split, compress, and organize PDFs and Office files with minimal effort.",
    points: [
      {
        title: "In-Browser Privacy",
        desc: "Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in temporary memory without permanent server storage.",
      },
      {
        title: "Clean Formatting",
        desc: "Office conversion behavior depends on the format and engine. The Excel tool currently exports the first XLSX worksheet as a simple table rather than reproducing the full workbook layout.",
      },
      {
        title: "Sensitive Metadata Removal",
        desc: "Strip hidden author tags, editing history, printer details, and GPS location markers from PDF files before sharing them publicly.",
      },
    ],
    faqs: [
      {
        q: "Do I have to upload my PDFs to an external server?",
        a: "Most of our PDF tools, including merge, split, rotate, organize, and metadata removal, execute directly on your computer or phone using WebAssembly. Your files never travel across the internet.",
      },
      {
        q: "Is there a daily limit on how many documents I can merge or convert?",
        a: "No artificial daily limit is imposed on standard usage. Because processing runs in your browser, very large batches are subject only to available device memory.",
      },
      {
        q: "Will compressing a PDF make the text hard to read or unselectable?",
        a: "It depends on the compression method used. Fixed-size target compressors (like Compress PDF to 100KB) rasterize pages into images, which turns text into pixels and makes it non-selectable. In contrast, standard structural optimization retains crisp vector text while optimizing embedded images. Check the output on text-heavy pages before submitting.",
      },
      {
        q: "Can I convert scanned PDFs into editable text?",
        a: "Yes, our OCR tool recognizes text in scanned PDFs and images so you can easily copy and edit it in Word or text editors.",
      },
    ],
  },
  image: {
    title: "Image Converters & Photo Optimizers",
    badge: "Image Suite",
    intro: "Modern websites and smartphones save pictures in formats like WebP, HEIC, and AVIF, which older software or government upload portals often reject. Our image tools convert, compress, resize, and edit your pictures securely in seconds.",
    points: [
      {
        title: "Common Format Support",
        desc: "Easily convert between WebP, PNG, JPG, AVIF, HEIC, and SVG so your images open smoothly on any computer or phone.",
      },
      {
        title: "On-Device AI Background Removal",
        desc: "Extract people, products, and objects onto transparent PNG backgrounds using client-side AI that processes directly in your browser.",
      },
      {
        title: "Standard Photo Cropping",
        desc: "Crop and resize photos to common standard specifications (such as 2x2 inches or 35x45 mm) for passports, visas, and exam forms. Always review your official portal guidelines for exact background color and face-ratio requirements.",
      },
    ],
    faqs: [
      {
        q: "How does the background remover work without uploading my photos?",
        a: "It runs directly in your browser using client-side WebAssembly models (such as ISNet via @imgly/background-removal) executing in a web worker on your device. The image calculations run in local memory, so your photos do not leave your device.",
      },
      {
        q: "Can I convert iPhone HEIC photos to JPG on Windows or Android?",
        a: "Yes. Simply drop your .heic or .heif files into our HEIC to JPG tool, and they will convert directly in your browser without requiring extra software.",
      },
      {
        q: "Will converting WebP to PNG keep transparent backgrounds intact?",
        a: "Yes, our WebP to PNG converter fully preserves transparent alpha channels, making it easy to use graphics in presentations and websites.",
      },
      {
        q: "Are there any file size limits for image compression?",
        a: "Because processing happens locally in your browser memory, high-resolution camera photos can be compressed directly up to available system RAM.",
      },
    ],
  },
  fonts: {
    title: "Indic Regional Font Converters",
    badge: "Indian Font Converters",
    intro: "Legacy Indian-script fonts such as Kruti Dev, Asees, Satluj, Joy, and Gurbani Akhar may store text using font-specific character mappings. When text is opened without the original font or copied into modern apps, it can appear as Latin characters or render incorrectly. The converters listed here cover selected source and target formats; support differs by font and direction, so check each tool's notice and review the converted text before relying on it.",
    points: [
      {
        title: "Selected Regional Font Mappings",
        desc: "The directory includes selected converters for Hindi, Punjabi, Bengali, and Urdu workflows. Each tool page identifies its source and target format; availability, mapping coverage, and reversibility differ between fonts and directions.",
      },
      {
        title: "Half-Character (Matra) Realignment",
        desc: "Some converters reorder pre-base vowel signs and other characters where the font mapping requires it. Check the output against the source, especially for names, numbers, and punctuation.",
      },
      {
        title: "Text Cleanup & Normalization",
        desc: "Separate Unicode cleanup tools can normalize text or remove selected invisible characters. These are separate operations from converting a legacy font encoding.",
      },
    ],
    faqs: [
      {
        q: "Why does legacy font text look like English gibberish?",
        a: "Many legacy fonts use font-specific character mappings, so text may look like Latin characters when opened without the original font. Unicode is widely supported across modern systems, but the correct glyph still depends on the fonts available on the receiving device.",
      },
      {
        q: "Which Hindi and Punjabi fonts can I convert?",
        a: "The directory currently lists individual routes for formats including Kruti Dev, Asees, Satluj, Joy, AnmolLipi, and Gurbani Akhar. Support is not uniform across every font or both directions; check the relevant tool page for its availability and any experimental-use notice.",
      },
      {
        q: "Can I convert full book manuscripts or lengthy government reports?",
        a: "You can paste multi-paragraph text, but practical input size and processing speed depend on your browser and device. For a long manuscript, test a representative sample first and compare the output with the source.",
      },
      {
        q: "Will my converted Hindi or Punjabi text work in official online application forms?",
        a: "Unicode is generally more portable between modern applications, but each recruitment portal or typing examination can specify its own language, keyboard layout, font, or file requirements. Check the current official instructions before submitting converted text.",
      },
    ],
  },
  exam: {
    title: "Exam Photo & Signature Preparation Tools",
    badge: "Exam Image Utilities",
    intro: "These browser-based tools help crop, clean, stamp, and compress images or PDFs for application uploads. Preset values are starting points only: recruitment bodies can change their requirements between examinations and notifications. Always follow the current official notice.",
    points: [
      {
        title: "Crop and Resize Photos",
        desc: "Choose a reference aspect ratio and file-size range for a photo. The cropper does not set fixed physical dimensions or certify that the result meets a specific portal's current requirements.",
      },
      {
        title: "Clean and Resize Signatures",
        desc: "Adjust a signature crop, background threshold, and target file-size range. Check the downloaded image's actual dimensions and file size before uploading.",
      },
      {
        title: "Compress Supporting PDFs",
        desc: "Create a smaller rasterized PDF with a chosen size target. Strong compression can reduce text and image clarity, so inspect every page before using the output.",
      },
    ],
    faqs: [
      {
        q: "Are the exam presets official and always up to date?",
        a: "No. They are editable reference settings, not live portal requirements. The latest examination notification and upload instructions take precedence.",
      },
      {
        q: "Does the photo or signature tool guarantee the target file size?",
        a: "No. The tools try compression settings and show the resulting file size, but cannot guarantee that every image will fit the selected range or be accepted by a portal. Check the output before submission.",
      },
      {
        q: "Does the DPI tool change image resolution or add detail?",
        a: "No. It changes density metadata in supported JPEG and PNG files. It does not resample the image, increase its pixel dimensions, or add visual detail.",
      },
      {
        q: "Are the selected photos uploaded to a conversion API?",
        a: "The photo and signature resizers process the selected image in the browser using canvas operations; they do not send it to a file-conversion API. The website may still load its normal page resources and analytics.",
      },
    ],
  },
  developer: {
    title: "Data & Code Utilities for Developers",
    badge: "Developer Utilities",
    intro: "Format JSON, inspect the readable parts of a JWT, convert JSON and CSV, and generate identifiers in the browser. These tools are useful for quick client-side checks, but they are not a substitute for secure server-side validation or production security review.",
    points: [
      {
        title: "JWT Header and Payload Inspection",
        desc: "Decode the Base64URL header and payload locally in JavaScript. Decoding does not verify a token signature, validate its trust chain, or establish that its claims are authentic.",
      },
      {
        title: "JSON Formatting and Validation",
        desc: "Use the browser's JSON parser to format and check JSON syntax. Large inputs are limited by available browser memory and are not handled by a streaming parser.",
      },
      {
        title: "JSON, CSV, and UUID Utilities",
        desc: "Convert supported JSON and CSV text locally, and generate UUIDs with the browser's crypto API where available. Review exported data for quoting, nested fields, and type conversions.",
      },
    ],
    faqs: [
      {
        q: "Does the JWT decoder verify my token?",
        a: "No. It decodes the header and payload for inspection only. It does not verify the signature, issuer, audience, or authorization status. Never treat decoded claims as proof that a token is valid.",
      },
      {
        q: "Is my pasted token sent to a verification server?",
        a: "The JWT decoder reads and parses the token in browser JavaScript; it does not call a backend token-verification API. Avoid pasting production credentials into websites unless you have reviewed and trust their privacy and security practices.",
      },
      {
        q: "Can the JSON formatter process unlimited or very large data?",
        a: "No. Formatting uses the browser's standard JSON parser, so practical input size depends on device memory and browser performance.",
      },
      {
        q: "Are generated UUIDs random?",
        a: "Where supported, the UUID tool uses the browser's crypto.randomUUID() API to generate version 4 UUIDs. Check the tool's browser compatibility if that API is unavailable.",
      },
    ],
  },
  video: {
    title: "Video Compression, Captions & Conversion",
    badge: "Video Suite",
    intro: "Video files from modern cameras and phones are often too large to attach to emails, share on Discord without Nitro, or upload to messaging apps. ConverterForAll lets you compress video files, generate timed AI subtitles, and convert formats directly on your device.",
    points: [
      {
        title: "Targeted Platform Compression",
        desc: "Preset size targets for Discord (under 25MB or 10MB), WhatsApp (under 16MB), and email attachments (under 25MB).",
      },
      {
        title: "AI Caption & Subtitle Generator",
        desc: "Generate accurate, timed subtitle text and burned-in captions for Hindi, English, and multilingual videos in your browser.",
      },
      {
        title: "Audio Extraction & MP4 Export",
        desc: "Extract clean MP3 audio from video clips or re-encode supported video inputs into web-ready MP4 files without watermarks.",
      },
    ],
    faqs: [
      {
        q: "How does video processing work in the browser without uploading files?",
        a: "Video compression and subtitle processing run directly in your browser using client-side WebAssembly and modern browser media APIs. Your device handles the encoding calculations locally so your video files stay on your computer or phone.",
      },
      {
        q: "Will compressing a video add a watermark to my output file?",
        a: "No. None of our tools ever place watermarks, branding, or logo overlays onto your videos.",
      },
      {
        q: "Can I export subtitle files like SRT and VTT?",
        a: "Yes, our Video Caption Generator allows you to edit captions directly and export either an .srt file or an MP4 video with embedded subtitles.",
      },
      {
        q: "What video formats are supported?",
        a: "Our video tools accept common video containers including MP4, MOV, WebM, MKV, and AVI. Processed videos are exported as standard MP4 (H.264 video with AAC audio) for broad cross-platform playback compatibility.",
      },
    ],
  },
  audio: {
    title: "Audio Converters & Sound Trimmers",
    badge: "Audio Suite",
    intro: "Whether you need to convert an Apple voice memo or WhatsApp voice note into an MP3 file, or cut an audio interview to exact seconds, our audio tools let you trim and convert sound files directly in your browser.",
    points: [
      {
        title: "Precision Audio Trimming",
        desc: "Cut music tracks, ringtones, or podcast clips with millisecond waveform precision directly in your browser.",
      },
      {
        title: "Voice Note Conversion",
        desc: "Convert WhatsApp voice notes (.opus) and voice memos into universal MP3 files that play anywhere.",
      },
      {
        title: "Format Flexibility",
        desc: "Convert between MP3, WAV, OGG, and AAC formats for optimal sound quality and small file sizes.",
      },
    ],
    faqs: [
      {
        q: "How do I convert a WhatsApp voice note to MP3?",
        a: "Save the voice note from WhatsApp to your phone or computer, open our Voice Note to MP3 converter, drop the file, and download the MP3 file immediately.",
      },
      {
        q: "Is sound quality preserved when converting from WAV to MP3?",
        a: "WAV is an uncompressed lossless format, whereas MP3 uses lossy compression that permanently discards acoustic frequencies that are difficult for the human ear to detect. While high-bitrate MP3 encoding (up to 320 kbps) retains strong perceptual clarity for casual listening and voice notes, it is not bit-for-bit lossless.",
      },
      {
        q: "Do my audio recordings get saved on a server?",
        a: "No. Most of our tools run directly inside your browser so your documents and voice recordings stay on your device.",
      },
      {
        q: "Can I use the audio trimmer to make ringtones?",
        a: "Yes. You can zoom into the waveform, set start and end points down to a fraction of a second, and download your trimmed MP3 clip.",
      },
    ],
  },
  utilities: {
    title: "Calculators, QR Codes & Everyday Utilities",
    badge: "Utility Tools",
    intro: "Create QR codes and barcodes, convert common units, and use simple date or calculation utilities. Check the generated result and confirm that it suits your intended use before printing or sharing it.",
    points: [
      {
        title: "QR Code Generation",
        desc: "Encode a URL or text directly in a QR code. The QR image itself does not expire, but an encoded website or service can move, change, or stop working.",
      },
      {
        title: "Barcode Generation",
        desc: "Create supported barcode formats for testing and internal workflows. Retail product identification and point-of-sale use may require a properly assigned GS1 identifier; a generated symbol alone does not grant one.",
      },
      {
        title: "Unit and Date Calculations",
        desc: "Convert common units and calculate dates using standard JavaScript arithmetic. Display rounding and timezone settings can affect how a result is presented.",
      },
    ],
    faqs: [
      {
        q: "Will a generated QR code ever expire?",
        a: "The QR image has no built-in expiry date. However, if it contains a URL, the destination website or page may change or become unavailable.",
      },
      {
        q: "Can I use a generated barcode on products for retail sale?",
        a: "The tool can create supported barcode symbols, but commercial product identification may require a licensed or assigned GS1 identifier. Confirm the applicable standards before printing product packaging.",
      },
      {
        q: "Are unit conversion results exact?",
        a: "The tools use standard conversion factors, but displayed values may be rounded. Use the full precision or a specialist reference where the calculation is safety-critical or legally significant.",
      },
      {
        q: "Do these utilities work on mobile devices?",
        a: "The pages are designed to be responsive, but camera access and some browser APIs depend on device, browser, and permission support.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(toolsDatabase).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let categorySlug = resolvedParams.slug;

  if (categorySlug === "data-code" || categorySlug === "data-tools") {
    categorySlug = "developer";
  }

  const categoryData = toolsDatabase[categorySlug];
  
  if (!categoryData) {
    return { title: "Category Not Found" };
  }

  const editorial = CATEGORY_EDITORIAL_DATA[categorySlug];
  const displayTitle = editorial?.title || (categorySlug === "developer" ? "Data & Code Tools" : `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Tools`);
  const displaySubtitle = categorySlug === "fonts"
    ? "Convert supported legacy Hindi and Punjabi font text to Unicode, or Unicode to listed legacy fonts. Check each tool page for direction and experimental support."
    : editorial?.intro
      ? editorial.intro.slice(0, 160)
      : `Free tools to manage and convert ${categorySlug} files. Most tools run directly in your browser without software installation.`;
  const canonicalUrl = `${SITE_ORIGIN}/category/${categorySlug}`;
  const isNoindex = NOINDEX_CATEGORIES.includes(categorySlug as (typeof NOINDEX_CATEGORIES)[number]);

  return {
    title: `${displayTitle} - Free In-Browser Tools | ConverterForAll`,
    description: displaySubtitle,
    robots: isNoindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${displayTitle} - Free In-Browser Tools | ConverterForAll`,
      description: displaySubtitle,
      type: "website",
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    }
  };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let categorySlug = params.slug;

  if (categorySlug === "data-code" || categorySlug === "data-tools") {
    categorySlug = "developer";
  }

  const categoryData = (toolsDatabase as Record<string, Record<string, Tool>>)[categorySlug];

  if (!categoryData) {
    notFound();
  }

  const editorial = CATEGORY_EDITORIAL_DATA[categorySlug] || {
    title: categorySlug === "developer" ? "Data & Code Tools" : `${categorySlug} Tools`,
    badge: "File Utilities",
    intro: `Explore our collection of ${categorySlug} tools. Check each tool page for supported formats, processing locations, and specific options.`,
    points: [
      {
        title: "Browser-First Architecture",
        desc: "Most tools run directly inside your browser. Where external services or cloud options are required, they are disclosed per tool.",
      },
      {
        title: "No Account Required",
        desc: "Use available tools without registering an account, providing an email, or encountering forced watermarks.",
      },
      {
        title: "Cross-Platform Access",
        desc: "Designed to run across modern desktop and mobile web browsers with standard web standards.",
      },
    ],
    faqs: [
      {
        q: "Are these tools free to use?",
        a: "Yes. All tools in this category are completely free with no daily limits or sign-up requirements.",
      },
      {
        q: "Are my files uploaded to any servers?",
        a: "Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and discarded once conversion finishes.",
      },
    ],
  };

  // Group tools by subCategory
  const groupedTools: Record<string, Array<{slug: string, title: string, description: string, theme?: string, iconName?: string}>> = {};
  
  (Object.entries(categoryData) as [string, Tool][]).forEach(([slug, tool]) => {
    const groupName = tool.subCategory || "All Tools";
    if (!groupedTools[groupName]) {
      groupedTools[groupName] = [];
    }
    groupedTools[groupName].push({
      slug,
      title: tool.title,
      description: tool.description,
      theme: tool.theme,
      iconName: tool.iconName,
    });
  });

  const groups = Object.keys(groupedTools);
  const showGroupHeaders = !(groups.length === 1 && (groups[0] === "All Tools" || groups[0] === "Other Tools"));

  // Build JSON-LD structured data via shared schema builders
  const collectionSchema = buildCollectionPageSchema({
    name: editorial.title,
    description: editorial.intro,
    url: `${SITE_ORIGIN}/category/${categorySlug}`,
    tools: Object.entries(categoryData).map(([toolSlug, tool]) => ({
      name: tool.title,
      url: `${SITE_ORIGIN}/${toolSlug}`,
      description: tool.description
    }))
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_ORIGIN, position: 1 },
    { name: editorial.title, url: `${SITE_ORIGIN}/category/${categorySlug}`, position: 2 }
  ]);

  const faqSchema = buildFaqPageSchema(editorial.faqs.map(faq => ({ question: faq.q, answer: faq.a })));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Premium Header Section */}
      <div className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-b from-blue-50/50 to-slate-50 dark:from-[#080e22] dark:to-background border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center flex flex-col items-center">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors bg-white/80 dark:bg-[#0c1630]/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
            <span>{editorial.badge}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            {editorial.title}
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {editorial.intro}
          </p>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-10 md:mt-12">
        <div className="space-y-12 md:space-y-16">
          {groups.map((groupName) => (
            <div key={groupName}>
              {showGroupHeaders && (
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">{groupName}</h2>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {groupedTools[groupName].map((tool) => {
                  const colorConfig = getThemeStyles(tool.theme);
                  const [gradientFrom, gradientTo] = colorConfig.split(' ');
                  
                  return (
                    <Link 
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="group flex flex-col items-center text-center rounded-[24px] bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800/80 p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 relative overflow-hidden hover:-translate-y-1"
                    >
                      {/* Vibrant background glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradientFrom} ${gradientTo} pointer-events-none`} />

                      {/* Large App-Style Icon */}
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] mb-4 flex items-center justify-center shadow-sm bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white ring-1 ring-white/20 dark:ring-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                        {getIconComponent(tool.iconName || "Settings")}
                      </div>

                      <h3 className="font-bold text-[14px] md:text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight relative z-10 w-full line-clamp-2">
                        {(() => {
                          let clean = tool.title.replace(/^Convert /i, "");
                          if (clean.includes(" – ")) clean = clean.split(" – ")[0];
                          else if (clean.includes(" - ")) clean = clean.split(" - ")[0];
                          else if (clean.includes(" — ")) clean = clean.split(" — ")[0];
                          clean = clean.replace(/^Free Online /i, "");
                          return clean.trim();
                        })()}
                      </h3>
                      
                      <p className="hidden md:block text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 relative z-10">
                        {tool.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Informative Educational Deep-Dive */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-12">
          
          {/* Key Advantages Grid */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Why use ConverterForAll for {editorial.title.toLowerCase()}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {editorial.points.map((pt, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{pt.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Standardized In-Browser Privacy
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in temporary memory without permanent server storage.
              </p>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {editorial.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
