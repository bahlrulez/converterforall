"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const LENGTH_UNITS = {
  meters: { name: "Meters", factor: 1 },
  centimeters: { name: "Centimeters", factor: 0.01 },
  millimeters: { name: "Millimeters", factor: 0.001 },
  micrometers: { name: "Micrometers", factor: 0.000001 },
  nanometers: { name: "Nanometers", factor: 0.000000001 },
  kilometers: { name: "Kilometers", factor: 1000 },
  inches: { name: "Inches", factor: 0.0254 },
  feet: { name: "Feet", factor: 0.3048 },
  yards: { name: "Yards", factor: 0.9144 },
  miles: { name: "Miles", factor: 1609.344 },
  "nautical-miles": { name: "Nautical Miles", factor: 1852 },
  furlongs: { name: "Furlongs", factor: 201.168 },
  chains: { name: "Chains", factor: 20.1168 },
  rods: { name: "Rods", factor: 5.0292 },
  leagues: { name: "Leagues", factor: 4828.032 },
  "light-years": { name: "Light Years", factor: 9.4607e15 },
  parsecs: { name: "Parsecs", factor: 3.0857e16 },
} as const;

export type LengthUnitId = keyof typeof LENGTH_UNITS;

interface LengthConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
}

export function LengthConverter({ defaultFrom = "inches", defaultTo = "centimeters" }: LengthConverterProps) {
  // Ensure defaults are valid keys, otherwise fallback to inches/centimeters
  const safeFrom = (LENGTH_UNITS[defaultFrom as LengthUnitId] ? defaultFrom : "inches") as LengthUnitId;
  const safeTo = (LENGTH_UNITS[defaultTo as LengthUnitId] ? defaultTo : "centimeters") as LengthUnitId;

  const [fromUnit, setFromUnit] = useState<LengthUnitId>(safeFrom);
  const [toUnit, setToUnit] = useState<LengthUnitId>(safeTo);
  
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");

  const [copied, setCopied] = useState(false);

  // Core conversion logic
  const convert = (value: string, fromId: LengthUnitId, toId: LengthUnitId): string => {
    if (!value || isNaN(Number(value))) return "";
    const numValue = Number(value);
    
    // Convert to meters first (the base unit)
    const inMeters = numValue * LENGTH_UNITS[fromId].factor;
    // Then convert to target unit
    const finalValue = inMeters / LENGTH_UNITS[toId].factor;
    
    // Format nicely to avoid huge floating point issues like 1.0000000000000002
    return Number(finalValue.toPrecision(10)).toString();
  };

  // Run conversion when units or values change
  useEffect(() => {
    setToValue(convert(fromValue, fromUnit, toUnit));
  }, [fromUnit, toUnit, fromValue]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    setFromValue(convert(e.target.value, toUnit, fromUnit));
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${toValue} ${LENGTH_UNITS[toUnit].name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-lg">
        
        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          
          {/* FROM */}
          <div className="flex-1 w-full bg-muted/50 rounded-2xl p-4 border border-border/50 hover:border-primary/50 transition-colors">
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as LengthUnitId)}
              className="w-full bg-transparent text-muted-foreground font-medium text-sm mb-2 outline-none cursor-pointer"
            >
              {Object.entries(LENGTH_UNITS).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
            <input 
              type="number"
              value={fromValue}
              onChange={handleFromChange}
              className="w-full bg-transparent text-4xl sm:text-5xl font-bold outline-none text-foreground placeholder:text-muted-foreground/30"
              placeholder="0"
            />
          </div>

          {/* SWAP BUTTON */}
          <div className="z-10 -my-4 md:-mx-4 md:my-0 p-2 bg-card rounded-full shadow-sm border">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-12 w-12 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={swapUnits}
            >
              <ArrowLeftRight className="h-6 w-6 md:rotate-0 rotate-90" />
            </Button>
          </div>

          {/* TO */}
          <div className="flex-1 w-full bg-primary/5 rounded-2xl p-4 border border-primary/20">
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as LengthUnitId)}
              className="w-full bg-transparent text-muted-foreground font-medium text-sm mb-2 outline-none cursor-pointer"
            >
              {Object.entries(LENGTH_UNITS).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
            <input 
              type="number"
              value={toValue}
              onChange={handleToChange}
              className="w-full bg-transparent text-4xl sm:text-5xl font-bold outline-none text-primary placeholder:text-primary/30"
              placeholder="0"
            />
          </div>

        </div>

        {/* Copy Result */}
        <div className="mt-8 flex items-center justify-between bg-muted/30 p-4 rounded-xl border">
          <div className="text-sm font-medium">
            <span className="text-muted-foreground">Result: </span>
            <span className="text-foreground">{fromValue || "0"} {LENGTH_UNITS[fromUnit].name} = </span>
            <span className="text-primary font-bold">{toValue || "0"} {LENGTH_UNITS[toUnit].name}</span>
          </div>
          <Button variant="secondary" size="sm" className="gap-2" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

      </div>
    </div>
  );
}
