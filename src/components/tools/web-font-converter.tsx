"use client";

import React, { useState, useCallback, useEffect } from "react";
import { UploadCloud, Download, Loader2, Type } from "lucide-react";
import { useDropzone } from "react-dropzone";

// We import dynamically to avoid SSR issues with fonteditor-core
let fonteditorCore: any = null;

export default function WebFontConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputType, setOutputType] = useState<"ttf" | "woff" | "woff2">("woff2");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize WebAssembly for woff2
    import("fonteditor-core").then((module) => {
      fonteditorCore = module;
      // Provide the path to the WebAssembly file
      fonteditorCore.woff2.init("/assets/woff2.wasm").then(() => {
        setIsReady(true);
      }).catch((err: any) => {
        console.error("Failed to init WOFF2 WASM:", err);
        setError("Failed to initialize font processor. Your browser may not support WebAssembly.");
      });
    });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      setError(null);
      
      // Auto-select output based on input
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (ext === 'woff2') setOutputType('ttf');
      else setOutputType('woff2');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "font/ttf": [".ttf"],
      "font/otf": [".otf"],
      "font/woff": [".woff"],
      "font/woff2": [".woff2"],
    },
    maxFiles: 1,
    multiple: false
  });

  const handleConvert = async () => {
    if (!file || !fonteditorCore) return;

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const inputExt = file.name.split('.').pop()?.toLowerCase();
      
      let inputType = inputExt;
      if (inputExt === 'otf') inputType = 'otf'; // Note: fonteditor-core only reads OTF and converts to TTF internally.

      const font = fonteditorCore.createFont(arrayBuffer, {
        type: inputType as "ttf" | "woff" | "woff2" | "otf" | "eot" | "svg",
      });

      const outBuffer = font.write({
        type: outputType
      });

      const blob = new Blob([outBuffer], { type: `font/${outputType}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, "") + `.${outputType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while converting the font.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-[#1C1C28] rounded-2xl border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Type className="w-6 h-6 text-blue-500" />
              Font Converter
            </h2>
            <p className="text-gray-400">
              Convert TTF, OTF, WOFF, and WOFF2 formats completely inside your browser. 
              No files are uploaded to any server.
            </p>
          </div>

          {!isReady && !error && (
            <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading Font Processing Engine...</p>
            </div>
          )}

          {isReady && !file && (
            <div
              {...getRootProps()}
              className={`p-12 text-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                ${isDragActive 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-white/10 hover:border-blue-500/50 hover:bg-white/[0.02]"
                }`}
            >
              <input {...getInputProps()} />
              <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-lg font-medium text-white mb-2">
                Drop your font file here
              </p>
              <p className="text-sm text-gray-400">
                Supports .ttf, .otf, .woff, .woff2
              </p>
            </div>
          )}

          {file && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Type className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Local Processing
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Change File
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-300">Target Format:</p>
                  <div className="flex flex-wrap gap-3">
                    {(["woff2", "woff", "ttf"] as const).map((ext) => (
                      <button
                        key={ext}
                        onClick={() => setOutputType(ext)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          outputType === ext
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white"
                        }`}
                      >
                        {ext.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-semibold transition-all duration-200
                  flex items-center justify-center gap-2
                  bg-blue-500 hover:bg-blue-600 text-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download {outputType.toUpperCase()}
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                  <div className="mt-0.5">•</div>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
