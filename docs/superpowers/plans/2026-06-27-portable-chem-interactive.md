# Portable Chem-Interactive (Capacitor + wasm chemistry) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the React web app to feature parity with the native SwiftUI iOS app (reaction classification, stoichiometry, polyatomic ions, product-state flask) by wiring the already-built pt-wasm methods, then package the single React codebase as Android + iOS + web via Capacitor.

**Architecture:** The Rust core (`pt-domain`/`pt-services`/`pt-wasm`) is the single source of chemistry truth, already compiled to wasm and bundled by `vite-plugin-wasm`. We replace the duplicated TypeScript chemistry (`utils/valence.ts`, `determineBonding` in the reducer) with wasm calls, add a stoichiometry phase + UI driven by `solve_stoichiometry`, source polyatomic ions from `polyatomic_ions()`, and add a flask product-state visualization driven by `react()`/`state_at`. Finally wrap the built `dist/` in Capacitor for native shells. wasm runs unchanged inside both WebViews (Android `http://localhost`, iOS `capacitor://localhost` — both serve correct `application/wasm` MIME).

**Tech Stack:** React 19, Vite, TypeScript, Tailwind v4, MUI v9, dnd-kit, framer-motion, Vitest + Testing Library, Rust/wasm-bindgen (pt-wasm), Capacitor 6.

## Global Constraints

- All chemistry logic comes from wasm. Do NOT add new chemistry math in TypeScript; if a value is missing, expose it from the Rust crate and rebuild. (`utils/gcd.ts` may stay only where wasm gives no equivalent.)
- wasm method names are fixed: `react(a, b)`, `solve_stoichiometry(a, b)`, `polyatomic_ions()`, `valence_electrons(symbol)`, `state_at(symbol, temperature_k)`. Types: `WasmReaction`, `WasmCovalentStoich`, `WasmStoichResult`, `WasmReactantInput`, `WasmPolyatomicIon` (see `src/wasm/pkg/pt_wasm.d.ts`).
- `WasmReactantInput` shape: `{ symbol: string; subscript: number; amount?: number; unit?: 'mass' | 'mole' }`.
- `WasmStoichResult` shape: `{ coeff_a, coeff_b, coeff_product, product_molar_mass, limiting: 'A'|'B'|'Both', yield_moles, yield_mass, excess_moles, excess_mass, diatomic_messages: string[] }`.
- `WasmReaction` shape: `{ bonding: 'Ionic'|'Covalent'|'Metallic', glyph: string, product_state: 'Solid'|'Liquid'|'Gas', covalent?: { n_a, n_b, bond_order }, metallic_electrons?: number }`.
- TDD: every task is red → green → commit. Run `npx vitest run <file>` per task; full `npx vitest run` + `npx tsc -b` before any phase-closing commit.
- Conventional commits, no scope parens: `feat: ...`, `fix: ...`, `chore: ...`. Body lines < 70 chars.
- Capacitor `webDir` is `dist`. Vite `base` must be `'./'` for native file serving.
- Keep existing 133 tests green at every step.

---

## File Structure

**New files:**
- `src/wasm/chem.ts` — typed thin wrappers over the wasm `PeriodicTable` reaction/stoich methods (single import surface).
- `src/stoich/types.ts` — stoichiometry state types (`ReactantEntry`, `QuantityUnit`, `StoichResult` re-export).
- `src/stoich/StoichResultPanel.tsx` — balanced equation + tappable terms.
- `src/stoich/StoichMetricRow.tsx` — icon/title/moles/mass row.
- `src/stoich/ReactantQuantityPopover.tsx` — amount + unit input.
- `src/stoich/ProductStateBadge.tsx` — solid/liquid/gas animated badge.
- `src/zones/PotionFlask.tsx` — flask SVG shape + fill driven by product state.
- `src/tray/PolyatomicToken.tsx` — already referenced by investigation; create/align to wasm source.
- Test files mirror each under `__tests__/`.

**Modified files:**
- `src/canvas/reducer.ts` — `determineBonding` delegates to wasm `react`; add stoich phase/actions.
- `src/canvas/types.ts` — extend `CanvasPhase`, `CanvasState`, `CanvasAction`.
- `src/canvas/constants.ts` — `POLYATOMIC_IONS` sourced from wasm (or kept as fallback).
- `src/tray/ElementToken.tsx` — `valenceElectrons` from wasm `valence_electrons`, not `utils/valence.ts`.
- `src/wasm/hooks.ts` — add `useReact`, `useStoich`, `usePolyatomicIons`.
- `vite.config.ts` — `base: './'`.
- `package.json` — Capacitor deps + scripts.

---

## Task 1: wasm wrapper module (`chem.ts`)

**Files:**
- Create: `src/wasm/chem.ts`
- Test: `src/wasm/__tests__/chem.test.ts`

**Interfaces:**
- Consumes: `PeriodicTable` from `@periodic-table`, types from `@periodic-table`.
- Produces:
  - `classifyReaction(pt, a: string, b: string): WasmReaction | undefined`
  - `solveStoich(pt, a: WasmReactantInput, b: WasmReactantInput): WasmStoichResult | undefined`
  - `listPolyatomicIons(pt): WasmPolyatomicIon[]`
  - `valenceOf(pt, symbol: string): number | undefined`
  - `productStateAt(pt, symbol: string, kelvin: number): string | undefined`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { PeriodicTable } from '@periodic-table';
