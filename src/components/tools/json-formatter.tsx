"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Wand2, Minimize2, CheckCircle2, AlertCircle, Trash2, FileText, Upload, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_JSON = `{
  "site": "Converter for All",
  "features": ["100% In-Browser", "Zero Cloud Uploads", "Private & Fast"],
  "stats": {
    "toolsCount": 150,
    "uptime": 99.9,
    "unlimited": true
  }
}`;

export function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number | "tab">(2);
  const [validationStatus, setValidationStatus] = useState<{ isValid: boolean; message: string } | null>({
    isValid: true,
    message: "Valid JSON",
  });
  const [copied, setCopied] = useState<boolean>(false);

  const validateAndFormat = (raw: string, indent: number | "tab" = indentSize) => {
    if (!raw.trim()) {
      setValidationStatus(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const space = indent === "tab" ? "\t" : indent;
      const formatted = JSON.stringify(parsed, null, space);
      setJsonInput(formatted);
      setValidationStatus({ isValid: true, message: "Valid JSON syntax" });
    } catch (err: any) {
      setValidationStatus({
        isValid: false,
        message: err.message || "Invalid JSON syntax",
      });
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setValidationStatus({ isValid: true, message: "Minified successfully" });
    } catch (err: any) {
      setValidationStatus({ isValid: false, message: err.message });
    }
  };

  const handleAutoRepair = () => {
    if (!jsonInput.trim()) return;
    try {
      // Common JSON fixes: remove trailing commas, single quotes to double quotes, unquoted keys
      let fixed = jsonInput
        // Replace single quotes with double quotes
        .replace(/'/g, '"')
        // Remove trailing commas before } or ]
        .replace(/,\s*([\]}])/g, "$1");

      const parsed = JSON.parse(fixed);
      setJsonInput(JSON.stringify(parsed, null, indentSize === "tab" ? "\t" : indentSize));
      setValidationStatus({ isValid: true, message: "Repaired and formatted successfully!" });
    } catch (err: any) {
      setValidationStatus({
        isValid: false,
        message: `Auto-repair could not completely resolve syntax: ${err.message}`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      validateAndFormat(content);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!jsonInput.trim()) return;
    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      
      {/* Privacy Guarantee Header */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <span className="font-bold">100% In-Browser Execution:</span> Your JSON data is formatted, validated, and processed entirely on your device.
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          {/* Left Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => validateAndFormat(jsonInput)}
              className="h-9 px-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-sm gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Prettify / Format</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleMinify}
              className="h-9 px-3.5 rounded-xl font-bold text-xs gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAutoRepair}
              className="h-9 px-3.5 rounded-xl font-bold text-xs gap-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
              title="Auto fix trailing commas and single quotes"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Repair</span>
            </Button>

            {/* Indent Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
              <span className="text-[11px] text-slate-500 px-1">Indent:</span>
              <button
                onClick={() => {
                  setIndentSize(2);
                  validateAndFormat(jsonInput, 2);
                }}
                className={cn("px-2 py-0.5 rounded-lg", indentSize === 2 ? "bg-white dark:bg-slate-700 font-bold shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                2
              </button>
              <button
                onClick={() => {
                  setIndentSize(4);
                  validateAndFormat(jsonInput, 4);
                }}
                className={cn("px-2 py-0.5 rounded-lg", indentSize === 4 ? "bg-white dark:bg-slate-700 font-bold shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                4
              </button>
              <button
                onClick={() => {
                  setIndentSize("tab");
                  validateAndFormat(jsonInput, "tab");
                }}
                className={cn("px-2 py-0.5 rounded-lg", indentSize === "tab" ? "bg-white dark:bg-slate-700 font-bold shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Tab
              </button>
            </div>
          </div>

          {/* Right Secondary Options */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .json</span>
              </div>
              <input type="file" accept=".json,application/json,text/plain" onChange={handleFileUpload} className="hidden" />
            </label>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 px-2.5 rounded-xl text-xs gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="h-8 px-2.5 rounded-xl text-xs gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setJsonInput("");
                setValidationStatus(null);
              }}
              className="h-8 px-2 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

        </div>

        {/* Textarea Editor Area */}
        <div className="relative">
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              try {
                if (e.target.value.trim()) {
                  JSON.parse(e.target.value);
                  setValidationStatus({ isValid: true, message: "Valid JSON syntax" });
                } else {
                  setValidationStatus(null);
                }
              } catch (err: any) {
                setValidationStatus({ isValid: false, message: err.message });
              }
            }}
            placeholder="Paste your JSON here..."
            rows={18}
            className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 leading-relaxed shadow-inner"
          />
        </div>

        {/* Real-time Syntax Validation Bar */}
        {validationStatus && (
          <div
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl text-xs font-semibold transition-all",
              validationStatus.isValid
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
            )}
          >
            {validationStatus.isValid ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-mono">{validationStatus.message}</span>
          </div>
        )}

      </div>

    </div>
  );
}
