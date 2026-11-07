'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeData, CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';
import { Activity, Sparkles } from 'lucide-react';
import NodeMiniPreview from './NodeMiniPreview';

interface KnowledgeCardNodeProps {
  data: NodeData;
  selected?: boolean;
}

const FLOAT_DELAYS: Record<string, string> = {
  'quant-atr-velocity': '0s',
  'plc-current-loop': '1.5s',
  'cycloidal-drive-3d': '3.0s',
  'ai-smart-router': '4.5s',
};

export default function KnowledgeCardNode({ data, selected }: KnowledgeCardNodeProps) {
  const { language, selectedCategory, setActiveNodeId } = useAppStore();
  const categoryConfig = CATEGORY_COLORS[data.category];

  const isDimmed = selectedCategory !== 'all' && selectedCategory !== data.category;
  const delay = FLOAT_DELAYS[data.id] || '0s';

  return (
    <div
      onClick={() => setActiveNodeId(data.id)}
      style={{
        animationDelay: delay,
        boxShadow: selected
          ? `0 0 35px ${categoryConfig.glow}, inset 0 0 18px ${categoryConfig.glow}`
          : `0 12px 35px rgba(0, 0, 0, 0.8), 0 0 18px rgba(${categoryConfig.rgb}, 0.15)`,
        borderColor: selected ? categoryConfig.hex : `rgba(${categoryConfig.rgb}, 0.35)`,
      }}
      className={`animate-float-slow relative w-[340px] rounded-2xl p-4 cursor-pointer transition-all duration-300 backdrop-blur-2xl bg-[#080B16]/90 border hover:scale-[1.03] group ${
        isDimmed ? 'opacity-25 grayscale-[50%]' : 'opacity-100'
      }`}
    >
      {/* Invisible Handles for Cross-Pollination Edges */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      {/* Top Header: Category Pill & Live Simulator Status */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          style={{
            color: categoryConfig.hex,
            backgroundColor: `rgba(${categoryConfig.rgb}, 0.14)`,
            borderColor: `rgba(${categoryConfig.rgb}, 0.4)`,
          }}
          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold flex items-center gap-1.5"
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: categoryConfig.hex }}
          />
          {categoryConfig.label[language]}
        </span>

        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Activity className="w-3 h-3 animate-pulse" />
          <span className="font-semibold">60 FPS</span>
        </span>
      </div>

      {/* Live Animated SVG Mini-Preview (Mandatory v2.0) */}
      <div className="mb-3 group-hover:brightness-110 transition-all">
        <NodeMiniPreview simulatorId={data.simulatorId} />
      </div>

      {/* Node Title */}
      <h3 className="text-sm font-bold text-slate-100 tracking-wide leading-snug group-hover:text-white mb-1.5 line-clamp-2 font-mono">
        {data.title[language]}
      </h3>

      {/* Metaphor Abstract */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {data.metaphor[language]}
      </p>

      {/* Technical Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {data.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-300 group-hover:text-white flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5" style={{ color: categoryConfig.hex }} />
          {language === 'es' ? 'Abrir Cockpit Kinestésico' : 'Open Kinetic Cockpit'}
        </span>
        <span
          style={{ color: categoryConfig.hex }}
          className="font-bold group-hover:translate-x-1 transition-transform"
        >
          →
        </span>
      </div>
    </div>
  );
}