import { classifyReaction, solveStoich, listPolyatomicIons, valenceOf } from '../chem';

let pt: PeriodicTable;
beforeAll(() => { pt = PeriodicTable.load(); });

describe('chem wrappers', () => {
  it('classifies Na + Cl as Ionic solid', () => {
    const r = classifyReaction(pt, 'Na', 'Cl')!;
    expect(r.bonding).toBe('Ionic');
    expect(r.product_state).toBe('Solid');
  });
  it('classifies S + O as Covalent (SO2)', () => {
    const r = classifyReaction(pt, 'S', 'O')!;
    expect(r.bonding).toBe('Covalent');
    expect(r.covalent).toMatchObject({ n_a: 1, n_b: 2, bond_order: 2 });
  });
  it('solves 2H + O water stoichiometry', () => {
    const r = solveStoich(pt,
      { symbol: 'H', subscript: 2, amount: 2, unit: 'mole' },
      { symbol: 'O', subscript: 1, amount: 1, unit: 'mole' })!;
    expect([r.coeff_a, r.coeff_b, r.coeff_product]).toEqual([2, 1, 2]);
    expect(r.limiting).toBe('Both');
  });
  it('lists 6 polyatomic ions incl sulfate -2', () => {
    const ions = listPolyatomicIons(pt);
    expect(ions).toHaveLength(6);
    expect(ions.find(i => i.symbol === 'SO₄')!.charge).toBe(-2);
  });
  it('valence of Cl is 7', () => {
    expect(valenceOf(pt, 'Cl')).toBe(7);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/wasm/__tests__/chem.test.ts`
Expected: FAIL — `Cannot find module '../chem'`.

- [ ] **Step 3: Write minimal implementation**

```ts
import type {
  PeriodicTable, WasmReaction, WasmStoichResult,
  WasmReactantInput, WasmPolyatomicIon,
} from '@periodic-table';

export function classifyReaction(pt: PeriodicTable, a: string, b: string): WasmReaction | undefined {
  return pt.react(a, b);
}

export function solveStoich(pt: PeriodicTable, a: WasmReactantInput, b: WasmReactantInput): WasmStoichResult | undefined {
  return pt.solve_stoichiometry(a, b);
}

export function listPolyatomicIons(pt: PeriodicTable): WasmPolyatomicIon[] {
  return pt.polyatomic_ions() as WasmPolyatomicIon[];
}

export function valenceOf(pt: PeriodicTable, symbol: string): number | undefined {
  return pt.valence_electrons(symbol);
}

export function productStateAt(pt: PeriodicTable, symbol: string, kelvin: number): string | undefined {
  return pt.state_at(symbol, kelvin);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/wasm/__tests__/chem.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/wasm/chem.ts src/wasm/__tests__/chem.test.ts
git commit -m "feat: add typed wasm chemistry wrappers"
```

---

## Task 2: reducer bonding delegates to wasm `react`

Replaces the hand-written `determineBonding` (reducer.ts:16-20) so classification matches the Rust core exactly. The reducer is pure, so it receives the classifier as an injected function (keeps tests pure, no wasm in reducer unit tests).

**Files:**
- Modify: `src/canvas/reducer.ts:16-62`
- Modify: `src/canvas/types.ts:33-39` (add classifier to DROP_ELEMENT action)
- Test: `src/__tests__/reducer.test.ts` (extend)

**Interfaces:**
- Consumes: `classifyReaction` from `src/wasm/chem.ts` (called by the canvas provider, not the reducer).
- Produces: `DROP_ELEMENT` action now carries `classify: (aSym, bSym) => BondingType | null`; reducer uses it instead of local `determineBonding`.

- [ ] **Step 1: Write the failing test**

```ts
// in src/__tests__/reducer.test.ts
it('uses injected classifier for bonding type', () => {
  const classify = () => 'Covalent' as const;
  const s1 = canvasReducer(INITIAL_STATE,
    { type: 'DROP_ELEMENT', slot: 'A', zone: nonMetalZone('C'), classify });
  const s2 = canvasReducer(s1,
    { type: 'DROP_ELEMENT', slot: 'B', zone: nonMetalZone('O'), classify });
  expect(s2.bondingType).toBe('Covalent');
  expect(s2.canvasPhase).toBe('EXPLAINING');
});
```

(Reuse existing `nonMetalZone` helper if present; otherwise add a minimal `ZoneState` factory at top of the test file.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/reducer.test.ts`
Expected: FAIL — `classify` not in action type / not used.

- [ ] **Step 3: Update types and reducer**

In `src/canvas/types.ts` change the DROP_ELEMENT variant:

```ts
  | { type: 'DROP_ELEMENT'; slot: Slot; zone: ZoneState; classify: (a: string, b: string) => BondingType | null }
```

In `src/canvas/reducer.ts` delete `determineBonding` (lines 16-20) and replace the bonding decision (lines 48-51) with:

```ts
      // Polyatomic ions always form ionic compounds; else ask the wasm core.
      const bondingType: BondingType = (newZone.isPolyatomic || other.isPolyatomic)
        ? 'Ionic'
        : (action.classify(newZone.symbol, other.symbol) ?? 'Ionic');
```

Remove the now-unused `ElementClass` import only if nothing else uses it (autoIonize does not).

- [ ] **Step 4: Update the dispatch site**

In `src/canvas/IonicCanvasProvider.tsx`, wrap dispatch of DROP_ELEMENT to inject the classifier built from the wasm `pt`:

```ts
import { classifyReaction } from '../wasm/chem';
// inside provider, pt available from useWasm()
const classify = (a: string, b: string) =>
  (classifyReaction(pt, a, b)?.bonding as BondingType | undefined) ?? null;
// pass `classify` in every DROP_ELEMENT dispatch
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run src/__tests__/reducer.test.ts`
Then: `npx vitest run` and `npx tsc -b`
Expected: all green. Fix any existing reducer test that dispatched DROP_ELEMENT without `classify` by adding `classify: () => 'Ionic'` (or the class-appropriate value) to those dispatches.

- [ ] **Step 6: Commit**

```bash
git add src/canvas/reducer.ts src/canvas/types.ts src/canvas/IonicCanvasProvider.tsx src/__tests__/reducer.test.ts
git commit -m "feat: classify bonding via wasm react instead of TS"
```

---

## Task 3: valence electrons from wasm in ElementToken

Removes the second TS chemistry duplication (`utils/valence.ts`) from the drag path.

**Files:**
- Modify: `src/tray/ElementToken.tsx` (the `makeZoneState` function)
- Test: `src/tray/__tests__/ElementToken.test.tsx` (extend)

**Interfaces:**
- Consumes: `valenceOf` from `src/wasm/chem.ts`, `pt` from `useWasm()`.
- Produces: `makeZoneState(el, pt)` returns `valenceElectrons` from wasm.

- [ ] **Step 1: Write the failing test**

```ts
it('reads valence electrons from wasm not TS parser', () => {
  const pt = PeriodicTable.load();
  const cl = pt.by_symbol('Cl')!;
  const zone = makeZoneState(cl, pt);
  expect(zone.valenceElectrons).toBe(7);
});
```

(Export `makeZoneState` from `ElementToken.tsx` if not already exported.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/tray/__tests__/ElementToken.test.tsx`
Expected: FAIL — `makeZoneState` signature mismatch / not exported.

- [ ] **Step 3: Update implementation**

In `src/tray/ElementToken.tsx`:

```ts
import { valenceOf } from '../wasm/chem';
// ...
export function makeZoneState(el: WasmElement, pt: PeriodicTable): ZoneState {
  return {
    symbol: el.symbol,
    elementClass: el.class as ElementClass,
    isPolyatomic: false,
    isTransition: el.block === 'd' || el.block === 'D',
    valenceElectrons: valenceOf(pt, el.symbol) ?? 0,
    oxidationStates: el.oxidation_states,
    derivedCharge: null,
    wrongCount: 0,
    status: 'NEUTRAL',
  };
}
```

Update the component to call `useWasm()` and pass `pt` into `makeZoneState`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/tray/__tests__/ElementToken.test.tsx`
Then: `npx vitest run` and `npx tsc -b`
Expected: green. `utils/valence.ts` may now be unused by the app; keep its unit test or delete the file + its test together if no imports remain (grep first: `grep -rn "utils/valence" src`).

- [ ] **Step 5: Commit**

```bash
git add src/tray/ElementToken.tsx src/tray/__tests__/ElementToken.test.tsx
git commit -m "feat: source valence electrons from wasm in tokens"
```

---

## Task 4: polyatomic ions from wasm

Replace hardcoded `POLYATOMIC_IONS` (constants.ts:10-17) with the wasm list so the six ions match the Rust source of truth. Keep the constant as a typed fallback for tests.

**Files:**
- Modify: `src/canvas/constants.ts`
- Modify: `src/wasm/hooks.ts` (add `usePolyatomicIons`)
- Test: `src/wasm/__tests__/polyatomic.test.ts`

**Interfaces:**
- Consumes: `listPolyatomicIons` from `chem.ts`.
- Produces: `usePolyatomicIons(): WasmPolyatomicIon[]` hook; `PolyatomicIon` type unchanged (`{ symbol, name, charge, formula }`).

- [ ] **Step 1: Write the failing test**

```ts
import { renderHook } from '@testing-library/react';
import { usePolyatomicIons } from '../hooks';
// render within WasmProvider test wrapper
it('exposes 6 wasm polyatomic ions', () => {
  const { result } = renderHook(() => usePolyatomicIons(), { wrapper: WasmTestProvider });
  expect(result.current).toHaveLength(6);
  expect(result.current.map(i => i.symbol)).toContain('NH₄');
});
```

(Add a minimal `WasmTestProvider` that loads `PeriodicTable.load()` synchronously into context, mirroring `WasmProvider` but without the async dynamic import — keeps the test deterministic.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/wasm/__tests__/polyatomic.test.ts`
Expected: FAIL — `usePolyatomicIons` undefined.

- [ ] **Step 3: Implement hook**

In `src/wasm/hooks.ts`:

```ts
import { listPolyatomicIons } from './chem';
import type { WasmPolyatomicIon } from '@periodic-table';

export function usePolyatomicIons(): WasmPolyatomicIon[] {
  const ctx = useContext(WasmContext);
  if (!ctx) throw new Error('usePolyatomicIons must be used inside WasmProvider');
  return listPolyatomicIons(ctx.pt);
}
```

- [ ] **Step 4: Point the tray at the hook**

In `src/tray/ElementTray.tsx`, replace the `POLYATOMIC_IONS` import usage in the "Polyatomic Ions" tab with `usePolyatomicIons()`. Leave `constants.POLYATOMIC_IONS` as the documented fallback.

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run src/wasm/__tests__/polyatomic.test.ts`
Then: `npx vitest run` and `npx tsc -b`
Expected: green.

- [ ] **Step 6: Commit**

```bash
git add src/wasm/hooks.ts src/tray/ElementTray.tsx src/wasm/__tests__/polyatomic.test.ts
git commit -m "feat: source polyatomic ions from wasm"
```

---

## Task 5: stoich types + STOICHIOMETRY phase/actions

Adds the state machinery the panel needs. Pure reducer additions, TDD without wasm.

**Files:**
- Create: `src/stoich/types.ts`
- Modify: `src/canvas/types.ts` (phase + state + actions)
- Modify: `src/canvas/reducer.ts` (handle new actions)
- Test: `src/__tests__/reducer.test.ts` (extend)

**Interfaces:**
- Produces:
  - `QuantityUnit = 'mole' | 'mass'`
  - `ReactantEntry = { value: number; unit: QuantityUnit }`
  - new phase `'STOICHIOMETRY'`; `CanvasState` gains `quantityA: ReactantEntry | null`, `quantityB: ReactantEntry | null`.
  - actions: `{ type: 'ENTER_STOICH' }`, `{ type: 'SET_QUANTITY'; slot: Slot; entry: ReactantEntry | null }`.

- [ ] **Step 1: Write the failing test**

```ts
it('ENTER_STOICH from COMPLETE moves to STOICHIOMETRY', () => {
  const s = canvasReducer({ ...INITIAL_STATE, canvasPhase: 'COMPLETE', bondingType: 'Ionic' },
    { type: 'ENTER_STOICH' });
  expect(s.canvasPhase).toBe('STOICHIOMETRY');
});
it('SET_QUANTITY stores entry for slot A', () => {
  const s = canvasReducer(INITIAL_STATE,
    { type: 'SET_QUANTITY', slot: 'A', entry: { value: 2, unit: 'mole' } });
  expect(s.quantityA).toEqual({ value: 2, unit: 'mole' });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/reducer.test.ts`
Expected: FAIL — actions/phase unknown.

- [ ] **Step 3: Implement types**

`src/stoich/types.ts`:

```ts
export type QuantityUnit = 'mole' | 'mass';
export interface ReactantEntry { value: number; unit: QuantityUnit; }
export type { WasmStoichResult } from '@periodic-table';
```

`src/canvas/types.ts`: add `'STOICHIOMETRY'` to `CanvasPhase`; add to `CanvasState`:

```ts
  quantityA: ReactantEntry | null;
  quantityB: ReactantEntry | null;
```

add to `CanvasAction`:

```ts
  | { type: 'ENTER_STOICH' }
  | { type: 'SET_QUANTITY'; slot: Slot; entry: ReactantEntry | null }
```

import `ReactantEntry` from `../stoich/types`. Update `INITIAL_STATE` in constants.ts to include `quantityA: null, quantityB: null`.

`src/canvas/reducer.ts`: add cases:

```ts
    case 'ENTER_STOICH':
      return { ...state, canvasPhase: 'STOICHIOMETRY' };
    case 'SET_QUANTITY':
      return action.slot === 'A'
        ? { ...state, quantityA: action.entry }
        : { ...state, quantityB: action.entry };
```

Also extend `RESET` already returns INITIAL_STATE (now includes nulls — fine).

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/__tests__/reducer.test.ts`
Then: `npx vitest run` and `npx tsc -b`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add src/stoich/types.ts src/canvas/types.ts src/canvas/reducer.ts src/canvas/constants.ts src/__tests__/reducer.test.ts
git commit -m "feat: add stoichiometry phase and quantity actions"
```

---

## Task 6: ReactantQuantityPopover

Decimal amount + unit (mol/g) input producing a `ReactantEntry`.

**Files:**
- Create: `src/stoich/ReactantQuantityPopover.tsx`
- Test: `src/stoich/__tests__/ReactantQuantityPopover.test.tsx`

**Interfaces:**
- Consumes: `ReactantEntry`, `QuantityUnit` from `../stoich/types`.
- Produces: `<ReactantQuantityPopover symbol entry onChange />`, `onChange(entry: ReactantEntry | null)`.

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactantQuantityPopover } from '../ReactantQuantityPopover';

it('emits entry when valid number typed', () => {
  const onChange = vi.fn();
  render(<ReactantQuantityPopover symbol="H" entry={null} onChange={onChange} />);
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
  expect(onChange).toHaveBeenLastCalledWith({ value: 2, unit: 'mole' });
});

it('emits null when cleared', () => {
  const onChange = vi.fn();
  render(<ReactantQuantityPopover symbol="H" entry={{ value: 2, unit: 'mole' }} onChange={onChange} />);
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
  expect(onChange).toHaveBeenLastCalledWith(null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stoich/__tests__/ReactantQuantityPopover.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```tsx
import { useState } from 'react';
import type { ReactantEntry, QuantityUnit } from './types';

interface Props {
  symbol: string;
  entry: ReactantEntry | null;
  onChange: (entry: ReactantEntry | null) => void;
}

export function ReactantQuantityPopover({ symbol, entry, onChange }: Props) {
  const [unit, setUnit] = useState<QuantityUnit>(entry?.unit ?? 'mole');
  const [text, setText] = useState(entry ? String(entry.value) : '');

  function emit(nextText: string, nextUnit: QuantityUnit) {
    const v = parseFloat(nextText);
    onChange(Number.isFinite(v) && v > 0 ? { value: v, unit: nextUnit } : null);
  }

  return (
    <div className="flex flex-col gap-2 w-[150px]">
      <label className="text-xs text-muted">{symbol} amount</label>
      <input
        type="number" inputMode="decimal" min="0" step="any" value={text}
        onChange={e => { setText(e.target.value); emit(e.target.value, unit); }}
        className="h-12 rounded bg-surface px-2 text-white"
      />
      <div className="flex gap-1">
        {(['mole', 'mass'] as QuantityUnit[]).map(u => (
          <button key={u} type="button"
            onClick={() => { setUnit(u); emit(text, u); }}
            className={`flex-1 rounded px-2 py-1 text-sm ${unit === u ? 'bg-accent text-bg' : 'bg-surface text-muted'}`}>
            {u === 'mole' ? 'mol' : 'g'}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/stoich/__tests__/ReactantQuantityPopover.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stoich/ReactantQuantityPopover.tsx src/stoich/__tests__/ReactantQuantityPopover.test.tsx
git commit -m "feat: add reactant quantity input popover"
```

---

## Task 7: StoichMetricRow

Presentational icon/title/moles/mass row.

**Files:**
- Create: `src/stoich/StoichMetricRow.tsx`
- Test: `src/stoich/__tests__/StoichMetricRow.test.tsx`

**Interfaces:**
- Produces: `<StoichMetricRow icon title moles mass />` (icon is a string emoji/SF-equivalent or ReactNode), formats both numbers to 2 decimals.

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen } from '@testing-library/react';
import { StoichMetricRow } from '../StoichMetricRow';

it('renders title, moles and mass to 2 decimals', () => {
  render(<StoichMetricRow icon="⚛" title="Yield" moles={2} mass={18.015} />);
  expect(screen.getByText('Yield')).toBeInTheDocument();
  expect(screen.getByText('2.00 mol')).toBeInTheDocument();
  expect(screen.getByText('18.02 g')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stoich/__tests__/StoichMetricRow.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```tsx
interface Props { icon: React.ReactNode; title: string; moles: number; mass: number; }

export function StoichMetricRow({ icon, title, moles, mass }: Props) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span aria-hidden className="w-5 text-center">{icon}</span>
      <span className="flex-1 text-sm text-white">{title}</span>
      <span className="font-bold text-white">{moles.toFixed(2)} mol</span>
      <span className="text-muted text-sm">{mass.toFixed(2)} g</span>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/stoich/__tests__/StoichMetricRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stoich/StoichMetricRow.tsx src/stoich/__tests__/StoichMetricRow.test.tsx
git commit -m "feat: add stoich metric row"
```

---

## Task 8: StoichResultPanel

Balanced equation header + yield/limiting/excess via `StoichMetricRow`, driven by `WasmStoichResult`.

**Files:**
- Create: `src/stoich/StoichResultPanel.tsx`
- Test: `src/stoich/__tests__/StoichResultPanel.test.tsx`

**Interfaces:**
- Consumes: `WasmStoichResult`, `StoichMetricRow`.
- Produces: `<StoichResultPanel symbolA symbolB productFormula result />`.
  - Equation: `{coeff_a}{symbolA} + {coeff_b}{symbolB} → {coeff_product}{productFormula}` (omit coefficient when 1).
  - Rows: Yield (`yield_moles`/`yield_mass`), Excess (`excess_moles`/`excess_mass`).
  - Limiting label from `result.limiting` ('A'→symbolA, 'B'→symbolB, 'Both'→"Stoichiometric").

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen } from '@testing-library/react';
import { StoichResultPanel } from '../StoichResultPanel';

const result = {
  coeff_a: 2, coeff_b: 1, coeff_product: 2, product_molar_mass: 18.015,
  limiting: 'Both', yield_moles: 2, yield_mass: 36.03,
  excess_moles: 0, excess_mass: 0, diatomic_messages: [],
} as const;

it('renders balanced equation and yield', () => {
  render(<StoichResultPanel symbolA="H" symbolB="O" productFormula="H₂O" result={result} />);
  expect(screen.getByText(/2H \+ O → 2H₂O/)).toBeInTheDocument();
  expect(screen.getByText('Yield')).toBeInTheDocument();
  expect(screen.getByText('Stoichiometric')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stoich/__tests__/StoichResultPanel.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```tsx
import type { WasmStoichResult } from '@periodic-table';
import { StoichMetricRow } from './StoichMetricRow';

interface Props {
  symbolA: string; symbolB: string; productFormula: string; result: WasmStoichResult;
}

const coef = (n: number, s: string) => (n === 1 ? s : `${n}${s}`);

export function StoichResultPanel({ symbolA, symbolB, productFormula, result }: Props) {
  const limitingLabel =
    result.limiting === 'Both' ? 'Stoichiometric'
    : result.limiting === 'A' ? symbolA : symbolB;
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface p-3">
      <div className="text-center text-lg text-white">
        {coef(result.coeff_a, symbolA)} + {coef(result.coeff_b, symbolB)} → {coef(result.coeff_product, productFormula)}
      </div>
      <div className="text-xs text-muted">Limiting: {limitingLabel}</div>
      <StoichMetricRow icon="⚛" title="Yield" moles={result.yield_moles} mass={result.yield_mass} />
      {result.excess_moles > 0 && (
        <StoichMetricRow icon="🧪" title="Excess" moles={result.excess_moles} mass={result.excess_mass} />
      )}
      {result.diatomic_messages.map(m => (
        <div key={m} className="text-xs text-warn">{m}</div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/stoich/__tests__/StoichResultPanel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stoich/StoichResultPanel.tsx src/stoich/__tests__/StoichResultPanel.test.tsx
git commit -m "feat: add stoich result panel"
```

---

## Task 9: ProductStateBadge

Solid/Liquid/Gas badge driven by `WasmReaction.product_state`.

**Files:**
- Create: `src/stoich/ProductStateBadge.tsx`
- Test: `src/stoich/__tests__/ProductStateBadge.test.tsx`

**Interfaces:**
- Produces: `<ProductStateBadge state="Solid"|"Liquid"|"Gas" />` — renders label + a color class (Solid=accent, Liquid=anion-blue, Gas=cation). framer-motion particle animation optional; the test only asserts label + role.

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen } from '@testing-library/react';
import { ProductStateBadge } from '../ProductStateBadge';

it('renders the product state label', () => {
  render(<ProductStateBadge state="Liquid" />);
  expect(screen.getByText('Liquid')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/stoich/__tests__/ProductStateBadge.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```tsx
type State = 'Solid' | 'Liquid' | 'Gas';
const COLOR: Record<State, string> = { Solid: 'bg-accent', Liquid: 'bg-anion', Gas: 'bg-cation' };

export function ProductStateBadge({ state }: { state: State }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${COLOR[state]}`}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-bg/60" />
      {state}
    </span>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/stoich/__tests__/ProductStateBadge.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stoich/ProductStateBadge.tsx src/stoich/__tests__/ProductStateBadge.test.tsx
git commit -m "feat: add product state badge"
```

---

## Task 10: PotionFlask product-state visualization

SVG flask whose fill style is chosen by the product/reactant state. Geometry mirrors iOS `PotionFlask.swift` proportions; fill style switches solid/liquid/aqueous/gas.

**Files:**
- Create: `src/zones/PotionFlask.tsx`
- Test: `src/zones/__tests__/PotionFlask.test.tsx`

**Interfaces:**
- Produces: `<PotionFlask state="Solid"|"Liquid"|"Gas"|"Aqueous" fill={0..1} label />`.
  - Renders an `<svg>` with a `data-state` attribute equal to `state` (test hook).
  - `fill` controls liquid/solid height fraction; `label` shows symbol/formula centered.

- [ ] **Step 1: Write the failing test**

```ts
import { render } from '@testing-library/react';
import { PotionFlask } from '../PotionFlask';

it('exposes the state via data attribute', () => {
  const { container } = render(<PotionFlask state="Liquid" fill={0.6} label="H₂O" />);
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('data-state')).toBe('Liquid');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/zones/__tests__/PotionFlask.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

```tsx
type FlaskState = 'Solid' | 'Liquid' | 'Gas' | 'Aqueous';

interface Props { state: FlaskState; fill: number; label?: string; }

// Proportions from iOS PotionFlask.swift (lip/neck/bulb on a 100×140 viewBox).
const FLASK_PATH =
  'M40 4 H60 L57 40 Q92 66 92 92 Q92 135 50 135 Q8 135 8 92 Q8 66 43 40 Z';

const FILL_COLOR: Record<FlaskState, string> = {
  Solid: 'var(--accent)', Liquid: 'var(--anion)',
  Aqueous: 'var(--anion)', Gas: 'var(--cation)',
};

export function PotionFlask({ state, fill, label }: Props) {
  const clamped = Math.max(0, Math.min(1, fill));
  const top = 135 - 130 * clamped; // fill rises from bottom (y=135) upward
  return (
    <svg viewBox="0 0 100 140" data-state={state} className="h-40 w-32">
      <defs><clipPath id="flask"><path d={FLASK_PATH} /></clipPath></defs>
      {state !== 'Gas' && (
        <rect x="0" y={top} width="100" height={140 - top}
          fill={FILL_COLOR[state]} opacity={state === 'Solid' ? 0.7 : 0.55}
          clipPath="url(#flask)" />
      )}
      {state === 'Gas' && (
        <rect x="0" y="0" width="100" height="140"
          fill={FILL_COLOR[state]} opacity={0.12} clipPath="url(#flask)" />
      )}
      <path d={FLASK_PATH} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" />
      {label && (
        <text x="50" y="96" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{label}</text>
      )}
    </svg>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/zones/__tests__/PotionFlask.test.tsx`
Then: `npx vitest run` and `npx tsc -b`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add src/zones/PotionFlask.tsx src/zones/__tests__/PotionFlask.test.tsx
git commit -m "feat: add potion flask state visualization"
```

---

## Task 11: wire stoich UI into BridgeColumn

Connect the new components to the phase machine: after `COMPLETE`, show an "Enter quantities" affordance → `STOICHIOMETRY` phase renders quantity popovers + `StoichResultPanel` + `ProductStateBadge`, computing the result live with `solveStoich`.

**Files:**
- Modify: `src/bridge/BridgeColumn.tsx`
- Modify: `src/canvas/IonicCanvasProvider.tsx` (expose `react`/`solveStoich` results derived from `pt` + state)
- Test: `src/bridge/__tests__/BridgeColumn.stoich.test.tsx`

**Interfaces:**
- Consumes: state `quantityA/quantityB`, `slotA/slotB`, `solveStoich`, `classifyReaction`, `usePolyatomicIons` (for product formula), components from Tasks 6-10.
- Produces: a `STOICHIOMETRY`-phase render path. Product formula derivation: for ionic use existing crossover formula; for covalent use `WasmReaction.covalent` (`n_a`,`n_b`). Subscripts feeding `WasmReactantInput` come from the balanced product (use `1` default if unknown — wasm handles diatomic internally).

- [ ] **Step 1: Write the failing test**

```ts
// render BridgeColumn inside provider with slots filled + phase STOICHIOMETRY,
// set quantities, assert StoichResultPanel shows yield.
it('shows yield once both quantities entered', async () => {
  // arrange provider state: slotA=H, slotB=O, phase=STOICHIOMETRY
  // act: type 2 into A (mol), 1 into B (mol)
  // assert: screen.getByText('Yield') present
});
```

(Flesh out with the project's existing provider test harness pattern from `IonicCanvasProvider.test.tsx`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/bridge/__tests__/BridgeColumn.stoich.test.tsx`
Expected: FAIL — no STOICHIOMETRY branch.

- [ ] **Step 3: Implement the branch**

In `BridgeColumn.tsx` add, keyed on `canvasPhase === 'STOICHIOMETRY'`:

```tsx
// pseudo-wiring — adapt to existing provider hooks
const pt = useWasm();
const a = state.slotA!, b = state.slotB!;
const reaction = classifyReaction(pt, a.symbol, b.symbol);
const subA = reaction?.covalent?.n_a ?? 1;
const subB = reaction?.covalent?.n_b ?? 1;
const result = (state.quantityA && state.quantityB)
  ? solveStoich(pt,
      { symbol: a.symbol, subscript: subA, amount: state.quantityA.value, unit: state.quantityA.unit },
      { symbol: b.symbol, subscript: subB, amount: state.quantityB.value, unit: state.quantityB.unit })
  : undefined;

return (
  <div className="flex flex-col gap-3">
    <div className="flex gap-3">
      <ReactantQuantityPopover symbol={a.symbol} entry={state.quantityA}
        onChange={e => dispatch({ type: 'SET_QUANTITY', slot: 'A', entry: e })} />
      <ReactantQuantityPopover symbol={b.symbol} entry={state.quantityB}
        onChange={e => dispatch({ type: 'SET_QUANTITY', slot: 'B', entry: e })} />
    </div>
    {reaction && <ProductStateBadge state={reaction.product_state as 'Solid'|'Liquid'|'Gas'} />}
    {result && (
      <StoichResultPanel symbolA={a.symbol} symbolB={b.symbol}
        productFormula={/* ionic crossover formula or covalent A_nB_m */ ''} result={result} />
    )}
  </div>
);
```

Add an "Enter quantities →" button in the `COMPLETE` branch dispatching `{ type: 'ENTER_STOICH' }`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/bridge/__tests__/BridgeColumn.stoich.test.tsx`
Then: `npx vitest run` and `npx tsc -b`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add src/bridge/BridgeColumn.tsx src/canvas/IonicCanvasProvider.tsx src/bridge/__tests__/BridgeColumn.stoich.test.tsx
git commit -m "feat: wire stoichiometry UI into bridge"
```

---

## Task 12: flask into DropZone

Render `PotionFlask` in each drop zone, state derived from the dropped element via `state_at` (room temp 298 K) or, post-reaction, the product state.

**Files:**
- Modify: `src/zones/DropZone.tsx`
- Test: `src/zones/__tests__/DropZone.test.tsx` (extend)

**Interfaces:**
- Consumes: `PotionFlask`, `productStateAt` from `chem.ts`, `pt` from `useWasm()`.
- Produces: filled zone shows a flask; `state` from `productStateAt(pt, symbol, 298)` mapped Solid/Liquid/Gas, `Aqueous` when `zone.isPolyatomic`.

- [ ] **Step 1: Write the failing test**

```ts
it('renders a flask with element state when filled', () => {
  // render DropZone with a filled zone for 'Fe'
  // assert container.querySelector('svg[data-state]') present
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/zones/__tests__/DropZone.test.tsx`
Expected: FAIL — no flask.

- [ ] **Step 3: Implement**

In `DropZone.tsx`, when a zone is filled:

```tsx
const pt = useWasm();
const raw = zone.isPolyatomic ? 'Aqueous' : (productStateAt(pt, zone.symbol, 298) ?? 'Solid');
const flaskState = raw as 'Solid' | 'Liquid' | 'Gas' | 'Aqueous';
// render <PotionFlask state={flaskState} fill={0.6} label={zone.symbol} /> behind the existing badge
```

Keep existing symbol/ion badge + "×" replace button layered above the flask.

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run src/zones/__tests__/DropZone.test.tsx`
Then: `npx vitest run` and `npx tsc -b`
Expected: green.

- [ ] **Step 5: Commit**

```bash
git add src/zones/DropZone.tsx src/zones/__tests__/DropZone.test.tsx
git commit -m "feat: render product-state flask in drop zones"
```

---

## Task 13: Capacitor packaging (Android + iOS + web)

Wrap the built web app. No chemistry change. This is the portability deliverable.

**Files:**
- Modify: `vite.config.ts` (add `base: './'`)
- Modify: `package.json` (deps + scripts)
- Create: `capacitor.config.ts`
- Create: `android/`, `ios/` (generated by `npx cap add`)

**Interfaces:**
- Produces: `npm run build` → `dist/`; `npx cap sync` copies into native projects; `npx cap open ios|android` launches platform IDE.

- [ ] **Step 1: Add base path for native file serving**

In `vite.config.ts`, add `base: './'` to the config object. Rebuild and confirm assets use relative URLs:

Run: `npm run build && grep -c 'src="/' dist/index.html`
Expected: `0` (no absolute root asset paths).

- [ ] **Step 2: Install Capacitor**

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "ChemInteractive" "com.chem.interactive" --web-dir dist
```

Expected: creates `capacitor.config.ts` with `webDir: 'dist'`.

- [ ] **Step 3: Add platforms**

```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Expected: `android/` and `ios/` created, `[success]` from sync.

- [ ] **Step 4: Verify wasm loads in a device/emulator**

Run: `npx cap open android` (build+run in Android Studio emulator) — confirm the periodic table renders (proves `PeriodicTable.load()` ran, i.e. wasm fetched with correct MIME inside the WebView).
Repeat: `npx cap open ios` in Xcode simulator.
If wasm fails to load on iOS, confirm `base: './'` is set and the `.wasm` asset exists in `dist/assets/`; Capacitor's `capacitor://localhost` scheme serves `application/wasm` automatically.

- [ ] **Step 5: Add convenience scripts + commit**

Add to `package.json` scripts:

```json
"cap:sync": "npm run build && npx cap sync",
"cap:android": "npm run cap:sync && npx cap open android",
"cap:ios": "npm run cap:sync && npx cap open ios"
```

```bash
git add vite.config.ts package.json package-lock.json capacitor.config.ts
git commit -m "chore: package app for android and ios via capacitor"
```

(Decide separately whether to commit generated `android/`/`ios/` or gitignore them; for a reproducible repo, commit them.)

---

## Task 14: full regression + parity sweep

- [ ] **Step 1: Run the whole suite**

Run: `npx vitest run`
Expected: all tests pass (133 existing + new).

- [ ] **Step 2: Typecheck + production build**

Run: `npx tsc -b && npm run build`
Expected: exit 0, `dist/` emitted.

- [ ] **Step 3: Manual parity check vs iOS**

Drop Na+Cl (ionic solid flask, crossover), S+O (covalent SO₂), Na+Mg (metallic), then enter stoichiometry quantities and confirm yield/limiting/excess match the iOS app for the water case (2 H + O → 2 H₂O, limiting Both, ~18 g/mol). Confirm polyatomic tab lists 6 ions from wasm.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify parity and portable build"
```

---

## Self-Review Notes

- **Spec coverage:** Feature 1 (wasm bonding) → Tasks 2-3; Feature 2 (stoich) → Tasks 5-8, 11; Feature 3 (polyatomic) → Task 4; Feature 4 (flask state) → Tasks 9-10, 12; Portability → Task 13. ✅
- **Type consistency:** `ReactantEntry`/`QuantityUnit` defined in Task 5 (`src/stoich/types.ts`) and consumed unchanged in Tasks 6, 11. `WasmStoichResult` field names match the Global Constraints verbatim. `classifyReaction`/`solveStoich`/`valenceOf`/`listPolyatomicIons` defined in Task 1 and reused by signature thereafter.
- **Known soft spots to resolve during execution:** product-formula derivation for covalent vs ionic in Task 11 (reuse existing crossover formula util; do not reinvent in TS); whether to commit generated native projects (Task 13 Step 5).
