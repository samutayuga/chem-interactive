# Ionic Cross-Over Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive chemistry canvas where Singapore Sec 3 students drag neutral elements, deduce their ionic charges, and watch a cross-over animation produce the correct ionic formula.

**Architecture:** Single-page React app with a `useReducer`-driven state machine at the core. A `WasmProvider` loads the Rust periodic table WASM once synchronously; an `IonicCanvasProvider` wraps the reducer and exposes it via context. All animation is handled by Framer Motion with a local `animationStep` integer stepping through 4 frames on `onAnimationComplete` callbacks. Drag-and-drop uses `@dnd-kit/core` for touch + mouse support.

**Tech Stack:** React 19, TypeScript, Vite 6, TailwindCSS v4, Material UI v6, Framer Motion v12, `@dnd-kit/core`, Vitest, React Testing Library, `vite-plugin-wasm`, `vite-plugin-top-level-await`

---

## File Map

```
src/
  main.tsx                            # React entry
  App.tsx                             # WasmProvider → IonicCanvasProvider → IonicCanvas
  index.css                           # Tailwind directives + CSS custom properties for theme

  wasm/
    WasmProvider.tsx                  # loads PeriodicTable.load(); WasmContext + ErrorBoundary
    hooks.ts                          # useWasm(), useElement(symbol), useAllElements()

  canvas/
    types.ts                          # IonicCanvasState, ZoneState, Side, CanvasPhase
    constants.ts                      # POLYATOMIC_IONS, INITIAL_STATE
    reducer.ts                        # ionicReducer + all action handlers
    IonicCanvasProvider.tsx           # useReducer wrapper; IonicCanvasContext
    hooks.ts                          # useIonicCanvas()
    IonicCanvas.tsx                   # bridge layout root: tray + [DropZone | Bridge | DropZone]

  tray/
    ElementTray.tsx                   # scrollable chips + polyatomic tab switcher
    ElementToken.tsx                  # useDraggable chip: symbol, name, atomicNumber

  zones/
    DropZone.tsx                      # useDroppable target; inline expansion host
    DeductionPanel.tsx                # routes to RegularDeduction | TransitionMetalPicker | PolyatomicConfirm
    RegularDeduction.tsx              # lose/gain toggle + count 1-4 buttons + shake/hint
    TransitionMetalPicker.tsx         # charge selector from oxidationStates[]
    PolyatomicConfirm.tsx             # read-only callout + Got it button

  bridge/
    BridgeColumn.tsx                  # ⇌ icon, Cross Over button, formula display
    CrossoverAnimator.tsx             # 4-frame animation driven by local animationStep

  utils/
    valence.ts                        # parseValenceElectrons(config, group), isTransitionMetal(group)
    gcd.ts                            # gcd(a, b): number

  __tests__/
    gcd.test.ts
    valence.test.ts
    reducer.test.ts
    RegularDeduction.test.tsx
    TransitionMetalPicker.test.tsx
    PolyatomicConfirm.test.tsx
    CrossoverAnimator.test.tsx

vite.config.ts
tailwind.config.ts
tsconfig.json
package.json
```

---

## Task 1: Scaffold Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: Create Vite React-TS project**

```bash
npm create vite@latest . -- --template react-ts
```

