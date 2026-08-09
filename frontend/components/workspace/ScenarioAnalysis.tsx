"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Supplier } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { scenarioService } from '../../services/scenarioService';
import { SlidersHorizontal, RotateCcw, TrendingUp, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScenarioAnalysis: React.FC = () => {
  const { scenarioWeights, updateScenarioWeights, resetScenarioWeights } = useAppStore();
  const [rankedSuppliers, setRankedSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const params = useParams();
  const projectId = params?.id as string | undefined;

  useEffect(() => {
    if (!projectId) return;
    let isMounted = true;
    
    const fetchRankings = async () => {
      setIsLoading(true);
      try {
        const ranking = await scenarioService.runScenarioAnalysis(projectId, scenarioWeights);
        if (isMounted) setRankedSuppliers(ranking);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    const timer = setTimeout(fetchRankings, 300); // Debounce slider changes
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [scenarioWeights, projectId]);

  const handleSliderChange = (key: keyof typeof scenarioWeights, val: number) => {
    updateScenarioWeights({ [key]: val });
  };

  const totalWeight = Object.values(scenarioWeights).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Sliders Controls */}
      <Card className="lg:col-span-5 bg-sandstone/30 border border-sandstone space-y-6">
        <div className="flex justify-between items-center border-b border-hairline-mist pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-ink-black" />
            <h3 className="text-[20px] font-bold text-ink-black">
              Decision Weights
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetScenarioWeights}
            className="text-[12px] gap-1 text-stone-gray hover:text-ink-black"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </Button>
        </div>

        <p className="text-[14px] text-stone-gray font-medium">
          Adjust the priority sliders to simulate alternative commercial or risk scenarios and watch supplier scores update in real time.
        </p>

        {/* Sliders */}
        <div className="space-y-5">
          {(
            [
              { key: 'cost', label: 'Commercial Price / Cost', color: 'bg-coral-pop' },
              { key: 'quality', label: 'Manufacturing Quality', color: 'bg-fresh-grass' },
              { key: 'leadTime', label: 'Delivery Speed / Lead Time', color: 'bg-sky-pop' },
              { key: 'risk', label: 'Supply Chain Risk', color: 'bg-sunshine-pop' },
              { key: 'sustainability', label: 'ESG / Sustainability', color: 'bg-stone-gray' },
            ] as const
          ).map(({ key, label, color }) => (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-[13px] font-bold text-ink-black uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  {label}
                </span>
                <span>{scenarioWeights[key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={scenarioWeights[key]}
                onChange={(e) => handleSliderChange(key, parseInt(e.target.value, 10))}
                className="w-full h-2 bg-sandstone rounded-lg appearance-none cursor-pointer accent-ink-black"
              />
            </div>
          ))}
        </div>

        <div className="p-4 rounded-[14px] bg-pure-white/80 border border-hairline-mist flex justify-between items-center text-[13px] font-bold">
          <span>Total Weight Allocation:</span>
          <span className={totalWeight === 100 ? 'text-fresh-grass font-extrabold' : 'text-coral-pop'}>
            {totalWeight}% {totalWeight !== 100 && '(Normalized)'}
          </span>
        </div>
      </Card>

      {/* Right Column: Live Ranked Results */}
      <Card className="lg:col-span-7 space-y-6">
        <div className="flex justify-between items-center border-b border-hairline-mist pb-4">
          <div>
            <h3 className="text-[24px] font-bold text-ink-black tracking-tight">
              Dynamic Supplier Rankings
            </h3>
            <p className="text-[14px] text-stone-gray font-medium">
              Recalculated multi-criteria score based on active weights.
            </p>
          </div>
          <Badge status="PASS">Interactive Simulation</Badge>
        </div>

        {/* Animated Supplier Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {rankedSuppliers.map((supplier, index) => {
              const isFirst = index === 0;
              return (
                <motion.div
                  key={supplier.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`p-5 rounded-[20px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isFirst
                      ? 'bg-ink-black text-pure-white border-ink-black shadow-md'
                      : 'bg-pure-white border-hairline-mist text-ink-black'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0 ${
                        isFirst ? 'bg-fresh-grass text-ink-black' : 'bg-sandstone text-ink-black'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div className="font-bold text-[18px] flex items-center gap-2">
                        {supplier.name}
                        {isFirst && <Sparkles className="w-4 h-4 text-fresh-grass" />}
                      </div>
                      <div className={`text-[13px] font-medium ${isFirst ? 'text-sandstone/80' : 'text-stone-gray'}`}>
                        ${supplier.rawCost?.toLocaleString() ?? "N/A"} • {supplier.rawTime ?? "N/A"}d lead time
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-pure-white/10">
                    <div className="text-right">
                      <div className={`text-[11px] uppercase font-bold tracking-wider ${isFirst ? 'text-fresh-grass' : 'text-stone-gray'}`}>
                        Simulated Score
                      </div>
                      <div className={`text-[28px] font-bold leading-none ${isFirst ? 'text-pure-white' : 'text-ink-black'}`}>
                        {supplier.calculatedScore}
                        <span className="text-[14px] font-normal opacity-60">/100</span>
                      </div>
                    </div>

                    <Badge status={isFirst ? 'PASS' : supplier.status}>
                      {isFirst ? 'Top Ranked' : (supplier.status || 'UNKNOWN').replace('_', ' ')}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic AI Explanation Box */}
        <div className="p-5 rounded-[18px] bg-sandstone/30 border border-sandstone space-y-2 text-[14px] leading-relaxed">
          <div className="font-bold text-ink-black flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-pop" />
            Scenario Insight
          </div>
          <p className="text-stone-gray font-medium">
            {scenarioWeights.cost > 50
              ? 'When Cost weight exceeds 50%, Apex Industrial ($38,000) surges in overall score, but remains restricted by the mandatory 1,000-unit MOQ constraint.'
              : scenarioWeights.leadTime > 40
              ? 'When Delivery Speed weight is prioritized above 40%, Vertex Manufacturing solidifies a decisive lead due to its guaranteed 15-day lead time.'
              : 'Under the default balanced procurement weight model, Vertex Manufacturing holds the top recommendation with a score of 91/100.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
