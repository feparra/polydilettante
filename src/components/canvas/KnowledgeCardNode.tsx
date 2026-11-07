'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeData, CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';
import { Activity, Sparkles } from 'lucide-react';

interface KnowledgeCardNodeProps {
  data: NodeData;
  selected?: boolean;
}

export default function KnowledgeCardNode({ data, selected }: KnowledgeCardNodeProps) {
  const { language, selectedCategory, setActiveNodeId } = useAppStore();
  const categoryConfig = CATEGORY_COLORS[data.category];

  const isDimmed = selectedCategory !== 'all' && selectedCategory !== data.category;

  return (
    <div
      onClick={() => setActiveNodeId(data.id)}
      style={{
        boxShadow: selected
          ? `0 0 25px ${categoryConfig.glow}, inset 0 0 15px ${categoryConfig.glow}`
          : `0 0 15px rgba(0, 0, 0, 0.7)`,
        borderColor: selected ? categoryConfig.hex : 'rgba(255, 255, 255, 0.1)',
      }}
      className={`relative w-80 rounded-2xl p-4 cursor-pointer transition-all duration-300 backdrop-blur-xl bg-[#090C19]/85 border hover:scale-[1.02] hover:border-opacity-80 group ${
        isDimmed ? 'opacity-25' : 'opacity-100'
      }`}
    >
      {/* Invisible Handles for connections */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      {/* Category Tag & Live Telemetry Pill */}
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            color: categoryConfig.hex,
            backgroundColor: `rgba(${categoryConfig.rgb}, 0.12)`,
            borderColor: `rgba(${categoryConfig.rgb}, 0.35)`,
          }}
          className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: categoryConfig.hex }} />
          {categoryConfig.label[language]}
        </span>

        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">{language === 'es' ? 'ACTIVO' : 'LIVE'}</span>
        </span>
      </div>

      {/* Node Title */}
      <h3 className="text-sm font-bold text-slate-100 tracking-wide leading-snug group-hover:text-white mb-2 line-clamp-2">
        {data.title[language]}
      </h3>

      {/* Mini Metaphor Abstract */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {data.metaphor[language]}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {data.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Footer Button */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 group-hover:text-slate-200 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          {language === 'es' ? 'Explorar Laboratorio' : 'Launch Lab'}
        </span>
        <span
          style={{ color: categoryConfig.hex }}
          className="group-hover:translate-x-1 transition-transform"
        >
          →
        </span>
      </div>
    </div>
  );
}

