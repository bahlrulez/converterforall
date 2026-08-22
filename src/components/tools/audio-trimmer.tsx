"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { UploadCloud, Download, Scissors, Loader2, X, Info, Play, Pause, ShieldCheck } from "lucide-react";
import { Mp3Encoder } from '@breezystack/lamejs';
import { useDropzone } from "react-dropzone";
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

export default function AudioTrimmerComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trimStatus, setTrimStatus] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const wsRegions = useRef<RegionsPlugin | null>(null);

  // Initialize Wavesurfer when a file is selected
  useEffect(() => {
    if (!file || !containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#94a3b8',
      progressColor: '#3b82f6',
      cursorColor: '#1d4ed8',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 120,
      normalize: true,
    });

    const regions = ws.registerPlugin(RegionsPlugin.create());
    
    ws.on('ready', () => {
      const duration = ws.getDuration();
      // Add a default region that covers the middle 50%
      const start = duration * 0.25;
      const end = duration * 0.75;
      
      regions.addRegion({
        start: start,
        end: end,
        color: 'rgba(59, 130, 246, 0.2)',
        drag: true,
        resize: true,
      });
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    const objectUrl = URL.createObjectURL(file);
    ws.load(objectUrl);
    
    wavesurfer.current = ws;
    wsRegions.current = regions;

    return () => {
      ws.destroy();
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setTrimStatus(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac"]
    },
    maxFiles: 1,
  });

  const togglePlay = () => {
    if (!wavesurfer.current) return;
    
    if (wavesurfer.current.isPlaying()) {
      wavesurfer.current.pause();
    } else {
      // If we have a region, play just the region
      const regions = wsRegions.current?.getRegions();
      if (regions && regions.length > 0) {
        regions[0].play();
      } else {
        wavesurfer.current.play();
      }
    }
  };

  const handleExport = async () => {
    if (!file || !wsRegions.current) return;
    
    const regions = wsRegions.current.getRegions();
    if (regions.length === 0) return;
    
    const region = regions[0];
    setIsProcessing(true);
    setError(null);
    setTrimStatus("Decoding audio file...");

    try {
      // 1. Decode Audio (Force 44100Hz for lamejs compatibility)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext({ sampleRate: 44100 });
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 2. Slice PCM Data
      setTrimStatus("Slicing selected region...");
      const startSample = Math.floor(region.start * audioBuffer.sampleRate);
      const endSample = Math.floor(region.end * audioBuffer.sampleRate);

      const channels: Float32Array[] = [];
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i).slice(startSample, endSample));
      }

      // Convert Float32 to Int16 for LameJS
      const convertBuffer = (buffer: Float32Array) => {
        const l = buffer.length;
        const result = new Int16Array(l);
        for (let i = 0; i < l; i++) {
          const s = Math.max(-1, Math.min(1, buffer[i]));
          result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return result;
      };

      setTrimStatus("Encoding to MP3 (High Quality)...");
      
      // Let React update the UI before blocking the main thread
      await new Promise(resolve => setTimeout(resolve, 50));

      const left = convertBuffer(channels[0]);
      const right = channels.length > 1 ? convertBuffer(channels[1]) : null;
      
      const numChannels = Math.min(2, channels.length);
      const mp3encoder = new Mp3Encoder(numChannels, audioBuffer.sampleRate, 192); // 192kbps
      
      const mp3Data: Int8Array[] = [];
      const sampleBlockSize = 1152;
      
      for (let i = 0; i < left.length; i += sampleBlockSize) {
        const leftChunk = left.subarray(i, i + sampleBlockSize);
        let mp3buf;
        
        if (numChannels === 1 || !right) {
          mp3buf = mp3encoder.encodeBuffer(leftChunk);
        } else {
          const rightChunk = right.subarray(i, i + sampleBlockSize);
          mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
        }
        
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }
      const finalBuf = mp3encoder.flush();
      if (finalBuf.length > 0) {
        mp3Data.push(finalBuf);
      }

      // 3. Download
      setTrimStatus("Done!");
      const blob = new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || "audio";
      link.download = `${originalName}-trimmed.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
      setTrimStatus(null);
      
    } catch (err: any) {
      console.error("Audio processing error:", err);
      setError(`Error: ${err.message || err.toString()}`);
      setIsProcessing(false);
      setTrimStatus(null);
    }
  };

  const resetAll = () => {
    setFile(null);
    setError(null);
    setTrimStatus(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!file ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px]
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Drop your audio file here
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Supports MP3, WAV, OGG, and M4A. We'll load the waveform securely inside your browser. No files are uploaded to our servers.
            </p>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              Select Audio File
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="truncate">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">{file.name}</h3>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Local Processing</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>

          {/* Editor Workspace */}
          <div className="p-6">
            <div className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> 
              Drag the blue handles to select the section you want to keep.
            </div>

            {/* Waveform Container */}
            <div className="bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 relative">
              <div ref={containerRef} className="w-full relative z-10" />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <button 
                onClick={togglePlay}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? "Pause Preview" : "Play Selection"}
              </button>

              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="w-full md:w-2/3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {trimStatus || "Processing..."}
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export Selected to MP3
                  </>
                )}
              </button>

            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
