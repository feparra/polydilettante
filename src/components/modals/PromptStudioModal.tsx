'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, Copy, Check, Sparkles, Terminal, FileCode, ArrowDownToLine, Loader2, AlertCircle } from 'lucide-react';

const UNIVERSAL_LLM_PROMPT = `Actúa como Curador de Conocimiento e Ingeniero Polímata para PhilomatHub.com.
Toma los conceptos, descubrimientos o lecciones de nuestra conversación y formatéalos en un ÚNICO objeto JSON válido listo para ingerir.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con el bloque de código JSON dentro de \`\`\`json ... \`\`\`. Sin texto introductorio ni explicaciones adicionales.
2. Todo debe ser bilingüe exacto (ES y EN) y mantener rigor técnico sin palabras de relleno.
3. El ID debe ser en kebab-case único (ej: "kalman-inertial-nav", "bft-consensus-quorum").
4. "category" debe ser exactamente una de: "quant" | "engineering" | "mechanics" | "ai" | "software".
5. "connections" debe ser un array con 1 a 3 IDs de conceptos relacionados para polinización cruzada.
6. Incluye los 3 bloques anatómicos (engine, failure, rule) y los 3 casos prácticos (standard, edge, crosspollination) con datos concretos.
7. "blueprint_code" debe ser una función TypeScript concisa y lista para producción.

ESTRUCTURA EXACTA DEL JSON:
{
  "id": "ej-nombre-en-kebab-case",
  "category": "engineering",
  "title_es": "Título Preciso en Español",
  "title_en": "Accurate Title in English",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "simulator_id": "ej-nombre-en-kebab-case",
  "connections": ["plc-current-loop", "ai-smart-router"],
  "metaphor_es": "Explicación de 2 a 3 líneas sobre qué empuja a qué en el mundo real.",
  "metaphor_en": "2 to 3-line mechanical metaphor on what physically drives what.",
  "anatomy_engine_es": "El principio físico o matemático fundamental.",
  "anatomy_engine_en": "The core mathematical or physical principle.",
  "anatomy_failure_es": "Dónde y por qué falla catastróficamente en la práctica.",
  "anatomy_failure_en": "Where and why it fails catastrophically in production.",
  "anatomy_rule_es": "Heurística o fórmula clave en una sola línea.",
  "anatomy_rule_en": "Golden rule or key formula in a single line.",
  "case_standard_es": "Caso de uso de aplicación estándar con números reales.",
  "case_standard_en": "Standard application case study with real metrics.",
  "case_edge_es": "Límite extremo o escenario de estrés térmico/computacional.",
  "case_edge_en": "Extreme boundary or stress condition.",
  "case_crosspollination_es": "Cómo se aplica exactamente esta misma ley en otra disciplina distinta.",
  "case_crosspollination_en": "How this identical mathematical law applies in another field.",
  "blueprint_code": "export function calculateSomething(param: number): number { return param * 2; }",
  "blueprint_lang": "typescript"
}`;

