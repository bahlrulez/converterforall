"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, Download, RefreshCw, Sparkles, Loader2, X, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";

const PRESETS = [
  { id: "default", name: "Default (Balanced)", desc: "Good balance of color and shape." },
  { id: "posterized1", name: "Logo (Crisp)", desc: "Fewer colors, sharp edges. Great for logos." },
  { id: "curvy", name: "Artwork (Smooth)", desc: "Smoothed curves for illustrations." },
  { id: "bw", name: "Line Art (B&W)", desc: "Strict Black & White for sketches/signatures." },
];

export default function ImageToSvgComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [svgData, setSvgData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("posterized1");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setSvgData(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const processImage = () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setError(null);

    // Give UI time to show loading state
    setTimeout(() => {
      try {
        // Dynamically require imagetracerjs so it doesn't break SSR
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ImageTracer = require("imagetracerjs");
        
        ImageTracer.imageToSVG(
          previewUrl,
          (svgStr: string) => {
            setSvgData(svgStr);
            setIsProcessing(false);
          },
          selectedPreset
        );
      } catch (err) {
        console.error("Tracing error:", err);
        setError("An error occurred while vectorizing the image. Please try a different preset or image.");
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!svgData || !file) return;
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || "vector";
    link.download = `${originalName}-vectorized.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setSvgData(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Settings & Upload Area */}
      {!svgData ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          
          {!file ? (
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px]
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Drop your image here
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                Supports PNG, JPG, and WEBP. We&apos;ll convert it into a scalable SVG vector entirely in your browser.
              </p>
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                Select Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Preview Box */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#0b1329] rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 relative min-h-[250px]">
                <button
                  onClick={resetAll}
                  className="absolute top-3 right-3 p-1.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-full shadow-sm z-10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={previewUrl!}
                  alt="Original Preview"
                  className="max-w-full max-h-[300px] object-contain rounded drop-shadow-md"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
                  Original Raster
                </div>
              </div>

              {/* Controls Box */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Tracing Settings
                </h3>
                
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`cursor-pointer p-3 rounded-lg border transition-all ${
                        selectedPreset === preset.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500/50"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${selectedPreset === preset.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                          {selectedPreset === preset.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{preset.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 pl-6">{preset.desc}</p>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Tracing Vectors...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Convert to Vector (SVG)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Result Area */
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-emerald-200 dark:border-emerald-900/30 overflow-hidden">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Vectorization Complete</h3>
            </div>
            <button
              onClick={resetAll}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Convert Another
            </button>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 bg-slate-100 dark:bg-[#0b1329] rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 flex items-center justify-center min-h-[300px] relative pattern-checkered">
              {/* Render the SVG safely by using dangerouslySetInnerHTML */}
              <div 
                className="max-w-full max-h-[400px] flex items-center justify-center drop-shadow-lg [&>svg]:max-w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: svgData }}
              />
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm text-slate-800 dark:text-slate-200">
                Scalable Vector (SVG)
              </div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Success!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Your image has been perfectly traced into mathematical vector paths. It can now be scaled indefinitely without losing quality.
              </p>
              
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download SVG File
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  Processed 100% locally in your browser. No files were uploaded to our servers, ensuring total privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
