# Auto-Resolve Crossover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the interactive ionic deduction quiz with automatic charge resolution, add an explanation modal, and enable element replacement at any time.

**Architecture:** The canvas state machine loses `DEDUCING_CHARGE` and `READY_TO_CROSS` phases, gaining `EXPLAINING`. On second element drop, ionic charges are auto-resolved immediately; a modal explains the derivation (with inline TM picker for transition metals) before the crossover animation fires. Tray bonding-hint coloring and the legend are already implemented in `ElementTray.tsx` — no changes needed there beyond locking during `EXPLAINING`.

**Tech Stack:** React 18, TypeScript, Vite, Vitest + Testing Library, framer-motion, Tailwind CSS, @dnd-kit/core

## Global Constraints

- Test runner: `npx vitest run` (no npm test script; run directly)
- All tests in `src/__tests__/` with `.test.ts` or `.test.tsx` extension
- vitest globals enabled — `describe`, `it`, `expect`, `vi` available without import, but follow existing pattern of explicit imports
- Tailwind classes only — no inline style except for dynamic values
- framer-motion must be mocked in component tests (see Task 2 for pattern)
- `useIonicCanvas` hook lives at `src/canvas/hooks.ts`

---

## File Map

| File | Action | Notes |
|---|---|---|
| `src/canvas/types.ts` | Modify | Remove 2 phases, 3 actions, remove `activeDeductionSlot` |
| `src/canvas/constants.ts` | Modify | Remove `activeDeductionSlot` from `INITIAL_STATE` |
| `src/canvas/reducer.ts` | Modify | New `DROP_ELEMENT`, add `DISMISS_EXPLANATION` + `REPLACE_ELEMENT`, remove 3 cases |
| `src/__tests__/reducer.test.ts` | Rewrite | Full rewrite for new flow |
| `src/bridge/ExplanationModal.tsx` | Create | Explanation modal with TM picker |
| `src/__tests__/ExplanationModal.test.tsx` | Create | Modal tests |
| `src/bridge/BridgeColumn.tsx` | Modify | Remove `READY_TO_CROSS` branch, add `EXPLAINING` branch |
| `src/zones/DropZone.tsx` | Modify | Remove `DeductionPanel`, add replace button, update lock logic |
| `src/tray/ElementTray.tsx` | Modify | Add `EXPLAINING` to `isDraggingDisabled` |
| `src/tray/ElementToken.tsx` | Modify | Fix `PolyatomicToken` missing `elementClass` |
| `src/__tests__/CrossoverAnimator.test.tsx` | Modify | Add `elementClass` to ZoneState fixtures |
| `src/zones/RegularDeduction.tsx` | Delete | Replaced by modal |
| `src/zones/DeductionPanel.tsx` | Delete | Replaced by modal |
| `src/zones/PolyatomicConfirm.tsx` | Delete | Auto-ionised now |
| `src/__tests__/RegularDeduction.test.tsx` | Delete | Component deleted |
| `src/__tests__/PolyatomicConfirm.test.tsx` | Delete | Component deleted |

---

## Task 1: State Machine Refactor (TDD)

**Files:**
- Modify: `src/canvas/types.ts`
- Modify: `src/canvas/constants.ts`
- Modify: `src/canvas/reducer.ts`
- Rewrite: `src/__tests__/reducer.test.ts`

**Interfaces:**
- Produces: `CanvasPhase` with `EXPLAINING`; actions `DISMISS_EXPLANATION`, `REPLACE_ELEMENT`; `CanvasState` without `activeDeductionSlot`; `autoIonize` logic inside reducer

---

- [ ] **Step 1: Write new reducer tests (all will fail)**

