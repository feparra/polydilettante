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

import { INITIAL_NODES } from '@/data/nodes';
import KnowledgeCardNode from './KnowledgeCardNode';
import { CATEGORY_COLORS } from '@/types/node';
import { useAppStore } from '@/store/useAppStore';

const nodeTypes = {
  knowledgeCard: KnowledgeCardNode,
};

export default function CosmosCanvas() {
  const { activeNodeId, setActiveNodeId } = useAppStore();

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
        // avoid duplicate reversed edge definitions
        if (sourceNode.id < targetId) {
          const catConfig = CATEGORY_COLORS[sourceNode.category];
          edges.push({
            id: `edge-${sourceNode.id}-${targetId}`,
            source: sourceNode.id,
            target: targetId,
            animated: true,
            style: {
              stroke: catConfig.hex,
              strokeWidth: 2,
              filter: `drop-shadow(0 0 6px ${catConfig.hex})`,
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
    <div className="w-full h-screen bg-[#05050A] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="rgba(255, 255, 255, 0.07)"
          gap={32}
          size={1.5}
        />
        <Controls
          className="!bg-[#0D0F1A]/80 !border !border-white/10 !rounded-xl !p-1 [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-slate-300 hover:[&>button]:!bg-white/10"
        />
        <MiniMap
          nodeColor={(n) => {
            const nodeData = INITIAL_NODES.find((item) => item.id === n.id);
            return nodeData ? CATEGORY_COLORS[nodeData.category].hex : '#3A86FF';
          }}
          maskColor="rgba(5, 5, 10, 0.85)"
          className="!bg-[#090C19]/90 !border !border-white/10 !rounded-xl overflow-hidden shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
}