export default function PromptStudioModal() {
  const { language, isPromptStudioOpen, setPromptStudioOpen, addNode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'prompt' | 'import'>('prompt');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('engineering');
  const [copied, setCopied] = useState(false);

  // Import JSON State
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  if (!isPromptStudioOpen) return null;

  const customizedPrompt = `${UNIVERSAL_LLM_PROMPT}

TEMA ESPECÍFICO A FORMATEAR:
"${topic.trim() || 'Concepto discutido previamente'}" (Categoría sugerida: ${category})`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(customizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIngestJson = async () => {
    setIsSubmitting(true);
    setImportStatus({ type: 'idle', message: '' });

    try {
      let cleaned = jsonInput.trim();
      // Remove markdown code fences if present
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
      if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);

      if (!parsed.id || !parsed.title_es || !parsed.title_en) {
        throw new Error(
          language === 'es'
            ? 'El JSON no contiene los campos obligatorios: id, title_es, title_en.'
            : 'JSON is missing required fields: id, title_es, title_en.'
        );
      }

      // Call our internal API endpoint
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ingest-key': 'f615cdce16f358de555da9f5e8b73549957b35f881889852',
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al persistir en Supabase.');
      }

      // Add to local state so it appears immediately on canvas without reload
      const formattedNode = {
        id: parsed.id,
        category: parsed.category || 'software',
        title: { es: parsed.title_es, en: parsed.title_en },
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Polymath'],
        simulatorId: parsed.simulator_id || parsed.id,
        connections: Array.isArray(parsed.connections) ? parsed.connections : [],
        position: {
          x: parsed.position_x || Math.floor(Math.random() * 500) + 120,
          y: parsed.position_y || Math.floor(Math.random() * 350) + 120,
        },
        metaphor: { es: parsed.metaphor_es || '', en: parsed.metaphor_en || '' },
        anatomy: {
          engine: { es: parsed.anatomy_engine_es || '', en: parsed.anatomy_engine_en || '' },
          failure: { es: parsed.anatomy_failure_es || '', en: parsed.anatomy_failure_en || '' },
          rule: { es: parsed.anatomy_rule_es || '', en: parsed.anatomy_rule_en || '' },
        },
        cases: {
          standard: { es: parsed.case_standard_es || '', en: parsed.case_standard_en || '' },
          edge: { es: parsed.case_edge_es || '', en: parsed.case_edge_en || '' },
          crossPollination: { es: parsed.case_crosspollination_es || '', en: parsed.case_crosspollination_en || '' },
        },
        blueprint: {
          code: parsed.blueprint_code || '// PolyDilettante Blueprint',
          lang: parsed.blueprint_lang || 'typescript',
        },
      };

      addNode(formattedNode);

      setImportStatus({
        type: 'success',
        message:
          language === 'es'
            ? `¡Artefacto [${parsed.id}] montado con éxito en PhilomatHub!`
            : `Artifact [${parsed.id}] successfully mounted to PhilomatHub!`,
      });
      setJsonInput('');
      setTimeout(() => {
        setPromptStudioOpen(false);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setImportStatus({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090C19] border border-cyan-500/35 p-6 shadow-[0_0_60px_rgba(0,245,212,0.18)] space-y-5 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white font-mono">
                {language === 'es' ? 'AI Knowledge Synthesizer' : 'AI Knowledge Synthesizer'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'es'
                  ? 'Genera el prompt para tu LLM o pega el JSON para montarlo directo en la web'
                  : 'Generate universal LLM prompts or paste JSON to mount directly into your lab'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setPromptStudioOpen(false)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: 1. Prompt Generator vs 2. Paste & Ingest */}
        <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'prompt'
                ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-300" />
            <span>{language === 'es' ? '1. Copiar Prompt Universal' : '1. Copy Universal Prompt'}</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'import'
                ? 'bg-purple-500/20 border border-purple-400/40 text-purple-200 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4 text-purple-300" />
            <span>{language === 'es' ? '2. Pegar JSON y Montar Nodo' : '2. Paste JSON & Mount'}</span>
          </button>
        </div>

        {/* TAB 1: PROMPT GENERATOR FOR ANY LLM */}
        {activeTab === 'prompt' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  {language === 'es' ? 'Tema o Concepto Investigado:' : 'Investigated Concept or Topic:'}
                </label>
                <input
                  type="text"
                  placeholder={
                    language === 'es'
                      ? 'Ej: Algoritmo Raft de Consenso Distribuido'
                      : 'E.g. Raft Distributed Consensus Protocol'
                  }
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  {language === 'es' ? 'Disciplina Principal:' : 'Target Discipline:'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070913] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="quant">Quantitative Trading</option>
                  <option value="engineering">Engineering & Automation</option>
                  <option value="mechanics">3D & Mechanics</option>
                  <option value="ai">AI & Agents</option>
                  <option value="software">Software & Systems</option>
                </select>
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-300" />
                  {language === 'es'
                    ? 'Prompt Universal (Funciona con Gemini, ChatGPT, Claude, OpenClaw):'
                    : 'Universal Prompt (Works with Gemini, ChatGPT, Claude, OpenClaw):'}
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'es' ? '¡Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar Prompt' : 'Copy Prompt')}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-2xl bg-[#04060C] border border-white/10 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                {customizedPrompt}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: PASTE JSON & MOUNT DIRECTLY TO SUPABASE */}
        {activeTab === 'import' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs font-mono text-purple-200 leading-relaxed">
              {language === 'es'
                ? '💡 Pega el bloque de código JSON que te devolvió Gemini, ChatGPT o Claude. La app validará la estructura y lo montará instantáneamente en tu Supabase y en la constelación.'
                : '💡 Paste the JSON block returned by your LLM. The app validates schema integrity and publishes directly to Supabase and into your living constellation.'}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                {language === 'es' ? 'Pega el Bloque JSON:' : 'Paste JSON Payload:'}
              </label>
              <textarea
                rows={9}
                placeholder={`{\n  "id": "raft-consensus-protocol",\n  "category": "software",\n  "title_es": "Consenso Distribuido Raft",\n  "title_en": "Raft Distributed Consensus",\n  ...\n}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#04060C] border border-white/10 text-cyan-200 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
              />
            </div>

            {/* Status alerts */}
            {importStatus.type === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500 text-rose-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importStatus.message}</span>
              </div>
            )}

            {importStatus.type === 'success' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs font-mono">
                <Check className="w-4 h-4 shrink-0" />
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
          <div className="text-[10px] font-mono text-slate-500">
            {language === 'es'
              ? 'Endpoint para agentes: POST /api/nodes'
              : 'Agent endpoint: POST /api/nodes'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPromptStudioOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:bg-white/10 transition-all"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>

            {activeTab === 'prompt' ? (
              <button
                onClick={handleCopyPrompt}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-xs font-bold hover:brightness-110 shadow-lg flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{language === 'es' ? 'Copiar Prompt para el LLM' : 'Copy Prompt for LLM'}</span>
              </button>
            ) : (
              <button
                onClick={handleIngestJson}
                disabled={isSubmitting || !jsonInput.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white font-mono text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all shadow-lg flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowDownToLine className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? language === 'es'
                      ? 'Validando y Montando...'
                      : 'Mounting...'
                    : language === 'es'
                    ? 'Montar en PhilomatHub'
                    : 'Mount Artifact'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
