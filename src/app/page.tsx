'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import CosmosCanvas from '@/components/canvas/CosmosCanvas';
import ArcadeDeck from '@/components/canvas/ArcadeDeck';
import FloatingHud from '@/components/hud/FloatingHud';
import ArtifactStageModal from '@/components/stage/ArtifactStageModal';
import PromptStudioModal from '@/components/modals/PromptStudioModal';

export default function HomePage() {
  const { viewMode } = useAppStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05050A]">
      {/* Floating Dynamic HUD with Dual-Mode Explorer Switch */}
      <FloatingHud />

      {/* Dual-Mode Main Stage: Orbital Constellation vs. Interactive Arcade Deck */}
      {viewMode === 'cosmos' ? <CosmosCanvas /> : <ArcadeDeck />}

      {/* Widescreen Split-Stage Kinetic Cockpit (60% Lab / 40% Layered Tabs) */}
      <ArtifactStageModal />

      {/* AI Master Prompt Synthesizer Modal */}
      <PromptStudioModal />
    </main>
  );
}
