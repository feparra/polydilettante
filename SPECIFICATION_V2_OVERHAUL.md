# ARCHITECTURAL & VISUAL OVERHAUL DIRECTIVE (v2.0): POLYDILETTANTE.COM
**Target:** Antigravity Developer Agent
**Objective:** Refactor the MVP (`http://localhost:3000`) to eliminate the "empty React Flow diagram" look, replace the cramped side-drawer with a Fullscreen Split-Stage Cockpit, and transform the 4 simulators from numerical `useMemo` calculators into real-time 60 FPS kinetic visual playgrounds (HTML5 Canvas / Animated SVG).

---

## 1. DIAGNÓSTICO DE FALLOS EN LA V1.0 (QUÉ DEBES CORREGIR AHORA MISMO)
Tu implementación anterior cumplió con TypeScript y el estado global, pero falló en la experiencia sensorial y kinestésica:
1. **Fallo del Lienzo (`CosmosCanvas.tsx`):** Usar `@xyflow/react` por defecto con fondo de puntos estáticos hace que la página parezca un clon vacío de n8n o Zapier con 4 cajas quietas. **Corrección:** Necesitamos un modo dual (**Orbital Constellation** con física viva y mini-previews animados dentro de cada tarjeta + **Interactive Arcade Deck** en cuadrícula para explorar sin fricción espacial).
2. **Fallo del Drawer (`ArtifactDrawer.tsx`):** Meter 5 bloques densos apilados en un cajón lateral obliga a hacer scroll infinito y achica el simulador. **Corrección:** Elimina el Drawer lateral. Al abrir un nodo, despliega un **Widescreen Split-Stage Modal (92vw x 88vh)** donde el 60% izquierdo es el Laboratorio Visual gigante (sin scroll) y el 40% derecho son 3 pestañas limpias (`[1. Intuición & Anatomía]`, `[2. Polinización & Casos]`, `[3. Blueprint Code]`).
3. **Fallo de los Simuladores (`src/components/simulators/*`):** Tus simuladores actuales son simples calculadoras en `useMemo` que solo cambian números en pantalla (`winRate.toFixed(1)`). El usuario es 100% visual y kinestésico: **si mueve un slider, tiene que VER el mecanismo físico, las partículas, los engranajes o las ondas cambiar su geometría y velocidad en tiempo real.**

---

## 2. ACTUALIZACIÓN DEL STORE GLOBAL (`src/store/useAppStore.ts`)
Agrega el control de modo de vista (`viewMode: 'cosmos' | 'arcade'`) y la pestaña activa del escenario (`activeTab: 'intuition' | 'cases' | 'blueprint'`):

```typescript
import { create } from 'zustand';
import { Language, Category } from '@/types/node';

interface AppState {
  language: Language;
  toggleLanguage: () => void;
  viewMode: 'cosmos' | 'arcade';
  setViewMode: (mode: 'cosmos' | 'arcade') => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (cat: Category | 'all') => void;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  activeStageTab: 'intuition' | 'cases' | 'blueprint';
  setActiveStageTab: (tab: 'intuition' | 'cases' | 'blueprint') => void;
  isPromptStudioOpen: boolean;
  setPromptStudioOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'es',
  toggleLanguage: () => set((s) => ({ language: s.language === 'es' ? 'en' : 'es' })),
  viewMode: 'cosmos',
  setViewMode: (viewMode) => set({ viewMode }),
  selectedCategory: 'all',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  activeNodeId: null,
  setActiveNodeId: (activeNodeId) => set({ activeNodeId, activeStageTab: 'intuition' }),
  activeStageTab: 'intuition',
  setActiveStageTab: (activeStageTab) => set({ activeStageTab }),
  isPromptStudioOpen: false,
  setPromptStudioOpen: (isPromptStudioOpen) => set({ isPromptStudioOpen }),
}));
```

---

## 3. REDISEÑO DE LA PORTADA: DUAL-MODE EXPLORER (`CosmosCanvas.tsx` + `ArcadeDeck.tsx`)

### 3.1. Switch en el `FloatingHud.tsx`
Añade un selector segmentado en el HUD superior con iconos de `lucide-react`:
- 🌌 **Constelación (`cosmos`):** Grafo interactivo con atmósfera espacial.
- 🎛️ **Laboratorio / Arcade (`arcade`):** Vista de galería Bento interactiva a pantalla completa donde las tarjetas son grandes y muestran telemetría viva sin tener que arrastrar el lienzo.

### 3.2. Mejoras Obligatorias en la Vista Constelación (`CosmosCanvas.tsx` y `KnowledgeCardNode.tsx`)
1. **Fondo Bioluminiscente Profundo (No solo puntitos de React Flow):**
   - Añade detrás de React Flow dos orbes de luz difusa (`blur-[140px]`, opacidad `0.15`) que se muevan suavemente con el cursor (efecto paralaje) usando los colores `#00F5D4` (Cyan) y `#9B5DE5` (Violeta).
2. **Flotación Orgánica (Breathing Nodes):**
   - Cada `KnowledgeCardNode` debe tener una animación CSS continua de flotación (`@keyframes float` en `globals.css` con distintos `animation-delay` por nodo) para que el grafo se sienta vivo aunque el usuario no toque el mouse.
