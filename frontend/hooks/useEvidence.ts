import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface Evidence {
  id: string;
  document: string;
  page: number;
  text: string;
  relevance?: number;
}

export function useEvidence(projectId: string) {
  return useQuery({
    queryKey: ["evidence", projectId],
    queryFn: () => fetchAPI<Evidence[]>(`/projects/${projectId}/evidence`),
  });
}