Replace the full contents of `src/__tests__/reducer.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { canvasReducer } from '../canvas/reducer';
import { INITIAL_STATE } from '../canvas/constants';
import type { CanvasState, ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1, 1, 3, 5, 7], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const feZone: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const oZone: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2, -1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const caZone: ZoneState = {
  symbol: 'Ca', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const ohZone: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const naZone: ZoneState = {
  symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('DROP_ELEMENT — first drop', () => {
  it('single drop → SLOT_A_FILLED, status NEUTRAL, no bondingType', () => {
    const s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
    expect(s.bondingType).toBeNull();
    expect(s.slotA?.status).toBe('NEUTRAL');
  });
});

describe('DROP_ELEMENT — second drop, ionic auto-resolve', () => {
  const withMgInA: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...mgZone, status: 'NEUTRAL' },
  };

  it('Metal + NonMetal → Ionic, both auto-ionised, EXPLAINING', () => {
    const s = canvasReducer(withMgInA, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.bondingType).toBe('Ionic');
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('IONIZED');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('polyatomic anion auto-ionised with oxidationStates[0]', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...caZone, status: 'NEUTRAL' } },
      { type: 'DROP_ELEMENT', slot: 'B', zone: ohZone },
    );
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('transition metal stays DEDUCING, non-TM partner auto-ionised', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...feZone, status: 'NEUTRAL' } },
      { type: 'DROP_ELEMENT', slot: 'B', zone: oZone },
    );
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('DEDUCING');
    expect(s.slotA?.derivedCharge).toBeNull();
    expect(s.slotB?.status).toBe('IONIZED');
    expect(s.slotB?.derivedCharge).toBe(-2);
  });
});

describe('DROP_ELEMENT — second drop, non-ionic', () => {
  it('NonMetal + NonMetal → Covalent, EXPLAINING, slots stay NEUTRAL', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: clZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.bondingType).toBe('Covalent');
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.status).toBe('NEUTRAL');
    expect(s.slotB?.status).toBe('NEUTRAL');
  });

  it('Metal + Metal → Metallic, EXPLAINING', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: naZone });
    expect(s.bondingType).toBe('Metallic');
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});

describe('PICK_TM_CHARGE', () => {
  const explaining: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
    slotA: { ...feZone, status: 'DEDUCING' },
    slotB: { ...oZone, status: 'IONIZED', derivedCharge: -2 },
  };

  it('ionises TM slot, phase stays EXPLAINING', () => {
    const s = canvasReducer(explaining, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.slotA?.status).toBe('IONIZED');
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});

describe('DISMISS_EXPLANATION', () => {
  it('Ionic → ANIMATING_CROSSOVER', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
        slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
        slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('ANIMATING_CROSSOVER');
  });

  it('Covalent → SHOWING_COVALENT', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Covalent',
        slotA: { ...clZone, status: 'NEUTRAL' }, slotB: { ...oZone, status: 'NEUTRAL' } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('SHOWING_COVALENT');
  });

  it('Metallic → SHOWING_METALLIC', () => {
    const s = canvasReducer(
      { ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
        slotA: { ...mgZone, status: 'NEUTRAL' }, slotB: { ...naZone, status: 'NEUTRAL' } },
      { type: 'DISMISS_EXPLANATION' },
    );
    expect(s.canvasPhase).toBe('SHOWING_METALLIC');
  });
});

describe('REPLACE_ELEMENT', () => {
  const explaining: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
    slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };

  it('replace slotB → null, slotA reset to NEUTRAL, SLOT_A_FILLED, bondingType null', () => {
    const s = canvasReducer(explaining, { type: 'REPLACE_ELEMENT', slot: 'B' });
    expect(s.slotB).toBeNull();
    expect(s.slotA?.status).toBe('NEUTRAL');
    expect(s.slotA?.derivedCharge).toBeNull();
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
    expect(s.bondingType).toBeNull();
  });

  it('replace slotA → null, slotB reset to NEUTRAL, SLOT_A_FILLED', () => {
    const s = canvasReducer(explaining, { type: 'REPLACE_ELEMENT', slot: 'A' });
    expect(s.slotA).toBeNull();
    expect(s.slotB?.status).toBe('NEUTRAL');
    expect(s.slotB?.derivedCharge).toBeNull();
    expect(s.canvasPhase).toBe('SLOT_A_FILLED');
  });

  it('replace only slot → SELECTING', () => {
    const oneSlot: CanvasState = {
      ...INITIAL_STATE, canvasPhase: 'SLOT_A_FILLED', slotA: { ...mgZone, status: 'NEUTRAL' },
    };
    const s = canvasReducer(oneSlot, { type: 'REPLACE_ELEMENT', slot: 'A' });
    expect(s.slotA).toBeNull();
    expect(s.canvasPhase).toBe('SELECTING');
  });
});

describe('CROSSOVER_COMPLETE / RESET', () => {
  const animating: CanvasState = {
    ...INITIAL_STATE, canvasPhase: 'ANIMATING_CROSSOVER', bondingType: 'Ionic',
    slotA: { ...mgZone, status: 'IONIZED', derivedCharge: 2 },
    slotB: { ...clZone, status: 'IONIZED', derivedCharge: -1 },
  };
  it('CROSSOVER_COMPLETE → COMPLETE', () => {
    expect(canvasReducer(animating, { type: 'CROSSOVER_COMPLETE' }).canvasPhase).toBe('COMPLETE');
  });
  it('RESET → INITIAL_STATE', () => {
    expect(canvasReducer(animating, { type: 'RESET' })).toEqual(INITIAL_STATE);
  });
});

describe('default', () => {
  it('unknown action → state unchanged', () => {
    expect(canvasReducer(INITIAL_STATE, { type: 'UNKNOWN' } as any)).toBe(INITIAL_STATE);
  });
});

describe('QA — full auto-resolve flow', () => {
  it('Mg + Cl: charges +2, -1 auto-resolved in one drop', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: mgZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: clZone });
    expect(s.canvasPhase).toBe('EXPLAINING');
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-1);
  });

  it('Ca + O: charges +2, -2 auto-resolved', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: caZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.slotA?.derivedCharge).toBe(2);
    expect(s.slotB?.derivedCharge).toBe(-2);
  });

  it('Fe + O: O auto-ionised, Fe needs TM pick before dismiss', () => {
    let s = canvasReducer(INITIAL_STATE, { type: 'DROP_ELEMENT', slot: 'A', zone: feZone });
    s = canvasReducer(s, { type: 'DROP_ELEMENT', slot: 'B', zone: oZone });
    expect(s.slotA?.status).toBe('DEDUCING');
    s = canvasReducer(s, { type: 'PICK_TM_CHARGE', slot: 'A', charge: 3 });
    expect(s.slotA?.derivedCharge).toBe(3);
    expect(s.canvasPhase).toBe('EXPLAINING');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run src/__tests__/reducer.test.ts
```

