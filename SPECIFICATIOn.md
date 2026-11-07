\# MASTER TECHNICAL SPECIFICATION: POLYDILETTANTE.COM  
\*\*Project Type:\*\* Interactive Visual Knowledge Management System & Kinetic Playground (VKMS)  
\*\*Domain:\*\* \`polydilettante.com\`  
\*\*Core Philosophy:\*\* "Dark Wunderkammer" (Bioluminescent Cabinet of Curiosities) — A living, tactile, bilingual (ES/EN) digital laboratory where multidisciplinary concepts (Engineering, Quantitative Trading, AI, 3D Mechanics, Software Architecture) are explored through physics-driven node graphs and interactive micro-simulators.

\---

\#\# 1\. ROL Y DIRECTIVA PARA EL AGENTE DE IA (DEVELOPER AGENT)  
Actúa como un Principal Frontend Architect, Creative Technologist y Physics UI Engineer. Tu objetivo es construir el código completo, funcional y listo para producción de \*\*PolyDilettante.com\*\*. 

\*\*Reglas Estrictas de Ejecución:\*\*  
1\. \*\*Cero Placeholders:\*\* No entregues componentes vacíos ni textos tipo "Lorem Ipsum". Implementa los 4 nodos semilla completos con sus micro-simuladores interactivos funcionando a 60 FPS.  
2\. \*\*Aprendizaje Kinestésico ("Ver, Tocar, Mover"):\*\* Ningún artículo puede ser solo texto estático. Cada tópico debe renderizar un laboratorio interactivo (Canvas HTML5 / SVG reactivo) controlado por sliders y toggles en tiempo real.  
3\. \*\*Bilingüismo Nativo Instantáneo (ES / EN):\*\* Toda la interfaz, los nodos, las simulaciones y el generador de prompts deben cambiar entre Español e Inglés instantáneamente mediante un estado global (\`LanguageContext\` o \`Zustand\`) sin recargar la página.  
4\. \*\*Flujo Sin Fricción (Zero-Friction Authoring):\*\* Incluye en la interfaz el modal \*\*"Prompt Studio (AI Synthesizer)"\*\*, que permite al usuario escribir cualquier tema nuevo y copiar con un clic el System Prompt maestro pre-formateado para que su LLM le devuelva el código exacto del nuevo nodo.

\---

\#\# 2\. TECH STACK & ARQUITECTURA RECOMENDADA  
\- \*\*Framework Core:\*\* Next.js (App Router, TypeScript) o Astro con Islas de React (Priorizar React 18+ para el manejo de estado de los simuladores y el lienzo).  
\- \*\*Estilos y UI:\*\* Tailwind CSS \+ \`lucide-react\` (iconografía) \+ \`framer-motion\` (transiciones espaciales y modales).  
\- \*\*Motor del Lienzo (The Living Cosmos):\*\* \`@xyflow/react\` (React Flow) personalizado con física de resorte o HTML5 Canvas \+ \`d3-force\` con soporte completo de Zoom, Pan, arrastre con inercia y líneas de conexión animadas con partículas SVG (\`stroke-dasharray\` \+ animación de flujo).  
\- \*\*Contenido:\*\* Estructura basada en un registro JSON/MDX tipado que mapea automáticamente cada \`simulator\_id\` con su componente interactivo en React.

\---

\#\# 3\. SISTEMA DE DISEÑO: "BIOLUMINESCENT WUNDERKAMMER"  
Olvida el diseño corporativo rígido. La interfaz debe sentirse como un cosmos profundo donde las ideas brillan y laten:

\#\#\# Paleta de Colores (CSS Variables / Tailwind)  
\- \*\*Canvas Deep Void (Fondo Principal):\*\* \`\#05050A\` (con una sutil cuadrícula de puntos radiales \`rgba(255, 255, 255, 0.06)\` que se escala con el zoom).  
\- \*\*Glass Surface (Tarjetas y Modales):\*\* \`rgba(13, 15, 26, 0.72)\` con \`backdrop-filter: blur(20px)\` y borde sutil \`1px solid rgba(255, 255, 255, 0.08)\`.  
\- \*\* Bioluminescent Category Accents (Colores por Disciplina):\*\*  
  \- \`Quantitative Trading\`: \`\#00F5D4\` (Cyan Bioluminiscente)  
  \- \`Engineering & Automation\`: \`\#FF6B35\` (Ámbar de Plasma / Industrial)  
  \- \`3D & Mechanics\`: \`\#F72585\` (Magenta Cinético)  
  \- \`AI & Agents\`: \`\#9B5DE5\` (Violeta Sináptico)  
  \- \`Software & Systems\`: \`\#3A86FF\` (Azul Eléctrico)

\#\#\# Tipografía  
\- \*\*Títulos / Display:\*\* \`Space Grotesk\` o \`Syne\` (carácter de laboratorio moderno y audaz).  
\- \*\*Cuerpo de Lectura:\*\* \`Plus Jakarta Sans\` o \`Inter\` (lectura limpia).  
\- \*\*Telemetría, Sliders y Código:\*\* \`JetBrains Mono\` (datos numéricos en tiempo real).

\---

\#\# 4\. ARQUITECTURA DE LA INTERFAZ (VISTAS Y COMPONENTES)

\#\#\# 4.1. HUD Superior Flotante (Navigation Bar)  
Barra flotante translúcida en la parte superior central:  
1\. \*\*Brand Identity:\*\* Icono de red sináptica \+ texto \*\*POLYDILETTANTE\*\* con subtítulo dinámico (\`"El Taller de las Ideas Conectadas"\` / \`"The Connected Ideas Playground"\`).  
2\. \*\*Filtros de Constelación (Pills):\*\* Botones para filtrar categorías (\`All\`, \`Quant Trading\`, \`Automation\`, \`3D & Mechanics\`, \`AI Systems\`). Al seleccionar una categoría, los nodos de esa disciplina brillan al 100% y los demás se atenúan al 25%, manteniendo visibles las conexiones de polinización cruzada.  
3\. \*\*Botón "+ Nuevo Artefacto (AI Prompt)":\*\* Abre el modal del \*\*Generador de Prompts\*\*.  
4\. \*\*Selector de Idioma (\`ES\` \| \`EN\`):\*\* Toggle con cambio instantáneo en caliente.

\#\#\# 4.2. El Lienzo Principal ("The Living Cosmos Canvas")  
\- \*\*Nodos Interactivos (Cards):\*\*  
  \- Muestran: Badge de categoría con resplandor, Título bilingüe, Mini-preview visual (icono animado o mini-gráfica SVG), Tags técnicos y un indicador de \*\*"Simulador Activo"\*\*.  
  \- \*\*Interacción Hover:\*\* Al pasar el mouse sobre un nodo, las líneas SVG que lo conectan con otros nodos se iluminan con su color de acento y muestran pulsos de luz viajando entre ambos nodos (indicando "Polinización Cruzada").  
  \- \*\*Interacción Click:\*\* Abre el \*\*Drawer/Modal de Inmersión Profunda (Artefacto Completo)\*\* con una transición suave.  
\- \*\*Controles de Cámara (Esquina Inferior Izquierda):\*\* Botones para \`Zoom In\`, \`Zoom Out\`, \`Centrar Constelación (Fit View)\` y \`Reorganizar Física (Force Layout)\`.

\#\#\# 4.3. Vista de Artefacto (El Modal / Drawer de Aprendizaje Kinestésico)  
Al abrir un nodo, se despliega una vista estructurada en un \*\*Bento Grid Dinámico\*\* con 5 bloques obligatorios:

1\. \*\*Header del Artefacto:\*\* Categoría, Título (ES/EN), Nodos Conectados (chips clicables para saltar a otros temas) y botón de cierre.  
2\. \*\*Bloque 1: La Intuición Visual (The Mechanical Metaphor):\*\* Explicación de 3 líneas en lenguaje directo y visual sobre qué empuja a qué y cuál es el mecanismo invisible.  
3\. \*\*Bloque 2: LABORATORIO INTERACTIVO (El Corazón de la Página):\*\*  
   \- Área izquierda/superior: \*\*Lienzo de Simulación en Tiempo Real\*\* (Gráfica reactiva, motor animado, red neuronal o engranaje cinético) con telemetría en vivo (\`JetBrains Mono\`).  
   \- Área derecha/inferior: \*\*Panel de Control Táctil (2 a 3 Sliders \+ Toggles)\*\* para que el usuario manipule las variables y observe el efecto inmediato.  
4\. \*\*Bloque 3: Anatomía del Mecanismo (3 Tarjetas Concisas):\*\*  
   \- ⚙️ \*El Motor (Principio Base)\*  
   \- ⚠️ \*El Punto de Ruptura (Dónde falla en la vida real)\*  
   \- 🎯 \*La Regla de Oro (Heurística o Fórmula Clave)\*  
5\. \*\*Bloque 4: Casos de Uso y Polinización Cruzada (3 Escenarios con Datos):\*\*  
   \- \*Caso Estándar (Aplicación directa con números reales).\*  
   \- \*Edge Case / Límite Extremo.\*  
   \- \*Polinización Cruzada (Destacado con borde brillante):\* Cómo usar este concepto en otra disciplina completamente distinta.  
6\. \*\*Bloque 5: Blueprint / Snippet de Implementación Rápida:\*\* Bloque de código con botón \`Copy Code\` listo para producción.

\---

\#\# 5\. ESPECIFICACIÓN DE LOS 4 SIMULADORES SEMILLA (OBLIGATORIOS EN EL MVP)  
El agente debe programar y entregar estos 4 nodos conectados entre sí con sus simuladores 100% funcionales desde el primer arranque:

\#\#\# Nodo 1: \`quant-atr-velocity\` (Quantitative Trading)  
\- \*\*Título ES/EN:\*\* Compresión de Velocidad y Filtro de Expansión ATR / Velocity Compression & ATR Expansion Filter  
\- \*\*Conexiones:\*\* \`\["plc-current-loop", "ai-smart-router"\]\`  
\- \*\*Simulador Interactivo:\*\*  
  \- \*Visual:\* Gráfico de velas/precio sintético con bandas de volatilidad dinámicas y marcadores de entrada (\`LONG\` / \`SHORT\`) y salida (\`Stop Loss\` / \`Take Profit\`).  
  \- \*Sliders:\* 1\) \`Multiplicador ATR (Umbral de Ruptura: 0.5x a 3.0x)\`, 2\) \`Velocidad de Cinta / Ticks por Segundo (10 a 200)\`, 3\) \`Ratio Riesgo/Beneficio (1:1 a 1:4)\`.  
  \- \*Efecto Visual:\* Al mover los sliders, se recalculan en vivo las señales válidas vs. el ruido de mercado (falsos rompimientos filtrados) y se actualiza el Win Rate estimado y la curva de equidad.  
\- \*\*Polinización Cruzada:\*\* Cómo el filtrado de ruido de una señal de precio en futuros (NQ/ES) utiliza exactamente el mismo principio de amortiguación e histéresis que un filtro pasa-bajos en un sensor industrial ruidoso.

\#\#\# Nodo 2: \`plc-current-loop\` (Engineering & Automation)  
\- \*\*Título ES/EN:\*\* Lazos de Corriente 4-20 mA y Diagnóstico de Cero Vivo / 4-20 mA Current Loops & Live-Zero Diagnostics  
\- \*\*Conexiones:\*\* \`\["quant-atr-velocity", "cycloidal-drive-3d"\]\`  
\- \*\*Simulador Interactivo:\*\*  
  \- \*Visual:\* Esquema animado de un transmisor industrial, cableado con flujo de electrones, resistencia de caída (\`250 Ω\`) y entrada analógica de un PLC mostrando la lectura en \`mA\` y \`Voltios (1-5V)\`.  
  \- \*Sliders & Toggles:\* 1\) \`Variable de Proceso (Presión/Flujo: 0% a 100%)\`, 2\) \`Resistencia de Cable / Caída de Línea (0 Ω a 500 Ω)\`, 3\) Botón Toggle: \`Simular Corte de Cable (0 mA)\`.  
  \- \*Efecto Visual:\* Muestra cómo la corriente se mantiene constante en \`4-20 mA\` a pesar de la resistencia del cable largo, y cómo al cortar el cable cae a \`0 mA\`, activando inmediatamente la alarma de \*\*"Fallo de Sensor / Cero Muerto"\*\* (algo imposible de distinguir del 0% real en un sistema de 0-10V o 0-20mA).  
\- \*\*Polinización Cruzada:\*\* Aplicación del concepto de "Cero Vivo" (\`4 mA\` como latido base) al diseño de arquitecturas de software y microservicios (diferenciar entre "0 eventos procesados" y "agente caído" mediante \*heartbeats\* activos).

\#\#\# Nodo 3: \`cycloidal-drive-3d\` (3D & Mechanics)  
\- \*\*Título ES/EN:\*\* Reductores Cicloidales Impresos en 3D: Alto Torque sin Backlash / 3D-Printed Cycloidal Drives: Zero-Backlash High Torque  
\- \*\*Conexiones:\*\* \`\["plc-current-loop"\]\`  
\- \*\*Simulador Interactivo:\*\*  
  \- \*Visual:\* Renderizado vectorial/Canvas 2D cinético en tiempo real de un reductor cicloidal mostrando el eje de entrada excéntrico, el disco cicloidal lobulado y los pines de salida fijos girando en sentidos opuestos.  
  \- \*Sliders:\* 1\) \`Número de Lóbulos / Pines (Relación de Reducción: 10:1 a 30:1)\`, 2\) \`RPM del Motor de Entrada (100 a 1500 RPM)\`, 3\) \`Excentricidad (mm)\`.  
  \- \*Efecto Visual:\* El disco cicloidal gira con su movimiento de bamboleo característico mientras el eje de salida rota lentamente multiplicando el torque calculado en pantalla (\`N·m\`).  
\- \*\*Polinización Cruzada:\*\* Cómo distribuir la carga entre múltiples dientes simultáneos (en vez de un solo diente de engranaje recto que se rompe en plástico PLA/PETG) equivale al balanceo de carga distribuido en clústeres de servidores.

\#\#\# Nodo 4: \`ai-smart-router\` (AI & Agents)  
\- \*\*Título ES/EN:\*\* Orquestación de Agentes y Enrutamiento Dinámico de Modelos / Multi-Agent Orchestration & Dynamic LLM Routing  
\- \*\*Conexiones:\*\* \`\["quant-atr-velocity", "plc-current-loop"\]\`  
\- \*\*Simulador Interactivo:\*\*  
  \- \*Visual:\* Diagrama de flujo neuronal animado donde entran paquetes de tareas por la izquierda, pasan por un nodo clasificador ("Smart Router") y se desvían hacia nodos de \*\*Modelos Locales Rápidos (Ollama/vLLM)\*\* o \*\*Modelos Cloud de Razonamiento Profundo\*\*.  
  \- \*Sliders:\* 1\) \`Complejidad de la Tarea (1 a 10)\`, 2\) \`Umbral de Confianza del Router (0.5 a 0.95)\`, 3\) \`Volumen de Peticiones/min (10 a 1000)\`.  
  \- \*Efecto Visual:\* Las partículas cambian de ruta en tiempo real y un medidor calcula el \*\*Costo Mensual (\$ USD)\*\* y la \*\*Latencia Media (ms)\*\* ahorrada frente a enviar todo a un modelo frontera costoso.  
\- \*\*Polinización Cruzada:\*\* Cómo un clasificador de prompts funciona igual que un variador de frecuencia (VFD) industrial: entrega solo la potencia computacional estrictamente necesaria según la carga mecánica del momento.

\---

\#\# 6\. COMPONENTE ESPECIAL: "PROMPT STUDIO" (GENERADOR DE ARTEFACTOS)  
Dentro de la aplicación, al hacer clic en \*\*"+ Nuevo Artefacto (AI Prompt)"\*\*, se abre un modal interactivo con:  
1\. \*\*Input de Tema:\*\* Un campo donde el usuario escribe qué quiere aprender o documentar (ej. \*"Filtro de Kalman aplicado a pares de trading y sensores robóticos"\*).  
2\. \*\*Selector de Categoría y Nodos Existentes:\*\* Checkboxes para marcar con qué nodos actuales quiere conectarlo.  
3\. \*\*Vista Previa y Botón "Copiar Prompt Maestro":\*\* Genera y copia al portapapeles el siguiente System Prompt inyectando dinámicamente el tema del usuario:

\`\`\`text  
Actúa como el Arquitecto de Conocimiento de PolyDilettante.com (Polímata Visual y Diseñador de Simuladores Interactivos).  
Transforma el tema: "{{USER\_TOPIC}}" en un objeto JSON/MDX bilingüe (ES/EN) listo para insertar en mi plataforma.

REGLAS DE DISEÑO DEL CONTENIDO:  
1\. Cero teoría densa: Usa analogías mecánicas/visuales inmediatas en 3 líneas.  
2\. Aprendizaje Kinestésico: Diseña un micro-simulador interactivo (HTML5 Canvas/SVG \+ React State) con 2-3 sliders manipulables que demuestren visualmente cómo funciona el fenómeno en tiempo real.  
3\. Casos de Uso Reales: Incluye 1 Caso Estándar con números reales, 1 Caso Extremo ( dónde se rompe) y 1 Caso de "Polinización Cruzada" (cómo aplicar este principio exacto en otra disciplina como Trading, Automatización, IA o Mecánica 3D).  
4\. Entrega el código completo del nodo siguiendo el esquema TypeScript \`KnowledgeNode\` de PolyDilettante.com.  
\`\`\`

\---

\#\# 7\. ESQUEMA DE DATOS TYPESCRIPT (\`types/knowledge.ts\`)  
El agente debe estructurar todos los nodos bajo esta interfaz estricta:

\`\`\`typescript  
export type CategoryId \= 'quant' \| 'automation' \| 'mechanics' \| 'ai' \| 'software';

export interface LocalizedText {  
  es: string;  
  en: string;  
}

export interface SimulatorControl {  
  id: string;  
  label: LocalizedText;  
  min: number;  
  max: number;  
  step: number;  
  defaultValue: number;  
  unit: string;  
}

export interface KnowledgeNode {  
  id: string;  
  title: LocalizedText;  
  subtitle: LocalizedText;  
  category: CategoryId;  
  accentColor: string;  
  position: { x: number; y: number }; // Coordenadas iniciales en el Cosmos  
  connections: string\[\]; // IDs de otros nodos conectados  
  tags: string\[\];  
  visualIntuition: LocalizedText; // Metáfora mecánica en 3 líneas  
  simulator: {  
    type: 'atr-velocity' \| 'current-loop' \| 'cycloidal-drive' \| 'smart-router' \| 'custom';  
    description: LocalizedText;  
    controls: SimulatorControl\[\];  
  };  
  anatomy: {  
    engine: LocalizedText;      // Principio base  
    breakingPoint: LocalizedText; // Punto de ruptura real  
    goldenRule: LocalizedText;  // Heurística o fórmula clave  
  };  
  useCases: {  
    standard: { title: LocalizedText; description: LocalizedText };  
    edgeCase: { title: LocalizedText; description: LocalizedText };  
    crossPollination: {   
      targetDiscipline: LocalizedText;   
      title: LocalizedText;   
      description: LocalizedText;  
    };  
  };  
  codeBlueprint: {  
    language: string;  
    filename: string;  
    code: string;  
  };  
}  
\`\`\`

\---

\#\# 8\. CRITERIOS DE ACEPTACIÓN Y VERIFICACIÓN  
Antes de dar por completada la tarea, verifica que:  
1\. El lienzo espacial permita hacer \*\*Pan (arrastrar el fondo)\*\*, \*\*Zoom con la rueda del mouse\*\*, y \*\*arrastrar los nodos individualmente\*\* actualizando las curvas Bézier/SVG que los conectan en tiempo real.  
2\. Las líneas de conexión tengan \*\*partículas animadas\*\* fluyendo entre nodos conectados.  
3\. Al hacer clic en cualquiera de los 4 nodos, se abra el Drawer con su \*\*Simulador Interactivo funcionando al 100%\*\* (mover cualquier slider debe alterar inmediatamente el gráfico/animación y los cálculos en pantalla).  
4\. El botón \*\*\`ES \| EN\`\*\* traduzca instantáneamente todos los textos, etiquetas de sliders, explicaciones y casos de uso.  
5\. El modal \*\*"Prompt Studio"\*\* permita ingresar un tema, seleccionar conexiones y copiar el prompt listo para usar.  
