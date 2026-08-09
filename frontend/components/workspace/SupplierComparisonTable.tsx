"use client";
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Supplier } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { ArrowUpDown, CheckCircle, FileText, ExternalLink, ShieldAlert } from 'lucide-react';

interface SupplierComparisonTableProps {
  suppliers: Supplier[];
}

export const SupplierComparisonTable: React.FC<SupplierComparisonTableProps> = ({ suppliers }) => {
  const { openEvidence } = useAppStore();
  const [sortField, setSortField] = useState<keyof Supplier | 'cost' | 'leadTime'>('scores');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    let valA = a.scores.overall || 0;
    let valB = b.scores.overall || 0;

    if (sortField === 'cost') {
      valA = a.rawCost;
      valB = b.rawCost;
    } else if (sortField === 'leadTime') {
      valA = a.rawTime;
      valB = b.rawTime;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: 'scores' | 'cost' | 'leadTime') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden space-y-0 border border-hairline-mist card-shadow">
      {/* Table Title Bar */}
      <div className="p-6 md:p-8 bg-sandstone/30 border-b border-hairline-mist flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[24px] font-bold text-ink-black tracking-tight">
            Detailed Supplier Comparison Matrix
          </h3>
          <p className="text-[14px] text-stone-gray font-medium">
            Side-by-side commercial pricing, capacity bounds, lead time guarantees, and quality scores.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => toggleSort('scores')}
            className="gap-1.5 text-[13px]"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by Score
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => toggleSort('cost')}
            className="gap-1.5 text-[13px]"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by Cost
          </Button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-sandstone/10 border-b border-hairline-mist text-[13px] font-bold text-stone-gray uppercase tracking-wider">
              <th className="py-4 px-6">Supplier</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Quoted Total</th>
              <th className="py-4 px-4">MOQ</th>
              <th className="py-4 px-4">Lead Time</th>
              <th className="py-4 px-4 text-center">Quality</th>
              <th className="py-4 px-4 text-center">Risk Score</th>
              <th className="py-4 px-4 text-center">Overall</th>
              <th className="py-4 px-6 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-mist/60 text-[14px]">
            {sortedSuppliers.map((s) => {
              const isWinner = s.status === 'QUALIFIED';
              return (
                <tr
                  key={s.id}
                  className={`transition-colors ${
                    isWinner ? 'bg-fresh-grass/5 font-medium' : 'hover:bg-sandstone/20'
                  }`}
                >
                  {/* Supplier Name */}
                  <td className="py-5 px-6">
                    <div className="font-bold text-[16px] text-ink-black flex items-center gap-2">
                      {s.name}
                      {isWinner && (
                        <span className="w-2 h-2 rounded-full bg-fresh-grass" title="Top Recommendation" />
                      )}
                    </div>
                    <div className="text-[12px] text-stone-gray font-normal">{s.location}</div>
                  </td>

                  {/* Qualification Status */}
                  <td className="py-5 px-4">
                    <Badge status={s.status}>{(s.status || 'UNKNOWN').replace('_', ' ')}</Badge>
                  </td>

                  {/* Cost */}
                  <td className="py-5 px-4 font-bold text-ink-black text-[15px]">
                    ${s.rawCost?.toLocaleString() ?? "N/A"}
                  </td>

                  {/* MOQ */}
                  <td className="py-5 px-4">
                    <span className={(s.rawMoq || 0) > 1000 ? 'text-coral-pop font-bold' : 'text-ink-black'}>
                      {s.rawMoq?.toLocaleString() ?? "N/A"} units
                    </span>
                  </td>

                  {/* Lead Time */}
                  <td className="py-5 px-4 font-medium text-ink-black">
                    {s.rawTime ?? "N/A"} days
                  </td>

                  {/* Quality Score Bar */}
                  <td className="py-5 px-4 text-center">
                    <span className="font-bold text-ink-black">{s.scores.quality}</span>
                    <span className="text-[12px] text-stone-gray">/100</span>
                  </td>

                  {/* Risk Score */}
                  <td className="py-5 px-4 text-center">
                    <span
                      className={`font-bold ${
                        s.scores.risk >= 90
                          ? 'text-fresh-grass'
                          : s.scores.risk >= 70
                          ? 'text-sunshine-pop'
                          : 'text-coral-pop'
                      }`}
                    >
                      {s.scores.risk}
                    </span>
                  </td>

                  {/* Overall Score */}
                  <td className="py-5 px-4 text-center">
                    <div className="text-[20px] font-extrabold text-ink-black">
                      {s.scores.overall || 80}
                    </div>
                  </td>

                  {/* Evidence CTA */}
                  <td className="py-5 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEvidence(s.primaryEvidence)}
                      className="gap-1 text-[13px] text-sky-pop hover:text-ink-black"
                    >
                      <span>Citation</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