3. **Live Mini-Previews en cada Tarjeta (`KnowledgeCardNode.tsx`):**
   - Prohibido que la tarjeta sea solo texto. Incluye un área de `h-24` dentro de cada nodo que renderice un **SVG animado en vivo**:
     - *Nodo Quant:* Una onda de precio con una banda superior parpadeando en cyan.
     - *Nodo PLC 4-20mA:* Una línea con puntos luminosos ámbar corriendo de izquierda a derecha.
     - *Nodo Cicloidal 3D:* Dos anillos concéntricos en magenta rotando con CSS `animate-spin`.
     - *Nodo AI Router:* Un nodo central bifurcando pulsos violetas hacia dos salidas.
4. **Cables de Polinización Cruzada (Animated Edges):**
   - Reemplaza las líneas grises por `CustomEdge` en SVG con doble capa: una línea base con `filter: drop-shadow(0 0 6px currentColor)` y un círculo luminoso (`<circle r="4">`) animado con `<animateMotion dur="2.5s" repeatCount="indefinite">` viajando físicamente de un nodo a otro.

---

## 4. REEMPLAZO DEL DRAWER POR EL "WIDESCREEN STAGE COCKPIT" (`ArtifactStageModal.tsx`)
Elimina `ArtifactDrawer.tsx` y crea `ArtifactStageModal.tsx`. Cuando `activeNodeId !== null`, se abre un modal centrado sobre el lienzo con `backdrop-blur-2xl bg-[#05050A]/90 border border-white/15 rounded-3xl w-[94vw] max-w-[1600px] h-[88vh] overflow-hidden flex flex-col shadow-2xl`.

### Estructura Interna del Cockpit (Sin Scroll Global):
- **Top Bar (Altura fija `64px`):**
  - Izquierda: Badge luminoso de Categoría + Título del Nodo + Chips clicables de **"Conexiones de Polinización"** (hacer clic en un chip cambia inmediatamente `activeNodeId` al nodo conectado con una animación suave).
  - Derecha: Botón `ES | EN` y botón `ESC / Cerrar (X)`.
- **Cuerpo Principal (`flex-1 grid grid-cols-12 overflow-hidden`):**
  - **COLUMNA IZQUIERDA (7 Columnas - `col-span-12 lg:col-span-7`): EL JUGUETE KINESTÉSICO (Simulador Full-Height)**
    - Ocupa todo el alto disponible. Arriba tiene el **Lienzo Visual Interactivo (Canvas 2D / SVG Reactivo)** ocupando el 65% de la altura, y justo debajo el **Panel Táctil de Sliders y Toggles** (35% de la altura) con tarjetas de telemetría en tiempo real.
  - **COLUMNA DERECHA (5 Columnas - `col-span-12 lg:col-span-5`): CONOCIMIENTO POR CAPAS (Sistema de 3 Pestañas)**
    - Barra de 3 Tabs en la parte superior derecha:
      1. **`[ ⚡ 1. Intuición & Anatomía ]`:** Muestra la *Metáfora Mecánica* destacada arriba y debajo las 3 tarjetas visuales: **⚙️ El Motor**, **⚠️ Punto de Ruptura**, y **🎯 Regla de Oro**.
      2. **`[ 🔀 2. Casos & Polinización ]`:** Muestra el *Caso Estándar*, el *Caso Extremo (Edge Case)*, y una tarjeta especial con borde brillante animado para la **Polinización Cruzada** (con un botón directo para saltar al nodo de esa otra disciplina).
      3. **`[ 💻 3. Blueprint Code ]`:** Bloque de código limpio a altura completa con resaltado, nombre de archivo y botón `Copy Code` con feedback visual.

---

## 5. REINGENIERÍA VISUAL DE LOS 4 SIMULADORES (DE CALCULADORAS A FÍSICA REAL)
Reescribe los 4 archivos en `src/components/simulators/` para que rendericen gráficos dinámicos a 60 FPS que respondan físicamente a los sliders:

### 5.1. `QuantAtrSimulator.tsx` (Osciloscopio de Ruptura y Velocidad de Cinta)
- **Lo que el usuario DEBE VER:**
  - Un gráfico SVG/Canvas dinámico con **40 velas japonesas sintéticas** y un canal envolvente sombreado (Bandas ATR superior e inferior).
  - Cuando el usuario mueve el slider **`Multiplicador ATR (0.5x - 3.0x)`**, las bandas superior e inferior se ensanchan o contraen visualmente en tiempo real sobre las velas.
  - Las velas que superan la banda se iluminan en `#00F5D4` con una etiqueta `BREAKOUT ENTRY` y proyectan una caja verde (`Take Profit`) y roja (`Stop Loss`) cuya altura crece o se encoge en vivo al mover el slider **`Risk/Reward Ratio`**. Las velas que quedan dentro de la banda se vuelven grises translúcidas (`FILTERED NOISE`).
  - Al mover **`Velocidad de Cinta (Ticks/sec)`**, una barra de pulso en la derecha late más rápido y dibuja una mini-curva de equidad (PnL acumulado) proyectada en la esquina superior.

