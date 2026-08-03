"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculateAge = () => {
    if (!dob || !targetDate) return;

    const birthDate = new Date(dob);
    const target = new Date(targetDate);

    if (birthDate > target) {
      setResult(null);
      return;
    }

    let years = target.getFullYear() - birthDate.getFullYear();
    let months = target.getMonth() - birthDate.getMonth();
    let days = target.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const timeDiff = target.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    setResult({ years, months, days, totalDays });
  };

  return (
    <div className="mx-auto max-w-2xl bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Calculate Your Age</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
              }}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
              }}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <button
          onClick={calculateAge}
          disabled={!dob}
          className="mt-8 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl bg-muted/50 p-6 border border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-background rounded-xl shadow-sm border border-border">
                  <div className="text-3xl font-black text-primary">{result.years}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Years</div>
                </div>
                <div className="p-4 bg-background rounded-xl shadow-sm border border-border">
                  <div className="text-3xl font-black text-primary">{result.months}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Months</div>
                </div>
                <div className="p-4 bg-background rounded-xl shadow-sm border border-border">
                  <div className="text-3xl font-black text-primary">{result.days}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Days</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground bg-background py-3 rounded-xl border border-border shadow-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Total Days Alive: <strong className="text-foreground">{result.totalDays.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
