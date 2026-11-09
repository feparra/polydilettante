'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface QueryParticle {
  id: number;
  progress: number;
  score: number;
  lane: 'LOCAL' | 'FLASH' | 'FRONTIER';
}

export default function AiSmartRouterSimulator() {
  const { language } = useAppStore();
  const [avgComplexity, setAvgComplexity] = useState(0.42);
  const [routerThreshold, setRouterThreshold] = useState(0.68);
  const [requestsPerMin, setRequestsPerMin] = useState(450);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let animId: number;
    const step = () => {
      setTick((t) => (t + 1) % 10000);
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  const routingStats = useMemo(() => {
    const localCutoff = Math.max(0.15, routerThreshold * 0.48);
    const count = Math.min(20, Math.max(8, Math.round(requestsPerMin / 50)));
    let localCount = 0;
    let flashCount = 0;
    let frontierCount = 0;

    const particles: QueryParticle[] = Array.from({ length: count }).map((_, i) => {
      const spread = ((i % 7) - 3) * 0.11;
      const score = Math.min(0.99, Math.max(0.05, avgComplexity + spread));
      let lane: 'LOCAL' | 'FLASH' | 'FRONTIER' = 'FLASH';

      if (score < localCutoff) {
        lane = 'LOCAL';
        localCount++;
      } else if (score < routerThreshold) {
        lane = 'FLASH';
        flashCount++;
      } else {
        lane = 'FRONTIER';
        frontierCount++;
      }

      const speedMult = lane === 'LOCAL' ? 1.25 : lane === 'FLASH' ? 0.95 : 0.65;
      const progress = ((tick * 0.007 * speedMult + i / count) % 1);

      return { id: i, progress, score, lane };
    });

    const localPct = Math.round((localCount / count) * 100);
    const flashPct = Math.round((flashCount / count) * 100);
    const frontierPct = Math.max(0, 100 - localPct - flashPct);

    const dailyMillionTokens = (requestsPerMin * 1440 * 900) / 1_000_000;
    const unroutedDailyCost = dailyMillionTokens * 5.0;
    const routedDailyCost =
      dailyMillionTokens *
      ((localPct / 100) * 0.0 + (flashPct / 100) * 0.45 + (frontierPct / 100) * 5.0);

    const savingsPct = Math.max(
      0,
      Math.round(((unroutedDailyCost - routedDailyCost) / Math.max(1, unroutedDailyCost)) * 100)
    );
    const avgLatencyMs = Math.round(
      (localPct / 100) * 85 + (flashPct / 100) * 460 + (frontierPct / 100) * 1950
    );

    return {
      particles,
      localPct,
      flashPct,
      frontierPct,
      unroutedDailyCost,
      routedDailyCost,
      savingsPct,
      avgLatencyMs,
    };
  }, [avgComplexity, routerThreshold, requestsPerMin, tick]);

  const getParticleCoords = (p: QueryParticle) => {
    if (p.progress <= 0.4) {
      const t = p.progress / 0.4;
      return { x: 25 + t * 225, y: 105 };
    }
    const t = (p.progress - 0.4) / 0.6;
    const x = 250 + t * 380;
    const ease = t * t * (3 - 2 * t);
    if (p.lane === 'LOCAL') return { x, y: 105 - ease * 68 };
    if (p.lane === 'FLASH') return { x, y: 105 };
    return { x, y: 105 + ease * 68 };
  };

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-3.5 rounded-lg bg-[#0E1118] border border-[#1E2533] font-mono">
      {/* Precision Classifier Header */}
      <div className="flex items-center justify-between border-b border-[#1A202C] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-purple-500" />
          <span className="text-white font-bold tracking-wider">
            ROUTER-GATE // SEMANTIC VECTOR CLASSIFIER
          </span>
          <span className="text-slate-500 text-[10px]">
            [THROUGHPUT: {requestsPerMin} REQ/MIN]
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            SAVINGS: <strong className="text-emerald-400">-{routingStats.savingsPct}%</strong>
          </span>
          <span className="text-slate-400">
            AVG LATENCY: <strong className="text-slate-200">{routingStats.avgLatencyMs} ms</strong>
          </span>
        </div>
      </div>

      {/* Main Vector Particle Screen */}
      <div className="relative flex-1 min-h-[260px] w-full rounded bg-[#07090D] border border-[#1A202C] p-3 flex flex-col justify-between">
        <div className="relative flex-1 w-full flex items-center my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 680 210" preserveAspectRatio="none">
            {/* Trunk Bus */}
            <line x1="25" y1="105" x2="250" y2="105" stroke="#252D3D" strokeWidth="2" />

            {/* 3 Technical Bus Routing Lanes */}
            <path d="M 250,105 C 360,105 410,37 630,37" fill="none" stroke="#1A2D2A" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 250,105 L 630,105" fill="none" stroke="#1B2945" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 250,105 C 360,105 410,173 630,173" fill="none" stroke="#371B33" strokeWidth="2" strokeDasharray="4 4" />

            {/* Routing Particles (Minimalist Precision Beacons) */}
            {routingStats.particles.map((p) => {
              const { x, y } = getParticleCoords(p);
              const isEntered = p.progress > 0.4;
              const color = !isEntered
                ? '#A855F7'
                : p.lane === 'LOCAL'
                ? '#10B981'
                : p.lane === 'FLASH'
                ? '#3B82F6'
                : '#EC4899';

              return (
                <circle
                  key={p.id}
                  cx={x}
                  cy={y}
                  r={isEntered && p.lane === 'FRONTIER' ? 4 : 3}
                  fill={color}
                />
              );
            })}

            {/* Central Decision Prism */}
            <g transform="translate(250, 105)">
              <polygon points="0,-28 26,0 0,28 -26,0" fill="#0C0E16" stroke="#8B5CF6" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontFamily="monospace">
                GATE
              </text>
            </g>

            {/* Right Model Tier Destinations */}
            <g transform="translate(490, 16)">
              <rect x="0" y="0" width="170" height="38" rx="2" fill="#081412" stroke="#10B981" strokeWidth="1" />
              <text x="8" y="15" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                1. LOCAL OLLAMA ({routingStats.localPct}%)
              </text>
              <text x="8" y="28" fill="#64748B" fontSize="8" fontFamily="monospace">
                $0.00 / 1M • &lt;90ms
              </text>
            </g>

            <g transform="translate(490, 85)">
              <rect x="0" y="0" width="170" height="38" rx="2" fill="#0A111F" stroke="#3B82F6" strokeWidth="1" />
              <text x="8" y="15" fill="#3B82F6" fontSize="9" fontFamily="monospace" fontWeight="bold">
                2. FLASH MID ({routingStats.flashPct}%)
              </text>
              <text x="8" y="28" fill="#64748B" fontSize="8" fontFamily="monospace">
                $0.45 / 1M • ~460ms
              </text>
            </g>

            <g transform="translate(490, 153)">
              <rect x="0" y="0" width="170" height="38" rx="2" fill="#1A0D18" stroke="#EC4899" strokeWidth="1" />
              <text x="8" y="15" fill="#EC4899" fontSize="9" fontFamily="monospace" fontWeight="bold">
                3. FRONTIER REASON ({routingStats.frontierPct}%)
              </text>
              <text x="8" y="28" fill="#64748B" fontSize="8" fontFamily="monospace">
                $5.00 / 1M • ~1950ms
              </text>
            </g>
          </svg>
        </div>

        {/* Cost Comparison Readout */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#161C26] text-[10px]">
          <div>
            <div className="flex justify-between mb-1 text-slate-500">
              <span>UNROUTED (100% FRONTIER):</span>
              <span className="text-slate-300 font-bold">${routingStats.unroutedDailyCost.toFixed(0)}/day</span>
            </div>
            <div className="w-full h-1 rounded bg-[#161B26]">
              <div className="w-full h-full bg-slate-500" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-slate-500">
              <span>SMART ROUTER DISPATCH:</span>
              <span className="text-emerald-400 font-bold">${routingStats.routedDailyCost.toFixed(0)}/day (-{routingStats.savingsPct}%)</span>
            </div>
            <div className="w-full h-1 rounded bg-[#161B26]">
              <div
                style={{
                  width: `${Math.max(
                    4,
                    (routingStats.routedDailyCost / Math.max(1, routingStats.unroutedDailyCost)) * 100
                  )}%`,
                }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded bg-[#090C12] border border-[#1A202C]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">1. Complejidad Media (Perplexity)</span>
            <span className="text-purple-400 font-bold">{avgComplexity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={avgComplexity}
            onChange={(e) => setAvgComplexity(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">2. Umbral de Desvío (τ)</span>
            <span className="text-cyan-400 font-bold">{routerThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={routerThreshold}
            onChange={(e) => setRouterThreshold(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">3. Volumen (Req/min)</span>
            <span className="text-emerald-400 font-bold">{requestsPerMin} RPM</span>
          </div>
          <input
            type="range"
            min="90"
            max="1200"
            step="45"
            value={requestsPerMin}
            onChange={(e) => setRequestsPerMin(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
