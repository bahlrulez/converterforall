"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Scissors, 
  ArrowLeft, 
  Camera, 
  Settings2, 
  Loader2, 
  Info, 
  Check, 
  ShieldCheck,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXAM_PRESETS, ExamPresetSpec } from "@/config/exam-presets";

type PresetKey = keyof typeof EXAM_PRESETS;
type ModeKey = "photo" | "signature";

// Utility to create the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export async function getCroppedImgCanvas(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  minWidth: number = 0
): Promise<HTMLCanvasElement | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);
  
  // Fill background white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  
  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
  // Create final target canvas
  const targetCanvas = document.createElement("canvas");
  
  // Scale up if below minWidth
  let scale = 1;
  if (minWidth > 0 && pixelCrop.width < minWidth) {
    scale = minWidth / pixelCrop.width;
  }
  
  targetCanvas.width = pixelCrop.width * scale;
  targetCanvas.height = pixelCrop.height * scale;
  
  const targetCtx = targetCanvas.getContext("2d");
  if (!targetCtx) return null;
  
  // Use intermediate canvas for scaled draw
  const intermediateCanvas = document.createElement("canvas");
  intermediateCanvas.width = pixelCrop.width;
  intermediateCanvas.height = pixelCrop.height;
  const intermediateCtx = intermediateCanvas.getContext("2d");
  if (!intermediateCtx) return null;
  
  intermediateCtx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // Draw scaled
  targetCtx.fillStyle = "#ffffff";
  targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  targetCtx.drawImage(intermediateCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
  
  return targetCanvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", quality);
  });
}

// Function to safely inflate JPEG blob size using COM markers
async function padJpegBlob(blob: Blob, targetBytes: number): Promise<Blob> {
  if (blob.size >= targetBytes) return blob;
  
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Verify it's a JPEG (SOI marker)
  if (uint8Array[0] !== 0xFF || uint8Array[1] !== 0xD8) {
    return blob; // Fallback
  }

  const bytesNeeded = targetBytes - blob.size;
  const chunks: Uint8Array[] = [];
  
  // Add SOI
  chunks.push(uint8Array.slice(0, 2));
  
  // Add COM markers for padding
  let remainingPadding = bytesNeeded;
  while (remainingPadding > 0) {
    const paddingSize = Math.min(remainingPadding, 65531); 
    const markerLength = paddingSize + 2; 
    
    const comMarker = new Uint8Array(paddingSize + 4);
    comMarker[0] = 0xFF;
    comMarker[1] = 0xFE; // COM Marker
    comMarker[2] = (markerLength >> 8) & 0xFF; // Length high byte
    comMarker[3] = markerLength & 0xFF; // Length low byte
    
    chunks.push(comMarker);
    remainingPadding -= paddingSize;
  }
  
  // Add the rest of the original file
  chunks.push(uint8Array.slice(2));
  
  return new Blob(chunks as any[], { type: "image/jpeg" });
}

// Binary search compression
async function compressToTargetKB(
  canvas: HTMLCanvasElement,
  minKB: number,
  maxKB: number
): Promise<Blob> {
  const minBytes = minKB * 1024;
  const maxBytes = maxKB * 1024;
  
  let blob = await canvasToBlob(canvas, 1.0);
  
  if (blob.size > maxBytes) {
    let low = 0.0;
    let high = 1.0;
    let bestBlob = blob;
    
    for (let i = 0; i < 10; i++) {
      const mid = (low + high) / 2;
      const currentBlob = await canvasToBlob(canvas, mid);
      
      if (currentBlob.size <= maxBytes) {
        bestBlob = currentBlob;
        low = mid;
      } else {
        high = mid;
      }
    }
    blob = bestBlob;
  }
  
  if (blob.size < minBytes) {
    blob = await padJpegBlob(blob, minBytes + 200);
  }
  
  return blob;
}