Expected: Multiple failures — `EXPLAINING` not a valid phase, `DISMISS_EXPLANATION` unknown action, etc.

- [ ] **Step 3: Update `src/canvas/types.ts`**

Replace entire file:

```typescript
export type Slot = 'A' | 'B';
export type BondingType = 'Ionic' | 'Covalent' | 'Metallic';
export type ElementClass = 'Metal' | 'NonMetal' | 'Metalloid';

export type CanvasPhase =
  | 'SELECTING'
  | 'SLOT_A_FILLED'
  | 'EXPLAINING'
  | 'ANIMATING_CROSSOVER'
  | 'SHOWING_COVALENT'
  | 'SHOWING_METALLIC'
  | 'COMPLETE';

export interface ZoneState {
  symbol:           string;
  elementClass:     ElementClass;
  isPolyatomic:     boolean;
  isTransition:     boolean;
  valenceElectrons: number;
  oxidationStates:  number[];
  derivedCharge:    number | null;
  wrongCount:       number;
  status:           'NEUTRAL' | 'DEDUCING' | 'IONIZED';
}

export interface CanvasState {
  canvasPhase: CanvasPhase;
  bondingType: BondingType | null;
  slotA:       ZoneState | null;
  slotB:       ZoneState | null;
}

export type CanvasAction =
  | { type: 'DROP_ELEMENT';       slot: Slot; zone: ZoneState }
  | { type: 'PICK_TM_CHARGE';     slot: Slot; charge: number }
  | { type: 'DISMISS_EXPLANATION' }
  | { type: 'REPLACE_ELEMENT';    slot: Slot }
  | { type: 'CROSSOVER_COMPLETE' }
  | { type: 'RESET' };
```

- [ ] **Step 4: Update `src/canvas/constants.ts`**

Replace `INITIAL_STATE` (remove `activeDeductionSlot`):

```typescript
import type { CanvasState } from './types';

export interface PolyatomicIon {
  symbol:  string;
  name:    string;
  charge:  number;
  formula: string;
}

export const POLYATOMIC_IONS: PolyatomicIon[] = [
  { symbol: 'OH',  name: 'Hydroxide',  charge: -1, formula: 'OH⁻'  },
  { symbol: 'NO₃', name: 'Nitrate',    charge: -1, formula: 'NO₃⁻' },
  { symbol: 'SO₄', name: 'Sulfate',    charge: -2, formula: 'SO₄²⁻'},
  { symbol: 'CO₃', name: 'Carbonate',  charge: -2, formula: 'CO₃²⁻'},
  { symbol: 'PO₄', name: 'Phosphate',  charge: -3, formula: 'PO₄³⁻'},
  { symbol: 'NH₄', name: 'Ammonium',   charge: +1, formula: 'NH₄⁺' },
];

export const INITIAL_STATE: CanvasState = {
  canvasPhase: 'SELECTING',
  bondingType: null,
  slotA:       null,
  slotB:       null,
};
```

- [ ] **Step 5: Replace `src/canvas/reducer.ts`**

