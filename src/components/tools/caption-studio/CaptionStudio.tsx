"use client";

import React, { useState, useEffect, useRef } from 'react';
import { checkBrowserCapabilities, isASRReady } from '@/lib/caption-studio/capabilities';
import { ASRClient } from '@/lib/caption-studio/asr-client';
import { extractAudioFromVideo } from '@/lib/caption-studio/audio-extractor';
import { ASRResult, WorkerState, CaptionChunk, CaptionWord } from '@/lib/caption-studio/types';
import { segmentCaptions } from '@/lib/caption-studio/segmentation';
import { EditorSidebar } from './EditorSidebar';
import { VideoPreview } from './VideoPreview';
import { ExportProgress, ExportWorkerRequest, ExportWorkerResponse } from '@/lib/caption-studio/export-utils';
import { StyleSettings, PositionSettings } from '@/lib/caption-studio/style-types';
import { DEFAULT_STYLE, DEFAULT_POSITION } from '@/lib/caption-studio/caption-renderer';
import { PRESETS } from '@/lib/caption-studio/presets';
import { useFontLoader } from '@/lib/caption-studio/useFontLoader';
import { AIProcessingCard } from './AIProcessingCard';
import { 
  UploadCloud, 
  Video, 
  Play, 
  Film, 
  Clock, 
  ShieldCheck, 
  Undo2, 
  Redo2, 
  RotateCcw, 
  FileVideo, 
  Sparkles, 
  ArrowRight,
  Download
} from 'lucide-react';

