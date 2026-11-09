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

const BASE_CANDLES: Candle[] = Array.from({ length: 40 }).map((_, i) => {
  const wave = Math.sin(i * 0.28) * 14 + Math.cos(i * 0.15) * 8;
  const trend = i > 24 ? (i - 24) * 2.2 : 0;
  const mean = 110 + wave * 0.55 + trend * 0.65;
  const delta =
    i === 12
      ? 18
      : i === 21
      ? -19
      : i === 31
      ? 24
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
  const [tickCount, setTickCount] = useState(0);

  useEffect(() => {
    const intervalMs = Math.max(40, Math.round(3000 / tapeVelocity));
    const timer = setInterval(() => {
      setTickCount((p) => p + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [tapeVelocity]);

  const simulation = useMemo(() => {
    let breakouts = 0;
    let filteredNoise = 0;
    let cumulativeR = 0;
    const equityPoints: number[] = [0];

    const evaluated = BASE_CANDLES.map((c) => {
      const upperBand = c.mean + c.atr * atrMultiplier;
      const lowerBand = c.mean - c.atr * atrMultiplier;
      const isLongBreakout = c.close > upperBand;
      const isShortBreakout = c.close < lowerBand;
      const isBreakout = isLongBreakout || isShortBreakout;

      if (isBreakout) {
        breakouts++;
        const won = (c.index === 31 || c.index === 12 || c.index === 21) && tapeVelocity >= 65;
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

  const priceToY = (p: number) => 215 - ((p - 45) / 145) * 195;

  const upperPath = simulation.evaluated
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${18 + i * 16.5},${priceToY(c.upperBand).toFixed(1)}`)
    .join(' ');
  const lowerPathReverse = [...simulation.evaluated]
    .reverse()
    .map((c, i) => `L ${18 + (39 - i) * 16.5},${priceToY(c.lowerBand).toFixed(1)}`)
    .join(' ');
  const channelAreaPath = `${upperPath} ${lowerPathReverse} Z`;

  const primaryBreakout =
    simulation.evaluated.find((c) => c.index === 31 && c.isBreakout) ||
    simulation.evaluated.find((c) => c.isBreakout) ||
    simulation.evaluated[31];

  const entryY = priceToY(primaryBreakout.close);
  const stopDistancePx = Math.max(12, primaryBreakout.atr * atrMultiplier * 1.15);
  const tpDistancePx = stopDistancePx * riskReward;

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-3.5 rounded-lg bg-[#0E1118] border border-[#1E2533] font-mono">
      {/* Top Laboratory Oscilloscope Header */}
      <div className="flex items-center justify-between border-b border-[#1A202C] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-cyan-500" />
          <span className="text-white font-bold tracking-wider">
            OSC-ATR // NQ_MICROSTRUCTURE
          </span>
          <span className="text-slate-500 text-[10px]">
            [TICK_STREAM: {tickCount}]
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            EV: <strong className={Number(simulation.ev) >= 0 ? 'text-cyan-400' : 'text-rose-400'}>{simulation.ev}R</strong>
          </span>
          <span className="text-slate-400">
            WIN_RATE: <strong className="text-slate-200">{simulation.winRate}%</strong>
          </span>
        </div>
      </div>

      {/* Main Precision Screen (Oscilloscope / Tektronix inspired) */}
      <div className="relative flex-1 min-h-[260px] w-full rounded bg-[#07090D] border border-[#1A202C] p-3 flex flex-col justify-between">
        <div className="relative flex-1 w-full flex items-center my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 225" preserveAspectRatio="none">
            {/* Grid Reticle */}
            {[45, 95, 145, 195].map((gy) => (
              <line key={gy} x1="0" y1={gy} x2="680" y2={gy} stroke="#131720" strokeWidth="1" />
            ))}
            {[100, 200, 300, 400, 500, 600].map((gx) => (
              <line key={gx} x1={gx} y1="10" x2={gx} y2="215" stroke="#131720" strokeWidth="1" />
            ))}

            {/* Shaded ATR Channel */}
            <path d={channelAreaPath} fill="rgba(6, 182, 212, 0.05)" />
            <path d={upperPath} fill="none" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="3 3" />
            <path
              d={simulation.evaluated
                .map((c, i) => `${i === 0 ? 'M' : 'L'} ${18 + i * 16.5},${priceToY(c.lowerBand).toFixed(1)}`)
                .join(' ')}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />

            {/* R:R Bracket Box (Technical Target Annotation) */}
            {primaryBreakout && (
              <g>
                <rect
                  x={18 + primaryBreakout.index * 16.5}
                  y={Math.max(6, entryY - tpDistancePx)}
                  width={110}
                  height={Math.min(entryY - 6, tpDistancePx)}
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10B981"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={24 + primaryBreakout.index * 16.5}
                  y={Math.max(16, entryY - tpDistancePx + 10)}
                  fill="#10B981"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  TARGET: +{riskReward.toFixed(1)}R
                </text>

                <rect
                  x={18 + primaryBreakout.index * 16.5}
                  y={entryY}
                  width={110}
                  height={stopDistancePx}
                  fill="rgba(244, 63, 94, 0.08)"
                  stroke="#F43F5E"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={24 + primaryBreakout.index * 16.5}
                  y={entryY + stopDistancePx - 4}
                  fill="#F43F5E"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  RISK: -1.0R
                </text>
              </g>
            )}

            {/* 40 Candlesticks (Precision Monochromatic with Accent Breakouts) */}
            {simulation.evaluated.map((c) => {
              const cx = 18 + c.index * 16.5;
              const yOpen = priceToY(c.open);
              const yClose = priceToY(c.close);
              const yHigh = priceToY(c.high);
              const yLow = priceToY(c.low);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));

              const isUp = c.close >= c.open;
              const strokeColor = c.isBreakout ? '#06B6D4' : isUp ? '#94A3B8' : '#64748B';
              const fillColor = c.isBreakout ? '#06B6D4' : isUp ? '#1E293B' : '#0F172A';

              return (
                <g key={c.index}>
                  <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={strokeColor} strokeWidth="1" />
                  <rect x={cx - 4} y={bodyTop} width={8} height={bodyHeight} fill={fillColor} stroke={strokeColor} strokeWidth="1" />
                  {c.isBreakout && c.index === 31 && (
                    <text x={cx - 32} y={yHigh - 8} fill="#06B6D4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      [BREAKOUT]
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Oscilloscope Readout Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#161C26] text-[10px] text-slate-400">
          <div>
            <span className="text-slate-500 block uppercase">SEÑALES VÁLIDAS</span>
            <span className="text-slate-200 font-bold">{simulation.breakouts} de 40 barras</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">RUIDO ATENUADO</span>
            <span className="text-slate-200 font-bold">{simulation.noiseRatio}%</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">VELOCIDAD CINTA</span>
            <span className="text-cyan-400 font-bold">{tapeVelocity} ticks/s</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase">ESTADO FILTRO</span>
            <span className="text-emerald-400 font-bold">LOCKED_IN</span>
          </div>
        </div>
      </div>

      {/* Control Dials / Precision Instrument Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded bg-[#090C12] border border-[#1A202C]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">1. Factor ATR (k)</span>
            <span className="text-cyan-400 font-bold">{atrMultiplier.toFixed(1)}σ</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={atrMultiplier}
            onChange={(e) => setAtrMultiplier(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">2. Velocidad de Cinta</span>
            <span className="text-cyan-400 font-bold">{tapeVelocity} TPS</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={tapeVelocity}
            onChange={(e) => setTapeVelocity(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">3. Target R:R</span>
            <span className="text-cyan-400 font-bold">1:{riskReward.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.2"
            value={riskReward}
            onChange={(e) => setRiskReward(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