### 5.2. `PlcCurrentLoopSimulator.tsx` (Circuito Físico Animado 4-20 mA)
- **Lo que el usuario DEBE VER:**
  - Un diagrama esquemático industrial en SVG oscuro que muestra: `[Fuente 24V DC]` ➔ `[Transmisor de Presión]` ➔ `[Cable Largo con Resistencia Variable]` ➔ `[Resistencia Shunt 250Ω en PLC]` ➔ `[ADC Display]`.
  - **Partículas de Electrones:** Puntos brillantes color `#FF6B35` corriendo físicamente por el circuito cerrado. La velocidad y densidad de las partículas es proporcional a los miliamperios (`4 mA` = flujo lento pero constante; `20 mA` = flujo rápido e intenso).
  - **Simulación de Caída de Línea (`Wire Resistance 0Ω - 1000Ω`):** Muestra una barra de voltaje de la fuente (`24V`) dividiéndose visualmente entre "Caída en el Cable" y "Voltaje Disponible en el Transmisor". Si la resistencia sube tanto que la caída supera el límite de cumplimiento, el cable se pone al rojo vivo (`VOLTAGE DROPOUT`).
  - **Botón Toggle `Cortar Cable (Simulate Wire Break)`:** Al activarlo, **el cable SVG se parte físicamente en dos con un icono de chispa**, todas las partículas de electrones se detienen en seco (`0.00 mA`), y el panel del PLC parpadea en rojo con la alerta `LIVE-ZERO FAULT DETECTED (0 mA < 4 mA)` explicando visualmente por qué `4 mA` es un "latido vivo".

### 5.3. `CycloidalDriveSimulator.tsx` (Cinemática Epitrocoidal en Tiempo Real)
- **Lo que el usuario DEBE VER:**
  - Un `requestAnimationFrame` en HTML5 Canvas o SVG trigonométrico que dibuja y **hace girar en tiempo real**:
    1. El anillo exterior de **Pines Fijos** (`N` círculos blancos/grises).
    2. El **Eje de Entrada Excéntrico** en el centro girando a alta velocidad (`inputRpm`).
    3. El **Disco Cicloidal Lobulado** (`N-1` lóbulos en color `#F72585`) orbitando excéntricamente (bamboleándose) mientras gira lentamente en **sentido contrario** al eje de entrada.
    4. Los **Pines de Salida** con vectores de fuerza luminosos mostrando cómo el 70% de los lóbulos comparten la carga simultáneamente.
  - Cuando el usuario mueve el slider de **`Número de Lóbulos`** o **`RPM de Entrada`**, la geometría de la curva epitrocoidal y las velocidades relativas de giro de ambos ejes cambian instantáneamente frente a sus ojos.

### 5.4. `AiSmartRouterSimulator.tsx` (Conmutador de Tráfico Neuronal con Partículas)
- **Lo que el usuario DEBE VER:**
  - Un sistema de partículas en tiempo real donde entran **paquetes de consultas (esferas luminosas)** desde la izquierda a una frecuencia dictada por el slider **`Volumen de Peticiones/min`**.
  - En el centro hay un **Prisma Clasificador ("Smart Router Gate")**. Cada partícula se evalúa contra el slider **`Complejidad Semántica`** y **`Umbral del Router`**, y **se desvía físicamente por uno de 3 carriles curvos**:
    - 🟢 **Carril Superior (`Local Ollama / vLLM`):** Partículas rápidas, costo `$0.00` marginal, latencia `<120ms`.
    - 🔵 **Carril Central (`Flash Cloud Mid-Tier`):** Velocidad media.
    - 🟣 **Carril Inferior (`Frontier Reasoning Pro/Opus`):** Partículas grandes y lentas con alto costo.
  - Incluye un comparador visual de barras en vivo: **`Costo Sin Router (100% Frontier)`** vs. **`Costo Con Smart Router`**, mostrando el porcentaje de ahorro en dólares en tiempo real.

---

## 6. PLAN DE EJECUCIÓN INMEDIATA PARA EL AGENTE
1. Actualiza `src/store/useAppStore.ts` con `viewMode` y `activeStageTab`.
2. Crea `src/components/canvas/ArcadeDeck.tsx` y actualiza `CosmosCanvas.tsx` + `KnowledgeCardNode.tsx` para incluir los mini-previews SVG animados y las partículas en las aristas.
3. Reemplaza `ArtifactDrawer.tsx` por `src/components/stage/ArtifactStageModal.tsx` implementando el layout Widescreen 60/40 con pestañas sin scroll global.
4. Reescribe los 4 simuladores en `src/components/simulators/` asegurando animaciones continuas a 60 FPS (`requestAnimationFrame` o transiciones SVG reactivas) donde cada slider modifique directamente la geometría, velocidad o estado físico del dibujo.
5. Verifica que `npm run build` compile sin errores de tipos y confirma en el navegador local que tanto el modo Constelación como el modo Arcade y los 4 laboratorios visuales respondan al instante.