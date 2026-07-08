# Reaction Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone "Reaction" panel that lets the user assemble two reactants from the element tray and drives the `solveCompoundReaction` wasm binding, rendering the balanced equation, reaction class, feasibility, limiting/yields, and redox analysis.

**Architecture:** A top-level Build/React mode toggle in `App.tsx` swaps the existing `IonicCanvas` for a new `ReactionView`. `ReactionView` owns a local `useReducer` state (two reactant bins of 1–2 `ZoneState` each, quantities, result), reuses `ElementTray` for species picking via a new optional `onPick` prop, and renders results in a presentational panel that mirrors `StoichResultPanel`. Everything is additive except a small backward-compatible refactor to the tray and a restructure of `App.tsx`.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind v4 (CSS-first `@theme`), vitest + React Testing Library + `@testing-library/user-event`, the `@periodic-table` wasm module (bundler target, self-initialising).

## Global Constraints

- Design spec: `docs/superpowers/specs/2026-07-08-reaction-panel-design.md`. Every task's requirements implicitly include it.
- Repo: `chem-interactive` @ branch `feat/synch-ios`. Do NOT create a new branch.
- Additive only, except: `App.tsx` (restructured for the toggle) and `src/tray/ElementTray.tsx` + `src/tray/ElementToken.tsx` (backward-compatible optional `onPick` prop). Do NOT change the existing ionic-compound canvas behavior.
- Types come from `@periodic-table` (the wasm module alias): `WasmSpecies`, `WasmQuantity`, `WasmReactionResult`, `WasmTerm`, `WasmRedox`, `WasmElementRedox`. `ZoneState` from `../canvas/types`; `ReactantEntry`/`QuantityUnit` from `../stoich/types`.
- `WasmSpecies` shape: `{ symbol: string; is_polyatomic: boolean; charge: number | undefined }`.
- `WasmReactionResult` shape: `{ feasible: boolean; reaction_class: string; reactants: WasmTerm[]; products: WasmTerm[]; limiting: string /* 'A'|'B'|'Both' */; yields: [number, number][] /* (mole, mass) per product */; excess: [number, number]; messages: string[]; error: string | undefined; redox: WasmRedox | undefined }`.
- `WasmTerm`: `{ coeff: number; formula: string; molar_mass: number; composition: [string, number][] }`.
- `WasmRedox`: `{ is_redox: boolean; oxidising_agent: string | undefined; reducing_agent: string | undefined; changes: WasmElementRedox[]; narrative: string[] }`.
- `WasmElementRedox`: `{ symbol: string; before: number; after: number; change: string; reactant_formula: string; product_formula: string }`.
- **Tailwind JIT gotcha:** Tailwind only generates classes it finds as *literal* strings in source. NEVER build class names by interpolation (`` `bg-${color}` ``) — use a literal-string lookup map instead. The `cation`/`anion`/`accent`/`surface`/`bg`/`muted` tokens exist (`src/index.css` `@theme`).
- Commit-message convention (repo standard): `feat:` / `chore:` / `fix:` prefix, **no scope parentheses**, body lines < 70 chars, and **no `Co-Authored-By` trailer**.
- Test command: `npx vitest run <path>` (there is no `test` npm script). Build check: `npm run build` (`tsc -b && vite build`).

## File Structure

New (`src/reaction/`):
- `speciesMap.ts` — pure `ZoneState → WasmSpecies` and `ReactantEntry → WasmQuantity` mappers.
- `reactionReducer.ts` — pure reducer + state/action types for the two bins, quantities, and result.
- `ReactantBin.tsx` — presentational: one reactant's chips + inline TM charge picker + quantity input.
- `ReactionResultPanel.tsx` — presentational: renders a `WasmReactionResult`.
- `ReactionView.tsx` — container: wires tray `onPick` → reducer → `solveCompoundReaction` → panel.
- Tests: `speciesMap.test.ts`, `reactionReducer.test.ts`, `ReactantBin.test.tsx`, `ReactionResultPanel.test.tsx`, `ReactionView.test.tsx`.

Modified:
- `src/tray/ElementTray.tsx` + `src/tray/ElementToken.tsx` — optional `onPick` prop.
- `src/App.tsx` — mode toggle; `IonicCanvasProvider` hoisted to wrap both modes.

---

### Task 1: speciesMap (pure mappers)

**Files:**
- Create: `src/reaction/speciesMap.ts`
- Test: `src/reaction/speciesMap.test.ts`

**Interfaces:**
- Consumes: `ZoneState` (`../canvas/types`), `ReactantEntry` (`../stoich/types`), `WasmSpecies`/`WasmQuantity` (`@periodic-table`).
- Produces: `zoneToSpecies(z: ZoneState): WasmSpecies`; `qtyToWasm(q: ReactantEntry | null): WasmQuantity | undefined`.

> Note: `ReactantEntry.unit` is `'mole' | 'mass'`; pass it through verbatim as `WasmQuantity.unit`. The flagship tests use no quantities, so this string is not exercised by tests here — it is only relevant when a user sets a quantity.

