'use client';

import React, { useMemo, useCallback } from 'react';
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

import KnowledgeCardNode from './KnowledgeCardNode';
import BioluminescentEdge from './BioluminescentEdge';
import { useAppStore } from '@/store/useAppStore';

const nodeTypes = {
  knowledgeCard: KnowledgeCardNode,
};

const edgeTypes = {
  bioluminescent: BioluminescentEdge,
};

export default function CosmosCanvas() {
  const { nodes: appNodes, activeNodeId, setActiveNodeId, language } = useAppStore();

  const flowNodes: Node[] = useMemo(() => {
    return appNodes.map((node) => ({
      id: node.id,
      type: 'knowledgeCard',
      position: node.position,
      data: node,
      selected: node.id === activeNodeId,
    }));
  }, [appNodes, activeNodeId]);

  const flowEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    appNodes.forEach((sourceNode) => {
      sourceNode.connections.forEach((targetId) => {
        if (sourceNode.id < targetId) {
          edges.push({
            id: `edge-${sourceNode.id}-${targetId}`,
            source: sourceNode.id,
            target: targetId,
            type: 'bioluminescent',
          });
        }
      });
    });
    return edges;
  }, [appNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setActiveNodeId(node.id);
    },
    [setActiveNodeId]
  );

  return (
    <div className="w-full h-screen bg-[#0B0D11] lab-grid-bg relative overflow-hidden">
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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1C222F" gap={28} size={1} />
        <Controls className="!bg-[#11141B] !border !border-[#1E232E] !rounded-md !p-1 [&>button]:!bg-transparent [&>button]:!border-[#1E232E] [&>button]:!text-slate-400 hover:[&>button]:!bg-[#1C2331]" />
        <MiniMap
          nodeColor="#2A3549"
          maskColor="rgba(11, 13, 17, 0.85)"
          className="!bg-[#11141B] !border !border-[#1E232E] !rounded-md overflow-hidden"
        />
      </ReactFlow>

      {/* Discrete Technical Status Bar */}
      <div className="pointer-events-none fixed bottom-3 left-6 z-20 hidden md:flex items-center gap-2 text-[10px] font-mono text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
        <span>NETWORK ATLAS // TOPOLOGICAL SCHEMATIC</span>
        <span className="text-slate-700">|</span>
        <span>
          {language === 'es' ? 'Haz clic en cualquier nodo para abrir el banco de pruebas' : 'Select any system to inspect state equations'}
        </span>
      </div>
    </div>
  );
}
