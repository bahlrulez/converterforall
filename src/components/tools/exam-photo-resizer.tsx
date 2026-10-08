"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Upload, Download, RefreshCw, Scissors, ArrowLeft, Camera, Settings2, Loader2, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESETS = {
  ssc: {
    photo: { minKB: 20, maxKB: 50, aspect: 3.5 / 4.5, minWidth: 200, label: "SSC Photo (20-50 KB)" },
    signature: { minKB: 10, maxKB: 20, aspect: 140 / 60, minWidth: 140, label: "SSC Signature (10-20 KB)" },
  },
  upsc: {
    photo: { minKB: 20, maxKB: 300, aspect: 1, minWidth: 350, label: "UPSC Photo (20-300 KB)" },
    signature: { minKB: 20, maxKB: 300, aspect: 1, minWidth: 350, label: "UPSC Signature (20-300 KB)" },
  },
  ibps: {
    photo: { minKB: 20, maxKB: 50, aspect: 200 / 230, minWidth: 200, label: "IBPS Photo (20-50 KB)" },
    signature: { minKB: 10, maxKB: 20, aspect: 140 / 60, minWidth: 140, label: "IBPS Signature (10-20 KB)" },
  }
};

type PresetKey = keyof typeof PRESETS;
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
    // Max size of COM payload is 65533 bytes + 2 length bytes = 65535 total for marker segment
    const paddingSize = Math.min(remainingPadding, 65531); 
    const markerLength = paddingSize + 2; 
    
    const comMarker = new Uint8Array(paddingSize + 4);
    comMarker[0] = 0xFF;
    comMarker[1] = 0xFE; // COM Marker
    comMarker[2] = (markerLength >> 8) & 0xFF; // Length high byte
    comMarker[3] = markerLength & 0xFF; // Length low byte
    // The rest is automatically initialized to 0 (our padding data)
    
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
  
  // Try max quality first
  let blob = await canvasToBlob(canvas, 1.0);
  
  if (blob.size > maxBytes) {
    let low = 0.0;
    let high = 1.0;
    let bestBlob = blob;
    
    // Binary search for optimal quality
    for (let i = 0; i < 10; i++) {
      const mid = (low + high) / 2;
      const currentBlob = await canvasToBlob(canvas, mid);
      
      if (currentBlob.size <= maxBytes) {
        bestBlob = currentBlob;
        low = mid; // Try to get higher quality while staying under max
      } else {
        high = mid; // Size too big, reduce quality
      }
    }
    blob = bestBlob;
  }
  
  // If still below minimum size, pad the blob with COM markers
  if (blob.size < minBytes) {
    // Target minBytes + 200 bytes safety buffer
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

  const activeConfig = PRESETS[preset][mode];

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
        activeConfig.minWidth
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
      <div className="bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 mb-8 bg-background p-4 rounded-xl border">
          <div className="flex-1">
             <label className="text-sm font-semibold mb-2 block">1. Select Mode</label>
             <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={mode === "photo" ? "default" : "outline"} 
                  onClick={() => setMode("photo")}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" /> Photo
                </Button>
                <Button 
                  variant={mode === "signature" ? "default" : "outline"} 
                  onClick={() => setMode("signature")}
                  className="w-full"
                >
                  <Settings2 className="w-4 h-4 mr-2" /> Signature
                </Button>
             </div>
          </div>
          
          <div className="flex-1">
             <label className="text-sm font-semibold mb-2 block">2. Select Exam Preset</label>
             <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={preset === "ssc" ? "default" : "outline"} 
                  onClick={() => setPreset("ssc")}
                  size="sm"
                >
                  SSC
                </Button>
                <Button 
                  variant={preset === "upsc" ? "default" : "outline"} 
                  onClick={() => setPreset("upsc")}
                  size="sm"
                >
                  UPSC
                </Button>
                <Button 
                  variant={preset === "ibps" ? "default" : "outline"} 
                  onClick={() => setPreset("ibps")}
                  size="sm"
                >
                  IBPS
                </Button>
             </div>
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg text-sm mb-6 flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Target Spec: {activeConfig.label}</p>
            <p>Will be strictly compressed to {activeConfig.minKB}KB - {activeConfig.maxKB}KB and properly resized.</p>
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
          <h3 className="text-xl font-semibold mb-2">Upload {mode === "photo" ? "your photo" : "your signature"}</h3>
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-semibold">Crop your {mode}</h3>
              <p className="text-sm text-muted-foreground">Adjust the box to fit perfectly.</p>
            </div>
            
            <div className="flex gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 p-2 rounded-lg text-sm border border-blue-100 dark:border-blue-900/50">
              <span className="font-medium">{activeConfig.label}</span>
              <span className="opacity-50">|</span>
              <span>Target: {activeConfig.minKB}-{activeConfig.maxKB} KB</span>
            </div>
          </div>

          <div className="relative w-full h-[50vh] min-h-[400px] bg-black/5 rounded-2xl overflow-hidden border">
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
                <span className="text-sm font-medium">Zoom</span>
                <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
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

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setImageSrc(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Upload Different Image
            </Button>
            <Button onClick={processImage} disabled={isProcessing}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Scissors className="mr-2 h-4 w-4" /> Crop & Compress to Size</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-8 text-center space-y-6">
          <div className="bg-green-500/10 text-green-600 p-3 rounded-full mb-2">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Your {mode} is ready!</h2>
          
          <div className="bg-muted p-4 rounded-xl border max-w-sm w-full mx-auto text-left space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Final File Size:</span>
               <span className="font-bold text-green-600 dark:text-green-400">{(resultBlob.size / 1024).toFixed(2)} KB</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Status:</span>
               <span className="font-semibold">{resultBlob.size >= activeConfig.minKB * 1024 && resultBlob.size <= activeConfig.maxKB * 1024 ? "Valid (In limits)" : "Warning"}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Format:</span>
               <span className="font-semibold uppercase">JPEG</span>
             </div>
          </div>
          
          <div className={`relative border-4 border-white shadow-xl rounded-sm overflow-hidden bg-white max-w-sm mx-auto ${mode === 'signature' ? 'h-[120px]' : ''}`}>
             <img src={URL.createObjectURL(resultBlob)} alt="Cropped result" className="max-w-[250px] w-full h-auto object-contain block mx-auto" />
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => setResultBlob(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cropper
            </Button>
            <Button onClick={handleDownload} size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Result
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
