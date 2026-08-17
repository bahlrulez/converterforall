"use client";

import { useState, useMemo } from "react";
import { ChevronDown, HelpCircle, Sparkles, Shield, Type, FileText, Image, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: "General & Privacy" | "Fonts & Exams" | "PDF & Documents" | "Image & Media";
  badge?: string;
}

export function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    // GENERAL & PRIVACY
    {
      question: "Is it safe to use online converters for passport photos, Aadhaar cards, and bank documents?",
      answer: "Yes, ConverterForAll is 100% safe because it processes your files entirely within your own web browser using local WebAssembly (WASM) and JavaScript. Unlike traditional converters that upload your personal documents to unknown remote servers, your files never leave your computer or phone. This guarantees total privacy and zero data exposure for sensitive identity cards, tax forms, and personal photographs.",
      category: "General & Privacy",
      badge: "100% Private",
    },
    {
      question: "How does ConverterForAll use WebGPU and WebGL hardware acceleration?",
      answer: "ConverterForAll utilizes the latest WebGPU and WebGL browser standards to offload heavy computational tasks directly to your graphics card (GPU). For tasks like AI background removal and video sequence extraction, this delivers up to 10x faster processing speeds, keeps your CPU cool, and eliminates waiting in queues.",
      category: "General & Privacy",
      badge: "WebGPU / WebGL",
    },
    {
      question: "What happens if my phone or browser does not support WebGPU?",
      answer: "ConverterForAll features an intelligent zero-error automatic fallback pipeline. If your device or browser does not support WebGPU, the application automatically and seamlessly switches to hardware-accelerated WebGL or multi-threaded CPU WebAssembly (WASM SIMD) with zero interruption or errors.",
      category: "General & Privacy",
      badge: "Smart Fallback",
    },
    {
      question: "Why is ConverterForAll completely free with no file size limits or watermarks?",
      answer: "Traditional converter websites pay hefty fees for cloud servers and bandwidth to host your files, forcing them to charge monthly subscriptions or enforce strict 10MB limits. Because ConverterForAll uses your device's native hardware processor to convert files locally, we don't have server hosting costs—allowing us to provide completely free, unlimited, and watermark-free conversions forever.",
      category: "General & Privacy",
      badge: "No Limits",
    },
    {
      question: "How does in-browser client-side WebAssembly conversion work without uploading files?",
      answer: "When you open ConverterForAll, your web browser downloads lightweight client-side scripts. When you drop a file, your device's CPU and GPU execute the conversion algorithms directly inside your browser's secure sandbox. No cloud servers are involved, ensuring instant execution and complete data confidentiality.",
      category: "General & Privacy",
    },

    // FONTS & GOVT EXAMS
    {
      question: "How do I convert Kruti Dev 010 to Unicode (Mangal Font) for CPCT, SSC, High Court, and government typing exams?",
      answer: "You can convert Kruti Dev to Unicode instantly by using our free Kruti Dev to Unicode Converter. Simply paste your Kruti Dev (or DevLys / Chanakya) text, and our engine will accurately translate it into Microsoft Mangal Unicode font with 100% correct Matras, conjuncts, and halants—fully compliant with CPCT, SSC CGL, Allahabad High Court, MP Patwari, and state government typing tests.",
      category: "Fonts & Exams",
      badge: "CPCT / SSC Ready",
    },
    {
      question: "Why does Hindi (Kruti Dev) or Punjabi (AnmolLipi) text show as random English letters in Word or on mobile phones?",
      answer: "Old fonts like Kruti Dev and AnmolLipi are legacy ASCII font encodings that remap English keyboard characters (like 'd', 'k', 's') to Indian glyphs. Because smartphones, WhatsApp, and modern versions of MS Word expect global Unicode, they display the underlying English letters. Converting your text to Unicode solves this permanently so it displays correctly on any phone, website, or app without installing old fonts.",
      category: "Fonts & Exams",
      badge: "Fix English Gibberish",
    },
    {
      question: "How to convert Punjabi AnmolLipi and Satluj fonts to standard Gurmukhi Unicode?",
      answer: "Use our dedicated AnmolLipi to Unicode Converter or Satluj to Unicode Converter. Our engine preserves all Gurmukhi Tipli, Bindi, Adhak, Pairin Rara, and Pairin Haha characters so your Punjabi documents, poetry, and court records can be shared seamlessly across Android, iPhone, and Windows.",
      category: "Fonts & Exams",
      badge: "Gurmukhi Unicode",
    },
    {
      question: "How to convert InPage Urdu text into standard Urdu Unicode for websites, WhatsApp, and MS Word?",
      answer: "InPage Urdu uses a proprietary legacy code page. Our free InPage to Urdu Unicode Converter automatically translates Noori Nastaliq text into standard UTF-8 Arabic/Urdu Unicode script. This allows your Urdu text to be searched on Google, sent on WhatsApp, and formatted cleanly in modern MS Word documents.",
      category: "Fonts & Exams",
      badge: "Urdu Nastaliq",
    },
    {
      question: "How do I convert Bijoy (SutonnyMJ) Bengali text to Unicode without Yuktakshar mistakes?",
      answer: "Our Bijoy to Bengali Unicode Converter handles complex Bengali conjuncts (Yuktakshar), E-kar, I-kar, Ref, and Hoshonto reorderings with high accuracy. You can paste SutonnyMJ Bengali text and get clean, publishable Unicode Bengali in one click.",
      category: "Fonts & Exams",
      badge: "Bengali SutonnyMJ",
    },
    {
      question: "How do I convert Nepali Preeti font text to Unicode?",
      answer: "Our Preeti to Nepali Unicode Converter transforms traditional Nepali keyboard typing into standard Devanagari Unicode. It accurately corrects vowel reorderings and complex conjuncts, making it ideal for Nepali official documents, journalism, and social media posting.",
      category: "Fonts & Exams",
      badge: "Nepali Preeti",
    },

    // PDF & DOCUMENTS
    {
      question: "How can I convert PDF to Word document without losing formatting, tables, or fonts?",
      answer: "Our PDF to Word Converter extracts text, headings, layout grids, and embedded images, reconstructing them into an editable Microsoft Word (.docx) document right in your browser. This preserves your formatting while keeping your document completely confidential.",
      category: "PDF & Documents",
      badge: "Editable DOCX",
    },
    {
      question: "How to compress large PDF files from 50MB to under 200KB for government job portals?",
      answer: "Job portals (like UPSC, SSC, IBPS, and State PSCs) frequently restrict document uploads to under 200KB or 500KB. Use our free Compress PDF tool to optimize vector graphics, resample images, and strip redundant metadata while maintaining crystal clear readability for signatures and certificates.",
      category: "PDF & Documents",
      badge: "Job Portal Ready",
    },
    {
      question: "Can I merge multiple PDFs, JPGs, and PNG images into a single PDF document?",
      answer: "Yes! Our Merge PDF tool allows you to combine PDF files, JPG photos, and PNG graphics into a single unified PDF file. You can drag and drop to reorder pages and download the combined document instantly with zero size restrictions.",
      category: "PDF & Documents",
      badge: "Multi-Format Merge",
    },

    // IMAGE & MEDIA
    {
      question: "How can I remove an image background for free with AI without losing photo quality?",
      answer: "Our AI Background Remover uses an advanced in-browser deep learning model to separate foreground subjects (people, products, pets, cars) with pixel-perfect edge detection. It outputs a crisp, transparent PNG file directly on your device with no upload wait times.",
      category: "Image & Media",
      badge: "AI Powered",
    },
    {
      question: "How to create official 2x2 inch passport size photos online for free?",
      answer: "With our Passport Photo Maker, you can capture a photo with your webcam or upload a portrait, remove the background with one click, choose standard US (2x2 inch), Indian (3.5x4.5 cm), or Schengen visa dimensions, and generate a print-ready photo sheet in seconds.",
      category: "Image & Media",
      badge: "Passport & Visa",
    },
    {
      question: "Can I extract high-quality MP3 audio from MP4 video files directly in my browser?",
      answer: "Yes, our MP4 to MP3 Converter strips audio tracks from MP4, MOV, MKV, and WebM video files and converts them into high-bitrate MP3 audio without uploading large video files to the internet.",
      category: "Image & Media",
      badge: "High-Bitrate Audio",
    },
  ];

  const categories = ["All", "General & Privacy", "Fonts & Exams", "PDF & Documents", "Image & Media"];

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "All") return faqs;
    return faqs.filter((faq) => faq.category === selectedCategory);
  }, [selectedCategory]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section 
      id="faq"
      className="py-24 relative bg-white dark:bg-[#060b19] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      {/* Structured Data JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We&apos;ve Got Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
              Questions &amp; Guides
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
            Everything you need to know about our privacy-first local file conversion engine, font translations, and document optimization tools.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(0);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-400 scale-[1.02]"
                    : "bg-slate-100 dark:bg-[#0c142c] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#132044] border border-slate-200/80 dark:border-slate-800"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ Cards */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen 
                    ? "bg-slate-50/90 dark:bg-[#0a1128]/95 border-blue-500/40 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20" 
                    : "bg-white dark:bg-[#0a1128]/60 hover:bg-slate-50 dark:hover:bg-[#0c142c] border-slate-200/90 dark:border-slate-800/80 shadow-sm"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-5 sm:p-6 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pr-6">
                    {faq.badge && (
                      <span className="self-start inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                        {faq.badge}
                      </span>
                    )}
                    <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                    isOpen 
                      ? "bg-blue-600 text-white rotate-180 shadow-md shadow-blue-500/20" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 sm:p-6 pt-0 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Assistance Callout */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-50 dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have a specific file or font question?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore our detailed guides and tutorials in the blog directory.</p>
            </div>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline shrink-0"
          >
            <span>Read Knowledge Base</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
