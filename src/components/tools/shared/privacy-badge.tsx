import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type PrivacyLevel = "client-only" | "hybrid" | "general";

interface PrivacyBadgeProps {
  level?: PrivacyLevel;
  className?: string;
  showAnimation?: boolean;
}

export function PrivacyBadge({ level = "general", className, showAnimation = true }: PrivacyBadgeProps) {
  const getBadgeContent = () => {
    switch (level) {
      case "client-only":
        return {
          title: "100% On-Device Processing",
          description: "Processed securely on your device's CPU/GPU. 0 bytes uploaded to external servers.",
          icon: <ShieldCheck className="w-4 h-4" />,
          colorClass: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30",
          iconBgClass: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          titleClass: "text-emerald-700 dark:text-emerald-300",
          descClass: "text-emerald-600/90 dark:text-emerald-400/90",
          pingColor: "bg-emerald-500"
        };
      case "hybrid":
        return {
          title: "Secure Cloud Processing",
          description: "Files are handled in memory and deleted immediately after download.",
          icon: <ShieldCheck className="w-4 h-4" />,
          colorClass: "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/30",
          iconBgClass: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
          titleClass: "text-blue-700 dark:text-blue-300",
          descClass: "text-blue-600/90 dark:text-blue-400/90",
          pingColor: "bg-blue-500"
        };
      case "general":
      default:
        return {
          title: "Privacy Focused",
          description: "Most tools run directly inside your browser. Complex tasks use secure in-memory processing.",
          icon: <ShieldCheck className="w-4 h-4" />,
          colorClass: "bg-slate-500/10 dark:bg-slate-500/15 border-slate-500/30",
          iconBgClass: "bg-slate-500/20 text-slate-600 dark:text-slate-400",
          titleClass: "text-slate-700 dark:text-slate-300",
          descClass: "text-slate-600/90 dark:text-slate-400/90",
          pingColor: "bg-slate-500"
        };
    }
  };

  const content = getBadgeContent();

  return (
    <div className={cn(
      "w-full p-3.5 rounded-2xl border flex items-center gap-3 text-left",
      content.colorClass,
      showAnimation && "animate-in fade-in slide-in-from-bottom-2 duration-300",
      className
    )}>
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", content.iconBgClass)}>
        {content.icon}
      </div>
      <div className="flex-1">
        <p className={cn("text-xs font-bold flex items-center gap-1.5", content.titleClass)}>
          <span>{content.title}</span>
          {showAnimation && <span className={cn("inline-block w-1.5 h-1.5 rounded-full animate-ping", content.pingColor)} />}
        </p>
        <p className={cn("text-[11px] mt-0.5", content.descClass)}>
          {content.description}
        </p>
      </div>
    </div>
  );
}
