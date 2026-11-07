'use client';

import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { INITIAL_NODES } from '@/data/nodes';
import KnowledgeCardNode from './KnowledgeCardNode';
import BioluminescentEdge from './BioluminescentEdge';
import { CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';

const nodeTypes = {
  knowledgeCard: KnowledgeCardNode,
};

const edgeTypes = {
  bioluminescent: BioluminescentEdge,
};

export default function CosmosCanvas() {
  const { activeNodeId, setActiveNodeId, language } = useAppStore();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 65;
    const ny = (e.clientY / window.innerHeight - 0.5) * 65;
    setMouseOffset({ x: nx, y: ny });
  }, []);

  const initialFlowNodes: Node[] = useMemo(() => {
    return INITIAL_NODES.map((node) => ({
      id: node.id,
      type: 'knowledgeCard',
      position: node.position,
      data: node,
      selected: node.id === activeNodeId,
    }));
  }, [activeNodeId]);

  const initialFlowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    INITIAL_NODES.forEach((sourceNode) => {
      sourceNode.connections.forEach((targetId) => {
        if (sourceNode.id < targetId) {
          const catConfig = CATEGORY_COLORS[sourceNode.category];
          edges.push({
            id: `edge-${sourceNode.id}-${targetId}`,
            source: sourceNode.id,
            target: targetId,
            type: 'bioluminescent',
            style: {
              stroke: catConfig.hex,
            },
          });
        }
      });
    });
    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialFlowNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialFlowEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setActiveNodeId(node.id);
    },
    [setActiveNodeId]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-screen bg-[#05050A] relative overflow-hidden"
    >
      {/* Parallax Bioluminescent Deep Space Orbs */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          backgroundColor: '#00F5D4',
        }}
        className="pointer-events-none absolute top-[12%] left-[18%] w-[520px] h-[520px] rounded-full blur-[150px] opacity-[0.14] transition-transform duration-300 ease-out"
      />
      <div
        style={{
          transform: `translate3d(${-mouseOffset.x * 1.2}px, ${-mouseOffset.y * 1.2}px, 0)`,
          backgroundColor: '#9B5DE5',
        }}
        className="pointer-events-none absolute bottom-[10%] right-[16%] w-[580px] h-[580px] rounded-full blur-[160px] opacity-[0.15] transition-transform duration-300 ease-out"
      />
      <div
        style={{
          transform: `translate3d(${mouseOffset.y * 0.6}px, ${-mouseOffset.x * 0.6}px, 0)`,
          backgroundColor: '#F72585',
        }}
        className="pointer-events-none absolute top-[45%] left-[48%] w-[360px] h-[360px] rounded-full blur-[140px] opacity-[0.09] transition-transform duration-300 ease-out"
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.35}
        maxZoom={1.7}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(255, 255, 255, 0.08)" gap={34} size={1.5} />
        <Controls className="!bg-[#090C19]/85 !border !border-white/15 !rounded-xl !p-1 [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-slate-300 hover:[&>button]:!bg-white/10 shadow-2xl" />
        <MiniMap
          nodeColor={(n) => {
            const nodeData = INITIAL_NODES.find((item) => item.id === n.id);
            return nodeData ? CATEGORY_COLORS[nodeData.category].hex : '#00F5D4';
          }}
          maskColor="rgba(5, 5, 10, 0.85)"
          className="!bg-[#090C19]/90 !border !border-white/15 !rounded-xl overflow-hidden shadow-2xl"
        />
      </ReactFlow>

      {/* Bottom Center Interactive Telemetry Pill */}
      <div className="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#080B16]/80 border border-white/10 backdrop-blur-xl text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          {language === 'es' ? 'CONSTELACIÓN SINÁPTICA ACTIVA' : 'SYNAPTIC CONSTELLATION LIVE'}
        </span>
        <span className="text-white/20">|</span>
        <span>
          {language === 'es'
            ? 'Arrastra nodos o haz clic para abrir el Cockpit Kinestésico a 60 FPS'
            : 'Drag nodes or click any card to launch the 60 FPS Kinetic Cockpit'}
        </span>
      </div>
    </div>
  );
}
