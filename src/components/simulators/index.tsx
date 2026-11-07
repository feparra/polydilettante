import React from 'react';
import QuantAtrSimulator from './QuantAtrSimulator';
import PlcCurrentLoopSimulator from './PlcCurrentLoopSimulator';
import CycloidalDriveSimulator from './CycloidalDriveSimulator';
import AiSmartRouterSimulator from './AiSmartRouterSimulator';

export function getSimulatorComponent(simulatorId: string) {
  switch (simulatorId) {
    case 'quant-atr-velocity':
      return <QuantAtrSimulator />;
    case 'plc-current-loop':
      return <PlcCurrentLoopSimulator />;
    case 'cycloidal-drive-3d':
      return <CycloidalDriveSimulator />;
    case 'ai-smart-router':
      return <AiSmartRouterSimulator />;
    default:
      return (
        <div className="p-8 text-center text-slate-400 font-mono text-sm">
          Simulator [{simulatorId}] under construction in Bioluminescent Laboratory.
        </div>
      );
  }
}

