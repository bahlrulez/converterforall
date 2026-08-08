"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import jsQR from "jsqr";
import { Camera, Image as ImageIcon, Copy, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function QrScanner() {
  const [activeTab, setActiveTab] = useState<"camera" | "image">("camera");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsScanning(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        await videoRef.current.play();
        setIsScanning(true);
        scanFrame();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure you have granted permission or try the Image Upload tab.");
      setIsScanning(false);
    }
  }, []);

  // Scan individual frame from video
  const scanFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          setResult(code.data);
          stopCamera();
          return; // Stop scanning once found
        }
      }
    }
    if (isScanning) {
      requestRef.current = requestAnimationFrame(scanFrame);
    }
  }, [isScanning, stopCamera]);

  // Handle Tab Switch
  useEffect(() => {
    if (activeTab === "camera" && !result) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, startCamera, stopCamera, result]);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          // Scale down huge images to prevent freezing
          const MAX_DIMENSION = 1000;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;
          context.drawImage(img, 0, 0, width, height);
          
          const imageData = context.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data) {
            setResult(code.data);
          } else {
            setError("No QR code found in this image. Please try a clearer image.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-primary/10 overflow-hidden bg-background/50 backdrop-blur-xl">
      <CardHeader className="text-center pb-6 border-b bg-muted/30">
        <CardTitle className="text-3xl font-bold tracking-tight">QR Code Scanner</CardTitle>
        <CardDescription className="text-lg">Scan securely in your browser. 100% private.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {!result ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "camera" | "image")} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12">
              <TabsTrigger value="camera" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Camera className="w-4 h-4 mr-2" />
                Live Camera
              </TabsTrigger>
              <TabsTrigger value="image" className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-0">
              <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner border-2 border-muted flex items-center justify-center group">
                {error ? (
                  <div className="p-6 text-center text-red-400 flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
                    <p className="font-medium">{error}</p>
                    <Button onClick={startCamera} variant="outline" className="mt-4 border-red-500/30 hover:bg-red-500/10 text-red-400">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Scanning UI overlay */}
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-[6px] border-primary/30 rounded-2xl m-8 sm:m-16 transition-all duration-1000 ease-in-out">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                          
                          {/* Animated scan line */}
                          <div className="w-full h-0.5 bg-primary/80 absolute shadow-[0_0_8px_2px_rgba(var(--primary),0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm font-medium drop-shadow-md">
                          Point camera at a QR code
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="aspect-[4/3] sm:aspect-video w-full rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 hover:bg-muted/20 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload a QR Code Image</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Drag and drop an image or click to browse. We will instantly decode any QR code found in the picture.
                </p>
                <Button variant="secondary" className="pointer-events-none">
                  Select Image
                </Button>
              </div>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Scan Successful!</h3>
              <p className="text-muted-foreground mb-8">We successfully decoded the QR code.</p>
              
              <div className="w-full bg-background rounded-xl p-6 border shadow-inner text-left mb-8 break-all max-h-64 overflow-y-auto font-mono text-sm sm:text-base">
                {result}
              </div>

              <div className="flex flex-wrap gap-4 justify-center w-full">
                <Button onClick={copyToClipboard} size="lg" className="flex-1 sm:flex-none min-w-[140px]">
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Text
                    </>
                  )}
                </Button>

                {isUrl(result) && (
                  <Button onClick={() => window.open(result, '_blank', 'noopener,noreferrer')} variant="secondary" size="lg" className="flex-1 sm:flex-none min-w-[140px]">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </Button>
                )}

                <Button onClick={resetScanner} variant="outline" size="lg" className="flex-1 sm:flex-none min-w-[140px]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scan Another
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
