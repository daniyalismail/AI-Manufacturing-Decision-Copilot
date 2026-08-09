"use client";

import { use, useState, useEffect } from "react";
import { useRunScenario, ScenarioRanking } from "@/hooks/useScenarios";
import { ContentCard } from "@/components/ui/ContentCard";
import { Sliders, RefreshCw, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function ScenarioAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [weights, setWeights] = useState({
    cost: 0.3,
    quality: 0.4,
    speed: 0.3,
  });

  const [rankings, setRankings] = useState<ScenarioRanking[]>([]);
  
  const { mutate: runScenario, isPending } = useRunScenario(projectId);

  // Run scenario automatically when weights change, debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      runScenario(weights, {
        onSuccess: (res) => {
          setRankings(res.ranking);
        }
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [weights, runScenario]);

  const handleSliderChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col pt-12 pb-24 max-w-[1000px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-[60px] gap-6">
        <div>
          <h1 className="text-[81px] font-medium text-ink-black tracking-[-4.86px] leading-[1.2] mb-2">
            Scenario Analysis
          </h1>
          <p className="text-[18px] text-stone-gray max-w-xl">
            Adjust the strategic weightings for cost, quality, and speed to see how the decision engine re-ranks the supplier matrix in real-time.
          </p>
        </div>
        <Link 
          href={`/projects/${projectId}/analysis`}
          className="flex items-center justify-center w-12 h-12 rounded-full border border-hairline-mist bg-pure-white text-ink-black hover:border-sky-pop hover:text-sky-pop transition-colors shrink-0"
          title="Back to Analysis"
        >
          <ArrowRight size={20} className="rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Controls Column */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <ContentCard className="p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-cream-paper flex items-center justify-center shrink-0">
                <Sliders size={20} className="text-ink-black" />
              </div>
              <h2 className="text-[30px] font-medium text-ink-black leading-none">
                Strategy Weights
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              {/* Cost Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-ink-black">Cost Efficiency</span>
                  <span className="text-sky-pop">{Math.round(weights.cost * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={weights.cost} 
                  onChange={(e) => handleSliderChange("cost", parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-sky-pop)] h-2 bg-[var(--color-hairline-mist)] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Quality Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-ink-black">Quality & Compliance</span>
                  <span className="text-[var(--color-sunshine-pop)]">{Math.round(weights.quality * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={weights.quality} 
                  onChange={(e) => handleSliderChange("quality", parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-sunshine-pop)] h-2 bg-[var(--color-hairline-mist)] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Speed Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[15px] font-medium">
                  <span className="text-ink-black">Lead Time & Speed</span>
                  <span className="text-[var(--color-fresh-grass)]">{Math.round(weights.speed * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={weights.speed} 
                  onChange={(e) => handleSliderChange("speed", parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-fresh-grass)] h-2 bg-[var(--color-hairline-mist)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <p className="text-[15px] text-stone-gray mt-8 p-4 bg-cream-paper rounded-[10px]">
              Move the sliders to prioritize different constraints. The decision engine will re-calculate scores instantly.
            </p>
          </ContentCard>
        </div>

        {/* Results Column */}
        <div className="md:col-span-7 flex flex-col">
          <ContentCard className="p-8 h-full bg-pure-white border border-hairline-mist">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[30px] font-medium text-ink-black leading-none">
                Live Rankings
              </h2>
              {isPending ? (
                <div className="flex items-center gap-2 text-[15px] text-sky-pop font-medium">
                  <RefreshCw size={16} className="animate-spin" /> Recalculating...
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[15px] text-[var(--color-fresh-grass)] font-medium">
                  <div className="w-2 h-2 rounded-full bg-fresh-grass animate-pulse"></div> Up to date
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {rankings.length === 0 && !isPending && (
                <div className="py-12 text-center text-stone-gray">
                  Adjust sliders to generate initial rankings.
                </div>
              )}

              {rankings.map((rank, index) => (
                <div 
                  key={rank.id} 
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-[10px] border transition-all duration-300",
                    index === 0 
                      ? "bg-sky-pop/5 border-sky-pop scale-[1.02]" 
                      : "bg-cream-paper border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                      index === 0 ? "bg-sky-pop text-white" : "bg-pure-white text-stone-gray"
                    )}>
                      {index === 0 ? <Trophy size={18} /> : index + 1}
                    </div>
                    <span className={clsx(
                      "font-medium text-[18px] truncate",
                      index === 0 ? "text-ink-black" : "text-stone-gray"
                    )}>
                      {rank.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xl font-medium text-ink-black">
                    {rank.score}
                    <span className="text-[15px] text-stone-gray">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
