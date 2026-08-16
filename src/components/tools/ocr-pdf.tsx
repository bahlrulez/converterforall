"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, X, Download, RefreshCw, FileBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processOcrPdf } from "@/lib/converters/ocr";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { getPendingFile } from "@/lib/file-transfer";

export default function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");

  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("ocr-pdf");
      if (pending) {
        setFile(pending);
        setStatus("idle");
      }
    }
    checkPending();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setResultUrl(null);
      setErrorMsg("");
      setProgressValue(0);
      setProgressMsg("");
      setExtractedText(null);
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
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setProgressValue(0);
    setProgressMsg("");
    setExtractedText(null);
  };

  const handleDownloadWord = async () => {
    if (!extractedText || !file) return;
    
    let targetFont = "Arial";
    if (language === "hin") targetFont = "Mangal";
    else if (language === "pan") targetFont = "Raavi";
    
    const textLines = extractedText.split('\n');
    const paragraphs = textLines.map(line => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: targetFont
          })
        ]
      });
    });

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: targetFont,
            },
          },
        },
      },
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });

    const blob = await Packer.toBlob(doc);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(".pdf", "-extracted.docx");
    a.click();
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus("processing");
    setProgressMsg("Initializing engines...");
    setProgressValue(5);
    
    try {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      
      const { pdfBlob, text } = await processOcrPdf(file, (msg, val) => {
        setProgressMsg(msg);
        setProgressValue(val);
      }, language);
      
      const url = URL.createObjectURL(pdfBlob);
      setResultUrl(url);
      setExtractedText(text);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      let errorMessage = "Failed to process PDF.";
      if (typeof err === "string") errorMessage = err;
      else if (err?.message) errorMessage = err.message;
      else if (err?.name) errorMessage = err.name;
      
      setErrorMsg(errorMessage);
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
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload your PDF</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a scanned PDF here, or click to browse files
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
            <label className="text-sm font-medium mb-2 block text-muted-foreground">Document Language</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border bg-background text-foreground mb-4"
            >
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="pan">Punjabi</option>
              <option value="eng+hin">English + Hindi</option>
              <option value="eng+pan">English + Punjabi</option>
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
              Please do not close this tab. OCR processing is heavy and may take some time depending on your device.
            </p>
          </div>
        )}

        {status === "idle" && (
          <div className="mt-6 border-t pt-4 flex justify-end">
            <Button onClick={handleProcess} className="w-full sm:w-auto">
              Run OCR (Make Searchable)
            </Button>
          </div>
        )}

        {status === "success" && resultUrl && (
          <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Process Another File
            </Button>
            <Button variant="secondary" onClick={handleDownloadWord}>
              <FileBox className="mr-2 h-4 w-4" />
              Direct Word Doc
            </Button>
            <Button onClick={() => {
              const a = document.createElement("a");
              a.href = resultUrl;
              a.download = file.name.replace(".pdf", "-searchable.pdf");
              a.click();
            }}>
              <Download className="mr-2 h-4 w-4" />
              Searchable PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
