"use client";
import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ConstraintResult, Supplier } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Info, ExternalLink, ShieldCheck } from 'lucide-react';

interface ConstraintMatrixProps {
  constraints: ConstraintResult[];
  suppliers: Supplier[];
}

export const ConstraintMatrix: React.FC<ConstraintMatrixProps> = ({ constraints, suppliers }) => {
  const { openEvidence } = useAppStore();

  return (
    <Card className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-[24px] font-bold text-ink-black tracking-tight">
            Requirement vs. Supplier Constraint Matrix
          </h3>
          <p className="text-[14px] text-stone-gray font-medium mt-0.5">
            Deterministic check of mandatory and preferred procurement criteria extracted from RFP documents.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px] font-semibold">
          <span className="flex items-center gap-1"><Badge status="PASS">PASS</Badge></span>
          <span className="flex items-center gap-1"><Badge status="FAIL">FAIL</Badge></span>
          <span className="flex items-center gap-1"><Badge status="WARNING">WARNING</Badge></span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-hairline-mist text-[13px] font-bold text-stone-gray uppercase tracking-wider">
              <th className="py-4 px-4 min-w-[200px]">Requirement & Expected</th>
              {suppliers.map((s) => (
                <th key={s.id} className="py-4 px-4 min-w-[160px]">
                  <div className="font-bold text-ink-black text-[15px]">{s.name}</div>
                  <div className="text-[12px] text-stone-gray font-normal">{s.location}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-mist/60 text-[14px]">
            {constraints.map((row) => (
              <tr key={row.requirementId} className="hover:bg-sandstone/20 transition-colors">
                {/* Requirement Column */}
                <td className="py-4 px-4 font-bold text-ink-black">
                  <div>{row.requirementName}</div>
                  <div className="text-[12px] text-stone-gray font-medium mt-0.5">
                    Target: <span className="text-ink-black">{row.expected}</span>
                  </div>
                </td>

                {/* Supplier Columns */}
                {suppliers.map((s) => {
                  const res = row.supplierResults[s.id] || { status: 'UNKNOWN', actualValue: 'Not specified' };
                  return (
                    <td key={s.id} className="py-4 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge status={res.status}>{res.status}</Badge>
                        </div>
                        <div className="font-semibold text-ink-black text-[13px]">
                          {res.actualValue}
                        </div>
                        {res.notes && (
                          <div className="text-[11px] text-stone-gray flex items-center gap-1">
                            <Info className="w-3 h-3 text-sky-pop shrink-0" />
                            <span>{res.notes}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="pt-4 border-t border-hairline-mist flex justify-between items-center text-[13px] text-stone-gray font-medium">
        {/* <span>Click any supplier evidence badge to inspect source PDF citations.</span> */}
        {/* {suppliers.length > 0 && (
          <button
            onClick={() => openEvidence(suppliers[0]?.primaryEvidence)}
            className="text-sky-pop font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Primary Source References</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )} */}
      </div>
    </Card>
  );
};
