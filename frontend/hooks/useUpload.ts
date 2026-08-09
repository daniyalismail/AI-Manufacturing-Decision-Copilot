import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI, API_BASE_URL } from "@/lib/api-client";

export interface UploadResponse {
  document_id: string;
  status: string;
}

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Using raw fetch here to easily pass FormData without JSON headers
      const url = `${API_BASE_URL}/projects/${projectId}/documents`;
      
      // In a real app, attach JWT token
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": "Bearer mock-jwt-token-123"
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || "Failed to upload file");
      }

      return data?.data !== undefined ? data.data : data;
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ["project_documents", projectId] });
    },
  });
}

export interface AnalyzeResponse {
  analysis_id: string;
  status: string;
}

export function useStartAnalysis(projectId: string) {
  return useMutation({
    mutationFn: () =>
      fetchAPI<AnalyzeResponse>(`/projects/${projectId}/analyze`, {
        method: "POST",
      }),
  });
}
