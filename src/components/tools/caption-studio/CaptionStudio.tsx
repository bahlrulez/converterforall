"use client";

import React, { useState, useEffect, useRef } from 'react';
import { checkBrowserCapabilities, isASRReady } from '@/lib/caption-studio/capabilities';
import { ASRClient } from '@/lib/caption-studio/asr-client';
import { extractAudioFromVideo } from '@/lib/caption-studio/audio-extractor';
import { ASRResult, WorkerState, CaptionChunk } from '@/lib/caption-studio/types';
import { segmentCaptions } from '@/lib/caption-studio/segmentation';
import { EditorSidebar } from './EditorSidebar';
import { VideoPreview } from './VideoPreview';
import { ExportProgress, ExportWorkerRequest, ExportWorkerResponse } from '@/lib/caption-studio/export-utils';
import { StyleSettings, PositionSettings } from '@/lib/caption-studio/style-types';
import { DEFAULT_STYLE, DEFAULT_POSITION } from '@/lib/caption-studio/caption-renderer';
import { PRESETS } from '@/lib/caption-studio/presets';
import { useFontLoader } from '@/lib/caption-studio/useFontLoader';

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const exportWorkerRef = useRef<Worker | null>(null);
  const commitTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const getStatusText = () => {
    if (error) return <span className="text-destructive font-medium">Error: {error}</span>;
    switch (workerState) {
      case 'IDLE': return "AI engine is ready when you select a video.";
      case 'INITIALIZING': 
        if (initProgress) {
          if (initProgress.status === 'download' || initProgress.status === 'progress') {
            const pct = initProgress.progress ? Math.round(initProgress.progress) + '%' : '';
            return `Downloading AI model... ${initProgress.file || ''} ${pct}`;
          } else if (initProgress.status === 'done' || initProgress.status === 'ready') {
            return "Loading model into WebGPU...";
          }
          return `Preparing AI model: ${initProgress.status}...`;
        }
        return "Preparing AI model (this may take a minute on first load)...";
      case 'READY': return "AI Engine Ready. Please upload a video.";
      case 'TRANSCRIBING': return "Transcribing Hindi audio... Please wait.";
      case 'ERROR': return "An error occurred with the AI Engine.";
      default: return "";
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
    }, 500);

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
      if (idx === -1 || idx === prev.length - 1) return prev;
      const current = prev[idx];
      const next = prev[idx + 1];
      const merged: CaptionChunk = {
        ...current,
        end: next.end,
        text: current.text + ' ' + next.text,
        words: [...current.words, ...next.words]
      };
      const newArray = [...prev];
      newArray.splice(idx, 2, merged);
      return newArray;
    });
  };

  const handleSplitCaption = (id: string, splitIndex: number) => {
    commitHistory(captions);
    setCaptions(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const current = prev[idx];
      
      const firstText = current.text.substring(0, splitIndex).trim();
      const secondText = current.text.substring(splitIndex).trim();
      
      if (!firstText || !secondText) return prev;
      
      const totalLen = current.text.length;
      const ratio = splitIndex / totalLen;
      const duration = current.end - current.start;
      
      let firstDuration = duration * ratio;
      if (firstDuration < 0.2) firstDuration = 0.2;
      if (duration - firstDuration < 0.2) firstDuration = duration - 0.2;
      if (firstDuration < 0.2) firstDuration = duration / 2;
      
      const midTime = current.start + firstDuration;
      
      const chunk1: CaptionChunk = {
        id: crypto.randomUUID(),
        start: current.start,
        end: midTime,
        text: firstText,
        words: current.words
      };
      const chunk2: CaptionChunk = {
        id: crypto.randomUUID(),
        start: midTime,
        end: current.end,
        text: secondText,
        words: current.words
      };
      
      const newArray = [...prev];
      newArray.splice(idx, 1, chunk1, chunk2);
      return newArray;
    });
  };

  const handleAutoSplit = () => {
    commitHistory(captions);
    setCaptions(prev => {
      const newCaptions: CaptionChunk[] = [];
      for (const cap of prev) {
        const text = cap.text.trim();
        const words = text.split(/\s+/).filter(Boolean);
        
        if (words.length <= 5 || text.length === 0) {
          newCaptions.push(cap);
          continue;
        }

        const duration = cap.end - cap.start;
        let numChunks = Math.ceil(words.length / 4);
        if (duration / numChunks < 0.2) {
           numChunks = Math.floor(duration / 0.2);
           if (numChunks <= 1) {
             newCaptions.push(cap);
             continue;
           }
        }
        
        const wordsPerChunk = Math.ceil(words.length / numChunks);
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += wordsPerChunk) {
          chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
        }

        const totalChars = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        let currentTime = cap.start;

        chunks.forEach((chunk, index) => {
          const ratio = chunk.length / totalChars;
          let chunkDuration = duration * ratio;
          
          let endTime = currentTime + chunkDuration;
          
          if (index === chunks.length - 1) {
            endTime = cap.end;
          }

          newCaptions.push({
            id: crypto.randomUUID(),
            start: currentTime,
            end: endTime,
            text: chunk,
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

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-muted p-4 rounded-lg flex items-center justify-between border">
        <div>
          <h2 className="text-lg font-bold">AI Status</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{getStatusText()}</p>
        </div>
        <div className="text-xs space-y-1 text-right text-muted-foreground hidden sm:block">
          <p>WebGPU: {capabilities?.webgpu ? "✅" : "❌"}</p>
          <p>WebWorker: {capabilities?.worker ? "✅" : "❌"}</p>
          <p>Privacy: Local Processing</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-card">
        <input 
          type="file" 
          accept="video/mp4,video/quicktime,video/webm" 
          onChange={handleFileDrop} 
          className="hidden" 
          id="video-upload" 
          disabled={workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING'}
        />
        <label 
          htmlFor="video-upload" 
          className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${workerState === 'INITIALIZING' || workerState === 'TRANSCRIBING' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {videoFile ? "Choose Another Video" : "Select Video (Max 60s)"}
        </label>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a video to start. First-time AI setup may take a little while.
        </p>
      </div>

      {videoUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="sticky top-4 flex flex-col gap-4">
            <h3 className="font-semibold mb-2 hidden">Video</h3>
            <VideoPreview 
              videoUrl={videoUrl}
              captions={captions}
              videoRef={videoRef}
              onTimeUpdate={handleTimeUpdate}
              globalStyle={globalStyle}
              globalPosition={globalPosition}
              onPositionChange={setGlobalPosition}
            />
            {captions.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={handleExport}
                  disabled={exportProgress !== null}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exportProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-b-transparent"></div>
                      Exporting... {exportProgress.status}
                    </>
                  ) : (
                    "Export MP4"
                  )}
                </button>
                {process.env.NODE_ENV === 'development' && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded-md border mt-2">
                    <input 
                      type="checkbox" 
                      checked={releaseAI}
                      onChange={(e) => setReleaseAI(e.target.checked)}
                    />
                    [DEV TEST ONLY] Release AI before export (GPU contention test)
                  </label>
                )}
              </div>
            )}
          </div>
          <div>
            {workerState === 'TRANSCRIBING' ? (
              <div className="bg-card border rounded-lg p-8 flex flex-col items-center justify-center h-96 sm:h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Transcribing... Please wait</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {captions.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                    <button 
                      onClick={handleUndo} 
                      disabled={undoStack.length === 0 || exportProgress !== null}
                      className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 disabled:opacity-50"
                    >
                      Undo
                    </button>
                    <button 
                      onClick={handleRedo} 
                      disabled={redoStack.length === 0 || exportProgress !== null}
                      className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 disabled:opacity-50"
                    >
                      Redo
                    </button>
                    <div className="flex-1"></div>
                    <button 
                      onClick={handleResetAI} 
                      disabled={!aiOriginalCaptions || exportProgress !== null}
                      className="text-xs px-2 py-1 text-destructive bg-destructive/10 rounded hover:bg-destructive/20 disabled:opacity-50"
                    >
                      Reset to AI
                    </button>
                  </div>
                )}
                <EditorSidebar 
                  captions={captions}
                  activeCaptionId={activeCaptionId}
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
                    // Also attempt to find preset name to save
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
