"use client";

import { useState, useEffect, useCallback } from "react";
import { KeyRound, Copy, RefreshCw, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const chars = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let allowedChars = "";
    if (options.uppercase) allowedChars += chars.uppercase;
    if (options.lowercase) allowedChars += chars.lowercase;
    if (options.numbers) allowedChars += chars.numbers;
    if (options.symbols) allowedChars += chars.symbols;

    if (!allowedChars) {
      setPassword("");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      newPassword += allowedChars[randomIndex];
    }
    setPassword(newPassword);
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Prevent unchecking all
      if (!Object.values(next).some(Boolean)) {
        return prev;
      }
      return next;
    });
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password");
    }
  };

  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    return score;
  };

  const strengthScore = calculateStrength();
  const strengthColor = 
    strengthScore <= 2 ? "bg-red-500" :
    strengthScore <= 3 ? "bg-amber-500" :
    strengthScore <= 4 ? "bg-blue-500" : "bg-emerald-500";
  const strengthText = 
    strengthScore <= 2 ? "Weak" :
    strengthScore <= 3 ? "Fair" :
    strengthScore <= 4 ? "Good" : "Strong";

  return (
    <div className="mx-auto max-w-2xl bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8 text-primary">
          <KeyRound className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Password Generator</h2>
        </div>

        {/* Password Display */}
        <div className="relative mb-8">
          <div className="w-full bg-muted/30 rounded-2xl border border-border p-6 pr-24 break-all font-mono text-xl sm:text-2xl text-center min-h-[5.5rem] flex items-center justify-center tracking-wider">
            {password || "Select options below"}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-background border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:shadow-sm"
              title="Copy"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
            <button 
              onClick={generatePassword}
              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-muted-foreground">Password Strength</span>
            <span className={
              strengthScore <= 2 ? "text-red-500" :
              strengthScore <= 3 ? "text-amber-500" :
              strengthScore <= 4 ? "text-blue-500" : "text-emerald-500"
            }>{strengthText}</span>
          </div>
          <div className="flex gap-1 h-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div 
                key={level} 
                className={`flex-1 rounded-full transition-colors ${level <= strengthScore ? strengthColor : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-8 bg-muted/10 p-6 rounded-2xl border border-border/50">
          <div>
            <div className="flex justify-between text-sm font-medium mb-4">
              <label>Password Length</label>
              <span className="text-primary font-bold text-base">{length}</span>
            </div>
            <Slider 
              value={[length]} 
              min={6} 
              max={64} 
              step={1} 
              onValueChange={(val: any) => setLength(Array.isArray(val) ? val[0] : val)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <input 
                type="checkbox" 
                checked={options.uppercase} 
                onChange={() => toggleOption('uppercase')}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <input 
                type="checkbox" 
                checked={options.lowercase} 
                onChange={() => toggleOption('lowercase')}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <input 
                type="checkbox" 
                checked={options.numbers} 
                onChange={() => toggleOption('numbers')}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <input 
                type="checkbox" 
                checked={options.symbols} 
                onChange={() => toggleOption('symbols')}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Symbols (!@#)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
