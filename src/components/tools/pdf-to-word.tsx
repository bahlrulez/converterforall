"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Download, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileName(selectedFile.name.replace(/\.pdf$/i, ".docx"));
      setResultBlob(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const extractTextAndConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressText("Reading PDF file...");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      setProgressText("Parsing PDF document...");
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const paragraphs: Paragraph[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        setProgressText(`Extracting text from page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        let lastY: number | undefined;
        let currentLine = "";
        
        for (const item of content.items as any[]) {
          const y = item.transform[5];
          if (lastY !== undefined && Math.abs(lastY - y) > 5 && currentLine) {
            paragraphs.push(new Paragraph({ children: [new TextRun(currentLine)] }));
            currentLine = "";
          }
          currentLine += item.str;
          lastY = y;
        }
        if (currentLine) {
          paragraphs.push(new Paragraph({ children: [new TextRun(currentLine)] }));
        }
        
        // Add a blank line between pages
        paragraphs.push(new Paragraph({ children: [new TextRun("")] })); 
      }
      
      setProgressText("Generating Word Document...");
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      setResultBlob(blob);
      setProgressText("");
    } catch (err: any) {
      console.error(err);
      alert("An error occurred: " + (err.message || err.toString()));
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
          <h3 className="text-xl font-semibold mb-2">Upload your PDF</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a PDF file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            Fast, secure, and 100% private. Processing happens entirely on your device.
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
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium">PDF</span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">DOCX</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-center">{file.name}</h3>
          
          {isProcessing ? (
            <div className="flex flex-col items-center mt-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">{progressText}</p>
            </div>
          ) : (
            <Button size="lg" className="w-full mt-6 rounded-xl h-14 text-lg" onClick={extractTextAndConvert}>
              Convert to Word
            </Button>
          )}
          
          {!isProcessing && (
            <Button variant="ghost" className="mt-4" onClick={() => setFile(null)}>
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
            Your Word document is ready to download.
          </p>
          <Button size="lg" className="w-full rounded-xl h-14 text-lg" onClick={handleDownload}>
            Download {fileName}
          </Button>
          <Button variant="ghost" className="mt-4" onClick={() => { setFile(null); setResultBlob(null); }}>
            Convert Another File
          </Button>
        </div>
      )}
    </div>
  );
}
