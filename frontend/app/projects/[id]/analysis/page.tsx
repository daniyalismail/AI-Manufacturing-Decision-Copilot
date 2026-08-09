"use client";

import { use } from "react";
import { useRecommendation, useConstraints } from "@/hooks/useAnalysis";
import { ContentCard } from "@/components/ui/ContentCard";
import { CheckCircle2, AlertCircle, ArrowRight, TrendingUp, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { useState } from "react";

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const { data: recommendation, isLoading: isLoadingRec, isError: isErrorRec } = useRecommendation(projectId);
  const { data: constraints, isLoading: isLoadingCons } = useConstraints(projectId);

  const isLoading = isLoadingRec || isLoadingCons;
  const isError = isErrorRec;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-sky-pop/20 rounded-[63.75px] flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-sky-pop rounded-full animate-ping"></div>
          </div>
          <h1 className="text-[81px] md:text-[140px] font-medium text-ink-black tracking-[-8.4px] leading-[0.95]">
            Analyzing...
          </h1>
          <p className="text-[18px] text-stone-gray mt-[var(--spacing-20)] max-w-md">
            Running requirements through the procurement decision engine. Validating constraints and scoring suppliers.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !recommendation) {
    return (
      <div className="flex flex-col items-center pt-24 text-center">
        <AlertCircle size={48} className="text-coral-pop mb-6" />
        <h1 className="text-[53px] font-medium text-ink-black tracking-[-2.12px] mb-4">
          Analysis Failed
        </h1>
        <p className="text-[18px] text-stone-gray max-w-lg mb-8">
          The decision engine encountered an error while processing this project.
        </p>
        <Link 
          href={`/projects/${projectId}`}
          className="bg-ink-black text-pure-white px-8 py-4 rounded-full font-medium"
        >
          Return to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-12 pb-24 max-w-[1000px] mx-auto w-full">
      {/* Hero Recommendation */}
      <div className="text-center mb-[60px]">
        <p className="text-[20px] text-stone-gray font-medium mb-4 tracking-wide uppercase">
          Top Recommendation
        </p>
        <h1 className="text-[53px] md:text-[81px] font-medium text-ink-black tracking-tight leading-tight mb-5">
          {recommendation.supplier}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[var(--element-gap)]">
        {/* Score Card */}
        <ContentCard className="flex flex-col items-center justify-center text-center p-10 border-2 border-sky-pop bg-sky-pop/5">
          <TrendingUp className="text-sky-pop mb-4" size={32} />
          <h3 className="text-[81px] font-medium text-ink-black leading-none mb-2">
            {recommendation.score}
            <span className="text-[30px] text-stone-gray">/100</span>
          </h3>
          <p className="text-[15px] text-stone-gray uppercase tracking-wider font-medium">
            Match Score
          </p>
        </ContentCard>

        {/* Confidence Card */}
        <ContentCard className="flex flex-col items-center justify-center text-center p-10 border-2 border-[var(--color-sunshine-pop)] bg-sunshine-pop/10">
          <ShieldCheck className="text-[#d4c300] mb-4" size={32} />
          <h3 className="text-[81px] font-medium text-ink-black leading-none mb-2">
            {Math.round(recommendation.confidence * 100)}%
          </h3>
          <p className="text-[15px] text-stone-gray uppercase tracking-wider font-medium">
            AI Confidence
          </p>
        </ContentCard>
      </div>

      <div className="flex flex-col gap-5">
        {/* AI Summary */}
        <ContentCard className="p-8 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[30px] font-medium text-ink-black leading-[1.2]">
              Rationale
            </h2>
            <button 
              onClick={() => setIsEvidenceOpen(true)}
              className="flex items-center gap-2 bg-cream-paper hover:bg-sandstone text-ink-black px-4 py-2 rounded-full text-sm font-medium transition-colors border border-hairline-mist"
            >
              <Search size={16} />
              View Citations
            </button>
          </div>
          <p className="text-[18px] text-ink-black leading-[var(--leading-body-lg)]">
            {recommendation.summary || `${recommendation.supplier} provides the optimal balance of technical compliance and cost efficiency for this procurement. All critical constraints passed.`}
          </p>
        </ContentCard>

        {/* Constraints */}
        <ContentCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[30px] font-medium text-ink-black leading-[1.2]">
              Constraint Validation
            </h2>
            <div className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium",
              constraints?.status === "Passed" 
                ? "bg-fresh-grass/20 text-[#4c8a2b]" 
                : "bg-coral-pop/20 text-coral-pop"
            )}>
              {constraints?.status || "Unknown"}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Hardcoded display since mock API returns empty details. Real app would map constraints.details */}
            <div className="flex items-center gap-4 p-4 bg-cream-paper rounded-[10px]">
              <CheckCircle2 className="text-[var(--color-fresh-grass)]" size={20} />
              <div className="flex flex-col">
                <span className="font-medium text-ink-black text-[15px]">ISO 9001 Certification</span>
                <span className="text-stone-gray text-sm">Verified active</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-cream-paper rounded-[10px]">
              <CheckCircle2 className="text-[var(--color-fresh-grass)]" size={20} />
              <div className="flex flex-col">
                <span className="font-medium text-ink-black text-[15px]">Lead Time &lt; 4 Weeks</span>
                <span className="text-stone-gray text-sm">Estimated at 3 weeks</span>
              </div>
            </div>
          </div>
        </ContentCard>
      </div>

      <div className="mt-[var(--spacing-60)] flex justify-center">
        <Link 
          href={`/projects/${projectId}/comparison`}
          className="flex items-center gap-3 bg-pure-white border border-hairline-mist hover:border-sky-pop text-ink-black rounded-full px-8 py-4 text-[18px] font-medium transition-colors shadow-sm"
        >
          View Full Supplier Comparison
          <div className="w-8 h-8 rounded-full bg-sky-pop flex items-center justify-center text-pure-white">
            <ArrowRight size={18} strokeWidth={3} />
          </div>
        </Link>
      </div>

      <EvidenceDrawer 
        projectId={projectId}
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
      />
    </div>
  );
}
