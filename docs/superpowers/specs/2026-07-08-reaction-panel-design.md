# Reaction Panel — Design Spec

**Date:** 2026-07-08
**Status:** Approved
**Repo:** chem-interactive @ `feat/synch-ios`

---

## Overview

Add a standalone **Reaction** panel that drives the `solveCompoundReaction`
wasm binding (already wired at `src/wasm/reaction.ts`). The user assembles two
reactants — each 1–2 chemical species picked from the existing element tray —
optionally sets a quantity per reactant, and solves. The panel renders the
balanced equation, reaction class, feasibility/messages, limiting reactant with
per-product yields and excess, and a redox analysis block.

This is net-new UI. It does not modify the existing ionic-compound canvas; it
sits beside it, reached by a top-level mode toggle.

---

## Why a standalone panel

The existing canvas builds **one** ionic compound from `slotA` (cation) +
`slotB` (anion). A reaction needs **two reactants**, each of which may itself be
1–2 species (e.g. `Zn + CuSO₄`, `NaOH + HCl`, `CH₄ + O₂`). The slot-per-ion
model cannot express that, so the reaction panel is its own view with its own
two-reactant assembly model.

---

## Entry point

`src/App.tsx` gains a `mode: 'build' | 'react'` state and a two-tab header:

```
[ Build ] [ React ]
```

- `build` → existing `<IonicCanvas/>` (unchanged).
- `react` → new `<ReactionView/>`.

`WasmProvider` continues to wrap both modes (the tray needs the loaded periodic
table). No router is introduced. Default mode is `build` (current behavior
preserved).

---

## Components (new dir `src/reaction/`)

### `ReactionView.tsx`
Owns all panel state via `useReducer`:

```ts
type ReactionState = {
  reactantA: ZoneState[]   // 0–2 species
  reactantB: ZoneState[]   // 0–2 species
  activeBin: 'A' | 'B'     // which bin a tray pick lands in
  qtyA: ReactantEntry | null
  qtyB: ReactantEntry | null
  result: WasmReactionResult | null
}
```

