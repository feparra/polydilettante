'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function PlcCurrentLoopSimulator() {
  const { language } = useAppStore();
  const [processValue, setProcessValue] = useState(62); // 0 to 100%
  const [wireResistance, setWireResistance] = useState(120); // 0 to 500 ohms
  const [isBrokenWire, setIsBrokenWire] = useState(false);

  const metrics = useMemo(() => {
    if (isBrokenWire) {
      return {
        currentMa: 0.0,
        voltage: 0.0,
        status: 'CRITICAL_ALARM_BROKEN_WIRE',
        statusColor: 'text-rose-500',
        borderColor: 'border-rose-500/40',
        liveZeroOk: false,
      };
    }

    const currentMa = 4.0 + (processValue / 100) * 16.0;
    const burdenResistor = 250;
    const dropVoltage = (currentMa / 1000) * (burdenResistor + wireResistance);
    const plcAdcVoltage = (currentMa / 1000) * burdenResistor;

    const complianceOk = dropVoltage < 24.0;

    return {
      currentMa: currentMa.toFixed(2),
      voltage: plcAdcVoltage.toFixed(3),
      totalDrop: dropVoltage.toFixed(2),
      status: !complianceOk ? 'VOLTAGE_SATURATION_ERROR' : 'HEALTHY_LOOP_ACTIVE',
      statusColor: complianceOk ? 'text-amber-400' : 'text-amber-600',
      borderColor: 'border-amber-500/30',
      liveZeroOk: true,
    };
  }, [processValue, wireResistance, isBrokenWire]);

  return (
    <div className="flex flex-col gap-5 p-4 rounded-xl bg-[#090B14]/80 border border-white/10 backdrop-blur-md">
      {/* Visual Industrial Loop Schematic */}
      <div className={`relative h-48 w-full rounded-lg bg-[#05060B] border ${metrics.borderColor} overflow-hidden flex flex-col justify-between p-3`}>
        <div className="flex items-center justify-between text-xs font-mono text-amber-400/90">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isBrokenWire ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
            4-20mA CURRENT TRANSMITTER // PLC CHANNEL 01
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px]">
            {metrics.status}
          </span>
        </div>

        {/* Dynamic Schematic Diagram */}
        <div className="relative w-full h-24 flex items-center justify-between px-4">
          {/* Sensor block */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-12 rounded border border-amber-500/50 bg-amber-950/20 flex flex-col items-center justify-center text-[10px] font-mono text-amber-300">
              <span>SENSOR</span>
              <span className="text-[8px] text-slate-400">{processValue}% PSI</span>
            </div>
          </div>

          {/* Wire connection line */}
          <div className="relative flex-1 mx-3 h-0.5 bg-slate-800 flex items-center justify-center">
            {isBrokenWire ? (
              <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500 text-rose-400 text-[10px] font-mono font-bold">
                ✕ CABLE CORTADO (0 mA)
              </span>
            ) : (
              <div className="w-full flex items-center justify-around overflow-hidden">
                <span className="w-2 h-1 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-amber-400/80">{metrics.currentMa} mA</span>
                <span className="w-2 h-1 bg-amber-400 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* PLC Receiver block */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-12 rounded border border-slate-700 bg-slate-900/60 flex flex-col items-center justify-center text-[10px] font-mono text-slate-300 px-1">
              <span>PLC ADC</span>
              <span className="text-[9px] text-amber-300">{metrics.voltage}V (250Ω)</span>
            </div>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Corriente Bucle' : 'Loop Current'}
            </span>
            <span className="text-amber-400 font-semibold">{metrics.currentMa} mA</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Lectura ADC' : 'ADC Voltage'}
            </span>
            <span className="text-amber-300 font-semibold">{metrics.voltage} V</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase">
              {language === 'es' ? 'Diagnóstico' : 'Diagnosis'}
            </span>
            <span className={metrics.statusColor + ' font-semibold'}>
              {metrics.liveZeroOk ? (language === 'es' ? 'Cero Vivo OK' : 'Live Zero OK') : (language === 'es' ? 'Falla Cable' : 'Wire Broken')}
            </span>
          </div>
        </div>
      </div>

      {/* Sliders and Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Variable de Proceso (0% - 100%)' : 'Process Variable (0% - 100%)'}
            </span>
            <span className="text-amber-400 font-bold">{processValue}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            disabled={isBrokenWire}
            value={processValue}
            onChange={(e) => setProcessValue(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">
              {language === 'es' ? 'Resistencia de Cable (Caída Ω)' : 'Line Resistance Drop (Ω)'}
            </span>
            <span className="text-amber-400 font-bold">{wireResistance} Ω</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            disabled={isBrokenWire}
            value={wireResistance}
            onChange={(e) => setWireResistance(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-30"
          />
        </div>

        <div className="pt-1">
          <button
            onClick={() => setIsBrokenWire(!isBrokenWire)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
              isBrokenWire
                ? 'bg-rose-600/30 border border-rose-500 text-rose-300 hover:bg-rose-600/40'
                : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            <span>⚡</span>
            {isBrokenWire
              ? (language === 'es' ? 'RECONECTAR CABLE DE SEÑAL' : 'RECONNECT SIGNAL WIRE')
              : (language === 'es' ? 'SIMULAR CORTE DE CABLE (0 mA)' : 'SIMULATE BROKEN WIRE (0 mA)')}
          </button>
        </div>
      </div>
    </div>
  );
}

