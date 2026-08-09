import React from 'react';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-sunshine-pop/80 text-ink-black py-12 px-6 md:px-12 mt-20 rounded-t-[36px] max-w-[1240px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="text-[28px] md:text-[36px] font-bold tracking-tight text-pure-ink leading-tight flex items-center gap-2">
            AI Procurement Copilot
            <Sparkles className="w-6 h-6 text-pure-ink inline-block" />
          </div>
          <p className="text-[15px] font-medium text-ink-black/80 mt-1 max-w-lg">
            Verifiable document extraction, constraint reasoning, and multi-criteria scenario simulation for enterprise sourcing decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[14px] font-medium text-ink-black/90">
          <div className="flex items-center gap-2 bg-pure-white/40 px-4 py-2 rounded-full border border-pure-ink/10">
            <ShieldCheck className="w-4 h-4 text-pure-ink" />
            <span>Deterministic Constraint Engine</span>
          </div>
          <div className="flex items-center gap-2 bg-pure-white/40 px-4 py-2 rounded-full border border-pure-ink/10">
            <Cpu className="w-4 h-4 text-pure-ink" />
            <span>Audit-Ready Evidence References</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-pure-ink/10 flex flex-col sm:flex-row justify-between items-center text-[13px] font-medium text-ink-black/70 gap-4">
        <div>© 2026 ProcureIQ Intelligence Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Security Compliance</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
