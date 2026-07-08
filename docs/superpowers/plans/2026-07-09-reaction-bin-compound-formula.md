# Reaction Bin Compound Formula Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the reaction tab, when a reactant bin holds 2 species, show one charge-balanced compound formula chip (e.g. `NaCl`, `MgCl₂`) instead of two separate element chips.

**Architecture:** Extract the Build tab's existing formula string logic (`productInfo`) into a shared `src/bridge/formula.ts`. A new `src/reaction/binFormula.ts` helper turns a 2-species bin into a formula string (via wasm `classifyReaction` + `productInfo`), gated on resolved charges. `ReactionView` computes the string with `useWasm()` and passes a `compound` prop to the presentational `ReactantBin`, which renders one chip when set. Solver input is unchanged.

**Tech Stack:** TypeScript, React, Vite, Vitest, @testing-library/react, wasm periodic-table bindings (`@periodic-table`).

## Global Constraints

- Subscripts use the Unicode digits string `SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉'` (copied verbatim from `BridgeColumn.tsx:18`).
- The reaction solver path (`solveCompoundReaction`, `zoneToSpecies`, `reactionReducer`) MUST NOT change — this is display/charge-resolution only.
- Bin species cap stays at 2 (`reactionReducer` `PICK_SPECIES` already enforces `>= 2` guard).
- Follow existing patterns: `ReactantBin` stays purely presentational (all inputs via props, no wasm hook inside it).

---

### Task 1: Extract shared formula util

Move the formula-string helpers out of `BridgeColumn.tsx` into a new module so both the Build tab and the reaction bin use one implementation.

**Files:**
- Create: `src/bridge/formula.ts`
- Create: `src/bridge/formula.test.ts`
- Modify: `src/bridge/BridgeColumn.tsx` (remove the moved helpers, import them)

**Interfaces:**
- Consumes: `gcd` from `../utils/gcd`; types `WasmReaction` from `@periodic-table`, `ZoneState` from `../canvas/types`.
- Produces:
  - `SUBSCRIPTS: string`
  - `toSub(n: number): string`
  - `fmt(sym: string, n: number): string`
  - `productInfo(reaction: WasmReaction | undefined, slotA: ZoneState, slotB: ZoneState): { subA: number; subB: number; formula: string }`

- [ ] **Step 1: Write the failing test**

Create `src/bridge/formula.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { productInfo, fmt, toSub } from './formula';
import type { ZoneState } from '../canvas/types';
import type { WasmReaction } from '@periodic-table';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

describe('formula helpers', () => {
  it('toSub / fmt render unicode subscripts', () => {
    expect(toSub(2)).toBe('₂');
    expect(fmt('Cl', 1)).toBe('Cl');
    expect(fmt('Cl', 2)).toBe('Cl₂');
  });

  it('ionic 1:1 → NaCl', () => {
    const r = { bonding: 'Ionic' } as WasmReaction;
    expect(productInfo(r, z('Na', { derivedCharge: 1 }), z('Cl', { derivedCharge: -1 })).formula)
      .toBe('NaCl');
  });

  it('ionic charge crossover → MgCl₂', () => {
    const r = { bonding: 'Ionic' } as WasmReaction;
    expect(productInfo(r, z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })).formula)
      .toBe('MgCl₂');
  });

  it('covalent uses reaction stoich → CO₂', () => {
    const r = { bonding: 'Covalent', covalent: { n_a: 1, n_b: 2 } } as unknown as WasmReaction;
    expect(productInfo(r, z('C'), z('O')).formula).toBe('CO₂');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/bridge/formula.test.ts`
Expected: FAIL — `Failed to resolve import "./formula"` (module does not exist yet).

- [ ] **Step 3: Create `src/bridge/formula.ts`**

Copy the helpers verbatim from `BridgeColumn.tsx` (lines 18-20 and 33-52):