```typescript
import { INITIAL_STATE } from './constants';
import type { CanvasState, CanvasAction, ZoneState, Slot, BondingType, ElementClass } from './types';

function getSlot(state: CanvasState, slot: Slot): ZoneState | null {
  return slot === 'A' ? state.slotA : state.slotB;
}

function setSlot(state: CanvasState, slot: Slot, zone: ZoneState | null): CanvasState {
  return slot === 'A' ? { ...state, slotA: zone } : { ...state, slotB: zone };
}

function otherSlot(slot: Slot): Slot {
  return slot === 'A' ? 'B' : 'A';
}

function determineBonding(a: ElementClass, b: ElementClass): BondingType {
  if (a === 'Metal' && b === 'Metal') return 'Metallic';
  if (a === 'NonMetal' && b === 'NonMetal') return 'Covalent';
  if ((a === 'Metalloid' || a === 'NonMetal') && (b === 'Metalloid' || b === 'NonMetal')) return 'Covalent';
  return 'Ionic';
}

function autoIonize(zone: ZoneState): ZoneState {
  if (zone.isTransition) return { ...zone, status: 'DEDUCING' };
  return { ...zone, status: 'IONIZED', derivedCharge: zone.oxidationStates[0] };
}

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {

    case 'DROP_ELEMENT': {
      const newZone: ZoneState = { ...action.zone, status: 'NEUTRAL', wrongCount: 0 };
      const next = setSlot(state, action.slot, newZone);
      const other = getSlot(next, otherSlot(action.slot));

      if (!other) {
        return { ...next, canvasPhase: 'SLOT_A_FILLED', bondingType: null };
      }

      const bondingType = determineBonding(newZone.elementClass, other.elementClass);

      if (bondingType === 'Covalent' || bondingType === 'Metallic') {
        return { ...next, bondingType, canvasPhase: 'EXPLAINING' };
      }

      // Ionic — auto-ionise both slots immediately
      const ionizedNew   = autoIonize(newZone);
      const ionizedOther = autoIonize(other);
      const slotA = action.slot === 'A' ? ionizedNew : ionizedOther;
      const slotB = action.slot === 'B' ? ionizedNew : ionizedOther;
      return { ...state, slotA, slotB, bondingType, canvasPhase: 'EXPLAINING' };
    }

    case 'PICK_TM_CHARGE': {
      const zone = getSlot(state, action.slot);
      if (!zone) return state;
      const ionized: ZoneState = { ...zone, status: 'IONIZED', derivedCharge: action.charge };
      return setSlot(state, action.slot, ionized);
    }

    case 'DISMISS_EXPLANATION': {
      if (state.bondingType === 'Ionic')    return { ...state, canvasPhase: 'ANIMATING_CROSSOVER' };
      if (state.bondingType === 'Covalent') return { ...state, canvasPhase: 'SHOWING_COVALENT' };
      if (state.bondingType === 'Metallic') return { ...state, canvasPhase: 'SHOWING_METALLIC' };
      return state;
    }

    case 'REPLACE_ELEMENT': {
      const other = getSlot(state, otherSlot(action.slot));
      const resetOther = other
        ? { ...other, status: 'NEUTRAL' as const, derivedCharge: null, wrongCount: 0 }
        : null;
      const cleared = setSlot(state, action.slot, null);
      const reset   = setSlot(cleared, otherSlot(action.slot), resetOther);
      return { ...reset, canvasPhase: resetOther ? 'SLOT_A_FILLED' : 'SELECTING', bondingType: null };
    }

    case 'CROSSOVER_COMPLETE':
      return { ...state, canvasPhase: 'COMPLETE' };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
```

- [ ] **Step 6: Run tests — verify they pass**

```bash
npx vitest run src/__tests__/reducer.test.ts
```

Expected: All pass.

- [ ] **Step 7: Commit**

```bash
git add src/canvas/types.ts src/canvas/constants.ts src/canvas/reducer.ts src/__tests__/reducer.test.ts
git commit -m "refactor: replace interactive deduction with auto-resolve state machine"
```

---

## Task 2: ExplanationModal (TDD)

**Files:**
- Create: `src/bridge/ExplanationModal.tsx`
- Create: `src/__tests__/ExplanationModal.test.tsx`

**Interfaces:**
- Consumes: `useIonicCanvas()` → `{ state, dispatch }`; `TransitionMetalPicker` from `src/zones/TransitionMetalPicker.tsx` (props: `zone: ZoneState`, `onPick: (charge: number) => void`)
- Produces: `ExplanationModal` — zero-prop component, reads context internally

---

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/ExplanationModal.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExplanationModal } from '../bridge/ExplanationModal';
import { INITIAL_STATE } from '../canvas/constants';
import type { CanvasState, ZoneState } from '../canvas/types';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../canvas/hooks', () => ({
  useIonicCanvas: vi.fn(),
}));

import { useIonicCanvas } from '../canvas/hooks';

