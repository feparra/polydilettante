'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CycloidalDriveSimulator() {
  const { language } = useAppStore();
  const [numLobes, setNumLobes] = useState(11);
  const [inputRpm, setInputRpm] = useState(900);
  const [inputTorque, setInputTorque] = useState(4.0);
  const [inputAngle, setInputAngle] = useState(0);

  const numPins = numLobes + 1;

  useEffect(() => {
    let animId: number;
    const step = () => {
      const angularStep = (inputRpm / 600) * 0.04;
      setInputAngle((prev) => (prev + angularStep) % (Math.PI * 2 * numLobes));
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [inputRpm, numLobes]);

  const epitrochoidPath = useMemo(() => {
    const R = 74;
    const r = 6.5;
    const e = 3.6;
    const N = numPins;
    const samples = 180;
    const pts: string[] = [];

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * Math.PI * 2;
      const psi = Math.atan2(
        Math.sin((1 - N) * t),
        R / (e * N) - Math.cos((1 - N) * t)
      );
      const x = R * Math.cos(t) - r * Math.cos(t + psi) - e * Math.cos(N * t);
      const y = -R * Math.sin(t) + r * Math.sin(t + psi) + e * Math.sin(N * t);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return pts.join(' ') + ' Z';
  }, [numPins]);

  const kinematics = useMemo(() => {
    const reductionRatio = numLobes / (numPins - numLobes);
    const outputRpm = inputRpm / reductionRatio;
    const efficiency = 0.9;
    const outputTorque = inputTorque * reductionRatio * efficiency;
    const activePins = Math.ceil(numPins * 0.7);

    return {
      reductionRatio,
      outputRpm: outputRpm.toFixed(1),
      outputTorque: outputTorque.toFixed(1),
      activePins,
    };
  }, [numLobes, numPins, inputRpm, inputTorque]);

  const eccentricityPx = 3.6;
  const camX = Math.cos(inputAngle) * eccentricityPx;
  const camY = Math.sin(inputAngle) * eccentricityPx;
  const discRotationDeg = ((-inputAngle / numLobes) * 180) / Math.PI;

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-3.5 rounded-lg bg-[#0E1118] border border-[#1E2533] font-mono">
      {/* Precision Kinematic Header */}
      <div className="flex items-center justify-between border-b border-[#1A202C] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-pink-500" />
          <span className="text-white font-bold tracking-wider">
            KINEMATICS // EPITROCHOID SPEED REDUCER
          </span>
          <span className="text-slate-500 text-[10px]">
            [RATIO 1:{kinematics.reductionRatio}]
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            LOAD SHARE: <strong className="text-slate-200">{kinematics.activePins}/{numPins} pins ({Math.round((kinematics.activePins / numPins) * 100)}%)</strong>
          </span>
        </div>
      </div>

      {/* Center Gearbox Visualizer (Engineering CAD / Monochromatic Style) */}
      <div className="relative flex-1 min-h-[260px] w-full rounded bg-[#07090D] border border-[#1A202C] p-3 flex items-center justify-around">
        <svg className="w-52 h-52 overflow-visible" viewBox="-95 -95 190 190">
          {/* Pitch Circle Reticle */}
          <circle cx="0" cy="0" r="74" fill="none" stroke="#1A2233" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="86" fill="#0C0F17" stroke="#252E42" strokeWidth="1.2" />

          {/* Cycloidal Disc Lobes */}
          <g transform={`translate(${camX.toFixed(2)}, ${camY.toFixed(2)}) rotate(${discRotationDeg.toFixed(2)})`}>
            <path
              d={epitrochoidPath}
              fill="#141824"
              stroke="#E1E7F0"
              strokeWidth="1.5"
            />
            {/* 6 Output Roller Holes */}
            {Array.from({ length: 6 }).map((_, idx) => {
              const holeAngle = (idx * Math.PI * 2) / 6;
              const hx = Math.cos(holeAngle) * 38;
              const hy = Math.sin(holeAngle) * 38;
              return (
                <g key={idx}>
                  <circle cx={hx} cy={hy} r="9" fill="#07090D" stroke="#334155" strokeWidth="1" />
                  <circle cx={hx - camX * 0.7} cy={hy - camY * 0.7} r="4" fill="#06B6D4" />
                </g>
              );
            })}
          </g>

          {/* Stationary Ring Pins */}
          {Array.from({ length: numPins }).map((_, i) => {
            const pinAngle = (i * Math.PI * 2) / numPins;
            const px = Math.cos(pinAngle) * 74;
            const py = Math.sin(pinAngle) * 74;
            const phaseAlignment = Math.cos(pinAngle - inputAngle);
            const isSharingLoad = phaseAlignment > -0.35;

            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r="5"
                fill={isSharingLoad ? '#EC4899' : '#1A202C'}
                stroke={isSharingLoad ? '#F472B6' : '#334155'}
                strokeWidth="1"
              />
            );
          })}

          {/* Input Cam Center */}
          <circle cx={camX} cy={camY} r="7" fill="#E1E7F0" />
        </svg>

        {/* Telemetry Block */}
        <div className="flex flex-col gap-2.5 bg-[#0C0F17] border border-[#1A202C] p-3 rounded text-xs max-w-[220px]">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">RELACIÓN DE ENGRANAJE</span>
            <span className="text-white font-bold">R = {numLobes}:1</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">TORQUE DE SALIDA MULTIPLICADO</span>
            <span className="text-pink-400 font-bold">{kinematics.outputTorque} Nm</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">HOLGURA ANGULAR (BACKLASH)</span>
            <span className="text-emerald-400 font-bold">&lt; 0.05 arcmin</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded bg-[#090C12] border border-[#1A202C]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">1. Lóbulos del Rotor (N)</span>
            <span className="text-pink-400 font-bold">{numLobes} ({numPins} pines)</span>
          </div>
          <input
            type="range"
            min="6"
            max="18"
            step="1"
            value={numLobes}
            onChange={(e) => setNumLobes(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">2. RPM Entrada (Leva)</span>
            <span className="text-slate-200 font-bold">{inputRpm} RPM</span>
          </div>
          <input
            type="range"
            min="150"
            max="2400"
            step="50"
            value={inputRpm}
            onChange={(e) => setInputRpm(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-slate-300"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">3. Par de Entrada (Nm)</span>
            <span className="text-emerald-400 font-bold">{inputTorque.toFixed(1)} Nm</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={inputTorque}
            onChange={(e) => setInputTorque(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
