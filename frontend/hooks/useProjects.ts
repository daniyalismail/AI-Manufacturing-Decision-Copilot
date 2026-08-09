import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface Project {
  project_id: string;
  title: string;
  description?: string;
  created_at?: string;
  status?: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchAPI<Project[]>("/projects"),
  });
}

export interface CreateProjectInput {
  title: string;
  description?: string;
}

export interface CreateProjectResponse {
  project_id: string;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      fetchAPI<CreateProjectResponse>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
