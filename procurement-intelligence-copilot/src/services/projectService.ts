import { Project, ProjectDocument, Supplier, Requirement } from '../types';
import { INITIAL_PROJECTS, MOTOR_HOUSING_SUPPLIERS, MOTOR_HOUSING_REQUIREMENTS, MOTOR_HOUSING_CONSTRAINTS } from './mockData';

let projectsStore: Project[] = [...INITIAL_PROJECTS];

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...projectsStore]), 200));
  },

  async getProjectById(id: string): Promise<Project | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = projectsStore.find((p) => p.id === id);
        resolve(found ? { ...found } : null);
      }, 150);
    });
  },

  async createProject(data: { name: string; description: string; category?: string; targetBudget?: number }): Promise<Project> {
    return new Promise((resolve) => {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: data.name,
        description: data.description,
        category: data.category || 'General Industrial',
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        targetBudget: data.targetBudget || 50000,
        documents: [],
        suppliers: [],
        requirements: [],
        constraints: [],
      };
      projectsStore = [newProject, ...projectsStore];
      setTimeout(() => resolve(newProject), 300);
    });
  },

  async updateProjectStatus(id: string, status: Project['status']): Promise<Project | null> {
    return new Promise((resolve) => {
      const index = projectsStore.findIndex((p) => p.id === id);
      if (index !== -1) {
        projectsStore[index] = {
          ...projectsStore[index],
          status,
          // Populate suppliers & requirements if transitioning to Analyzed
          ...(status === 'Analyzed' ? {
            suppliers: MOTOR_HOUSING_SUPPLIERS,
            requirements: MOTOR_HOUSING_REQUIREMENTS,
            constraints: MOTOR_HOUSING_CONSTRAINTS,
          } : {})
        };
        resolve(projectsStore[index]);
      } else {
        resolve(null);
      }
    });
  },

  async addDocumentsToProject(id: string, newDocs: ProjectDocument[]): Promise<ProjectDocument[]> {
    return new Promise((resolve) => {
      const proj = projectsStore.find((p) => p.id === id);
      if (proj) {
        proj.documents = [...proj.documents, ...newDocs];
        resolve(proj.documents);
      } else {
        resolve([]);
      }
    });
  }
};
