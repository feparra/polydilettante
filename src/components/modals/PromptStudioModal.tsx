'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export default function PromptStudioModal() {
  const { language, isPromptStudioOpen, setPromptStudioOpen } = useAppStore();
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('quant');
  const [copied, setCopied] = useState(false);

  if (!isPromptStudioOpen) return null;

  const generatedSystemPrompt = `Actúa como Principal Architect y Creative Technologist para PolyDilettante.com.
Genera un nuevo artefacto de conocimiento para el siguiente tema:

TEMA: "${topic.trim() || 'Ej: Filtros de Kalman en Navegación Inercial'}"
CATEGORÍA: ${category}

Entrega el código TypeScript exacto siguiendo la interfaz NodeData de PolyDilettante:
1. ID único en kebab-case.
2. Títulos y metáforas bilingües (ES y EN).
3. 3 Bloques anatómicos: Motor, Punto de Ruptura, Regla de Oro.
4. 3 Casos de estudio con números concretos (Estándar, Edge Case, y Polinización Cruzada).
5. Un micro-simulador en React (Canvas HTML5 / SVG) con sliders y telemetría a 60 FPS sin dependencias externas pesadas.
6. Snippet de código ejecutable de producción para el blueprint.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedSystemPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#090C19] border border-cyan-500/30 p-6 shadow-[0_0_50px_rgba(0,245,212,0.15)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                {language === 'es' ? 'Prompt Studio // AI Synthesizer' : 'Prompt Studio // AI Synthesizer'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'es'
                  ? 'Genera con un clic el System Prompt maestro para tu LLM'
                  : 'One-click master prompt generator for your LLM'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPromptStudioOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              {language === 'es' ? 'Concepto o Tema Técnico:' : 'Technical Concept or Topic:'}
            </label>
            <input
              type="text"
              placeholder={language === 'es' ? 'Ej: Filtros de Kalman en Navegación Inercial' : 'E.g. Kalman Filters in Inertial Navigation'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              {language === 'es' ? 'Disciplina / Categoría:' : 'Discipline / Category:'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#070913] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="quant">Quantitative Trading</option>
              <option value="engineering">Engineering & Automation</option>
              <option value="mechanics">3D & Mechanics</option>
              <option value="ai">AI & Agents</option>
              <option value="software">Software & Systems</option>
            </select>
          </div>

          {/* Formatted prompt preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                {language === 'es' ? 'System Prompt Generado:' : 'Generated Master Prompt:'}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-mono text-cyan-300 hover:text-cyan-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (language === 'es' ? 'Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar Prompt' : 'Copy Prompt')}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-[#05060C] border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {generatedSystemPrompt}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setPromptStudioOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:bg-white/10"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-xs font-semibold hover:opacity-95 shadow-md flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{language === 'es' ? 'Copiar Prompt Maestro' : 'Copy Master Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

