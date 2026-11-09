'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CATEGORY_COLORS, Category } from '@/types/node';
import { Terminal, Plus, Globe, Compass, Grid, Cpu } from 'lucide-react';

const CATEGORIES: { id: Category | 'all'; label: { es: string; en: string }; code: string }[] = [
  { id: 'all', label: { es: 'Todos los Dominios', en: 'All Domains' }, code: 'ALL' },
  { id: 'quant', label: { es: 'Finanzas Cuantitativas', en: 'Quant Finance' }, code: 'QNT' },
  { id: 'engineering', label: { es: 'Control & Sensores', en: 'Control & Sensors' }, code: 'CTRL' },
  { id: 'mechanics', label: { es: 'Cinemática & Robótica', en: 'Kinematics' }, code: 'MECH' },
  { id: 'ai', label: { es: 'Arquitectura IA', en: 'AI Systems' }, code: 'AI' },
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
    nodes,
  } = useAppStore();

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-4 py-2 rounded-lg bg-[#0F1218]/95 border border-[#1E2533] shadow-xl max-w-[96vw] w-[1380px] text-xs font-mono">
      {/* Brand & Instrument ID */}
      <div className="flex items-center gap-3 pr-4 border-r border-[#1E2533]">
        <div className="w-6 h-6 rounded bg-[#161B26] border border-[#2D374A] flex items-center justify-center text-[#E1E7F0]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider text-xs">
              PHILOMATHUB
            </span>
            <span className="px-1.5 py-0.2 rounded bg-[#1A202C] text-[9px] text-slate-400 font-mono border border-slate-700">
              LAB v2.5
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block leading-tight">
            {language === 'es' ? 'Banco de Trabajo & Sistemas Complejos' : 'Systems Engineering Workbench'}
          </span>
        </div>
      </div>

      {/* Primary Navigation Modes (Atlas vs Deck) */}
      <div className="flex items-center gap-1 bg-[#090B0F] p-0.5 rounded border border-[#1E2533]">
        <button
          onClick={() => setViewMode('cosmos')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
            viewMode === 'cosmos'
              ? 'bg-[#181E2B] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Atlas de Red' : 'Network Atlas'}</span>
        </button>

        <button
          onClick={() => setViewMode('arcade')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
            viewMode === 'arcade'
              ? 'bg-[#181E2B] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Registro de Banco' : 'Workbench Deck'}</span>
        </button>
      </div>

      {/* Domain Filters (Clean Technical Tabs) */}
      <div className="hidden lg:flex items-center gap-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors border ${
                isActive
                  ? 'bg-[#181E2B] border-slate-500 text-white font-semibold'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
              }`}
            >
              <span className="text-slate-500 mr-1 text-[9px]">{cat.code}:</span>
              {cat.label[language]}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls (Nodes, Ingestion, Language) */}
      <div className="flex items-center gap-2 pl-4 border-l border-[#1E2533]">
        <span className="text-[10px] text-slate-500 hidden sm:inline">
          {nodes.length} {language === 'es' ? 'SISTEMAS' : 'NODES'}
        </span>

        <button
          onClick={() => setPromptStudioOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161B26] border border-[#2D374A] text-slate-200 hover:text-white hover:border-cyan-500/50 transition-colors text-xs"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{language === 'es' ? 'Ingerir Nodo' : 'Ingest Node'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1 rounded bg-[#161B26] border border-[#2D374A] text-slate-300 hover:text-white text-xs font-bold"
          title="Switch Language"
        >
          <Globe className="w-3 h-3 text-slate-400" />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}
