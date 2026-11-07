import { NodeData } from '@/types/node';

export const INITIAL_NODES: NodeData[] = [
  {
    id: 'quant-atr-velocity',
    category: 'quant',
    title: {
      es: 'Compresión de Velocidad y Filtro de Expansión ATR',
      en: 'Velocity Compression & ATR Expansion Filter',
    },
    tags: ['Volatility', 'ATR', 'Order Flow', 'Market Microstructure'],
    simulatorId: 'quant-atr-velocity',
    connections: ['plc-current-loop', 'ai-smart-router'],
    position: { x: 80, y: 110 },
    metaphor: {
      es: 'La volatilidad comprime la energía antes de la ruptura. Un filtro ATR con umbral dinámico actúa como una válvula de alivio que solo dispara cuando la velocidad del flujo supera la fricción del spread.',
      en: 'Volatility compresses energy prior to expansion. An ATR filter with dynamic threshold acts like a pressure relief valve triggering only when tape velocity exceeds spread friction.',
    },
    anatomy: {
      engine: {
        es: 'Cálculo del True Range suavizado exponencialmente contra la tasa de llegada de ticks en ventanas de micro-segundos.',
        en: 'Exponentially smoothed True Range benchmarked against tick arrival rate across microsecond windows.',
      },
      failure: {
        es: 'Spikes de baja liquidez (gaps) durante eventos macroeconómicos disparan falsos positivos sin volumen real.',
        en: 'Low liquidity gaps during high-impact news release trigger false breakout events devoid of genuine volume.',
      },
      rule: {
        es: 'Umbral = ATR(14) × Multiplicador. Ejecutar orden solo si (Ticks/sec) > (Mediana 100 barras × 1.8).',
        en: 'Threshold = ATR(14) × Multiplier. Fire order only if (Ticks/sec) > (100-bar Median × 1.8).',
      },
    },
    cases: {
      standard: {
        es: 'Ruptura matutina en futuros E-mini Nasdaq (NQ) filtrando el 78% de falsos amagues en la primera media hora.',
        en: 'Morning breakout in E-mini Nasdaq futures (NQ) filtering out 78% of opening fakeouts.',
      },
      edge: {
        es: 'Aperturas tras fines de semana con gaps del 2%: la volatilidad histórica distorsiona el umbral por 45 minutos.',
        en: 'Weekend re-opens with 2% gaps: historical volatility distorts the expansion threshold for 45 minutes.',
      },
      crossPollination: {
        es: 'Idéntico a la histéresis y supresión de rebote (debouncing) en sensores industriales de conmutación rápida.',
        en: 'Functionally identical to hysteresis and contact debouncing in high-speed industrial optical switches.',
      },
    },
    blueprint: {
      lang: 'typescript',
      code: `export function evaluateAtrVelocityBreakout(
  prices: number[],
  highs: number[],
  lows: number[],
  ticksPerSec: number,
  atrMultiplier: number = 1.5
): { shouldTrigger: boolean; signal: 'LONG' | 'SHORT' | 'IDLE'; currentAtr: number } {
  const period = 14;
  if (prices.length < period + 1) return { shouldTrigger: false, signal: 'IDLE', currentAtr: 0 };

  let trSum = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - prices[i - 1]),
      Math.abs(lows[i] - prices[i - 1])
    );
    trSum += tr;
  }
  const atr = trSum / period;
  const lastClose = prices[prices.length - 1];
  const prevClose = prices[prices.length - 2];
  const delta = lastClose - prevClose;

  const threshold = atr * atrMultiplier;
  const isHighVelocity = ticksPerSec > 65;

  if (Math.abs(delta) > threshold && isHighVelocity) {
    return {
      shouldTrigger: true,
      signal: delta > 0 ? 'LONG' : 'SHORT',
      currentAtr: atr,
    };
  }

  return { shouldTrigger: false, signal: 'IDLE', currentAtr: atr };
}`,
    },
  },
  {
    id: 'plc-current-loop',
    category: 'engineering',
    title: {
      es: 'Lazos de Corriente 4-20 mA y Diagnóstico de Cero Vivo',
      en: '4-20 mA Current Loops & Live-Zero Diagnostics',
    },
    tags: ['Industrial Automation', 'Sensors', 'Analog Signal', 'Fault Detection'],
    simulatorId: 'plc-current-loop',
    connections: ['quant-atr-velocity', 'cycloidal-drive-3d'],
    position: { x: 640, y: 80 },
    metaphor: {
      es: 'La corriente no se degrada con la distancia del cable como el voltaje. El "cero vivo" en 4 mA permite distinguir al instante un sensor en reposo (4 mA) de un cable cortado catastróficamente (0 mA).',
      en: 'Current does not drop across long wire distances unlike voltage. The 4 mA "live-zero" immediately discriminates a transducer resting at zero (4 mA) from a catastrophic broken wire (0 mA).',
    },
    anatomy: {
      engine: {
        es: 'Fuente de corriente constante modulada por el transductor con resistencia de carga estándar de 250 Ω convirtiendo 4-20 mA en 1-5 V en el ADC del PLC.',
        en: 'Transducer-modulated constant current source with 250 Ω precision burden resistor converting 4-20 mA into 1-5 V at the PLC analog input.',
      },
      failure: {
        es: 'Lazos de tierra y caídas por impedancia excesiva cuando el loop supera el voltaje de cumplimiento de la fuente (compliance voltage).',
        en: 'Ground loop interference and saturation when cumulative loop resistance exceeds supply compliance voltage.',
      },
      rule: {
        es: 'Si Corriente < 3.6 mA → Alarma de Rotura de Bucle (Loop Break). Si Corriente > 21.0 mA → Alarma de Cortocircuito.',
        en: 'If Current < 3.6 mA → Loop Break Fault. If Current > 21.0 mA → Transducer Short Circuit Fault.',
      },
    },
    cases: {
      standard: {
        es: 'Transmisor de presión diferencial en caldera industrial a 200 metros del rack de control PLC.',
        en: 'Industrial boiler differential pressure transmitter located 200 meters away from the PLC control rack.',
      },
      edge: {
        es: 'Calentamiento resistivo extremo en bandeja portacables incrementa la resistencia del bucle a 480 Ω.',
        en: 'High ambient temperature in cable trays elevates line resistance to 480 Ω, nearing supply saturation.',
      },
      crossPollination: {
        es: 'El "cero vivo" es análogo a los Heartbeats y pings de salud TCP en microservicios: silencio no es cero, es muerte del servicio.',
        en: 'Live-zero is identical to keep-alive heartbeats in distributed microservices: true silence is not zero, it is system death.',
      },
    },
    blueprint: {
      lang: 'typescript',
      code: `export interface LoopDiagnostic {
  currentMa: number;
  voltageDrop: number;
  processValuePercent: number;
  status: 'NORMAL' | 'FAULT_BROKEN_WIRE' | 'FAULT_OVERCURRENT' | 'OUT_OF_SPEC';
}

export function readCurrentLoop(rawMilliAmps: number, burdenResistorOhms = 250): LoopDiagnostic {
  const voltage = (rawMilliAmps / 1000) * burdenResistorOhms;

  if (rawMilliAmps < 3.5) {
    return {
      currentMa: rawMilliAmps,
      voltageDrop: voltage,
      processValuePercent: 0,
      status: 'FAULT_BROKEN_WIRE',
    };
  }

  if (rawMilliAmps > 21.5) {
    return {
      currentMa: rawMilliAmps,
      voltageDrop: voltage,
      processValuePercent: 100,
      status: 'FAULT_OVERCURRENT',
    };
  }

  const clamped = Math.max(4, Math.min(20, rawMilliAmps));
  const processValue = ((clamped - 4) / 16) * 100;

  return {
    currentMa: rawMilliAmps,
    voltageDrop: Number(voltage.toFixed(3)),
    processValuePercent: Number(processValue.toFixed(2)),
    status: 'NORMAL',
  };
}`,
    },
  },
  {
    id: 'cycloidal-drive-3d',
    category: 'mechanics',
    title: {
      es: 'Reductor Cicloidal y Mecánica de Cero Holgura',
      en: 'Cycloidal Speed Reducers & Zero-Backlash Kinematics',
    },
    tags: ['Robotics', 'Gears', 'Kinematics', 'Zero Backlash', 'Actuators'],
    simulatorId: 'cycloidal-drive-3d',
    connections: ['plc-current-loop', 'ai-smart-router'],
    position: { x: 550, y: 550 },
    metaphor: {
      es: 'A diferencia de los engranajes tradicionales que contactan en un solo diente, el disco cicloidal distribuye el par contactando simultáneamente el 70% de los pines perimetrales, eliminando el backlash.',
      en: 'Unlike involute gears contacting on a single fragile point, a cycloidal disc shares torque across 70% of perimeter rollers simultaneously, eliminating gear backlash.',
    },
    anatomy: {
      engine: {
        es: 'Eje excéntrico de entrada que oscila un disco cicloidal con N lóbulos contra un anillo estator con N+1 pines de rodillo.',
        en: 'Input eccentric camshaft orbiting a cycloidal disc having N lobes against a stationary ring with N+1 roller pins.',
      },
      failure: {
        es: 'Cargas de choque excesivas fatigan los rodamientos de apoyo de la leva excéntrica antes que los lóbulos.',
        en: 'Severe impact loading fatigues eccentric cam support bearings well before cycloidal tooth shear.',
      },
      rule: {
        es: 'Relación de Reducción = R = (Pines - Lóbulos) / Lóbulos. Con 11 lóbulos y 12 pines: R = 1:11 en una sola etapa.',
        en: 'Gear Ratio R = (Pins - Lobes) / Lobes. With 11 lobes and 12 pins: R = 1:11 in a single compact stage.',
      },
    },
    cases: {
      standard: {
        es: 'Articulación principal del codo en un brazo robótico de 6 ejes de soldadura automotriz con precisión de 0.02 mm.',
        en: 'Six-axis industrial automotive welding arm main elbow joint maintaining 0.02 mm repeatability.',
      },
      edge: {
        es: 'Inversión de torque a 3000 RPM: si la lubricación hidrodinámica se rompe, la fricción de rodadura se vuelve deslizamiento.',
        en: 'Torque reversal at 3000 RPM input: breakdown of hydrodynamic lubricant films turns rolling shear into abrasive wear.',
      },
      crossPollination: {
        es: 'Distribución de carga idéntica a los algoritmos de consenso tolerante a fallas bizantinas (BFT): la carga se valida entre múltiples nodos simultáneos.',
        en: 'Torque distribution mirrors Byzantine Fault Tolerant consensus algorithms: work integrity is shared over multi-node quorum.',
      },
    },
    blueprint: {
      lang: 'typescript',
      code: `export interface CycloidalState {
  eccentricAngleRad: number;
  discRotationAngleRad: number;
  reductionRatio: number;
  outputTorqueNm: number;
  activeContactPoints: number;
}

export function computeCycloidalKinematics(
  inputAngleDegrees: number,
  numLobes: number = 10,
  numPins: number = 11,
  inputTorqueNm: number = 2.5,
  efficiency: number = 0.88
): CycloidalState {
  const reductionRatio = numLobes / (numPins - numLobes);
  const inputRad = (inputAngleDegrees * Math.PI) / 180;
  const discRotationRad = -(inputRad / reductionRatio);

  return {
    eccentricAngleRad: inputRad,
    discRotationAngleRad: discRotationRad,
    reductionRatio,
    outputTorqueNm: Number((inputTorqueNm * reductionRatio * efficiency).toFixed(2)),
    activeContactPoints: Math.floor(numLobes * 0.7),
  };
}`,
    },
  },
  {
    id: 'ai-smart-router',
    category: 'ai',
    title: {
      es: 'Enrutador Semántico de Modelos y Cascada de Costes LLM',
      en: 'Semantic Model Router & LLM Cost-Performance Cascade',
    },
    tags: ['AI Agents', 'Embeddings', 'Model Routing', 'Inference Optimization'],
    simulatorId: 'ai-smart-router',
    connections: ['quant-atr-velocity', 'cycloidal-drive-3d'],
    position: { x: 100, y: 550 },
    metaphor: {
      es: 'No necesitas una excavadora para plantar una flor. Un clasificador semántico ligero analiza la entropía del prompt para enviar consultas simples a modelos ultrarrápidos y reservar los modelos gigantes para razonamiento complejo.',
      en: 'You do not deploy an industrial excavator to plant a flower. A lightweight semantic discriminator measures prompt perplexity, triaging trivial queries to instant micro-models while conserving frontier models for deep reasoning.',
    },
    anatomy: {
      engine: {
        es: 'Cálculo de similitud coseno vectorial contra centroides de complejidad y scoring de intención en menos de 10 ms.',
        en: 'Vector cosine similarity clustering against task complexity centroids and intent scoring in under 10 ms.',
      },
      failure: {
        es: 'Inyección de prompts adversariales que inflan la complejidad artificialmente para forzar el agotamiento de cuotas y costos.',
        en: 'Adversarial prompt jailbreaks that inject synthetic cognitive tokens forcing maximum token pricing tier.',
      },
      rule: {
        es: 'Complejidad < 0.35 → Flash/Edge ($0.075/1M). Complejidad 0.35-0.75 → Mid-tier ($0.50/1M). > 0.75 → Frontier ($5.00/1M).',
        en: 'Complexity < 0.35 → Flash/Edge ($0.075/1M). 0.35-0.75 → Mid-tier ($0.50/1M). > 0.75 → Frontier ($5.00/1M).',
      },
    },
    cases: {
      standard: {
        es: 'Helpdesk de soporte técnico con 500,000 consultas/día: reducción de costos de inferencia del 84% manteniendo 99.1% de precisión.',
        en: 'Enterprise support helpdesk handling 500,000 queries/day: 84% LLM inference cost reduction with 99.1% eval score.',
      },
      edge: {
        es: 'Prompt corto con ambigüedad extrema: "¿Por qué falló el motor?". Sin contexto previo, el clasificador subestima la complejidad.',
        en: 'Ultra-terse ambiguous prompt: "Why did the engine stall?". Zero historical context causes severe router misclassification.',
      },
      crossPollination: {
        es: 'Idéntico al enrutamiento de paquetes BGP en Internet y el despacho de carga en subestaciones eléctricas.',
        en: 'Mirrors autonomous BGP packet routing and dynamic reserve power triage in national electrical power grids.',
      },
    },
    blueprint: {
      lang: 'typescript',
      code: `export type ModelTier = 'EDGE_MICRO' | 'BALANCED_MID' | 'FRONTIER_REASONING';

export interface RouteDecision {
  modelTier: ModelTier;
  estimatedCostPer1M: number;
  estimatedLatencyMs: number;
  complexityScore: number;
}

export function routePrompt(prompt: string, reasoningRequested: boolean): RouteDecision {
  const tokenEstimate = prompt.trim().split(/\\s+/).length;
  const hasCodeKeywords = /(code|function|debug|algorithm|refactor|sql|class)/i.test(prompt);
  const hasComplexKeywords = /(prove|deduce|architect|quantum|differential|theorem)/i.test(prompt);

  let complexity = 0.15;
  if (tokenEstimate > 120) complexity += 0.25;
  if (hasCodeKeywords) complexity += 0.3;
  if (hasComplexKeywords || reasoningRequested) complexity += 0.35;

  complexity = Math.min(1.0, complexity);

  if (complexity < 0.35 && !reasoningRequested) {
    return {
      modelTier: 'EDGE_MICRO',
      estimatedCostPer1M: 0.075,
      estimatedLatencyMs: 180,
      complexityScore: Number(complexity.toFixed(2)),
    };
  }

  if (complexity <= 0.70) {
    return {
      modelTier: 'BALANCED_MID',
      estimatedCostPer1M: 0.60,
      estimatedLatencyMs: 650,
      complexityScore: Number(complexity.toFixed(2)),
    };
  }

  return {
    modelTier: 'FRONTIER_REASONING',
    estimatedCostPer1M: 6.50,
    estimatedLatencyMs: 2400,
    complexityScore: Number(complexity.toFixed(2)),
  };
}`,
    },
  },
];

