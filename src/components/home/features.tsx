"use client";

import { Shield, Zap, Lock, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Your Files Stay Private",
    description: "All conversions happen in your browser.",
    icon: Lock,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    gradientHover: "hover:border-blue-500/50"
  },
  {
    title: "No Daily Limits",
    description: "Convert as much as you want.",
    icon: InfinityIcon,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    gradientHover: "hover:border-purple-500/50"
  },
  {
    title: "No Watermarks",
    description: "Get clean, professional output.",
    icon: Shield,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10 border-pink-500/20",
    gradientHover: "hover:border-pink-500/50"
  },
  {
    title: "No Account Required",
    description: "Open a tool and start converting instantly.",
    icon: Zap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    gradientHover: "hover:border-emerald-500/50"
  }
];

export function Features() {
  return (
    <section className="bg-[#030714] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 lg:p-6 rounded-3xl bg-[#080e22]/90 border border-slate-800/80 shadow-2xl">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex flex-col items-center text-center p-6 rounded-2xl border border-transparent transition-colors group",
                feature.gradientHover
              )}
            >
              <div className={cn("w-14 h-14 rounded-full flex items-center justify-center border mb-4 transition-transform group-hover:scale-110", feature.iconBg, feature.iconColor)}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className={cn("text-base font-bold mb-2", feature.iconColor)}>
                {feature.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