Expected: project files created in current directory.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install @mui/material @mui/system @emotion/react @emotion/styled framer-motion @dnd-kit/core
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D tailwindcss @tailwindcss/vite vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom vite-plugin-wasm vite-plugin-top-level-await
```

- [ ] **Step 4: Add vitest globals to `tsconfig.json`**

After Vite generates `tsconfig.json`, add `"types": ["vitest/globals"]` to `compilerOptions` so test files can use `describe`/`it`/`expect` without imports:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 5: Write `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      '@periodic-table': path.resolve(
        __dirname,
        '../../sam-periodic-table/pkg/pt-wasm/pt_wasm.js'
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 6: Write `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#1a0a2e',
        cation:  '#00ff88',
        anion:   '#ff4080',
        accent:  '#7040ff',
        surface: '#2a1a4e',
        muted:   '#4a3a6e',
      },
    },
  },
} satisfies Config;
```

- [ ] **Step 7: Write `src/index.css`**

```css
@import "tailwindcss";

:root {
  --color-bg:      #1a0a2e;
  --color-cation:  #00ff88;
  --color-anion:   #ff4080;
  --color-accent:  #7040ff;
  --color-surface: #2a1a4e;
  --color-muted:   #4a3a6e;
}

body {
  background-color: var(--color-bg);
  color: #e0d0ff;
  font-family: 'Segoe UI', system-ui, sans-serif;
  margin: 0;
}
```

- [ ] **Step 8: Write `src/__tests__/setup.ts`**

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 9: Write placeholder `src/main.tsx`**

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: Write placeholder `src/App.tsx`**

```typescript
export default function App() {
  return <div className="p-4 text-white">Ionic Canvas — coming soon</div>;
}
```

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server running on http://localhost:5173. Browser shows "Ionic Canvas — coming soon".

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "feat: scaffold Vite/React/TS project with Tailwind, MUI, Framer Motion, dnd-kit"
```

---

## Task 2: Utility Functions

**Files:**
- Create: `src/utils/gcd.ts`
- Create: `src/utils/valence.ts`
- Create: `src/__tests__/gcd.test.ts`
- Create: `src/__tests__/valence.test.ts`

- [ ] **Step 1: Write failing GCD tests**

```typescript
// src/__tests__/gcd.test.ts
import { describe, it, expect } from 'vitest';
import { gcd } from '../utils/gcd';

describe('gcd', () => {
  it('returns 1 for coprime numbers', () => expect(gcd(2, 3)).toBe(1));
  it('returns 2 for Ca2O2', () => expect(gcd(2, 2)).toBe(2));
  it('returns 1 for Fe2O3', () => expect(gcd(2, 3)).toBe(1));
  it('handles gcd(1, n)', () => expect(gcd(1, 4)).toBe(1));
  it('handles gcd(n, 1)', () => expect(gcd(4, 1)).toBe(1));
});
```

- [ ] **Step 2: Run GCD tests — expect FAIL**

```bash
npx vitest run src/__tests__/gcd.test.ts
```

Expected: FAIL — `Cannot find module '../utils/gcd'`

- [ ] **Step 3: Write `src/utils/gcd.ts`**

```typescript
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
```

- [ ] **Step 4: Run GCD tests — expect PASS**

```bash
npx vitest run src/__tests__/gcd.test.ts
```

Expected: 5 passed.

- [ ] **Step 5: Write failing valence tests**

```typescript
// src/__tests__/valence.test.ts
import { describe, it, expect } from 'vitest';
import { parseValenceElectrons, isTransitionMetal, groupToValenceFallback } from '../utils/valence';

describe('parseValenceElectrons', () => {
  it('parses Mg: [Ne] 3s2 → 2', () =>
    expect(parseValenceElectrons('1s2 2s2 2p6 3s2', 2)).toBe(2));
  it('parses O: 1s2 2s2 2p4 → 6', () =>
    expect(parseValenceElectrons('1s2 2s2 2p4', 16)).toBe(6));
  it('parses Cl with noble gas: [Ne] 3s2 3p5 → 7', () =>
    expect(parseValenceElectrons('[Ne] 3s2 3p5', 17)).toBe(7));
  it('parses Na: [Ne] 3s1 → 1', () =>
    expect(parseValenceElectrons('[Ne] 3s1', 1)).toBe(1));
  it('falls back to group heuristic on bad input', () =>
    expect(parseValenceElectrons('', 2)).toBe(2));
});

describe('isTransitionMetal', () => {
  it('Fe group 8 → true', () => expect(isTransitionMetal(8)).toBe(true));
  it('Mg group 2 → false', () => expect(isTransitionMetal(2)).toBe(false));
  it('Cl group 17 → false', () => expect(isTransitionMetal(17)).toBe(false));
  it('group 3 → true', () => expect(isTransitionMetal(3)).toBe(true));
  it('group 12 → true', () => expect(isTransitionMetal(12)).toBe(true));
});

describe('groupToValenceFallback', () => {
  it('group 1 → 1', () => expect(groupToValenceFallback(1)).toBe(1));
  it('group 2 → 2', () => expect(groupToValenceFallback(2)).toBe(2));
  it('group 13 → 3', () => expect(groupToValenceFallback(13)).toBe(3));
  it('group 16 → 6', () => expect(groupToValenceFallback(16)).toBe(6));
  it('group 17 → 7', () => expect(groupToValenceFallback(17)).toBe(7));
});
```

- [ ] **Step 6: Run valence tests — expect FAIL**

```bash
npx vitest run src/__tests__/valence.test.ts
```

Expected: FAIL — `Cannot find module '../utils/valence'`

- [ ] **Step 7: Write `src/utils/valence.ts`**

```typescript
export function groupToValenceFallback(group: number): number {
  if (group <= 2) return group;
  if (group >= 13) return group - 10;
  return 0;
}

export function isTransitionMetal(group: number): boolean {
  return group >= 3 && group <= 12;
}

export function parseValenceElectrons(config: string, group: number): number {
  // Strip noble gas prefix e.g. "[Ne] 3s2" → "3s2"
  const stripped = config.replace(/\[[A-Z][a-z]?\]\s*/, '').trim();
  if (!stripped) return groupToValenceFallback(group);

  // Parse subshell tokens e.g. "3s2" → { n: 3, count: 2 }
  const tokens = stripped.split(/\s+/);
  const subshells = tokens
    .map(t => {
      const m = t.match(/^(\d)[spdf](\d+)$/);
      return m ? { n: parseInt(m[1], 10), count: parseInt(m[2], 10) } : null;
    })
    .filter((x): x is { n: number; count: number } => x !== null);

  if (subshells.length === 0) return groupToValenceFallback(group);

  const maxN = Math.max(...subshells.map(s => s.n));
  return subshells
    .filter(s => s.n === maxN)
    .reduce((sum, s) => sum + s.count, 0);
}
```

- [ ] **Step 8: Run valence tests — expect PASS**

```bash
npx vitest run src/__tests__/valence.test.ts
```

Expected: all passed.

- [ ] **Step 9: Commit**

```bash
git add src/utils/ src/__tests__/gcd.test.ts src/__tests__/valence.test.ts src/__tests__/setup.ts
git commit -m "feat: add gcd and valence utility functions with tests"
```

---

## Task 3: Types, Constants, Reducer

**Files:**
- Create: `src/canvas/types.ts`
- Create: `src/canvas/constants.ts`
- Create: `src/canvas/reducer.ts`
- Create: `src/__tests__/reducer.test.ts`

- [ ] **Step 1: Write `src/canvas/types.ts`**

```typescript
export type Side = 'cation' | 'anion';
export type CanvasPhase =
  | 'SELECTING'
  | 'DEDUCING_CHARGE'
  | 'READY_TO_CROSS'
  | 'ANIMATING_CROSSOVER'
  | 'COMPLETE';

export interface ZoneState {
  symbol:           string;
  isPolyatomic:     boolean;
  isTransition:     boolean;
  valenceElectrons: number;
  oxidationStates:  number[];
  derivedCharge:    number | null;
  wrongCount:       number;
  status:           'NEUTRAL' | 'DEDUCING' | 'IONIZED';
}

export interface IonicCanvasState {
  canvasPhase:         CanvasPhase;
  activeDeductionSide: Side | null;
  cation:              ZoneState | null;
  anion:               ZoneState | null;
}

export type IonicAction =
  | { type: 'DROP_ELEMENT';        side: Side; zone: ZoneState }
  | { type: 'SUBMIT_DEDUCTION';    side: Side; loseOrGain: 'lose' | 'gain'; count: number }
  | { type: 'PICK_TM_CHARGE';      side: Side; charge: number }
  | { type: 'CONFIRM_POLYATOMIC';  side: Side }
  | { type: 'TRIGGER_CROSSOVER' }
  | { type: 'CROSSOVER_COMPLETE' }
  | { type: 'RESET' };
```

- [ ] **Step 2: Write `src/canvas/constants.ts`**

```typescript
import type { IonicCanvasState } from './types';

export interface PolyatomicIon {
  symbol:  string;
  name:    string;
  charge:  number;  // negative = anion, positive = cation
  formula: string;  // display string e.g. 'OH⁻'
}

export const POLYATOMIC_IONS: PolyatomicIon[] = [
  { symbol: 'OH',  name: 'Hydroxide',  charge: -1, formula: 'OH⁻'  },
  { symbol: 'NO₃', name: 'Nitrate',    charge: -1, formula: 'NO₃⁻' },
  { symbol: 'SO₄', name: 'Sulfate',    charge: -2, formula: 'SO₄²⁻'},
  { symbol: 'CO₃', name: 'Carbonate',  charge: -2, formula: 'CO₃²⁻'},
  { symbol: 'PO₄', name: 'Phosphate',  charge: -3, formula: 'PO₄³⁻'},
  { symbol: 'NH₄', name: 'Ammonium',   charge: +1, formula: 'NH₄⁺' },
];

export const INITIAL_STATE: IonicCanvasState = {
  canvasPhase:         'SELECTING',
  activeDeductionSide: null,
  cation:              null,
  anion:               null,
};
```

- [ ] **Step 3: Write failing reducer tests**

```typescript
// src/__tests__/reducer.test.ts
import { describe, it, expect } from 'vitest';
import { ionicReducer } from '../canvas/reducer';
import { INITIAL_STATE } from '../canvas/constants';
import type { IonicCanvasState, ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1, 1, 3, 5, 7],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const feZone: ZoneState = {
  symbol: 'Fe', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2, -1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const caZone: ZoneState = {
  symbol: 'Ca', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const ohZone: ZoneState = {
  symbol: 'OH', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('DROP_ELEMENT', () => {
  it('moves to DEDUCING_CHARGE when cation dropped', () => {
    const s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: mgZone });
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
    expect(s.activeDeductionSide).toBe('cation');
    expect(s.cation?.status).toBe('NEUTRAL');
  });

  it('moves to DEDUCING_CHARGE when anion dropped after cation ionized', () => {
    const withCation: IonicCanvasState = {
      ...INITIAL_STATE,
      canvasPhase: 'SELECTING',
      cation: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    };
    const s = ionicReducer(withCation, { type: 'DROP_ELEMENT', side: 'anion', zone: clZone });
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
    expect(s.activeDeductionSide).toBe('anion');
  });
});

describe('SUBMIT_DEDUCTION', () => {
  const deducingMg: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'cation',
    cation: { ...mgZone, status: 'DEDUCING' },
  };

  it('correct answer ionizes cation, returns to SELECTING if anion empty', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    expect(s.cation?.status).toBe('IONIZED');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.canvasPhase).toBe('SELECTING');
    expect(s.activeDeductionSide).toBeNull();
  });

  it('correct answer → READY_TO_CROSS when other zone already IONIZED', () => {
    const withBoth: IonicCanvasState = {
      ...deducingMg,
      anion: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
    };
    const s = ionicReducer(withBoth, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
  });

  it('wrong answer increments wrongCount', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 1 });
    expect(s.cation?.wrongCount).toBe(1);
    expect(s.cation?.status).toBe('DEDUCING');
    expect(s.canvasPhase).toBe('DEDUCING_CHARGE');
  });

  it('wrong loseOrGain direction increments wrongCount', () => {
    const s = ionicReducer(deducingMg, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'gain', count: 2 });
    expect(s.cation?.wrongCount).toBe(1);
  });
});

