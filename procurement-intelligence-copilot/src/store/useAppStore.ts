import { create } from 'zustand';
import { Project, Evidence, ScenarioWeights, ChatMessage, UserProfile } from '../types';
import { INITIAL_PROJECTS, INITIAL_EVIDENCE } from '../services/mockData';

interface AppState {
  projects: Project[];
  activeProject: Project | null;
  activeEvidence: Evidence | null;
  isEvidenceDrawerOpen: boolean;
  scenarioWeights: ScenarioWeights;
  chatMessages: ChatMessage[];
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
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export const DEFAULT_WEIGHTS: ScenarioWeights = {
  cost: 30,
  quality: 25,
  leadTime: 20,
  risk: 15,
  sustainability: 10,
};

export const useAppStore = create<AppState>((set, get) => ({
  projects: INITIAL_PROJECTS,
  activeProject: INITIAL_PROJECTS[0],
  activeEvidence: null,
  isEvidenceDrawerOpen: false,
  scenarioWeights: DEFAULT_WEIGHTS,
  chatMessages: [
    {
      id: 'msg-init',
      role: 'assistant',
      text: 'Hello! I am your AI Procurement Copilot. I have extracted and verified all requirements and supplier quotes for this project.\n\nVertex Manufacturing is recommended as the top vendor (Score 91/100). How can I assist your evaluation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [INITIAL_EVIDENCE[0], INITIAL_EVIDENCE[1]],
      suggestedQuestions: [
        'Why was Vertex Manufacturing selected?',
        'Which supplier has the lowest MOQ?',
        'Why was Nova Components rejected?',
        'Compare Vertex Manufacturing and Apex Industrial.',
      ],
    },
  ],
  userProfile: {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@mindmarket.com',
    role: 'Lead Procurement Director',
    company: 'MindMarket Operations',
  },
  notifications: [
    { id: 'n1', title: 'Analysis Ready', message: 'Motor Housing Procurement recommendation generated.', date: 'Just now', read: false },
    { id: 'n2', title: 'Quote Expiration Warning', message: 'Apex Industrial quote valid until Aug 25, 2026.', date: '2h ago', read: false },
  ],

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
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChatHistory: () => set({ chatMessages: [] }),
  updateProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
}));
