import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Evidence, ScenarioWeights, ChatMessage, UserProfile } from '../types';

interface AppState {
  projects: Project[];
  activeProject: Project | null;
  activeEvidence: Evidence | null;
  isEvidenceDrawerOpen: boolean;
  scenarioWeights: ScenarioWeights;
  projectChats: Record<string, ChatMessage[]>;
  userProfile: UserProfile;
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  selectProjectById: (id: string) => void;
  openEvidence: (evidence: Evidence) => void;
  closeEvidence: () => void;
  updateScenarioWeights: (weights: Partial<ScenarioWeights>) => void;
  resetScenarioWeights: () => void;
  addChatMessage: (projectId: string, msg: ChatMessage) => void;
  clearChatHistory: (projectId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const DEFAULT_WEIGHTS: ScenarioWeights = {
  cost: 30,
  quality: 25,
  leadTime: 20,
  risk: 15,
  sustainability: 10,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      activeEvidence: null,
      isEvidenceDrawerOpen: false,
      scenarioWeights: DEFAULT_WEIGHTS,
      projectChats: {},
      userProfile: {
        name: '',
        email: '',
        role: '',
        company: '',
      },
      notifications: [],

      setProjects: (projects) => set({ projects }),
      setActiveProject: (activeProject) => set({ activeProject }),
      selectProjectById: (id) => {
        const proj = get().projects.find((p) => p.id === id);
        if (proj) set({ activeProject: proj });
      },
      openEvidence: (evidence) => set({ activeEvidence: evidence, isEvidenceDrawerOpen: true }),
      closeEvidence: () => set({ isEvidenceDrawerOpen: false }),
      updateScenarioWeights: (newWeights) => set((state) => ({
        scenarioWeights: { ...state.scenarioWeights, ...newWeights },
      })),
      resetScenarioWeights: () => set({ scenarioWeights: DEFAULT_WEIGHTS }),
      
      // Chat actions
      addChatMessage: (projectId, msg) => set((state) => {
        const currentChat = state.projectChats[projectId] || [];
        return {
          projectChats: {
            ...state.projectChats,
            [projectId]: [...currentChat, msg]
          }
        };
      }),
      clearChatHistory: (projectId) => set((state) => ({
        projectChats: {
          ...state.projectChats,
          [projectId]: []
        }
      })),
      
      updateProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
    }),
    {
      name: 'procurement-copilot-storage',
      partialize: (state) => ({ 
        userProfile: state.userProfile,
        scenarioWeights: state.scenarioWeights,
        projectChats: state.projectChats
      }), // persist chats per project
    }
  )
);