```ts
import { gcd } from '../utils/gcd';
import type { ZoneState } from '../canvas/types';
import type { WasmReaction } from '@periodic-table';

export const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
export const toSub = (n: number) => String(n).split('').map(d => SUBSCRIPTS[+d]).join('');
export const fmt = (sym: string, n: number) => (n > 1 ? `${sym}${toSub(n)}` : sym);

/** Product subscripts (for the balanced equation) and a display formula string. */
export function productInfo(
  reaction: WasmReaction | undefined, slotA: ZoneState, slotB: ZoneState,
): { subA: number; subB: number; formula: string } {
  if (reaction?.bonding === 'Covalent' && reaction.covalent) {
    const { n_a, n_b } = reaction.covalent;
    return { subA: n_a, subB: n_b, formula: fmt(slotA.symbol, n_a) + fmt(slotB.symbol, n_b) };
  }
  if (reaction?.bonding === 'Ionic') {
    const ca = Math.abs(slotA.derivedCharge ?? slotA.oxidationStates[0] ?? 1);
    const cb = Math.abs(slotB.derivedCharge ?? slotB.oxidationStates[0] ?? 1);
    const g = gcd(ca, cb) || 1;
    const subA = cb / g, subB = ca / g;
    const aPart = fmt(slotA.symbol, subA);
    const bPart = slotB.isPolyatomic && subB > 1 ? `(${slotB.symbol})${toSub(subB)}` : fmt(slotB.symbol, subB);
    return { subA, subB, formula: aPart + bPart };
  }
  const formula = slotA.symbol === slotB.symbol ? slotA.symbol : `${slotA.symbol}·${slotB.symbol}`;
  return { subA: 1, subB: 1, formula };
}
```

- [ ] **Step 4: Update `BridgeColumn.tsx` to import from the new module**

In `src/bridge/BridgeColumn.tsx`:
- Delete the local `SUBSCRIPTS`, `toSub`, `fmt` definitions (lines 18-20).
- Delete the local `productInfo` function (lines 33-52).
- Add to the imports near the top (after the existing `import { gcd } from '../utils/gcd';` line):

```ts
import { productInfo, toSub } from './formula';
```

Note: `toSub` is still used by `buildFormulaJsx` (`BridgeColumn.tsx:62`), and `gcd` is still used directly in the component body (`BridgeColumn.tsx:99`), so keep the `gcd` import. Do not remove `SUBSCRIPTS` usage elsewhere — it had none outside the moved helpers.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/bridge/formula.test.ts src/bridge/__tests__`
Expected: PASS — new formula tests pass and all existing BridgeColumn tests still pass (no behaviour change).

- [ ] **Step 6: Commit**

```bash
git add src/bridge/formula.ts src/bridge/formula.test.ts src/bridge/BridgeColumn.tsx
git commit -m "refactor: extract formula helpers to bridge/formula.ts"
```

---

### Task 2: Bin compound formula helper

Turn a bin's species array into a formula string, gated on charge resolution.

**Files:**
- Create: `src/reaction/binFormula.ts`
- Create: `src/reaction/binFormula.test.ts`

**Interfaces:**
- Consumes: `productInfo` from `../bridge/formula`; `classifyReaction` from `../wasm/chem`; `ZoneState` from `../canvas/types`; `PeriodicTable` type from `@periodic-table`.
- Produces: `binCompound(pt: PeriodicTable, species: ZoneState[]): string | null`
  - Returns `null` unless `species.length === 2`.
  - Returns `null` if any species is a transition metal with `derivedCharge === null` (charge unresolved).
  - Otherwise returns `productInfo(classifyReaction(pt, species[0].symbol, species[1].symbol), species[0], species[1]).formula`.

- [ ] **Step 1: Write the failing test**

Create `src/reaction/binFormula.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import type { ZoneState } from '../canvas/types';

vi.mock('../wasm/chem', () => ({
  classifyReaction: () => ({ bonding: 'Ionic' }),
}));

import { binCompound } from './binFormula';

const z = (symbol: string, extra: Partial<ZoneState> = {}): ZoneState => ({
  symbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 0, group: 0, period: 0, oxidationStates: [], derivedCharge: null,
  wrongCount: 0, status: 'NEUTRAL', ...extra,
});

const pt = {} as never; // classifyReaction is mocked, pt is unused

