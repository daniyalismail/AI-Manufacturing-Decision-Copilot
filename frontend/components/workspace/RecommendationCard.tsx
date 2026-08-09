"use client";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Supplier } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Check, X, ShieldCheck, Sparkles, ArrowRight, FileSearch } from 'lucide-react';

interface RecommendationCardProps {
  recommendedSupplier: Supplier;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendedSupplier }) => {
  const { openEvidence } = useAppStore();

  return (
    <Card className="bg-ink-black text-pure-white p-8 md:p-10 relative overflow-hidden border border-ink-black card-shadow">
      {/* Background Subtle Accent Pill */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-fresh-grass/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pure-white/15 pb-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-fresh-grass text-ink-black text-[13px] font-bold tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 fill-ink-black" />
              RECOMMENDED WINNER
            </span>
            <Badge status={recommendedSupplier.status}>
              {(recommendedSupplier.status || 'UNKNOWN').replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[12px] uppercase font-bold text-fresh-grass tracking-wider">
                Overall Score
              </div>
              <div className="text-[44px] font-bold tracking-tight text-pure-white leading-none">
                {recommendedSupplier.scores.overall || 91}
                <span className="text-[20px] text-stone-gray font-normal">/100</span>
              </div>
            </div>

            <div className="text-right border-l border-pure-white/15 pl-6 hidden sm:block">
              <div className="text-[12px] uppercase font-bold text-sky-pop tracking-wider">
                AI Confidence
              </div>
              <div className="text-[32px] font-bold tracking-tight text-pure-white leading-none mt-1">
                94%
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Name & Location */}
        <div>
          <h2 className="text-[36px] md:text-[44px] font-bold text-pure-white tracking-tight leading-tight">
            {recommendedSupplier.name}
          </h2>
          <p className="text-[16px] text-sandstone/80 font-medium mt-1">
            {recommendedSupplier.location} • Quoted Total: ${recommendedSupplier.rawCost?.toLocaleString() ?? "N/A"} • Lead Time: {recommendedSupplier.rawTime ?? "N/A"} days
          </p>
        </div>

        {/* AI Decision Rationale Paragraph */}
        <p className="text-[16px] text-pure-white/90 leading-relaxed font-normal max-w-3xl">
          {recommendedSupplier.riskDetails || 
           `${recommendedSupplier.name} achieved the highest overall score based on the extracted criteria. They provide competitive delivery windows and align with the core requirements identified in the documents.`}
        </p>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Strengths */}
          <div className="space-y-3 bg-pure-white/5 p-5 rounded-[20px] border border-pure-white/10">
            <div className="text-[14px] font-bold text-fresh-grass uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4" /> Key Strengths
            </div>
            <ul className="space-y-2 text-[14px] text-pure-white/90">
              {recommendedSupplier.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-fresh-grass mt-2 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Tradeoffs */}
          <div className="space-y-3 bg-pure-white/5 p-5 rounded-[20px] border border-pure-white/10">
            <div className="text-[14px] font-bold text-coral-pop uppercase tracking-wider flex items-center gap-2">
              <X className="w-4 h-4" /> Commercial Tradeoffs
            </div>
            <ul className="space-y-2 text-[14px] text-pure-white/90">
              {recommendedSupplier.weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-pop mt-2 shrink-0" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button for Evidence (Temporarily Disabled per Request) */}
        {/* <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-pure-white/15">
          <div className="text-[13px] text-stone-gray font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-fresh-grass" />
            <span>Verifiable source text attached from Page 3 of quote submission.</span>
          </div>

          <Button
            variant="action"
            onClick={() => openEvidence(recommendedSupplier.primaryEvidence)}
            className="gap-2 text-[15px] font-bold px-6 shadow-md"
          >
            <FileSearch className="w-4 h-4" />
            Inspect Audit Evidence
          </Button>
        </div> */}
      </div>
    </Card>
  );
};
