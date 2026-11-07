'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CycloidalDriveSimulator() {
  const { language } = useAppStore();
  const [numLobes, setNumLobes] = useState(10);
  const [inputRpm, setInputRpm] = useState(1200);
  const [inputTorque, setInputTorque] = useState(3.5);

  const numPins = numLobes + 1;

  const metrics = useMemo(() => {
    const reductionRatio = numLobes / (numPins - numLobes); // e.g. 10:1
    const outputRpm = inputRpm / reductionRatio;
    const efficiency = 0.88;
    const outputTorque = inputTorque * reductionRatio * efficiency;
    const activeContacts = Math.floor(numLobes * 0.7);

    return {
      ratio: `1:${reductionRatio}`,
      outputRpm: outputRpm.toFixed(1),
      outputTorque: outputTorque.toFixed(1),
      activeContacts,
      contactPercentage: 70,
    };
  }, [numLobes, numPins, inputRpm, inputTorque]);

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl bg-[#090B14]/80 border border-white/10 backdrop-blur-md">
      {/* 2D/3D Kinetic Graphic Canvas */}
      <div className="relative h-48 w-full rounded-lg bg-[#05060B] border border-pink-500/20 overflow-hidden flex flex-col justify-between p-3">
        <div className="flex items-center justify-between text-xs font-mono text-pink-400/90">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            CYCLOIDAL EPITROCHOID // ZERO-BACKLASH
          </span>
          <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-[10px]">
            RATIO {metrics.ratio}
          </span>
        </div>

        {/* Dynamic Cycloidal SVG Disc & Pins Animation */}
        <div className="relative w-full h-28 flex items-center justify-center">
          <svg className="w-28 h-28 overflow-visible" viewBox="-60 -60 120 120">
            {/* Outer Pins (Stationary Ring) */}
            {Array.from({ length: numPins }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / numPins;
              const px = Math.cos(angle) * 48;
              const py = Math.sin(angle) * 48;
              return (
                <circle
                  key={`pin-${i}`}
                  cx={px}
                  cy={py}
                  r="4"
                  fill="#F72585"
                  fillOpacity="0.4"
                  stroke="#F72585"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Cycloidal Disc with Lobes */}
            <g className="animate-spin" style={{ animationDuration: `${Math.max(0.8, 1200 / inputRpm)}s` }}>
              <circle cx="2" cy="0" r="38" fill="rgba(247, 37, 133, 0.15)" stroke="#F72585" strokeWidth="2" strokeDasharray="6 3" />
              {/* Internal output roller holes */}
              {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i * 2 * Math.PI) / 5;
                const hx = Math.cos(angle) * 20;
                const hy = Math.sin(angle) * 20;
                return (
                  <circle
                    key={`hole-${i}`}
                    cx={hx}
                    cy={hy}
                    r="6"
                    fill="#05060B"
                    stroke="#F72585"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Center Input Cam */}
              <circle cx="2" cy="0" r="8" fill="#F72585" />
            </g>
          </svg>
        </div>

        {/* Telemetry info */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Par Salida' : 'Output Torque'}
            </span>
            <span className="text-pink-400 font-semibold">{metrics.outputTorque} Nm</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'RPM Salida' : 'Output Speed'}
            </span>
            <span className="text-pink-300 font-semibold">{metrics.outputRpm} rpm</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Contactos Simul.' : 'Load Sharing'}
            </span>
            <span className="text-pink-300 font-semibold">{metrics.activeContacts} pins ({metrics.contactPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Sliders and Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Número de Lóbulos del Disco' : 'Number of Rotor Lobes'}
            </span>
            <span className="text-pink-400 font-bold">{numLobes} (Pines: {numPins})</span>
          </div>
          <input
            type="range"
            min="6"
            max="18"
            step="1"
            value={numLobes}
            onChange={(e) => setNumLobes(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Velocidad de Entrada (RPM Servomotor)' : 'Input Servo Speed (RPM)'}
            </span>
            <span className="text-pink-400 font-bold">{inputRpm} RPM</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={inputRpm}
            onChange={(e) => setInputRpm(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Par Motor Entrada (Nm)' : 'Input Motor Torque (Nm)'}
            </span>
            <span className="text-pink-400 font-bold">{inputTorque.toFixed(1)} Nm</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={inputTorque}
            onChange={(e) => setInputTorque(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </div>
    </div>
  );
}

