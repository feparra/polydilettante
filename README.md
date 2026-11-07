# PhilomatHub (philomathub.com)

**Bioluminescent Polymath Knowledge Management & Kinetic Playground (VKMS)**

A living, tactile, bilingual (ES/EN) digital laboratory where multidisciplinary concepts (Quantitative Trading, Industrial Automation, 3D Robotics, AI Agents, Software Architecture) are explored through physics-driven nodes and interactive micro-simulators.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS + PostCSS
- **Interactive Graph:** `@xyflow/react` (React Flow) with custom bioluminescent particle conduits
- **State & i18n:** Zustand hot-language switching (ES / EN)
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security)
- **Deployment:** Vercel

---

## Getting Started

1. Clone and install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://zwvcwgmxdgklxjbmhdxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
PHILOMATHUB_INGEST_KEY=your-secret-ingest-key
```

3. Run locally:
```bash
npm run dev
```
Navigate to `http://localhost:3000`.
