"use client";

import { useEvidence } from "@/hooks/useEvidence";
import { X, FileText, Quote, Loader2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { useEffect } from "react";

interface EvidenceDrawerProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ projectId, isOpen, onClose }: EvidenceDrawerProps) {
  const { data: evidenceList, isLoading, isError } = useEvidence(projectId);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-ink-black/10 backdrop-blur-sm transition-opacity z-40",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-md bg-cream-paper border-l border-hairline-mist shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 bg-pure-white border-b border-hairline-mist">
          <h2 className="text-[30px] font-medium text-ink-black leading-none">
            RAG Evidence
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-cream-paper text-ink-black hover:bg-sandstone transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <p className="text-[18px] text-stone-gray leading-[var(--leading-body-lg)]">
            Trace the AI's logic back to the exact source documents uploaded during project setup.
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-gray">
              <Loader2 size={32} className="animate-spin mb-4 text-sky-pop" />
              <p>Retrieving citations...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-coral-pop">
              <AlertCircle size={32} className="mb-4" />
              <p>Failed to load evidence.</p>
            </div>
          ) : !evidenceList || evidenceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-gray">
              <p>No citations found for this analysis.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {evidenceList.map((evidence, idx) => (
                <div key={evidence.id || idx} className="bg-pure-white rounded-[50px] p-6 border border-hairline-mist">
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-hairline-mist">
                    <div className="w-10 h-10 rounded-full bg-cream-paper flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-ink-black" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[18px] text-ink-black break-words">
                        {evidence.document}
                      </span>
                      <div className="flex items-center gap-2 text-[15px] text-stone-gray mt-1">
                        <span>Page {evidence.page}</span>
                        {evidence.relevance && (
                          <>
                            <span>•</span>
                            <span className="text-[var(--color-fresh-grass)] font-medium">
                              {Math.round(evidence.relevance * 100)}% Match
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-ink-black">
                    <Quote className="text-stone-gray opacity-50 shrink-0 mt-1" size={24} />
                    <p className="text-[18px] leading-[var(--leading-body-lg)] italic">
                      "{evidence.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
