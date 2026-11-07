'use client';

import React from 'react';

interface NodeMiniPreviewProps {
  simulatorId: string;
}

export default function NodeMiniPreview({ simulatorId }: NodeMiniPreviewProps) {
  switch (simulatorId) {
    case 'quant-atr-velocity':
      return (
        <div className="relative w-full h-24 rounded-xl bg-[#04060E] border border-cyan-500/20 overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1.5 left-2 flex items-center gap-1 text-[9px] font-mono text-cyan-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>ATR BANDS // NQ_TAPE</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 70">
            <defs>
              <linearGradient id="miniQuantGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Volatility Envelope */}
            <path
              d="M 0,25 Q 60,22 120,28 T 240,14 L 240,56 Q 180,60 120,52 T 0,55 Z"
              fill="url(#miniQuantGrad)"
            />
            <path
              d="M 0,25 Q 60,22 120,28 T 240,14"
              fill="none"
              stroke="#00F5D4"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="animate-pulse"
            />
            {/* Synthetic mini candles */}
            {[20, 42, 64, 86, 108, 130, 152, 174, 196, 218].map((x, idx) => {
              const isBreakout = idx >= 7;
              const top = isBreakout ? 28 - (idx - 6) * 6 : 34 + (idx % 3) * 4;
              const height = isBreakout ? 14 : 8;
              return (
                <g key={x}>
                  <line
                    x1={x}
                    y1={top - 4}
                    x2={x}
                    y2={top + height + 4}
                    stroke={isBreakout ? '#00F5D4' : '#475569'}
                    strokeWidth="1"
                  />
                  <rect
                    x={x - 3}
                    y={top}
                    width="6"
                    height={height}
                    rx="1"
                    fill={isBreakout ? '#00F5D4' : '#334155'}
                  />
                </g>
              );
            })}
            {/* Breakout Signal Pulse */}
            <circle cx="218" cy="14" r="4" fill="#00F5D4" className="animate-ping" />
            <circle cx="218" cy="14" r="3" fill="#00F5D4" />
          </svg>
        </div>
      );

    case 'plc-current-loop':
      return (
        <div className="relative w-full h-24 rounded-xl bg-[#04060E] border border-amber-500/20 overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1.5 left-2 flex items-center gap-1 text-[9px] font-mono text-amber-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>4-20mA LIVE-ZERO LOOP</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 70">
            {/* Loop Circuit Path */}
            <rect
              x="24"
              y="24"
              width="192"
              height="32"
              rx="8"
              fill="none"
              stroke="rgba(255, 107, 53, 0.25)"
              strokeWidth="2"
            />
            <rect
              x="24"
              y="24"
              width="192"
              height="32"
              rx="8"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2"
              strokeDasharray="6 10"
              className="animate-dash-flow"
            />
            {/* Transmitter & PLC Nodes */}
            <rect x="14" y="28" width="28" height="24" rx="4" fill="#18121E" stroke="#FF6B35" strokeWidth="1.5" />
            <text x="28" y="43" textAnchor="middle" fill="#FF6B35" fontSize="8" fontFamily="monospace" fontWeight="bold">
              TX
            </text>
            <rect x="198" y="28" width="28" height="24" rx="4" fill="#18121E" stroke="#00F5D4" strokeWidth="1.5" />
            <text x="212" y="43" textAnchor="middle" fill="#00F5D4" fontSize="8" fontFamily="monospace" fontWeight="bold">
              PLC
            </text>
            {/* Moving Electron Particles */}
            <circle r="3" fill="#FF6B35">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 42,24 L 198,24 L 198,56 L 42,56 Z" />
            </circle>
            <circle r="3" fill="#FF6B35">
              <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M 42,24 L 198,24 L 198,56 L 42,56 Z" />
            </circle>
          </svg>
        </div>
      );

    case 'cycloidal-drive-3d':
      return (
        <div className="relative w-full h-24 rounded-xl bg-[#04060E] border border-pink-500/20 overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1.5 left-2 flex items-center gap-1 text-[9px] font-mono text-pink-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            <span>EPITROCHOID // 0-BACKLASH</span>
          </div>
          <svg className="w-20 h-20 overflow-visible ml-16" viewBox="-45 -45 90 90">
            {/* Outer Ring Pins */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 2 * Math.PI) / 12;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 34}
                  cy={Math.sin(a) * 34}
                  r="2.5"
                  fill="#F72585"
                  fillOpacity="0.6"
                />
              );
            })}
            {/* Rotating Cycloidal Rotor */}
            <g className="animate-spin" style={{ animationDuration: '5s' }}>
              <circle
                cx="2"
                cy="0"
                r="26"
                fill="rgba(247, 37, 133, 0.15)"
                stroke="#F72585"
                strokeWidth="2"
                strokeDasharray="5 2.5"
              />
              <circle cx="2" cy="0" r="14" fill="none" stroke="#00F5D4" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="2" cy="0" r="4.5" fill="#F72585" />
            </g>
          </svg>
        </div>
      );

    case 'ai-smart-router':
    default:
      return (
        <div className="relative w-full h-24 rounded-xl bg-[#04060E] border border-purple-500/20 overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1.5 left-2 flex items-center gap-1 text-[9px] font-mono text-purple-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            <span>NEURAL GATE // CASCADE</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 70">
            {/* Input Line */}
            <path d="M 15,40 L 105,40" stroke="#9B5DE5" strokeWidth="2" />
            {/* 3 Curved Output Lanes */}
            <path id="laneFast" d="M 105,40 Q 150,18 220,18" fill="none" stroke="#00F5D4" strokeWidth="1.5" strokeOpacity="0.6" />
            <path id="laneMid" d="M 105,40 L 220,40" fill="none" stroke="#3A86FF" strokeWidth="1.5" strokeOpacity="0.6" />
            <path id="laneDeep" d="M 105,40 Q 150,62 220,62" fill="none" stroke="#F72585" strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Central Router Prism */}
            <polygon points="105,28 119,40 105,52 91,40" fill="#19102C" stroke="#9B5DE5" strokeWidth="2" />

            {/* Animated Particles Bifurcating */}
            <circle r="3" fill="#00F5D4">
              <animateMotion dur="1.4s" repeatCount="indefinite" path="M 15,40 L 105,40 Q 150,18 220,18" />
            </circle>
            <circle r="3" fill="#3A86FF">
              <animateMotion dur="1.9s" begin="0.5s" repeatCount="indefinite" path="M 15,40 L 105,40 L 220,40" />
            </circle>
            <circle r="3.5" fill="#F72585">
              <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path="M 15,40 L 105,40 Q 150,62 220,62" />
            </circle>
          </svg>
        </div>
      );
  }
}

