"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Upload, Download, RefreshCw, Scissors, ArrowLeft, Camera, Settings2, Loader2, Info, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESETS = {
  ssc: { minKB: 10, maxKB: 20, aspect: 140 / 60, minWidth: 140, label: "SSC / Central (140x60 px, 10-20 KB)" },
  standard: { minKB: 10, maxKB: 20, aspect: 3 / 1, minWidth: 150, label: "Standard 3:1 (10-20 KB)" },
  freeform: { minKB: 20, maxKB: 50, aspect: undefined, minWidth: 200, label: "Freeform (20-50 KB)" },
};

type PresetKey = keyof typeof PRESETS;
type InkMode = "bw" | "blue";

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
  
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  
  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  
  const targetCanvas = document.createElement("canvas");
  
  let scale = 1;
  if (minWidth > 0 && pixelCrop.width < minWidth) {
    scale = minWidth / pixelCrop.width;
  }
  
  targetCanvas.width = pixelCrop.width * scale;
  targetCanvas.height = pixelCrop.height * scale;
  
  const targetCtx = targetCanvas.getContext("2d");
  if (!targetCtx) return null;
  
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

  targetCtx.fillStyle = "#ffffff";
  targetCtx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  targetCtx.drawImage(intermediateCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
  
  return targetCanvas;
}

// Function to safely inflate JPEG blob size using COM markers
async function padJpegBlob(blob: Blob, targetBytes: number): Promise<Blob> {
  if (blob.size >= targetBytes) return blob;
  
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  if (uint8Array[0] !== 0xFF || uint8Array[1] !== 0xD8) {
    return blob;
  }

  const bytesNeeded = targetBytes - blob.size;
  const chunks: Uint8Array[] = [];
  
  chunks.push(uint8Array.slice(0, 2));
  
  let remainingPadding = bytesNeeded;
  while (remainingPadding > 0) {
    const paddingSize = Math.min(remainingPadding, 65531); 
    const markerLength = paddingSize + 2; 
    
    const comMarker = new Uint8Array(paddingSize + 4);
    comMarker[0] = 0xFF;
    comMarker[1] = 0xFE;
    comMarker[2] = (markerLength >> 8) & 0xFF;
    comMarker[3] = markerLength & 0xFF;
    
    chunks.push(comMarker);
    remainingPadding -= paddingSize;
  }
  
  chunks.push(uint8Array.slice(2));
  
  return new Blob(chunks as any[], { type: "image/jpeg" });
}

// Applies whitening and ink enhancement to canvas
function applySignatureFilters(canvas: HTMLCanvasElement, threshold: number, mode: InkMode) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // threshold is 0 to 100. We map it to 0-255 brightness limit.
  // Higher threshold = more things become white.
  const brightLimit = 255 - (threshold * 1.5); 
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness > brightLimit) {
      // Paper background -> pure white
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      if (mode === "bw") {
        // Dark ink -> pure black or highly contrasted
        const val = Math.max(0, brightness - (255 - brightness) * 0.2);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      } else if (mode === "blue") {
        // Preserve blue, darken everything else slightly
        const isBlue = b > r && b > g;
        if (isBlue) {
          // boost blue
          data[i] = Math.max(0, r - 30);
          data[i + 1] = Math.max(0, g - 30);
          data[i + 2] = Math.min(255, b + 30);
        } else {
          // standard contrast for non-blue (make it darker)
          const val = Math.max(0, brightness - 30);
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", quality);
  });
}

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

