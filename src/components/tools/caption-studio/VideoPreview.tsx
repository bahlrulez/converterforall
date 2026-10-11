import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CaptionChunk } from '@/lib/caption-studio/types';
import { renderCaptionToCanvas } from '@/lib/caption-studio/caption-renderer';
import { StyleSettings, PositionSettings } from '@/lib/caption-studio/style-types';
import { Maximize, Minimize, Sparkles } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  captions: CaptionChunk[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
  globalStyle: StyleSettings;
  globalPosition: PositionSettings;
  onPositionChange: (pos: PositionSettings) => void;
  previewContainerRef?: React.RefObject<HTMLDivElement | null>;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isTranscribing?: boolean;
}

export function VideoPreview({ 
  videoUrl, 
  captions, 
  videoRef, 
  onTimeUpdate, 
  globalStyle, 
  globalPosition, 
  onPositionChange,
  previewContainerRef,
  isFullscreen: externalIsFullscreen,
  onToggleFullscreen: externalToggleFullscreen,
  isTranscribing = false
}: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = previewContainerRef || internalContainerRef;
  const animationRef = useRef<number | null>(null);
  
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const isFullscreen = externalIsFullscreen !== undefined ? externalIsFullscreen : internalIsFullscreen;

  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Cycling step indicator for engaging AI feedback during transcription
  const [activeStep, setActiveStep] = useState(1);
  useEffect(() => {
    if (!isTranscribing) {
      setActiveStep(1);
      return;
    }
    const timer1 = setTimeout(() => setActiveStep(2), 2200);
    const timer2 = setTimeout(() => setActiveStep(3), 5200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTranscribing]);

  const stepText = activeStep === 1 
    ? 'AI Analyzing Audio Streams...' 
    : activeStep === 2 
    ? 'Decoding Neural Phonemes...' 
    : 'Generating Timed Captions...';

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(async () => {
    if (externalToggleFullscreen) {
      externalToggleFullscreen();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const isCurrentlyFs = Boolean(
      document.fullscreenElement || 
      (document as any).webkitFullscreenElement
    );

    if (!isCurrentlyFs) {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error('Fullscreen request error:', err);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (err) {
        console.error('Exit fullscreen error:', err);
      }
    }
  }, [containerRef, externalToggleFullscreen]);

  // Sync fullscreen state & Hijack native video requestFullscreen
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = document.fullscreenElement === containerRef.current ||
        (document as any).webkitFullscreenElement === containerRef.current;
      setInternalIsFullscreen(Boolean(isFs));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    const video = videoRef.current;
    const container = containerRef.current;
    let origRequestFs: any = null;
    let origWebkitRequestFs: any = null;
    let origWebkitEnterFs: any = null;

    if (video && container) {
      origRequestFs = video.requestFullscreen?.bind(video);
      origWebkitRequestFs = (video as any).webkitRequestFullscreen?.bind(video);
      origWebkitEnterFs = (video as any).webkitEnterFullscreen?.bind(video);

      const requestContainerFs = async (options?: FullscreenOptions) => {
        if (container.requestFullscreen) {
          return container.requestFullscreen(options);
        } else if ((container as any).webkitRequestFullscreen) {
          return (container as any).webkitRequestFullscreen();
        } else if (origRequestFs) {
          return origRequestFs(options);
        }
      };

      video.requestFullscreen = requestContainerFs as any;
      if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen = requestContainerFs;
      }
      if ((video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen = requestContainerFs;
      }
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      if (video) {
        if (origRequestFs) video.requestFullscreen = origRequestFs;
        if (origWebkitRequestFs) (video as any).webkitRequestFullscreen = origWebkitRequestFs;
        if (origWebkitEnterFs) (video as any).webkitEnterFullscreen = origWebkitEnterFs;
      }
    };
  }, [containerRef, videoRef]);

  // Keyboard shortcut: 'f' or 'F' toggles fullscreen when not typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderLoop = () => {
      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentTime = video.currentTime;
      const activeCaption = captions.find(c => currentTime >= c.start && currentTime <= c.end);

      if (activeCaption && video.videoWidth > 0 && video.videoHeight > 0) {
        renderCaptionToCanvas(ctx, activeCaption, canvas.width, canvas.height, globalStyle, globalPosition);
      }

      // Draw Center Snap Guides if dragging
      if (isDragging) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        
        // Vertical center line
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        // Horizontal center line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    animationRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [captions, videoRef, globalStyle, globalPosition, isDragging]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updatePosition = (e: React.PointerEvent) => {
    if (!containerRef.current || !videoRef.current || !videoRef.current.videoWidth) return;
    
    // Calculate actual video bounding box inside container (handles letterbox/pillarbox)
    const container = containerRef.current.getBoundingClientRect();
    const videoRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
    const containerRatio = container.width / container.height;

    let renderWidth = container.width;
    let renderHeight = container.height;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > containerRatio) {
      // Letterbox (top/bottom bars)
      renderHeight = container.width / videoRatio;
      offsetY = (container.height - renderHeight) / 2;
    } else {
      // Pillarbox (left/right bars)
      renderWidth = container.height * videoRatio;
      offsetX = (container.width - renderWidth) / 2;
    }

    // Mouse position relative to container
    const mouseX = e.clientX - container.left;
    const mouseY = e.clientY - container.top;

    // Convert to relative video coordinates (0.0 to 1.0)
    let nx = (mouseX - offsetX) / renderWidth;
    let ny = (mouseY - offsetY) / renderHeight;

    // Clamp
    nx = Math.max(0, Math.min(1, nx));
    ny = Math.max(0, Math.min(1, ny));

    // Snap to center (within 3% radius)
    if (Math.abs(nx - 0.5) < 0.03) nx = 0.5;
    if (Math.abs(ny - 0.5) < 0.03) ny = 0.5;

    onPositionChange({ x: nx, y: ny });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Dedicated Preview Container Wrapping Video, Canvas Caption Overlay, Safe Zones, and Controls */}
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        id="video-preview-wrapper"
        data-fullscreen={isFullscreen}
        className={`relative w-full overflow-hidden bg-black touch-none flex items-center justify-center transition-all ${
          isFullscreen 
            ? 'w-full h-full max-h-none rounded-none border-none' 
            : 'aspect-video md:aspect-[9/16] max-h-[42vh] sm:max-h-[46vh] rounded-xl border border-slate-800 shadow-inner'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') {
            toggleFullscreen();
          }
        }}
      >
        <video 
          ref={videoRef}
          src={videoUrl} 
          controls={!isDragging && !isTranscribing} // disable controls while dragging or transcribing
          controlsList="nofullscreen" // hide native fullscreen button
          onTimeUpdate={onTimeUpdate}
          className="w-full h-full object-contain pointer-events-auto"
          playsInline
        />

        {/* Subtitle / Caption Overlay Canvas (always positioned above video in fullscreen) */}
        <canvas 
          ref={canvasRef}
          className="caption-overlay absolute inset-0 w-full h-full object-contain pointer-events-none z-[9999]"
          style={{ position: 'absolute', zIndex: 9999 }}
          aria-hidden="true"
        />

        {/* Engaging Animated AI Speech Recognition Status Overlay */}
        {isTranscribing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none text-center">
            {/* Ambient Pulsing Aura */}
            <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-600/35 via-indigo-500/25 to-purple-600/35 blur-2xl animate-pulse pointer-events-none -z-10" />

            {/* Glowing Center AI Sparkle Badge */}
            <div className="relative mb-3">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 opacity-75 blur-sm animate-pulse" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 border border-white/20">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 motion-safe:animate-spin [animation-duration:8s] text-white" />
              </div>
            </div>

            {/* Pulsing Animated Soundwave Equalizer */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-7 sm:h-8 mb-2.5" aria-hidden="true">
              {[35, 65, 95, 55, 100, 75, 90, 45, 80, 60, 40].map((h, idx) => (
                <span
                  key={idx}
                  className="w-1 sm:w-1.5 bg-gradient-to-t from-blue-500 via-indigo-400 to-sky-300 rounded-full animate-soundwave"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(idx * 110) % 800}ms`,
                    animationDuration: '1.1s'
                  }}
                />
              ))}
            </div>

            {/* Phased Step Indicator */}
            <div className="space-y-1 max-w-xs px-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block" />
                <span>{stepText}</span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-tight">
                Whisper AI is recognizing speech &amp; timestamps on your device.
              </p>
            </div>

            {/* Step Progression Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 text-[10px] text-slate-400 font-medium">
              <span className={`px-2 py-0.5 rounded-full ${activeStep >= 1 ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40 font-semibold' : 'bg-white/5 text-slate-500'}`}>
                1. Audio Extraction
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-full ${activeStep >= 2 ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40 font-semibold' : 'bg-white/5 text-slate-500'}`}>
                2. Neural Speech
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-full ${activeStep >= 3 ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40 font-semibold' : 'bg-white/5 text-slate-500'}`}>
                3. Captions
              </span>
            </div>
          </div>
        )}

        {/* Safe Zones Overlay */}
        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none border-[2px] border-red-500/50 m-2 z-[9998]">
            {/* Top 10% */}
            <div className="absolute top-0 w-full h-[10%] bg-red-500/20 flex items-center justify-center text-[10px] text-white">Safe Zone Limit</div>
            {/* Bottom 20% */}
            <div className="absolute bottom-0 w-full h-[20%] bg-red-500/20 flex items-center justify-center text-[10px] text-white">Safe Zone Limit</div>
            {/* Right edge small margin */}
            <div className="absolute right-0 w-[5%] h-full bg-red-500/20"></div>
          </div>
        )}

        {/* Custom Fullscreen Overlay Button */}
        <div 
          className={`absolute top-3 right-3 z-[10000] transition-opacity duration-200 ${
            isHovering || isFullscreen ? 'opacity-100' : 'opacity-0 md:opacity-75 hover:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            title={isFullscreen ? 'Exit Full Screen (Esc / F)' : 'Enter Full Screen (F)'}
            aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="p-2 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform active:scale-95 flex items-center justify-center pointer-events-auto cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-white" />
            ) : (
              <Maximize className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
      
      {/* Controls toolbar below preview */}
      <div className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg border">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={showSafeZones} 
            onChange={(e) => setShowSafeZones(e.target.checked)} 
          />
          <span>Show Reels/TikTok Safe Zones</span>
        </label>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Drag text to position
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors active:scale-95 cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen (Esc / F)' : 'Enter Full Screen (F)'}
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5 text-blue-500" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5 text-blue-500" />
                <span>Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

