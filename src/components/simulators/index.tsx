import React from 'react';
import QuantAtrSimulator from './QuantAtrSimulator';
import PlcCurrentLoopSimulator from './PlcCurrentLoopSimulator';
import CycloidalDriveSimulator from './CycloidalDriveSimulator';
import AiSmartRouterSimulator from './AiSmartRouterSimulator';
import GenericAdaptiveSimulator from './GenericAdaptiveSimulator';

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
      // Fallback: If a new node was ingested without dedicated TSX, render the kinetic adaptive simulator!
      return <GenericAdaptiveSimulator title={simulatorId.toUpperCase()} />;
  }
}
