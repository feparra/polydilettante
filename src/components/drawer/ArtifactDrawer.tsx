'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { INITIAL_NODES } from '@/data/nodes';
import { CATEGORY_COLORS } from '@/types/node';
import { getSimulatorComponent } from '@/components/simulators';
import { X, Copy, Check, ExternalLink, Cpu, AlertTriangle, Crosshair } from 'lucide-react';

export default function ArtifactDrawer() {
  const { language, activeNodeId, setActiveNodeId } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!activeNodeId) return null;

  const node = INITIAL_NODES.find((n) => n.id === activeNodeId);
  if (!node) return null;

  const categoryConfig = CATEGORY_COLORS[node.category];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(node.blueprint.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={() => setActiveNodeId(null)} />

      {/* Drawer Panel */}
      <aside
        style={{
          boxShadow: `-10px 0 40px ${categoryConfig.glow}, 0 0 60px rgba(0,0,0,0.9)`,
        }}
        className="relative z-10 w-full max-w-3xl h-full bg-[#080B17]/95 border-l border-white/10 backdrop-blur-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-[#080B17]/90 border-b border-white/10 backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: categoryConfig.hex,
                  backgroundColor: `rgba(${categoryConfig.rgb}, 0.12)`,
                  borderColor: `rgba(${categoryConfig.rgb}, 0.35)`,
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold"
              >
                {categoryConfig.label[language]}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ID: {node.id}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100 font-mono">
              {node.title[language]}
            </h2>
          </div>

          <button
            onClick={() => setActiveNodeId(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Bento Grid */}
        <div className="p-6 space-y-6">
          {/* Connected Nodes Jump Chips */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">{language === 'es' ? 'Nodos Conectados:' : 'Cross-Linked Nodes:'}</span>
            <div className="flex flex-wrap gap-1.5">
              {node.connections.map((targetId) => {
                const targetNode = INITIAL_NODES.find((n) => n.id === targetId);
                return (
                  <button
                    key={targetId}
                    onClick={() => setActiveNodeId(targetId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all text-[11px]"
                  >
                    <span>{targetNode ? targetNode.title[language] : targetId}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bloque 1: La Intuición Visual (The Mechanical Metaphor) */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <h4 className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-1.5">
              {language === 'es' ? '💡 La Intuición Mecánica' : '💡 The Mechanical Metaphor'}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {node.metaphor[language]}
            </p>
          </div>

          {/* Bloque 2: LABORATORIO INTERACTIVO (Micro-Simulator) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {language === 'es' ? 'Laboratorio Táctil en Vivo (60 FPS)' : 'Tactile Micro-Simulator (60 FPS)'}
              </h4>
            </div>

            {getSimulatorComponent(node.simulatorId)}
          </div>

          {/* Bloque 3: Anatomía del Mecanismo (3 Tarjetas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#0B0F21]/80 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 mb-2">
                <Cpu className="w-4 h-4" />
                <span>{language === 'es' ? 'El Motor (Principio)' : 'The Core Engine'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {node.anatomy.engine[language]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F21]/80 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{language === 'es' ? 'Punto de Ruptura' : 'Failure Surface'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {node.anatomy.failure[language]}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F21]/80 border border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 mb-2">
                <Crosshair className="w-4 h-4" />
                <span>{language === 'es' ? 'Regla de Oro' : 'Golden Heuristic'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {node.anatomy.rule[language]}
              </p>
            </div>
          </div>

          {/* Bloque 4: Casos de Uso y Polinización Cruzada */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              {language === 'es' ? 'Casos de Aplicación y Polinización Cruzada' : 'Use Cases & Cross-Pollination'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  {language === 'es' ? 'Caso Estándar' : 'Standard Case'}
                </span>
                <p className="text-xs text-slate-300">
                  {node.cases.standard[language]}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  {language === 'es' ? 'Edge Case Extremo' : 'Extreme Edge Case'}
                </span>
                <p className="text-xs text-slate-300">
                  {node.cases.edge[language]}
                </p>
              </div>
            </div>

            {/* Polinización Cruzada (Destacado) */}
            <div
              style={{
                borderColor: categoryConfig.hex,
                boxShadow: `0 0 15px rgba(${categoryConfig.rgb}, 0.15)`,
              }}
              className="p-4 rounded-xl bg-gradient-to-r from-purple-950/20 via-cyan-950/20 to-transparent border backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 mb-1.5">
                <span>⚡</span>
                <span className="uppercase tracking-wider">
                  {language === 'es' ? 'Polinización Cruzada Interdisciplinaria' : 'Interdisciplinary Cross-Pollination'}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {node.cases.crossPollination[language]}
              </p>
            </div>
          </div>

          {/* Bloque 5: Blueprint de Código */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                {language === 'es' ? 'Blueprint de Implementación' : 'Implementation Blueprint'}
              </h4>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (language === 'es' ? 'Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar Código' : 'Copy Code')}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#04060C] border border-white/10 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-60">
              <code>{node.blueprint.code}</code>
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}

