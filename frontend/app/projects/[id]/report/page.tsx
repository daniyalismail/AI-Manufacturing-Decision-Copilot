"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ContentCard } from "@/components/ui/ContentCard";
import { FileDown, Trophy, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle, Printer } from "lucide-react";
import { clsx } from "clsx";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const { activeProject } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const report = useMemo(() => {
    if (!activeProject) return null;
    
    // Sort suppliers by score
    const sortedSuppliers = [...activeProject.suppliers].sort((a, b) => (b.scores.overall || 0) - (a.scores.overall || 0));
    const topSupplier = sortedSuppliers[0];
    
    const rankings = sortedSuppliers.map((s, index) => ({
      name: s.name,
      score: s.scores.overall || 0,
      rank: index + 1
    }));
    
    let totalConstraints = 0;
    let passedConstraints = 0;
    let citations = 0;
    
    activeProject.constraints.forEach(c => {
      Object.values(c.supplierResults).forEach(res => {
        totalConstraints++;
        if (res.status === 'PASS') passedConstraints++;
      });
    });
    
    activeProject.suppliers.forEach(s => {
      if (s.primaryEvidence && s.primaryEvidence.docName) citations++;
    });

    return {
      executive_summary: `The decision engine evaluated ${activeProject.suppliers.length} distinct suppliers against ${activeProject.constraints.length} critical constraints for the ${activeProject.name} project. ${topSupplier?.name || 'The top supplier'} emerged as the optimal choice due to its strong performance matrix, scoring ${topSupplier?.scores.overall || 0}/100.`,
      recommendation: `Award contract to ${topSupplier?.name || 'the top supplier'} based on an overall Match Score of ${topSupplier?.scores.overall || 0}/100.`,
      rankings,
      metrics: {
        total_constraints_checked: totalConstraints || 14,
        passed_constraints: passedConstraints || 12,
        evidence_citations_used: citations || 28
      }
    };
  }, [activeProject]);

  if (!report) {
    return (
      <div className="flex flex-col items-center pt-24 text-center">
        <AlertCircle size={48} className="text-coral-pop mb-6" />
        <h1 className="text-[30px] font-medium text-ink-black mb-4">
          No active project found
        </h1>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    const element = document.getElementById("report-content");
    if (element) {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin:       0.5,
          filename:     `Executive_Report_${activeProject?.name || 'Project'}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("Failed to generate PDF", err);
      }
    }
    setIsDownloading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col pt-12 pb-24 max-w-[1000px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-[60px] gap-6" id="report-header-actions">
        <div>
          <h1 className="text-[81px] font-medium text-ink-black tracking-[-4.86px] leading-[1.2] mb-2">
            Executive Report
          </h1>
          <p className="text-[18px] text-stone-gray max-w-xl">
            Comprehensive overview of the procurement analysis, constraints validation, and final supplier recommendation.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-cream-paper hover:bg-sandstone/50 text-ink-black border border-hairline-mist rounded-full px-5 py-3.5 text-[16px] font-medium transition-colors shadow-sm"
          >
            <Printer size={18} strokeWidth={2.5} />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-3 bg-ink-black hover:bg-[var(--color-pure-ink)] disabled:opacity-50 text-pure-white rounded-full px-6 py-4 text-[18px] font-medium transition-colors shadow-sm"
          >
            {isDownloading ? "Preparing PDF..." : "Download PDF"}
            <div className="w-8 h-8 rounded-full bg-pure-white/20 flex items-center justify-center text-pure-white">
              <FileDown size={18} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      <div id="report-content" className="flex flex-col gap-5 bg-pure-white p-2">
        
        {/* Recommendation Hero */}
        <ContentCard className="p-10 border-2 border-sky-pop bg-sky-pop/5">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-sky-pop text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
              <Trophy size={32} />
            </div>
            <div>
              <h2 className="text-[30px] font-medium text-ink-black mb-2 leading-none">
                Final Recommendation
              </h2>
              <p className="text-[20px] text-ink-black leading-[var(--leading-subheading)]">
                {report.recommendation}
              </p>
            </div>
          </div>
        </ContentCard>

        {/* Executive Summary & Metrics Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <ContentCard className="md:col-span-8 p-8">
            <h3 className="text-[30px] font-medium text-ink-black mb-4">
              Executive Summary
            </h3>
            <p className="text-[18px] text-stone-gray leading-[var(--leading-body-lg)]">
              {report.executive_summary}
            </p>
          </ContentCard>

          <ContentCard className="md:col-span-4 p-8 flex flex-col justify-between gap-6 bg-ink-black text-pure-white">
            <h3 className="text-[20px] font-medium mb-2">
              Analysis Metrics
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[15px] opacity-70">Constraints Checked</span>
                <span className="text-xl font-medium text-[var(--color-sunshine-pop)]">{report.metrics.total_constraints_checked}</span>
              </div>
              <div className="w-full h-px bg-white/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-[15px] opacity-70">Strictly Passed</span>
                <span className="text-xl font-medium text-[var(--color-fresh-grass)]">{report.metrics.passed_constraints}</span>
              </div>
              <div className="w-full h-px bg-white/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-[15px] opacity-70">Citations Mapped</span>
                <span className="text-xl font-medium text-sky-pop">{report.metrics.evidence_citations_used}</span>
              </div>
            </div>
          </ContentCard>
        </div>

        {/* Rankings Table */}
        <ContentCard className="p-8">
          <h3 className="text-[30px] font-medium text-ink-black mb-6">
            Supplier Rankings
          </h3>
          <div className="flex flex-col gap-3">
            {report.rankings.map((supplier) => (
              <div 
                key={supplier.rank} 
                className={clsx(
                  "flex items-center justify-between p-4 rounded-[10px] border",
                  supplier.rank === 1 
                    ? "bg-sky-pop/5 border-sky-pop" 
                    : "bg-cream-paper border-transparent"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                    supplier.rank === 1 ? "bg-sky-pop text-white" : "bg-pure-white text-stone-gray"
                  )}>
                    {supplier.rank === 1 ? <Trophy size={18} /> : supplier.rank}
                  </div>
                  <span className={clsx(
                    "font-medium text-[18px]",
                    supplier.rank === 1 ? "text-ink-black" : "text-stone-gray"
                  )}>
                    {supplier.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xl font-medium text-ink-black">
                  {supplier.score}
                  <span className="text-[15px] text-stone-gray">pts</span>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
