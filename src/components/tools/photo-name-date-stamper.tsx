"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, Image as ImageIcon, Settings, Sliders, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type StripStyle = "white" | "black";
type Placement = "overlay" | "add";

export function PhotoNameDateStamper() {
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("photo.jpg");
  const [candidateName, setCandidateName] = useState("");
  const [dop, setDop] = useState(new Date().toISOString().split('T')[0]);
  
  const [stripStyle, setStripStyle] = useState<StripStyle>("white");
  const [placement, setPlacement] = useState<Placement>("overlay");
  
  const [textScale, setTextScale] = useState(1);
  const [stripHeightRatio, setStripHeightRatio] = useState(0.15); // 15% of height by default
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageObj(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate dimensions
    const imgW = imageObj.width;
    const imgH = imageObj.height;
    
    const stripHeight = Math.floor(imgH * stripHeightRatio);
    const canvasW = imgW;
    const canvasH = placement === "add" ? imgH + stripHeight : imgH;

    // Set canvas size
    canvas.width = canvasW;
    canvas.height = canvasH;

    // Draw original image
    ctx.drawImage(imageObj, 0, 0, imgW, imgH);

    // Draw strip background
    const stripY = placement === "add" ? imgH : imgH - stripHeight;
    ctx.fillStyle = stripStyle === "white" ? "#FFFFFF" : "#000000";
    ctx.fillRect(0, stripY, canvasW, stripHeight);

    // Setup text style
    ctx.fillStyle = stripStyle === "white" ? "#000000" : "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Calculate font size relative to strip height and scale
    const baseFontSize = Math.floor(stripHeight * 0.35 * textScale);
    ctx.font = `bold ${baseFontSize}px Arial, sans-serif`;

    // Draw Candidate Name
    const nameY = stripY + (stripHeight * 0.35);
    const displayCandidateName = candidateName.trim().toUpperCase();
    if (displayCandidateName) {
      ctx.fillText(displayCandidateName, canvasW / 2, nameY);
    }

    // Draw Date of Photo
    const dateY = stripY + (stripHeight * 0.7);
    if (dop) {
      // Format Date if it's YYYY-MM-DD to DD/MM/YYYY
      const parts = dop.split("-");
      let formattedDop = dop;
      if (parts.length === 3) {
        formattedDop = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      ctx.fillText(`DOP: ${formattedDop}`, canvasW / 2, dateY);
    }
  }, [imageObj, candidateName, dop, stripStyle, placement, textScale, stripHeightRatio]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = `stamped_${fileName.replace(/\.[^/.]+$/, "")}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-6xl mx-auto">
      {/* Top Banner / CTA */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-blue-800 dark:text-blue-300">Strict Portal Size Limits? (20KB - 50KB)</h4>
          <p className="text-sm text-blue-600 dark:text-blue-400">If your portal requires a precise KB size or dimension (like SSC or UPSC), use our exact resizer after stamping.</p>
        </div>
        <Link href="/exam-photo-resizer">
          <Button variant="outline" size="sm" className="whitespace-nowrap border-blue-300 dark:border-blue-700 bg-white dark:bg-blue-950 hover:bg-blue-50 dark:hover:bg-blue-900">
            Open Exam Photo Resizer <ExternalLink className="ml-2 w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Controls */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              1. Upload Photo
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-primary/70 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Click to select photo</p>
                <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, WEBP</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            
            {imageObj && (
              <p className="text-xs text-center text-muted-foreground break-all bg-muted py-1.5 px-3 rounded-md">
                Loaded: {fileName} ({imageObj.width}x{imageObj.height}px)
              </p>
            )}
          </div>

          <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm space-y-5 transition-opacity ${!imageObj ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              2. Stamper Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Candidate Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. RAHUL KUMAR" 
                  className="w-full text-sm p-2 rounded-md border border-input bg-background uppercase focus:ring-1 focus:ring-primary outline-none"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Date of Photo (DOP)</label>
                <input 
                  type="date" 
                  className="w-full text-sm p-2 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                  value={dop}
                  onChange={(e) => setDop(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Placement</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPlacement("overlay")}
                    className={`flex-1 text-xs py-2 rounded-md font-medium border ${placement === "overlay" ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-border'}`}
                  >
                    Overlay on Bottom
                  </button>
                  <button 
                    onClick={() => setPlacement("add")}
                    className={`flex-1 text-xs py-2 rounded-md font-medium border ${placement === "add" ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted border-border'}`}
                  >
                    Add to Bottom
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Strip Style</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStripStyle("white")}
                    className={`flex-1 text-xs py-2 rounded-md font-bold border ${stripStyle === "white" ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                    style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
                  >
                    White / Black Text
                  </button>
                  <button 
                    onClick={() => setStripStyle("black")}
                    className={`flex-1 text-xs py-2 rounded-md font-bold border ${stripStyle === "black" ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                    style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                  >
                    Black / White Text
                  </button>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <label className="font-medium flex items-center gap-1"><Sliders className="w-3 h-3" /> Strip Height</label>
                    <span>{Math.round(stripHeightRatio * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.05" max="0.30" step="0.01" 
                    value={stripHeightRatio} 
                    onChange={(e) => setStripHeightRatio(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <label className="font-medium flex items-center gap-1"><Sliders className="w-3 h-3" /> Text Size</label>
                    <span>{Math.round(textScale * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" max="1.5" step="0.05" 
                    value={textScale} 
                    onChange={(e) => setTextScale(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Action */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-muted/30 border border-border rounded-2xl p-4 sm:p-6 min-h-[400px] flex flex-col items-center justify-center relative shadow-sm">
            {!imageObj ? (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Upload a photo to see the live preview.</p>
              </div>
            ) : (
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-[500px] object-contain shadow-lg rounded border border-border/50 bg-checkered"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleDownload} 
              disabled={!imageObj}
              className="w-full sm:w-auto shadow-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Stamped Photo (JPG)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
