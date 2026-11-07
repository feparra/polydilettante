'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, StageTab } from '@/store/useAppStore';
import { INITIAL_NODES } from '@/data/nodes';
import { CATEGORY_COLORS } from '@/types/node';
import { getSimulatorComponent } from '@/components/simulators';
import {
  X,
  Copy,
  Check,
  Cpu,
  AlertTriangle,
  Crosshair,
  Globe,
  GitBranch,
  Zap,
  Code2,
  ArrowRight,
} from 'lucide-react';

export default function ArtifactStageModal() {
  const {
    language,
    toggleLanguage,
    activeNodeId,
    setActiveNodeId,
    activeStageTab,
    setActiveStageTab,
  } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Close cockpit on ESC key
  useEffect(() => {
    if (!activeNodeId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveNodeId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeNodeId, setActiveNodeId]);

  if (!activeNodeId) return null;

  const node = INITIAL_NODES.find((n) => n.id === activeNodeId);
  if (!node) return null;

  const categoryConfig = CATEGORY_COLORS[node.category];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(node.blueprint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs: { id: StageTab; label: { es: string; en: string }; icon: React.ReactNode }[] = [
    {
      id: 'intuition',
      label: { es: '1. Intuición & Anatomía', en: '1. Intuition & Anatomy' },
      icon: <Zap className="w-3.5 h-3.5 text-amber-300" />,
    },
    {
      id: 'cases',
      label: { es: '2. Casos & Polinización', en: '2. Cases & Pollination' },
      icon: <GitBranch className="w-3.5 h-3.5 text-cyan-300" />,
    },
    {
      id: 'blueprint',
      label: { es: '3. Blueprint Code', en: '3. Blueprint Code' },
      icon: <Code2 className="w-3.5 h-3.5 text-purple-300" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/75 backdrop-blur-md">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={() => setActiveNodeId(null)} />

      {/* Widescreen Split-Stage Cockpit (94vw x 88vh) */}
      <div
        style={{
          boxShadow: `0 25px 80px rgba(0,0,0,0.95), 0 0 45px ${categoryConfig.glow}`,
        }}
        className="relative z-10 w-[94vw] max-w-[1600px] h-[88vh] rounded-3xl backdrop-blur-2xl bg-[#05050A]/95 border border-white/15 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* TOP BAR (Fixed 64px Height) */}
        <div className="h-16 px-5 border-b border-white/10 bg-[#080B16]/90 flex items-center justify-between gap-4 shrink-0">
          {/* Left: Category Badge + Node Title + Cross-Pollination Chips */}
          <div className="flex items-center gap-3 min-w-0 overflow-x-auto">
            <span
              style={{
                color: categoryConfig.hex,
                backgroundColor: `rgba(${categoryConfig.rgb}, 0.15)`,
                borderColor: `rgba(${categoryConfig.rgb}, 0.45)`,
              }}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold shrink-0 flex items-center gap-1.5"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: categoryConfig.hex }}
              />
              {categoryConfig.label[language]}
            </span>

            <h2 className="text-sm md:text-base font-bold text-white font-mono truncate">
              {node.title[language]}
            </h2>

            {/* Cross-Pollination Connection Jump Chips */}
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-white/10 shrink-0">
              <span className="text-[10px] font-mono text-slate-400">
                {language === 'es' ? 'Polinización:' : 'Cross-Links:'}
              </span>
              {node.connections.map((targetId) => {
                const targetNode = INITIAL_NODES.find((n) => n.id === targetId);
                if (!targetNode) return null;
                const targetCat = CATEGORY_COLORS[targetNode.category];
                return (
                  <button
                    key={targetId}
                    onClick={() => setActiveNodeId(targetId)}
                    style={{
                      borderColor: `rgba(${targetCat.rgb}, 0.4)`,
                      color: targetCat.hex,
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-white/5 border hover:bg-white/10 transition-all text-[11px] font-mono flex items-center gap-1"
                  >
                    <span>{targetNode.id}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Language Switcher & ESC / Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 text-xs font-mono font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-300" />
              <span>{language === 'es' ? 'ES | EN' : 'EN | ES'}</span>
            </button>

            <button
              onClick={() => setActiveNodeId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-mono font-bold transition-all"
            >
              <span>ESC</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN SPLIT-STAGE BODY (12 Columns, No Global Scroll) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* LEFT COLUMN (7 Cols): FULL-HEIGHT KINETIC SIMULATOR */}
          <div className="col-span-12 lg:col-span-7 h-full p-4 lg:p-5 overflow-y-auto lg:overflow-hidden flex flex-col bg-[#04060D]">
            {getSimulatorComponent(node.simulatorId)}
          </div>

          {/* RIGHT COLUMN (5 Cols): LAYERED 3-TAB KNOWLEDGE SYSTEM */}
          <div className="col-span-12 lg:col-span-5 h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-[#070A15]/95 flex flex-col overflow-hidden">
            {/* 3-Tab Selector Bar */}
            <div className="p-3 border-b border-white/10 grid grid-cols-3 gap-1.5 bg-[#050710] shrink-0">
              {tabs.map((tab) => {
                const isActive = activeStageTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStageTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[11px] font-mono font-bold transition-all border ${
                      isActive
                        ? 'bg-white/10 border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label[language]}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Container */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between gap-4">
              {/* TAB 1: INTUITION & ANATOMY */}
              {activeStageTab === 'intuition' && (
                <div className="space-y-4">
                  {/* Mechanical Metaphor Highlight Box */}
                  <div
                    style={{
                      borderColor: `rgba(${categoryConfig.rgb}, 0.4)`,
                      backgroundColor: `rgba(${categoryConfig.rgb}, 0.06)`,
                    }}
                    className="p-4 rounded-2xl border"
                  >
                    <div className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-cyan-300">
                      <span>💡</span>
                      <span>
                        {language === 'es'
                          ? 'La Intuición Mecánica (Qué Empuja a Qué)'
                          : 'The Mechanical Metaphor'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {node.metaphor[language]}
                    </p>
                  </div>

                  {/* 3 Visual Anatomy Cards */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-[#0B0F20] border border-white/10">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 mb-1.5">
                        <Cpu className="w-4 h-4" />
                        <span>
                          {language === 'es'
                            ? '⚙️ El Motor (Principio Físico / Matemático)'
                            : '⚙️ The Core Engine (Base Principle)'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {node.anatomy.engine[language]}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B0F20] border border-white/10">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 mb-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {language === 'es'
                            ? '⚠️ El Punto de Ruptura (Dónde Falla en Producción)'
                            : '⚠️ The Failure Surface (Real-World Breakdown)'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                        {node.anatomy.failure[language]}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0B0F20] border border-cyan-500/30">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 mb-1.5">
                        <Crosshair className="w-4 h-4" />
                        <span>
                          {language === 'es'
                            ? '🎯 La Regla de Oro (Heurística Clave)'
                            : '🎯 The Golden Heuristic'}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-cyan-100 font-mono leading-relaxed">
                        {node.anatomy.rule[language]}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASES & CROSS-POLLINATION */}
              {activeStageTab === 'cases' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0B0F20] border border-white/10">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                      ✓ {language === 'es' ? 'Caso de Uso Estándar' : 'Standard Production Case'}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {node.cases.standard[language]}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B0F20] border border-white/10">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                      ⚡ {language === 'es' ? 'Caso Extremo (Edge Case)' : 'Extreme Edge Case'}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {node.cases.edge[language]}
                    </p>
                  </div>

                  {/* Special Bioluminescent Cross-Pollination Card */}
                  <div
                    style={{
                      borderColor: categoryConfig.hex,
                      boxShadow: `0 0 25px rgba(${categoryConfig.rgb}, 0.2)`,
                    }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/35 via-purple-950/30 to-[#0B0F20] border-2 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      <GitBranch className="w-4 h-4" />
                      <span>
                        {language === 'es'
                          ? 'Polinización Cruzada Interdisciplinaria'
                          : 'Interdisciplinary Cross-Pollination'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-100 leading-relaxed">
                      {node.cases.crossPollination[language]}
                    </p>

                    {/* Direct Jump Buttons to Connected Disciplines */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {node.connections.map((connId) => {
                        const connNode = INITIAL_NODES.find((n) => n.id === connId);
                        if (!connNode) return null;
                        const connCat = CATEGORY_COLORS[connNode.category];
                        return (
                          <button
                            key={connId}
                            onClick={() => setActiveNodeId(connId)}
                            style={{
                              borderColor: connCat.hex,
                              backgroundColor: `rgba(${connCat.rgb}, 0.16)`,
                              color: connCat.hex,
                            }}
                            className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 hover:brightness-125 transition-all"
                          >
                            <span>
                              {language === 'es' ? 'Saltar a:' : 'Jump to:'}{' '}
                              {connNode.title[language]}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BLUEPRINT CODE */}
              {activeStageTab === 'blueprint' && (
                <div className="h-full flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#0B0F20] px-4 py-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>{node.id}.blueprint.ts</span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 text-xs font-mono font-bold transition-all"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copied
                          ? language === 'es'
                            ? '¡Copiado!'
                            : 'Copied!'
                          : language === 'es'
                          ? 'Copiar Blueprint'
                          : 'Copy Blueprint'}
                      </span>
                    </button>
                  </div>

                  <pre className="flex-1 p-4 rounded-2xl bg-[#03050A] border border-white/10 font-mono text-xs text-cyan-100/90 overflow-auto leading-relaxed">
                    <code>{node.blueprint.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

