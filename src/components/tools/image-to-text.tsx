"use client";

import React, { useState, useCallback, useEffect } from "react";
import Script from "next/script";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, X, Download, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processImageToText, cleanupOcrWorker } from "@/lib/converters/image-to-text";
import { getPendingFile } from "@/lib/file-transfer";

export default function ImageToTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("image-to-text");
      if (pending) {
        setFile(pending);
        setStatus("idle");
      }
    }
    checkPending();

    return () => {
      // Cleanup worker on unmount
      cleanupOcrWorker();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setErrorMsg("");
      setProgressValue(0);
      setProgressMsg("");
      setExtractedText(null);
      setCopySuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 1,
    multiple: false,
  });

  const reset = async () => {
    setFile(null);
    setStatus("idle");
    setProgressValue(0);
    setProgressMsg("");
    setExtractedText(null);
    setCopySuccess(false);
    await cleanupOcrWorker();
  };

  const handleCopy = async () => {
    if (extractedText) {
      await navigator.clipboard.writeText(extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText || !file) return;
    
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    
    // Extract base name without extension
    const lastDotIndex = file.name.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
    
    a.download = `${baseName}-extracted.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus("processing");
    setProgressMsg("Initializing engines...");
    setProgressValue(5);
    
    try {
      const text = await processImageToText(file, language, (msg, val) => {
        setProgressMsg(msg);
        setProgressValue(val);
      });
      
      setExtractedText(text);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      let errorMessage = "Failed to extract text from image.";
      if (typeof err === "string") errorMessage = err;
      else if (err?.message) errorMessage = err.message;
      else if (err?.name) errorMessage = err.name;
      
      setErrorMsg(errorMessage);
    }
  };

  if (!file) {
    return (
      <div className="bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm">
        <Script src="/tesseract/tesseract.min.js" strategy="lazyOnload" />
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
          <h3 className="text-xl font-semibold mb-2">Upload your Image</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a JPG, PNG, or WebP image here, or click to browse files
          </p>
          <p className="text-xs text-muted-foreground">
            Processing runs 100% locally in your browser. Maximum privacy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
      <Script src="/tesseract/tesseract.min.js" strategy="lazyOnload" />
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          {(status === "idle" || status === "error") && (
            <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:text-destructive">
              <X className="h-5 w-5" />
            </Button>
          )}

          {status === "success" && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>

        {status === "error" && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {errorMsg}
          </div>
        )}

        {status === "idle" && (
          <div className="mt-6 border-t pt-4">
            <label className="text-sm font-medium mb-2 block text-muted-foreground">Image Text Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border bg-background text-foreground mb-4"
            >
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="pan">Punjabi</option>
            </select>
          </div>
        )}

        {status === "processing" && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{progressMsg}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressValue)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Please do not close this tab. OCR processing may take some time depending on your device.
            </p>
          </div>
        )}

        {status === "idle" && (
          <div className="mt-6 border-t pt-4 flex justify-end">
            <Button onClick={handleProcess} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              Extract Text
            </Button>
          </div>
        )}
      </div>

      {status === "success" && extractedText !== null && (
        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Extracted Text</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copySuccess ? <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
                {copySuccess ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
                <Download className="h-4 w-4 mr-1" /> Download .TXT
              </Button>
            </div>
          </div>
          
          <textarea 
            className="w-full h-64 p-4 rounded-xl border bg-muted/30 focus:bg-background resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm leading-relaxed"
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="No text was extracted..."
          />

          <div className="flex justify-end pt-2 border-t">
            <Button variant="ghost" onClick={reset} className="text-muted-foreground">
              <RefreshCw className="mr-2 h-4 w-4" /> Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
