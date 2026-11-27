"use client";

import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Video, FileArchive } from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_TOOLS = [
  {
    title: "Exam Photo Resizer",
    description: "Crop and size photos for SSC, UPSC & IBPS",
    icon: ImageIcon,
    color: "bg-blue-600",
    slug: "exam-photo-resizer"
  },
  {
    title: "Kruti Dev to Unicode",
    description: "Convert legacy Kruti Dev text to Hindi Unicode",
    icon: FileText,
    color: "bg-indigo-600",
    slug: "krutidev-to-unicode"
  },
  {
    title: "Asees to Unicode",
    description: "Convert Punjabi Asees text to Gurmukhi Unicode",
    icon: FileText,
    color: "bg-violet-600",
    slug: "asees-to-unicode"
  },
  {
    title: "AI Caption Studio",
    description: "Auto-caption Hindi and English videos locally",
    icon: Video,
    color: "bg-rose-600",
    slug: "video-caption-generator"
  },
  {
    title: "Compress PDF 100KB",
    description: "Shrink marksheets and forms toward 100KB",
    icon: FileArchive,
    color: "bg-amber-600",
    slug: "compress-pdf-100kb"
  },
  {
    title: "Video Compressor",
    description: "Compress MP4, MOV & WebM videos in-browser",
    icon: Video,
    color: "bg-emerald-600",
    slug: "video-compressor"
  }
];

export function PopularConverters() {
  return (
    <section className="py-8 bg-white dark:bg-[#030714] transition-colors duration-300 border-b border-slate-100 dark:border-slate-800/50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
            <span className="text-xl">🔥</span> Popular Converters
          </h3>
          <Link href="/tools" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 sm:gap-4 no-scrollbar snap-x">
          {POPULAR_TOOLS.map((tool) => (
            <Link 
              key={tool.slug}
              href={`/${tool.slug}`}
              className="flex flex-col min-w-[160px] sm:min-w-[180px] p-4 rounded-2xl bg-slate-50/90 dark:bg-[#080e22]/90 border border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-[#0c1630] transition-all group snap-start shadow-sm dark:shadow-none"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg", tool.color)}>
                <tool.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tool.title}</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 flex-1">{tool.description}</p>
              
              <div className="w-6 h-6 rounded-full bg-slate-200/80 dark:bg-slate-800/50 group-hover:bg-blue-600/10 dark:group-hover:bg-blue-600/20 text-slate-600 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
