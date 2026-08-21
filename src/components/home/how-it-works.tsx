import { UploadCloud, Cpu, Download, ArrowRight, ShieldCheck, Zap, Sparkles, FileCheck, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      icon: UploadCloud,
      badge: "Step 01",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accentGradient: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.15)",
      title: "Drop or Choose Your File",
      description: "Drag and drop any PDF, image, video, audio, or legacy font file into the converter box, browse from your device, or paste from clipboard (Ctrl+V).",
      tags: ["150+ Formats", "Drag & Drop", "Clipboard Paste"],
    },
    {
      stepNumber: "02",
      icon: Cpu,
      badge: "Step 02",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accentGradient: "from-purple-500 to-indigo-500",
      glowColor: "rgba(168, 85, 247, 0.15)",
      title: "Instant In-Browser Processing",
      description: "Our high-speed WebAssembly engine processes your file directly inside your web browser. Your data never leaves your device and is never sent to any server.",
      tags: ["100% Private", "No Cloud Upload", "Hardware Accelerated"],
    },
    {
      stepNumber: "03",
      icon: Download,
      badge: "Step 03",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accentGradient: "from-emerald-500 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.15)",
      title: "Download Your Converted File",
      description: "Get your clean, high-resolution converted file immediately without waiting in queues, entering email addresses, or dealing with ugly watermarks.",
      tags: ["No Watermarks", "Original Quality", "Instant Download"],
    },
  ];

  return (
    <section 
      id="how-it-works"
      itemScope 
      itemType="https://schema.org/HowTo"
      className="py-24 relative bg-slate-50/70 dark:bg-[#040817] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effortless &amp; Secure Workflow</span>
          </div>

          <h2 
            itemProp="name"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
          >
            How to Convert Files in{" "}
            <span className="text-blue-600 dark:text-blue-400">
              3 Simple Steps
            </span>
          </h2>

          <p 
            itemProp="description"
            className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            Converting files shouldn&apos;t require subscriptions, slow upload queues, or privacy risks. Experience instant, private conversions in seconds.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Desktop Connecting Line */}
          <div className="hidden md:block absolute top-28 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30 -z-0 pointer-events-none" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                itemProp="step"
                itemScope
                itemType="https://schema.org/HowToStep"
                className="group relative flex flex-col justify-between bg-white dark:bg-[#0a1128]/90 hover:bg-slate-50/80 dark:hover:bg-[#0f1a3d] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-400/50 dark:hover:border-blue-500/40 p-7 sm:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 z-10"
              >
                {/* Subtle Hover Gradient Glow */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at 50% 0%, ${step.glowColor}, transparent 70%)`
                  }}
                />

                <div>
                  {/* Top Header: Step Badge + Number */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700/80 group-hover:text-blue-500/40 dark:group-hover:text-blue-400/30 transition-colors font-mono">
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Icon Circle with Halo */}
                  <div className="mb-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${step.accentGradient} p-[1.5px] shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-white dark:bg-[#080e22] rounded-2xl flex items-center justify-center text-slate-800 dark:text-white">
                        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 
                    itemProp="name"
                    className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 tracking-tight"
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p 
                    itemProp="text"
                    className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6"
                  >
                    {step.description}
                  </p>
                </div>

                {/* Feature Tags / Benefits */}
                <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                  {step.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/50"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Bar */}
        <div className="mt-14 p-6 rounded-2xl bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Cloud Upload Security Guarantee</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">All conversions run 100% locally on your computer, phone, or tablet.</p>
            </div>
          </div>
          <a
            href="#featured-tools"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline shrink-0"
          >
            <span>Start Converting Free</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
