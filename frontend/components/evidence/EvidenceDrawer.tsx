"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Copy, X, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const EvidenceDrawer: React.FC = () => {
  const { activeEvidence, isEvidenceDrawerOpen, closeEvidence } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  if (!activeEvidence) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`[Source: ${activeEvidence.docName}, Page ${activeEvidence.pageNumber}, ${activeEvidence.sectionTitle}] "${activeEvidence.extractedText}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isEvidenceDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEvidence}
            className="fixed inset-0 bg-ink-black/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-[720px] mx-auto bg-pure-white rounded-t-[36px] border-t border-hairline-mist card-shadow z-50 p-6 md:p-8 space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge status="PASS">{activeEvidence.evidenceType}</Badge>
                  <span className="text-[13px] font-semibold text-sky-pop flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Math Verified ({Math.round(activeEvidence.confidenceScore * 100)}% Confidence)
                  </span>
                </div>
                <h3 className="text-[24px] font-bold text-ink-black tracking-tight">
                  {activeEvidence.supplierName} - Audit Evidence
                </h3>
              </div>

              <button
                onClick={closeEvidence}
                className="w-9 h-9 rounded-full bg-sandstone/50 hover:bg-sandstone flex items-center justify-center text-ink-black transition-colors cursor-pointer"
                aria-label="Close Evidence Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Source Metadata */}
            <div className="bg-sandstone/30 rounded-[18px] p-4 flex flex-wrap items-center justify-between gap-3 text-[14px] text-ink-black/90 border border-sandstone">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-sky-pop shrink-0" />
                <span className="font-semibold">{activeEvidence.docName}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-stone-gray font-medium">
                <span>Page {activeEvidence.pageNumber}</span>
                <span>•</span>
                <span>{activeEvidence.sectionTitle}</span>
              </div>
            </div>

            {/* Extracted Verbatim Quote */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-stone-gray uppercase tracking-wider block">
                Verbatim Extracted Passage
              </label>
              <div className="p-5 rounded-[20px] bg-cream-paper border border-hairline-mist text-[15px] font-mono leading-relaxed text-ink-black relative">
                <span className="text-stone-gray font-bold text-lg select-none">“</span>
                {activeEvidence.extractedText}
                <span className="text-stone-gray font-bold text-lg select-none">”</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-hairline-mist">
              <div className="text-[13px] text-stone-gray flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-fresh-grass" />
                <span>Extracted directly from unedited vendor PDF submission.</span>
              </div>

              <div className="flex gap-3">
                <Button variant="default" size="sm" onClick={handleCopy} className="gap-2">
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied Citation!' : 'Copy Citation'}
                </Button>
                <Button variant="action" size="sm" onClick={closeEvidence}>
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
