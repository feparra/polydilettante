'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CATEGORY_COLORS, Category } from '@/types/node';
import { Atom, Plus, Globe, Orbit, LayoutGrid } from 'lucide-react';

const CATEGORIES: { id: Category | 'all'; label: { es: string; en: string } }[] = [
  { id: 'all', label: { es: 'Todo', en: 'All' } },
  { id: 'quant', label: { es: 'Quant Trading', en: 'Quant Trading' } },
  { id: 'engineering', label: { es: 'Automatización & PLC', en: 'Automation' } },
  { id: 'mechanics', label: { es: 'Mecánica 3D', en: '3D & Mechanics' } },
  { id: 'ai', label: { es: 'Sistemas IA', en: 'AI Systems' } },
];

export default function FloatingHud() {
  const {
    language,
    toggleLanguage,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    setPromptStudioOpen,
  } = useAppStore();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#070913]/85 border border-white/15 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(0,245,212,0.08)] max-w-[96vw] overflow-x-auto">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5 pr-3 border-r border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-violet-500 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.35)]">
          <div className="w-full h-full bg-[#05050A] rounded-[10px] flex items-center justify-center">
            <Atom className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
        </div>
        <div>
          <span className="font-bold tracking-wider text-xs md:text-sm bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent font-mono block leading-none">
            PHILOMATHUB
          </span>
          <span className="text-[9px] text-slate-400 font-mono tracking-tight block mt-0.5">
            {language === 'es' ? 'Gabinete Kinestésico de Polímatas' : 'Bioluminescent Polymath Lab'}
          </span>
        </div>
      </div>

      {/* Dual-Mode Segmented Switch: Cosmos vs Arcade */}
      <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/10 shrink-0">
        <button
          onClick={() => setViewMode('cosmos')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
            viewMode === 'cosmos'
              ? 'bg-gradient-to-r from-cyan-500/25 to-violet-500/25 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,245,212,0.2)]'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Orbit className="w-3.5 h-3.5 text-cyan-300" />
          <span>{language === 'es' ? 'Constelación' : 'Constellation'}</span>
        </button>

        <button
          onClick={() => setViewMode('arcade')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
            viewMode === 'arcade'
              ? 'bg-gradient-to-r from-fuchsia-500/25 to-amber-500/25 text-pink-200 border border-pink-400/40 shadow-[0_0_12px_rgba(247,37,133,0.2)]'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-pink-400" />
          <span>{language === 'es' ? 'Laboratorio / Arcade' : 'Lab / Arcade'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 border-l border-white/10 pl-3 shrink-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const color = cat.id !== 'all' ? CATEGORY_COLORS[cat.id].hex : '#00F5D4';

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                borderColor: isActive ? color : 'rgba(255, 255, 255, 0.07)',
                color: isActive ? color : '#94A3B8',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                boxShadow: isActive ? `0 0 12px ${color}33` : 'none',
              }}
              className="px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all duration-200 hover:text-white hover:border-white/25 whitespace-nowrap"
            >
              {cat.label[language]}
            </button>
          );
        })}
      </div>

      {/* Right Actions: Prompt Studio & Language Switcher */}
      <div className="flex items-center gap-2 pl-3 border-l border-white/10 shrink-0 ml-auto">
        <button
          onClick={() => setPromptStudioOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 border border-cyan-400/35 text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,245,212,0.3)] transition-all text-xs font-mono font-semibold whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Sintetizar Nodo' : 'Synthesize Node'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 hover:border-white/30 transition-all text-xs font-mono font-bold"
          title="Cambiar idioma / Switch language"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-300" />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}
