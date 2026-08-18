"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Copy, Check, ArrowRight, RefreshCw, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function TimestampConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [currentEpochMs, setCurrentEpochMs] = useState<number>(Date.now());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Epoch to Date Form State
  const [epochInput, setEpochInput] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [convertedDate, setConvertedDate] = useState<{
    local?: string;
    utc?: string;
    iso?: string;
    relative?: string;
  }>({});

  // Date to Epoch Form State
  const [dateInput, setDateInput] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [convertedEpoch, setConvertedEpoch] = useState<{ sec?: number; ms?: number }>({});

  // Live Epoch Clock Ticker
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentEpoch(Math.floor(now / 1000));
      setCurrentEpochMs(now);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Convert Epoch to Human Date
  useEffect(() => {
    const raw = epochInput.trim();
    if (!raw || isNaN(Number(raw))) {
      setConvertedDate({});
      return;
    }
    try {
      const num = Number(raw);
      // Auto detect seconds vs milliseconds
      const date = raw.length > 11 ? new Date(num) : new Date(num * 1000);
      if (isNaN(date.getTime())) {
        setConvertedDate({});
        return;
      }

      // Relative calculation
      const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
      let relative = "";
      if (Math.abs(diffSec) < 60) relative = diffSec >= 0 ? "in a few seconds" : "a few seconds ago";
      else if (Math.abs(diffSec) < 3600) {
        const mins = Math.round(diffSec / 60);
        relative = mins > 0 ? `in ${mins} minutes` : `${Math.abs(mins)} minutes ago`;
      } else if (Math.abs(diffSec) < 86400) {
        const hours = Math.round(diffSec / 3600);
        relative = hours > 0 ? `in ${hours} hours` : `${Math.abs(hours)} hours ago`;
      } else {
        const days = Math.round(diffSec / 86400);
        relative = days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
      }

      setConvertedDate({
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        iso: date.toISOString(),
        relative,
      });
    } catch {
      setConvertedDate({});
    }
  }, [epochInput]);

  // Convert Date to Epoch
  useEffect(() => {
    if (!dateInput) {
      setConvertedEpoch({});
      return;
    }
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) {
      setConvertedEpoch({
        sec: Math.floor(d.getTime() / 1000),
        ms: d.getTime(),
      });
    } else {
      setConvertedEpoch({});
    }
  }, [dateInput]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* 🔒 100% In-Browser Privacy Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <div>
          <span className="font-bold">100% In-Browser Execution:</span> Precise Unix epoch conversion rendered locally in your timezone without any server requests.
        </div>
      </div>

      {/* Live Current Epoch Clock Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/30 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center justify-center md:justify-start gap-1.5 mb-1">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Current Unix Epoch Time</span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900 dark:text-white tracking-tight">
            {currentEpoch}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Milliseconds: {currentEpochMs}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => copyToClipboard(String(currentEpoch), "live")}
            className="h-10 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shadow-md shadow-blue-500/20"
          >
            {copiedKey === "live" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === "live" ? "Copied" : "Copy Epoch"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPaused(!isPaused)}
            className="h-10 px-3 rounded-xl text-xs font-bold"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      {/* Two Conversion Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel 1: Timestamp to Date */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Timestamp to Human Date</span>
            </h3>
            <button
              onClick={() => setEpochInput(String(Math.floor(Date.now() / 1000)))}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Current Time
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-medium">Enter Unix Timestamp (Seconds or Ms):</label>
            <input
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1718000000"
              className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#040814] font-mono text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {convertedDate.local && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Local Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{convertedDate.local}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">UTC Time:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{convertedDate.utc}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">ISO 8601:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{convertedDate.iso}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Relative:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{convertedDate.relative}</span>
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Date to Timestamp */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              <span>Human Date to Timestamp</span>
            </h3>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-medium">Select Local Date &amp; Time:</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#040814] font-sans text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {convertedEpoch.sec !== undefined && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Epoch (Seconds)</div>
                  <div className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{convertedEpoch.sec}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(String(convertedEpoch.sec), "sec")}
                  className="text-xs font-bold text-slate-500 hover:text-blue-500"
                >
                  {copiedKey === "sec" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Epoch (Milliseconds)</div>
                  <div className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">{convertedEpoch.ms}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(String(convertedEpoch.ms), "ms")}
                  className="text-xs font-bold text-slate-500 hover:text-purple-500"
                >
                  {copiedKey === "ms" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
