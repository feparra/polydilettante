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
  const [isActive, setIsActive] = useState(true);

  // Compute dynamic harmonic wave and system resonance
  const metrics = useMemo(() => {
    const naturalFreq = frequency * 2.2;
    const qFactor = (naturalFreq / (2 * Math.max(0.05, damping * 5))).toFixed(2);
    const steadyStateEfficiency = Math.min(99.4, Math.max(12, 100 - damping * 28 + gain * 6)).toFixed(1);
    const resonanceAlert = Number(qFactor) > 4.5;

    return {
      naturalFreq: naturalFreq.toFixed(1),
      qFactor,
      steadyStateEfficiency,
      resonanceAlert,
    };
  }, [gain, frequency, damping]);

  // Compute SVG reactive harmonic curve (40 points)
  const wavePoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 400; x += 10) {
      const t = (x / 400) * Math.PI * 4;
      const decay = Math.exp((-damping * x) / 220);
      const y = isActive
        ? 100 - Math.sin(t * frequency * 0.4) * (gain * 26) * decay
        : 100;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [gain, frequency, damping, isActive]);

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-[#070A14] border border-cyan-500/25">
      {/* Visual Dynamic Oscilloscope & Phase Space */}
      <div className="relative flex-1 min-h-[250px] w-full rounded-xl bg-[#04060C] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            ADAPTIVE KINETIC LAB // {title || 'SYSTEM RESONANCE & WAVE EQUATION'}
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
              metrics.resonanceAlert
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
            }`}
          >
            {metrics.resonanceAlert ? '⚠️ ALTA RESONANCIA (Q > 4.5)' : '✓ RÉGIMEN ESTABLE'}
          </span>
        </div>

        {/* Dynamic Harmonic Waveform SVG */}
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Center Equilibrium Line */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

            {/* Upper / Lower Damping Envelope */}
            <path
              d={Array.from({ length: 41 })
                .map((_, i) => {
                  const x = i * 10;
                  const env = Math.exp((-damping * x) / 220) * (gain * 26);
                  return `${i === 0 ? 'M' : 'L'} ${x},${(100 - env).toFixed(1)}`;
                })
                .join(' ')}
              fill="none"
              stroke="rgba(0, 245, 212, 0.25)"
              strokeDasharray="2 3"
            />
            <path
              d={Array.from({ length: 41 })
                .map((_, i) => {
                  const x = i * 10;
                  const env = Math.exp((-damping * x) / 220) * (gain * 26);
                  return `${i === 0 ? 'M' : 'L'} ${x},${(100 + env).toFixed(1)}`;
                })
                .join(' ')}
              fill="none"
              stroke="rgba(0, 245, 212, 0.25)"
              strokeDasharray="2 3"
            />

            {/* Reactive Wave Curve */}
            <path
              d={wavePoints}
              fill="none"
              stroke="#00F5D4"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,245,212,0.6))' }}
            />

            {/* Probe Cursor */}
            {isActive && (
              <circle cx="280" cy={100 - Math.sin((280 / 400) * Math.PI * 4 * frequency * 0.4) * (gain * 26) * Math.exp((-damping * 280) / 220)} r="5" fill="#00F5D4" className="animate-ping" />
            )}
          </svg>
        </div>

        {/* Live Telemetry Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Frecuencia Natural' : 'Natural Frequency'}
            </span>
            <span className="text-cyan-300 font-bold">{metrics.naturalFreq} rad/s</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Factor de Calidad Q' : 'Q-Factor'}
            </span>
            <span className="text-amber-300 font-bold">{metrics.qFactor}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Eficiencia Régimen' : 'System Efficiency'}
            </span>
            <span className="text-emerald-400 font-bold">{metrics.steadyStateEfficiency}%</span>
          </div>
        </div>
      </div>

      {/* Tactile Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F1F]/90 border border-white/10">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? '1. Ganancia / Amplitud (K)' : '1. System Gain (K)'}
            </span>
            <span className="text-cyan-400 font-bold">{gain.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.5"
            step="0.1"
            value={gain}
            onChange={(e) => setGain(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es' ? 'Escala la magnitud del fenómeno' : 'Scales physical amplitude'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? '2. Frecuencia / Tasa (ω)' : '2. Frequency (ω)'}
            </span>
            <span className="text-cyan-400 font-bold">{frequency.toFixed(1)} Hz</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.5"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es' ? 'Velocidad de oscilación / ciclo' : 'Cycle oscillation rate'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? '3. Amortiguamiento (ζ)' : '3. Damping Ratio (ζ)'}
            </span>
            <span className="text-emerald-400 font-bold">{damping.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={damping}
            onChange={(e) => setDamping(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es' ? 'Disipación de energía del sistema' : 'Energy dissipation factor'}
          </span>
        </div>
      </div>
    </div>
  );
}