const mockDispatch = vi.fn();

function mockState(overrides: Partial<CanvasState>) {
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: { ...INITIAL_STATE, ...overrides },
    dispatch: mockDispatch,
  });
}

const mgIonised: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const clIonised: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
const feDeducing: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3], derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};
const oNeutral: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('ExplanationModal', () => {
  beforeEach(() => mockDispatch.mockClear());

  it('renders nothing when phase is not EXPLAINING', () => {
    mockState({ canvasPhase: 'SELECTING' });
    const { container } = render(<ExplanationModal />);
    expect(container.firstChild).toBeNull();
  });

  it('shows ionic charge explanation for Mg', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Mg has 2 valence electrons/)).toBeInTheDocument();
    expect(screen.getByText(/loses 2e/)).toBeInTheDocument();
  });

  it('shows ionic charge explanation for Cl', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Cl has 7 valence electrons/)).toBeInTheDocument();
    expect(screen.getByText(/gains 1e/)).toBeInTheDocument();
  });

  it('Apply button enabled when both IONIZED, dispatches DISMISS_EXPLANATION', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    const btn = screen.getByRole('button', { name: /Apply/ });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DISMISS_EXPLANATION' });
  });

  it('Apply button disabled when TM slot still DEDUCING', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feDeducing, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).toBeDisabled();
  });

  it('shows TransitionMetalPicker for DEDUCING slot', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feDeducing, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Transition metal/)).toBeInTheDocument();
  });

  it('Apply enabled for Covalent regardless of slot status', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Covalent',
      slotA: { ...oNeutral, symbol: 'Cl', valenceElectrons: 7 },
      slotB: oNeutral,
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });

  it('Apply enabled for Metallic regardless of slot status', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
      slotA: { ...oNeutral, symbol: 'Mg', elementClass: 'Metal', valenceElectrons: 2 },
      slotB: { ...oNeutral, symbol: 'Na', elementClass: 'Metal', valenceElectrons: 1 },
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run src/__tests__/ExplanationModal.test.tsx
```

Expected: `Cannot find module '../bridge/ExplanationModal'`

- [ ] **Step 3: Create `src/bridge/ExplanationModal.tsx`**

```typescript
import { motion } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';
import { gcd } from '../utils/gcd';
import type { BondingType, ZoneState, Slot } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = {1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷'};

function formatIon(symbol: string, charge: number): string {
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  return `${symbol}${abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`}`;
}

function chargeExplanation(zone: ZoneState): string {
  if (zone.isPolyatomic) {
    const c = zone.derivedCharge!;
    return `${zone.symbol} is a polyatomic ion with a fixed charge of ${c > 0 ? '+' : ''}${c}`;
  }
  if (zone.elementClass === 'Metal' || zone.elementClass === 'Metalloid') {
    const c = zone.derivedCharge!;
    const ve = zone.valenceElectrons;
    return `${zone.symbol} has ${ve} valence electron${ve !== 1 ? 's' : ''} → loses ${c}e⁻ → ${formatIon(zone.symbol, c)}`;
  }
  const c = Math.abs(zone.derivedCharge!);
  const ve = zone.valenceElectrons;
  return `${zone.symbol} has ${ve} valence electron${ve !== 1 ? 's' : ''} → gains ${c}e⁻ → ${formatIon(zone.symbol, -c)}`;
}

function formulaPreview(cation: ZoneState, anion: ZoneState): string {
  const cC = Math.abs(cation.derivedCharge!);
  const aC = Math.abs(anion.derivedCharge!);
  const g   = gcd(cC, aC);
  const cS  = aC / g;
  const aS  = cC / g;
  const cPart = cS === 1 ? cation.symbol : `${cation.symbol}${SUPERSCRIPTS[cS] ?? cS}`;
  const aPart = anion.isPolyatomic && aS > 1
    ? `(${anion.symbol})${SUPERSCRIPTS[aS] ?? aS}`
    : aS === 1 ? anion.symbol : `${anion.symbol}${SUPERSCRIPTS[aS] ?? aS}`;
  return `${cPart}${aPart}`;
}

function ionicCation(slotA: ZoneState, slotB: ZoneState): { cation: ZoneState; anion: ZoneState } {
  const aCation = slotA.elementClass === 'Metal' || slotA.elementClass === 'Metalloid';
  return aCation ? { cation: slotA, anion: slotB } : { cation: slotB, anion: slotA };
}

function SlotPanel({ zone, slot }: { zone: ZoneState; slot: Slot }) {
  const { dispatch } = useIonicCanvas();
  if (zone.status === 'DEDUCING') {
    return (
      <div className="rounded-lg bg-white/5 p-3">
        <TransitionMetalPicker
          zone={zone}
          onPick={(charge) => dispatch({ type: 'PICK_TM_CHARGE', slot, charge })}
        />
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-white/5 p-3 text-sm text-white/80">
      {chargeExplanation(zone)}
    </div>
  );
}

function BondingSummary({ bondingType, slotA, slotB }: { bondingType: BondingType; slotA: ZoneState; slotB: ZoneState }) {
  if (bondingType === 'Ionic') {
    const { cation, anion } = ionicCation(slotA, slotB);
    if (cation.status !== 'IONIZED' || anion.status !== 'IONIZED') return null;
    return (
      <p className="text-sm text-white/70 text-center">
        Crossover method: each charge becomes the other ion's subscript →{' '}
        <span className="font-bold text-white">{formulaPreview(cation, anion)}</span>
      </p>
    );
  }
  if (bondingType === 'Covalent') {
    const aN = 8 - slotA.valenceElectrons;
    const bN = 8 - slotB.valenceElectrons;
    return (
      <p className="text-sm text-white/70 text-center">
        {slotA.symbol} needs {aN} more electron{aN !== 1 ? 's' : ''} and {slotB.symbol} needs {bN} — they share electrons to complete their octets.
      </p>
    );
  }
  return (
    <p className="text-sm text-white/70 text-center">
      {slotA.symbol} contributes {slotA.valenceElectrons} and {slotB.symbol} contributes {slotB.valenceElectrons} valence electron{slotB.valenceElectrons !== 1 ? 's' : ''} to a delocalised electron sea.
    </p>
  );
}

const BONDING_LABEL: Record<string, string> = {
  Ionic: 'Ionic Bonding', Covalent: 'Covalent Bonding', Metallic: 'Metallic Bonding',
};

export function ExplanationModal() {
  const { state, dispatch } = useIonicCanvas();
  const { slotA, slotB, bondingType, canvasPhase } = state;

  if (canvasPhase !== 'EXPLAINING' || !slotA || !slotB || !bondingType) return null;

  const bothIonised = slotA.status === 'IONIZED' && slotB.status === 'IONIZED';
  const applyEnabled = bondingType !== 'Ionic' || bothIonised;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface border border-muted/30 rounded-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-4 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-white text-center">
          {BONDING_LABEL[bondingType]}
        </h2>

        {bondingType === 'Ionic' && (
          <div className="flex flex-col gap-2">
            <SlotPanel zone={slotA} slot="A" />
            <SlotPanel zone={slotB} slot="B" />
          </div>
        )}

        <div className="border-t border-muted/20 pt-3">
          <BondingSummary bondingType={bondingType} slotA={slotA} slotB={slotB} />
        </div>

        <button
          onClick={() => dispatch({ type: 'DISMISS_EXPLANATION' })}
          disabled={!applyEnabled}
          className={[
            'w-full py-2 rounded-xl text-sm font-bold transition-colors',
            applyEnabled
              ? 'bg-accent/30 border border-accent text-accent hover:bg-accent/50'
              : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed',
          ].join(' ')}
        >
          Apply →
        </button>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run src/__tests__/ExplanationModal.test.tsx
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/bridge/ExplanationModal.tsx src/__tests__/ExplanationModal.test.tsx
git commit -m "feat: add ExplanationModal for auto-resolved bonding"
```

---

## Task 3: Wire Components + Delete Dead Code

**Files:**
- Modify: `src/bridge/BridgeColumn.tsx`
- Modify: `src/zones/DropZone.tsx`
- Modify: `src/tray/ElementTray.tsx`
- Modify: `src/tray/ElementToken.tsx`
- Modify: `src/__tests__/CrossoverAnimator.test.tsx`
- Delete: `src/zones/RegularDeduction.tsx`
- Delete: `src/zones/DeductionPanel.tsx`
- Delete: `src/zones/PolyatomicConfirm.tsx`
- Delete: `src/__tests__/RegularDeduction.test.tsx`
- Delete: `src/__tests__/PolyatomicConfirm.test.tsx`

**Interfaces:**
- Consumes: `ExplanationModal` from Task 2; `REPLACE_ELEMENT` action from Task 1

---

- [ ] **Step 1: Run full test suite — note current failures**

```bash
npx vitest run
```

TypeScript errors will appear because `activeDeductionSlot` was removed but is still referenced in other files. Note which files fail.

- [ ] **Step 2: Update `src/bridge/BridgeColumn.tsx`**

Remove the `READY_TO_CROSS` branch (the "Cross Over →" button block) and replace with `EXPLAINING` branch. Add `ExplanationModal` import. The complete diff:

```typescript
// Add at top of imports:
import { ExplanationModal } from './ExplanationModal';

// Remove these variables (no longer used):
// const isReadyToCross = canvasPhase === 'READY_TO_CROSS';
// (and the READY_TO_CROSS branch in AnimatePresence)

// Replace the isReadyToCross block:
// FROM:
//   {isReadyToCross && slotA && slotB && (() => { ... crossover button ... })()}
// TO: nothing (remove entirely)

// Add before the closing </AnimatePresence>:
//   {canvasPhase === 'EXPLAINING' && <ExplanationModal />}
```

Full replacement for `BridgeColumn.tsx`:

```typescript
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import { CrossoverAnimator } from './CrossoverAnimator';
import { BondingDiagram } from './BondingDiagram';
import { CovalentView } from './CovalentView';
import { MetallicView } from './MetallicView';
import { ExplanationModal } from './ExplanationModal';
import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';

function buildFormulaJsx(
  cSym: string, cSub: number,
  aSym: string, aSub: number,
  anionIsPolyatomic: boolean
): ReactNode {
  return (
    <>
      {cSym}{cSub > 1 && <sub>{cSub}</sub>}
      {anionIsPolyatomic && aSub > 1 ? <>({aSym})<sub>{aSub}</sub></> : <>{aSym}{aSub > 1 && <sub>{aSub}</sub>}</>}
    </>
  );
}

function ionicPair(slotA: ZoneState, slotB: ZoneState): { cation: ZoneState; anion: ZoneState } {
  const aCation = slotA.elementClass === 'Metal' || slotA.elementClass === 'Metalloid';
  return aCation ? { cation: slotA, anion: slotB } : { cation: slotB, anion: slotA };
}

export function BridgeColumn() {
  const { state, dispatch } = useIonicCanvas();
  const { slotA, slotB, canvasPhase, bondingType } = state;

  const isAnimating       = canvasPhase === 'ANIMATING_CROSSOVER';
  const isCompleteIonic   = canvasPhase === 'COMPLETE' && bondingType === 'Ionic';
  const isShowingCovalent = canvasPhase === 'SHOWING_COVALENT';
  const isShowingMetallic = canvasPhase === 'SHOWING_METALLIC';

  let formulaDisplay: ReactNode = null;
  if (isCompleteIonic && slotA && slotB && slotA.derivedCharge !== null && slotB.derivedCharge !== null) {
    const { cation, anion } = ionicPair(slotA, slotB);
    const cCharge = Math.abs(cation.derivedCharge!);
    const aCharge = Math.abs(anion.derivedCharge!);
    const g = gcd(cCharge, aCharge);
    formulaDisplay = buildFormulaJsx(
      cation.symbol, aCharge / g,
      anion.symbol,  cCharge / g,
      anion.isPolyatomic
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-2 min-w-52">
      <span className="text-2xl text-accent/60">⇌</span>

      {canvasPhase === 'EXPLAINING' && <ExplanationModal />}

      <AnimatePresence mode="wait">

        {isAnimating && slotA && slotB && (() => {
          const { cation, anion } = ionicPair(slotA, slotB);
          return (
            <motion.div key="animator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
              <CrossoverAnimator
                cation={cation}
                anion={anion}
                onComplete={() => dispatch({ type: 'CROSSOVER_COMPLETE' })}
              />
            </motion.div>
          );
        })()}

        {isCompleteIonic && slotA && slotB && (() => {
          const { cation, anion } = ionicPair(slotA, slotB);
          return (
            <motion.div
              key="formula"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-2xl font-bold text-white">{formulaDisplay}</span>
              <BondingDiagram cation={cation} anion={anion} />
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
              >
                Reset
              </button>
            </motion.div>
          );
        })()}

        {isShowingCovalent && slotA && slotB && (
          <motion.div
            key="covalent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <CovalentView slotA={slotA} slotB={slotB} />
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="text-xs px-3 py-1 rounded-full border border-muted/60 text-muted hover:border-accent hover:text-accent transition-colors"
            >
              Reset
            </button>
          </motion.div>
        )}

        {isShowingMetallic && slotA && slotB && (
          <motion.div
            key="metallic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <MetallicView slotA={slotA} slotB={slotB} />
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

- [ ] **Step 3: Update `src/zones/DropZone.tsx`**

Remove `DeductionPanel` import and render. Remove `isActiveDeduction`/`isLocked` logic. Add replace button. Disable drop during `EXPLAINING`.

```typescript
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import type { Slot } from '../canvas/types';

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
  slot: Slot;
}

const SLOT_COLORS: Record<Slot, { border: string; glow: string; label: string; text: string }> = {
  A: { border: 'border-cation/40', glow: 'border-cation shadow-cation/20', label: 'text-cation/80', text: 'text-cation' },
  B: { border: 'border-anion/40',  glow: 'border-anion shadow-anion/20',   label: 'text-anion/80',  text: 'text-anion'  },
};

export function DropZone({ slot }: Props) {
  const { state, dispatch } = useIonicCanvas();
  const zone = slot === 'A' ? state.slotA : state.slotB;
  const { canvasPhase } = state;

  const dropDisabled = canvasPhase === 'ANIMATING_CROSSOVER' || canvasPhase === 'EXPLAINING';
  const showReplace  = zone !== null && canvasPhase !== 'ANIMATING_CROSSOVER';

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${slot}`,
    disabled: dropDisabled,
  });

  const colors = SLOT_COLORS[slot];

  return (
    <div
      ref={setNodeRef}
      className={[
        'relative w-72 rounded-xl border-2 min-h-16 transition-all duration-200',
        isOver ? `${colors.glow} shadow-lg` : colors.border,
      ].join(' ')}
    >
      {showReplace && (
        <button
          onClick={() => dispatch({ type: 'REPLACE_ELEMENT', slot })}
          aria-label={`Replace ${slot === 'A' ? 'left' : 'right'} element`}
          className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/30 text-white/40 hover:text-red-400 text-xs flex items-center justify-center transition-colors"
        >
          ×
        </button>
      )}

      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center py-4 ${colors.label} text-sm`}
          >
            Drop element here
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="filled"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={`text-center py-3 text-2xl font-bold ${colors.text}`}>
              {zone.symbol}
            </div>
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center py-4 text-3xl font-bold ${colors.text}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Update `src/tray/ElementTray.tsx` — add `EXPLAINING` to disable condition**

Find the `isDraggingDisabled` declaration (line 43–46) and add `EXPLAINING`:

```typescript
// FROM:
const isDraggingDisabled = state.canvasPhase === 'ANIMATING_CROSSOVER'
  || state.canvasPhase === 'SHOWING_COVALENT'
  || state.canvasPhase === 'SHOWING_METALLIC';

// TO:
const isDraggingDisabled = state.canvasPhase === 'ANIMATING_CROSSOVER'
  || state.canvasPhase === 'SHOWING_COVALENT'
  || state.canvasPhase === 'SHOWING_METALLIC'
  || state.canvasPhase === 'EXPLAINING';
```

- [ ] **Step 5: Fix `PolyatomicToken` missing `elementClass` in `src/tray/ElementToken.tsx`**

Find the `zoneState` object inside `PolyatomicToken` (around line 118) and add `elementClass: 'NonMetal'`:

```typescript
// FROM:
const zoneState: ZoneState = {
  symbol:           ion.symbol,
  isPolyatomic:     true,

// TO:
const zoneState: ZoneState = {
  symbol:           ion.symbol,
  elementClass:     'NonMetal',
  isPolyatomic:     true,
```

- [ ] **Step 6: Fix `elementClass` missing in `CrossoverAnimator.test.tsx` fixtures**

The test fixtures `mg`, `cl`, `ca`, `o`, `oh`, `na` are missing `elementClass`. Add it to each:

```typescript
// mg fixture — add elementClass: 'Metal'
const mg: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
// cl — elementClass: 'NonMetal'
const cl: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
// ca — elementClass: 'Metal'
const ca: ZoneState = {
  symbol: 'Ca', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
// o — elementClass: 'NonMetal'
const o: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2], derivedCharge: -2, wrongCount: 0, status: 'IONIZED',
};
// oh — elementClass: 'NonMetal'
const oh: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
// na fixture inside test body — elementClass: 'Metal'
const na: ZoneState = {
  symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 1, oxidationStates: [1], derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
};
```

- [ ] **Step 7: Delete dead component files**

```bash
rm src/zones/RegularDeduction.tsx
rm src/zones/DeductionPanel.tsx
rm src/zones/PolyatomicConfirm.tsx
rm src/__tests__/RegularDeduction.test.tsx
rm src/__tests__/PolyatomicConfirm.test.tsx
```

- [ ] **Step 8: Run full test suite — verify all pass**

```bash
npx vitest run
```

Expected: All tests pass. Zero TypeScript errors (`npx tsc --noEmit`).

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/bridge/BridgeColumn.tsx src/zones/DropZone.tsx src/tray/ElementTray.tsx src/tray/ElementToken.tsx src/__tests__/CrossoverAnimator.test.tsx
git commit -m "feat: wire ExplanationModal, add replace button, remove deduction quiz"
```
