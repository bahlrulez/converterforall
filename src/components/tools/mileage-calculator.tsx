"use client";

import { useState } from "react";
import { Gauge, MapPin, Fuel } from "lucide-react";

export function MileageCalculator() {
  const [distance, setDistance] = useState("300");
  const [fuel, setFuel] = useState("12");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");

  // Calculate results
  const dist = parseFloat(distance) || 0;
  const f = parseFloat(fuel) || 0;

  let efficiency = 0;
  let label = "";

  if (unitSystem === "imperial") {
    // Miles and Gallons -> MPG
    label = "MPG (Miles per Gallon)";
    if (f > 0) {
      efficiency = dist / f;
    }
  } else {
    // Kilometers and Liters -> L/100km
    label = "L/100km (Liters per 100km)";
    if (dist > 0) {
      efficiency = (f / dist) * 100;
    }
  }

  // Calculate alternative metric for display
  let altEfficiency = 0;
  let altLabel = "";
  if (unitSystem === "metric" && f > 0) {
    altEfficiency = dist / f;
    altLabel = "km/L (Kilometers per Liter)";
  }

  return (
    <div className="mx-auto max-w-2xl bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-primary">
            <Gauge className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Mileage Calculator</h2>
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setUnitSystem("imperial")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                unitSystem === "imperial" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem("metric")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                unitSystem === "metric" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Metric
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Distance Traveled
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unitSystem === "imperial" ? "mi" : "km"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              Fuel Used
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unitSystem === "imperial" ? "gal" : "Liters"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6 border border-border flex flex-col items-center justify-center text-center">
          <div className="text-sm text-muted-foreground font-medium mb-2">Fuel Efficiency</div>
          <div className="text-5xl font-black text-primary mb-2">
            {efficiency > 0 ? efficiency.toFixed(1) : "0.0"}
          </div>
          <div className="text-lg text-muted-foreground font-semibold">
            {label}
          </div>
          
          {unitSystem === "metric" && altEfficiency > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
              or <strong className="text-foreground">{altEfficiency.toFixed(1)}</strong> {altLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