export function CaptionStudio() {
  const [capabilities, setCapabilities] = useState<any>(null);
  const [workerState, setWorkerState] = useState<WorkerState>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<ASRResult | null>(null);
  const [captions, setCaptions] = useState<CaptionChunk[]>([]);
  const [activeCaptionId, setActiveCaptionId] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [initProgress, setInitProgress] = useState<any>(null);
  const [releaseAI, setReleaseAI] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Phase 1: State management
  const [aiOriginalCaptions, setAiOriginalCaptions] = useState<CaptionChunk[] | null>(null);
  const [undoStack, setUndoStack] = useState<CaptionChunk[][]>([]);
  const [redoStack, setRedoStack] = useState<CaptionChunk[][]>([]);
  
  // Phase 2: Styling and Positioning
  const [globalStyle, setGlobalStyle] = useState<StyleSettings>(DEFAULT_STYLE);
  const [globalPosition, setGlobalPosition] = useState<PositionSettings>(DEFAULT_POSITION);
  const { loadFontStack, fontPayloads } = useFontLoader();

  // Load preset from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('captionStudioPreset');
      if (saved && PRESETS[saved]) {
        setGlobalStyle(PRESETS[saved]);
        loadFontStack(PRESETS[saved].fontFamily);
      } else {
        loadFontStack(DEFAULT_STYLE.fontFamily);
      }
    } catch (e) {
      loadFontStack(DEFAULT_STYLE.fontFamily);
    }
  }, []);

  // When globalStyle changes, load fonts if they changed
  useEffect(() => {
    loadFontStack(globalStyle.fontFamily);
  }, [globalStyle.fontFamily]);

  const asrClientRef = useRef<ASRClient | null>(null);
  const exportWorkerRef = useRef<Worker | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const commitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const caps = checkBrowserCapabilities();
    setCapabilities(caps);

    if (!isASRReady(caps)) {
      setError("Your browser does not support the required AI features (WebGPU, WebWorkers, or AudioContext).");
      return;
    }

    const client = new ASRClient();
    asrClientRef.current = client;
    
    client.initialize(
      (state) => setWorkerState(state),
      (result) => {
        setTranscriptionResult(result);
        const newCaptions = segmentCaptions(result.words);
        const deepCopy = JSON.parse(JSON.stringify(newCaptions));
        setCaptions(newCaptions);
        setAiOriginalCaptions(deepCopy);
        setUndoStack([]);
        setRedoStack([]);
        setWorkerState('READY');
      },
      (err) => setError(err),
      (progress) => setInitProgress(progress)
    );

    return () => {
      client.terminate();
      asrClientRef.current = null;
      if (exportWorkerRef.current) {
        exportWorkerRef.current.terminate();
        exportWorkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const processVideoFile = async (file: File) => {
    if (!file) return;

    setError(null);
    setTranscriptionResult(null);
    setCaptions([]);
    setAiOriginalCaptions(null);
    setUndoStack([]);
    setRedoStack([]);
    setActiveCaptionId(null);
    setExportProgress(null);

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.src = url;
    
    tempVideo.onloadedmetadata = async () => {
      if (tempVideo.duration > 60) {
        setError("For this version, videos must be 60 seconds or less to prevent browser crashes.");
        URL.revokeObjectURL(url);
        return;
      }
      
      setVideoFile(file);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(url);

      try {
        if (workerState === 'IDLE' || workerState === 'INITIALIZING') {
          await asrClientRef.current?.prepare();
        }
        if (asrClientRef.current && (asrClientRef.current as any).state === 'ERROR') {
            throw new Error("AI Engine failed to initialize.");
        }
        
        setWorkerState('TRANSCRIBING');
        const pcm = await extractAudioFromVideo(file);
        asrClientRef.current?.transcribe(pcm);
      } catch (err: any) {
        setError(err.message || String(err));
        setWorkerState('READY');
      }
    };
    
    tempVideo.onerror = () => {
      setError("Failed to load video metadata. The file might be corrupted or unsupported.");
      URL.revokeObjectURL(url);
    };
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (workerState !== 'INITIALIZING' && workerState !== 'TRANSCRIBING') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING') return;
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name))) {
      processVideoFile(file);
    } else if (file) {
      setError("Please drop a supported video file (MP4, WebM, or MOV).");
    }
  };

  const handleLoadSample = async () => {
    if (workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING') return;
    try {
      const response = await fetch('/assets/sample-reel.mp4');
      if (!response.ok) throw new Error("Sample reel could not be loaded.");
      const blob = await response.blob();
      const sampleFile = new File([blob], "sample-reel.mp4", { type: "video/mp4" });
      processVideoFile(sampleFile);
    } catch (err: any) {
      setError("Could not load sample video. Please choose a video from your computer.");
    }
  };

  const handleRetryAI = async () => {
    setError(null);
    setInitProgress(null);
    if (asrClientRef.current) {
      asrClientRef.current.terminate();
    }
    const client = new ASRClient();
    asrClientRef.current = client;
    client.initialize(
      (state) => setWorkerState(state),
      (result) => {
        setTranscriptionResult(result);
        const newCaptions = segmentCaptions(result.words);
        const deepCopy = JSON.parse(JSON.stringify(newCaptions));
        setCaptions(newCaptions);
        setAiOriginalCaptions(deepCopy);
        setUndoStack([]);
        setRedoStack([]);
        setWorkerState('READY');
      },
      (err) => setError(err),
      (progress) => setInitProgress(progress)
    );

    try {
      await client.prepare();
      if (videoFile) {
        setWorkerState('TRANSCRIBING');
        const pcm = await extractAudioFromVideo(videoFile);
        client.transcribe(pcm);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || captions.length === 0) return;
    const currentTime = videoRef.current.currentTime;
    const active = captions.find(c => currentTime >= c.start && currentTime <= c.end);
    setActiveCaptionId(active ? active.id : null);
  };

  const handleCaptionClick = (start: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
  };

  const commitHistory = (currentState: CaptionChunk[]) => {
    setUndoStack(prev => {
      const newStack = [...prev, JSON.parse(JSON.stringify(currentState))];
      if (newStack.length > 50) newStack.shift();
      return newStack;
    });
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(captions))]);
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setCaptions(JSON.parse(JSON.stringify(previous)));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(captions))]);
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setCaptions(JSON.parse(JSON.stringify(next)));
  };

  const handleResetAI = () => {
    if (!aiOriginalCaptions) return;
    if (confirm("Are you sure you want to discard all edits and reset to the original AI captions?")) {
      commitHistory(captions);
      setCaptions(JSON.parse(JSON.stringify(aiOriginalCaptions)));
    }
  };

  const handleCaptionEdit = (id: string, newText: string) => {
    if (!commitTimerRef.current) {
      commitHistory(captions);
    } else {
      clearTimeout(commitTimerRef.current);
    }
    commitTimerRef.current = setTimeout(() => {
      commitTimerRef.current = null;
    }, 1000);

    setCaptions(prev => prev.map(c => c.id === id ? { ...c, text: newText } : c));
  };

  const handleCaptionBlur = () => {
    if (commitTimerRef.current) {
      clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
  };

  const handleDeleteCaption = (id: string) => {
    commitHistory(captions);
    setCaptions(prev => prev.filter(c => c.id !== id));
  };

  const handleMergeNext = (id: string) => {
    commitHistory(captions);
    setCaptions(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      
      const current = prev[idx];
      const next = prev[idx + 1];
      
      const mergedWords = (current.words && next.words) 
        ? [...current.words, ...next.words] 
        : (current.words || next.words || []);

      const merged: CaptionChunk = {
        id: current.id,
        text: `${current.text} ${next.text}`.trim(),
        start: current.start,
        end: next.end,
        words: mergedWords
      };

      const newCaptions = [...prev];
      newCaptions.splice(idx, 2, merged);
      return newCaptions;
    });
  };

  const handleSplitCaption = (id: string, splitIndex: number) => {
    commitHistory(captions);
    setCaptions(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      
      const chunk = prev[idx];
      const text1 = chunk.text.slice(0, splitIndex).trim();
      const text2 = chunk.text.slice(splitIndex).trim();
      
      if (!text1 || !text2) return prev;

      let splitTime: number;
      let words1: CaptionWord[] = [];
      let words2: CaptionWord[] = [];

      if (chunk.words && chunk.words.length > 0) {
        let currentPos = 0;
        let splitWordIdx = -1;

        for (let i = 0; i < chunk.words.length; i++) {
          const w = chunk.words[i];
          const wLen = w.word.trim().length;
          currentPos += wLen;

          if (currentPos >= text1.replace(/\s+/g, '').length) {
            splitWordIdx = i;
            break;
          }
        }

        if (splitWordIdx !== -1 && splitWordIdx < chunk.words.length - 1) {
          splitTime = chunk.words[splitWordIdx].end;
          words1 = chunk.words.slice(0, splitWordIdx + 1);
          words2 = chunk.words.slice(splitWordIdx + 1);
        } else {
          const ratio = text1.length / (text1.length + text2.length);
          splitTime = chunk.start + (chunk.end - chunk.start) * ratio;
        }
      } else {
        const ratio = text1.length / (text1.length + text2.length);
        splitTime = chunk.start + (chunk.end - chunk.start) * ratio;
      }

      const chunk1: CaptionChunk = {
        id: chunk.id,
        text: text1,
        start: chunk.start,
        end: splitTime,
        words: words1
      };

      const chunk2: CaptionChunk = {
        id: `${chunk.id}_split_${Date.now()}`,
        text: text2,
        start: splitTime,
        end: chunk.end,
        words: words2
      };

      const newCaptions = [...prev];
      newCaptions.splice(idx, 1, chunk1, chunk2);
      return newCaptions;
    });
  };

  const handleAutoSplit = () => {
    commitHistory(captions);
    setCaptions(prev => {
      const newCaptions: CaptionChunk[] = [];
      for (const cap of prev) {
        const words = cap.text.trim().split(/\s+/);
        if (words.length <= 4) {
          newCaptions.push(cap);
          continue;
        }

        const chunks: string[] = [];
        let currentChunk: string[] = [];
        for (const w of words) {
          currentChunk.push(w);
          if (currentChunk.length >= 3) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
          }
        }
        if (currentChunk.length > 0) {
          if (chunks.length > 0 && currentChunk.length < 2) {
            chunks[chunks.length - 1] += ' ' + currentChunk.join(' ');
          } else {
            chunks.push(currentChunk.join(' '));
          }
        }

        const totalChars = cap.text.replace(/\s+/g, '').length || 1;
        const totalDuration = cap.end - cap.start;
        let currentTime = cap.start;

        chunks.forEach((chunkText, i) => {
          const chunkChars = chunkText.replace(/\s+/g, '').length;
          const chunkDuration = (chunkChars / totalChars) * totalDuration;
          const endTime = (i === chunks.length - 1) ? cap.end : (currentTime + chunkDuration);
          
          newCaptions.push({
            id: i === 0 ? cap.id : `${cap.id}_autosplit_${i}_${Date.now()}`,
            text: chunkText,
            start: currentTime,
            end: endTime,
            words: cap.words 
          });
          
          currentTime = endTime;
        });
      }
      return newCaptions;
    });
  };

  const handleTimeChange = (id: string, field: 'start' | 'end', value: number) => {
    commitHistory(captions);
    setCaptions(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      
      const newArray = [...prev];
      const chunk = { ...newArray[idx] };
      
      let maxTime = videoRef.current?.duration || Infinity;
      let val = Math.max(0, Math.min(value, maxTime));
      
      if (field === 'start') {
        if (idx > 0 && val < newArray[idx - 1].end) val = newArray[idx - 1].end;
        if (chunk.end - val < 0.2) val = chunk.end - 0.2;
        chunk.start = val;
      } else {
        if (idx < newArray.length - 1 && val > newArray[idx + 1].start) val = newArray[idx + 1].start;
        if (val - chunk.start < 0.2) val = chunk.start + 0.2;
        chunk.end = val;
      }
      
      newArray[idx] = chunk;
      return newArray;
    });
  };

  const handleExport = async () => {
    if (!videoFile || captions.length === 0) return;
    
    if (releaseAI && asrClientRef.current) {
      asrClientRef.current.terminate();
      asrClientRef.current = null;
      setWorkerState('IDLE');
      await new Promise(r => setTimeout(r, 1000));
    }

    if (exportWorkerRef.current) {
      exportWorkerRef.current.terminate();
    }
    
    const version = new Date().getTime();
    const worker = new Worker(`/workers/caption-export.worker.js?v=${version}`, {
      type: 'module'
    });
    exportWorkerRef.current = worker;
    
    setExportProgress({ status: 'PREPARING' });
    
    worker.onmessage = (e: MessageEvent<ExportWorkerResponse>) => {
      const res = e.data;
      if (res.type === 'PROGRESS' && res.progress) {
        setExportProgress(res.progress);
      } else if (res.type === 'DONE' && res.blob) {
        setExportProgress({ status: 'DONE' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(res.blob);
        a.download = `captioned_${videoFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        setTimeout(() => setExportProgress(null), 3000);
      } else if (res.type === 'ERROR') {
        setError(res.error || 'Export failed');
        setExportProgress(null);
      }
    };
    
    worker.onerror = (e) => {
      setError(`Worker error: ${e.message}`);
      setExportProgress(null);
    };

    worker.postMessage({
      type: 'START_EXPORT',
      file: videoFile,
      captions,
      fonts: fontPayloads,
      globalStyle,
      globalPosition
    } as ExportWorkerRequest);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden file input for file picker triggers */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="video/mp4,video/quicktime,video/webm" 
        onChange={handleFileInputChange} 
        className="hidden" 
        id="video-upload" 
        disabled={workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING'}
      />

      {/* AI Engine Status & Progress Card */}
      <AIProcessingCard 
        workerState={workerState}
        initProgress={initProgress}
        error={error}
        capabilities={capabilities}
        onRetry={handleRetryAI}
      />

      {/* Upload State: Modern interactive dropzone when no video is loaded */}
      {!videoUrl ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group rounded-3xl border-2 transition-all duration-300 p-8 sm:p-14 text-center overflow-hidden ${
            isDragging 
              ? 'border-blue-500 bg-blue-500/10 shadow-2xl shadow-blue-500/20 scale-[1.01]' 
              : workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING'
              ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
              : 'border-dashed border-slate-300 dark:border-slate-700/80 hover:border-blue-500/70 bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-[#080e22]/95 dark:to-[#040814]/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10'
          }`}
        >
          {/* Ambient corner glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
            {/* Gradient Upload Icon */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300 ${
              isDragging
                ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white scale-110 shadow-blue-500/30'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/35'
            }`}>
              <UploadCloud className="w-10 h-10 motion-safe:group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {isDragging ? "Drop your video right here" : "Choose a video to caption"}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-md">
              Drag and drop your video file here, or click below. Speech is recognized and timed on your device using on-device AI.
            </p>

            {/* CTAs: Browse Video + Try Sample */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 w-full sm:w-auto">
              <label 
                htmlFor="video-upload" 
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-200 h-12 px-8 shadow-lg shadow-blue-600/25 ${
                  workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING' 
                    ? 'opacity-60 cursor-not-allowed bg-slate-300 dark:bg-slate-800 text-slate-500 pointer-events-none' 
                    : 'cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Select Video (Max 60s)</span>
              </label>

              <button
                type="button"
                onClick={handleLoadSample}
                disabled={workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all duration-200 h-12 px-6 bg-white dark:bg-[#0e1738] text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current text-blue-500" />
                <span>Try with sample reel</span>
              </button>
            </div>

            {/* Format Badges & Constraints */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 font-medium">
                <Film className="w-3.5 h-3.5 text-blue-500" />
                MP4, WebM, MOV
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Up to 60 seconds
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Never leaves device
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Video Loaded State: Sleek Header Toolbar & 2-Column Editor Studio */
        <div className="space-y-6">
          {/* Top Video Toolbar */}
          <div className="bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <FileVideo className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {videoFile?.name || 'Selected Video'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  {videoFile && <span>{formatFileSize(videoFile.size)}</span>}
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {captions.length > 0 ? `${captions.length} captions generated` : 'Processing...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {captions.length > 0 && (
                <>
                  <button 
                    onClick={handleUndo} 
                    disabled={undoStack.length === 0 || exportProgress !== null}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors disabled:opacity-40"
                    title="Undo caption edit"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                  <button 
                    onClick={handleRedo} 
                    disabled={redoStack.length === 0 || exportProgress !== null}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors disabled:opacity-40"
                    title="Redo caption edit"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Redo</span>
                  </button>
                  {aiOriginalCaptions && (
                    <button 
                      onClick={handleResetAI} 
                      disabled={exportProgress !== null}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors disabled:opacity-40"
                      title="Reset all captions to original AI speech recognition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset to AI</span>
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={workerState === 'TRANSCRIBING' || exportProgress !== null}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors disabled:opacity-40 ml-2"
              >
                <Video className="w-3.5 h-3.5 text-blue-500" />
                <span>Choose Another Video</span>
              </button>
            </div>
          </div>

          {/* 2-Column Studio: Left Video Preview + Export, Right Editor Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Video Preview & Export CTA */}
            <div className="lg:col-span-6 sticky top-4 flex flex-col gap-4">
              <div className="bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
                <VideoPreview 
                  videoUrl={videoUrl}
                  captions={captions}
                  videoRef={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  globalStyle={globalStyle}
                  globalPosition={globalPosition}
                  onPositionChange={setGlobalPosition}
                />
              </div>

              {captions.length > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    disabled={exportProgress !== null}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:via-indigo-700 hover:to-sky-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {exportProgress ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                        <span>Exporting MP4... ({exportProgress.status})</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export MP4 Video</span>
                      </>
                    )}
                  </button>

                  {process.env.NODE_ENV === 'development' && (
                    <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <input 
                        type="checkbox" 
                        checked={releaseAI}
                        onChange={(e) => setReleaseAI(e.target.checked)}
                      />
                      <span>[DEV TEST ONLY] Release AI before export (GPU contention test)</span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Editor Sidebar */}
            <div className="lg:col-span-6 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
              {workerState === 'TRANSCRIBING' ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 animate-pulse">
                    <Sparkles className="w-7 h-7 motion-safe:animate-spin [animation-duration:6s]" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    Recognizing speech &amp; timestamps
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    Whisper is transcribing audio on your device using WebGPU hardware acceleration...
                  </p>
                </div>
              ) : (
                <EditorSidebar 
                  captions={captions}
                  activeCaptionId={activeCaptionId}
                  workerState={workerState}
                  onCaptionClick={handleCaptionClick}
                  onCaptionEdit={handleCaptionEdit}
                  onCaptionBlur={handleCaptionBlur}
                  onDelete={handleDeleteCaption}
                  onMergeNext={handleMergeNext}
                  onSplit={handleSplitCaption}
                  onAutoSplit={handleAutoSplit}
                  onTimeChange={handleTimeChange}
                  disabled={exportProgress !== null}
                  globalStyle={globalStyle}
                  onStyleChange={(newStyle) => {
                    setGlobalStyle(newStyle);
                    const entry = Object.entries(PRESETS).find(([_, s]) => JSON.stringify(s) === JSON.stringify(newStyle));
                    if (entry) {
                      localStorage.setItem('captionStudioPreset', entry[0]);
                    }
                  }}
                  onPresetSelect={(presetName) => {
                    if (PRESETS[presetName]) {
                      setGlobalStyle(PRESETS[presetName]);
                      localStorage.setItem('captionStudioPreset', presetName);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
