"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loader2, CheckCircle2, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export const PROCESSING_STEPS = [
  { id: 1, label: 'Document Parsing', detail: 'Extracting text and tables from uploaded PDF files...' },
  { id: 2, label: 'Entity Extraction', detail: 'Identifying suppliers, costs, constraints, and requirements...' },
  { id: 3, label: 'Cross-Verification', detail: 'Checking vendor claims against ISO standards and specs...' },
  { id: 4, label: 'Decision Engine', detail: 'Scoring suppliers based on multi-criteria weights...' },
  { id: 5, label: 'Report Generation', detail: 'Finalizing procurement intelligence report...' },
];

interface ProcessingPipelineProps {
  onComplete: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= PROCESSING_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const activeStep = PROCESSING_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / PROCESSING_STEPS.length) * 100);

  return (
    <Card className="max-w-3xl mx-auto p-8 md:p-12 space-y-8 my-8 text-center bg-pure-white border border-hairline-mist card-shadow">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-fresh-grass/20 flex items-center justify-center relative">
          <Loader2 className="w-10 h-10 text-pure-ink animate-spin" />
          <Sparkles className="w-5 h-5 text-fresh-grass absolute top-2 right-2" />
        </div>

        <Badge status="Processing">Step {currentStepIndex + 1} of {PROCESSING_STEPS.length}</Badge>

        <h2 className="text-[32px] md:text-[40px] font-bold text-ink-black tracking-tight leading-tight">
          {activeStep.label}
        </h2>

        <p className="text-[16px] text-stone-gray max-w-lg leading-relaxed font-medium">
          {activeStep.detail}
        </p>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[14px] font-bold text-ink-black">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-pop" />
            Decision Engine Active
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-3.5 bg-sandstone rounded-full overflow-hidden p-0.5 border border-hairline-mist">
          <div
            className="h-full bg-fresh-grass rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stepper Timeline Visualizer */}
      <div className="pt-6 border-t border-hairline-mist grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
        {PROCESSING_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-[12px] border transition-all text-[12px] ${
                isDone
                  ? 'bg-fresh-grass/15 border-fresh-grass/30 text-ink-black font-semibold'
                  : isCurrent
                  ? 'bg-sky-pop/15 border-sky-pop/40 text-ink-black font-bold animate-pulse'
                  : 'bg-sandstone/20 border-transparent text-stone-gray'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>0{step.id}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-fresh-grass shrink-0" />}
                {isCurrent && <Loader2 className="w-3.5 h-3.5 text-sky-pop animate-spin shrink-0" />}
              </div>
              <div className="truncate font-medium">{step.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
