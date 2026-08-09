"use client";
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Project } from '../../types';
import { FileDown, Printer, ShieldCheck, AlertTriangle, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

interface ProcurementReportProps {
  project: Project;
}

export const ProcurementReport: React.FC<ProcurementReportProps> = ({ project }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Sort suppliers for rankings
  const sortedSuppliers = [...project.suppliers].sort((a, b) => (b.scores.overall || 0) - (a.scores.overall || 0));
  const topSupplier = sortedSuppliers[0];
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById("procurement-report-card");
    if (element) {
      try {
        const { toPng } = await import('html-to-image');
        const { jsPDF } = await import('jspdf');

        // Hide elements we don't want to print temporarily
        const hiddenElements = element.querySelectorAll('[data-html2canvas-ignore]');
        hiddenElements.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });

        // Force desktop width for perfect layout capture
        const captureWidth = 1000;
        
        const dataUrl = await toPng(element, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: captureWidth,
          style: {
            width: `${captureWidth}px`,
            maxWidth: 'none',
            margin: '0',
            padding: '40px',
            boxShadow: 'none',
            border: 'none',
            borderRadius: '0',
            transform: 'none'
          }
        });

        // Restore hidden elements
        hiddenElements.forEach((el) => {
          (el as HTMLElement).style.display = '';
        });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (element.offsetHeight * pdfWidth) / captureWidth;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Procurement_Report_${project.name}.pdf`);
      } catch (err) {
        console.error("Failed to generate PDF", err);
      }
    }
    setIsDownloading(false);
  };

  return (
    <Card id="procurement-report-card" className="max-w-4xl mx-auto p-8 md:p-14 space-y-10 bg-pure-white border border-hairline-mist card-shadow printable-report">
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
            Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ProcureIQ AI Intelligence Engine
          </p>
        </div>

        <div className="flex gap-3 shrink-0 print:hidden" data-html2canvas-ignore>
          <Button variant="default" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="action" size="sm" onClick={handleDownload} disabled={isDownloading} className="gap-2">
            <FileDown className="w-4 h-4" />
            {isDownloading ? "Preparing..." : "Download PDF"}
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
            Following automated document parsing and deterministic constraint reasoning over {project.suppliers.length} submitted supplier RFP packets, the Decision Engine recommends awarding the contract for <strong>{project.name}</strong> to <strong>{topSupplier?.name || 'the top supplier'}</strong> (Overall Score: {topSupplier?.scores.overall || 0}/100, Confidence: {topSupplier ? Math.round(topSupplier.primaryEvidence.confidenceScore) : 0}%).
          </p>
          <p>
            {topSupplier?.name} is the optimal vendor that satisfies mandatory constraints while providing strong commercial value. Their technical documentation matched requirements directly.
          </p>
        </div>
      </section>

      {/* Section 2: Supplier Score Summary */}
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
              {sortedSuppliers.map((s, index) => (
                <tr key={s.id} className={index === 0 ? 'font-bold bg-fresh-grass/10' : ''}>
                  <td className="py-3 px-3 flex items-center gap-2">
                    {index === 0 && <Trophy className="w-3.5 h-3.5 text-fresh-grass" />}
                    {s.name}
                  </td>
                  <td className="py-3 px-3"><Badge status={s.status}>{(s.status || 'UNKNOWN').replace('_', ' ')}</Badge></td>
                  <td className="py-3 px-3">${s.rawCost?.toLocaleString() ?? "N/A"}</td>
                  <td className="py-3 px-3">{s.rawTime} days</td>
                  <td className="py-3 px-3 text-right text-[18px]">{s.scores.overall || 0}/100</td>
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
          {sortedSuppliers.filter(s => s.status !== 'QUALIFIED').map(supplier => (
            <div key={supplier.id} className="p-5 rounded-[18px] bg-coral-pop/10 border border-coral-pop/30 space-y-2">
              <div className="font-bold text-coral-pop text-[15px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {supplier.name} ({supplier.status.replace('_', ' ')})
              </div>
              <p className="text-[13.5px] text-ink-black/90 leading-relaxed">
                {supplier.riskDetails || supplier.weaknesses.join(' ')}
              </p>
            </div>
          ))}
          {sortedSuppliers.filter(s => s.status !== 'QUALIFIED').length === 0 && (
            <p className="text-[14px] text-stone-gray italic p-4">No suppliers were completely disqualified or rejected.</p>
          )}
        </div>
      </section>

      {/* Section 4: Sign-off Footer */}
      <div className="pt-8 border-t-2 border-ink-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[13px] text-stone-gray font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-fresh-grass" />
          <span>Audit-ready report verified by ProcureIQ AI Decision Engine</span>
        </div>
        <div>Authorized Director Approval: _______________________</div>
      </div>
    </Card>
  );
};
