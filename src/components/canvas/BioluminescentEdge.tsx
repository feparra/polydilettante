'use client';

import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

export default function BioluminescentEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = (style?.stroke as string) || '#00F5D4';

  return (
    <g className="react-flow__edge-bioluminescent">
      {/* Outer Glow Path */}
      <path
        id={`${id}-glow`}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={4}
        strokeOpacity={0.22}
        style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
      />

      {/* Core Dashed Conduit */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeOpacity={0.65}
        strokeDasharray="6 6"
        className="animate-dash-flow"
      />

      {/* Travelling Synaptic Photon 1 */}
      <circle
        r="4"
        fill={strokeColor}
        style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
      >
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Travelling Synaptic Photon 2 (Reverse / Offset) */}
      <circle
        r="2.5"
        fill="#FFFFFF"
        style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
      >
        <animateMotion
          dur="2.5s"
          begin="1.25s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </g>
  );
}
