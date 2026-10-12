import { toolsDatabase, Tool } from "@/lib/tools-db";
import { ArrowLeft, ArrowRight, FileType, Layout, Image as ImageIcon, Settings, Combine, Scissors, Trash, FileOutput, Scan, Minimize, Wrench, FileText, Code2, KeyRound, Clock, Table, Database, Images, FileImage, PictureInPicture, Wand2, Eraser, Camera, Presentation, ShieldCheck, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
        desc: "Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.",
      },
      {
        title: "Clean Formatting",
        desc: "Convert Word, Excel, and PowerPoint presentations into standard PDFs while preserving tables, fonts, margins, and inline images.",
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
        a: "No. You can merge, split, or convert as many files as you need without daily quotas, cooldown timers, or watermarks.",
      },
      {
        q: "Will compressing a PDF make the text hard to read?",
        a: "Our compression tool optimizes high-resolution images and removes duplicate embedded font data while preserving sharp, vector text for clean readability and printing.",
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
        title: "Universal Format Support",
        desc: "Easily convert between WebP, PNG, JPG, AVIF, HEIC, and SVG so your images open smoothly on any computer or phone.",
      },
      {
        title: "On-Device AI Background Removal",
        desc: "Extract people, products, and objects onto transparent PNG backgrounds using client-side AI that processes directly in your browser.",
      },
      {
        title: "Biometric Passport Standards",
        desc: "Crop, resize, and frame photos to official biometric standards for passports, visas, and identification cards.",
      },
    ],
    faqs: [
      {
        q: "How does the background remover work without uploading my photos?",
        a: "We load a compact AI neural network directly into your browser using WebAssembly. The calculations run on your device's graphics processor, so your personal photos never leave your device.",
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
        a: "Because processing happens locally in your browser memory, you can compress large high-resolution camera photos without artificial size blocks.",
      },
    ],
  },
  fonts: {
    title: "Indic Regional Font to Unicode Converters",
    badge: "Indian Font Converters",
    intro: "For decades, Indian government departments, publishers, and typing institutes relied on legacy legacy fonts such as Kruti Dev, Chanakya, Devlys, Shusha, Asees, and Joy. When copied to modern websites, mobile apps, or new versions of Word, these fonts frequently display as garbled symbols or question marks. Our font tools convert your text into standard Unicode that displays accurately on every device.",
    points: [
      {
        title: "Universal Unicode Compatibility",
        desc: "Translate legacy Hindi, Punjabi, Bengali, and Urdu fonts into universal Unicode text that works on Google, WhatsApp, Facebook, and modern smartphones.",
      },
      {
        title: "Half-Character (Matra) Realignment",
        desc: "Fix displaced choti-ee matras, half-letters, and ra-padas that commonly break during font copy-pasting.",
      },
      {
        title: "Text Cleanup & Normalization",
        desc: "Remove non-breaking spaces, zero-width joiners, and hidden characters that cause typing test or official form rejections.",
      },
    ],
    faqs: [
      {
        q: "Why does my Kruti Dev or Chanakya text look like English gibberish?",
        a: "Legacy fonts remap English keyboard keys to Indian letter shapes. Without the custom font file installed, computers see ordinary English letters. Converting your text to Unicode gives each character a recognized standard code that renders everywhere.",
      },
      {
        q: "Which Hindi and Punjabi fonts can I convert?",
        a: "We support conversions for Kruti Dev (010, 011, etc.), Devlys, Chanakya, Shusha, APS, Shree Lipi, Asees, Satluj, Joy, Gurbani Akhar, and Raavi, plus Bengali Bijoy and Urdu InPage.",
      },
      {
        q: "Can I convert full book manuscripts or lengthy government reports?",
        a: "Yes. Our conversion scripts process thousands of words directly in your browser in milliseconds without truncating your paragraphs.",
      },
      {
        q: "Will my converted Hindi or Punjabi text work in official online application forms?",
        a: "Yes. All modern government portals (such as SSC, UPSC, and State Boards) require standard Unicode (Mangal/Nirmala UI), which is exactly what our tools produce.",
      },
    ],
  },
  exam: {
    title: "Sarkari Exam Photo, Signature & Document Resizer",
    badge: "Govt Exam Tools",
    intro: "Recruitment portals like SSC, UPSC, IBPS, Railways, NTA NEET, and State PSCs have strict upload specifications. Forms get rejected if photo dimensions, signature file sizes, DPI settings, or date stamps fail to match guidelines. These dedicated exam utilities format your photos and certificates to exact portal requirements in seconds.",
    points: [
      {
        title: "Photo Name & Date Imprinting",
        desc: "Add your full candidate name and date of photo taken onto your passport photo with official font styling and clean white borders.",
      },
      {
        title: "Exact Dimension & File Size Limits",
        desc: "Resize photos to 3.5cm x 4.5cm (20KB–50KB) and signatures to 10KB–20KB without blurriness or compression artifacts.",
      },
      {
        title: "100KB Document PDF Compression",
        desc: "Compress scanned marksheet PDFs, caste certificates, and domicile proofs below 100KB or 200KB for portal uploads.",
      },
    ],
    faqs: [
      {
        q: "How do I add my name and date of photo onto my passport picture?",
        a: "Open our Photo Name & Date Stamper, upload your photo, enter your candidate name and the date, and download the formatted photo ready for official portal upload.",
      },
      {
        q: "Why do exam portals reject signatures for being too large or too small?",
        a: "Most exam portals require signatures between 10KB and 20KB with exact 140x60 pixel dimensions. Our Exam Signature Resizer sets the precise pixel bounding box and adjusts quality to guarantee a match.",
      },
      {
        q: "What DPI setting do official exam portals require?",
        a: "Most competitive exams specify 200 DPI or 300 DPI for scanned photos and documents. Our Image DPI Converter adjusts embedded EXIF resolution headers without altering image quality.",
      },
      {
        q: "Are my Aadhaar, admit card, or certificate files safe to upload?",
        a: "Most of our tools run directly inside your browser so your documents stay on your device. We do not store, view, or retain your personal exam certificates or photographs.",
      },
    ],
  },
  developer: {
    title: "Data & Code Utilities for Developers",
    badge: "Developer Utilities",
    intro: "When inspecting JSON payloads, decoding JWT tokens, generating random UUIDs, or converting CSV tables into JSON objects, sending internal tokens or customer data to third-party cloud servers presents security risks. Our developer utilities run locally on your device for reliable offline inspection.",
    points: [
      {
        title: "Offline JWT Token Inspection",
        desc: "Decode token headers and payloads with formatted expiration dates without transmitting your JWT secret or bearer token over the internet.",
      },
      {
        title: "JSON Formatting & Validation",
        desc: "Quickly beautify, minify, and locate syntax errors in large JSON structures directly in browser memory.",
      },
      {
        title: "Data Table Conversions",
        desc: "Transform CSV rows into JSON objects or export structured JSON data to flat CSV spreadsheets in one click.",
      },
    ],
    faqs: [
      {
        q: "Is it safe to paste private JWT tokens or API responses here?",
        a: "Yes. All developer utilities run 100% on-device using client-side JavaScript. No network requests are made, and your tokens or data never leave your browser window.",
      },
      {
        q: "Can the JSON Formatter handle large payloads without crashing?",
        a: "Our formatter uses streaming browser parsers designed to process large payloads smoothly and highlight syntax errors immediately.",
      },
      {
        q: "Are the UUIDs generated cryptographically secure?",
        a: "Yes, our UUID generator uses the browser's native `crypto.randomUUID()` API conforming to RFC 4122 v4 standards.",
      },
      {
        q: "Can I convert Unix timestamps to readable dates?",
        a: "Yes, our Unix Timestamp Converter displays epoch seconds and milliseconds in UTC, local timezone, and relative human-readable formats.",
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
        title: "Audio Extraction & Format Swaps",
        desc: "Extract clean MP3 audio from MP4 videos or convert formats to AVI, MOV, WebM, and MKV without watermarks.",
      },
    ],
    faqs: [
      {
        q: "How does video compression work in the browser without uploading files?",
        a: "We utilize WebAssembly-compiled FFmpeg directly inside your browser. Your computer's processor compresses the video data locally, saving bandwidth and keeping your videos private.",
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
        a: "We support MP4, MOV, MKV, WebM, AVI, FLV, and WMV video containers.",
      },
    ],
  },
  audio: {
    title: "Audio Converters & Sound Trimmers",
    badge: "Audio Suite",
    intro: "Whether you need to convert an Apple voice memo or WhatsApp voice note into an MP3 file, or cut an audio interview to exact seconds, our audio tools process sound files cleanly in your browser without quality loss.",
    points: [
      {
        title: "Lossless Audio Trimming",
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
        a: "Yes, our converter uses high-bitrate encoding (up to 320 kbps) to ensure that speech, podcasts, and music retain rich acoustic clarity.",
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
    title: "Calculators, QR Tools & Everyday Utilities",
    badge: "Utility Suite",
    intro: "Quick, dependable mini-tools for day-to-day work: generate custom QR codes and barcodes for packaging, convert between metric and imperial measurements, calculate precise ages, or create strong passwords.",
    points: [
      {
        title: "Custom QR Code & Barcode Generator",
        desc: "Create scannable QR codes for websites, Wi-Fi networks, and contact vCards, or standard barcodes for inventory and books.",
      },
      {
        title: "Metric & Imperial Unit Conversions",
        desc: "Convert inches, feet, meters, centimeters, miles, and kilometers with exact precision.",
      },
      {
        title: "Age & Date Calculators",
        desc: "Calculate exact age down to years, months, days, and hours for official forms and resumes.",
      },
    ],
    faqs: [
      {
        q: "Are the generated QR codes permanent?",
        a: "Yes. The QR codes we generate encode the text or URL directly into the matrix, meaning they will never expire and do not depend on any third-party redirect link.",
      },
      {
        q: "Can I use generated barcodes for retail products?",
        a: "Yes, our generator supports Code128, EAN, and UPC formats suitable for inventory management, asset tagging, and retail packaging.",
      },
      {
        q: "Are the unit conversion calculations exact?",
        a: "Yes. All conversion factors follow international standard measurement tables with high decimal accuracy.",
      },
      {
        q: "Can I use these tools on mobile phones?",
        a: "All utilities are fully responsive and touch-friendly, allowing quick calculations on smartphones and tablets.",
      },
    ],
  },
};

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
  const displaySubtitle = editorial?.intro ? editorial.intro.slice(0, 160) : `Free, private in-browser tools to convert and manage ${categorySlug} files without installing software.`;

  return {
    title: `${displayTitle} - Free In-Browser Tools | ConverterForAll`,
    description: displaySubtitle,
    openGraph: {
      title: `${displayTitle} - Free In-Browser Tools | ConverterForAll`,
      description: displaySubtitle,
      type: "website",
      url: `https://www.converterforall.com/category/${resolvedParams.slug}`,
    },
    alternates: {
      canonical: `https://www.converterforall.com/category/${resolvedParams.slug}`,
    }
  };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let categorySlug = params.slug;

  if (categorySlug === "data-code" || categorySlug === "data-tools") {
    categorySlug = "developer";
  }

  const categoryData = (toolsDatabase as any)[categorySlug];

  if (!categoryData) {
    notFound();
  }

  const editorial = CATEGORY_EDITORIAL_DATA[categorySlug] || {
    title: categorySlug === "developer" ? "Data & Code Tools" : `${categorySlug} Tools`,
    badge: "File Utilities",
    intro: `Manage and convert your ${categorySlug} files in one secure, in-browser toolkit without uploading files to third-party servers.`,
    points: [
      {
        title: "In-Browser Privacy",
        desc: "Most of our tools run directly inside your browser so your documents stay on your device.",
      },
      {
        title: "No Daily Limits",
        desc: "Convert as many files as you need without watermarks or subscription walls.",
      },
      {
        title: "Universal Compatibility",
        desc: "Works smoothly on Windows, Mac, Linux, Android, and iOS devices.",
      },
    ],
    faqs: [
      {
        q: "Are these tools free to use?",
        a: "Yes. All tools in this category are completely free with no daily limits or sign-up requirements.",
      },
      {
        q: "Are my files uploaded to any servers?",
        a: "Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.",
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

  // Build JSON-LD structured data for CollectionPage and FAQPage
  const toolItemList = Object.keys(categoryData).map((toolSlug, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": categoryData[toolSlug].title,
    "url": `https://www.converterforall.com/${toolSlug}`,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": editorial.title,
    "description": editorial.intro,
    "url": `https://www.converterforall.com/category/${categorySlug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": toolItemList,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.converterforall.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": editorial.title,
        "item": `https://www.converterforall.com/category/${categorySlug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": editorial.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

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
                Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.
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
