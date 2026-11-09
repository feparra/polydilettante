'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface GenericAdaptiveSimulatorProps {
  title?: string;
}

export default function GenericAdaptiveSimulator({ title }: GenericAdaptiveSimulatorProps) {
  const { language } = useAppStore();
  const [gain, setGain] = useState(1.8);
  const [frequency, setFrequency] = useState(3.5);
  const [damping, setDamping] = useState(0.65);

  const metrics = useMemo(() => {
    const naturalFreq = frequency * 2.2;
    const qFactor = (naturalFreq / (2 * Math.max(0.05, damping * 5))).toFixed(2);
    const steadyStateEfficiency = Math.min(99.4, Math.max(12, 100 - damping * 28 + gain * 6)).toFixed(1);

    return {
      naturalFreq: naturalFreq.toFixed(1),
      qFactor,
      steadyStateEfficiency,
    };
  }, [gain, frequency, damping]);

  const wavePoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 400; x += 10) {
      const t = (x / 400) * Math.PI * 4;
      const decay = Math.exp((-damping * x) / 220);
      const y = 100 - Math.sin(t * frequency * 0.4) * (gain * 26) * decay;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [gain, frequency, damping]);

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-3.5 rounded-lg bg-[#0E1118] border border-[#1E2533] font-mono">
      <div className="flex items-center justify-between border-b border-[#1A202C] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-cyan-500" />
          <span className="text-white font-bold tracking-wider">
            HARMONIC-RESPONSE // {title || 'STATE RESONANCE'}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Q_FACTOR: <strong className="text-cyan-400">{metrics.qFactor}</strong>
        </div>
      </div>

      <div className="relative flex-1 min-h-[260px] w-full rounded bg-[#07090D] border border-[#1A202C] p-3 flex flex-col justify-between">
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
            <line x1="0" y1="100" x2="400" y2="100" stroke="#161B26" strokeDasharray="3 3" />
            <path d={wavePoints} fill="none" stroke="#06B6D4" strokeWidth="2" />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#161C26] text-[10px] text-slate-400">
          <div>
            <span className="text-slate-500 block uppercase">FRECUENCIA NATURAL</span>
            <span className="text-slate-200 font-bold">{metrics.naturalFreq} rad/s</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">FACTOR DE CALIDAD</span>
            <span className="text-cyan-400 font-bold">{metrics.qFactor}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">EFICIENCIA ESTACIONARIA</span>
            <span className="text-emerald-400 font-bold">{metrics.steadyStateEfficiency}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded bg-[#090C12] border border-[#1A202C]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">1. Ganancia (K)</span>
            <span className="text-cyan-400 font-bold">{gain.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.5"
            step="0.1"
            value={gain}
            onChange={(e) => setGain(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">2. Frecuencia (ω)</span>
            <span className="text-cyan-400 font-bold">{frequency.toFixed(1)} Hz</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">3. Amortiguamiento (ζ)</span>
            <span className="text-emerald-400 font-bold">{damping.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