- [ ] **Step 1: Write the failing test**

```ts
// src/reaction/speciesMap.test.ts
import { describe, it, expect } from 'vitest';
import { zoneToSpecies, qtyToWasm } from './speciesMap';
import type { ZoneState } from '../canvas/types';

function zone(partial: Partial<ZoneState>): ZoneState {
  return {
    symbol: 'X', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
    valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
    wrongCount: 0, status: 'NEUTRAL', ...partial,
  };
}

describe('zoneToSpecies', () => {
  it('maps an element with no chosen charge to undefined charge', () => {
    expect(zoneToSpecies(zone({ symbol: 'Na' }))).toEqual({ symbol: 'Na', is_polyatomic: false, charge: undefined });
  });
  it('carries a chosen charge (transition metal)', () => {
    expect(zoneToSpecies(zone({ symbol: 'Cu', isTransition: true, derivedCharge: 2 })))
      .toEqual({ symbol: 'Cu', is_polyatomic: false, charge: 2 });
  });
  it('marks a polyatomic ion', () => {
    expect(zoneToSpecies(zone({ symbol: 'SO₄', isPolyatomic: true, derivedCharge: -2 })))
      .toEqual({ symbol: 'SO₄', is_polyatomic: true, charge: -2 });
  });
});

describe('qtyToWasm', () => {
  it('maps null to undefined', () => { expect(qtyToWasm(null)).toBeUndefined(); });
  it('maps a set quantity', () => { expect(qtyToWasm({ value: 2, unit: 'mole' })).toEqual({ value: 2, unit: 'mole' }); });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/speciesMap.test.ts`
Expected: FAIL — cannot resolve `./speciesMap`.

- [ ] **Step 3: Write the implementation**

```ts
// src/reaction/speciesMap.ts
import type { WasmSpecies, WasmQuantity } from '@periodic-table';
import type { ZoneState } from '../canvas/types';
import type { ReactantEntry } from '../stoich/types';

export function zoneToSpecies(z: ZoneState): WasmSpecies {
  return {
    symbol: z.symbol,
    is_polyatomic: z.isPolyatomic,
    charge: z.derivedCharge ?? undefined,
  };
}

export function qtyToWasm(q: ReactantEntry | null): WasmQuantity | undefined {
  return q ? { value: q.value, unit: q.unit } : undefined;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/reaction/speciesMap.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/reaction/speciesMap.ts src/reaction/speciesMap.test.ts
git commit -m "feat: add reaction species mappers"
```

---

### Task 2: reactionReducer (pure state)

**Files:**
- Create: `src/reaction/reactionReducer.ts`
- Test: `src/reaction/reactionReducer.test.ts`

**Interfaces:**
- Consumes: `ZoneState`, `ReactantEntry`, `WasmReactionResult`.
- Produces: `ReactionState`, `ReactionAction`, `INITIAL_REACTION_STATE`, `reactionReducer(state, action)`. `type Bin = 'A' | 'B'`.

- [ ] **Step 1: Write the failing test**

```ts
// src/reaction/reactionReducer.test.ts
import { describe, it, expect } from 'vitest';
import { reactionReducer, INITIAL_REACTION_STATE } from './reactionReducer';
import type { ZoneState } from '../canvas/types';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('reactionReducer', () => {
  it('adds a species to the active bin', () => {
    const s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    expect(s.reactantA.map(x => x.symbol)).toEqual(['Na']);
  });
  it('caps a bin at 2 species', () => {
    let s = INITIAL_REACTION_STATE;
    for (const sym of ['Na', 'O', 'H']) s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z(sym) });
    expect(s.reactantA).toHaveLength(2);
  });
  it('routes picks to the active bin', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'SET_ACTIVE_BIN', bin: 'B' });
    s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z('Cl') });
    expect(s.reactantB.map(x => x.symbol)).toEqual(['Cl']);
    expect(s.reactantA).toHaveLength(0);
  });
  it('removes a species by index', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    s = reactionReducer(s, { type: 'PICK_SPECIES', zone: z('O') });
    s = reactionReducer(s, { type: 'REMOVE_SPECIES', bin: 'A', index: 0 });
    expect(s.reactantA.map(x => x.symbol)).toEqual(['O']);
  });
  it('sets a transition-metal charge on the indexed species', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Cu', { isTransition: true, oxidationStates: [1, 2] }) });
    s = reactionReducer(s, { type: 'SET_TM_CHARGE', bin: 'A', index: 0, charge: 2 });
    expect(s.reactantA[0].derivedCharge).toBe(2);
  });
  it('clears the result whenever the inputs change', () => {
    const withResult = { ...INITIAL_REACTION_STATE, result: { feasible: true } as never };
    expect(reactionReducer(withResult, { type: 'PICK_SPECIES', zone: z('Na') }).result).toBeNull();
  });
  it('resets to the initial state', () => {
    let s = reactionReducer(INITIAL_REACTION_STATE, { type: 'PICK_SPECIES', zone: z('Na') });
    expect(reactionReducer(s, { type: 'RESET' })).toEqual(INITIAL_REACTION_STATE);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/reactionReducer.test.ts`
