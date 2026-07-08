# Reaction bin compound formula — design

Date: 2026-07-09
Status: Approved (design), pending implementation plan

## Problem

On the React(ion) tab, each reactant bin (A / B) can hold 1–2 species. When it
holds 2, the UI shows them as two separate chips (e.g. `Na` `Cl`). Users expect
2 elements in a bin to read as a single **compound** — a charge-balanced
formula such as `NaCl` or `MgCl₂`.

The chemistry is already correct: `solve_compound_reaction` treats each bin's
species array as one reactant compound. This change is **display + charge
resolution only** — no change to what is fed into the solver.

## Goal

When a bin holds 2 species, render one **compound chip** showing the
charge-balanced formula instead of two separate chips. Single-species bins are
unchanged.

## Non-goals

- Changing the solver input or `solve_compound_reaction` behaviour.
- Supporting more than 2 species per bin (cap stays at 2).
- Any change to the Build tab.

## Approach (chosen: A)

Reuse the Build tab's existing formula logic rather than duplicating chem rules.

1. **Extract shared formula util.** Move `productInfo`, `fmt`, `toSub`, and the
   `SUBSCRIPTS` constant out of `src/bridge/BridgeColumn.tsx` into a new
   `src/bridge/formula.ts`. `BridgeColumn` imports them back — no behaviour
   change there. `productInfo(reaction, slotA, slotB)` returns
   `{ subA, subB, formula }` for ionic (charge crossover, polyatomic parens),
   covalent (Greek stoich), and homonuclear/fallback cases.

2. **Classify in the bin.** In the reaction view, when a bin has exactly 2
   species, call `classifyReaction(pt, symA, symB)` (from `src/wasm/chem.ts`,
   same call the Build tab makes at `BridgeColumn.tsx:173`) to get the
   `WasmReaction` (bonding + charges), then `productInfo(...)` for the formula
   string. `pt` comes from `useWasm()`.

3. **Render one compound chip.** Replace the two chips with a single chip
   showing the formula (with `₀-₉` subscripts). The chip keeps the bin's colour
   (cation border/chip style). Removal: the compound chip's `×` clears the bin
   back to empty (see Decision below).

## Charge gate

Ionic formulas need resolved charges. If either species is a transition metal
with `derivedCharge == null`, the bin stays in **chip mode** and shows the
existing `TransitionMetalPicker` until a charge is picked. Once both charges are
resolvable, the bin collapses to the compound chip. This mirrors the Build tab's
gating.

## Component / data flow

- `ReactionView.tsx`
  - add `const pt = useWasm();`
  - pass `pt` (or the derived `{ formula, ready }`) into each `ReactantBin`, OR
    compute the formula in `ReactionView` and pass a `compound?: string` prop.
    **Decision:** compute in `ReactantBin` to keep `ReactionView` thin; bin
    already owns species rendering. Bin receives `pt` as a prop.
- `ReactantBin.tsx`
  - branch: `species.length === 2 && chargesResolved` → render compound chip via
    `classifyReaction` + `productInfo`; else → existing chip list (+ TM picker).
  - `chargesResolved` = no species is a transition metal with `derivedCharge`
    still `null`.
- `speciesMap.ts` / `reactionReducer.ts` — unchanged. Underlying `ZoneState[]`
  still feeds `zoneToSpecies` → solver.

## Removal behaviour (decision)

Compound chip `×` removes **both** species (clears the bin). Rationale: once
collapsed to a formula the two chips are no longer individually visible, so a
single clear is the least surprising action. Per-species removal is still
available before the 2nd species resolves (chip mode). `REMOVE_SPECIES` reducer
action is reused (dispatch for each index, or a full-bin clear).

## Ordering

`productInfo` / `classifyReaction` decide cation/anion and IUPAC order
internally (same as Build tab), so pick order into the bin does not change the
rendered formula.

## Testing

- `formula.ts`: unit tests move/copy from existing `BridgeColumn` formula cases
  (ionic crossover `MgCl₂`, `Na` `Cl` → `NaCl`, polyatomic parens, covalent
  Greek, homonuclear).
- `ReactantBin.test.tsx`: (a) 1 species → single element chip; (b) 2 resolved
  species → one compound chip with expected formula; (c) 2 species with an
  unresolved transition metal → chip mode + TM picker, no compound chip;
  (d) compound chip `×` clears the bin.
- `ReactionView.test.tsx`: solving still works with a 2-species bin (unchanged
  solver path).
- Regression: `BridgeColumn` tests still pass after extract.

## Files touched

- new: `src/bridge/formula.ts` (+ test)
- edit: `src/bridge/BridgeColumn.tsx` (import from formula.ts)
- edit: `src/reaction/ReactantBin.tsx` (compound chip branch)
- edit: `src/reaction/ReactionView.tsx` (pass `pt`)
- tests: `ReactantBin.test.tsx`, `ReactionView.test.tsx`
