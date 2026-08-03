"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Maximize, Ruler, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CameraMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isCalibrating, setIsCalibrating] = useState<boolean>(true);
  
  // Known reference objects
  const referenceObjects = {
    "credit-card": { name: "Credit Card", widthCm: 8.56, heightCm: 5.398 },
    "a4-paper": { name: "A4 Paper", widthCm: 21.0, heightCm: 29.7 },
  };
  const [refObject, setRefObject] = useState<keyof typeof referenceObjects>("credit-card");
  
  // Lines drawn by user on canvas
  // We need at least one line for calibration, and subsequent lines for measurement
  type Point = { x: number, y: number };
  type Line = { start: Point, end: Point, isCalibration?: boolean };
  
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [pixelsPerCm, setPixelsPerCm] = useState<number | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
    } catch (err: any) {
      setError("Unable to access camera. Please ensure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ start: { x, y }, end: { x, y } });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentLine || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine({ ...currentLine, end: { x, y } });
  };

  const handlePointerUp = () => {
    if (currentLine) {
      if (isCalibrating) {
        // This is the calibration line (width of the reference object)
        const dx = currentLine.end.x - currentLine.start.x;
        const dy = currentLine.end.y - currentLine.start.y;
        const pixelLength = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate scale
        const refWidthCm = referenceObjects[refObject].widthCm;
        setPixelsPerCm(pixelLength / refWidthCm);
        
        setLines([{ ...currentLine, isCalibration: true }]);
        setIsCalibrating(false);
      } else {
        setLines([...lines, currentLine]);
      }
      setCurrentLine(null);
    }
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawLine = (line: Line, color: string, label?: string) => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw endpoints
      ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, 5, 0, Math.PI * 2);
      ctx.arc(line.end.x, line.end.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (label) {
        const midX = (line.start.x + line.end.x) / 2;
        const midY = (line.start.y + line.end.y) / 2;
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText(label, midX + 10, midY - 10);
        ctx.fillText(label, midX + 10, midY - 10);
      }
    };

    // Draw saved lines
    lines.forEach(line => {
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      const pixelLength = Math.sqrt(dx * dx + dy * dy);
      
      if (line.isCalibration) {
        drawLine(line, "#10b981", `${referenceObjects[refObject].widthCm} cm (Reference)`);
      } else if (pixelsPerCm) {
        const lengthCm = pixelLength / pixelsPerCm;
        const lengthInches = lengthCm * 0.393701;
        drawLine(line, "#3b82f6", `${lengthCm.toFixed(1)} cm (${lengthInches.toFixed(1)} in)`);
      }
    });

    // Draw current line
    if (currentLine) {
      drawLine(currentLine, isCalibrating ? "#10b981" : "#3b82f6");
    }
  }, [lines, currentLine, pixelsPerCm, isCalibrating, refObject, referenceObjects]);

  // Sync canvas size to video size and setup render loop
  useEffect(() => {
    let animationFrameId: number;
    
    const render = () => {
      if (videoRef.current && canvasRef.current) {
        // Make sure canvas dimensions match the actual displayed video dimensions
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
          canvas.width = video.clientWidth;
          canvas.height = video.clientHeight;
        }
        
        redrawCanvas();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [redrawCanvas]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Camera Measurement Tool</h2>
        <p className="text-muted-foreground mb-4">
          Estimate dimensions by comparing objects in the camera frame to a known reference object.
        </p>

        {error ? (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
            <Button onClick={startCamera} variant="outline" size="sm" className="ml-auto">Retry</Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 min-w-[250px]">
              <label className="text-sm font-medium mb-1 block">Reference Object</label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={refObject}
                onChange={(e) => {
                  setRefObject(e.target.value as any);
                  setLines([]);
                  setPixelsPerCm(null);
                  setIsCalibrating(true);
                }}
              >
                <option value="credit-card">Standard Credit Card (8.56cm wide)</option>
                <option value="a4-paper">A4 Paper (21.0cm wide)</option>
              </select>
            </div>
            
            <div className="flex gap-2 self-end">
               <Button 
                 variant={isCalibrating ? "default" : "outline"} 
                 onClick={() => {
                   setLines([]);
                   setPixelsPerCm(null);
                   setIsCalibrating(true);
                 }}
               >
                 Recalibrate
               </Button>
               <Button 
                 variant="destructive"
                 disabled={lines.length === (pixelsPerCm ? 1 : 0)}
                 onClick={() => {
                    if (lines.length > 1) {
                      setLines([lines[0]]); // Keep only calibration line
                    }
                 }}
               >
                 Clear Measurements
               </Button>
            </div>
          </div>
        )}

        {!error && (
          <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-[4/3] sm:aspect-video touch-none">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas 
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 w-full h-full z-10 cursor-crosshair"
            />
            
            {/* Helper Overlay */}
            <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                {isCalibrating 
                  ? `Step 1: Draw a line across the width of your ${referenceObjects[refObject].name}` 
                  : "Step 2: Draw lines to measure other objects"}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
