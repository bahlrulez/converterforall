"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

type AgeResult = { years: number; months: number; days: number; totalDays: number };

function localDateInputValue(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(() => localDateInputValue(new Date()));
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState("");

  const calculateAge = () => {
    const birthDate = parseDateOnly(dob);
    const target = parseDateOnly(targetDate);
    if (!birthDate || !target) {
      setResult(null);
      setError("Enter a valid date of birth and target date.");
      return;
    }
    if (birthDate.getTime() > target.getTime()) {
      setResult(null);
      setError("The date of birth cannot be after the target date.");
      return;
    }

    let years = target.getUTCFullYear() - birthDate.getUTCFullYear();
    let months = target.getUTCMonth() - birthDate.getUTCMonth();
    let days = target.getUTCDate() - birthDate.getUTCDate();

    if (days < 0) {
      months--;
      const previousMonth = new Date(0);
      previousMonth.setUTCHours(0, 0, 0, 0);
      previousMonth.setUTCFullYear(target.getUTCFullYear(), target.getUTCMonth(), 0);
      days += previousMonth.getUTCDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.round((target.getTime() - birthDate.getTime()) / 86_400_000);
    setResult({ years, months, days, totalDays });
    setError("");
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
            <input type="date" value={dob} onChange={(event) => { setDob(event.target.value); setError(""); }}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Date</label>
            <input type="date" value={targetDate} onChange={(event) => { setTargetDate(event.target.value); setError(""); }}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <button onClick={calculateAge} disabled={!dob || !targetDate}
          className="mt-8 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Calculate
        </button>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

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
                <span className="font-medium">Total Days Between Dates: <strong className="text-foreground">{result.totalDays.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">Dates are compared as calendar dates using the Gregorian calendar; time of day and daylight-saving changes do not affect the calculation.</p>
      </div>
    </div>
  );
}
