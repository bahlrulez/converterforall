"use client";

import React, { useState } from "react";
import { AlertTriangle, AlertOctagon, Smartphone, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemoryCheckResult } from "@/lib/device-memory-guard";

interface MemoryGuardAlertProps {
  checkResult: MemoryCheckResult;
  onApplyPreset?: (resolution: "720p" | "480p" | "original") => void;
  className?: string;
}

export function MemoryGuardAlert({
  checkResult,
  onApplyPreset,
  className = "",
}: MemoryGuardAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [applied, setApplied] = useState(false);

  if (checkResult.risk === "safe" || isDismissed) {
    return null;
  }

  const isDanger = checkResult.risk === "danger";

  const handleApply = () => {
    if (checkResult.targetResolution && onApplyPreset) {
      onApplyPreset(checkResult.targetResolution);
      setApplied(true);
    }
  };

  return (
    <div
      role="alert"
      className={`rounded-xl p-4 transition-all duration-200 border ${
        isDanger
          ? "bg-rose-50/90 dark:bg-rose-950/25 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200"
          : "bg-amber-50/90 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {isDanger ? (
          <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-sm">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold flex items-center gap-1.5">
              <span>{checkResult.title}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-background/60 border border-current/20">
                <Smartphone className="w-3 h-3" /> Mobile Memory Guard
              </span>
            </h4>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-current opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="leading-relaxed opacity-90 mb-3">{checkResult.message}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {checkResult.targetResolution && onApplyPreset && !applied && (
              <Button
                size="sm"
                variant={isDanger ? "destructive" : "default"}
                onClick={handleApply}
                className="h-8 text-xs font-medium gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                {checkResult.recommendedAction || `Apply ${checkResult.targetResolution}`}
              </Button>
            )}

            {applied && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                <Check className="w-3.5 h-3.5" /> Applied safe resolution
              </span>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="h-8 text-xs text-current/80 hover:text-current hover:bg-current/10"
            >
              Continue anyway
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