describe('PICK_TM_CHARGE', () => {
  const deducingFe: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'cation',
    cation: { ...feZone, status: 'DEDUCING' },
  };

  it('ionizes with chosen charge', () => {
    const s = ionicReducer(deducingFe, { type: 'PICK_TM_CHARGE', side: 'cation', charge: 3 });
    expect(s.cation?.derivedCharge).toBe(3);
    expect(s.cation?.status).toBe('IONIZED');
  });
});

describe('CONFIRM_POLYATOMIC', () => {
  const deducingOH: IonicCanvasState = {
    ...INITIAL_STATE,
    canvasPhase: 'DEDUCING_CHARGE',
    activeDeductionSide: 'anion',
    anion: { ...ohZone, status: 'DEDUCING', oxidationStates: [-1] },
  };

  it('ionizes with charge from oxidationStates[0]', () => {
    const s = ionicReducer(deducingOH, { type: 'CONFIRM_POLYATOMIC', side: 'anion' });
    expect(s.anion?.derivedCharge).toBe(-1);
    expect(s.anion?.status).toBe('IONIZED');
  });
});

describe('QA cases', () => {
  it('Mg + Cl → MgCl₂: both ionize to charges +2 and -1', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: mgZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: clZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 1 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.anion?.derivedCharge).toBe(-1);
  });

  it('Ca + O → CaO: charges +2 and -2 (GCD=2 handled by animator)', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: caZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'cation', loseOrGain: 'lose', count: 2 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: oZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(2);
    expect(s.anion?.derivedCharge).toBe(-2);
  });

  it('Fe + O → Fe₂O₃: TM pick Fe³⁺ then O gains 2', () => {
    let s = ionicReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', side: 'cation', zone: feZone });
    s = ionicReducer(s, { type: 'PICK_TM_CHARGE', side: 'cation', charge: 3 });
    s = ionicReducer(s, { type: 'DROP_ELEMENT', side: 'anion', zone: oZone });
    s = ionicReducer(s, { type: 'SUBMIT_DEDUCTION', side: 'anion', loseOrGain: 'gain', count: 2 });
    expect(s.canvasPhase).toBe('READY_TO_CROSS');
    expect(s.cation?.derivedCharge).toBe(3);
    expect(s.anion?.derivedCharge).toBe(-2);
  });
});

