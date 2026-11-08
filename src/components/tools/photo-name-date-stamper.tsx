"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { UploadCloud, Download, Image as ImageIcon, Settings, Sliders, ExternalLink, Calendar, Check, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type StripStyle = "white" | "black";
type Placement = "overlay" | "add";
type AspectRatioMode = "passport" | "original";

export function PhotoNameDateStamper() {
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("photo.jpg");
  const [candidateName, setCandidateName] = useState("");
  const [dop, setDop] = useState(new Date().toISOString().split('T')[0]);
  
  const [stripStyle, setStripStyle] = useState<StripStyle>("white");
  const [placement, setPlacement] = useState<Placement>("overlay");
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>("passport");
  const [cropOffset, setCropOffset] = useState<number>(50); // 50% = centered
  
  const [textScale, setTextScale] = useState(1);
  const [stripHeightRatio, setStripHeightRatio] = useState(0.15); // 15% of height by default
  const [outputDims, setOutputDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  
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
        // If uploaded photo is landscape (wider than tall), auto-select passport portrait
        if (img.width > img.height) {
          setAspectMode("passport");
          setCropOffset(50);
        }
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
    
    // Determine source crop rectangle
    let cropX = 0;
    let cropY = 0;
    let cropW = imgW;
    let cropH = imgH;

    if (aspectMode === "passport") {
      const targetRatio = 3.5 / 4.5; // Standard 3.5cm x 4.5cm passport ratio (~0.7778)
      const currentRatio = imgW / imgH;

      if (currentRatio > targetRatio) {
        // Source image is wider than 3.5:4.5 (e.g. landscape 2752x1766)
        cropH = imgH;
        cropW = Math.round(imgH * targetRatio);
        const maxOffset = imgW - cropW;
        cropX = Math.round(maxOffset * (cropOffset / 100));
        cropY = 0;
      } else {
        // Source image is taller than 3.5:4.5
        cropW = imgW;
        cropH = Math.round(imgW / targetRatio);
        const maxOffset = imgH - cropH;
        cropX = 0;
        cropY = Math.round(maxOffset * (cropOffset / 100));
      }
    }

    const stripHeight = Math.floor(cropH * stripHeightRatio);
    const canvasW = cropW;
    const canvasH = placement === "add" ? cropH + stripHeight : cropH;

    setOutputDims({ width: canvasW, height: canvasH });

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Draw the cropped photograph onto the target canvas
    ctx.drawImage(imageObj, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const stripY = placement === "add" ? cropH : cropH - stripHeight;
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
  }, [imageObj, candidateName, dop, stripStyle, placement, aspectMode, cropOffset, textScale, stripHeightRatio]);

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
              <div className="space-y-2">
                <p className="text-xs text-center text-muted-foreground break-all bg-muted py-1.5 px-3 rounded-lg border">
                  Loaded: {fileName} ({imageObj.width}×{imageObj.height} px)
                </p>
                {imageObj.width > imageObj.height && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Wide / Landscape photo detected!</span>
                      <p className="text-[11px] mt-0.5 opacity-90">
                        Exam portals (UPSC, SSC, State) require 3.5cm × 4.5cm vertical passport photos. Passport crop is auto-applied below.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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

            {/* Aspect Ratio & Crop Mode */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">Photo Proportions (Aspect Ratio)</label>
                {aspectMode === "passport" && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ 3.5×4.5 cm Passport
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectMode("passport")}
                  className={`text-xs py-2 px-2.5 rounded-lg font-semibold border transition-all text-left flex flex-col ${
                    aspectMode === "passport"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs ring-1 ring-primary/40"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  <span className="font-bold">Passport (3.5 × 4.5)</span>
                  <span className={`text-[10px] font-normal ${aspectMode === "passport" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    Govt exam standard
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectMode("original")}
                  className={`text-xs py-2 px-2.5 rounded-lg font-medium border transition-all text-left flex flex-col ${
                    aspectMode === "original"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs ring-1 ring-primary/40"
                      : "bg-background hover:bg-muted border-border"
                  }`}
                >
                  <span className="font-bold">Keep Original</span>
                  <span className={`text-[10px] font-normal ${aspectMode === "original" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    No crop applied
                  </span>
                </button>
              </div>

              {aspectMode === "passport" && imageObj && (imageObj.width / imageObj.height > 3.5 / 4.5) && (
                <div className="space-y-1.5 pt-2 bg-muted/40 p-2.5 rounded-xl border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium text-[11px]">Center Face (Pan Left/Right)</span>
                    <span className="font-mono text-[11px] font-bold text-primary">{cropOffset}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={cropOffset}
                    onChange={(e) => setCropOffset(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                    <span>← Left</span>
                    <span>Center (50%)</span>
                    <span>Right →</span>
                  </div>
                </div>
              )}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 w-full">
              <h3 className="font-semibold text-base">Live Stamped Output</h3>
              {outputDims.width > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-[11px] font-mono border">
                  <span className="font-bold text-foreground">{outputDims.width} × {outputDims.height} px</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={aspectMode === "passport" ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>
                    {aspectMode === "passport" ? "Passport Portrait (3.5:4.5)" : "Original Ratio"}
                  </span>
                </div>
              )}
            </div>
            
            <div className="relative border-2 border-border/70 rounded-xl overflow-hidden shadow-sm max-w-sm w-full bg-slate-100 dark:bg-slate-900/40 min-h-[300px] flex items-center justify-center p-3">
              {!imageObj ? (
                <div className="text-center p-6 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 opacity-20 mx-auto mb-2" />
                  <p className="text-xs">Upload a photograph to see the stamped preview here.</p>
                </div>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className="max-h-[440px] w-auto h-auto object-contain block mx-auto rounded-lg shadow-md border border-border/80"
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
