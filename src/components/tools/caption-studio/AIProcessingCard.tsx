"use client";

import React, { useState } from 'react';
import { WorkerState } from '@/lib/caption-studio/types';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

interface AIProcessingCardProps {
  workerState: WorkerState;
  initProgress: any;
  error: string | null;
  capabilities: { webgpu?: boolean; worker?: boolean; audioContext?: boolean } | null;
  onRetry?: () => void;
}

export function AIProcessingCard({
  workerState,
  initProgress,
  error,
  capabilities,
  onRetry
}: AIProcessingCardProps) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Maintain progress state keyed by actual file/model identifier
  const filesMapRef = React.useRef<Map<string, { loaded: number; total: number }>>(new Map());
  const maxProgressRef = React.useRef<number>(0);
  const [displayedPercent, setDisplayedPercent] = useState<number>(0);
  const [activeFile, setActiveFile] = useState<string>('');
  const prevWorkerStateRef = React.useRef<WorkerState>(workerState);

  const isError = workerState === 'ERROR' || Boolean(error);
  const isInitializing = workerState === 'INITIALIZING';
  const isTranscribing = workerState === 'TRANSCRIBING';
  const isReady = workerState === 'READY';
  const isIdle = workerState === 'IDLE';

  // Handle cycle transitions and resets
  React.useEffect(() => {
    if (workerState === 'INITIALIZING' && prevWorkerStateRef.current !== 'INITIALIZING') {
      // New initialization cycle started
      filesMapRef.current.clear();
      maxProgressRef.current = 0;
      setDisplayedPercent(0);
      setActiveFile('');
    } else if (workerState === 'READY') {
      maxProgressRef.current = 100;
      setDisplayedPercent(100);
    }
    prevWorkerStateRef.current = workerState;
  }, [workerState]);

  // Aggregate real multi-file progress with monotonic guarantee
  React.useEffect(() => {
    if (workerState !== 'INITIALIZING' || !initProgress) return;

    // 1. Ingest files map if emitted by progress_total
    if (initProgress.files && typeof initProgress.files === 'object') {
      for (const [fName, fData] of Object.entries(initProgress.files as Record<string, any>)) {
        if (fData && typeof fData === 'object') {
          filesMapRef.current.set(fName, {
            loaded: Number(fData.loaded) || 0,
            total: Number(fData.total) || 0
          });
        }
      }
    }

    // 2. Track per-file progress events
    if (initProgress.file) {
      setActiveFile(initProgress.file);
      const existing = filesMapRef.current.get(initProgress.file) || { loaded: 0, total: 0 };
      if (typeof initProgress.loaded === 'number' && typeof initProgress.total === 'number') {
        existing.loaded = Math.min(initProgress.loaded, initProgress.total);
        existing.total = initProgress.total;
      } else if (initProgress.status === 'done') {
        if (existing.total > 0) existing.loaded = existing.total;
      }
      filesMapRef.current.set(initProgress.file, existing);
    }

    // 3. Calculate overall aggregate progress across all discovered files
    let sumLoaded = 0;
    let sumTotal = 0;
    for (const entry of filesMapRef.current.values()) {
      sumLoaded += entry.loaded;
      sumTotal += entry.total;
    }

    let calculatedPercent = 0;
    if (sumTotal > 0) {
      calculatedPercent = (sumLoaded / sumTotal) * 100;
    } else if (initProgress.status === 'progress_total' && typeof initProgress.progress === 'number') {
      calculatedPercent = initProgress.progress;
    }

    const rounded = Math.min(100, Math.max(0, Math.round(calculatedPercent)));

    // MONOTONIC DISPLAY GUARANTEE: visible progress percentage must NEVER decrease during one cycle
    if (rounded > maxProgressRef.current) {
      maxProgressRef.current = rounded;
      setDisplayedPercent(rounded);
    }
  }, [initProgress, workerState]);

  const handleRetry = () => {
    filesMapRef.current.clear();
    maxProgressRef.current = 0;
    setDisplayedPercent(0);
    setActiveFile('');
    if (onRetry) onRetry();
  };

  // Human-readable loading stages
  let stageLabel = "Preparing AI engine";
  let stageDetail = "Preparing WebGPU pipeline and background worker...";

  if (isInitializing) {
    if (initProgress) {
      if (initProgress.status === 'download' || initProgress.status === 'progress' || initProgress.status === 'progress_total') {
        stageLabel = "Downloading AI model";
        const cleanName = activeFile ? activeFile.split('/').pop() : '';
        stageDetail = cleanName ? `Fetching ${cleanName}` : "Downloading model weights...";
      } else if (initProgress.status === 'done') {
        stageLabel = "Loading speech recognition into WebGPU";
        stageDetail = "Allocating GPU buffers and compiling neural network...";
      } else if (initProgress.status === 'ready') {
        stageLabel = "Preparing caption engine";
        stageDetail = "Finalizing pipeline setup...";
      } else if (initProgress.status === 'initiate') {
        stageLabel = "Preparing AI engine";
        const cleanName = initProgress.file ? initProgress.file.split('/').pop() : '';
        stageDetail = cleanName ? `Connecting to ${cleanName}...` : "Starting model download pipeline...";
      } else {
        stageLabel = "Preparing caption engine";
        stageDetail = `Status: ${initProgress.status || 'initializing'}...`;
      }
    } else {
      stageLabel = "Preparing AI engine";
      stageDetail = "Starting local speech model pipeline...";
    }
  } else if (isTranscribing) {
    stageLabel = "Transcribing audio";
    stageDetail = "Detecting speech and generating Devanagari Hindi timestamps...";
  }

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isError
          ? 'border-destructive/40 bg-destructive/5'
          : isInitializing
          ? 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
          : isTranscribing
          ? 'border-primary/40 bg-card shadow-sm ring-1 ring-primary/20'
          : isReady
          ? 'border-emerald-500/30 bg-card shadow-sm'
          : 'border-border bg-card'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {isError ? (
              <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
            ) : isReady ? (
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            ) : isInitializing || isTranscribing ? (
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 motion-safe:animate-pulse motion-reduce:animate-none">
                <Sparkles className="h-5 w-5 motion-safe:animate-spin motion-reduce:animate-none [animation-duration:6s]" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
            )}

            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                {isError ? (
                  "AI setup couldn't complete"
                ) : isReady ? (
                  <>
                    <span>AI Engine Ready</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-normal">✓</span>
                  </>
                ) : isInitializing ? (
                  "Preparing AI Caption Studio"
                ) : isTranscribing ? (
                  "Transcribing Audio"
                ) : (
                  "AI Caption Studio"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isError
                  ? "An error occurred while setting up the speech recognition engine."
                  : isReady
                  ? "Speech model is loaded into WebGPU memory and ready."
                  : isInitializing
                  ? stageLabel
                  : isTranscribing
                  ? "Processing speech locally inside your browser..."
                  : "Local AI speech engine runs on demand when you pick a video."}
              </p>
            </div>
          </div>

          {/* Privacy & Engine Badges */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-muted-foreground shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted font-medium text-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              100% In-Browser
            </span>
            <span className="text-[11px]">
              {capabilities?.webgpu ? "WebGPU Enabled" : "WebGPU Not Detected"}
            </span>
          </div>
        </div>

        {/* Active Model Loading Panel (Prominent Card Content) */}
        {isInitializing && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-foreground truncate max-w-[280px] sm:max-w-none">
                {stageDetail}
              </span>
              {displayedPercent > 0 ? (
                <span className="font-mono font-bold text-base sm:text-lg text-primary tabular-nums">
                  {displayedPercent}%
                </span>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Initializing...
                </span>
              )}
            </div>

            {/* Accessible Smooth Progress Bar with Monotonic Guarantee */}
            <div 
              className="w-full bg-muted/80 rounded-full h-3 overflow-hidden relative"
              role="progressbar"
              aria-valuenow={displayedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="AI model download progress"
              aria-valuetext={`${displayedPercent}% - ${stageLabel}`}
            >
              <div 
                className={`h-full bg-primary rounded-full transition-all duration-300 ease-out ${
                  displayedPercent === 0 ? 'w-1/12 motion-safe:animate-pulse motion-reduce:animate-none' : ''
                }`}
                style={{ width: `${Math.max(displayedPercent, displayedPercent === 0 ? 0 : 2)}%` }}
              />
            </div>

            {/* Human Explanation & Privacy reassurance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-muted-foreground pt-1 border-t border-border/50">
              <p>This setup happens once on this device.</p>
              <p className="font-medium text-foreground/80">Your video stays private and is processed locally.</p>
            </div>
          </div>
        )}

        {/* Transcribing State Panel */}
        {isTranscribing && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-foreground">
                {stageDetail}
              </span>
              <span className="text-xs text-primary font-mono animate-pulse">
                Transcribing...
              </span>
            </div>

            {/* Indeterminate Animated Waveform/Bar */}
            <div 
              className="w-full bg-muted/80 rounded-full h-2.5 overflow-hidden relative"
              role="progressbar"
              aria-label="Transcribing audio"
              aria-valuetext="Transcribing audio..."
            >
              <div className="h-full bg-primary rounded-full w-2/3 motion-safe:animate-pulse motion-reduce:animate-none" />
            </div>

            <p className="text-xs text-muted-foreground">
              Processing audio using WebGPU acceleration without uploading your file.
            </p>
          </div>
        )}

        {/* Error State with [Try Again] & Details */}
        {isError && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              {onRetry && (
                <button
                  onClick={handleRetry}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try Again
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                Your video remains safe on your device.
              </span>
            </div>

            {error && (
              <div className="text-xs border rounded-lg p-2.5 bg-background/50">
                <button
                  type="button"
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <span>{showErrorDetails ? "Hide technical error details" : "Show technical error details"}</span>
                </button>
                {showErrorDetails && (
                  <p className="mt-2 text-destructive font-mono text-[11px] break-words whitespace-pre-wrap">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Idle & Ready Supporting Note */}
        {(isIdle || isReady) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-muted-foreground pt-1 border-t border-border/50">
            <p>Your video stays on your device. AI processing happens locally in your browser.</p>
            <p className="font-medium text-foreground/80">No server uploads • No watermarks</p>
          </div>
        )}
      </div>
    </div>
  );
}
