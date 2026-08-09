import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface Supplier {
  id: string;
  name: string;
  score: number;
  cost: number;
  lead_time: string;
  qualified: boolean;
  recommended: boolean;
}

export function useSuppliers(projectId: string) {
  return useQuery({
    queryKey: ["suppliers", projectId],
    queryFn: () => fetchAPI<Supplier[]>(`/projects/${projectId}/suppliers`),
  });
}
