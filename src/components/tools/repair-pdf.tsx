"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, X, Download, RefreshCw, AlertTriangle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { repairPdf, RepairResult } from "@/lib/converters/repair";

export default function RepairPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<RepairResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setResult(null);
      setResultUrl(null);
      setErrorMsg("");
      setProgressValue(0);
      setProgressMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setResult(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    setResultUrl(null);
    setProgressValue(0);
    setProgressMsg("");
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus("processing");
    setProgressMsg("Analyzing file integrity...");
    setProgressValue(5);
    
    try {
      const res = await repairPdf(file, (msg, val) => {
        setProgressMsg(msg);
        setProgressValue(val);
      });
      
      const url = URL.createObjectURL(res.blob);
      setResult(res);
      setResultUrl(url);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to repair PDF.");
    }
  };

  if (!file) {
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
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload your corrupted PDF</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a damaged PDF here, or click to browse files
          </p>
          <p className="text-xs text-muted-foreground">
            Repair runs 100% locally in your browser. Maximum privacy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
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
          <div className="mt-4 rounded-lg bg-destructive/10 p-4 border border-destructive/20 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm text-destructive">
              <p className="font-semibold mb-1">Repair Failed</p>
              <p>{errorMsg}</p>
            </div>
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
              Please do not close this tab. Complex repairs may take some time.
            </p>
          </div>
        )}

        {status === "idle" && (
          <div className="mt-6 border-t pt-4 flex justify-end">
            <Button onClick={handleProcess} className="w-full sm:w-auto">
              Repair PDF
            </Button>
          </div>
        )}

        {status === "success" && result && resultUrl && (
          <div className="mt-6 border-t pt-4">
            {result.strategyUsed === 'tier2-rasterize' ? (
              <div className="mb-4 rounded-lg bg-amber-500/10 p-4 border border-amber-500/20 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  <p className="font-semibold mb-1">Deep Reconstruction Used</p>
                  <p>
                    The structural damage was too severe for a standard repair, so the tool salvaged the document visually. 
                    The resulting file is readable, but text may no longer be selectable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-lg bg-green-500/10 p-4 border border-green-500/20 flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div className="text-sm text-green-600 dark:text-green-400">
                  <p className="font-semibold mb-1">Structural Repair Successful</p>
                  <p>
                    The document was successfully rebuilt. Selectable text and high-quality vectors were preserved.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Process Another File
              </Button>
              <Button onClick={() => {
                const a = document.createElement("a");
                a.href = resultUrl;
                a.download = file.name.replace(".pdf", "-repaired.pdf");
                a.click();
              }}>
                <Download className="mr-2 h-4 w-4" />
                Download Repaired PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
