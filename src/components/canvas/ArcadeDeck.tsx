'use client';

import React from 'react';
import { INITIAL_NODES } from '@/data/nodes';
import { CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';
import NodeMiniPreview from './NodeMiniPreview';
import { Activity, Sparkles, GitBranch, Cpu } from 'lucide-react';

export default function ArcadeDeck() {
  const { language, selectedCategory, setActiveNodeId } = useAppStore();

  const filteredNodes = INITIAL_NODES.filter(
    (n) => selectedCategory === 'all' || n.category === selectedCategory
  );

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-[#05050A] pt-24 pb-16 px-6 md:px-12">
      {/* Ambient Bioluminescent Glow */}
      <div className="pointer-events-none fixed top-20 left-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-10 right-1/4 w-[520px] h-[520px] rounded-full bg-purple-500/10 blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {language === 'es'
                  ? 'GABINETE DE CURIOSIDADES KINESTÉSICO // V2.0'
                  : 'KINETIC CABINET OF CURIOSITIES // V2.0'}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white font-mono tracking-tight">
              {language === 'es'
                ? 'Explora Sistemas por Polinización Cruzada'
                : 'Explore Systems via Cross-Pollination'}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
              {language === 'es'
                ? 'Cada tarjeta aloja un micro-simulador físico a 60 FPS donde el trading cuantitativo, la robótica cicloidal, los lazos industriales 4-20 mA y los agentes IA comparten las mismas leyes matemáticas.'
                : 'Every card hosts a real-time 60 FPS physics micro-simulator where quantitative trading, cycloidal robotics, 4-20 mA industrial loops, and AI routers share the exact same mathematical laws.'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-xl shrink-0">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              {filteredNodes.length} {language === 'es' ? 'Simuladores Activos' : 'Live Simulators'}
            </span>
          </div>
        </div>

        {/* Bento Grid of Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNodes.map((node) => {
            const cat = CATEGORY_COLORS[node.category];

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                style={{
                  borderColor: `rgba(${cat.rgb}, 0.35)`,
                  boxShadow: `0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px rgba(${cat.rgb}, 0.1)`,
                }}
                className="group relative rounded-3xl bg-[#080B16]/90 border p-6 backdrop-blur-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,245,212,0.18)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      style={{
                        color: cat.hex,
                        backgroundColor: `rgba(${cat.rgb}, 0.14)`,
                        borderColor: `rgba(${cat.rgb}, 0.4)`,
                      }}
                      className="text-xs font-mono px-3 py-1 rounded-full border uppercase tracking-wider font-semibold flex items-center gap-1.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: cat.hex }}
                      />
                      {cat.label[language]}
                    </span>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {language === 'es' ? 'SIMULADOR 60 FPS' : '60 FPS SIMULATOR'}
                    </span>
                  </div>

                  {/* Animated Mini-Preview */}
                  <div className="mb-4 transform group-hover:scale-[1.01] transition-transform">
                    <NodeMiniPreview simulatorId={node.simulatorId} />
                  </div>

                  {/* Title & Mechanical Metaphor */}
                  <h2 className="text-lg md:text-xl font-bold text-white font-mono mb-2 group-hover:text-cyan-200 transition-colors">
                    {node.title[language]}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
                    {node.metaphor[language]}
                  </p>

                  {/* Golden Rule Preview Box */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 mb-4 font-mono text-xs text-slate-300">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 block mb-0.5">
                      🎯 {language === 'es' ? 'Heurística Base:' : 'Core Heuristic:'}
                    </span>
                    {node.anatomy.rule[language]}
                  </div>
                </div>

                {/* Footer with Cross-Pollination Links & CTA */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{language === 'es' ? 'Conectado con:' : 'Linked to:'}</span>
                    {node.connections.map((connId) => (
                      <span
                        key={connId}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                      >
                        {connId}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      backgroundColor: `rgba(${cat.rgb}, 0.18)`,
                      borderColor: cat.hex,
                      color: cat.hex,
                    }}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 group-hover:brightness-125 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === 'es' ? 'Entrar al Cockpit' : 'Launch Cockpit'}
                    </span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
