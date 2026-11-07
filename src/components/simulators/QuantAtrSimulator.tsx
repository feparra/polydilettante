'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface Candle {
  index: number;
  open: number;
  close: number;
  high: number;
  low: number;
  mean: number;
  atr: number;
}

// Deterministic synthetic 40-candle microstructure sequence
const BASE_CANDLES: Candle[] = Array.from({ length: 40 }).map((_, i) => {
  const wave = Math.sin(i * 0.28) * 14 + Math.cos(i * 0.15) * 8;
  const trend = i > 24 ? (i - 24) * 2.2 : 0;
  const mean = 110 + wave * 0.55 + trend * 0.65;
  const delta =
    i === 12
      ? 18 // Spike 1
      : i === 21
      ? -19 // Short spike
      : i === 31
      ? 24 // Major expansion breakout
      : Math.sin(i * 1.7) * 7.5;

  const open = mean - delta * 0.5;
  const close = mean + delta * 0.5;
  const high = Math.max(open, close) + Math.abs(Math.cos(i * 1.1)) * 5 + 2;
  const low = Math.min(open, close) - Math.abs(Math.sin(i * 0.9)) * 5 - 2;
  const atr = 7.2 + Math.abs(Math.sin(i * 0.2)) * 2.4;

  return { index: i, open, close, high, low, mean, atr };
});

