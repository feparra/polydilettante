import { create } from 'zustand';
import { Language, Category } from '@/types/node';

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
  activeNodeId: null,
  setActiveNodeId: (activeNodeId) =>
    set({ activeNodeId, activeStageTab: 'intuition' }),
  activeStageTab: 'intuition',
  setActiveStageTab: (activeStageTab) => set({ activeStageTab }),
  isPromptStudioOpen: false,
  setPromptStudioOpen: (isPromptStudioOpen) => set({ isPromptStudioOpen }),
}));
