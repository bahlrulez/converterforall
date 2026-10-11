import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CaptionChunk } from '@/lib/caption-studio/types';
import { renderCaptionToCanvas } from '@/lib/caption-studio/caption-renderer';
import { StyleSettings, PositionSettings } from '@/lib/caption-studio/style-types';
import { Maximize, Minimize } from 'lucide-react';

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
  onToggleFullscreen: externalToggleFullscreen
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
        className={`relative w-full overflow-hidden bg-black touch-none flex items-center justify-center transition-all ${
          isFullscreen 
            ? 'fixed inset-0 w-screen h-screen max-h-screen rounded-none border-none z-[99999]' 
            : 'aspect-video md:aspect-[9/16] max-h-[60vh] rounded-lg border'
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
          controls={!isDragging} // disable controls while dragging
          controlsList="nofullscreen" // hide native fullscreen button
          onTimeUpdate={onTimeUpdate}
          className="w-full h-full object-contain pointer-events-auto"
          playsInline
        />

        {/* Subtitle / Caption Overlay Canvas (always positioned above video in fullscreen) */}
        <canvas 
          ref={canvasRef}
          className="caption-overlay absolute inset-0 w-full h-full object-contain pointer-events-none z-[9999]"
          aria-hidden="true"
        />

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

