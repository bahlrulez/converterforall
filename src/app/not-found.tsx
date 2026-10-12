import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Search, FileText, Image, Type, Award, Cpu, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found - ConverterForAll",
  description: "The page or conversion tool you requested does not exist or has moved. Browse our free, private in-browser converters.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-background px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Error Code Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Heading & Human Explanation */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            The link you clicked might be outdated, or the tool may have been renamed. Most of our tools run directly inside your browser so your documents stay on your device.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Explore All 150+ Tools</span>
          </Link>
        </div>

        {/* Popular Category Hubs */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Or Jump Directly to a Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
            <Link
              href="/category/document"
              className="p-3 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all group"
            >
              <FileText className="w-5 h-5 text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">PDF &amp; Docs</div>
              <div className="text-[11px] text-slate-400">Merge, convert, edit</div>
            </Link>

            <Link
              href="/category/image"
              className="p-3 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all group"
            >
              <Image className="w-5 h-5 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Images</div>
              <div className="text-[11px] text-slate-400">Resize, remove BG</div>
            </Link>

            <Link
              href="/category/fonts"
              className="p-3 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all group"
            >
              <Type className="w-5 h-5 text-indigo-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Indic Fonts</div>
              <div className="text-[11px] text-slate-400">Kruti Dev, Chanakya</div>
            </Link>

            <Link
              href="/category/exam"
              className="p-3 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all group"
            >
              <Award className="w-5 h-5 text-amber-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Exam Forms</div>
              <div className="text-[11px] text-slate-400">Photo &amp; sign resizer</div>
            </Link>

            <Link
              href="/category/developer"
              className="p-3 rounded-xl bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all group col-span-2 sm:col-span-1"
            >
              <Cpu className="w-5 h-5 text-cyan-500 mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Data &amp; Code</div>
              <div className="text-[11px] text-slate-400">JSON, JWT, Base64</div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
