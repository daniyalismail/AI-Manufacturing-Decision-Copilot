import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface ScenarioRanking {
  id: string;
  name: string;
  score: number;
}

export interface ScenarioResponse {
  ranking: ScenarioRanking[];
}

export function useRunScenario(projectId: string) {
  return useMutation({
    mutationFn: (weights: Record<string, number>) =>
      fetchAPI<ScenarioResponse>(`/projects/${projectId}/scenario`, {
        method: "POST",
        body: JSON.stringify({ weights }),
      }),
  });
}
