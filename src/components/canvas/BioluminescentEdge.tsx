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
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g className="react-flow__edge-clean-conduit">
      {/* Background shadow line */}
      <path
        id={`${id}-bg`}
        d={edgePath}
        fill="none"
        stroke="#0E121A"
        strokeWidth={3}
      />

      {/* Clean Technical Dashed Bus */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="#2E384D"
        strokeWidth={1.2}
        strokeDasharray="4 4"
      />

      {/* Discrete Signal Indicator */}
      <circle r="2.5" fill="#06B6D4">
        <animateMotion dur="3.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </g>
  );
}
