import { Project } from '../types';
import { fetchAPI } from '../lib/api-client';

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const rawData = await fetchAPI<any[]>('/projects');
    const data = rawData || [];
    return data.map((item) => ({
      id: item.id || item.project_id,
      name: item.title || item.name || "Untitled",
      description: item.description || "",
      category: item.category || "Uncategorized",
      status: item.status || 'Draft',
      date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      targetBudget: item.target_budget || 50000,
      documents: item.documents || [],
      suppliers: item.suppliers || [],
      requirements: item.requirements || [],
      constraints: item.constraints || [],
    })) as Project[];
  },

  async getProjectStatus(id: string): Promise<string> {
    const item = await fetchAPI<any>(`/projects/${id}/status`);
    return item.status || 'Draft';
  },

  async getProject(id: string): Promise<Project> {
    const item = await fetchAPI<any>(`/projects/${id}`);
    return {
      id: item.id || item.project_id,
      name: item.title || item.name || "Untitled",
      description: item.description || "",
      category: item.category || "Uncategorized",
      status: item.status || 'Draft',
      date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      targetBudget: item.target_budget || 50000,
      documents: item.documents || [],
      suppliers: item.suppliers || [],
      requirements: item.requirements || [],
      constraints: item.constraints || [],
    } as Project;
  },

  async createProject(data: { name: string; description: string; category: string; targetBudget: number }): Promise<Project> {
    const created = await fetchAPI<any>('/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: data.name,
        description: data.description,
        category: data.category,
        target_budget: data.targetBudget,
      })
    });
    
    // The backend returns { project_id: "...", title: "..." } currently
    // so we merge the frontend assumptions with the backend response
    return {
      id: created.project_id,
      name: data.name,
      description: data.description,
      category: data.category,
      targetBudget: data.targetBudget,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      documents: [],
      suppliers: [],
      requirements: [],
      constraints: []
    } as Project;
  }
};
