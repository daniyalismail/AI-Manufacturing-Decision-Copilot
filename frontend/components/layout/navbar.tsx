"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

export function Navbar() {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.id as string | undefined;

  const analysisHref = projectId ? `/projects/${projectId}/analysis` : "/projects";
  const suppliersHref = projectId ? `/projects/${projectId}/suppliers` : "/projects";
  const reportsHref = projectId ? `/projects/${projectId}/reports` : "/projects";

  // Helper for active link state
  const isActive = (path: string) => pathname?.includes(path);

  return (
    <div className="w-full mx-auto px-4 pt-6 pb-4 z-50 sticky top-0 max-w-[1400px]">
      <nav className="bg-pure-white/90 backdrop-blur-md rounded-[50px] px-6 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-hairline-mist transition-all">
        
        {/* Brand Logo Container */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group">
          <div className="text-fresh-grass font-serif italic text-[30px] font-bold tracking-tighter leading-none pr-1">
            P
          </div>
          <span className="font-medium text-[20px] text-ink-black tracking-tight">
            ProcureIQ
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-ink-black">
          {[
            { name: "Projects", href: "/projects" },
            { name: "Analysis", href: analysisHref, disabled: !projectId },
            { name: "Suppliers", href: suppliersHref, disabled: !projectId },
            { name: "Reports", href: reportsHref, disabled: !projectId },
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.disabled ? "#" : item.href} 
              className={`relative py-2 group ${item.disabled ? "opacity-40 cursor-not-allowed" : "hover:text-ink-black"}`}
            >
              <span className="relative z-10">{item.name}</span>
              {!item.disabled && (
                <span className={`absolute bottom-1 left-0 h-[2px] bg-fresh-grass transition-all duration-300 ease-out ${isActive(item.href) && item.href !== "/projects" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:block text-[15px] font-medium text-ink-black hover:text-stone-gray transition-colors px-2 py-2"
          >
            Log in
          </Link>
          
          <Link 
            href="/signup" 
            className="flex items-center gap-2 bg-ink-black hover:bg-ink-black/90 text-pure-white rounded-full pl-6 pr-2 py-2 text-[15px] font-medium transition-all group shadow-sm active:scale-95"
          >
            Sign up
            <div className="w-8 h-8 rounded-full bg-fresh-grass flex items-center justify-center text-ink-black group-hover:translate-x-1 transition-transform duration-300">
              <ArrowRight size={16} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
        
      </nav>
    </div>
  );
}
