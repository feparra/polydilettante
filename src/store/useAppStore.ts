import { create } from 'zustand';
import { Language, Category } from '@/types/node';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  isPromptStudioOpen: boolean;
  setPromptStudioOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'es',
  setLanguage: (language) => set({ language }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'es' ? 'en' : 'es' })),
  selectedCategory: 'all',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  activeNodeId: null,
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
  isPromptStudioOpen: false,
  setPromptStudioOpen: (isPromptStudioOpen) => set({ isPromptStudioOpen }),
}));

