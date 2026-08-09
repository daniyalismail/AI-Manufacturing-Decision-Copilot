import { fetchAPI } from '../lib/api-client';

export const uploadService = {
  async uploadDocument(projectId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    // api-client handles formData if we don't pass headers (browser sets multipart/form-data boundary automatically)
    // Wait, our `fetchAPI` might need tweaking or we can just use native fetch if it's complex.
    // Let's use fetchAPI but pass formData directly.
    return fetchAPI(`/projects/${projectId}/documents`, {
      method: 'POST',
      body: formData as any,
    });
  }
};
