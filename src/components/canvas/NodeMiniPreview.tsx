'use client';

import React from 'react';

interface NodeMiniPreviewProps {
  simulatorId: string;
}

export default function NodeMiniPreview({ simulatorId }: NodeMiniPreviewProps) {
  switch (simulatorId) {
    case 'quant-atr-velocity':
      return (
        <div className="relative w-full h-20 rounded bg-[#0A0D13] border border-[#1C2331] overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
            <span>ATR(14) VOLATILITY CHANNEL</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60">
            {/* Clean Grid Lines */}
            <line x1="0" y1="20" x2="240" y2="20" stroke="#161B26" strokeDasharray="2 3" />
            <line x1="0" y1="40" x2="240" y2="40" stroke="#161B26" strokeDasharray="2 3" />

            {/* Threshold Bands */}
            <path d="M 0,18 Q 70,16 130,22 T 240,12" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 0,42 Q 70,44 130,38 T 240,48" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />

            {/* Price Trace */}
            <polyline
              fill="none"
              stroke="#E1E7F0"
              strokeWidth="1.5"
              points="10,34 35,32 60,38 85,26 110,35 135,28 160,33 185,14 210,10 235,8"
            />
            {/* Breakout Flag */}
            <circle cx="185" cy="14" r="3" fill="#06B6D4" />
          </svg>
        </div>
      );

    case 'plc-current-loop':
      return (
        <div className="relative w-full h-20 rounded bg-[#0A0D13] border border-[#1C2331] overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-mono text-amber-400">
            <span className="w-1.5 h-1.5 rounded-sm bg-amber-400" />
            <span>4-20mA CURRENT TRANSIENT</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60">
            {/* Industrial Wire Loop */}
            <rect x="25" y="18" width="190" height="28" rx="2" fill="none" stroke="#252E3E" strokeWidth="1.5" />
            <rect x="25" y="18" width="190" height="28" rx="2" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 8" />

            {/* Transmitter Terminal */}
            <rect x="18" y="24" width="22" height="16" fill="#131822" stroke="#F59E0B" strokeWidth="1" />
            <text x="29" y="35" textAnchor="middle" fill="#F59E0B" fontSize="7" fontFamily="monospace">TX</text>

            {/* PLC Receiver Terminal */}
            <rect x="200" y="24" width="24" height="16" fill="#131822" stroke="#64748B" strokeWidth="1" />
            <text x="212" y="35" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">250Ω</text>
          </svg>
        </div>
      );

    case 'cycloidal-drive-3d':
      return (
        <div className="relative w-full h-20 rounded bg-[#0A0D13] border border-[#1C2331] overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-mono text-pink-400">
            <span className="w-1.5 h-1.5 rounded-sm bg-pink-400" />
            <span>EPITROCHOIDAL MESH</span>
          </div>
          <svg className="w-16 h-16 overflow-visible ml-16" viewBox="-35 -35 70 70">
            {/* Stationary Pin Pitch */}
            <circle cx="0" cy="0" r="28" fill="none" stroke="#202838" strokeWidth="1" strokeDasharray="2 3" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 2 * Math.PI) / 12;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 28}
                  cy={Math.sin(a) * 28}
                  r="2"
                  fill="#EC4899"
                  fillOpacity="0.7"
                />
              );
            })}
            {/* Eccentric Rotor Profile */}
            <circle cx="1.5" cy="0" r="21" fill="none" stroke="#E1E7F0" strokeWidth="1.2" />
            <circle cx="1.5" cy="0" r="3" fill="#EC4899" />
          </svg>
        </div>
      );

    case 'ai-smart-router':
    default:
      return (
        <div className="relative w-full h-20 rounded bg-[#0A0D13] border border-[#1C2331] overflow-hidden flex items-center justify-center p-2">
          <div className="absolute top-1 left-2 flex items-center gap-1.5 text-[9px] font-mono text-purple-400">
            <span className="w-1.5 h-1.5 rounded-sm bg-purple-400" />
            <span>COSINE TRIAGE GATE</span>
          </div>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60">
            <line x1="20" y1="30" x2="95" y2="30" stroke="#8B5CF6" strokeWidth="1.5" />
            <path d="M 95,30 C 130,30 150,15 220,15" fill="none" stroke="#10B981" strokeWidth="1.2" strokeDasharray="2 3" />
            <path d="M 95,30 L 220,30" fill="none" stroke="#3B82F6" strokeWidth="1.2" strokeDasharray="2 3" />
            <path d="M 95,30 C 130,30 150,45 220,45" fill="none" stroke="#EC4899" strokeWidth="1.2" strokeDasharray="2 3" />
            <polygon points="95,22 105,30 95,38 85,30" fill="#171A26" stroke="#8B5CF6" strokeWidth="1.2" />
          </svg>
        </div>
      );
  }
}