describe('TRIGGER_CROSSOVER / CROSSOVER_COMPLETE / RESET', () => {
  const readyState: IonicCanvasState = {
    canvasPhase: 'READY_TO_CROSS',
    activeDeductionSide: null,
    cation: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    anion:  { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };

  it('TRIGGER_CROSSOVER → ANIMATING_CROSSOVER', () => {
    const s = ionicReducer(readyState, { type: 'TRIGGER_CROSSOVER' });
    expect(s.canvasPhase).toBe('ANIMATING_CROSSOVER');
  });

  it('CROSSOVER_COMPLETE → COMPLETE', () => {
    const s = ionicReducer({ ...readyState, canvasPhase: 'ANIMATING_CROSSOVER' }, { type: 'CROSSOVER_COMPLETE' });
    expect(s.canvasPhase).toBe('COMPLETE');
  });

  it('RESET → INITIAL_STATE', () => {
    const s = ionicReducer(readyState, { type: 'RESET' });
    expect(s).toEqual(INITIAL_STATE);
  });
});
```

- [ ] **Step 4: Run reducer tests — expect FAIL**

```bash
npx vitest run src/__tests__/reducer.test.ts
```

Expected: FAIL — `Cannot find module '../canvas/reducer'`

- [ ] **Step 5: Write `src/canvas/reducer.ts`**

```typescript
import { INITIAL_STATE } from './constants';
import type { IonicCanvasState, IonicAction, ZoneState, Side } from './types';

function otherSide(side: Side): Side {
  return side === 'cation' ? 'anion' : 'cation';
}

function getZone(state: IonicCanvasState, side: Side): ZoneState | null {
  return side === 'cation' ? state.cation : state.anion;
}

function setZone(state: IonicCanvasState, side: Side, zone: ZoneState | null): IonicCanvasState {
  return side === 'cation' ? { ...state, cation: zone } : { ...state, anion: zone };
}

function checkBothIonized(state: IonicCanvasState): boolean {
  return state.cation?.status === 'IONIZED' && state.anion?.status === 'IONIZED';
}

export function ionicReducer(state: IonicCanvasState, action: IonicAction): IonicCanvasState {
  switch (action.type) {
    case 'DROP_ELEMENT': {
      const newZone: ZoneState = { ...action.zone, status: 'DEDUCING', wrongCount: 0 };
      const next = setZone(state, action.side, newZone);
      return { ...next, canvasPhase: 'DEDUCING_CHARGE', activeDeductionSide: action.side };
    }

    case 'SUBMIT_DEDUCTION': {
      const zone = getZone(state, action.side);
      if (!zone) return state;

      const computedCharge = action.loseOrGain === 'lose' ? action.count : -action.count;
      const sideIsCorrect = action.side === 'cation' ? computedCharge > 0 : computedCharge < 0;
      const isCorrect = sideIsCorrect && zone.oxidationStates.includes(computedCharge);

      if (!isCorrect) {
        const updated: ZoneState = { ...zone, wrongCount: zone.wrongCount + 1 };
        return setZone(state, action.side, updated);
      }

      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: computedCharge, wrongCount: 0 };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'PICK_TM_CHARGE': {
      const zone = getZone(state, action.side);
      if (!zone) return state;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: action.charge };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'CONFIRM_POLYATOMIC': {
      const zone = getZone(state, action.side);
      if (!zone) return state;
      const charge = zone.oxidationStates[0] ?? -1;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: charge };
      const next = setZone(state, action.side, ionized);
      const other = getZone(next, otherSide(action.side));
      const phase = other?.status === 'IONIZED' ? 'READY_TO_CROSS' : 'SELECTING';
      return { ...next, canvasPhase: phase, activeDeductionSide: null };
    }

    case 'TRIGGER_CROSSOVER':
      return { ...state, canvasPhase: 'ANIMATING_CROSSOVER' };

    case 'CROSSOVER_COMPLETE':
      return { ...state, canvasPhase: 'COMPLETE' };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
```

- [ ] **Step 6: Run reducer tests — expect PASS**

```bash
npx vitest run src/__tests__/reducer.test.ts
```

Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add src/canvas/ src/__tests__/reducer.test.ts
git commit -m "feat: add types, constants, and reducer with full test coverage"
```

---

## Task 4: WASM Provider and Hooks

**Files:**
- Create: `src/wasm/WasmProvider.tsx`
- Create: `src/wasm/hooks.ts`

- [ ] **Step 1: Write `src/wasm/WasmProvider.tsx`**

```typescript
import {
  createContext, useContext, useEffect, useState,
  Component, type ReactNode, type ErrorInfo,
} from 'react';
import type { PeriodicTable, WasmElement } from '@periodic-table';

interface WasmContextValue {
  pt: PeriodicTable;
  elements: WasmElement[];
}

export const WasmContext = createContext<WasmContextValue | null>(null);

class WasmErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('WASM failed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-screen bg-bg text-white text-center p-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Failed to load element data</h1>
            <p className="text-muted">Please refresh the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function WasmLoader({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<WasmContextValue | null>(null);

  useEffect(() => {
    import('@periodic-table').then(({ PeriodicTable: PT }) => {
      const pt = PT.load();
      const elements = pt.all() as WasmElement[];
      setCtx({ pt, elements });
    });
  }, []);

  if (!ctx) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-accent text-lg">
        Loading elements…
      </div>
    );
  }

  return <WasmContext.Provider value={ctx}>{children}</WasmContext.Provider>;
}

export function WasmProvider({ children }: { children: ReactNode }) {
  return (
    <WasmErrorBoundary>
      <WasmLoader>{children}</WasmLoader>
    </WasmErrorBoundary>
  );
}
```

- [ ] **Step 2: Write `src/wasm/hooks.ts`**

```typescript
import { useContext } from 'react';
import { WasmContext } from './WasmProvider';
import type { WasmElement } from '@periodic-table';

export function useWasm() {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useWasm must be used inside WasmProvider');
  return ctx.pt;
}

export function useAllElements(): WasmElement[] {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useAllElements must be used inside WasmProvider');
  return ctx.elements;
}

export function useElement(symbol: string): WasmElement | undefined {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('useElement must be used inside WasmProvider');
  return ctx.elements.find(e => e.symbol === symbol);
}
```

- [ ] **Step 3: Add `@periodic-table` type declaration**

Create `src/wasm/pt-wasm.d.ts`:

```typescript
declare module '@periodic-table' {
  export { PeriodicTable, WasmElement, WasmIsotope } from '../../sam-periodic-table/pkg/pt-wasm/pt_wasm';
}
```

- [ ] **Step 4: Smoke-test in App.tsx**

Update `src/App.tsx`:

```typescript
import { WasmProvider } from './wasm/WasmProvider';
import { useAllElements } from './wasm/hooks';

function Inner() {
  const elements = useAllElements();
  return <div className="p-4 text-white">Loaded {elements.length} elements</div>;
}

export default function App() {
  return (
    <WasmProvider>
      <Inner />
    </WasmProvider>
  );
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: browser shows "Loaded 118 elements".

- [ ] **Step 6: Revert App.tsx to placeholder, commit**

Revert `src/App.tsx` to:

```typescript
import { WasmProvider } from './wasm/WasmProvider';

export default function App() {
  return (
    <WasmProvider>
      <div className="p-4 text-white">Ionic Canvas — coming soon</div>
    </WasmProvider>
  );
}
```

```bash
git add src/wasm/ src/App.tsx
git commit -m "feat: add WasmProvider with error boundary and element hooks"
```

---

## Task 5: IonicCanvasProvider and Context Hook

**Files:**
- Create: `src/canvas/IonicCanvasProvider.tsx`
- Create: `src/canvas/hooks.ts`

- [ ] **Step 1: Write `src/canvas/IonicCanvasProvider.tsx`**

```typescript
import { createContext, useReducer, type ReactNode } from 'react';
import { ionicReducer } from './reducer';
import { INITIAL_STATE } from './constants';
import type { IonicCanvasState, IonicAction } from './types';

interface IonicCanvasContextValue {
  state:    IonicCanvasState;
  dispatch: React.Dispatch<IonicAction>;
}

export const IonicCanvasContext = createContext<IonicCanvasContextValue | null>(null);

export function IonicCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ionicReducer, INITIAL_STATE);
  return (
    <IonicCanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </IonicCanvasContext.Provider>
  );
}
```

- [ ] **Step 2: Write `src/canvas/hooks.ts`**

```typescript
import { useContext } from 'react';
import { IonicCanvasContext } from './IonicCanvasProvider';

