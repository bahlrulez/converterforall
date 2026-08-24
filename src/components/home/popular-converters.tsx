"use client";

import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon, Video, FileArchive, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_TOOLS = [
  {
    title: "PDF to Word",
    description: "Convert PDF to editable Word",
    icon: FileText,
    color: "bg-red-500",
    slug: "pdf-to-word"
  },
  {
    title: "JPG to PDF",
    description: "Convert images to PDF documents",
    icon: ImageIcon,
    color: "bg-purple-500",
    slug: "jpg-to-pdf"
  },
  {
    title: "PNG to JPG",
    description: "Convert PNG to JPG images",
    icon: ImageIcon,
    color: "bg-emerald-500",
    slug: "png-to-jpg"
  },
  {
    title: "MP4 to MP3",
    description: "Extract audio from video files",
    icon: Video,
    color: "bg-amber-500",
    slug: "mp4-to-mp3"
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size online",
    icon: FileArchive,
    color: "bg-blue-500",
    slug: "compress-pdf"
  },
  {
    title: "Remove Background",
    description: "Remove background from images",
    icon: Eraser,
    color: "bg-indigo-500",
    slug: "remove-background"
  }
];

export function PopularConverters() {
  return (
    <section className="py-8 bg-[#030714]">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-xl">🔥</span> Popular Converters
          </h3>
          <Link href="/#featured-tools" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 sm:gap-4 no-scrollbar snap-x">
          {POPULAR_TOOLS.map((tool) => (
            <Link 
              key={tool.slug}
              href={`/${tool.slug}`}
              className="flex flex-col min-w-[160px] sm:min-w-[180px] p-4 rounded-2xl bg-[#080e22]/90 border border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1630] transition-all group snap-start"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg", tool.color)}>
                <tool.icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{tool.title}</h4>
              <p className="text-[11px] text-slate-400 mb-3 flex-1">{tool.description}</p>
              
              <div className="w-6 h-6 rounded-full bg-slate-800/50 group-hover:bg-blue-600/20 text-slate-500 group-hover:text-blue-400 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