describe('binCompound', () => {
  it('returns null for a single species', () => {
    expect(binCompound(pt, [z('Na', { derivedCharge: 1 })])).toBeNull();
  });

  it('returns null for an empty bin', () => {
    expect(binCompound(pt, [])).toBeNull();
  });

  it('returns a charge-balanced formula for two resolved species', () => {
    expect(binCompound(pt, [z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]))
      .toBe('MgCl₂');
  });

  it('returns null while a transition-metal charge is unresolved', () => {
    expect(binCompound(pt, [z('Cu', { isTransition: true, oxidationStates: [1, 2] }), z('Cl', { derivedCharge: -1 })]))
      .toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/binFormula.test.ts`
Expected: FAIL — `Failed to resolve import "./binFormula"`.

- [ ] **Step 3: Create `src/reaction/binFormula.ts`**

```ts
import type { ZoneState } from '../canvas/types';
import type { PeriodicTable } from '@periodic-table';
import { classifyReaction } from '../wasm/chem';
import { productInfo } from '../bridge/formula';

/**
 * Formula string for a bin holding exactly 2 species, e.g. "NaCl" / "MgCl₂".
 * Returns null for 0–1 species, or while a transition-metal charge is still
 * unresolved (bin stays in chip mode + TM picker until the user picks one).
 */
export function binCompound(pt: PeriodicTable, species: ZoneState[]): string | null {
  if (species.length !== 2) return null;
  const unresolvedTM = species.some(s => s.isTransition && s.derivedCharge === null);
  if (unresolvedTM) return null;
  const reaction = classifyReaction(pt, species[0].symbol, species[1].symbol);
  return productInfo(reaction, species[0], species[1]).formula;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/reaction/binFormula.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/reaction/binFormula.ts src/reaction/binFormula.test.ts
git commit -m "feat: add bin compound formula helper"
```

---

### Task 3: Render compound chip in ReactantBin

Add a `compound` prop; when set, render one compound chip instead of per-species chips.

**Files:**
- Modify: `src/reaction/ReactantBin.tsx`
- Modify: `src/reaction/ReactantBin.test.tsx`

**Interfaces:**
- Consumes: nothing new (presentational).
- Produces: `ReactantBin` gains prop `compound: string | null`. When non-null, renders a single chip with text = `compound` and one `×` button that calls `onRemove(-1)` (sentinel meaning "clear the bin"). When null, behaviour is exactly as today.

- [ ] **Step 1: Write the failing tests**

Add to `src/reaction/ReactantBin.test.tsx` (keep existing tests; add `compound={null}` to their prop lists so they still compile):

```ts
it('renders a single compound chip when compound is set', () => {
  render(<ReactantBin label="A" species={[z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]}
    active qty={null} compound="MgCl₂"
    onActivate={noop} onRemove={noop} onPickCharge={noop} onQty={noop} />);
  expect(screen.getByText('MgCl₂')).toBeInTheDocument();
  // the individual element chips are not rendered
  expect(screen.queryByText('Mg')).not.toBeInTheDocument();
});

it('compound chip × clears the bin via onRemove(-1)', async () => {
  const onRemove = vi.fn();
  render(<ReactantBin label="A" species={[z('Mg', { derivedCharge: 2 }), z('Cl', { derivedCharge: -1 })]}
    active qty={null} compound="MgCl₂"
    onActivate={noop} onRemove={onRemove} onPickCharge={noop} onQty={noop} />);
  await userEvent.click(screen.getByText('×'));
  expect(onRemove).toHaveBeenCalledWith(-1);
});
```

Also update the three existing `render(<ReactantBin ... />)` calls in this file to include `compound={null}` in their props.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/reaction/ReactantBin.test.tsx`
Expected: FAIL — TypeScript/prop error: `compound` is not a known prop (and the new assertions fail).

- [ ] **Step 3: Add the `compound` prop and compound-chip branch**

In `src/reaction/ReactantBin.tsx`:

Add to the `Props` interface (after `qty: ReactantEntry | null;`):

```ts
  compound: string | null;
```

Add `compound` to the destructured params:

```ts
export function ReactantBin({ label, species, active, qty, compound, onActivate, onRemove, onPickCharge, onQty }: Props) {
```

Replace the species-chip block (the `<div className="flex gap-2 flex-wrap min-h-8 items-center">…</div>` at lines 36-48) with a branch:

```tsx
      <div className="flex gap-2 flex-wrap min-h-8 items-center">
        {species.length === 0 && <span className="text-xs text-white/30">tap tray to add (1–2 species)</span>}
        {compound != null ? (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${s.chip}`}>
            {compound}
            <button
              aria-label="clear compound"
              onClick={e => { e.stopPropagation(); onRemove(-1); }}
              className="ml-0.5 text-bg/70 hover:text-bg"
            >×</button>
          </span>
        ) : (
          species.map((z, i) => (
            <span key={`${z.symbol}-${i}`} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-bg ${s.chip}`}>
              {z.symbol}{z.derivedCharge != null ? chargeLabel(z.derivedCharge) : ''}
              <button
                aria-label={`remove ${z.symbol}`}
                onClick={e => { e.stopPropagation(); onRemove(i); }}
                className="ml-0.5 text-bg/70 hover:text-bg"
              >×</button>
            </span>
          ))
        )}
      </div>
```

Leave the TM-picker block (lines 50-54) unchanged — it only renders while a TM charge is unresolved, which is exactly when `compound` is `null`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/reaction/ReactantBin.test.tsx`
Expected: PASS (all existing + 2 new).

- [ ] **Step 5: Commit**

```bash
git add src/reaction/ReactantBin.tsx src/reaction/ReactantBin.test.tsx
git commit -m "feat: render compound chip in reactant bin"
```

---

### Task 4: Wire compound formula into ReactionView

Compute the compound string per bin with wasm and pass it down. Handle the clear-bin sentinel.

**Files:**
- Modify: `src/reaction/ReactionView.tsx`
- Modify: `src/reaction/ReactionView.test.tsx` (add one assertion)

**Interfaces:**
- Consumes: `useWasm` from `../wasm/hooks`; `binCompound` from `./binFormula`.
- Produces: no exported API change.

- [ ] **Step 1: Add the failing assertion**

In `src/reaction/ReactionView.test.tsx`, in the `'solves NaOH + HCl …'` test, after the four bin-A/B clicks and BEFORE `await u.click(screen.getByText('Solve'));`, add:

```ts
    // bin A collapses its two species (Na + OH) into one compound chip
    expect(await screen.findByText('NaOH')).toBeInTheDocument();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/reaction/ReactionView.test.tsx`
Expected: FAIL — `Unable to find an element with the text: NaOH` (bin still shows separate `Na` / `OH` chips).

- [ ] **Step 3: Wire `useWasm` + `binCompound` into ReactionView**

In `src/reaction/ReactionView.tsx`:

Add imports:

```ts
import { useWasm } from '../wasm/hooks';
import { binCompound } from './binFormula';
```

Inside the component, after the `useReducer` line:

```ts
  const pt = useWasm();
```

Add `compound={binCompound(pt, state.reactantA)}` to the first `<ReactantBin>` (bin A) and `compound={binCompound(pt, state.reactantB)}` to the second (bin B).

Update each bin's `onRemove` to treat index `-1` as a full clear (dispatching from the highest index down so indices stay valid as the array shrinks). Replace bin A's `onRemove`:

```tsx
            onRemove={i => {
              if (i === -1) {
                // clear the whole bin: remove from the end so indices stay valid
                for (let idx = state.reactantA.length - 1; idx >= 0; idx--) {
                  dispatch({ type: 'REMOVE_SPECIES', bin: 'A', index: idx });
                }
              } else {
                dispatch({ type: 'REMOVE_SPECIES', bin: 'A', index: i });
              }
            }}
```

And bin B's `onRemove` identically with `'B'` and `state.reactantB`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/reaction/ReactionView.test.tsx`
Expected: PASS — both reaction tests pass; bin A shows `NaOH`, solve still yields `NaCl` / `H₂O` / `DoubleDisplacement`.

- [ ] **Step 5: Run the full test suite + build**

Run: `npx vitest run && npm run build`
Expected: all tests pass; `tsc -b && vite build` completes with no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/reaction/ReactionView.tsx src/reaction/ReactionView.test.tsx
git commit -m "feat: show compound formula for two-species reactant bins"
```

---

## Notes on the clear-bin sentinel

`onRemove(-1)` means "clear the whole bin". It is only emitted by the compound chip's `×`. Dispatching `REMOVE_SPECIES` from the highest index down keeps each index valid as the array shrinks (the reducer's `PICK_SPECIES` guard and the solver are untouched). Both `REMOVE_SPECIES` dispatches also null the `result` (existing reducer behaviour), so a stale solve is cleared when the bin is emptied.