Expected: FAIL — cannot resolve `./reactionReducer`.

- [ ] **Step 3: Write the implementation**

```ts
// src/reaction/reactionReducer.ts
import type { ZoneState } from '../canvas/types';
import type { ReactantEntry } from '../stoich/types';
import type { WasmReactionResult } from '@periodic-table';

export type Bin = 'A' | 'B';

export interface ReactionState {
  reactantA: ZoneState[];
  reactantB: ZoneState[];
  activeBin: Bin;
  qtyA: ReactantEntry | null;
  qtyB: ReactantEntry | null;
  result: WasmReactionResult | null;
}

export const INITIAL_REACTION_STATE: ReactionState = {
  reactantA: [], reactantB: [], activeBin: 'A', qtyA: null, qtyB: null, result: null,
};

export type ReactionAction =
  | { type: 'PICK_SPECIES';   zone: ZoneState }
  | { type: 'REMOVE_SPECIES'; bin: Bin; index: number }
  | { type: 'SET_ACTIVE_BIN'; bin: Bin }
  | { type: 'SET_TM_CHARGE';  bin: Bin; index: number; charge: number }
  | { type: 'SET_QTY';        bin: Bin; entry: ReactantEntry | null }
  | { type: 'SET_RESULT';     result: WasmReactionResult | null }
  | { type: 'RESET' };

const speciesKey = (bin: Bin) => (bin === 'A' ? 'reactantA' : 'reactantB') as 'reactantA' | 'reactantB';

export function reactionReducer(state: ReactionState, action: ReactionAction): ReactionState {
  switch (action.type) {
    case 'PICK_SPECIES': {
      const key = speciesKey(state.activeBin);
      if (state[key].length >= 2) return state;
      return { ...state, [key]: [...state[key], action.zone], result: null };
    }
    case 'REMOVE_SPECIES': {
      const key = speciesKey(action.bin);
      return { ...state, [key]: state[key].filter((_, i) => i !== action.index), result: null };
    }
    case 'SET_ACTIVE_BIN':
      return { ...state, activeBin: action.bin };
    case 'SET_TM_CHARGE': {
      const key = speciesKey(action.bin);
      return {
        ...state,
        [key]: state[key].map((z, i) => (i === action.index ? { ...z, derivedCharge: action.charge } : z)),
        result: null,
      };
    }
    case 'SET_QTY':
      return { ...state, [action.bin === 'A' ? 'qtyA' : 'qtyB']: action.entry };
    case 'SET_RESULT':
      return { ...state, result: action.result };
    case 'RESET':
      return INITIAL_REACTION_STATE;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/reaction/reactionReducer.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/reaction/reactionReducer.ts src/reaction/reactionReducer.test.ts
git commit -m "feat: add reaction panel reducer"
```

---

### Task 3: ElementTray onPick refactor (decouple tap from canvas)

**Files:**
- Modify: `src/tray/ElementTray.tsx`
- Modify: `src/tray/ElementToken.tsx`

**Interfaces:**
- Produces: `ElementTray` gains optional prop `onPick?: (z: ZoneState) => void`; when provided, a token tap calls `onPick(zoneState)` instead of the canvas selection. When absent, behavior is unchanged (backward compatible). `ElementToken` and `PolyatomicToken` each gain the same optional `onPick`.

- [ ] **Step 1: Add `onPick` to `ElementToken` and route the tap**

In `src/tray/ElementToken.tsx`, extend `interface Props` (currently ends at the `bondHint?: BondHint;` line) to add `onPick`:

```ts
interface Props {
  element: WasmElement;
  disabled?: boolean;
  size?: 'sm' | 'md';
  bondHint?: BondHint;
  onPick?: (z: ZoneState) => void;
}
```

Change the `ElementToken` signature to destructure it:

```ts
export function ElementToken({ element, disabled = false, size = 'md', bondHint, onPick }: Props) {
```

Replace the body of `handleTouchEnd`'s final action and `handleClick` so that when `onPick` is present it wins. In `handleTouchEnd`, replace the last three lines (`if (isInactive) return; if (isSelected) clearSelection(); else selectElement(...)`) with:

```ts
    if (isInactive) return;
    if (onPick) { onPick(makeZoneState(element, valence)); return; }
    if (isSelected) clearSelection();
    else selectElement(makeZoneState(element, valence));
```

And replace the body of `handleClick` after `e.stopPropagation();`:

```ts
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // prevent document click listener from clearing selection
    if (isInactive) return;
    if (onPick) { onPick(makeZoneState(element, valence)); return; }
    if (isSelected) clearSelection();
    else selectElement(makeZoneState(element, valence));
  }
```

- [ ] **Step 2: Add `onPick` to `PolyatomicToken`**

Extend `interface PolyTokenProps` to add `onPick?: (z: ZoneState) => void;`, destructure it in the signature `export function PolyatomicToken({ ion, disabled = false, onPick }: PolyTokenProps)`, and in both `handleTouchEnd` and `handleClick` insert, right after the `if (disabled) return;` line:

