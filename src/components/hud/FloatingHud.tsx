'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CATEGORY_COLORS, Category } from '@/types/node';
import { Atom, Plus, Globe } from 'lucide-react';

const CATEGORIES: { id: Category | 'all'; label: { es: string; en: string } }[] = [
  { id: 'all', label: { es: 'Todo', en: 'All' } },
  { id: 'quant', label: { es: 'Trading Cuantitativo', en: 'Quant Trading' } },
  { id: 'engineering', label: { es: 'Automatización & PLC', en: 'Automation' } },
  { id: 'mechanics', label: { es: 'Mecánica 3D', en: '3D & Mechanics' } },
  { id: 'ai', label: { es: 'Sistemas IA', en: 'AI Systems' } },
];

export default function FloatingHud() {
  const {
    language,
    toggleLanguage,
    selectedCategory,
    setSelectedCategory,
    setPromptStudioOpen,
  } = useAppStore();

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#090C19]/80 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] max-w-6xl w-[94vw] md:w-auto overflow-x-auto">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-2.5 pr-3 border-r border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-pink-500 to-purple-500 p-0.5 flex items-center justify-center">
          <div className="w-full h-full bg-[#05050A] rounded-[10px] flex items-center justify-center">
            <Atom className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>
        <div>
          <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent font-mono block">
            POLYDILETTANTE
          </span>
          <span className="text-[9px] text-slate-400 font-mono tracking-tight block">
            {language === 'es' ? 'El Taller de las Ideas Conectadas' : 'The Connected Ideas Playground'}
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 shrink-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const color = cat.id !== 'all' ? CATEGORY_COLORS[cat.id].hex : '#FFFFFF';

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                borderColor: isActive ? color : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? color : '#94A3B8',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              }}
              className="px-3 py-1 rounded-xl text-xs font-mono transition-all duration-200 hover:text-white hover:border-white/20 whitespace-nowrap"
            >
              {cat.label[language]}
            </button>
          );
        })}
      </div>

      {/* Action Buttons: New Artifact Prompt & Language Toggle */}
      <div className="flex items-center gap-2 pl-3 border-l border-white/10 shrink-0 ml-auto">
        <button
          onClick={() => setPromptStudioOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-200 hover:border-cyan-400/60 transition-all text-xs font-mono font-medium shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'es' ? '+ Nuevo Artefacto (AI Prompt)' : '+ New Artifact (AI Prompt)'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-all text-xs font-mono font-semibold"
          title="Cambiar idioma / Switch language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}