export function useIonicCanvas() {
  const ctx = useContext(IonicCanvasContext);
  if (!ctx) throw new Error('useIonicCanvas must be used inside IonicCanvasProvider');
  return ctx;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/canvas/IonicCanvasProvider.tsx src/canvas/hooks.ts
git commit -m "feat: add IonicCanvasProvider with useReducer and context hook"
```

---

## Task 6: ElementToken and ElementTray

**Files:**
- Create: `src/tray/ElementToken.tsx`
- Create: `src/tray/ElementTray.tsx`

- [ ] **Step 1: Write `src/tray/ElementToken.tsx`**

```typescript
import { useDraggable } from '@dnd-kit/core';
import type { WasmElement } from '@periodic-table';
import { parseValenceElectrons, isTransitionMetal } from '../utils/valence';
import { POLYATOMIC_IONS } from '../canvas/constants';
import type { ZoneState } from '../canvas/types';

interface Props {
  element: WasmElement;
  disabled?: boolean;
}

export function makeZoneState(el: WasmElement): ZoneState {
  return {
    symbol:           el.symbol,
    isPolyatomic:     false,
    isTransition:     isTransitionMetal(el.group),
    valenceElectrons: parseValenceElectrons(el.electron_configuration, el.group),
    oxidationStates:  el.oxidation_states,
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };
}

export function ElementToken({ element, disabled = false }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.symbol}`,
    data: { zoneState: makeZoneState(element) },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'flex flex-col items-center justify-center',
        'w-16 h-16 rounded-lg border cursor-grab select-none',
        'border-accent/40 bg-surface hover:border-accent',
        'transition-all duration-150',
        isDragging ? 'opacity-30 scale-95' : 'opacity-100',
        disabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
      ].join(' ')}
    >
      <span className="text-xs text-muted">{element.atomic_number}</span>
      <span className="text-lg font-bold text-white leading-none">{element.symbol}</span>
      <span className="text-[10px] text-muted truncate w-full text-center px-1">{element.name}</span>
    </div>
  );
}

interface PolyTokenProps {
  ion: typeof POLYATOMIC_IONS[0];
  disabled?: boolean;
}

export function PolyatomicToken({ ion, disabled = false }: PolyTokenProps) {
  const zoneState: ZoneState = {
    symbol:           ion.symbol,
    isPolyatomic:     true,
    isTransition:     false,
    valenceElectrons: 0,
    oxidationStates:  [ion.charge],
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `poly-${ion.symbol}`,
    data: { zoneState },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'flex flex-col items-center justify-center',
        'px-3 h-16 rounded-lg border cursor-grab select-none',
        'border-anion/40 bg-surface hover:border-anion',
        'transition-all duration-150',
        isDragging ? 'opacity-30' : 'opacity-100',
        disabled ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
      ].join(' ')}
    >
      <span className="text-base font-bold text-white">{ion.formula}</span>
      <span className="text-[10px] text-muted">{ion.name}</span>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/tray/ElementTray.tsx`**

```typescript
import { useState } from 'react';
import { useAllElements } from '../wasm/hooks';
import { useIonicCanvas } from '../canvas/hooks';
import { POLYATOMIC_IONS } from '../canvas/constants';
import { ElementToken, PolyatomicToken } from './ElementToken';

const DISPLAY_ELEMENTS = [
  'H','Li','Be','B','C','N','O','F',
  'Na','Mg','Al','Si','P','S','Cl',
  'K','Ca','Fe','Cu','Zn','Ag','Pb',
];

export function ElementTray() {
  const [tab, setTab] = useState<'elements' | 'polyatomic'>('elements');
  const all = useAllElements();
  const { state } = useIonicCanvas();

  const displayed = all.filter(e => DISPLAY_ELEMENTS.includes(e.symbol));
  const isDraggingDisabled = state.canvasPhase === 'DEDUCING_CHARGE' || state.canvasPhase === 'ANIMATING_CROSSOVER';
  const cationFilled = state.cation !== null;
  const anionFilled  = state.anion  !== null;

  return (
    <div className="w-full bg-surface/50 border-b border-muted/30 p-3">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('elements')}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            tab === 'elements' ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
          }`}
        >
          Elements
        </button>
        <button
          onClick={() => setTab('polyatomic')}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            tab === 'polyatomic' ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
          }`}
        >
          Polyatomic Ions
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tab === 'elements' && displayed.map(el => (
          <ElementToken
            key={el.symbol}
            element={el}
            disabled={isDraggingDisabled}
          />
        ))}
        {tab === 'polyatomic' && POLYATOMIC_IONS.map(ion => {
          // NH₄⁺ is a cation — disable if cation zone already filled
          const zoneFilled = ion.charge > 0 ? cationFilled : anionFilled;
          return (
            <PolyatomicToken
              key={ion.symbol}
              ion={ion}
              disabled={isDraggingDisabled || zoneFilled}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/tray/
git commit -m "feat: add ElementTray and draggable ElementToken/PolyatomicToken"
```

---

## Task 7: DeductionPanel Sub-Components

**Files:**
- Create: `src/zones/RegularDeduction.tsx`
- Create: `src/zones/TransitionMetalPicker.tsx`
- Create: `src/zones/PolyatomicConfirm.tsx`
- Create: `src/__tests__/RegularDeduction.test.tsx`
- Create: `src/__tests__/TransitionMetalPicker.test.tsx`
- Create: `src/__tests__/PolyatomicConfirm.test.tsx`

- [ ] **Step 1: Write failing RegularDeduction tests**

```typescript
// src/__tests__/RegularDeduction.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegularDeduction } from '../zones/RegularDeduction';
import type { ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('RegularDeduction', () => {
  it('renders lose and gain buttons', () => {
    render(<RegularDeduction zone={mgZone} side="cation" onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /lose/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gain/i })).toBeInTheDocument();
  });

  it('renders count buttons 1-4', () => {
    render(<RegularDeduction zone={mgZone} side="cation" onSubmit={vi.fn()} />);
    ['1','2','3','4'].forEach(n => {
      expect(screen.getByRole('button', { name: n })).toBeInTheDocument();
    });
  });

  it('calls onSubmit with lose/2 when Lose then 2 clicked', () => {
    const onSubmit = vi.fn();
    render(<RegularDeduction zone={mgZone} side="cation" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /lose/i }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onSubmit).toHaveBeenCalledWith('lose', 2);
  });

  it('shows hint when wrongCount >= 2', () => {
    render(<RegularDeduction zone={{ ...mgZone, wrongCount: 2 }} side="cation" onSubmit={vi.fn()} />);
    expect(screen.getByText(/2 valence/i)).toBeInTheDocument();
  });

  it('does not show hint when wrongCount < 2', () => {
    render(<RegularDeduction zone={{ ...mgZone, wrongCount: 1 }} side="cation" onSubmit={vi.fn()} />);
    expect(screen.queryByText(/valence/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run RegularDeduction tests — expect FAIL**

```bash
npx vitest run src/__tests__/RegularDeduction.test.tsx
```

- [ ] **Step 3: Write `src/zones/RegularDeduction.tsx`**

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ZoneState, Side } from '../canvas/types';

interface Props {
  zone:     ZoneState;
  side:     Side;
  onSubmit: (loseOrGain: 'lose' | 'gain', count: number) => void;
}

export function RegularDeduction({ zone, side, onSubmit }: Props) {
  const [direction, setDirection] = useState<'lose' | 'gain' | null>(null);
  const [shake, setShake] = useState(false);

  // Track wrongCount changes to trigger shake
  const prevWrongCount = useState(zone.wrongCount)[0];
  if (zone.wrongCount > prevWrongCount && !shake) setShake(true);

  const handleCount = (count: number) => {
    if (!direction) return;
    onSubmit(direction, count);
    setDirection(null);
  };

  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
      transition={{ duration: 0.35 }}
      onAnimationComplete={() => setShake(false)}
    >
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-muted text-center">
        To achieve a stable octet, this atom must:
      </p>

      <div className="flex gap-2">
        {(['lose', 'gain'] as const).map(d => (
          <button
            key={d}
            onClick={() => setDirection(d)}
            className={[
              'flex-1 py-2 rounded-lg border text-sm font-semibold capitalize transition-colors',
              direction === d
                ? 'border-cation bg-cation/20 text-cation'
                : 'border-muted/40 text-muted hover:border-accent/60',
            ].join(' ')}
          >
            {d}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted text-center">How many electrons?</p>

      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => handleCount(n)}
            disabled={!direction}
            className={[
              'w-10 h-10 rounded-lg border text-sm font-bold transition-colors',
              direction
                ? 'border-accent/60 text-white hover:border-accent hover:bg-accent/20'
                : 'border-muted/20 text-muted/40 cursor-not-allowed',
            ].join(' ')}
          >
            {n}
          </button>
        ))}
      </div>

      {zone.wrongCount >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center text-yellow-300 bg-yellow-900/30 rounded-lg p-2"
        >
          Hint: {zone.symbol} has {zone.valenceElectrons} valence electron{zone.valenceElectrons !== 1 ? 's' : ''}.
        </motion.div>
      )}
    </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Run RegularDeduction tests — expect PASS**

```bash
npx vitest run src/__tests__/RegularDeduction.test.tsx
```

- [ ] **Step 5: Write failing TransitionMetalPicker tests**

```typescript
// src/__tests__/TransitionMetalPicker.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';
import type { ZoneState } from '../canvas/types';

