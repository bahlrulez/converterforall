"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, Image as ImageIcon, Settings, Sliders, ExternalLink, Calendar, Check, Sparkles } from "lucide-react";
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

  const setRelativeDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDop(d.toISOString().split('T')[0]);
  };

  const applyUPSCFormat = () => {
    setPlacement("overlay");
    setStripStyle("white");
    setStripHeightRatio(0.16);
    setTextScale(1.05);
  };

  const applyStateFormat = () => {
    setPlacement("add");
    setStripStyle("white");
    setStripHeightRatio(0.14);
    setTextScale(1.0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgW = imageObj.width;
    const imgH = imageObj.height;
    
    const stripHeight = Math.floor(imgH * stripHeightRatio);
    const canvasW = imgW;
    const canvasH = placement === "add" ? imgH + stripHeight : imgH;

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.drawImage(imageObj, 0, 0, imgW, imgH);

    const stripY = placement === "add" ? imgH : imgH - stripHeight;
    ctx.fillStyle = stripStyle === "white" ? "#FFFFFF" : "#000000";
    ctx.fillRect(0, stripY, canvasW, stripHeight);

    ctx.fillStyle = stripStyle === "white" ? "#000000" : "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const baseFontSize = Math.floor(stripHeight * 0.35 * textScale);
    ctx.font = `bold ${baseFontSize}px Arial, sans-serif`;

    const nameY = stripY + (stripHeight * 0.35);
    const displayCandidateName = candidateName.trim().toUpperCase();
    if (displayCandidateName) {
      ctx.fillText(displayCandidateName, canvasW / 2, nameY);
    }

    const dateY = stripY + (stripHeight * 0.7);
    if (dop) {
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
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-foreground text-sm">Need Strict 20 KB – 50 KB File Size for Your Portal?</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            After stamping your Name &amp; Date of Photo (DOP), use our Exam Photo Resizer to guarantee the exact aspect ratio and KB ceiling.
          </p>
        </div>
        <Link href="/exam-photo-resizer">
          <Button variant="outline" size="sm" className="whitespace-nowrap text-xs shadow-xs">
            Open Exam Photo Resizer <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Controls */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary" />
              1. Upload Candidate Photo
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <ImageIcon className="w-7 h-7 text-primary/70 mb-1.5" />
                <p className="text-xs text-muted-foreground font-medium">Click to select photo</p>
                <p className="text-[10px] text-muted-foreground/70">JPG, PNG, WEBP</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            
            {imageObj && (
              <p className="text-xs text-center text-muted-foreground break-all bg-muted py-1.5 px-3 rounded-lg border">
                Loaded: {fileName} ({imageObj.width}×{imageObj.height} px)
              </p>
            )}
          </div>

          <div className={`bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 transition-opacity ${!imageObj ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                2. Stamper Parameters
              </h3>
              <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> One-Click Presets
              </span>
            </div>

            {/* Quick Format Presets */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={applyUPSCFormat}
                className="p-2 text-left rounded-lg border text-xs bg-muted/30 hover:bg-muted/80 transition-colors"
              >
                <span className="font-semibold block">UPSC Format</span>
                <span className="text-[10px] text-muted-foreground">White bottom overlay strip</span>
              </button>
              <button
                type="button"
                onClick={applyStateFormat}
                className="p-2 text-left rounded-lg border text-xs bg-muted/30 hover:bg-muted/80 transition-colors"
              >
                <span className="font-semibold block">State / SSC Format</span>
                <span className="text-[10px] text-muted-foreground">Added strip below photo</span>
              </button>
            </div>
            
            <div className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium">Candidate Name (All Caps)</label>
                <input 
                  type="text" 
                  placeholder="e.g. RAHUL KUMAR SHARMA" 
                  className="w-full text-xs p-2 rounded-lg border border-input bg-background uppercase focus:ring-1 focus:ring-primary outline-none font-mono"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium">Date of Photo (DOP)</label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button 
                      type="button" 
                      onClick={() => setRelativeDate(0)} 
                      className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 font-medium"
                    >
                      Today
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRelativeDate(1)} 
                      className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 font-medium"
                    >
                      Yesterday
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRelativeDate(7)} 
                      className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 font-medium"
                    >
                      1 Wk Ago
                    </button>
                  </div>
                </div>
                <input 
                  type="date" 
                  className="w-full text-xs p-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                  value={dop}
                  onChange={(e) => setDop(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Strip Placement</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPlacement("overlay")}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium border transition-all ${placement === "overlay" ? 'bg-primary text-primary-foreground border-primary shadow-xs' : 'bg-background hover:bg-muted border-border'}`}
                  >
                    Overlay on Photo
                  </button>
                  <button 
                    onClick={() => setPlacement("add")}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium border transition-all ${placement === "add" ? 'bg-primary text-primary-foreground border-primary shadow-xs' : 'bg-background hover:bg-muted border-border'}`}
                  >
                    Append to Bottom
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Strip Contrast</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStripStyle("white")}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-bold border transition-all ${stripStyle === "white" ? 'border-primary ring-2 ring-primary/30 shadow-xs' : 'border-border'}`}
                    style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
                  >
                    White Strip (Standard)
                  </button>
                  <button 
                    onClick={() => setStripStyle("black")}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-bold border transition-all ${stripStyle === "black" ? 'border-primary ring-2 ring-primary/30 shadow-xs' : 'border-border'}`}
                    style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                  >
                    Black Strip
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Text Size Scale</span>
                  <span className="font-medium">{textScale.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.7" 
                  max="1.5" 
                  step="0.05"
                  value={textScale}
                  onChange={(e) => setTextScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Stamped Canvas Preview & Download */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="font-semibold text-base mb-4 w-full text-left">Live Stamped Output</h3>
            
            <div className="relative border-4 border-muted rounded-xl overflow-hidden shadow-md max-w-sm w-full bg-muted/40 min-h-[300px] flex items-center justify-center p-2">
              {!imageObj ? (
                <div className="text-center p-6 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 opacity-20 mx-auto mb-2" />
                  <p className="text-xs">Upload a photograph to see the stamped preview here.</p>
                </div>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className="max-h-[420px] w-auto h-auto object-contain block mx-auto rounded shadow-sm"
                />
              )}
            </div>

            {imageObj && (
              <div className="mt-5 w-full max-w-sm flex flex-col gap-2.5">
                <Button onClick={handleDownload} size="lg" className="w-full shadow-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Stamped Photograph
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  Format: JPEG with clean typography. Ready for portal upload.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
