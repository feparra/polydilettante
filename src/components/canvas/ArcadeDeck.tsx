'use client';

import React from 'react';
import { CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';
import NodeMiniPreview from './NodeMiniPreview';
import { ArrowUpRight, GitBranch } from 'lucide-react';

export default function ArcadeDeck() {
  const { nodes: appNodes, language, selectedCategory, setActiveNodeId } = useAppStore();

  const filteredNodes = appNodes.filter(
    (n) => selectedCategory === 'all' || n.category === selectedCategory
  );

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-[#0B0D11] lab-grid-bg pt-20 pb-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Technical Sub-Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#1E232E] pb-4 font-mono">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-sm bg-cyan-500" />
              <span>INDEX: CROSS-DISCIPLINARY SYSTEMS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {language === 'es' ? 'Banco de Trabajo & Sistemas Registrados' : 'Systems Engineering Registry'}
            </h1>
          </div>

          <span className="text-xs text-slate-500">
            {filteredNodes.length} {language === 'es' ? 'subsistemas activos' : 'active subsystems'}
          </span>
        </div>

        {/* Structured Technical Table / Card Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNodes.map((node) => {
            const cat = CATEGORY_COLORS[node.category] || {
              hex: '#06B6D4',
              code: 'SYS',
              label: { es: 'Sistema', en: 'System' },
            };

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeId(node.id)}
                className="group relative rounded-lg bg-[#11141B] border border-[#1E232E] hover:border-[#333E54] p-4 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-xs font-mono mb-2 pb-1.5 border-b border-[#181D26]">
                    <div className="flex items-center gap-2">
                      <span style={{ color: cat.hex }} className="font-bold">
                        {cat.code}
                      </span>
                      <span className="text-slate-600">/</span>
                      <span className="text-slate-400 text-[11px] truncate">{node.id}</span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {cat.label[language]}
                    </span>
                  </div>

                  {/* Scientific Mini-Diagram */}
                  <div className="mb-3">
                    <NodeMiniPreview simulatorId={node.simulatorId} />
                  </div>

                  {/* Title & Metaphor */}
                  <h2 className="text-sm font-bold text-slate-100 font-mono mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {node.title[language]}
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {node.metaphor[language]}
                  </p>

                  {/* Formula / Golden Heuristic Box */}
                  <div className="p-2.5 rounded bg-[#090B0F] border border-[#1C222E] font-mono text-xs text-slate-300 mb-3">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">
                      {language === 'es' ? 'INVARIANTE / REGLA DE ORO:' : 'SYSTEM INVARIANT:'}
                    </span>
                    <span className="text-slate-200">{node.anatomy.rule[language]}</span>
                  </div>
                </div>

                {/* Footer with Cross-Links & Workbench Action */}
                <div className="pt-2.5 border-t border-[#181D26] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                    <span>{node.connections.length} {language === 'es' ? 'enlaces' : 'links'}</span>
                  </div>

                  <span className="flex items-center gap-1 text-slate-300 group-hover:text-cyan-400 font-semibold transition-colors">
                    <span>{language === 'es' ? 'Abrir Instrumento' : 'Open Instrument'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
