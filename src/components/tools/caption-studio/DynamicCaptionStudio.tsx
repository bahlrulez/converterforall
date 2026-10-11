"use client";

import dynamic from "next/dynamic";
import { Cpu, Video } from "lucide-react";

export function CaptionStudioSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Loading Caption Studio">
      {/* Top AI Engine Card Skeleton */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white/70 dark:bg-[#070d1e]/85 p-6 sm:p-7 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5 text-blue-500/60" />
            </div>
            <div className="space-y-1.5">
              <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-3.5 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1.5">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        </div>
      </div>

      {/* Dropzone Skeleton */}
      <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700/80 bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-[#080e22]/95 dark:to-[#040814]/95 p-8 sm:p-14 text-center shadow-xl">
        <div className="flex flex-col items-center max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-blue-500/50" />
          </div>
          <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-3" />
          <div className="h-4 w-80 max-w-full bg-slate-100 dark:bg-slate-800/60 rounded mb-6" />
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 w-full sm:w-auto">
            <div className="h-12 w-48 bg-blue-600/30 rounded-2xl" />
            <div className="h-12 w-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
            <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
            <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const CaptionStudio = dynamic(
  () => import("./CaptionStudio").then((mod) => mod.CaptionStudio),
  {
    ssr: false,
    loading: () => <CaptionStudioSkeleton />
  }
);
