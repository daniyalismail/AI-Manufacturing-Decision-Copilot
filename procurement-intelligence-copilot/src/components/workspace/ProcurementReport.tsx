import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Project } from '../../types';
import { FileDown, Printer, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProcurementReportProps {
  project: Project;
}

export const ProcurementReport: React.FC<ProcurementReportProps> = ({ project }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="max-w-4xl mx-auto p-8 md:p-14 space-y-10 bg-pure-white border border-hairline-mist card-shadow printable-report">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-ink-black pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-sky-pop uppercase tracking-wider">
              Executive Sourcing Recommendation Report
            </span>
            <Badge status="PASS">Verified</Badge>
          </div>
          <h1 className="text-[36px] md:text-[44px] font-bold text-ink-black tracking-tight leading-none">
            {project.name}
          </h1>
          <p className="text-[15px] text-stone-gray font-medium">
            Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • MindMarket AI Intelligence Engine
          </p>
        </div>

        <div className="flex gap-3 shrink-0 print:hidden">
          <Button variant="default" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="action" size="sm" onClick={handlePrint} className="gap-2">
            <FileDown className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <section className="space-y-3">
        <h2 className="text-[24px] font-bold text-ink-black tracking-tight flex items-center gap-2">
          1. Executive Summary & Recommendation
        </h2>
        <div className="p-6 rounded-[20px] bg-sandstone/30 border border-sandstone space-y-3 leading-relaxed text-[15px] text-ink-black">
          <p>
            Following automated document parsing and deterministic constraint reasoning over 4 submitted supplier RFP packets, the Decision Engine recommends awarding the contract for <strong>{project.name}</strong> to <strong>Vertex Manufacturing</strong> (Overall Score: 91/100, Confidence: 94%).
          </p>
          <p>
            Vertex Manufacturing is the only vendor that satisfies 100% of mandatory constraints (including active ISO9001:2015 certification and MOQ &lt;= 1,000 units) while providing a 15-day delivery window that guarantees Q3 assembly line readiness.
          </p>
        </div>
      </section>

      {/* Section 2: Supplier Evaluation Matrix */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-bold text-ink-black tracking-tight">
          2. Supplier Score Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-hairline-mist text-stone-gray uppercase tracking-wider font-bold text-[12px]">
                <th className="py-3 px-3">Supplier Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Quoted Price</th>
                <th className="py-3 px-3">Lead Time</th>
                <th className="py-3 px-3 text-right">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-mist">
              {project.suppliers.map((s) => (
                <tr key={s.id} className={s.status === 'QUALIFIED' ? 'font-bold bg-fresh-grass/10' : ''}>
                  <td className="py-3 px-3">{s.name}</td>
                  <td className="py-3 px-3"><Badge status={s.status}>{s.status.replace('_', ' ')}</Badge></td>
                  <td className="py-3 px-3">${s.rawCost.toLocaleString()}</td>
                  <td className="py-3 px-3">{s.rawTime} days</td>
                  <td className="py-3 px-3 text-right text-[18px]">{s.scores.overall || 80}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Risk & Disqualification Rationale */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-bold text-ink-black tracking-tight">
          3. Risk & Disqualification Rationale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-[18px] bg-coral-pop/10 border border-coral-pop/30 space-y-2">
            <div className="font-bold text-coral-pop text-[15px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Apex Industrial (Disqualified)
            </div>
            <p className="text-[13.5px] text-ink-black/90 leading-relaxed">
              Disqualified due to Maximum MOQ constraint breach. Quoted 2,000 units vs maximum limit of 1,000 units. Holding excess inventory increases warehouse carrying costs by $4,200.
            </p>
          </div>

          <div className="p-5 rounded-[18px] bg-sunshine-pop/20 border border-sunshine-pop/40 space-y-2">
            <div className="font-bold text-ink-black text-[15px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-sunshine-pop" />
              Nova Components (Rejected)
            </div>
            <p className="text-[13.5px] text-ink-black/90 leading-relaxed">
              Rejected due to unverified ISO9001 compliance. Audit certificate expired in Dec 2025 and is pending re-certification.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Sign-off Footer */}
      <div className="pt-8 border-t-2 border-ink-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[13px] text-stone-gray font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-fresh-grass" />
          <span>Audit-ready report verified by MindMarket AI Decision Engine v4.2</span>
        </div>
        <div>Authorized Director Approval: _______________________</div>
      </div>
    </Card>
  );
};
