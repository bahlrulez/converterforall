"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  Monitor, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ScreenRecorder() {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused" | "stopped">("idle");
  const [includeMic, setIncludeMic] = useState<boolean>(true);
  const [includeSystemAudio, setIncludeSystemAudio] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Timer ticker
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setErrorMsg("");
    chunksRef.current = [];
    setRecordedBlob(null);
    setRecordedUrl(null);
    setDuration(0);

    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("Screen recording is not supported in this browser. Please use Chrome, Edge, or Firefox on desktop.");
      }

      // 1. Capture screen video + optional system audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          frameRate: { ideal: 30, max: 60 }
        },
        audio: includeSystemAudio
      });

      let finalStream = displayStream;

      // 2. Mix microphone audio if requested
      if (includeMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          });

          const audioContext = new AudioContext();
          const destination = audioContext.createMediaStreamDestination();

          // Add display audio tracks if present
          if (displayStream.getAudioTracks().length > 0) {
            const displaySource = audioContext.createMediaStreamSource(new MediaStream(displayStream.getAudioTracks()));
            displaySource.connect(destination);
          }

          // Add mic audio track
          const micSource = audioContext.createMediaStreamSource(micStream);
          micSource.connect(destination);

          // Combined stream with video from display and mixed audio
          finalStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
        } catch (micErr) {
          console.warn("Microphone access denied or unavailable:", micErr);
        }
      }

      streamRef.current = finalStream;

      // Listen for user clicking "Stop sharing" on native browser pill
      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopRecording();
        };
      }

      // 3. Determine best supported MIME type
      const mimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4"
      ];
      const supportedMime = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "video/webm";

      const recorder = new MediaRecorder(finalStream, { mimeType: supportedMime });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: supportedMime });
        const url = URL.createObjectURL(fullBlob);
        setRecordedBlob(fullBlob);
        setRecordedUrl(url);
        setRecordingState("stopped");

        // Clean up tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // chunk every second
      setRecordingState("recording");
    } catch (err: any) {
      console.error("Failed to start screen recording:", err);
      if (err.name !== "NotAllowedError") {
        setErrorMsg(err.message || "Failed to start recording. Please grant screen recording permissions.");
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === "recording" || recordingState === "paused")) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleReset = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingState("idle");
    setDuration(0);
  };

  const handleDownload = () => {
    if (!recordedUrl || !recordedBlob) return;
    const isMp4 = recordedBlob.type.includes("mp4");
    const filename = `Screen_Recording_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.${isMp4 ? "mp4" : "webm"}`;
    
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Recording Stage Box */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0a1128]/95 p-6 sm:p-10 shadow-xl relative overflow-hidden text-center">
        
        {/* State: IDLE */}
        {recordingState === "idle" && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Monitor className="w-10 h-10" />
            </div>

            <div className="max-w-md">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Ready to Record Your Screen
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Capture your entire screen, specific application window, or browser tab in full HD. 100% free, private, and on-device.
              </p>
            </div>

            {/* Audio Toggle Options */}
            <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-50 dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeMic}
                  onChange={(e) => setIncludeMic(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Mic className="w-3.5 h-3.5 text-blue-500" />
                <span>Microphone Audio</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSystemAudio}
                  onChange={(e) => setIncludeSystemAudio(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>System / Tab Audio</span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              size="lg"
              onClick={startRecording}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25"
            >
              <Video className="w-4 h-4 mr-2" />
              <span>Start Recording</span>
            </Button>
          </div>
        )}

        {/* State: RECORDING / PAUSED */}
        {(recordingState === "recording" || recordingState === "paused") && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="relative">
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center transition-all",
                recordingState === "recording" 
                  ? "bg-rose-500/10 border-2 border-rose-500 text-rose-500 animate-pulse" 
                  : "bg-amber-500/10 border-2 border-amber-500 text-amber-500"
              )}>
                <span className="text-2xl font-black font-mono tracking-wider">
                  {formatTime(duration)}
                </span>
              </div>
              <span className={cn(
                "absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                recordingState === "recording" ? "bg-rose-500 animate-ping" : "bg-amber-500"
              )} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {recordingState === "recording" ? "Recording in Progress..." : "Recording Paused"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You can pause, resume, or finish recording anytime.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {recordingState === "recording" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pauseRecording}
                  className="rounded-xl border-slate-300 dark:border-slate-700 font-bold text-xs"
                >
                  <Pause className="w-3.5 h-3.5 mr-1.5" />
                  Pause
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resumeRecording}
                  className="rounded-xl border-slate-300 dark:border-slate-700 font-bold text-xs"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  Resume
                </Button>
              )}

              <Button
                size="sm"
                onClick={stopRecording}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20"
              >
                <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Stop &amp; Review
              </Button>
            </div>
          </div>
        )}

        {/* State: STOPPED / REVIEW */}
        {recordingState === "stopped" && recordedUrl && (
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recording Complete ({formatTime(duration)})</span>
            </div>

            {/* Video Player Preview */}
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-lg">
              <video
                ref={previewVideoRef}
                src={recordedUrl}
                controls
                autoPlay
                className="w-full max-h-[380px] object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="rounded-xl border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Record New Video
              </Button>

              <Button
                onClick={handleDownload}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Recording
              </Button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
