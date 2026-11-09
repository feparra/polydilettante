export type Category = 'quant' | 'engineering' | 'mechanics' | 'ai' | 'software';

export type Language = 'es' | 'en';

export interface NodeData extends Record<string, unknown> {
  id: string;
  category: Category;
  title: {
    es: string;
    en: string;
  };
  tags: string[];
  simulatorId: string;
  connections: string[];
  position: {
    x: number;
    y: number;
  };
  metaphor: {
    es: string;
    en: string;
  };
  anatomy: {
    engine: { es: string; en: string };
    failure: { es: string; en: string };
    rule: { es: string; en: string };
  };
  cases: {
    standard: { es: string; en: string };
    edge: { es: string; en: string };
    crossPollination: { es: string; en: string };
  };
  blueprint: {
    code: string;
    lang: string;
  };
}

export const CATEGORY_COLORS: Record<
  Category,
  {
    hex: string;
    rgb: string;
    glow: string;
    label: { es: string; en: string };
    code: string;
  }
> = {
  quant: {
    hex: '#06B6D4', // Precision Cyan / Volatility instrument
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.2)',
    label: { es: 'Trading Cuantitativo', en: 'Quantitative Finance' },
    code: 'SEC-01',
  },
  engineering: {
    hex: '#F59E0B', // Precision Amber / Industrial Instrument
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.2)',
    label: { es: 'Automatización & Lazos', en: 'Control & Automation' },
    code: 'SEC-02',
  },
  mechanics: {
    hex: '#EC4899', // Kinematics Pink / Precision Machinery
    rgb: '236, 72, 153',
    glow: 'rgba(236, 72, 153, 0.2)',
    label: { es: 'Cinemática & Mecánica', en: 'Kinematics & Robotics' },
    code: 'SEC-03',
  },
  ai: {
    hex: '#8B5CF6', // Purple / Neural Routing
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.2)',
    label: { es: 'Sistemas IA & Inferencia', en: 'AI & Inference Architecture' },
    code: 'SEC-04',
  },
  software: {
    hex: '#3B82F6', // Blue / Systems
    rgb: '59, 130, 246',
    glow: 'rgba(59, 130, 246, 0.2)',
    label: { es: 'Sistemas Distribuidos', en: 'Distributed Systems' },
    code: 'SEC-05',
  },
};