export function ExamSignatureResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("exam-signature.jpg");
  
  const [preset, setPreset] = useState<PresetKey>("ssc");
  const [inkMode, setInkMode] = useState<InkMode>("bw");
  const [whitenerLevel, setWhitenerLevel] = useState(50); // 0 to 100
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const activeConfig = PRESETS[preset];

  const handleFile = (file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, "") + `-signature.jpg`);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setResultBlob(null);
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, []);

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

  // Live preview effect
  React.useEffect(() => {
    const updatePreview = async () => {
      if (!imageSrc || !croppedAreaPixels) return;
      const canvas = await getCroppedImgCanvas(imageSrc, croppedAreaPixels, 0, activeConfig.minWidth);
      if (canvas) {
        applySignatureFilters(canvas, whitenerLevel, inkMode);
        setPreviewUrl(canvas.toDataURL("image/jpeg", 0.9));
      }
    };
    
    // debounce slightly to prevent lag during crop drag
    const timeout = setTimeout(updatePreview, 100);
    return () => clearTimeout(timeout);
  }, [imageSrc, croppedAreaPixels, whitenerLevel, inkMode, activeConfig.minWidth]);

  const processImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const canvas = await getCroppedImgCanvas(
        imageSrc,
        croppedAreaPixels,
        0,
        activeConfig.minWidth
      );
      
      if (canvas) {
        applySignatureFilters(canvas, whitenerLevel, inkMode);
        
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
      <div className="bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm">
        <div className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm mb-8 flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Sarkari Signature Tool</p>
            <p>Upload a photo of your signature taken from your phone. We'll automatically remove grey paper shadows and strictly compress it below 20KB for portals like SSC, UPSC, and IBPS.</p>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-background rounded-full shadow-sm mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload your Signature</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop an image here, or click to browse files
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
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
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
      {!resultBlob ? (
        <>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cropper Column */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">1. Crop Signature</h3>
                  <p className="text-sm text-muted-foreground">Adjust the box to fit the signature closely.</p>
                </div>
              </div>

              <div className="relative w-full h-[35vh] min-h-[300px] bg-black/5 rounded-2xl overflow-hidden border">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={activeConfig.aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                />
              </div>

              <div className="space-y-2 bg-background p-3 rounded-xl border">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">🔍 Zoom: {zoom.toFixed(1)}x</span>
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
              
              <div className="flex gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 p-2 rounded-lg text-sm border border-blue-100 dark:border-blue-900/50 overflow-x-auto whitespace-nowrap">
                {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPreset(key as PresetKey)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      preset === key ? "bg-blue-600 text-white" : "hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    }`}
                  >
                    {PRESETS[key as PresetKey].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Whitener Settings Column */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">2. Clean Shadows</h3>
                <p className="text-sm text-muted-foreground mb-4">Adjust until paper background is pure white.</p>

                <div className="space-y-4 bg-background p-4 rounded-xl border">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Ink Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={inkMode === "bw" ? "default" : "outline"} 
                        onClick={() => setInkMode("bw")}
                        size="sm"
                      >
                        Black & White
                      </Button>
                      <Button 
                        variant={inkMode === "blue" ? "default" : "outline"} 
                        onClick={() => setInkMode("blue")}
                        size="sm"
                      >
                        Preserve Blue
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Paper Whitener</span>
                      <span className="text-sm text-muted-foreground">{whitenerLevel}%</span>
                    </div>
                    <input
                      type="range"
                      value={whitenerLevel}
                      min={0}
                      max={100}
                      step={1}
                      onChange={(e) => setWhitenerLevel(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Live Preview (Output)</h3>
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-2 min-h-[120px] flex items-center justify-center shadow-inner overflow-hidden relative">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Live clean preview" className="max-w-full max-h-[150px] object-contain block mx-auto pointer-events-none" />
                  ) : (
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t mt-4">
            <Button variant="outline" onClick={() => setImageSrc(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Upload Different Image
            </Button>
            <Button onClick={processImage} disabled={isProcessing} size="lg" className="px-8 font-bold">
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><ImageIcon className="mr-2 h-5 w-5" /> Clean & Enforce {activeConfig.minKB}-{activeConfig.maxKB}KB</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-8 text-center space-y-6">
          <div className="bg-green-500/10 text-green-600 p-3 rounded-full mb-2">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Signature Cleaned & Compressed!</h2>
          
          <div className="bg-muted p-4 rounded-xl border max-w-sm w-full mx-auto text-left space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Final File Size:</span>
               <span className="font-bold text-green-600 dark:text-green-400">{(resultBlob.size / 1024).toFixed(2)} KB</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Status:</span>
               <span className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                 <Check className="w-4 h-4" /> Valid ({activeConfig.minKB}-{activeConfig.maxKB}KB Limit)
               </span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Format:</span>
               <span className="font-semibold uppercase">JPEG</span>
             </div>
          </div>
          
          <div className="relative border border-slate-200 shadow-sm rounded-sm overflow-hidden bg-white max-w-sm mx-auto p-4 flex items-center justify-center min-h-[100px]">
             <img src={URL.createObjectURL(resultBlob)} alt="Cleaned signature result" className="max-w-[250px] w-full h-auto object-contain block mx-auto" />
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => setResultBlob(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Adjust Settings
            </Button>
            <Button onClick={handleDownload} size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Ready Signature
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
