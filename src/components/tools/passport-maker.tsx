"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Upload, Download, RefreshCw, Scissors, ArrowLeft, Camera, Wand2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeImageBackground } from "@/lib/converters/image";

// Utility to create the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 1.0);
  });
}

export function PassportMaker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [transparentImageSrc, setTransparentImageSrc] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgColor, setBgColor] = useState("transparent");
  
  const [fileName, setFileName] = useState<string>("passport-photo.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(35 / 45); // Default to International
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const presetColors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Light Blue", value: "#ADD8E6" },
    { name: "Light Gray", value: "#D3D3D3" },
    { name: "Deep Red", value: "#8B0000" },
  ];

  const handleFile = (file: File) => {
    setFileName(file.name.replace(/\.[^/.]+$/, "") + "-passport.jpg");
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setImageSrc(url);
      setOriginalImageSrc(url);
      setTransparentImageSrc(null);
      setBgColor("transparent");
      setResultBlob(null); // Reset previous result
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

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0
      );
      if (croppedImageBlob) {
        setResultBlob(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleRemoveBackground = async () => {
    if (!originalImageSrc) return;
    setIsRemovingBg(true);
    try {
      const response = await fetch(originalImageSrc);
      const blob = await response.blob();
      const file = new File([blob], "temp.jpg", { type: blob.type });
      
      const transBlob = await removeImageBackground(file, "isnet_fp16");
      const transUrl = URL.createObjectURL(transBlob);
      setTransparentImageSrc(transUrl);
      setImageSrc(transUrl);
      setBgColor("transparent");
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const applyBgColor = async (color: string) => {
    setBgColor(color);
    if (!transparentImageSrc) return;
    if (color === "transparent") {
      setImageSrc(transparentImageSrc);
      return;
    }

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = transparentImageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 1.0);
    });

    if (blob) {
      const newUrl = URL.createObjectURL(blob);
      if (imageSrc !== originalImageSrc && imageSrc !== transparentImageSrc && imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(newUrl);
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
          <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a portrait photo here, or click to browse files
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, and WEBP. Processing is 100% private.
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
          <Button
            variant="outline"
            className="w-full sm:w-auto border-dashed border-2 hover:bg-muted/50 py-6"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
      {!resultBlob ? (
        <>
          {/* Background Replacement Section */}
          <div className="flex flex-col space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Background</h3>
              {!transparentImageSrc && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                >
                  {isRemovingBg ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4 text-primary" />
                  )}
                  Remove Background
                </Button>
              )}
            </div>

            {transparentImageSrc && (
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-muted-foreground">Select a new solid background color for your passport photo:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => applyBgColor("transparent")}
                    className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${bgColor === "transparent" ? "border-primary" : "border-transparent"} relative overflow-hidden`}
                    title="Transparent"
                  >
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='5' height='5' fill='%23ccc' /%3E%3Crect x='5' y='5' width='5' height='5' fill='%23ccc' /%3E%3Crect x='0' y='5' width='5' height='5' fill='%23eee' /%3E%3Crect x='5' y='0' width='5' height='5' fill='%23eee' /%3E%3C/svg%3E\")" }} />
                    {bgColor === "transparent" && <Check className="h-4 w-4 text-primary z-10" />}
                  </button>

                  {presetColors.map((pc) => (
                    <button
                      key={pc.value}
                      onClick={() => applyBgColor(pc.value)}
                      className={`h-10 w-10 rounded-full border shadow-sm flex items-center justify-center transition-all ring-offset-2 ring-offset-background ${bgColor === pc.value ? "ring-2 ring-primary" : "hover:scale-105"}`}
                      style={{ backgroundColor: pc.value }}
                      title={pc.name}
                    >
                      {bgColor === pc.value && <Check className={`h-4 w-4 ${pc.name === "White" ? "text-black" : "text-white"}`} />}
                    </button>
                  ))}

                  <div className="flex items-center ml-2 border rounded-full overflow-hidden h-10 px-2 group hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="color"
                      value={bgColor !== "transparent" ? bgColor : "#ffffff"}
                      onChange={(e) => applyBgColor(e.target.value)}
                      className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer p-0"
                      title="Custom Color"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-3 md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Crop your passport photo</h3>
              <p className="text-sm text-muted-foreground">Position your face inside the crop box.</p>
            </div>
            
            <div className="flex gap-2 bg-background p-1 rounded-lg shadow-sm border overflow-x-auto hide-scrollbar max-w-full">
              <button
                onClick={() => setAspect(35 / 45)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  aspect === 35 / 45 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                India / EU / UK (35x45mm)
              </button>
              <button
                onClick={() => setAspect(1)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  aspect === 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                US / India OCI (2x2 in)
              </button>
            </div>
          </div>

          <div className="relative w-full h-[50vh] min-h-[400px] bg-black/5 rounded-2xl overflow-hidden border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
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
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value));
                }}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setImageSrc(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Upload Different Photo
            </Button>
            <Button onClick={showCroppedImage} disabled={isProcessing}>
              <Scissors className="mr-2 h-4 w-4" />
              {isProcessing ? "Processing..." : "Generate Passport Photo"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-8 text-center space-y-6">
          <div className="bg-green-500/10 text-green-600 p-3 rounded-full mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold">Your passport photo is ready!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your image has been perfectly cropped to the specified dimensions without leaving your device.
          </p>
          
          <div className="relative border-4 border-white shadow-xl rounded-sm overflow-hidden bg-white max-w-sm mx-auto">
             <img src={URL.createObjectURL(resultBlob)} alt="Cropped passport photo" className="max-w-[250px] w-full h-auto object-contain block mx-auto" />
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => setResultBlob(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cropper
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download JPG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
