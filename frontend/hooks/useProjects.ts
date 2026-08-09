import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAllProjects(),
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
