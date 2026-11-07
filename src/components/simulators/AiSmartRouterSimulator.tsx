'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface QueryParticle {
  id: number;
  progress: number; // 0 to 1 along the path
  score: number; // prompt complexity score 0..1
  lane: 'LOCAL' | 'FLASH' | 'FRONTIER';
}

export default function AiSmartRouterSimulator() {
  const { language } = useAppStore();
  const [avgComplexity, setAvgComplexity] = useState(0.42); // 0.1 to 0.95
  const [routerThreshold, setRouterThreshold] = useState(0.68); // Frontier cutoff threshold
  const [requestsPerMin, setRequestsPerMin] = useState(450); // 60 to 1200 req/min
  const [tick, setTick] = useState(0);

  // 60 FPS continuous particle stream clock
  useEffect(() => {
    let animId: number;
    const step = () => {
      setTick((t) => (t + 1) % 10000);
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute statistical distribution across the 3 lanes based on avgComplexity & routerThreshold
  const routingStats = useMemo(() => {
    const localCutoff = Math.max(0.15, routerThreshold * 0.48);

    // Deterministic 18-particle stream with varied complexity around avgComplexity
    const count = Math.min(24, Math.max(8, Math.round(requestsPerMin / 45)));
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

      // Speed depends on lane: LOCAL is super fast, FRONTIER is slower
      const speedMult = lane === 'LOCAL' ? 1.35 : lane === 'FLASH' ? 0.95 : 0.6;
      const progress = ((tick * 0.008 * speedMult + i / count) % 1);

      return { id: i, progress, score, lane };
    });

    const localPct = Math.round((localCount / count) * 100);
    const flashPct = Math.round((flashCount / count) * 100);
    const frontierPct = Math.max(0, 100 - localPct - flashPct);

    // Daily token volume calculation (requestsPerMin * 1440 mins * ~900 tokens)
    const dailyMillionTokens = (requestsPerMin * 1440 * 900) / 1_000_000;
    const unroutedDailyCost = dailyMillionTokens * 5.0; // $5.00 / 1M Frontier
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

  // Helper to compute (x, y) coordinates along the incoming line (progress 0..0.4) and 3 Bezier lanes (0.4..1.0)
  const getParticleCoords = (p: QueryParticle) => {
    if (p.progress <= 0.4) {
      const t = p.progress / 0.4;
      return { x: 25 + t * 225, y: 105 };
    }
    const t = (p.progress - 0.4) / 0.6;
    const x = 250 + t * 380;
    // Smooth S-curve vertical deflection after prism at x=250, y=105
    const ease = t * t * (3 - 2 * t);
    if (p.lane === 'LOCAL') {
      return { x, y: 105 - ease * 68 }; // Top lane y=37
    }
    if (p.lane === 'FLASH') {
      return { x, y: 105 }; // Center lane y=105
    }
    return { x, y: 105 + ease * 68 }; // Bottom lane y=173
  };

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-[#070A14] border border-purple-500/25">
      {/* TOP 65%: 60 FPS Neural Particle Classifier Stage */}
      <div className="relative flex-1 min-h-[250px] w-full rounded-xl bg-[#04060C] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
        {/* Top Overlay Status */}
        <div className="flex items-center justify-between text-xs font-mono z-10">
          <span className="flex items-center gap-1.5 text-purple-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            SEMANTIC PRISM GATE // {requestsPerMin} REQ/MIN
          </span>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
            SAVINGS: -{routingStats.savingsPct}% (${(
              routingStats.unroutedDailyCost - routingStats.routedDailyCost
            ).toFixed(0)}
            /day)
          </span>
        </div>

        {/* Main Animated SVG Particle Router */}
        <div className="relative flex-1 w-full flex items-center my-1">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 680 210"
            preserveAspectRatio="none"
          >
            {/* Incoming Trunk Conduit */}
            <line
              x1="25"
              y1="105"
              x2="250"
              y2="105"
              stroke="rgba(155, 93, 229, 0.35)"
              strokeWidth="4"
            />

            {/* 3 Outgoing Curved Bezier Lanes */}
            {/* Top Lane: Local Ollama / vLLM */}
            <path
              d="M 250,105 C 360,105 410,37 630,37"
              fill="none"
              stroke="rgba(16, 185, 129, 0.35)"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            {/* Middle Lane: Flash Cloud Mid-Tier */}
            <path
              d="M 250,105 L 630,105"
              fill="none"
              stroke="rgba(58, 134, 255, 0.35)"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            {/* Bottom Lane: Frontier Reasoning */}
            <path
              d="M 250,105 C 360,105 410,173 630,173"
              fill="none"
              stroke="rgba(247, 37, 133, 0.35)"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Live Deflecting Query Particles */}
            {routingStats.particles.map((p) => {
              const { x, y } = getParticleCoords(p);
              const isEntered = p.progress > 0.4;
              const color = !isEntered
                ? '#C084FC'
                : p.lane === 'LOCAL'
                ? '#10B981'
                : p.lane === 'FLASH'
                ? '#3A86FF'
                : '#F72585';
              const radius = !isEntered
                ? 4.5
                : p.lane === 'LOCAL'
                ? 4
                : p.lane === 'FLASH'
                ? 5
                : 6.5;

              return (
                <circle
                  key={p.id}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                />
              );
            })}

            {/* Central Semantic Classifier Prism ("Smart Router Gate") */}
            <g transform="translate(250, 105)">
              <polygon
                points="0,-34 32,0 0,34 -32,0"
                fill="#130D26"
                stroke="#9B5DE5"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 14px rgba(155,93,229,0.65))' }}
              />
              <text
                x="0"
                y="-3"
                textAnchor="middle"
                fill="#E9D5FF"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ROUTER
              </text>
              <text
                x="0"
                y="9"
                textAnchor="middle"
                fill="#00F5D4"
                fontSize="8"
                fontFamily="monospace"
              >
                τ={routerThreshold.toFixed(2)}
              </text>
            </g>

            {/* Right-Side Destination Model Tier Cards */}
            {/* Tier 1: Local Ollama / vLLM */}
            <g transform="translate(485, 14)">
              <rect
                x="0"
                y="0"
                width="180"
                height="44"
                rx="8"
                fill="#061A17"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              <text x="10" y="17" fill="#34D399" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                🟢 LOCAL OLLAMA / vLLM ({routingStats.localPct}%)
              </text>
              <text x="10" y="33" fill="#94A3B8" fontSize="8.5" fontFamily="monospace">
                $0.00/1M tok • &lt;90ms latency
              </text>
            </g>

            {/* Tier 2: Flash Cloud Mid-Tier */}
            <g transform="translate(485, 83)">
              <rect
                x="0"
                y="0"
                width="180"
                height="44"
                rx="8"
                fill="#08152C"
                stroke="#3A86FF"
                strokeWidth="1.5"
              />
              <text x="10" y="17" fill="#60A5FA" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                🔵 FLASH CLOUD MID ({routingStats.flashPct}%)
              </text>
              <text x="10" y="33" fill="#94A3B8" fontSize="8.5" fontFamily="monospace">
                $0.45/1M tok • 460ms latency
              </text>
            </g>

            {/* Tier 3: Frontier Reasoning */}
            <g transform="translate(485, 151)">
              <rect
                x="0"
                y="0"
                width="180"
                height="44"
                rx="8"
                fill="#24091D"
                stroke="#F72585"
                strokeWidth="1.5"
              />
              <text x="10" y="17" fill="#F472B6" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                🟣 FRONTIER PRO/OPUS ({routingStats.frontierPct}%)
              </text>
              <text x="10" y="33" fill="#94A3B8" fontSize="8.5" fontFamily="monospace">
                $5.00/1M tok • 1950ms reasoning
              </text>
            </g>
          </svg>
        </div>

        {/* Live Cost Bar Comparator: Baseline 100% Frontier vs. Smart Router */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 font-mono text-[11px]">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-400">
                {language === 'es' ? 'Sin Router (100% Frontier):' : 'No Router (100% Frontier):'}
              </span>
              <span className="text-rose-400 font-bold">
                ${routingStats.unroutedDailyCost.toFixed(0)} / día
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full w-full bg-rose-500/80" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-300">
                {language === 'es' ? 'Con Smart Router Activo:' : 'With Smart Router Active:'}
              </span>
              <span className="text-emerald-400 font-bold">
                ${routingStats.routedDailyCost.toFixed(0)} / día ({routingStats.avgLatencyMs}ms avg)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                style={{
                  width: `${Math.max(
                    4,
                    (routingStats.routedDailyCost / Math.max(1, routingStats.unroutedDailyCost)) *
                      100
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM 35%: Tactile Sliders Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F1F]/90 border border-white/10">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '1. Complejidad Semántica' : '1. Semantic Complexity'}
            </span>
            <span className="text-purple-400 font-bold">{avgComplexity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={avgComplexity}
            onChange={(e) => setAvgComplexity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Entropía media de los prompts entrantes'
              : 'Mean perplexity of incoming prompts'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '2. Umbral del Router (τ)' : '2. Router Gate Threshold (τ)'}
            </span>
            <span className="text-cyan-300 font-bold">{routerThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={routerThreshold}
            onChange={(e) => setRouterThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Desvía partículas entre Local, Flash y Frontier'
              : 'Deflects particles across Local, Flash & Pro'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '3. Tráfico (Req/min)' : '3. Traffic (Req/min)'}
            </span>
            <span className="text-emerald-400 font-bold">{requestsPerMin} rpm</span>
          </div>
          <input
            type="range"
            min="90"
            max="1200"
            step="45"
            value={requestsPerMin}
            onChange={(e) => setRequestsPerMin(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Aumenta la densidad de esferas en vuelo'
              : 'Increases live query packet density'}
          </span>
        </div>
      </div>
    </div>
  );
}
