import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api-client";

export interface ChatSource {
  title: string;
  page?: number;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: ({ projectId, message }: { projectId: string; message: string }) =>
      fetchAPI<ChatResponse>(`/chat`, {
        method: "POST",
        body: JSON.stringify({ project_id: projectId, message }),
      }),
  });
}
