"use client";

import { UploadCloud, Settings, Download } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Upload",
    description: "Choose or drop your file.",
    color: "text-blue-500",
    bg: "bg-[#080e22]",
    border: "border-blue-500/50"
  },
  {
    num: "02",
    title: "Convert",
    description: "Select format and click convert.",
    color: "text-purple-500",
    bg: "bg-[#080e22]",
    border: "border-purple-500/50"
  },
  {
    num: "03",
    title: "Download",
    description: "Get your converted file instantly.",
    color: "text-emerald-500",
    bg: "bg-[#080e22]",
    border: "border-emerald-500/50"
  }
];

export function HowItWorks() {
  return (
    <section className="bg-[#030714] py-12 border-b border-slate-800/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h3 className="text-center text-white font-bold text-xl mb-12">Convert in 3 Simple Steps</h3>
        
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-12 md:gap-4">
          
          {/* Dotted connecting line (desktop only) */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-slate-800 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-4 w-full md:w-1/3 text-left md:text-center group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${step.border} ${step.bg} ${step.color} text-lg font-bold shadow-lg transition-transform group-hover:scale-110`}>
                {step.num}
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
