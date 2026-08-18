"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Copy, Check, AlertCircle, KeyRound, Clock, Calendar, CheckCircle2, Lock, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSm9obnNvbiIsImVtYWlsIjoiYWxleEBleGFtcGxlLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk1MTYzOTAyMn0.4f8d9g0h1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8";

export function JwtDecoder() {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [headerJson, setHeaderJson] = useState<string>("");
  const [payloadJson, setPayloadJson] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [metaInfo, setMetaInfo] = useState<{
    algorithm?: string;
    type?: string;
    issuedAt?: string;
    expiresAt?: string;
    isExpired?: boolean;
    subject?: string;
    issuer?: string;
  }>({});

  const decodeJwt = (jwt: string) => {
    const cleanJwt = jwt.trim();
    if (!cleanJwt) {
      setHeaderJson("");
      setPayloadJson("");
      setSignature("");
      setError(null);
      setMetaInfo({});
      return;
    }

    const parts = cleanJwt.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT Token format. A valid JWT must contain exactly 3 parts separated by dots (Header.Payload.Signature).");
      return;
    }

    try {
      // Decode Base64URL
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        return decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      };

      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));

      setHeaderJson(JSON.stringify(headerObj, null, 2));
      setPayloadJson(JSON.stringify(payloadObj, null, 2));
      setSignature(parts[2]);
      setError(null);

      // Parse metadata
      const nowSec = Math.floor(Date.now() / 1000);
      const isExpired = payloadObj.exp ? payloadObj.exp < nowSec : undefined;

      setMetaInfo({
        algorithm: headerObj.alg || "Unknown",
        type: headerObj.typ || "JWT",
        issuedAt: payloadObj.iat ? new Date(payloadObj.iat * 1000).toLocaleString() : undefined,
        expiresAt: payloadObj.exp ? new Date(payloadObj.exp * 1000).toLocaleString() : undefined,
        isExpired,
        subject: payloadObj.sub,
        issuer: payloadObj.iss,
      });
    } catch (e: any) {
      setError(`Failed to decode JWT: ${e.message || "Invalid Base64 or JSON structure"}`);
    }
  };

  useEffect(() => {
    decodeJwt(tokenInput);
  }, [tokenInput]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* 🔒 100% In-Browser Privacy Guarantee Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold">100% Client-Side Privacy:</span> Your JWT auth tokens and payloads are parsed entirely inside your browser. No data is ever sent to our servers.
        </div>
      </div>

      {/* Main Grid: Input on Left/Top, Decoded JSON on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Token Input Box (5 Columns on Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-blue-500" />
              <span>Paste Encoded Token</span>
            </label>
            <button
              onClick={() => setTokenInput(SAMPLE_JWT)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Load Example
            </button>
          </div>

          <div className="relative">
            <textarea
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              rows={12}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080e22] text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-sm"
            />
            {tokenInput && (
              <button
                onClick={() => setTokenInput("")}
                className="absolute top-3 right-3 text-xs bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Token Metadata Card */}
          {metaInfo.algorithm && !error && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white mb-1">Token Status &amp; Claims</div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Algorithm</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{metaInfo.algorithm}</span>
              </div>
              {metaInfo.expiresAt && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Expires At</span>
                  <span className={cn("font-medium", metaInfo.isExpired ? "text-rose-500 font-bold" : "text-emerald-500")}>
                    {metaInfo.expiresAt} {metaInfo.isExpired ? "(EXPIRED)" : "(VALID)"}
                  </span>
                </div>
              )}
              {metaInfo.issuedAt && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500">Issued At</span>
                  <span className="text-slate-700 dark:text-slate-300">{metaInfo.issuedAt}</span>
                </div>
              )}
              {metaInfo.subject && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Subject (sub)</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{metaInfo.subject}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decoded Output Panels (7 Columns on Desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header Panel (Red Tint) */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-[#140b16] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Header: Algorithm &amp; Token Type
              </span>
              {headerJson && (
                <button
                  onClick={() => copyToClipboard(headerJson, "header")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-500"
                >
                  {copiedKey === "header" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "header" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>
            <pre className="text-xs font-mono text-slate-800 dark:text-rose-200 overflow-x-auto p-3 rounded-xl bg-white/60 dark:bg-black/40 min-h-[70px]">
              {headerJson || "// Header JSON will appear here"}
            </pre>
          </div>

          {/* Payload Panel (Purple Tint) */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-[#120a1f] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Payload: Data &amp; Claims
              </span>
              {payloadJson && (
                <button
                  onClick={() => copyToClipboard(payloadJson, "payload")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-500"
                >
                  {copiedKey === "payload" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "payload" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>
            <pre className="text-xs font-mono text-slate-800 dark:text-purple-200 overflow-x-auto p-3 rounded-xl bg-white/60 dark:bg-black/40 min-h-[140px]">
              {payloadJson || "// Payload JSON will appear here"}
            </pre>
          </div>

          {/* Signature Panel (Cyan Tint) */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-[#07131e] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Signature
              </span>
              {signature && (
                <button
                  onClick={() => copyToClipboard(signature, "signature")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-cyan-500"
                >
                  {copiedKey === "signature" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === "signature" ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>
            <div className="text-xs font-mono text-slate-700 dark:text-cyan-300 break-all p-3 rounded-xl bg-white/60 dark:bg-black/40 min-h-[45px]">
              {signature || "// Signature string will appear here"}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