```ts
    if (onPick) { onPick(zoneState); return; }
```

- [ ] **Step 3: Thread `onPick` through `ElementTray`**

In `src/tray/ElementTray.tsx`, change the signature:

```ts
export function ElementTray({ onPick }: { onPick?: (z: ZoneState) => void } = {}) {
```

Add the `ZoneState` import to the existing type import line:

```ts
import type { ElementClass, ZoneState } from '../canvas/types';
```

Pass `onPick` to every `<ElementToken .../>` (there are three usages — main table, lanthanides, actinides) by adding `onPick={onPick}`, and to the `<PolyatomicToken .../>` usage by adding `onPick={onPick}`. Example for the main-table token:

```tsx
<ElementToken element={el} disabled={isDraggingDisabled} size="sm" bondHint={hint} onPick={onPick} />
```

- [ ] **Step 4: Verify backward compatibility (build + existing tests)**

Run: `npm run build`
Expected: succeeds (tsc clean) — the canvas's existing `<ElementTray />` usage compiles with `onPick` omitted.

Run: `npx vitest run`
Expected: the existing suite still passes (no behavior change to the canvas path).

- [ ] **Step 5: Commit**

```bash
git add src/tray/ElementTray.tsx src/tray/ElementToken.tsx
git commit -m "feat: add optional onPick to element tray"
```

---

### Task 4: ReactantBin (presentational)

**Files:**
- Create: `src/reaction/ReactantBin.tsx`
- Test: `src/reaction/ReactantBin.test.tsx`

**Interfaces:**
- Consumes: `ZoneState`, `ReactantEntry`/`QuantityUnit`, `TransitionMetalPicker` (`../zones/TransitionMetalPicker`, props `{ zone: ZoneState; onPick: (charge: number) => void }`).
- Produces: `ReactantBin` component. Props: `{ label: 'A' | 'B'; species: ZoneState[]; active: boolean; qty: ReactantEntry | null; onActivate: () => void; onRemove: (index: number) => void; onPickCharge: (index: number, charge: number) => void; onQty: (entry: ReactantEntry | null) => void }`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/reaction/ReactantBin.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactantBin } from './ReactantBin';
import type { ZoneState } from '../canvas/types';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

const noop = () => {};

it('renders a chip per species and fires onRemove', async () => {
  const onRemove = vi.fn();
  render(<ReactantBin label="A" species={[z('Na')]} active qty={null}
    onActivate={noop} onRemove={onRemove} onPickCharge={noop} onQty={noop} />);
  expect(screen.getByText('Na')).toBeInTheDocument();
  await userEvent.click(screen.getByText('×'));
  expect(onRemove).toHaveBeenCalledWith(0);
});

it('shows the TM charge picker for an unresolved transition metal and fires onPickCharge', async () => {
  const onPickCharge = vi.fn();
  render(<ReactantBin label="B" species={[z('Cu', { isTransition: true, oxidationStates: [1, 2] })]} active={false} qty={null}
    onActivate={noop} onRemove={noop} onPickCharge={onPickCharge} onQty={noop} />);
  await userEvent.click(screen.getByText('Cu²+'));
  expect(onPickCharge).toHaveBeenCalledWith(0, 2);
});

