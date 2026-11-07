'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function AiSmartRouterSimulator() {
  const { language } = useAppStore();
  const [complexity, setComplexity] = useState(0.45); // 0.0 to 1.0
  const [requestVolume, setRequestVolume] = useState(250000); // requests / day
  const [forceReasoning, setForceReasoning] = useState(false);

  const decision = useMemo(() => {
    const effectiveComplexity = forceReasoning ? Math.max(0.85, complexity) : complexity;

    if (effectiveComplexity < 0.35) {
      return {
        modelTier: 'EDGE_MICRO (Gemini Flash-Lite)',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        costPer1M: 0.075,
        latencyMs: 140,
        baselineDailyCost: (requestVolume * 800 / 1000000) * 5.0, // if all went to frontier ($5/1M)
        routedDailyCost: (requestVolume * 800 / 1000000) * 0.075,
      };
    } else if (effectiveComplexity <= 0.72) {
      return {
        modelTier: 'BALANCED_MID (Gemini Flash)',
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        costPer1M: 0.50,
        latencyMs: 520,
        baselineDailyCost: (requestVolume * 800 / 1000000) * 5.0,
        routedDailyCost: (requestVolume * 800 / 1000000) * 0.50,
      };
    } else {
      return {
        modelTier: 'FRONTIER_REASONING (Gemini Pro/Claude Opus)',
        color: 'text-violet-300',
        borderColor: 'border-violet-500/40',
        costPer1M: 5.00,
        latencyMs: 2100,
        baselineDailyCost: (requestVolume * 800 / 1000000) * 5.0,
        routedDailyCost: (requestVolume * 800 / 1000000) * 5.0,
      };
    }
  }, [complexity, requestVolume, forceReasoning]);

  const savingsPercent = Math.max(0, Math.round(((decision.baselineDailyCost - decision.routedDailyCost) / decision.baselineDailyCost) * 100));

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl bg-[#090B14]/80 border border-white/10 backdrop-blur-md">
      {/* Visual Dynamic Triage Canvas */}
      <div className={`relative h-48 w-full rounded-lg bg-[#05060B] border ${decision.borderColor} overflow-hidden flex flex-col justify-between p-3`}>
        <div className="flex items-center justify-between text-xs font-mono text-purple-400/90">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            SEMANTIC INFERENCE ROUTER // VECTOR GATEWAY
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-[10px]">
            SAVINGS: -{savingsPercent}%
          </span>
        </div>

        {/* Dynamic Route Visualization */}
        <div className="relative w-full h-24 flex items-center justify-between px-3">
          {/* Incoming query */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-12 rounded border border-purple-500/40 bg-purple-950/20 flex flex-col items-center justify-center text-[10px] font-mono text-purple-300">
              <span>PROMPT</span>
              <span className="text-[9px] text-slate-400">Scores: {complexity.toFixed(2)}</span>
            </div>
          </div>

          {/* Router Decision Gateway */}
          <div className="flex-1 mx-2 flex flex-col items-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 via-violet-400 to-indigo-500 relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(155,93,229,0.9)]" />
            </div>
            <span className="text-[10px] font-mono text-purple-300 mt-1">
              LATENCY: {decision.latencyMs}ms
            </span>
          </div>

          {/* Target Model Bucket */}
          <div className="flex flex-col items-center">
            <div className={`w-28 h-12 rounded border ${decision.borderColor} bg-slate-900/60 flex flex-col items-center justify-center text-[10px] font-mono ${decision.color} px-1 text-center`}>
              <span className="font-bold text-[9px]">{decision.modelTier.split(' ')[0]}</span>
              <span className="text-[8px] opacity-75">${decision.costPer1M}/1M tok</span>
            </div>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Costo Diario' : 'Daily Spend'}
            </span>
            <span className="text-emerald-400 font-semibold">${decision.routedDailyCost.toFixed(1)}/día</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Ahorro vs Monolito' : 'Baseline Saved'}
            </span>
            <span className="text-purple-300 font-semibold">{savingsPercent}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Destino Activo' : 'Target Route'}
            </span>
            <span className={decision.color + ' font-semibold truncate text-[10px]'}>
              {decision.modelTier.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Sliders and Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Complejidad Estimada del Prompt' : 'Estimated Prompt Complexity'}
            </span>
            <span className="text-purple-400 font-bold">{complexity.toFixed(2)} / 1.00</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.05"
            disabled={forceReasoning}
            value={complexity}
            onChange={(e) => setComplexity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-30"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Volumen de Consultas Diarias' : 'Daily Query Volume'}
            </span>
            <span className="text-purple-400 font-bold">{(requestVolume / 1000).toFixed(0)}k req/día</span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="25000"
            value={requestVolume}
            onChange={(e) => setRequestVolume(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="pt-1">
          <button
            onClick={() => setForceReasoning(!forceReasoning)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              forceReasoning
                ? 'bg-purple-600/30 border border-purple-400 text-purple-200'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <span>🧠</span>
            {forceReasoning
              ? (language === 'es' ? 'DESACTIVAR OVERRIDE DE RAZONAMIENTO PROFUNDO' : 'DISABLE DEEP REASONING OVERRIDE')
              : (language === 'es' ? 'FORZAR CADENA DE RAZONAMIENTO FRONTIER' : 'FORCE FRONTIER REASONING CHAIN')}
          </button>
        </div>
      </div>
    </div>
  );
}

