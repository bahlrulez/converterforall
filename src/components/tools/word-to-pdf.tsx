"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Download, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertWordToPdf } from "@/lib/converters/word";
import { getPendingFile } from "@/lib/file-transfer";

export default function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("");
  const [useCloudEngine, setUseCloudEngine] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = useCallback(async (targetFile: File, engineMode: "browser" | "cloud" = "browser") => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressText(engineMode === "cloud" ? "Converting via Cloud Engine..." : "Converting Word to PDF in browser...");
    try {
      const blob = await convertWordToPdf(targetFile, { engine: engineMode });
      setResultBlob(blob);
      setProgressText("");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || "An unexpected error occurred during document conversion.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("word-to-pdf");
      if (pending) {
        setFile(pending);
        setFileName(pending.name.replace(/\.docx?$/i, ".pdf"));
        if (pending.name.toLowerCase().endsWith(".doc")) {
          setUseCloudEngine(true);
        }
        processFile(pending);
      }
    }
    checkPending();
  }, [processFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileName(selectedFile.name.replace(/\.docx?$/i, ".pdf"));
      setResultBlob(null);
      setErrorMessage(null);
      if (selectedFile.name.toLowerCase().endsWith(".doc")) {
        setUseCloudEngine(true);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const handleConvert = async () => {
    if (!file) return;
    processFile(file, useCloudEngine ? "cloud" : "browser");
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

  if (!file) {
    return (
      <div className="bg-card rounded-3xl p-6 sm:p-12 border shadow-sm">
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
          <h3 className="text-xl font-semibold mb-2">Upload your Word document</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a DOCX file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            Default is 100% on-device in-browser conversion. Optional cloud conversion uses Cloudmersive API with no permanent storage on our servers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 sm:p-12 border shadow-sm flex flex-col items-center justify-center min-h-[400px]">
      {!resultBlob ? (
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">{file.name.toLowerCase().endsWith(".doc") ? "DOC" : "DOCX"}</span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium">PDF</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-1 text-center">{file.name}</h3>
          {file.name.toLowerCase().endsWith(".doc") && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
              Word 97-2003 / Legacy DOC format
            </span>
          )}

          {/* Inline Error Card */}
          {errorMessage && (
            <div className="w-full mt-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-xs leading-relaxed">{errorMessage}</p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 leading-relaxed">
                    Tip: You can enable &quot;Use Cloud Engine&quot; or re-save the document as standard .docx in Microsoft Word or Google Docs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Opt-In Choice (Unchecked by default) */}
          <div className="w-full mt-4 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 text-left text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useCloudEngine}
                onChange={(e) => setUseCloudEngine(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Use Cloud Engine via third-party service (Cloudmersive API)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Default is 100% in-browser on-device conversion. When unchecked, your document never leaves your device. Check this only if you need desktop Microsoft Office layout accuracy.
                </p>
              </div>
            </label>
          </div>
          
          {isProcessing ? (
            <div className="flex flex-col items-center mt-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">{progressText}</p>
            </div>
          ) : (
            <Button size="lg" className="w-full mt-4 rounded-xl h-14 text-base font-semibold" onClick={handleConvert}>
              {useCloudEngine ? "Convert via Cloud Engine (Cloudmersive API)" : "Convert in Browser (On-Device)"}
            </Button>
          )}
          
          {!isProcessing && (
            <Button variant="ghost" className="mt-4" onClick={() => { setFile(null); setErrorMessage(null); }}>
              Cancel
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-md w-full text-center">
          <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <Download className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Conversion Complete!</h3>
          <p className="text-muted-foreground mb-8">
            Your PDF document is ready to download.
          </p>
          <Button size="lg" className="w-full rounded-xl h-14 text-lg overflow-hidden relative group" onClick={handleDownload}>
            <span className="truncate w-full block px-4">Download {fileName}</span>
          </Button>
          <Button variant="ghost" className="mt-4" onClick={() => { setFile(null); setResultBlob(null); setErrorMessage(null); }}>
            Convert Another File
          </Button>
        </div>
      )}

      {/* Contextual SEO Link */}
      <div className="mt-8 text-center">
        <Link 
          href="/blog/word-to-pdf-formatting-tips" 
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full"
        >
          <FileText className="w-4 h-4" />
          Are fonts changing after conversion? Read our formatting tips
        </Link>
      </div>
    </div>
  );
}
