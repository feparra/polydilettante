'use client';

import React from 'react';
import CosmosCanvas from '@/components/canvas/CosmosCanvas';
import FloatingHud from '@/components/hud/FloatingHud';
import ArtifactDrawer from '@/components/drawer/ArtifactDrawer';
import PromptStudioModal from '@/components/modals/PromptStudioModal';

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05050A]">
      {/* Floating Dynamic HUD */}
      <FloatingHud />

      {/* Main Cosmos Graph Canvas */}
      <CosmosCanvas />

      {/* Kinesthetic Learning Bento Drawer */}
      <ArtifactDrawer />

      {/* AI Master Prompt Synthesizer Modal */}
      <PromptStudioModal />
    </main>
  );
}