it('fires onActivate when the bin is clicked', async () => {
  const onActivate = vi.fn();
  render(<ReactantBin label="A" species={[]} active={false} qty={null}
    onActivate={onActivate} onRemove={noop} onPickCharge={noop} onQty={noop} />);
  await userEvent.click(screen.getByText(/Reactant A/));
  expect(onActivate).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/ReactantBin.test.tsx`
Expected: FAIL — cannot resolve `./ReactantBin`.

- [ ] **Step 3: Write the implementation** (note the literal-class lookup — no interpolated Tailwind classes)

```tsx
// src/reaction/ReactantBin.tsx
import type { ZoneState } from '../canvas/types';
import type { ReactantEntry, QuantityUnit } from '../stoich/types';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';

interface Props {
  label: 'A' | 'B';
  species: ZoneState[];
  active: boolean;
  qty: ReactantEntry | null;
  onActivate: () => void;
  onRemove: (index: number) => void;
  onPickCharge: (index: number, charge: number) => void;
  onQty: (entry: ReactantEntry | null) => void;
}

// Literal strings so Tailwind's JIT can see them.
const STYLE = {
  A: { border: 'border-2 border-cation', chip: 'bg-cation' },
  B: { border: 'border-2 border-anion',  chip: 'bg-anion'  },
} as const;

const chargeLabel = (c: number) => `${c > 0 ? '+' : ''}${c}`;

export function ReactantBin({ label, species, active, qty, onActivate, onRemove, onPickCharge, onQty }: Props) {
  const s = STYLE[label];
  return (
    <div
      onClick={onActivate}
      className={[
        'flex flex-col gap-2 rounded-lg bg-surface p-3 min-h-24 cursor-pointer transition-all',
        active ? s.border : 'border border-muted/40',
      ].join(' ')}
    >
      <div className="text-xs text-muted">Reactant {label}{active ? ' (active)' : ''}</div>

      <div className="flex gap-2 flex-wrap min-h-8 items-center">
        {species.length === 0 && <span className="text-xs text-white/30">tap tray to add (1–2 species)</span>}
        {species.map((z, i) => (
          <span key={`${z.symbol}-${i}`} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${s.chip}`}>
            {z.symbol}{z.derivedCharge != null ? chargeLabel(z.derivedCharge) : ''}
            <button
              aria-label={`remove ${z.symbol}`}
              onClick={e => { e.stopPropagation(); onRemove(i); }}
              className="ml-0.5 text-bg/70 hover:text-bg"
            >×</button>
          </span>
        ))}
      </div>

      {species.map((z, i) =>
        z.isTransition && z.derivedCharge == null
          ? <TransitionMetalPicker key={`tm-${i}`} zone={z} onPick={c => onPickCharge(i, c)} />
          : null,
      )}

      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <input
          type="number"
          placeholder="qty (optional)"
          value={qty?.value ?? ''}
          onChange={e => onQty(e.target.value === '' ? null : { value: Number(e.target.value), unit: qty?.unit ?? 'mole' })}
          className="h-9 w-28 rounded bg-bg px-2 text-white text-sm focus:ring-2 focus:ring-accent"
        />
        <select
          value={qty?.unit ?? 'mole'}
          onChange={e => { if (qty) onQty({ value: qty.value, unit: e.target.value as QuantityUnit }); }}
          className="h-9 rounded bg-bg px-2 text-white text-sm"
        >
          <option value="mole">mol</option>
          <option value="mass">g</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/reaction/ReactantBin.test.tsx`
Expected: PASS (3 tests). (`Cu²+` comes from `TransitionMetalPicker`'s `{symbol}{superscript}+` rendering, with `SUPERSCRIPTS[2] === '²'`.)

- [ ] **Step 5: Commit**

```bash
git add src/reaction/ReactantBin.tsx src/reaction/ReactantBin.test.tsx
git commit -m "feat: add reactant bin component"
```

---

### Task 5: ReactionResultPanel (presentational)

**Files:**
- Create: `src/reaction/ReactionResultPanel.tsx`
- Test: `src/reaction/ReactionResultPanel.test.tsx`

**Interfaces:**
- Consumes: `WasmReactionResult`, `WasmTerm`, `WasmRedox` (`@periodic-table`).
- Produces: `ReactionResultPanel` component. Props: `{ result: WasmReactionResult; showQuantities: boolean }`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/reaction/ReactionResultPanel.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactionResultPanel } from './ReactionResultPanel';
import type { WasmReactionResult } from '@periodic-table';

const term = (coeff: number, formula: string): WasmReactionResult['products'][number] =>
  ({ coeff, formula, molar_mass: 0, composition: [] });

const base: WasmReactionResult = {
  feasible: true, reaction_class: 'DoubleDisplacement',
  reactants: [term(1, 'NaOH'), term(1, 'HCl')],
  products: [term(1, 'NaCl'), term(1, 'H₂O')],
  limiting: 'Both', yields: [[1, 58.44], [1, 18.02]], excess: [0, 0],
  messages: [], error: undefined, redox: undefined,
};

it('renders the balanced equation and class', () => {
  render(<ReactionResultPanel result={base} showQuantities={false} />);
  expect(screen.getByText(/NaOH \+ HCl → NaCl \+ H₂O/)).toBeInTheDocument();
  expect(screen.getByText('DoubleDisplacement')).toBeInTheDocument();
});

it('hides yield rows when showQuantities is false', () => {
  render(<ReactionResultPanel result={base} showQuantities={false} />);
  expect(screen.queryByText(/mol/)).not.toBeInTheDocument();
});

it('shows yield rows when showQuantities is true', () => {
  render(<ReactionResultPanel result={base} showQuantities />);
  expect(screen.getByText(/58\.44 g/)).toBeInTheDocument();
});

it('renders the redox block with agents', () => {
  const redox: WasmReactionResult = {
    ...base, reaction_class: 'SingleDisplacement',
    redox: { is_redox: true, oxidising_agent: 'CuSO₄', reducing_agent: 'Zn',
      changes: [{ symbol: 'Zn', before: 0, after: 2, change: 'Oxidised', reactant_formula: 'Zn', product_formula: 'ZnSO₄' }],
      narrative: ['Zn is oxidised.'] },
  };
  render(<ReactionResultPanel result={redox} showQuantities={false} />);
  expect(screen.getByText(/Reducing agent: Zn/)).toBeInTheDocument();
  expect(screen.getByText(/Oxidising agent: CuSO₄/)).toBeInTheDocument();
});

it('shows error/messages when infeasible', () => {
  const infeasible: WasmReactionResult = {
    ...base, feasible: false, products: [], yields: [],
    messages: ['Cu cannot displace Zn (activity series).'], error: undefined,
  };
  render(<ReactionResultPanel result={infeasible} showQuantities={false} />);
  expect(screen.getByText(/activity series/)).toBeInTheDocument();
  expect(screen.queryByText(/→/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/ReactionResultPanel.test.tsx`
Expected: FAIL — cannot resolve `./ReactionResultPanel`.

- [ ] **Step 3: Write the implementation**

```tsx
// src/reaction/ReactionResultPanel.tsx
import type { WasmReactionResult, WasmTerm, WasmRedox } from '@periodic-table';

const coef = (n: number, s: string) => (n === 1 ? s : `${n}${s}`);
const sign = (n: number) => (n > 0 ? `+${n}` : n === 0 ? '0' : `${n}`);
const equation = (ts: WasmTerm[]) => ts.map(t => coef(t.coeff, t.formula)).join(' + ');

function RedoxBlock({ redox }: { redox: WasmRedox }) {
  if (!redox.is_redox) {
    return <div className="text-xs text-muted border-t border-muted/30 pt-2">{redox.narrative[0] ?? 'Not a redox reaction.'}</div>;
  }
  return (
    <div className="flex flex-col gap-1 border-t border-muted/30 pt-2">
      <div className="text-xs text-accent font-semibold">Redox</div>
      {redox.oxidising_agent && <div className="text-xs text-white">Oxidising agent: {redox.oxidising_agent}</div>}
      {redox.reducing_agent && <div className="text-xs text-white">Reducing agent: {redox.reducing_agent}</div>}
      {redox.changes.map(c => (
        <div key={`${c.symbol}-${c.reactant_formula}-${c.product_formula}`} className="text-xs text-muted">
          {c.symbol}: {sign(c.before)} → {sign(c.after)} ({c.change})
        </div>
      ))}
      {redox.narrative.map(line => <div key={line} className="text-[11px] text-white/70">{line}</div>)}
    </div>
  );
}

export function ReactionResultPanel({ result, showQuantities }: { result: WasmReactionResult; showQuantities: boolean }) {
  if (!result.feasible) {
    return (
      <div className="flex flex-col gap-1 rounded-lg bg-surface p-3">
        {result.error && <div className="text-sm text-anion">{result.error}</div>}
        {result.messages.map(m => <div key={m} className="text-xs text-amber-400">{m}</div>)}
        {!result.error && result.messages.length === 0 && <div className="text-xs text-muted">No reaction.</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-3">
      <div className="text-center text-lg text-white">
        {equation(result.reactants)} → {equation(result.products)}
      </div>
      <div>
        <span className="rounded-full px-2 py-0.5 text-xs text-bg bg-accent">{result.reaction_class}</span>
      </div>

      {showQuantities && (
        <>
          {result.products.map((p, i) => {
            const y = result.yields[i];
            if (!y) return null;
            return (
              <div key={p.formula} className="flex items-center gap-2 py-0.5 text-sm">
                <span className="flex-1 text-white">{p.formula}</span>
                <span className="font-bold text-white">{y[0].toFixed(2)} mol</span>
                <span className="text-muted">{y[1].toFixed(2)} g</span>
              </div>
            );
          })}
          {result.limiting !== 'Both' && <div className="text-xs text-muted">Limiting: reactant {result.limiting}</div>}
          {result.excess[0] > 0 && (
            <div className="text-xs text-muted">Excess: {result.excess[0].toFixed(2)} mol ({result.excess[1].toFixed(2)} g)</div>
          )}
        </>
      )}

      {result.messages.map(m => <div key={m} className="text-xs text-amber-400">{m}</div>)}
      {result.redox && <RedoxBlock redox={result.redox} />}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/reaction/ReactionResultPanel.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/reaction/ReactionResultPanel.tsx src/reaction/ReactionResultPanel.test.tsx
git commit -m "feat: add reaction result panel"
```

---

### Task 6: ReactionView (container) + real-wasm integration test

**Files:**
- Create: `src/reaction/ReactionView.tsx`
- Test: `src/reaction/ReactionView.test.tsx`

**Interfaces:**
- Consumes: `ElementTray` (`../tray/ElementTray`, prop `onPick`), `ReactantBin` (Task 4), `ReactionResultPanel` (Task 5), `reactionReducer`/`INITIAL_REACTION_STATE` (Task 2), `zoneToSpecies`/`qtyToWasm` (Task 1), `solveCompoundReaction` (`../wasm/reaction`).
- Produces: `ReactionView` component (no props). Must be mounted inside `WasmProvider` + `IonicCanvasProvider` (the tray reads both).

- [ ] **Step 1: Write the implementation**

```tsx
// src/reaction/ReactionView.tsx
import { useReducer } from 'react';
import { ElementTray } from '../tray/ElementTray';
import { ReactantBin } from './ReactantBin';
import { ReactionResultPanel } from './ReactionResultPanel';
import { reactionReducer, INITIAL_REACTION_STATE } from './reactionReducer';
import { zoneToSpecies, qtyToWasm } from './speciesMap';
import { solveCompoundReaction } from '../wasm/reaction';

export function ReactionView() {
  const [state, dispatch] = useReducer(reactionReducer, INITIAL_REACTION_STATE);
  const canSolve = state.reactantA.length > 0 && state.reactantB.length > 0;
  const showQuantities = state.qtyA != null || state.qtyB != null;

  function solve() {
    const result = solveCompoundReaction(
      state.reactantA.map(zoneToSpecies),
      state.reactantB.map(zoneToSpecies),
      qtyToWasm(state.qtyA),
      qtyToWasm(state.qtyB),
    );
    dispatch({ type: 'SET_RESULT', result });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 max-h-[45vh] overflow-auto">
        <ElementTray onPick={z => dispatch({ type: 'PICK_SPECIES', zone: z })} />
      </div>
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-3 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          <ReactantBin
            label="A" species={state.reactantA} active={state.activeBin === 'A'} qty={state.qtyA}
            onActivate={() => dispatch({ type: 'SET_ACTIVE_BIN', bin: 'A' })}
            onRemove={i => dispatch({ type: 'REMOVE_SPECIES', bin: 'A', index: i })}
            onPickCharge={(i, c) => dispatch({ type: 'SET_TM_CHARGE', bin: 'A', index: i, charge: c })}
            onQty={e => dispatch({ type: 'SET_QTY', bin: 'A', entry: e })}
          />
          <ReactantBin
            label="B" species={state.reactantB} active={state.activeBin === 'B'} qty={state.qtyB}
            onActivate={() => dispatch({ type: 'SET_ACTIVE_BIN', bin: 'B' })}
            onRemove={i => dispatch({ type: 'REMOVE_SPECIES', bin: 'B', index: i })}
            onPickCharge={(i, c) => dispatch({ type: 'SET_TM_CHARGE', bin: 'B', index: i, charge: c })}
            onQty={e => dispatch({ type: 'SET_QTY', bin: 'B', entry: e })}
          />
        </div>
        <div className="flex gap-2 justify-center">
          <button
            disabled={!canSolve} onClick={solve}
            className="text-xs px-4 py-1 rounded-full border border-accent/60 text-accent hover:bg-accent hover:text-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >Solve</button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="text-xs px-4 py-1 rounded-full border border-muted/60 text-muted hover:bg-muted/20 transition-colors"
          >Reset</button>
        </div>
        {state.result && <ReactionResultPanel result={state.result} showQuantities={showQuantities} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the real-wasm integration test**

This mounts the full stack (`WasmProvider` loads the real wasm periodic table, as the existing `src/wasm/__tests__/reaction.test.ts` does) and drives the panel exactly as a user would. Element tokens render their `symbol` as text; polyatomic tokens render `ion.formula`; the tray tabs are buttons labelled `Elements` / `Polyatomic Ions`; `ReactantBin` shows `Reactant A` / `Reactant B`; the TM picker button reads e.g. `Zn²+`.

```tsx
// src/reaction/ReactionView.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasmProvider } from '../wasm/WasmProvider';
import { IonicCanvasProvider } from '../canvas/IonicCanvasProvider';
import { ReactionView } from './ReactionView';

function mount() {
  return render(
    <WasmProvider>
      <IonicCanvasProvider>
        <ReactionView />
      </IonicCanvasProvider>
    </WasmProvider>,
  );
}

describe('ReactionView (real wasm)', () => {
  it('solves NaOH + HCl → NaCl + H₂O (double displacement)', async () => {
    const u = userEvent.setup();
    mount();
    // wait for the wasm-loaded tray to render an element token
    await screen.findByText('Na', {}, { timeout: 15000 });

    await u.click(screen.getByText('Na'));                       // A ← Na
    await u.click(screen.getByText('Polyatomic Ions'));
    await u.click(screen.getByText('OH'));                       // A ← OH
    await u.click(screen.getByText(/Reactant B/));               // activate B
    await u.click(screen.getByText('Elements'));
    await u.click(screen.getByText('H'));                        // B ← H
    await u.click(screen.getByText('Cl'));                       // B ← Cl
    await u.click(screen.getByText('Solve'));

    expect(await screen.findByText(/NaCl/)).toBeInTheDocument();
    expect(screen.getByText(/H₂O/)).toBeInTheDocument();
    expect(screen.getByText('DoubleDisplacement')).toBeInTheDocument();
  }, 30000);

  it('solves Zn + CuSO₄ and reports the redox agents', async () => {
    const u = userEvent.setup();
    mount();
    await screen.findByText('Zn', {}, { timeout: 15000 });

    await u.click(screen.getByText('Zn'));                       // A ← Zn (transition metal)
    await u.click(screen.getByText('Zn²+'));                     // pick Zn²⁺
    await u.click(screen.getByText(/Reactant B/));               // activate B
    await u.click(screen.getByText('Cu'));                       // B ← Cu (transition metal)
    await u.click(screen.getByText('Cu²+'));                     // pick Cu²⁺
    await u.click(screen.getByText('Polyatomic Ions'));
    await u.click(screen.getByText(/SO₄/));                      // B ← sulfate
    await u.click(screen.getByText('Solve'));

    expect(await screen.findByText(/Reducing agent: Zn/)).toBeInTheDocument();
    expect(screen.getByText(/Oxidising agent/)).toBeInTheDocument();
  }, 30000);
});
```

- [ ] **Step 3: Run the integration test**

Run: `npx vitest run src/reaction/ReactionView.test.tsx`
Expected: PASS (2 tests). If the sulfate token's visible label differs from `SO₄` (it is `ion.formula` from `usePolyatomicIons()`), adjust that single `getByText(/SO₄/)` query to match the rendered formula — confirm by logging `screen.debug()` once. All other queries are fixed by this plan's own component code.

- [ ] **Step 4: Commit**

```bash
git add src/reaction/ReactionView.tsx src/reaction/ReactionView.test.tsx
git commit -m "feat: add reaction view container"
```

---

### Task 7: App mode toggle (Build ↔ React)

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx` (create)

**Interfaces:**
- Consumes: `ReactionView` (Task 6), existing `WasmProvider`/`IonicCanvasProvider`/`IonicCanvas`.
- Produces: a top-level `mode` toggle. `IonicCanvasProvider` now wraps BOTH modes so the reused tray's `useIonicCanvas()` resolves in React mode too.

- [ ] **Step 1: Write the failing test**

```tsx
// src/App.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('defaults to Build mode and toggles to React mode', async () => {
  const u = userEvent.setup();
  render(<App />);
  // both tab buttons exist
  expect(screen.getByRole('button', { name: 'Build' })).toBeInTheDocument();
  const react = screen.getByRole('button', { name: 'React' });
  await u.click(react);
  // React mode shows the two reactant bins
  expect(await screen.findByText(/Reactant A/)).toBeInTheDocument();
  expect(screen.getByText(/Reactant B/)).toBeInTheDocument();
}, 30000);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — no `React`/`Build` buttons yet (App renders only the canvas).

- [ ] **Step 3: Rewrite `src/App.tsx`**

```tsx
// src/App.tsx
import { useState } from 'react';
import { WasmProvider } from './wasm/WasmProvider';
import { IonicCanvasProvider } from './canvas/IonicCanvasProvider';
import { IonicCanvas } from './canvas/IonicCanvas';
import { ReactionView } from './reaction/ReactionView';

type Mode = 'build' | 'react';

export default function App() {
  const [mode, setMode] = useState<Mode>('build');
  return (
    <WasmProvider>
      <IonicCanvasProvider>
        <div className="flex flex-col h-screen">
          <div className="flex gap-2 p-2 shrink-0 border-b border-muted/30">
            {(['build', 'react'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  mode === m ? 'border-accent bg-accent/20 text-accent' : 'border-muted/40 text-muted'
                }`}
              >
                {m === 'build' ? 'Build' : 'React'}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {mode === 'build' ? <IonicCanvas /> : <ReactionView />}
          </div>
        </div>
      </IonicCanvasProvider>
    </WasmProvider>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS.

- [ ] **Step 5: Full check — suite + build**

Run: `npx vitest run`
Expected: entire suite green (existing + all new).

Run: `npm run build`
Expected: `tsc -b && vite build` succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: add build/react mode toggle"
```

---

## Self-Review Notes (addressed)

- **Spec coverage:** entry toggle (Task 7), standalone `ReactionView` with two-reactant assembly (Task 6), `ReactantBin` with inline TM charge picker (Task 4), `ReactionResultPanel` with equation/class/feasibility/quantities/redox (Task 5), `ZoneState→WasmSpecies` mapping (Task 1), tray `onPick` decoupling refactor (Task 3), real-wasm component tests for NaOH+HCl and Zn+CuSO₄ (Task 6). Quantities gate rendering via `showQuantities` (Task 5/6). Out-of-scope items (persistence, canvas integration, `redox.indeterminate`) are not implemented, per spec.
- **Type consistency:** `ReactionState`/`ReactionAction`/`Bin` (Task 2) are consumed unchanged by `ReactionView` (Task 6); `ReactantBin` prop names (`onActivate/onRemove/onPickCharge/onQty`) match `ReactionView`'s dispatch wiring; `ReactionResultPanel` props `{result, showQuantities}` match; `zoneToSpecies/qtyToWasm` signatures (Task 1) match their call site (Task 6); `ElementTray`/`ElementToken` `onPick` (Task 3) matches `ReactionView`'s usage.
- **Tailwind JIT:** literal-class lookup maps used for the `cation`/`anion` bin styling (Task 4) — no interpolated class names anywhere.
- **Provider hoist:** `IonicCanvasProvider` wraps both modes (Task 7) so the reused tray's `useIonicCanvas()` resolves in React mode; React mode simply ignores `slotA/slotB`.
- **No placeholders:** every code and test step contains complete, runnable content; the only noted adjustment is the single sulfate-token label query in Task 6, whose exact `ion.formula` string is data-driven.
