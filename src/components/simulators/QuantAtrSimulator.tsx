'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function QuantAtrSimulator() {
  const { language } = useAppStore();
  const [atrMultiplier, setAtrMultiplier] = useState(1.5);
  const [tapeVelocity, setTapeVelocity] = useState(85);
  const [riskReward, setRiskReward] = useState(2.0);

  // Generate synthetic price points with dynamic volatility
  const metrics = useMemo(() => {
    const baseWinRate = 42;
    const velocityBonus = Math.min(25, (tapeVelocity - 40) * 0.28);
    const multiplierPenalty = (atrMultiplier - 1.2) * 6;
    const winRate = Math.max(30, Math.min(78, baseWinRate + velocityBonus - multiplierPenalty));
    const noiseFilteredPercent = Math.min(94, Math.max(35, (atrMultiplier / 3.0) * 85 + (tapeVelocity / 200) * 15));
    const expectedValue = (winRate / 100) * riskReward - ((100 - winRate) / 100) * 1.0;

    return {
      winRate: winRate.toFixed(1),
      noiseFilteredPercent: noiseFilteredPercent.toFixed(1),
      expectedValue: expectedValue.toFixed(2),
      status: expectedValue > 0.4 ? 'POSITIVE_EDGE' : expectedValue > 0 ? 'MARGINAL' : 'NEGATIVE_DRIFT',
    };
  }, [atrMultiplier, tapeVelocity, riskReward]);

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl bg-[#090B14]/80 border border-white/10 backdrop-blur-md">
      {/* Visual Canvas / Graph preview */}
      <div className="relative h-48 w-full rounded-lg bg-[#05060B] border border-cyan-500/20 overflow-hidden flex flex-col justify-between p-3">
        {/* Synthetic market tape simulation */}
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SYNTHETIC NQ_FUTURES // 100ms TICK
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px]">
            EV: +{metrics.expectedValue}R
          </span>
        </div>

        {/* Dynamic SVG Candlestick / Bands visualization */}
        <div className="relative w-full h-28 flex items-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Volatility Channel (Upper/Lower Band based on atrMultiplier) */}
            <path
              d={`M 0,${50 - atrMultiplier * 12} Q 100,${45 - atrMultiplier * 10} 200,${55 - atrMultiplier * 14} T 400,${40 - atrMultiplier * 12} L 400,${50 + atrMultiplier * 12} Q 300,${55 + atrMultiplier * 14} 200,${45 + atrMultiplier * 10} T 0,${50 + atrMultiplier * 12} Z`}
              fill="url(#cyanArea)"
              stroke="rgba(0, 245, 212, 0.3)"
              strokeDasharray="4 4"
            />
            {/* Price Line */}
            <path
              d="M 0,55 Q 60,30 120,62 T 240,35 T 320,70 T 400,25"
              fill="none"
              stroke="#00F5D4"
              strokeWidth="2.5"
            />
            {/* Breakout Signal Marker */}
            <circle cx="370" cy="28" r="5" fill="#00F5D4" className="animate-pulse" />
            <text x="360" y="16" fill="#00F5D4" fontSize="10" fontFamily="monospace" fontWeight="bold">
              LONG [ATR EXPANSION]
            </text>
          </svg>
        </div>

        {/* Live Telemetry Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Filtro Ruido' : 'Noise Filtered'}
            </span>
            <span className="text-cyan-300 font-semibold">{metrics.noiseFilteredPercent}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Win Rate Est.' : 'Est. Win Rate'}
            </span>
            <span className="text-emerald-400 font-semibold">{metrics.winRate}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Régimen' : 'Regime'}
            </span>
            <span className="text-cyan-300 font-semibold">{metrics.status}</span>
          </div>
        </div>
      </div>

      {/* Sliders and Interactive Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Multiplicador Umbral ATR' : 'ATR Threshold Multiplier'}
            </span>
            <span className="text-cyan-400 font-bold">{atrMultiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={atrMultiplier}
            onChange={(e) => setAtrMultiplier(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Velocidad de Cinta (Ticks/sec)' : 'Tape Velocity (Ticks/sec)'}
            </span>
            <span className="text-cyan-400 font-bold">{tapeVelocity} tps</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={tapeVelocity}
            onChange={(e) => setTapeVelocity(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Ratio Riesgo / Beneficio (R:R)' : 'Risk / Reward Ratio (R:R)'}
            </span>
            <span className="text-cyan-400 font-bold">1:{riskReward.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.2"
            value={riskReward}
            onChange={(e) => setRiskReward(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

