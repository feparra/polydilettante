'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function PlcCurrentLoopSimulator() {
  const { language } = useAppStore();
  const [processPercent, setProcessPercent] = useState(55); // 0% to 100%
  const [wireResistance, setWireResistance] = useState(180); // 0 to 1000 Ohms
  const [isWireBroken, setIsWireBroken] = useState(false);
  const [phase, setPhase] = useState(0);

  // Physics calculation of 4-20mA current loop with 24V supply & 9V min transmitter compliance
  const loopPhysics = useMemo(() => {
    const supplyVoltage = 24.0;
    const minTxCompliance = 9.0; // Transmitter requires at least 9V across its terminals
    const shuntResistor = 250; // Standard PLC 250 Ohm resistor

    if (isWireBroken) {
      return {
        commandedMa: 4 + (processPercent / 100) * 16,
        actualMa: 0,
        adcVolts: 0,
        wireDropVolts: 0,
        shuntDropVolts: 0,
        txAvailableVolts: supplyVoltage,
        isDropout: false,
        status: 'LIVE_ZERO_FAULT',
      };
    }

    const commandedMa = 4.0 + (processPercent / 100) * 16.0;
    const totalResistance = wireResistance + shuntResistor;
    // Max current the 24V supply can push while keeping 9V for the transmitter
    const maxPossibleMa = ((supplyVoltage - minTxCompliance) / totalResistance) * 1000;
    const actualMa = Math.min(commandedMa, maxPossibleMa);
    const isDropout = actualMa < commandedMa - 0.05;

    const wireDropVolts = (actualMa / 1000) * wireResistance;
    const shuntDropVolts = (actualMa / 1000) * shuntResistor;
    const txAvailableVolts = Math.max(0, supplyVoltage - wireDropVolts - shuntDropVolts);

    return {
      commandedMa,
      actualMa,
      adcVolts: shuntDropVolts,
      wireDropVolts,
      shuntDropVolts,
      txAvailableVolts,
      isDropout,
      status: isDropout ? 'VOLTAGE_DROPOUT' : 'LOOP_HEALTHY',
    };
  }, [processPercent, wireResistance, isWireBroken]);

  // 60 FPS Electron Animation Loop
  useEffect(() => {
    if (isWireBroken || loopPhysics.actualMa <= 0) return;
    let animId: number;
    const step = () => {
      setPhase((prev) => (prev + loopPhysics.actualMa * 0.09) % 1000);
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isWireBroken, loopPhysics.actualMa]);

  // Helper to place electron particles along the rectangular circuit loop (perimeter = 1000 units)
  // Top wire: x 110 -> 570 (y=52), Right side: y 52 -> 172 (x=570), Bottom wire: x 570 -> 110 (y=172), Left side: y 172 -> 52 (x=110)
  const numParticles = isWireBroken ? 0 : Math.max(6, Math.round(loopPhysics.actualMa * 1.1));
  const particles = Array.from({ length: numParticles }).map((_, idx) => {
    const pos = ((phase + (idx * 1000) / Math.max(1, numParticles)) % 1000) / 1000;
    const w = 460;
    const h = 120;
    const perim = 2 * (w + h);
    const d = pos * perim;

    if (d <= w) {
      return { x: 110 + d, y: 52 };
    } else if (d <= w + h) {
      return { x: 570, y: 52 + (d - w) };
    } else if (d <= 2 * w + h) {
      return { x: 570 - (d - (w + h)), y: 172 };
    } else {
      return { x: 110, y: 172 - (d - (2 * w + h)) };
    }
  });

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-[#070A14] border border-amber-500/25">
      {/* TOP 65%: Physical 4-20 mA Circuit Schematic & Electron Flow */}
      <div className="relative flex-1 min-h-[250px] w-full rounded-xl bg-[#04060C] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
        {/* Top Status Header */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                isWireBroken
                  ? 'bg-rose-500 animate-ping'
                  : loopPhysics.isDropout
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            INDUSTRIAL 4-20mA LOOP // 24V DC COMPLIANCE
          </span>

          <span
            className={`px-2.5 py-0.5 rounded border text-[10px] font-bold ${
              isWireBroken
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : loopPhysics.isDropout
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isWireBroken
              ? '🚨 LIVE-ZERO FAULT (0.00 mA < 4.00 mA)'
              : loopPhysics.isDropout
              ? '⚠️ VOLTAGE DROPOUT (LINE IMPEDANCE TOO HIGH)'
              : '✓ LIVE-ZERO HEARTBEAT OK'}
          </span>
        </div>

        {/* Main Animated SVG Circuit */}
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <svg className="w-full h-full max-h-[195px] overflow-visible" viewBox="0 0 680 215">
            {/* Bottom Return Wire */}
            <line
              x1="110"
              y1="172"
              x2="570"
              y2="172"
              stroke={isWireBroken ? '#334155' : '#FF6B35'}
              strokeOpacity={isWireBroken ? 0.35 : 0.45}
              strokeWidth="3"
            />
            {/* Left & Right Vertical Wires */}
            <line
              x1="110"
              y1="52"
              x2="110"
              y2="172"
              stroke={isWireBroken ? '#334155' : '#FF6B35'}
              strokeOpacity={isWireBroken ? 0.35 : 0.45}
              strokeWidth="3"
            />
            <line
              x1="570"
              y1="52"
              x2="570"
              y2="172"
              stroke={isWireBroken ? '#334155' : '#FF6B35'}
              strokeOpacity={isWireBroken ? 0.35 : 0.45}
              strokeWidth="3"
            />

            {/* Top Signal Wire (Splits in two when broken!) */}
            {!isWireBroken ? (
              <line
                x1="110"
                y1="52"
                x2="570"
                y2="52"
                stroke={loopPhysics.isDropout ? '#EF4444' : '#FF6B35'}
                strokeWidth={loopPhysics.isDropout ? '4' : '3'}
                style={{
                  filter: loopPhysics.isDropout
                    ? 'drop-shadow(0 0 8px #EF4444)'
                    : 'drop-shadow(0 0 5px rgba(255,107,53,0.4))',
                }}
              />
            ) : (
              <g>
                {/* Broken left segment */}
                <line x1="110" y1="52" x2="310" y2="52" stroke="#475569" strokeWidth="3" />
                <line x1="310" y1="52" x2="325" y2="36" stroke="#F43F5E" strokeWidth="3" />
                {/* Broken right segment */}
                <line x1="365" y1="66" x2="380" y2="52" stroke="#F43F5E" strokeWidth="3" />
                <line x1="380" y1="52" x2="570" y2="52" stroke="#475569" strokeWidth="3" />
                {/* Spark Fault Badge */}
                <rect
                  x="275"
                  y="10"
                  width="140"
                  height="22"
                  rx="5"
                  fill="#4C0519"
                  stroke="#F43F5E"
                  strokeWidth="1.2"
                />
                <text
                  x="345"
                  y="24"
                  textAnchor="middle"
                  fill="#FDA4AF"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ⚡ OPEN CIRCUIT (0 mA)
                </text>
              </g>
            )}

            {/* Variable Cable Resistance Symbol on Top Wire */}
            {!isWireBroken && (
              <g transform="translate(300, 38)">
                <rect
                  x="0"
                  y="0"
                  width="95"
                  height="28"
                  rx="6"
                  fill="#0B0F1D"
                  stroke={loopPhysics.isDropout ? '#EF4444' : '#FF6B35'}
                  strokeWidth="1.5"
                />
                <text
                  x="47.5"
                  y="12"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  CABLE IMPEDANCE
                </text>
                <text
                  x="47.5"
                  y="23"
                  textAnchor="middle"
                  fill={loopPhysics.isDropout ? '#F87171' : '#FDBA74'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {wireResistance} Ω (-{loopPhysics.wireDropVolts.toFixed(1)}V)
                </text>
              </g>
            )}

            {/* Moving Electron Particles */}
            {particles.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={3.5 + (loopPhysics.actualMa - 4) * 0.08}
                fill="#FF6B35"
                style={{ filter: 'drop-shadow(0 0 6px #FF6B35)' }}
              />
            ))}

            {/* LEFT NODE: Field Pressure Transmitter */}
            <g transform="translate(35, 76)">
              <rect
                x="0"
                y="0"
                width="145"
                height="72"
                rx="10"
                fill="#0D1224"
                stroke="#FF6B35"
                strokeWidth="2"
              />
              <text x="72" y="20" textAnchor="middle" fill="#FF6B35" fontSize="10" fontFamily="monospace" fontWeight="bold">
                PRESSURE TX (FIELD)
              </text>
              <text x="72" y="38" textAnchor="middle" fill="#F1F5F9" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {processPercent}% PSI
              </text>
              <text
                x="72"
                y="56"
                textAnchor="middle"
                fill={loopPhysics.txAvailableVolts < 9.2 ? '#F87171' : '#94A3B8'}
                fontSize="9.5"
                fontFamily="monospace"
              >
                V_tx: {loopPhysics.txAvailableVolts.toFixed(1)}V (min 9V)
              </text>
            </g>

            {/* BOTTOM NODE: 24V DC Power Supply */}
            <g transform="translate(275, 148)">
              <rect
                x="0"
                y="0"
                width="135"
                height="46"
                rx="8"
                fill="#0D1224"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <text x="67.5" y="18" textAnchor="middle" fill="#38BDF8" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                +24V DC LOOP SUPPLY
              </text>
              <text x="67.5" y="34" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="monospace" fontWeight="bold">
                I_loop = {loopPhysics.actualMa.toFixed(2)} mA
              </text>
            </g>

            {/* RIGHT NODE: PLC 250 Ohm Shunt + ADC */}
            <g transform="translate(495, 72)">
              <rect
                x="0"
                y="0"
                width="155"
                height="80"
                rx="10"
                fill="#0D1224"
                stroke={isWireBroken ? '#F43F5E' : '#00F5D4'}
                strokeWidth="2"
              />
              <text
                x="77.5"
                y="19"
                textAnchor="middle"
                fill={isWireBroken ? '#FDA4AF' : '#00F5D4'}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PLC ANALOG IN (250Ω)
              </text>
              <text
                x="77.5"
                y="41"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="14"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {loopPhysics.adcVolts.toFixed(2)} V DC
              </text>
              <text
                x="77.5"
                y="62"
                textAnchor="middle"
                fill={isWireBroken ? '#F43F5E' : '#34D399'}
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {isWireBroken
                  ? 'ALARM: WIRE BREAK!'
                  : `LIVE ZERO (1-5V SCALE)`}
              </text>
            </g>
          </svg>
        </div>

        {/* 24V Supply Budget Split Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>
              {language === 'es'
                ? 'Presupuesto de Voltaje de Fuente (24.0V DC):'
                : '24.0V DC Supply Compliance Voltage Split:'}
            </span>
            <span className="text-slate-300">
              Tx: {loopPhysics.txAvailableVolts.toFixed(1)}V | Cable:{' '}
              {loopPhysics.wireDropVolts.toFixed(1)}V | PLC 250Ω:{' '}
              {loopPhysics.shuntDropVolts.toFixed(1)}V
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden flex border border-white/10">
            <div
              style={{ width: `${(loopPhysics.txAvailableVolts / 24) * 100}%` }}
              className={`h-full transition-all ${
                loopPhysics.isDropout ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              title="Transmitter Headroom"
            />
            <div
              style={{ width: `${(loopPhysics.wireDropVolts / 24) * 100}%` }}
              className="h-full bg-amber-500 transition-all"
              title="Cable Resistance Drop"
            />
            <div
              style={{ width: `${(loopPhysics.shuntDropVolts / 24) * 100}%` }}
              className="h-full bg-cyan-400 transition-all"
              title="PLC 250 Ohm Shunt Drop"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM 35%: Tactile Sliders & Wire-Break Fault Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0F1F]/90 border border-white/10">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? '1. Presión Proceso' : '1. Process Pressure'}
            </span>
            <span className="text-amber-400 font-bold">
              {processPercent}% ({loopPhysics.commandedMa.toFixed(1)} mA)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            disabled={isWireBroken}
            value={processPercent}
            onChange={(e) => setProcessPercent(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? '0% = 4.0 mA (Cero Vivo) | 100% = 20.0 mA'
              : '0% = 4.0 mA (Live Zero) | 100% = 20.0 mA'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? '2. Resistencia Cable' : '2. Cable Impedance'}
            </span>
            <span
              className={`font-bold ${
                loopPhysics.isDropout ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {wireResistance} Ω
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="20"
            disabled={isWireBroken}
            value={wireResistance}
            onChange={(e) => setWireResistance(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30"
          />
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Satura a >500Ω cuando fluyen 20 mA'
              : 'Saturates >500Ω at 20 mA full scale'}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-300 block mb-1">
            {language === 'es' ? '3. Inyección de Falla Física' : '3. Physical Fault Injection'}
          </span>
          <button
            onClick={() => setIsWireBroken(!isWireBroken)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 border ${
              isWireBroken
                ? 'bg-rose-600/30 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-200 hover:bg-amber-500/25'
            }`}
          >
            <span>⚡</span>
            <span>
              {isWireBroken
                ? language === 'es'
                  ? ' EMPALMAR CABLE (RESTAURAR)'
                  : ' SPLICE WIRE (RESTORE 4-20mA)'
                : language === 'es'
                ? 'CORTAR CABLE (0.00 mA FAULT)'
                : 'CUT SIGNAL WIRE (0.00 mA)'}
            </span>
          </button>
          <span className="text-[10px] font-mono text-slate-400 mt-1">
            {language === 'es'
              ? 'Demuestra por qué 0% es 4 mA y no 0 mA'
              : 'Proves why 0% is 4 mA instead of 0 mA'}
          </span>
        </div>
      </div>
    </div>
  );
}
