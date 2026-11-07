'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function CycloidalDriveSimulator() {
  const { language } = useAppStore();
  const [numLobes, setNumLobes] = useState(11); // N lobes
  const [inputRpm, setInputRpm] = useState(900);
  const [inputTorque, setInputTorque] = useState(4.0);
  const [inputAngle, setInputAngle] = useState(0);

  const numPins = numLobes + 1; // N + 1 stationary ring pins

  // 60 FPS continuous eccentric rotation loop
  useEffect(() => {
    let animId: number;
    const step = () => {
      // Scale angular velocity visually from inputRpm
      const angularStep = (inputRpm / 600) * 0.042;
      setInputAngle((prev) => (prev + angularStep) % (Math.PI * 2 * numLobes));
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [inputRpm, numLobes]);

  // Parametric Epitrochoid / Cycloidal Disc Profile generator
  const epitrochoidPath = useMemo(() => {
    const R = 74; // Pitch radius of stationary ring pins
    const r = 6.5; // Radius of each ring pin
    const e = 3.6; // Eccentricity offset
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

  // Kinematics & Torque Telemetry
  const kinematics = useMemo(() => {
    const reductionRatio = numLobes / (numPins - numLobes); // = numLobes : 1
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

  // Eccentric cam center offset & reverse disc angle
  const eccentricityPx = 3.6;
  const camX = Math.cos(inputAngle) * eccentricityPx;
  const camY = Math.sin(inputAngle) * eccentricityPx;
  const discRotationDeg = ((-inputAngle / numLobes) * 180) / Math.PI;
  const inputRotationDeg = (inputAngle * 180) / Math.PI;

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-[#070A14] border border-pink-500/25">
      {/* TOP 65%: Real-Time 60 FPS Epitrochoidal Kinematics Stage */}
      <div className="relative flex-1 min-h-[250px] w-full rounded-xl bg-[#04060C] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
        {/* Top Overlay Status */}
        <div className="flex items-center justify-between text-xs font-mono z-10">
          <span className="flex items-center gap-1.5 text-pink-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            EPITROCHOIDAL KINEMATICS // RATIO 1:{kinematics.reductionRatio}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-pink-500/15 border border-pink-500/40 text-pink-300 text-[10px] font-bold">
            ZERO-BACKLASH ({kinematics.activePins}/{numPins} PINS LOADED)
          </span>
        </div>

        {/* Center High-Precision Trigonometric SVG Gearbox */}
        <div className="relative flex-1 w-full flex items-center justify-around my-1">
          <svg className="w-52 h-52 overflow-visible" viewBox="-95 -95 190 190">
            {/* Outer Housing Ring */}
            <circle
              cx="0"
              cy="0"
              r="86"
              fill="#080B18"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
            />

            {/* Lobed Cycloidal Disc (Orbits eccentrically + Rotates in REVERSE at -1/N speed) */}
            <g
              transform={`translate(${camX.toFixed(2)}, ${camY.toFixed(
                2
              )}) rotate(${discRotationDeg.toFixed(2)})`}
            >
              <path
                d={epitrochoidPath}
                fill="rgba(247, 37, 133, 0.2)"
                stroke="#F72585"
                strokeWidth="2.2"
                style={{ filter: 'drop-shadow(0 0 10px rgba(247,37,133,0.4))' }}
              />

              {/* 6 Internal Output Roller Holes */}
              {Array.from({ length: 6 }).map((_, idx) => {
                const holeAngle = (idx * Math.PI * 2) / 6;
                const hx = Math.cos(holeAngle) * 38;
                const hy = Math.sin(holeAngle) * 38;
                return (
                  <g key={idx}>
                    <circle
                      cx={hx}
                      cy={hy}
                      r="9.5"
                      fill="#04060C"
                      stroke="#F72585"
                      strokeWidth="1.5"
                    />
                    {/* Output Pin inside Hole */}
                    <circle cx={hx - camX * 0.7} cy={hy - camY * 0.7} r="4.5" fill="#00F5D4" />
                  </g>
                );
              })}

              {/* Orientation Reference Marker on Disc */}
              <circle cx="52" cy="0" r="3.5" fill="#FFFFFF" />
            </g>

            {/* Stationary Perimeter Ring Pins + Load Sharing Force Vectors */}
            {Array.from({ length: numPins }).map((_, i) => {
              const pinAngle = (i * Math.PI * 2) / numPins;
              const px = Math.cos(pinAngle) * 74;
              const py = Math.sin(pinAngle) * 74;

              // Calculate instantaneous contact pressure based on eccentric phase alignment
              const phaseAlignment = Math.cos(pinAngle - inputAngle);
              const isSharingLoad = phaseAlignment > -0.35; // ~70% of pins simultaneously engaged
              const vectorLen = isSharingLoad
                ? Math.max(6, (phaseAlignment + 0.4) * (inputTorque * 2.2))
                : 0;
              const vx = px - Math.cos(pinAngle) * vectorLen;
              const vy = py - Math.sin(pinAngle) * vectorLen;

              return (
                <g key={i}>
                  {/* Force Vector Arrow showing simultaneous tooth engagement */}
                  {isSharingLoad && (
                    <line
                      x1={px}
                      y1={py}
                      x2={vx}
                      y2={vy}
                      stroke="#00F5D4"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                  <circle
                    cx={px}
                    cy={py}
                    r="5.5"
                    fill={isSharingLoad ? '#00F5D4' : '#1E293B'}
                    fillOpacity={isSharingLoad ? 0.85 : 0.7}
                    stroke={isSharingLoad ? '#FFFFFF' : '#64748B'}
                    strokeWidth="1.2"
                  />
                </g>
              );
            })}

            {/* High-Speed Eccentric Input Camshaft in Center */}
            <g transform={`rotate(${inputRotationDeg.toFixed(1)})`}>
              <circle
                cx={eccentricityPx}
                cy="0"
                r="16"
                fill="#1E1028"
                stroke="#F72585"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="0"
                x2={eccentricityPx + 14}
                y2="0"
                stroke="#00F5D4"
                strokeWidth="2.5"
              />
              <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Right-side Visual Mechanics Legend */}
          <div className="hidden sm:flex flex-col gap-2.5 bg-[#090D1A]/90 border border-white/10 p-3.5 rounded-xl font-mono text-xs max-w-[230px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500 shrink-0" />
              <span className="text-slate-300 text-[11px]">
                {language === 'es'
                  ? `Disco (${numLobes} lóbulos): gira en SENTIDO INVERSO`
                  : `Disc (${numLobes} lobes): rotates in REVERSE`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-slate-300 text-[11px]">
                {language === 'es'
                  ? `${kinematics.activePins} de ${numPins} pines absorben par al mismo tiempo`
                  : `${kinematics.activePins} of ${numPins} pins share load simultaneously`}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300">
              R = N / (P - N) = {numLobes} / ({numPins} - {numLobes}) = 1:{kinematics.reductionRatio}
            </div>
          </div>
        </div>

        {/* Bottom Telemetry Strip */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Reducción' : 'Gear Ratio'}
            </span>
            <span className="text-pink-400 font-bold">1:{kinematics.reductionRatio}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'RPM Salida' : 'Output Speed'}
            </span>
            <span className="text-cyan-300 font-bold">-{kinematics.outputRpm} RPM</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Torque Multiplicado' : 'Output Torque'}
            </span>
            <span className="text-emerald-400 font-bold">{kinematics.outputTorque} Nm</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase block">
              {language === 'es' ? 'Holgura (Backlash)' : 'Gear Backlash'}
            </span>
            <span className="text-pink-300 font-bold">0.00 arcmin</span>
          </div>
        </div>
      </div>

      {/* BOTTOM 35%: Tactile Sliders Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F1F]/90 border border-white/10">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '1. Lóbulos del Disco (N)' : '1. Rotor Lobes (N)'}
            </span>
            <span className="text-pink-400 font-bold">
              {numLobes} ({numPins} pines)
            </span>
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
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Reesculpe la curva epitrocoidal en vivo'
              : 'Reshapes epitrochoid geometry live'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '2. RPM Eje Excéntrico' : '2. Eccentric Input RPM'}
            </span>
            <span className="text-cyan-300 font-bold">{inputRpm} RPM</span>
          </div>
          <input
            type="range"
            min="150"
            max="2400"
            step="50"
            value={inputRpm}
            onChange={(e) => setInputRpm(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Acelera la leva central vs. el disco'
              : 'Controls input cam orbital frequency'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">
              {language === 'es' ? '3. Par de Entrada (Torque)' : '3. Input Servo Torque'}
            </span>
            <span className="text-emerald-400 font-bold">{inputTorque.toFixed(1)} Nm</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={inputTorque}
            onChange={(e) => setInputTorque(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Alarga los vectores de fuerza en los pines'
              : 'Scales load vectors across active pins'}
          </span>
        </div>
      </div>
    </div>
  );
}