export default function QuantAtrSimulator() {
  const { language } = useAppStore();
  const [atrMultiplier, setAtrMultiplier] = useState(1.4);
  const [tapeVelocity, setTapeVelocity] = useState(110);
  const [riskReward, setRiskReward] = useState(2.4);
  const [tickPulse, setTickPulse] = useState(0);

  // Live 60fps / high-frequency tape heartbeat proportional to tapeVelocity
  useEffect(() => {
    const intervalMs = Math.max(30, Math.round(3500 / tapeVelocity));
    const timer = setInterval(() => {
      setTickPulse((p) => (p + 1) % 100);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [tapeVelocity]);

  const simulation = useMemo(() => {
    let breakouts = 0;
    let filteredNoise = 0;
    let cumulativeR = 0;
    const equityPoints: number[] = [0];

    const velocityFactor = tapeVelocity >= 65 ? 1 : 0.45;

    const evaluated = BASE_CANDLES.map((c) => {
      const upperBand = c.mean + c.atr * atrMultiplier;
      const lowerBand = c.mean - c.atr * atrMultiplier;
      const isLongBreakout = c.close > upperBand;
      const isShortBreakout = c.close < lowerBand;
      const isBreakout = isLongBreakout || isShortBreakout;

      if (isBreakout) {
        breakouts++;
        // True momentum expansion requires enough tape velocity
        const won =
          (c.index === 31 || c.index === 12 || c.index === 21 || atrMultiplier >= 1.3) &&
          velocityFactor === 1;
        cumulativeR += won ? riskReward : -1.0;
        equityPoints.push(cumulativeR);
      } else {
        filteredNoise++;
      }

      return {
        ...c,
        upperBand,
        lowerBand,
        isLongBreakout,
        isShortBreakout,
        isBreakout,
      };
    });

    const noiseRatio = ((filteredNoise / BASE_CANDLES.length) * 100).toFixed(0);
    const baseWinRate = Math.min(
      82,
      Math.max(28, 38 + (atrMultiplier - 1.0) * 16 + (tapeVelocity > 65 ? 14 : -12))
    );
    const ev = (baseWinRate / 100) * riskReward - ((100 - baseWinRate) / 100) * 1;

    return {
      evaluated,
      breakouts,
      filteredNoise,
      noiseRatio,
      winRate: baseWinRate.toFixed(1),
      ev: ev.toFixed(2),
      equityPoints,
    };
  }, [atrMultiplier, tapeVelocity, riskReward]);

  // SVG Coordinate mapper (Price 45..185 -> Y 210..15)
  const priceToY = (p: number) => 215 - ((p - 45) / 145) * 195;

  // Upper & Lower band SVG paths
  const upperPath = simulation.evaluated
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${18 + i * 16.5},${priceToY(c.upperBand).toFixed(1)}`)
    .join(' ');
  const lowerPathReverse = [...simulation.evaluated]
    .reverse()
    .map((c, i) => `L ${18 + (39 - i) * 16.5},${priceToY(c.lowerBand).toFixed(1)}`)
    .join(' ');
  const channelAreaPath = `${upperPath} ${lowerPathReverse} Z`;

  // Primary breakout candle to showcase live TP / SL projection boxes
  const primaryBreakout =
    simulation.evaluated.find((c) => c.index === 31 && c.isBreakout) ||
    simulation.evaluated.find((c) => c.isBreakout) ||
    simulation.evaluated[31];

  const entryY = priceToY(primaryBreakout.close);
  const stopDistancePx = Math.max(12, primaryBreakout.atr * atrMultiplier * 1.15);
  const tpDistancePx = stopDistancePx * riskReward;

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-[#070A14] border border-cyan-500/25">
      {/* TOP 65%: Interactive 40-Candle Oscilloscope Stage */}
      <div className="relative flex-1 min-h-[250px] w-full rounded-xl bg-[#04060C] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
        {/* Top Overlay: Telemetry & Mini PnL Equity Curve */}
        <div className="flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              NQ_MICROSTRUCTURE // 40 BARS
            </span>
            <span className="text-slate-400 hidden sm:inline">
              ATR({atrMultiplier.toFixed(1)}x) | {tapeVelocity} ticks/s
            </span>
          </div>

          {/* Live Projected Equity Mini-Chart */}
          <div className="flex items-center gap-2 bg-[#090D1A]/90 border border-white/10 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] font-mono text-slate-400">
              {language === 'es' ? 'Curva PnL:' : 'PnL Curve:'}
            </span>
            <svg className="w-20 h-5 overflow-visible" viewBox="0 0 80 24">
              <polyline
                fill="none"
                stroke={Number(simulation.ev) >= 0 ? '#00F5D4' : '#F72585'}
                strokeWidth="2"
                points={simulation.equityPoints
                  .map(
                    (val, idx, arr) =>
                      `${(idx / Math.max(1, arr.length - 1)) * 78},${16 - val * 1.8}`
                  )
                  .join(' ')}
              />
            </svg>
            <span
              className={`text-[11px] font-mono font-bold ${
                Number(simulation.ev) >= 0 ? 'text-cyan-300' : 'text-rose-400'
              }`}
            >
              {Number(simulation.ev) >= 0 ? `+${simulation.ev}R` : `${simulation.ev}R`}
            </span>
          </div>
        </div>

        {/* Main 40-Candlestick + Dynamic ATR Bands + Live R:R Box SVG */}
        <div className="relative flex-1 w-full flex items-center my-1">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 700 225"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="atrChannelFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.16" />
                <stop offset="50%" stopColor="#00F5D4" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.16" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[45, 95, 145, 195].map((gy) => (
              <line
                key={gy}
                x1="0"
                y1={gy}
                x2="675"
                y2={gy}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
              />
            ))}

            {/* Dynamic Shaded ATR Volatility Channel */}
            <path d={channelAreaPath} fill="url(#atrChannelFill)" />
            <path
              d={upperPath}
              fill="none"
              stroke="#00F5D4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d={simulation.evaluated
                .map(
                  (c, i) =>
                    `${i === 0 ? 'M' : 'L'} ${18 + i * 16.5},${priceToY(c.lowerBand).toFixed(1)}`
                )
                .join(' ')}
              fill="none"
              stroke="#00F5D4"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              strokeDasharray="4 4"
            />

            {/* Live Risk/Reward Take-Profit & Stop-Loss Projection Box */}
            {primaryBreakout && (
              <g>
                {/* Take Profit Green Zone */}
                <rect
                  x={18 + primaryBreakout.index * 16.5}
                  y={Math.max(6, entryY - tpDistancePx)}
                  width={125}
                  height={Math.min(entryY - 6, tpDistancePx)}
                  fill="rgba(16, 185, 129, 0.16)"
                  stroke="#10B981"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  rx="3"
                />
                <text
                  x={24 + primaryBreakout.index * 16.5}
                  y={Math.max(18, entryY - tpDistancePx + 12)}
                  fill="#34D399"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  TAKE PROFIT (+{riskReward.toFixed(1)}R)
                </text>

                {/* Stop Loss Red Zone */}
                <rect
                  x={18 + primaryBreakout.index * 16.5}
                  y={entryY}
                  width={125}
                  height={stopDistancePx}
                  fill="rgba(244, 63, 94, 0.18)"
                  stroke="#F43F5E"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  rx="3"
                />
                <text
                  x={24 + primaryBreakout.index * 16.5}
                  y={entryY + stopDistancePx - 4}
                  fill="#FB7185"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  STOP LOSS (-1.0R)
                </text>
              </g>
            )}

            {/* 40 Synthetic Japanese Candlesticks */}
            {simulation.evaluated.map((c) => {
              const cx = 18 + c.index * 16.5;
              const yOpen = priceToY(c.open);
              const yClose = priceToY(c.close);
              const yHigh = priceToY(c.high);
              const yLow = priceToY(c.low);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));

              const color = c.isLongBreakout
                ? '#00F5D4'
                : c.isShortBreakout
                ? '#F72585'
                : 'rgba(100, 116, 139, 0.38)';

              return (
                <g key={c.index}>
                  {/* Candle Wick */}
                  <line
                    x1={cx}
                    y1={yHigh}
                    x2={cx}
                    y2={yLow}
                    stroke={color}
                    strokeWidth={c.isBreakout ? '1.8' : '1'}
                  />
                  {/* Candle Body */}
                  <rect
                    x={cx - 4.5}
                    y={bodyTop}
                    width={9}
                    height={bodyHeight}
                    rx="1.5"
                    fill={color}
                    style={
                      c.isBreakout ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined
                    }
                  />
                  {/* Breakout Marker Tag */}
                  {c.isBreakout && (c.index === 12 || c.index === 21 || c.index === 31) && (
                    <g>
                      <circle cx={cx} cy={yHigh - 6} r="3" fill={color} />
                      {c.index === 31 && (
                        <text
                          x={cx - 40}
                          y={yHigh - 12}
                          fill="#00F5D4"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ⚡ BREAKOUT ENTRY
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Filtered Noise Watermark Label inside Band */}
            <text
              x="165"
              y="125"
              fill="rgba(148, 163, 184, 0.35)"
              fontSize="10"
              fontFamily="monospace"
              letterSpacing="2"
            >
              [ FILTERED MICROSTRUCTURE NOISE: {simulation.noiseRatio}% ]
            </text>

            {/* Right-Side Tape Velocity Pulse Meter */}
            <g transform="translate(684, 15)">
              <rect
                x="0"
                y="0"
                width="8"
                height="195"
                rx="4"
                fill="rgba(255,255,255,0.06)"
              />
              <rect
                x="0"
                y={195 - (tapeVelocity / 200) * 195}
                width="8"
                height={(tapeVelocity / 200) * 195}
                rx="4"
                fill={tapeVelocity > 65 ? '#00F5D4' : '#64748B'}
                opacity={tickPulse % 2 === 0 ? 1 : 0.65}
              />
            </g>
          </svg>
        </div>

        {/* Bottom Live Telemetry Strip */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Señales Válidas' : 'Valid Breakouts'}
            </span>
            <span className="text-cyan-300 font-bold">
              {simulation.breakouts} / 40 velas
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Ruido Filtrado' : 'Filtered Noise'}
            </span>
            <span className="text-slate-200 font-bold">{simulation.noiseRatio}%</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Win Rate Est.' : 'Est. Win Rate'}
            </span>
            <span className="text-emerald-400 font-bold">{simulation.winRate}%</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Velocidad Cinta' : 'Tape Status'}
            </span>
            <span
              className={`font-bold ${
                tapeVelocity >= 65 ? 'text-cyan-300' : 'text-amber-400'
              }`}
            >
              {tapeVelocity >= 65 ? 'EXPANSION_OK' : 'LOW_MOMENTUM'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM 35%: Tactile Sliders Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F1F]/90 border border-white/10">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '1. Multiplicador ATR' : '1. ATR Band Multiplier'}
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
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Ensancha/contrae el canal envolvente'
              : 'Widens/contracts volatility envelope'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '2. Velocidad Cinta (TPS)' : '2. Tape Velocity (TPS)'}
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
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Mínimo >65 tps para validar orden'
              : 'Requires >65 tps to validate breakout'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '3. Ratio Riesgo/Beneficio' : '3. Risk/Reward Ratio'}
            </span>
            <span className="text-emerald-400 font-bold">1:{riskReward.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.2"
            value={riskReward}
            onChange={(e) => setRiskReward(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Escala en vivo la caja Take Profit'
              : 'Scales projected Take Profit zone'}
          </span>
        </div>
      </div>
    </div>
  );
}
