"use client";

import { useState } from "react";
import { Fuel, Map, Banknote, Car } from "lucide-react";

export function FuelCalculator() {
  const [distance, setDistance] = useState("100");
  const [efficiency, setEfficiency] = useState("25");
  const [price, setPrice] = useState("3.50");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");

  // Calculate results
  const dist = parseFloat(distance) || 0;
  const eff = parseFloat(efficiency) || 0;
  const prc = parseFloat(price) || 0;

  let fuelNeeded = 0;
  let totalCost = 0;

  if (unitSystem === "imperial") {
    // eff is MPG
    if (eff > 0) {
      fuelNeeded = dist / eff;
      totalCost = fuelNeeded * prc;
    }
  } else {
    // eff is L/100km
    if (eff > 0) {
      fuelNeeded = (dist / 100) * eff;
      totalCost = fuelNeeded * prc;
    }
  }

  return (
    <div className="mx-auto max-w-2xl bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-primary">
            <Fuel className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Fuel Cost Calculator</h2>
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

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              Trip Distance
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
              <Car className="h-4 w-4 text-muted-foreground" />
              Fuel Efficiency
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unitSystem === "imperial" ? "mpg" : "L/100km"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Fuel Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-input bg-background pl-8 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unitSystem === "imperial" ? "/gal" : "/L"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/50 p-6 border border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-background rounded-xl shadow-sm border border-border">
              <div className="text-sm text-muted-foreground font-medium mb-1">Estimated Cost</div>
              <div className="text-3xl font-black text-primary">
                ${totalCost.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-background rounded-xl shadow-sm border border-border">
              <div className="text-sm text-muted-foreground font-medium mb-1">Fuel Required</div>
              <div className="text-3xl font-black text-primary">
                {fuelNeeded.toFixed(1)} <span className="text-lg text-muted-foreground font-semibold">{unitSystem === "imperial" ? "Gallons" : "Liters"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
