import { create } from 'zustand';
import { Language, Category, NodeData } from '@/types/node';
import { INITIAL_NODES } from '@/data/nodes';

export type ViewMode = 'cosmos' | 'arcade';
export type StageTab = 'intuition' | 'cases' | 'blueprint';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  addNode: (node: NodeData) => void;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  activeStageTab: StageTab;
  setActiveStageTab: (tab: StageTab) => void;
  isPromptStudioOpen: boolean;
  setPromptStudioOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'es',
  setLanguage: (language) => set({ language }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'es' ? 'en' : 'es' })),
  viewMode: 'cosmos',
  setViewMode: (viewMode) => set({ viewMode }),
  selectedCategory: 'all',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  nodes: INITIAL_NODES,
  setNodes: (nodes) => set({ nodes }),
  addNode: (newNode) =>
    set((state) => {
      const exists = state.nodes.some((n) => n.id === newNode.id);
      const updated = exists
        ? state.nodes.map((n) => (n.id === newNode.id ? newNode : n))
        : [...state.nodes, newNode];
      return { nodes: updated, activeNodeId: newNode.id };
    }),
  activeNodeId: null,
  setActiveNodeId: (activeNodeId) =>
    set({ activeNodeId, activeStageTab: 'intuition' }),
  activeStageTab: 'intuition',
  setActiveStageTab: (activeStageTab) => set({ activeStageTab }),
  isPromptStudioOpen: false,
  setPromptStudioOpen: (isPromptStudioOpen) => set({ isPromptStudioOpen }),
}));
