"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Download, Key, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function UuidGenerator() {
  const [tab, setTab] = useState<"generate" | "validate">("generate");
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [wrapBraces, setWrapBraces] = useState<boolean>(false);
  const [wrapQuotes, setWrapQuotes] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Validate State
  const [validateInput, setValidateInput] = useState<string>("");
  const [validationResult, setValidationResult] = useState<{
    isValid?: boolean;
    version?: string;
    variant?: string;
    message?: string;
  } | null>(null);

  const generateUuids = (cnt: number = count) => {
    const list: string[] = [];
    for (let i = 0; i < cnt; i++) {
      let id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : fallbackUuidV4();
      if (uppercase) id = id.toUpperCase();
      if (removeHyphens) id = id.replace(/-/g, "");
      if (wrapBraces) id = `{${id}}`;
      if (wrapQuotes) id = `"${id}"`;
      list.push(id);
    }
    setUuids(list);
  };

  const fallbackUuidV4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const validateUuid = (input: string) => {
    const clean = input.trim().replace(/^[{("']+|[})'"]+$/g, "");
    if (!clean) {
      setValidationResult(null);
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5])[0-9a-f]{3}-([89ab][0-9a-f]{3})-[0-9a-f]{12}$/i;
    const match = clean.match(uuidRegex);

    if (match) {
      const version = match[1];
      const variantChar = match[2].charAt(0).toLowerCase();
      let variant = "RFC 4122 / DCE 1.1";
      if (["8", "9", "a", "b"].includes(variantChar)) {
        variant = "Standard RFC 4122 (Variant 1)";
      }

      setValidationResult({
        isValid: true,
        version: `Version ${version} (${version === "4" ? "Randomly Generated" : version === "1" ? "Time-based" : "Namespace-based"})`,
        variant,
        message: "Valid RFC 4122 Compliant UUID",
      });
    } else {
      setValidationResult({
        isValid: false,
        message: "Invalid UUID format. Expected 32 hexadecimal digits separated by hyphens (8-4-4-4-12).",
      });
    }
  };

  React.useEffect(() => {
    generateUuids(count);
  }, [count, uppercase, removeHyphens, wrapBraces, wrapQuotes]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      
      {/* Privacy Guarantee Header */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <span className="font-bold">Cryptographically Secure &amp; Private:</span> Generated directly using your device's native <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-[11px] font-mono">crypto.randomUUID()</code> engine.
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        
        {/* Tab Switcher Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setTab("generate")}
              className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all", tab === "generate" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500")}
            >
              Generate UUIDs
            </button>
            <button
              onClick={() => setTab("validate")}
              className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all", tab === "validate" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs" : "text-slate-500")}
            >
              Validate &amp; Inspect UUID
            </button>
          </div>
        </div>

        {tab === "generate" ? (
          <div className="space-y-4">
            
            {/* Options Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#040814] border border-slate-200 dark:border-slate-800">
              
              {/* Count Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                <div className="flex items-center gap-1">
                  {[1, 5, 10, 25, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-colors", count === n ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700")}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={(e) => setUppercase(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Uppercase</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeHyphens}
                    onChange={(e) => setRemoveHyphens(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Remove Hyphens</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wrapBraces}
                    onChange={(e) => setWrapBraces(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Braces {'{}'}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wrapQuotes}
                    onChange={(e) => setWrapQuotes(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Quotes {"\"\""}</span>
                </label>
              </div>

              {/* Refresh Button */}
              <Button
                size="sm"
                onClick={() => generateUuids(count)}
                className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </Button>
            </div>

            {/* Output List Display */}
            <div className="relative">
              <textarea
                value={uuids.join("\n")}
                readOnly
                rows={Math.min(16, Math.max(5, count))}
                className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-200 focus:outline-none shadow-inner leading-relaxed"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-semibold">{uuids.length} UUID(s) generated</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyAll}
                  className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied All" : "Copy All"}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </Button>
              </div>
            </div>

          </div>
        ) : (
          /* Validate UUID Tab */
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste UUID to Validate &amp; Inspect:</label>
              <input
                type="text"
                value={validateInput}
                onChange={(e) => {
                  setValidateInput(e.target.value);
                  validateUuid(e.target.value);
                }}
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                className="w-full mt-1.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#040814] font-mono text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {validationResult && (
              <div
                className={cn(
                  "p-4 rounded-2xl border space-y-2 text-xs",
                  validationResult.isValid
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                )}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                  <span>{validationResult.message}</span>
                </div>
                {validationResult.version && (
                  <div className="flex justify-between py-1 border-t border-emerald-500/20 font-medium">
                    <span>UUID Version:</span>
                    <span className="font-bold">{validationResult.version}</span>
                  </div>
                )}
                {validationResult.variant && (
                  <div className="flex justify-between py-1 border-t border-emerald-500/20 font-medium">
                    <span>Variant:</span>
                    <span>{validationResult.variant}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
