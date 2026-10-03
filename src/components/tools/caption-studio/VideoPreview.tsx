import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CaptionChunk } from '@/lib/caption-studio/types';
import { renderCaptionToCanvas } from '@/lib/caption-studio/caption-renderer';
import { StyleSettings, PositionSettings } from '@/lib/caption-studio/style-types';

interface VideoPreviewProps {
  videoUrl: string;
  captions: CaptionChunk[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
  globalStyle: StyleSettings;
  globalPosition: PositionSettings;
  onPositionChange: (pos: PositionSettings) => void;
}

export function VideoPreview({ 
  videoUrl, captions, videoRef, onTimeUpdate, globalStyle, globalPosition, onPositionChange 
}: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
        renderCaptionToCanvas(ctx, activeCaption, canvas.width, canvas.height, globalStyle, globalPosition, currentTime);
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
    
    // We need to calculate the actual video bounding box inside the container
    // because object-fit: contain can add letterboxing/pillarboxing.
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
      <div 
        ref={containerRef}
        className="relative w-full aspect-video md:aspect-[9/16] max-h-[60vh] rounded-lg overflow-hidden bg-black border touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <video 
          ref={videoRef}
          src={videoUrl} 
          controls={!isDragging} // disable controls while dragging
          onTimeUpdate={onTimeUpdate}
          className="w-full h-full object-contain pointer-events-auto"
          playsInline
        />
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          aria-hidden="true"
        />

        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none border-[2px] border-red-500/50 m-2">
            {/* Top 10% */}
            <div className="absolute top-0 w-full h-[10%] bg-red-500/20 flex items-center justify-center text-[10px] text-white">Safe Zone Limit</div>
            {/* Bottom 20% */}
            <div className="absolute bottom-0 w-full h-[20%] bg-red-500/20 flex items-center justify-center text-[10px] text-white">Safe Zone Limit</div>
            {/* Right edge small margin */}
            <div className="absolute right-0 w-[5%] h-full bg-red-500/20"></div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showSafeZones} 
            onChange={(e) => setShowSafeZones(e.target.checked)} 
          />
          Show Reels/TikTok Safe Zones
        </label>
        <div className="text-xs text-muted-foreground">
          Drag text to position
        </div>
      </div>
    </div>
  );
}