const feZone: ZoneState = {
  symbol: 'Fe', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('TransitionMetalPicker', () => {
  it('renders a button per positive oxidation state', () => {
    render(<TransitionMetalPicker zone={feZone} onPick={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Fe²\+/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fe³\+/i })).toBeInTheDocument();
  });

  it('calls onPick with selected charge', () => {
    const onPick = vi.fn();
    render(<TransitionMetalPicker zone={feZone} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: /Fe³\+/i }));
    expect(onPick).toHaveBeenCalledWith(3);
  });
});
```

- [ ] **Step 6: Run TransitionMetalPicker tests — expect FAIL**

```bash
npx vitest run src/__tests__/TransitionMetalPicker.test.tsx
```

- [ ] **Step 7: Write `src/zones/TransitionMetalPicker.tsx`**

```typescript
import type { ZoneState } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = { 1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷' };

interface Props {
  zone:   ZoneState;
  onPick: (charge: number) => void;
}

export function TransitionMetalPicker({ zone, onPick }: Props) {
  const positiveStates = zone.oxidationStates.filter(s => s > 0);

  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-yellow-300 text-center font-semibold">
        Transition metal — pick its charge:
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {positiveStates.map(charge => (
          <button
            key={charge}
            onClick={() => onPick(charge)}
            className="px-4 py-2 rounded-lg border border-yellow-500/60 text-yellow-300 text-sm font-bold hover:bg-yellow-500/20 transition-colors"
          >
            {zone.symbol}{SUPERSCRIPTS[charge] ?? charge}⁺
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run TransitionMetalPicker tests — expect PASS**

```bash
npx vitest run src/__tests__/TransitionMetalPicker.test.tsx
```

- [ ] **Step 9: Write failing PolyatomicConfirm tests**

```typescript
// src/__tests__/PolyatomicConfirm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PolyatomicConfirm } from '../zones/PolyatomicConfirm';
import type { ZoneState } from '../canvas/types';

const ohZone: ZoneState = {
  symbol: 'OH', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('PolyatomicConfirm', () => {
  it('shows the charge callout', () => {
    render(<PolyatomicConfirm zone={ohZone} onConfirm={vi.fn()} />);
    expect(screen.getByText(/OH.*carries.*−1/i)).toBeInTheDocument();
  });

  it('calls onConfirm on Got it click', () => {
    const onConfirm = vi.fn();
    render(<PolyatomicConfirm zone={ohZone} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: /got it/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 10: Run PolyatomicConfirm tests — expect FAIL**

```bash
npx vitest run src/__tests__/PolyatomicConfirm.test.tsx
```

- [ ] **Step 11: Write `src/zones/PolyatomicConfirm.tsx`**

```typescript
import type { ZoneState } from '../canvas/types';

interface Props {
  zone:      ZoneState;
  onConfirm: () => void;
}

function formatCharge(n: number): string {
  if (n === -1) return '−1';
  if (n < 0) return `−${Math.abs(n)}`;
  return `+${n}`;
}

export function PolyatomicConfirm({ zone, onConfirm }: Props) {
  const charge = zone.oxidationStates[0] ?? -1;
  return (
    <div className="flex flex-col gap-3 p-3 items-center">
      <p className="text-sm text-anion/80 text-center">
        {zone.symbol} carries a {formatCharge(charge)} charge
      </p>
      <p className="text-xs text-muted text-center">
        Polyatomic ions are memorised as pre-charged units.
      </p>
      <button
        onClick={onConfirm}
        className="px-6 py-2 rounded-lg border border-anion/60 text-anion text-sm font-semibold hover:bg-anion/20 transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
```

- [ ] **Step 12: Run PolyatomicConfirm tests — expect PASS**

```bash
npx vitest run src/__tests__/PolyatomicConfirm.test.tsx
```

- [ ] **Step 13: Commit**

```bash
git add src/zones/RegularDeduction.tsx src/zones/TransitionMetalPicker.tsx src/zones/PolyatomicConfirm.tsx src/__tests__/RegularDeduction.test.tsx src/__tests__/TransitionMetalPicker.test.tsx src/__tests__/PolyatomicConfirm.test.tsx
git commit -m "feat: add deduction sub-components with tests (RegularDeduction, TM picker, Polyatomic confirm)"
```

---

## Task 8: DeductionPanel Shell and DropZone

**Files:**
- Create: `src/zones/DeductionPanel.tsx`
- Create: `src/zones/DropZone.tsx`

- [ ] **Step 1: Write `src/zones/DeductionPanel.tsx`**

```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { RegularDeduction } from './RegularDeduction';
import { TransitionMetalPicker } from './TransitionMetalPicker';
import { PolyatomicConfirm } from './PolyatomicConfirm';
import type { Side, ZoneState } from '../canvas/types';

interface Props {
  side: Side;
  zone: ZoneState;
}

export function DeductionPanel({ side, zone }: Props) {
  const { dispatch } = useIonicCanvas();

  const handleSubmit = (loseOrGain: 'lose' | 'gain', count: number) => {
    dispatch({ type: 'SUBMIT_DEDUCTION', side, loseOrGain, count });
  };

  const handleTmPick = (charge: number) => {
    dispatch({ type: 'PICK_TM_CHARGE', side, charge });
  };

  const handlePolyConfirm = () => {
    dispatch({ type: 'CONFIRM_POLYATOMIC', side });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={zone.symbol}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {zone.isPolyatomic ? (
          <PolyatomicConfirm zone={zone} onConfirm={handlePolyConfirm} />
        ) : zone.isTransition ? (
          <TransitionMetalPicker zone={zone} onPick={handleTmPick} />
        ) : (
          <RegularDeduction zone={zone} side={side} onSubmit={handleSubmit} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Write `src/zones/DropZone.tsx`**

```typescript
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { DeductionPanel } from './DeductionPanel';
import type { Side } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = {
  1:'¹', 2:'²', 3:'³', 4:'⁴', 5:'⁵', 6:'⁶', 7:'⁷',
};

function formatIon(symbol: string, charge: number): string {
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  const sup = abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`;
  return `${symbol}${sup}`;
}

interface Props {
  side: Side;
}

export function DropZone({ side }: Props) {
  const { state } = useIonicCanvas();
  const zone = side === 'cation' ? state.cation : state.anion;

  const isActiveDeduction = state.activeDeductionSide === side;
  const isLocked =
    state.activeDeductionSide !== null && state.activeDeductionSide !== side;

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${side}`,
    disabled: isLocked || state.canvasPhase === 'ANIMATING_CROSSOVER' || state.canvasPhase === 'COMPLETE' || zone !== null,
  });

  const borderColor =
    side === 'cation' ? 'border-cation/40' : 'border-anion/40';
  const glowColor =
    side === 'cation' ? 'border-cation shadow-cation/20' : 'border-anion shadow-anion/20';
  const labelColor = side === 'cation' ? 'text-cation/50' : 'text-anion/50';

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex-1 rounded-xl border-2 min-h-40 transition-all duration-200 overflow-hidden',
        isLocked ? 'opacity-40 pointer-events-none' : '',
        isOver ? `${glowColor} shadow-lg` : borderColor,
        isActiveDeduction ? glowColor : '',
      ].join(' ')}
    >
      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center h-full min-h-40 ${labelColor} text-sm`}
          >
            Drop {side} here
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="deducing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={`text-center py-3 text-2xl font-bold ${side === 'cation' ? 'text-cation' : 'text-anion'}`}>
              {zone.symbol}
            </div>
            <DeductionPanel side={side} zone={zone} />
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center h-full min-h-40 text-3xl font-bold ${side === 'cation' ? 'text-cation' : 'text-anion'}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/zones/
git commit -m "feat: add DeductionPanel shell and DropZone with dnd-kit"
```

---

## Task 9: CrossoverAnimator

**Files:**
- Create: `src/bridge/CrossoverAnimator.tsx`
- Create: `src/__tests__/CrossoverAnimator.test.tsx`

- [ ] **Step 1: Write failing CrossoverAnimator tests**

```typescript
// src/__tests__/CrossoverAnimator.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { CrossoverAnimator } from '../bridge/CrossoverAnimator';
import type { ZoneState } from '../canvas/types';

// Mock framer-motion — call onAnimationComplete immediately
vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, onAnimationComplete, ...rest }: any) => {
      if (onAnimationComplete) setTimeout(onAnimationComplete, 0);
      return <span {...rest}>{children}</span>;
    },
    div: ({ children, onAnimationComplete, ...rest }: any) => {
      if (onAnimationComplete) setTimeout(onAnimationComplete, 0);
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mg: ZoneState = {
  symbol: 'Mg', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const cl: ZoneState = {
  symbol: 'Cl', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1],
  derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
const ca: ZoneState = {
  symbol: 'Ca', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const o: ZoneState = {
  symbol: 'O', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2],
  derivedCharge: -2, wrongCount: 0, status: 'IONIZED',
};
const oh: ZoneState = {
  symbol: 'OH', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};

describe('CrossoverAnimator subscript computation', () => {
  it('Mg²⁺ + Cl⁻ → cationSub=1, anionSub=2', () => {
    const onComplete = vi.fn();
    const { getByTestId } = render(
      <CrossoverAnimator cation={mg} anion={cl} onComplete={onComplete} />
    );
    expect(getByTestId('cation-sub').textContent).toBe('1');
    expect(getByTestId('anion-sub').textContent).toBe('2');
  });

  it('Ca²⁺ + O²⁻ → cationSub=1, anionSub=1 after GCD=2', () => {
    const { getByTestId } = render(
      <CrossoverAnimator cation={ca} anion={o} onComplete={vi.fn()} />
    );
    expect(getByTestId('final-cation-sub').textContent).toBe('1');
    expect(getByTestId('final-anion-sub').textContent).toBe('1');
  });

  it('shows brackets when anion is polyatomic and anion sub > 1', () => {
    const na: ZoneState = {
      symbol: 'Na', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1],
      derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
    };
    const { queryByTestId } = render(
      <CrossoverAnimator cation={ca} anion={oh} onComplete={vi.fn()} />
    );
    // Ca²⁺ + OH⁻ → Ca(OH)₂ — anion sub = 2 > 1 and polyatomic
    expect(queryByTestId('brackets')).toBeInTheDocument();
  });

  it('no brackets when anion sub === 1', () => {
    const na: ZoneState = {
      symbol: 'Na', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1],
      derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
    };
    const { queryByTestId } = render(
      <CrossoverAnimator cation={na} anion={oh} onComplete={vi.fn()} />
    );
    // Na⁺ + OH⁻ → NaOH — anion sub = 1 → no brackets
    expect(queryByTestId('brackets')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run CrossoverAnimator tests — expect FAIL**

```bash
npx vitest run src/__tests__/CrossoverAnimator.test.tsx
```

- [ ] **Step 3: Write `src/bridge/CrossoverAnimator.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';

interface Props {
  cation:     ZoneState;
  anion:      ZoneState;
  onComplete: () => void;
}

type AnimStep = 0 | 1 | 2 | 3 | 4;

export function CrossoverAnimator({ cation, anion, onComplete }: Props) {
  const [step, setStep] = useState<AnimStep>(0);

  // Frame ①: advance from 0→1 after 200ms (ISOLATE_VALENCY)
  useEffect(() => {
    const t = setTimeout(() => setStep(1), 200);
    return () => clearTimeout(t);
  }, []);

  const cCharge = Math.abs(cation.derivedCharge!);
  const aCharge = Math.abs(anion.derivedCharge!);

  // Raw subscripts: cation gets |anionCharge|, anion gets |cationCharge|
  const rawCationSub = aCharge;
  const rawAnionSub  = cCharge;
  const g            = gcd(rawCationSub, rawAnionSub);
  const finalCationSub = rawCationSub / g;
  const finalAnionSub  = rawAnionSub  / g;

  const showBrackets = anion.isPolyatomic && finalAnionSub > 1;
  const showGcd      = g > 1;

  const advance = (next: number) => {
    if (next === 2 && !showBrackets) { setStep(3); return; }
    if (next === 3 && !showGcd)      { setStep(4); return; }
    if (next >= 4) { onComplete(); return; }
    setStep(next as AnimStep);
  };

  const SUPERSCRIPTS: Record<number, string> = {1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷'};
  const sub = (n: number) => n === 1 ? '' : (SUPERSCRIPTS[n] ?? String(n));

  return (
    <div className="flex items-end justify-center gap-1 text-white select-none">
      {/* Cation symbol */}
      <span className="text-3xl font-bold text-cation">{cation.symbol}</span>

      {/* Cation subscript */}
      {finalCationSub > 1 && (
        <motion.span
          data-testid="cation-sub"
          className="text-lg text-white self-end mb-0.5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -20 }}
          onAnimationComplete={() => step === 1 && advance(2)}
        >
          {sub(finalCationSub)}
        </motion.span>
      )}
      {finalCationSub === 1 && (
        <span data-testid="cation-sub" className="sr-only">1</span>
      )}

      {/* Anion (with optional brackets) */}
      <AnimatePresence>
        {showBrackets && step >= 2 && (
          <motion.span
            data-testid="brackets"
            className="text-3xl text-anion"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onAnimationComplete={() => step === 2 && advance(3)}
          >
            (
          </motion.span>
        )}
      </AnimatePresence>

      <span className="text-3xl font-bold text-anion">{anion.symbol}</span>

      <AnimatePresence>
        {showBrackets && step >= 2 && (
          <motion.span className="text-3xl text-anion" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            )
          </motion.span>
        )}
      </AnimatePresence>

      {/* Anion subscript */}
      {finalAnionSub > 1 && (
        <motion.span
          data-testid="anion-sub"
          className="text-lg text-white self-end mb-0.5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -20 }}
        >
          {sub(finalAnionSub)}
        </motion.span>
      )}
      {finalAnionSub === 1 && (
        <span data-testid="anion-sub" className="sr-only">1</span>
      )}

      {/* Final formula testid targets */}
      <span data-testid="final-cation-sub" className="sr-only">{finalCationSub}</span>
      <span data-testid="final-anion-sub"  className="sr-only">{finalAnionSub}</span>

      {/* GCD badge */}
      <AnimatePresence>
        {showGcd && step === 3 && (
          <motion.div
            className="absolute -top-6 text-xs text-yellow-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => step === 3 && advance(4)}
          >
            ÷{g}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Run CrossoverAnimator tests — expect PASS**

```bash
npx vitest run src/__tests__/CrossoverAnimator.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/bridge/CrossoverAnimator.tsx src/__tests__/CrossoverAnimator.test.tsx
git commit -m "feat: add CrossoverAnimator with 4-frame animation sequence and tests"
```

---

## Task 10: BridgeColumn

**Files:**
- Create: `src/bridge/BridgeColumn.tsx`

- [ ] **Step 1: Write `src/bridge/BridgeColumn.tsx`**

```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { CrossoverAnimator } from './CrossoverAnimator';
import { gcd } from '../utils/gcd';

function buildFormulaString(
  cSym: string, cSub: number,
  aSym: string, aSub: number,
  anionIsPolyatomic: boolean
): string {
  const cPart = cSub === 1 ? cSym : `${cSym}${cSub}`;
  const aPart = anionIsPolyatomic && aSub > 1
    ? `(${aSym})${aSub}`
    : aSub === 1 ? aSym : `${aSym}${aSub}`;
  return `${cPart}${aPart}`;
}

export function BridgeColumn() {
  const { state, dispatch } = useIonicCanvas();
  const { cation, anion, canvasPhase } = state;

  const isReadyToCross = canvasPhase === 'READY_TO_CROSS';
  const isAnimating    = canvasPhase === 'ANIMATING_CROSSOVER';
  const isComplete     = canvasPhase === 'COMPLETE';

  let formulaDisplay = '';
  if ((isComplete || isAnimating) && cation?.derivedCharge && anion?.derivedCharge) {
    const cCharge = Math.abs(cation.derivedCharge);
    const aCharge = Math.abs(anion.derivedCharge);
    const g = gcd(cCharge, aCharge);
    const cSub = aCharge / g;
    const aSub = cCharge / g;
    formulaDisplay = buildFormulaString(
      cation.symbol, cSub,
      anion.symbol, aSub,
      anion.isPolyatomic
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-2 min-w-24">
      <span className="text-2xl text-accent/60">⇌</span>

      <AnimatePresence mode="wait">
        {isReadyToCross && (
          <motion.button
            key="crossover-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'TRIGGER_CROSSOVER' })}
            className="px-3 py-2 rounded-xl border-2 border-accent bg-accent/20 text-accent text-xs font-bold hover:bg-accent/30 transition-colors shadow-lg shadow-accent/20"
          >
            Cross Over →
          </motion.button>
        )}

        {isAnimating && cation && anion && (
          <motion.div key="animator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <CrossoverAnimator
              cation={cation}
              anion={anion}
              onComplete={() => dispatch({ type: 'CROSSOVER_COMPLETE' })}
            />
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            key="formula"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-2xl font-bold text-white">{formulaDisplay}</span>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/bridge/BridgeColumn.tsx
git commit -m "feat: add BridgeColumn with crossover trigger, animator, and formula display"
```

---

## Task 11: IonicCanvas Root Layout and App Wiring

**Files:**
- Create: `src/canvas/IonicCanvas.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write `src/canvas/IonicCanvas.tsx`**

```typescript
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useIonicCanvas } from './hooks';
import { ElementTray } from '../tray/ElementTray';
import { DropZone } from '../zones/DropZone';
import { BridgeColumn } from '../bridge/BridgeColumn';
import type { ZoneState, Side } from './types';

export function IonicCanvas() {
  const { state, dispatch } = useIonicCanvas();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith('dropzone-')) return;

    const side = overId.replace('dropzone-', '') as Side;
    const zoneState = active.data.current?.zoneState as ZoneState | undefined;
    if (!zoneState) return;

    // Guard: prevent drop if zone already filled or wrong polarity for NH4+
    const zoneFilled = side === 'cation' ? state.cation !== null : state.anion !== null;
    if (zoneFilled) return;
    if (zoneState.isPolyatomic && zoneState.oxidationStates[0] > 0 && side !== 'cation') return;
    if (zoneState.isPolyatomic && zoneState.oxidationStates[0] < 0 && side !== 'anion') return;

    dispatch({ type: 'DROP_ELEMENT', side, zone: zoneState });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen overflow-hidden">
        <ElementTray />
        <div className="flex flex-1 gap-3 p-4 overflow-hidden">
          <DropZone side="cation" />
          <BridgeColumn />
          <DropZone side="anion" />
        </div>
      </div>
    </DndContext>
  );
}
```

- [ ] **Step 2: Write final `src/App.tsx`**

```typescript
import { WasmProvider } from './wasm/WasmProvider';
import { IonicCanvasProvider } from './canvas/IonicCanvasProvider';
import { IonicCanvas } from './canvas/IonicCanvas';

export default function App() {
  return (
    <WasmProvider>
      <IonicCanvasProvider>
        <IonicCanvas />
      </IonicCanvasProvider>
    </WasmProvider>
  );
}
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Walk through the QA cases manually:

1. Drag **Mg** → cation zone → pick "Lose" + "2" → Mg²⁺
2. Drag **Cl** → anion zone → pick "Gain" + "1" → Cl⁻
3. Click "Cross Over" → watch animation → verify formula shows **MgCl₂**
4. Reset, repeat with **Ca** + **O** → verify simplification to **CaO**
5. Reset, repeat with **Fe** + **O** → pick Fe³⁺ from TM picker → verify **Fe₂O₃**

- [ ] **Step 5: Commit**

```bash
git add src/canvas/IonicCanvas.tsx src/App.tsx
git commit -m "feat: wire IonicCanvas root layout with DndContext — app complete"
```

---

## Task 12: Final Polish and Build Check

**Files:**
- Modify: `src/index.css` (minor refinements only if needed)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. Output in `dist/`.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Verify all 3 QA cases work in the production bundle.

- [ ] **Step 3: Run full test suite one final time**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: ionic cross-over canvas — production build verified"
```
