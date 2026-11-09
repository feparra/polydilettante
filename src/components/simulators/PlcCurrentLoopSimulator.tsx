'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function PlcCurrentLoopSimulator() {
  const { language } = useAppStore();
  const [processPercent, setProcessPercent] = useState(55);
  const [wireResistance, setWireResistance] = useState(180);
  const [isWireBroken, setIsWireBroken] = useState(false);

  const loopPhysics = useMemo(() => {
    const supplyVoltage = 24.0;
    const minTxCompliance = 9.0;
    const shuntResistor = 250;

    if (isWireBroken) {
      return {
        commandedMa: 4 + (processPercent / 100) * 16,
        actualMa: 0,
        adcVolts: 0,
        wireDropVolts: 0,
        shuntDropVolts: 0,
        txAvailableVolts: supplyVoltage,
        isDropout: false,
        status: 'OPEN_CIRCUIT_FAULT',
      };
    }

    const commandedMa = 4.0 + (processPercent / 100) * 16.0;
    const totalResistance = wireResistance + shuntResistor;
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
      status: isDropout ? 'COMPLIANCE_DROPOUT' : 'LOOP_NORMAL',
    };
  }, [processPercent, wireResistance, isWireBroken]);

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-3.5 rounded-lg bg-[#0E1118] border border-[#1E2533] font-mono">
      {/* Industrial Diagnostic Header */}
      <div className="flex items-center justify-between border-b border-[#1A202C] pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-white font-bold tracking-wider">
            LOOP-DIAG // 4-20mA LIVE-ZERO
          </span>
          <span className="text-slate-500 text-[10px]">
            [24V DC ISOLATED]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isWireBroken
                ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                : loopPhysics.isDropout
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
            }`}
          >
            {isWireBroken
              ? 'FAULT: WIRE BREAK (0 mA)'
              : loopPhysics.isDropout
              ? 'WARNING: COMPLIANCE LIMIT'
              : 'HEALTHY: LIVE-ZERO OK'}
          </span>
        </div>
      </div>

      {/* Circuit Schematic Workstation */}
      <div className="relative flex-1 min-h-[260px] w-full rounded bg-[#07090D] border border-[#1A202C] p-3 flex flex-col justify-between">
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <svg className="w-full h-full max-h-[190px] overflow-visible" viewBox="0 0 680 200">
            {/* Base Technical Wiring Bus */}
            <rect x="120" y="45" width="440" height="110" rx="3" fill="none" stroke="#1E2638" strokeWidth="2" />

            {/* Live Current Path */}
            {!isWireBroken && (
              <rect
                x="120"
                y="45"
                width="440"
                height="110"
                rx="3"
                fill="none"
                stroke={loopPhysics.isDropout ? '#EF4444' : '#F59E0B'}
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
            )}

            {/* Broken Cable Visual */}
            {isWireBroken && (
              <g>
                <line x1="120" y1="45" x2="310" y2="45" stroke="#334155" strokeWidth="2" />
                <line x1="370" y1="45" x2="560" y2="45" stroke="#334155" strokeWidth="2" />
                <rect x="315" y="33" width="50" height="24" rx="2" fill="#24070F" stroke="#F43F5E" strokeWidth="1" />
                <text x="340" y="49" textAnchor="middle" fill="#FDA4AF" fontSize="9" fontFamily="monospace">
                  OPEN
                </text>
              </g>
            )}

            {/* Left Transmitter Block */}
            <g transform="translate(50, 70)">
              <rect x="0" y="0" width="135" height="60" rx="3" fill="#10141D" stroke="#F59E0B" strokeWidth="1.2" />
              <text x="67" y="18" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                2-WIRE PRESSURE TX
              </text>
              <text x="67" y="36" textAnchor="middle" fill="#E2E8F0" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {processPercent}% PSI
              </text>
              <text x="67" y="50" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">
                V_avail: {loopPhysics.txAvailableVolts.toFixed(1)}V (min 9V)
              </text>
            </g>

            {/* Right Shunt / PLC Block */}
            <g transform="translate(500, 70)">
              <rect x="0" y="0" width="135" height="60" rx="3" fill="#10141D" stroke="#06B6D4" strokeWidth="1.2" />
              <text x="67" y="18" textAnchor="middle" fill="#06B6D4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                PLC ADC SHUNT
              </text>
              <text x="67" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="monospace" fontWeight="bold">
                {loopPhysics.adcVolts.toFixed(2)} V
              </text>
              <text x="67" y="50" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">
                250 Ω ±0.1% PRECISION
              </text>
            </g>

            {/* Top Wire Resistance Drop Block */}
            {!isWireBroken && (
              <g transform="translate(300, 32)">
                <rect x="0" y="0" width="85" height="26" rx="2" fill="#0C0F17" stroke="#2B364C" strokeWidth="1" />
                <text x="42.5" y="11" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="monospace">
                  CABLE DROP
                </text>
                <text x="42.5" y="21" textAnchor="middle" fill="#F59E0B" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                  {wireResistance}Ω (-{loopPhysics.wireDropVolts.toFixed(1)}V)
                </text>
              </g>
            )}

            {/* Bottom 24V Supply */}
            <g transform="translate(285, 140)">
              <rect x="0" y="0" width="115" height="30" rx="2" fill="#0C0F17" stroke="#3B82F6" strokeWidth="1" />
              <text x="57.5" y="14" textAnchor="middle" fill="#3B82F6" fontSize="8" fontFamily="monospace">
                +24V DC RAIL
              </text>
              <text x="57.5" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontFamily="monospace" fontWeight="bold">
                I = {loopPhysics.actualMa.toFixed(2)} mA
              </text>
            </g>
          </svg>
        </div>

        {/* Linear Voltage Headroom Monitor */}
        <div className="space-y-1 pt-2 border-t border-[#161C26]">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>VOLTAGE COMPLIANCE BUDGET (24.0V DC):</span>
            <span className="text-slate-300">
              Tx: {loopPhysics.txAvailableVolts.toFixed(1)}V | Line: {loopPhysics.wireDropVolts.toFixed(1)}V | Shunt: {loopPhysics.shuntDropVolts.toFixed(1)}V
            </span>
          </div>
          <div className="w-full h-1.5 rounded bg-[#161B26] overflow-hidden flex">
            <div style={{ width: `${(loopPhysics.txAvailableVolts / 24) * 100}%` }} className={`h-full ${loopPhysics.isDropout ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <div style={{ width: `${(loopPhysics.wireDropVolts / 24) * 100}%` }} className="h-full bg-amber-500" />
            <div style={{ width: `${(loopPhysics.shuntDropVolts / 24) * 100}%` }} className="h-full bg-cyan-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded bg-[#090C12] border border-[#1A202C]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">1. Proceso (Transductor)</span>
            <span className="text-amber-400 font-bold">{processPercent}% ({loopPhysics.commandedMa.toFixed(1)} mA)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            disabled={isWireBroken}
            value={processPercent}
            onChange={(e) => setProcessPercent(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-amber-500 disabled:opacity-20"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">2. Resistencia Cable (R_line)</span>
            <span className="text-amber-400 font-bold">{wireResistance} Ω</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="20"
            disabled={isWireBroken}
            value={wireResistance}
            onChange={(e) => setWireResistance(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-[#1E2533] rounded appearance-none cursor-pointer accent-amber-500 disabled:opacity-20"
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={() => setIsWireBroken(!isWireBroken)}
            className={`w-full py-1.5 px-3 rounded text-xs font-bold transition-colors border ${
              isWireBroken
                ? 'bg-rose-950/50 border-rose-600 text-rose-300 hover:bg-rose-900/50'
                : 'bg-[#181E2B] border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            {isWireBroken ? 'RESTABLECER CABLE' : 'CORTAR CABLE (PROBAR 0 mA)'}
          </button>
        </div>
      </div>
    </div>
  );
}
