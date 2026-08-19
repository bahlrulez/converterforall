import Link from "next/link";
import { ManageCookiesButton } from "@/components/cookie-consent/manage-cookies-button";
import { ShieldCheck, Zap, Lock, Sparkles, Heart, Globe, Cpu, FileText, Image, Type, Video, Music } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#030712] text-slate-600 dark:text-slate-400 transition-colors duration-300 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Footer Links Columns */}
      <div className="container mx-auto px-4 pt-16 pb-12 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          
          {/* Col 1 & 2: Brand, Mission & Security Badge */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Converter<span className="text-blue-600 dark:text-blue-400">ForAll</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The privacy-first, 100% in-browser file converter. Convert PDFs, images, videos, audio, and regional Indic fonts without uploading sensitive files to cloud servers.
            </p>

            {/* Privacy Trust Pill */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Uploads Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                All processing happens locally on your CPU/GPU via WebAssembly (WASM). Your personal files never leave your device.
              </p>
            </div>
          </div>

          {/* Col 3: Popular PDF Tools (High SEO Intent) */}
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
              <li><Link href="/ocr-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">OCR PDF</Link></li>
            </ul>
          </div>

          {/* Col 4: Image & AI Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-purple-500" />
              <span>Image &amp; AI</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/remove-background" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Background Remover</Link></li>
              <li><Link href="/passport-photo-maker" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Passport Photo Maker</Link></li>
              <li><Link href="/jpg-to-png" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JPG to PNG</Link></li>
              <li><Link href="/png-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">PNG to JPG</Link></li>
              <li><Link href="/webp-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">WEBP to JPG</Link></li>
              <li><Link href="/heic-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">HEIC to JPG</Link></li>
              <li><Link href="/compress-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Compress Image</Link></li>
              <li><Link href="/gif-maker" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GIF Maker</Link></li>
            </ul>
          </div>

          {/* Col 5: Data & Code Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span>Data &amp; Code</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/jwt-decoder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JWT Decoder (Offline)</Link></li>
              <li><Link href="/json-formatter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JSON Formatter &amp; Validator</Link></li>
              <li><Link href="/json-to-csv" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JSON to CSV Converter</Link></li>
              <li><Link href="/csv-to-json" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">CSV to JSON Converter</Link></li>
              <li><Link href="/base64-encoder-decoder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Base64 Encoder &amp; Decoder</Link></li>
              <li><Link href="/unix-timestamp-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Unix Timestamp Converter</Link></li>
              <li><Link href="/uuid-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">UUID Generator (v4)</Link></li>
              <li><Link href="/category/developer" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors">All Data Tools →</Link></li>
            </ul>
          </div>

          {/* Col 6: Company & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Company &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog &amp; Guides</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</Link></li>
              <li><Link href="/accessibility" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility</Link></li>
              <li><ManageCookiesButton /></li>
            </ul>
          </div>

        </div>

        {/* Popular Category Quick Pills Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300">Quick Tools:</span>
            <Link href="/jwt-decoder" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-cyan-600 dark:text-cyan-400">JWT Decoder</Link>
            <span>•</span>
            <Link href="/json-formatter" className="hover:text-blue-600 dark:hover:text-blue-400">JSON Formatter</Link>
            <span>•</span>
            <Link href="/edit-pdf" className="hover:text-blue-600 dark:hover:text-blue-400">Edit PDF</Link>
            <span>•</span>
            <Link href="/mp4-to-mp3" className="hover:text-blue-600 dark:hover:text-blue-400">MP4 to MP3</Link>
            <span>•</span>
            <Link href="/video-compressor" className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-rose-600 dark:text-rose-400">Video Compressor</Link>
            <span>•</span>
            <Link href="/compress-video-for-discord" className="hover:text-blue-600 dark:hover:text-blue-400">Discord Compressor</Link>
            <span>•</span>
            <Link href="/compress-mp4" className="hover:text-blue-600 dark:hover:text-blue-400">Compress MP4</Link>
            <span>•</span>
            <Link href="/compress-mov-video" className="hover:text-blue-600 dark:hover:text-blue-400">Compress MOV</Link>
            <span>•</span>
            <Link href="/presentation-maker" className="hover:text-blue-600 dark:hover:text-blue-400">Presentation Maker</Link>
            <span>•</span>
            <Link href="/qr-generator" className="hover:text-blue-600 dark:hover:text-blue-400">QR Generator</Link>
            <span>•</span>
            <Link href="/krutidev-to-unicode" className="hover:text-blue-600 dark:hover:text-blue-400">Kruti Dev</Link>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>100% In-Browser Privacy Engine</span>
          </div>
        </div>

        {/* Bottom Copyright & Live Status */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} ConverterForAll. All rights reserved. 100% Free &amp; Private.</p>
          
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Client-Side Systems Operational</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
