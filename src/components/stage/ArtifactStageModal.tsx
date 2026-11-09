'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, StageTab } from '@/store/useAppStore';
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
  Terminal,
  Code2,
  ArrowRight,
} from 'lucide-react';

export default function ArtifactStageModal() {
  const {
    nodes: appNodes,
    language,
    toggleLanguage,
    activeNodeId,
    setActiveNodeId,
    activeStageTab,
    setActiveStageTab,
  } = useAppStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!activeNodeId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveNodeId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeNodeId, setActiveNodeId]);

  if (!activeNodeId) return null;

  const node = appNodes.find((n) => n.id === activeNodeId);
  if (!node) return null;

  const cat = CATEGORY_COLORS[node.category] || {
    hex: '#06B6D4',
    code: 'SYS',
    label: { es: 'Sistema', en: 'System' },
  };

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
      label: { es: '1. Principio & Anatomía', en: '1. First Principles' },
      icon: <Terminal className="w-3.5 h-3.5 text-slate-400" />,
    },
    {
      id: 'cases',
      label: { es: '2. Frontera & Polinización', en: '2. Edge & Cross-Field' },
      icon: <GitBranch className="w-3.5 h-3.5 text-slate-400" />,
    },
    {
      id: 'blueprint',
      label: { es: '3. Implementación', en: '3. Blueprint Spec' },
      icon: <Code2 className="w-3.5 h-3.5 text-slate-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/85 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setActiveNodeId(null)} />

      {/* Precision Engineering Widescreen Workstation */}
      <div className="relative z-10 w-[95vw] max-w-[1550px] h-[90vh] rounded-lg bg-[#0D1017] border border-[#1E2533] shadow-2xl overflow-hidden flex flex-col font-mono animate-in fade-in zoom-in-95 duration-150">
        {/* Top Instrument Bar */}
        <div className="h-14 px-4 border-b border-[#1E2533] bg-[#0A0D14] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              style={{ color: cat.hex }}
              className="text-xs font-bold px-2 py-0.5 rounded bg-[#151B27] border border-[#232C3D] shrink-0"
            >
              {cat.code}
            </span>

            <h2 className="text-sm md:text-base font-bold text-slate-100 truncate">
              {node.title[language]}
            </h2>

            {/* Inter-system Cross-Links */}
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-[#1E2533] text-xs">
              <span className="text-slate-500">POLLINATED_WITH:</span>
              {node.connections.map((targetId) => (
                <button
                  key={targetId}
                  onClick={() => setActiveNodeId(targetId)}
                  className="px-2 py-0.5 rounded bg-[#141822] border border-[#21293B] text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span>{targetId}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141822] border border-[#21293B] text-slate-300 hover:text-white text-xs font-bold"
            >
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setActiveNodeId(null)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1F171A] border border-[#3E232B] text-rose-300 hover:text-rose-200 text-xs font-bold"
            >
              <span>ESC</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 12-Col Precision Split: 7 Cols Simulator / 5 Cols Technical Rigor */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* LEFT 7 COLS: THE EXPERIMENTAL BENCH */}
          <div className="col-span-12 lg:col-span-7 h-full p-4 overflow-y-auto lg:overflow-hidden flex flex-col bg-[#07090E]">
            {getSimulatorComponent(node.simulatorId)}
          </div>

          {/* RIGHT 5 COLS: MATHEMATICAL & ARCHITECTURAL FOUNDATION */}
          <div className="col-span-12 lg:col-span-5 h-full border-t lg:border-t-0 lg:border-l border-[#1E2533] bg-[#0A0D14] flex flex-col overflow-hidden">
            {/* Tab Strip */}
            <div className="p-2 border-b border-[#1E2533] grid grid-cols-3 gap-1 bg-[#080A0F] shrink-0 text-xs">
              {tabs.map((tab) => {
                const isActive = activeStageTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStageTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] transition-colors border ${
                      isActive
                        ? 'bg-[#151B27] border-[#2E3B52] text-white font-bold'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label[language]}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Viewport */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between gap-3 text-xs">
              {/* TAB 1: FIRST PRINCIPLES */}
              {activeStageTab === 'intuition' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded bg-[#10131B] border border-[#1E2533]">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      // {language === 'es' ? 'METÁFORA MECÁNICA / QUÉ EMPUJA A QUÉ' : 'PHYSICAL INTUITION'}
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {node.metaphor[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-[#10131B] border border-[#1E2533]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{language === 'es' ? 'EL MOTOR (PRINCIPIO BASE)' : 'GOVERNING ENGINE'}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {node.anatomy.engine[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-[#10131B] border border-[#1E2533]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'SUPERFICIE DE FALLA (PRODUCCIÓN)' : 'FAILURE SURFACE'}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {node.anatomy.failure[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-[#07090F] border border-cyan-500/40">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 mb-1">
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'REGLA DE ORO / INVARIANTE' : 'SYSTEM INVARIANT'}</span>
                    </div>
                    <p className="text-cyan-100 font-bold leading-relaxed">
                      {node.anatomy.rule[language]}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: EDGE CASES & CROSS-DISCIPLINARY TRANSLATION */}
              {activeStageTab === 'cases' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded bg-[#10131B] border border-[#1E2533]">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      // {language === 'es' ? 'APLICACIÓN ESTÁNDAR (CON MÉTRICAS)' : 'STANDARD APPLICATION'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {node.cases.standard[language]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-[#10131B] border border-[#1E2533]">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      // {language === 'es' ? 'LÍMITE EXTREMO / CONDICIÓN DE ESTRÉS' : 'EXTREME STRESS BOUNDARY'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {node.cases.edge[language]}
                    </p>
                  </div>

                  {/* Cross-Pollination Synthesis Box */}
                  <div className="p-4 rounded bg-[#0B0F17] border border-[#2D3A50] space-y-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'HOMOLOGÍA ENTRE DISCIPLINAS' : 'CROSS-FIELD HOMOLOGY'}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {node.cases.crossPollination[language]}
                    </p>

                    <div className="pt-2 border-t border-[#1C2536] flex flex-wrap gap-1.5">
                      {node.connections.map((connId) => (
                        <button
                          key={connId}
                          onClick={() => setActiveNodeId(connId)}
                          className="px-2.5 py-1 rounded bg-[#141924] border border-[#242F44] text-slate-300 hover:text-white hover:border-cyan-400 text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>{connId}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BLUEPRINT CODE */}
              {activeStageTab === 'blueprint' && (
                <div className="h-full flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-[#10131B] px-3 py-1.5 rounded border border-[#1E2533] text-xs">
                    <span className="text-slate-400">{node.id}.blueprint.ts</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#18202E] border border-[#2D3950] text-slate-200 hover:text-white text-[11px] font-semibold"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
                    </button>
                  </div>

                  <pre className="flex-1 p-3.5 rounded bg-[#06080C] border border-[#181E29] text-[11px] text-slate-300 overflow-auto leading-relaxed">
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
