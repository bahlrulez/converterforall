"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, UploadCloud, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080e22]/95 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />
        <NavItem href="/#featured-tools" icon={LayoutGrid} label="All Tools" isActive={pathname === "/#featured-tools"} />
        
        {/* Floating Action Button for Convert */}
        <div className="relative -top-5 flex flex-col items-center">
          <button 
            onClick={() => {
              const fileInput = document.getElementById('global-file-input');
              if (fileInput) {
                fileInput.click();
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] border-4 border-[#030714] active:scale-95 transition-transform"
            aria-label="Upload File"
          >
            <UploadCloud className="w-6 h-6" />
          </button>
          <span className="text-[10px] mt-1 text-slate-300 font-medium">Convert</span>
        </div>
        
        <NavItem href="/category/document" icon={FileText} label="PDF Tools" isActive={pathname === "/category/document"} />
        <NavItem href="/category/image" icon={ImageIcon} label="Image Tools" isActive={pathname === "/category/image"} />
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex flex-col items-center justify-center w-16 h-full space-y-1 text-slate-500 hover:text-slate-300 transition-colors relative",
        isActive && "text-blue-500 hover:text-blue-400"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive && "fill-blue-500/20")} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
      {isActive && (
        <span className="absolute -bottom-1 w-8 h-1 bg-blue-600 rounded-t-full" />
      )}
    </Link>
  );
}
