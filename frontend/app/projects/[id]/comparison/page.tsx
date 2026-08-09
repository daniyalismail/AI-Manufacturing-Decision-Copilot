"use client";

import { use, useState, useMemo } from "react";
import { useSuppliers, Supplier } from "@/hooks/useSuppliers";
import { ContentCard } from "@/components/ui/ContentCard";
import { ArrowDown, ArrowUp, Filter, Star, XCircle, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

type SortField = "score" | "cost" | "name";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "qualified" | "unqualified";

export default function SupplierComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { data: suppliers, isLoading, isError } = useSuppliers(projectId);

  const [sortField, setSortField] = useState<SortField>("score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  const processedSuppliers = useMemo(() => {
    if (!suppliers) return [];

    let result = [...suppliers];

    // Filter
    if (filterStatus === "qualified") {
      result = result.filter(s => s.qualified);
    } else if (filterStatus === "unqualified") {
      result = result.filter(s => !s.qualified);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "score") {
        comparison = a.score - b.score;
      } else if (sortField === "cost") {
        comparison = a.cost - b.cost;
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [suppliers, sortField, sortOrder, filterStatus]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[var(--color-sandstone)] border-t-[var(--color-ink-black)] rounded-full animate-spin mb-8"></div>
        <h2 className="text-[30px] font-medium text-ink-black">Loading Suppliers...</h2>
      </div>
    );
  }

  if (isError || !suppliers) {
    return (
      <div className="flex flex-col items-center pt-24 text-center">
        <AlertCircle size={48} className="text-coral-pop mb-6" />
        <h1 className="text-[30px] font-medium text-ink-black mb-4">
          Failed to load comparison data
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-12 pb-24 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-[60px] gap-6">
        <div>
          <h1 className="text-[81px] font-medium text-ink-black tracking-[-4.86px] leading-[1.2] mb-2">
            Supplier Matrix
          </h1>
          <p className="text-[18px] text-stone-gray">
            Compare evaluated suppliers based on their extracted constraints and scores.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 bg-pure-white p-2 rounded-full border border-hairline-mist shadow-sm">
          <Filter size={18} className="text-stone-gray ml-3" />
          <div className="flex items-center gap-1">
            {(["all", "qualified", "unqualified"] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={clsx(
                  "px-4 py-2 rounded-full text-[15px] font-medium transition-colors capitalize",
                  filterStatus === status
                    ? "bg-ink-black text-pure-white"
                    : "text-stone-gray hover:bg-cream-paper hover:text-ink-black"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-8">
        <div className="min-w-[900px] flex flex-col gap-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 text-[15px] font-medium text-stone-gray uppercase tracking-wider">
            <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-ink-black transition-colors" onClick={() => handleSort("name")}>
              Supplier Name {sortField === "name" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </div>
            <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-ink-black transition-colors" onClick={() => handleSort("score")}>
              Match Score {sortField === "score" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </div>
            <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-ink-black transition-colors" onClick={() => handleSort("cost")}>
              Est. Cost {sortField === "cost" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </div>
            <div className="col-span-2 flex items-center">
              Lead Time
            </div>
            <div className="col-span-2 flex items-center justify-end">
              Status
            </div>
          </div>

          {/* Supplier Rows */}
          {processedSuppliers.length === 0 ? (
            <ContentCard className="text-center py-16">
              <p className="text-[18px] text-stone-gray">No suppliers match the current filters.</p>
            </ContentCard>
          ) : (
            processedSuppliers.map(supplier => (
              <ContentCard 
                key={supplier.id} 
                className={clsx(
                  "grid grid-cols-12 gap-4 items-center px-8 py-6 transition-all",
                  supplier.recommended ? "border-2 border-sky-pop bg-sky-pop/5" : "border border-[var(--color-pure-white)] hover:border-hairline-mist"
                )}
              >
                <div className="col-span-4 flex items-center gap-4">
                  {supplier.recommended && (
                    <div className="w-10 h-10 rounded-full bg-sky-pop text-white flex items-center justify-center shrink-0" title="Recommended Supplier">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                  <span className={clsx(
                    "text-[20px] font-medium text-ink-black truncate",
                    !supplier.recommended && "pl-14" // align with the ones that have stars
                  )}>
                    {supplier.name}
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex items-center gap-2 font-medium text-[18px] text-ink-black">
                    <TrendingUp size={18} className="text-stone-gray" />
                    {supplier.score}
                  </div>
                </div>

                <div className="col-span-2 font-medium text-[18px] text-ink-black">
                  ${supplier.cost.toLocaleString()}
                </div>

                <div className="col-span-2 text-[18px] text-stone-gray">
                  {supplier.lead_time}
                </div>

                <div className="col-span-2 flex items-center justify-end">
                  {supplier.qualified ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-fresh-grass/20 text-[#4c8a2b] rounded-full text-[15px] font-medium">
                      <CheckCircle2 size={16} /> Qualified
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-coral-pop/10 text-coral-pop rounded-full text-[15px] font-medium">
                      <XCircle size={16} /> Unqualified
                    </div>
                  )}
                </div>
              </ContentCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
