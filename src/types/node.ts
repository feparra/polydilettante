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

export const CATEGORY_COLORS: Record<Category, {
  hex: string;
  rgb: string;
  glow: string;
  label: { es: string; en: string };
}> = {
  quant: {
    hex: '#00F5D4',
    rgb: '0, 245, 212',
    glow: 'rgba(0, 245, 212, 0.4)',
    label: { es: 'Trading Cuantitativo', en: 'Quantitative Trading' },
  },
  engineering: {
    hex: '#FF6B35',
    rgb: '255, 107, 53',
    glow: 'rgba(255, 107, 53, 0.4)',
    label: { es: 'Ingeniería y Automatización', en: 'Engineering & Automation' },
  },
  mechanics: {
    hex: '#F72585',
    rgb: '247, 37, 133',
    glow: 'rgba(247, 37, 133, 0.4)',
    label: { es: 'Mecánica 3D y Robótica', en: '3D & Mechanics' },
  },
  ai: {
    hex: '#9B5DE5',
    rgb: '155, 93, 229',
    glow: 'rgba(155, 93, 229, 0.4)',
    label: { es: 'Sistemas de IA y Agentes', en: 'AI & Agents' },
  },
  software: {
    hex: '#3A86FF',
    rgb: '58, 134, 255',
    glow: 'rgba(58, 134, 255, 0.4)',
    label: { es: 'Software y Arquitectura', en: 'Software & Systems' },
  },
};