export function ExamPhotoResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("exam-photo.jpg");
  
  const [mode, setMode] = useState<ModeKey>("photo");
  const [preset, setPreset] = useState<PresetKey>("ssc");
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const activePresetSpec = EXAM_PRESETS[preset] || EXAM_PRESETS.ssc;
  const activeConfig = activePresetSpec[mode];

  const handleFile = (file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, "") + `-${preset}-${mode}.jpg`);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setResultBlob(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, [preset, mode]);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const processImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const canvas = await getCroppedImgCanvas(
        imageSrc,
        croppedAreaPixels,
        0,
        activeConfig.minWidthPx
      );
      
      if (canvas) {
        const finalBlob = await compressToTargetKB(
          canvas,
          activeConfig.minKB,
          activeConfig.maxKB
        );
        setResultBlob(finalBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!imageSrc) {
    return (
      <div className="bg-muted/30 rounded-3xl p-5 sm:p-10 border border-border shadow-sm max-w-5xl mx-auto space-y-6">
        {/* Step 1: Mode Switcher */}
        <div className="bg-background p-4 rounded-2xl border shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step 1</span>
              <h3 className="font-semibold text-base">Select Document Type</h3>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-muted border">
              <button
                type="button"
                onClick={() => setMode("photo")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === "photo" 
                    ? "bg-background text-foreground shadow-xs" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Passport Photo
              </button>
              <button
                type="button"
                onClick={() => setMode("signature")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === "signature" 
                    ? "bg-background text-foreground shadow-xs" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" /> Signature Scan
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Visual Exam Presets Grid */}
        <div className="bg-background p-5 rounded-2xl border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Step 2</span>
              <h3 className="font-semibold text-base">Choose Your Target Exam or Portal</h3>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">Auto-tunes aspect ratio &amp; file limits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {Object.entries(EXAM_PRESETS).map(([key, item]) => {
              const isSelected = preset === key;
              const config = item[mode];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key as PresetKey)}
                  className={`relative p-3.5 text-left rounded-xl border transition-all text-sm flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1.5 ring-primary/40 shadow-xs"
                      : "border-border hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <span className="font-semibold text-foreground text-xs sm:text-sm line-clamp-1">
                      {item.shortName}
                    </span>
                    {isSelected ? (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="shrink-0 w-4 h-4 rounded-full border border-border" />
                    )}
                  </div>

                  <div className="space-y-1 w-full text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Dimensions:</span>
                      <span className="font-medium text-foreground">{config.dimensionsLabel.split(" ")[0]} cm</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Target KB:</span>
                      <span className="font-semibold text-primary">{config.minKB} KB – {config.maxKB} KB</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Specification Banner */}
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4 text-xs text-foreground space-y-2">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-primary">{activePresetSpec.name}</span>
                <span className="px-2 py-0.5 bg-primary/15 text-primary font-semibold rounded text-[11px]">
                  {activeConfig.minKB} KB – {activeConfig.maxKB} KB
                </span>
                <span className="px-2 py-0.5 bg-muted border font-medium rounded text-[11px]">
                  {activeConfig.dimensionsLabel}
                </span>
              </div>
              <ul className="text-muted-foreground list-disc list-inside space-y-0.5 pt-1">
                {activeConfig.rules.map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors bg-background ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-muted/30"
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-muted/80 rounded-full shadow-xs mb-3">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Select or drop {mode === "photo" ? "passport photograph" : "signature image"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4 max-w-sm">
            Runs entirely on your device. Your photo is never uploaded to any cloud server.
          </p>
          <Button size="sm" variant="outline" className="pointer-events-none">
            Browse files
          </Button>
        </div>
        
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-5 sm:p-8 border border-border shadow-sm flex flex-col gap-6 max-w-5xl mx-auto">
      {!resultBlob ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">Adjust &amp; Crop {mode}</h3>
              <p className="text-xs text-muted-foreground">Framed for {activePresetSpec.name}</p>
            </div>
            
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/20">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Target: {activeConfig.minKB}–{activeConfig.maxKB} KB ({activeConfig.dimensionsLabel.split(" ")[0]} cm)</span>
            </div>
          </div>

          <div className="relative w-full h-[50vh] min-h-[380px] bg-black/5 rounded-2xl overflow-hidden border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={activeConfig.aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="space-y-4 max-w-md mx-auto w-full">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium">Zoom</span>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setImageSrc(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Choose Different Image
            </Button>
            <Button onClick={processImage} disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing to Specs...</>
              ) : (
                <><Scissors className="mr-2 h-4 w-4" /> Crop &amp; Conform to Specs</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-6 text-center space-y-5">
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Document Ready for Portal Upload</h2>
          
          <div className="bg-background p-4 rounded-xl border max-w-sm w-full mx-auto text-left space-y-2 text-xs">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Portal Target:</span>
               <span className="font-semibold text-foreground">{activePresetSpec.shortName}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Final File Size:</span>
               <span className="font-bold text-emerald-600 dark:text-emerald-400">{(resultBlob.size / 1024).toFixed(2)} KB</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Size Compliance:</span>
               <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                 <Check className="w-3.5 h-3.5" /> Within {activeConfig.minKB}–{activeConfig.maxKB} KB
               </span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Format:</span>
               <span className="font-semibold uppercase">JPEG (Standard)</span>
             </div>
          </div>
          
          <div className={`relative border-4 border-white shadow-lg rounded-sm overflow-hidden bg-white max-w-xs mx-auto ${mode === 'signature' ? 'h-[110px]' : ''}`}>
             <img src={URL.createObjectURL(resultBlob)} alt="Cropped result" className="max-w-[220px] w-full h-auto object-contain block mx-auto" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Button variant="outline" onClick={() => setResultBlob(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Re-adjust Crop
            </Button>
            <Button onClick={handleDownload} size="lg" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Download Conformed File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