Actions: `PICK_SPECIES` (add to active bin, max 2), `REMOVE_SPECIES`,
`SET_ACTIVE_BIN`, `SET_TM_CHARGE` (set a species' `derivedCharge`), `SET_QTY`,
`SET_RESULT`, `RESET`.

Layout (top → bottom): reused `<ElementTray/>` → row of two `<ReactantBin/>` →
Solve / Reset buttons → `<ReactionResultPanel/>`.

### `ReactantBin.tsx`
Renders one reactant. Props: the bin's `ZoneState[]`, its label (`A`/`B`),
active flag, quantity, and callbacks. Shows:
- 1–2 species as removable chips. Bin border/accent uses the slot color
  convention (A = `cation` green, B = `anion` pink).
- Clicking the bin sets it active (subsequent tray picks land here).
- An optional quantity input (value + mole/mass unit), mirroring
  `ReactantQuantityPopover` styling.
- An **inline transition-metal charge picker** for any species with
  `isTransition && derivedCharge == null`: buttons over the species'
  positive `oxidationStates` (reusing the `TransitionMetalPicker` idiom),
  setting `derivedCharge`.

### `ReactionResultPanel.tsx`
Mirrors `StoichResultPanel` (`rounded-lg bg-surface p-3` card). Renders, from
`WasmReactionResult`:
- **Balanced equation** — `reactants` and `products` joined with `+` and `→`,
  each term via a `coef(coeff, formula)` helper (reuse the existing helper
  idiom from `StoichResultPanel`).
- **Reaction class** — a badge showing `reaction_class`.
- **Feasibility** — when `!feasible`, show `error` (if present) and each of
  `messages` prominently; suppress the numeric rows.
- **Limiting + yields/excess** — only when both quantities are set: a
  "Limiting: …" line plus `StoichMetricRow`-style rows for each product's
  `yields` (mole, mass) tuple and the `excess` tuple.
- **Redox block** — when `redox?.is_redox`: oxidising/reducing agent lines,
  a per-element `changes[]` list (`symbol: before → after` using signed
  rendering), and the `narrative[]` sentences. When `redox` exists but
  `is_redox` is false, show the single non-redox narrative line.

### `speciesMap.ts`
Pure, independently testable helpers:

```ts
zoneToSpecies(z: ZoneState): WasmSpecies
  // { symbol: z.symbol, is_polyatomic: z.isPolyatomic,
  //   charge: z.derivedCharge ?? undefined }

qtyToWasm(q: ReactantEntry | null): WasmQuantity | undefined
  // { value, unit } | undefined
```

---

## Tray reuse — one targeted refactor

`ElementTray` / `ElementToken` / `PolyatomicToken` currently tap → `selectElement`
on the `IonicCanvas` context. Add an **optional `onPick?: (z: ZoneState) => void`
prop** threaded `ElementTray → ElementToken/PolyatomicToken`:

- When `onPick` is provided, a token tap calls `onPick(zoneState)` and does
  **not** touch the canvas selection context.
- When absent (the canvas's existing usage), behavior is unchanged.

This is backward-compatible and decouples the tray from the canvas — the kind
of local improvement warranted by the code we are touching. `ReactionView`
passes `onPick` = dispatch `PICK_SPECIES` into the active bin.

---

## Data flow

1. User toggles to **React**.
2. Tray tap → `onPick` → `PICK_SPECIES` adds a `ZoneState` to the active bin
   (ignored if that bin already holds 2).
3. If a picked species is a transition metal with no charge, the bin surfaces
   the inline charge picker; choosing sets `derivedCharge`.
4. Optional: set a quantity per reactant.
5. **Solve** (disabled until both bins hold ≥1 species) maps bins via
   `zoneToSpecies` and calls
   `solveCompoundReaction(zoneA, zoneB, qtyA?, qtyB?)`, storing the result.
6. `ReactionResultPanel` renders it.

---

## Error handling

`solveCompoundReaction` never throws — it returns `feasible=false` plus a
`error`/`messages` payload for every failure mode (unclassifiable pair,
unbalanceable, missing transition-metal charge, etc.). Therefore:

- No `try/catch` around the call.
- The Solve button is disabled until each reactant has ≥1 species (the only
  precondition the UI enforces).
- Every engine-level failure is surfaced by the panel's feasibility section as
  its `error`/`messages`. A transition metal left without a charge yields a
  clear engine message rather than a crash.

---

## Testing

- **Unit** (`speciesMap.test.ts`): `zoneToSpecies` maps element (undefined
  charge), polyatomic ion (carries charge), and TM-with-derivedCharge cases;
  `qtyToWasm` maps null → undefined and a set quantity.
- **Component** (`ReactionView.test.tsx`, vitest + React Testing Library,
  driving **real compiled wasm** as the existing `reaction.test.ts` smoke test
  does — not mocked):
  - Pick `Na` + `OH` into A, `H` + `Cl` into B, click Solve → assert the
    rendered equation contains `NaCl` and `H₂O` and the class reads
    `DoubleDisplacement`.
  - A `Zn` + `CuSO₄` case (with Zn/Cu charges chosen) → assert the redox block
    renders reducing/oxidising agent text.

---

## Out of scope (v1)

- No persistence of assembled reactions.
- No integration with the ionic-compound canvas state (the two views are
  independent).
- No mobile-specific layout pass beyond inheriting existing Tailwind
  responsive tokens.
- `redox.indeterminate` and the full per-formula oxidation-state map are not
  exposed by `WasmRedox`, so they are not rendered (consistent with the wasm
  contract).

---

## Styling

Existing Tailwind v4 tokens and idioms only: `bg-surface`/`bg-bg` cards,
`text-white`/`text-muted`, pill buttons
(`rounded-full border border-accent/60 text-accent hover:bg-accent hover:text-bg`),
tab buttons (`rounded-full border`, active `border-accent bg-accent/20`),
badges (`rounded-full px-2 py-0.5 text-xs`), the A=`cation`/B=`anion` slot
colors, and framer-motion enter transitions for the result panel.
