'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeData, CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';
import { ArrowUpRight } from 'lucide-react';
import NodeMiniPreview from './NodeMiniPreview';

interface KnowledgeCardNodeProps {
  data: NodeData;
  selected?: boolean;
}

export default function KnowledgeCardNode({ data, selected }: KnowledgeCardNodeProps) {
  const { language, selectedCategory, setActiveNodeId } = useAppStore();
  const cat = CATEGORY_COLORS[data.category] || {
    hex: '#06B6D4',
    code: 'SYS',
    label: { es: 'Sistema', en: 'System' },
  };

  const isDimmed = selectedCategory !== 'all' && selectedCategory !== data.category;

  return (
    <div
      onClick={() => setActiveNodeId(data.id)}
      className={`relative w-[320px] rounded-lg p-3.5 cursor-pointer transition-all duration-150 bg-[#10131A] border ${
        selected
          ? 'border-cyan-400 shadow-[0_0_0_1px_#06B6D4]'
          : 'border-[#1E2533] hover:border-[#333E54] hover:bg-[#131720]'
      } ${isDimmed ? 'opacity-25' : 'opacity-100'}`}
    >
      {/* Invisible Handles */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      {/* Top Metadata Header */}
      <div className="flex items-center justify-between text-[10px] font-mono mb-2 pb-1.5 border-b border-[#1C2331]">
        <div className="flex items-center gap-1.5">
          <span
            style={{ color: cat.hex }}
            className="font-bold tracking-wider"
          >
            {cat.code}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-[150px]">
            {data.id}
          </span>
        </div>

        <span className="text-[9px] text-slate-500 font-mono">
          [SYS_ACTIVE]
        </span>
      </div>

      {/* Scientific Mini-Preview Diagram */}
      <div className="mb-2.5">
        <NodeMiniPreview simulatorId={data.simulatorId} />
      </div>

      {/* Title */}
      <h3 className="text-xs font-bold text-slate-100 font-mono mb-1.5 leading-snug line-clamp-2">
        {data.title[language]}
      </h3>

      {/* Concise Technical Metaphor */}
      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {data.metaphor[language]}
      </p>

      {/* Footer Tags & Open CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1C2331] text-[10px] font-mono text-slate-400">
        <span className="truncate max-w-[180px] text-slate-500">
          #{data.tags[0] || 'engineering'}
        </span>

        <span className="flex items-center gap-0.5 text-slate-300 hover:text-white transition-colors">
          <span>{language === 'es' ? 'Examinar' : 'Workbench'}</span>
          <ArrowUpRight className="w-3 h-3 text-cyan-400" />
        </span>
      </div>
    </div>
  );
}
