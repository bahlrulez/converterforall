import Link from "next/link";
import { ManageCookiesButton } from "@/components/cookie-consent/manage-cookies-button";
import { ShieldCheck, Sparkles, Cpu, FileText, Image, Type, Award, Code2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#030712] text-slate-600 dark:text-slate-400 transition-colors duration-300 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Footer Links Columns */}
      <div className="container mx-auto px-4 pt-16 pb-12 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          
          {/* Col 1: Brand, Mission & Security Badge */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Converter<span className="text-blue-600 dark:text-blue-400">ForAll</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Private, free in-browser file converter for PDFs, images, videos, audio, and regional Indic fonts.
            </p>

            {/* Privacy Trust Pill */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Transparent Privacy</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Most tools run locally inside your browser without uploading files. Word-to-PDF and PowerPoint-to-PDF send files to a third-party conversion service (Cloudmersive) in memory; the AI Presentation Maker sends prompts to Google Gemini.
              </p>
            </div>
          </div>

          {/* Col 2: PDF Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>PDF Tools</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pdf-to-word" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Word to PDF</Link></li>
              <li><Link href="/merge-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Split PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Compress PDF</Link></li>
              <li><Link href="/pdf-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">PDF to JPG</Link></li>
              <li><Link href="/jpg-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JPG to PDF</Link></li>
              <li><Link href="/category/document" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-blue-600 dark:text-blue-400">All PDF Tools →</Link></li>
            </ul>
          </div>

          {/* Col 3: Image & AI Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-purple-500" />
              <span>Image &amp; AI</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/remove-background" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Background Remover</Link></li>
              <li><Link href="/passport-photo-maker" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Passport Photo Maker</Link></li>
              <li><Link href="/image-cropper" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Image Cropper</Link></li>
              <li><Link href="/image-resizer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Image Resizer</Link></li>
              <li><Link href="/jpg-to-png" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JPG to PNG</Link></li>
              <li><Link href="/png-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">PNG to JPG</Link></li>
              <li><Link href="/webp-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">WEBP to JPG</Link></li>
              <li><Link href="/category/image" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-purple-600 dark:text-purple-400">All Image Tools →</Link></li>
            </ul>
          </div>

          {/* Col 4: Exam & Govt Tools (High Search Intent) */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Sarkari Exam</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/exam-photo-resizer" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Exam Photo Resizer</Link></li>
              <li><Link href="/photo-name-date-stamper" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Photo Name &amp; Date</Link></li>
              <li><Link href="/exam-signature-resizer" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Exam Signature Resizer</Link></li>
              <li><Link href="/compress-pdf-100kb" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Compress PDF 100KB</Link></li>
              <li><Link href="/image-dpi-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Image DPI Converter</Link></li>
              <li><Link href="/category/exam" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-amber-600 dark:text-amber-400">All Exam Tools →</Link></li>
            </ul>
          </div>

          {/* Col 5: Indic Font Converters */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Indic Fonts</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/krutidev-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Kruti Dev to Unicode</Link></li>
              <li><Link href="/unicode-to-krutidev" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Unicode to Kruti Dev</Link></li>
              <li><Link href="/chanakya-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Chanakya to Unicode</Link></li>
              <li><Link href="/asees-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Asees to Unicode</Link></li>
              <li><Link href="/bijoy-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bijoy to Unicode</Link></li>
              <li><Link href="/font-text-fixer" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">Font &amp; Text Fixer</Link></li>
              <li><Link href="/category/fonts" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-indigo-600 dark:text-indigo-400">All Font Tools →</Link></li>
            </ul>
          </div>

          {/* Col 6: Data, Code & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Developer &amp; Site</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/jwt-decoder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JWT Decoder (Offline)</Link></li>
              <li><Link href="/json-formatter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JSON Formatter</Link></li>
              <li><Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-blue-600 dark:text-blue-400">All 150+ Tools</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog &amp; Guides</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><ManageCookiesButton /></li>
            </ul>
          </div>

        </div>

        {/* Popular Category Quick Pills Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Featured Utilities:</span>
            <Link href="/krutidev-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-indigo-600 dark:text-indigo-400">Kruti Dev to Unicode</Link>
            <span>•</span>
            <Link href="/unicode-to-krutidev" className="hover:text-blue-600 dark:hover:text-blue-400">Unicode to Kruti Dev</Link>
            <span>•</span>
            <Link href="/chanakya-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400">Chanakya to Unicode</Link>
            <span>•</span>
            <Link href="/asees-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400">Asees to Unicode</Link>
            <span>•</span>
            <Link href="/font-text-fixer" className="hover:text-blue-600 dark:hover:text-blue-400">Font &amp; Text Fixer</Link>
            <span>•</span>
            <Link href="/exam-photo-resizer" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-amber-600 dark:text-amber-400">Exam Photo Resizer</Link>
            <span>•</span>
            <Link href="/photo-name-date-stamper" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-amber-600 dark:text-amber-400">Photo Name &amp; Date</Link>
            <span>•</span>
            <Link href="/exam-signature-resizer" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-amber-600 dark:text-amber-400">Exam Signature</Link>
            <span>•</span>
            <Link href="/compress-pdf-100kb" className="hover:text-blue-600 dark:hover:text-blue-400">Compress PDF 100KB</Link>
            <span>•</span>
            <Link href="/image-dpi-converter" className="hover:text-blue-600 dark:hover:text-blue-400">Image DPI Converter</Link>
            <span>•</span>
            <Link href="/video-caption-generator" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-purple-600 dark:text-purple-400">AI Caption Studio</Link>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>Standardized In-Browser Privacy</span>
          </div>
        </div>

        {/* Bottom Copyright & Honest Privacy Phrasing */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} ConverterForAll. All rights reserved. Free, private browser-based utilities.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-500 dark:text-slate-400">
              Most tools process files locally in your browser.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
