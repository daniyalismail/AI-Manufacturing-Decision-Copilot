import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface Recommendation {
  supplier: string;
  score: number;
  confidence: number;
  summary: string;
}

export function useRecommendation(projectId: string) {
  return useQuery({
    queryKey: ["recommendation", projectId],
    queryFn: () => fetchAPI<Recommendation>(`/projects/${projectId}/recommendation`),
  });
}

export interface ConstraintValidation {
  status: string;
  details?: Record<string, any>;
}

export function useConstraints(projectId: string) {
  return useQuery({
    queryKey: ["constraints", projectId],
    queryFn: () => fetchAPI<ConstraintValidation>(`/projects/${projectId}/constraints`),
  });
}

export function useRequirements(projectId: string) {
  return useQuery({
    queryKey: ["requirements", projectId],
    queryFn: () => fetchAPI<any[]>(`/projects/${projectId}/requirements`),
  });
}
