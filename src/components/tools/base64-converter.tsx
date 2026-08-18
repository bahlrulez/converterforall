"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Upload, ArrowLeftRight, FileText, Image as ImageIcon, Lock, AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function Base64Converter({ defaultAction = "encode" }: { defaultAction?: "encode" | "decode" }) {
  const [tab, setTab] = useState<"text" | "file">("text");
  const [action, setAction] = useState<"encode" | "decode">(defaultAction);
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>("Hello, Converter for All! 🚀");
  const [textOutput, setTextOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // File Mode States
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileMime, setFileMime] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

  const processText = (input: string, act: "encode" | "decode", isUrlSafe: boolean) => {
    if (!input) {
      setTextOutput("");
      setError(null);
      return;
    }
    try {
      if (act === "encode") {
        // UTF-8 safe encode
        const encoded = btoa(
          encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          )
        );
        const finalStr = isUrlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
        setTextOutput(finalStr);
        setError(null);
      } else {
        // Decode
        let clean = input.trim();
        if (isUrlSafe || clean.includes("-") || clean.includes("_")) {
          clean = clean.replace(/-/g, "+").replace(/_/g, "/");
          while (clean.length % 4) clean += "=";
        }
        const decoded = decodeURIComponent(
          atob(clean)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        setTextOutput(decoded);
        setError(null);
      }
    } catch (err: any) {
      setError(`Invalid Base64 sequence: ${err.message}`);
      setTextOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileMime(file.type || "application/octet-stream");
    setFileSize((file.size / 1024).toFixed(1) + " KB");

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFileBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFileFromBase64 = () => {
    if (!textInput.trim()) return;
    try {
      const isDataUrl = textInput.startsWith("data:");
      const href = isDataUrl ? textInput : `data:application/octet-stream;base64,${textInput}`;
      const link = document.createElement("a");
      link.href = href;
      link.download = "decoded_file.bin";
      link.click();
    } catch (err: any) {
      alert(`Download error: ${err.message}`);
    }
  };

  React.useEffect(() => {
    if (tab === "text") {
      processText(textInput, action, urlSafe);
    }
  }, [textInput, action, urlSafe, tab]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      
      {/* Privacy Guarantee Header */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
        <div>
          <span className="font-bold">100% In-Browser Execution:</span> Fast Base64 encoding and decoding performed locally on your device. Zero data sent to backend servers.
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        
        {/* Mode Switcher Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          {/* Text vs File Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setTab("text")}
              className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all", tab === "text" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500")}
            >
              Text Mode
            </button>
            <button
              onClick={() => setTab("file")}
              className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all", tab === "file" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500")}
            >
              File to Base64
            </button>
          </div>

          {/* Action Switcher & URL-safe toggle */}
          {tab === "text" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => setAction("encode")}
                  className={cn("px-3 py-1 rounded-lg text-xs font-bold", action === "encode" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500")}
                >
                  Encode
                </button>
                <button
                  onClick={() => setAction("decode")}
                  className={cn("px-3 py-1 rounded-lg text-xs font-bold", action === "decode" ? "bg-blue-600 text-white shadow-xs" : "text-slate-500")}
                >
                  Decode
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>URL-Safe (- / _)</span>
              </label>
            </div>
          )}

        </div>

        {tab === "text" ? (
          /* Text Mode Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Input Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{action === "encode" ? "Plain Text (Input)" : "Base64 String (Input)"}</span>
                <button onClick={() => setTextInput("")} className="text-[11px] text-slate-400 hover:text-rose-500">
                  Clear
                </button>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={12}
                placeholder={action === "encode" ? "Type or paste text to encode..." : "Paste Base64 string to decode..."}
                className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
            </div>

            {/* Output Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{action === "encode" ? "Base64 Result" : "Decoded Text"}</span>
                {textOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(textOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
              <textarea
                value={textOutput}
                readOnly
                rows={12}
                placeholder="Result will appear here..."
                className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-200 focus:outline-none shadow-inner"
              />
            </div>

          </div>
        ) : (
          /* File to Base64 Mode */
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-center">
              <Upload className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Upload Any File (Image, PDF, Audio, Document)
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Instant client-side encoding into standard Base64 Data URL
              </p>
              <label className="cursor-pointer">
                <div className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md">
                  Choose File
                </div>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {fileBase64 && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>File: {fileName} ({fileSize} - {fileMime})</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fileBase64);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied Data URL" : "Copy Data URL"}</span>
                  </button>
                </div>
                <textarea
                  value={fileBase64}
                  readOnly
                  rows={6}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black text-slate-800 dark:text-slate-200"
                />
                {fileMime.startsWith("image/") && (
                  <div className="p-3 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <img src={fileBase64} alt="Preview" className="h-16 w-16 object-contain rounded border" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Live Image Preview</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </div>

    </div>
  );
}
