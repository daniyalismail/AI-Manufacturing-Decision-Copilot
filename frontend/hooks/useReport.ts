import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface ReportData {
  executive_summary: string;
  recommendation: string;
  rankings: Array<{
    name: string;
    score: number;
    rank: number;
  }>;
  metrics: {
    total_constraints_checked: number;
    passed_constraints: number;
    evidence_citations_used: number;
  };
}

export function useReport(projectId: string) {
  return useQuery({
    queryKey: ["report", projectId],
    queryFn: () => fetchAPI<ReportData>(`/projects/${projectId}/report`),
  });
}

// Custom hook to trigger download via browser fetch
export function useDownloadReport(projectId: string) {
  return useMutation({
    mutationFn: async () => {
      // Typically this hits the /download endpoint and creates a Blob to trigger browser download
      const response = await fetchAPI<{ status: string }>(`/projects/${projectId}/report/download`);
      return response;
    }
  });
}
