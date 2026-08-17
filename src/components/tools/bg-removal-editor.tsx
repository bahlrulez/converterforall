"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Paintbrush, 
  Eraser, 
  RotateCcw, 
  Undo2, 
  Sparkles, 
  Eye, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Check,
  X,
  Move
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BgRemovalEditorProps {
  originalFile: File;
  processedBlob: Blob;
  downloadName?: string;
  onSave: (updatedBlob: Blob) => void;
  onClose: () => void;
}

export function BgRemovalEditor({
  originalFile,
  processedBlob,
  downloadName = "removed_bg.png",
  onSave,
  onClose
}: BgRemovalEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"restore" | "erase" | "pan">("restore");
  const [brushSize, setBrushSize] = useState<number>(35);
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showOriginal, setShowOriginal] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  // Stored image elements
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const processedImgRef = useRef<HTMLImageElement | null>(null);
  const offscreenOrigCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load and initialize canvases
  useEffect(() => {
    let isCancelled = false;

    const loadImages = async () => {
      try {
        const origUrl = URL.createObjectURL(originalFile);
        const procUrl = URL.createObjectURL(processedBlob);

        const origImg = new Image();
        const procImg = new Image();

        await Promise.all([
          new Promise<void>((resolve, reject) => {
            origImg.onload = () => resolve();
            origImg.onerror = reject;
            origImg.src = origUrl;
          }),
          new Promise<void>((resolve, reject) => {
            procImg.onload = () => resolve();
            procImg.onerror = reject;
            procImg.src = procUrl;
          })
        ]);

        if (isCancelled) return;

        originalImgRef.current = origImg;
        processedImgRef.current = procImg;

        // Create offscreen canvas for original image
        const offCanvas = document.createElement("canvas");
        offCanvas.width = origImg.width;
        offCanvas.height = origImg.height;
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
          offCtx.drawImage(origImg, 0, 0);
          offscreenOrigCanvasRef.current = offCanvas;
        }

        // Initialize main canvas with processed result
        const mainCanvas = canvasRef.current;
        if (mainCanvas) {
          mainCanvas.width = origImg.width;
          mainCanvas.height = origImg.height;
          const ctx = mainCanvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            ctx.drawImage(procImg, 0, 0);
            
            // Save initial state to history
            const initialData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
            setHistory([initialData]);
            setHistoryIndex(0);
          }
        }
      } catch (err) {
        console.error("Failed to load images in editor:", err);
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [originalFile, processedBlob]);

  // Save current state to undo history
  const pushState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(data);
    
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prevIndex = historyIndex - 1;
    const data = history[prevIndex];
    if (data) {
      ctx.putImageData(data, 0, 0);
      setHistoryIndex(prevIndex);
    }
  }, [history, historyIndex]);

  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    const procImg = processedImgRef.current;
    if (!canvas || !procImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(procImg, 0, 0);
    pushState();
  }, [pushState]);

  // Get canvas coordinates from mouse/touch event
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Perform drawing (Restore or Erase)
  const draw = (coords: { x: number; y: number }) => {
    if (tool === "pan") return;
    const canvas = canvasRef.current;
    const origCanvas = offscreenOrigCanvasRef.current;
    if (!canvas || !origCanvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const origCtx = origCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !origCtx) return;

    const radius = brushSize;

    if (tool === "erase") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (tool === "restore") {
      const startX = Math.max(0, Math.floor(coords.x - radius));
      const startY = Math.max(0, Math.floor(coords.y - radius));
      const endX = Math.min(canvas.width, Math.ceil(coords.x + radius));
      const endY = Math.min(canvas.height, Math.ceil(coords.y + radius));
      const width = endX - startX;
      const height = endY - startY;

      if (width <= 0 || height <= 0) return;

      const origData = origCtx.getImageData(startX, startY, width, height);
      const currData = ctx.getImageData(startX, startY, width, height);

      const oD = origData.data;
      const cD = currData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelX = startX + x;
          const pixelY = startY + y;
          const dist = Math.hypot(pixelX - coords.x, pixelY - coords.y);

          if (dist <= radius) {
            const idx = (y * width + x) * 4;
            const factor = 1 - (dist / radius);
            const strength = Math.min(1, Math.max(0, factor * 1.5));

            cD[idx] = oD[idx];         // Red
            cD[idx + 1] = oD[idx + 1]; // Green
            cD[idx + 2] = oD[idx + 2]; // Blue
            
            const targetAlpha = oD[idx + 3];
            cD[idx + 3] = Math.max(cD[idx + 3], Math.round(targetAlpha * strength));
          }
        }
      }

      ctx.putImageData(currData, startX, startY);
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool === "pan") {
      setIsPanning(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPanStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
      return;
    }

    setIsDrawing(true);
    const coords = getCoordinates(e);
    draw(coords);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: clientX - rect.left,
        y: clientY - rect.top,
        visible: true
      });
    }

    if (isPanning) {
      setPanOffset({
        x: clientX - panStart.x,
        y: clientY - panStart.y
      });
      return;
    }

    if (!isDrawing) return;
    const coords = getCoordinates(e);
    draw(coords);
  };

  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (isDrawing) {
      setIsDrawing(false);
      pushState();
    }
  };

  const handleSaveAndDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
        
        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName.replace(/\.[^/.]+$/, "") + "-perfected.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  const handleFitScreen = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-xl z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight">Touch-Up Studio</h3>
            <p className="text-[11px] text-slate-400">Restore turban/clothes or clean edges with full image view</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="border-slate-700 bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAndDownload}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-8 shadow-md shadow-blue-500/20"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Save &amp; Download
          </Button>
        </div>
      </div>

      {/* Main Canvas Workspace with Viewport Fit & Zoom */}
      <div 
        ref={containerRef}
        onMouseLeave={() => setCursorPos((p) => ({ ...p, visible: false }))}
        className="relative flex-1 w-full max-w-6xl mx-auto my-2 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center cursor-default"
        style={{
          backgroundColor: "#070c18",
          backgroundImage: "linear-gradient(45deg, #0e172c 25%, transparent 25%), linear-gradient(-45deg, #0e172c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0e172c 75%), linear-gradient(-45deg, transparent 75%, #0e172c 75%)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px"
        }}
      >
        {/* Floating Zoom & Pan Controls Widget */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="w-7 h-7 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-bold text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="w-7 h-7 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFitScreen}
            className="w-7 h-7 text-slate-300 hover:text-white"
            title="Fit to Screen (100%)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* The Scaled Canvas Element */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isPanning || isDrawing ? "none" : "transform 0.15s ease-out"
          }}
          className="relative max-w-full max-h-[72vh] flex items-center justify-center p-2"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className={cn(
              "max-w-full max-h-[70vh] object-contain drop-shadow-2xl cursor-crosshair",
              tool === "pan" && "cursor-grab active:cursor-grabbing",
              showOriginal && "opacity-0 pointer-events-none"
            )}
          />

          {showOriginal && originalImgRef.current && (
            <img
              src={originalImgRef.current.src}
              alt="Original Reference"
              className="absolute inset-0 m-auto max-w-full max-h-[70vh] object-contain pointer-events-none drop-shadow-2xl"
            />
          )}
        </div>

        {/* Live Circular Brush Size Indicator Overlay */}
        {cursorPos.visible && tool !== "pan" && (
          <div
            className={cn(
              "pointer-events-none absolute rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity z-40",
              tool === "restore" 
                ? "border-emerald-400 bg-emerald-400/15" 
                : "border-rose-400 bg-rose-400/15"
            )}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              width: `${(brushSize * 2 * zoom) * 0.75}px`,
              height: `${(brushSize * 2 * zoom) * 0.75}px`,
            }}
          />
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="w-full max-w-6xl mx-auto bg-slate-900/95 border border-slate-800 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Tool Selectors */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setTool("restore")}
            className={cn(
              "h-8 sm:h-9 px-3 font-bold text-xs transition-all",
              tool === "restore" 
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            )}
          >
            <Paintbrush className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
            Restore (Turban/Coat)
          </Button>

          <Button
            size="sm"
            onClick={() => setTool("erase")}
            className={cn(
              "h-8 sm:h-9 px-3 font-bold text-xs transition-all",
              tool === "erase" 
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20" 
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            )}
          >
            <Eraser className="w-3.5 h-3.5 mr-1.5 text-rose-300" />
            Erase (Bg)
          </Button>

          <Button
            size="sm"
            onClick={() => setTool("pan")}
            className={cn(
              "h-8 sm:h-9 px-3 font-bold text-xs transition-all",
              tool === "pan" 
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            )}
          >
            <Move className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
            Pan / Move
          </Button>
        </div>

        {/* Brush Size Slider */}
        <div className="flex items-center gap-2.5 min-w-[170px] max-w-xs flex-1">
          <span className="text-xs font-semibold text-slate-300 shrink-0">Size: {brushSize}px</span>
          <Slider
            value={[brushSize]}
            onValueChange={(val: any) => {
              const num = Array.isArray(val) ? val[0] : typeof val === 'number' ? val : 35;
              setBrushSize(num);
            }}
            min={5}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Action Controls (Undo, Reset, Hold to Preview Original) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="h-8 sm:h-9 border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs disabled:opacity-40"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1" />
            Undo
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-8 sm:h-9 border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs"
            title="Reset to initial AI result"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>

          <Button
            size="sm"
            variant="outline"
            onMouseDown={() => setShowOriginal(true)}
            onMouseUp={() => setShowOriginal(false)}
            onTouchStart={() => setShowOriginal(true)}
            onTouchEnd={() => setShowOriginal(false)}
            className="h-8 sm:h-9 border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs select-none active:bg-blue-600 active:text-white"
            title="Hold to view original image"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-blue-400" />
            Hold to Compare
          </Button>
        </div>

      </div>
    </div>
  );
}
