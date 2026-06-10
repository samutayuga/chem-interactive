# Design: Interactive Ionic Cross-Over Canvas

**Date:** 2026-06-10
**Target:** Singapore Sec 3 O-Level/IP chemistry students (age ~15), school iPads & Chromebooks
**Stack:** React, Vite, TailwindCSS, Material UI, Framer Motion, WebAssembly (Rust periodic table)

---

## 1. Layout

**Bridge layout.** Three horizontal columns:

```
┌─────────────────────────────────────────┐
│           ELEMENT TRAY (scrollable)     │
├──────────────┬──────────┬───────────────┤
│  CATION ZONE │  BRIDGE  │  ANION ZONE   │
│  (left)      │  COLUMN  │  (right)      │
│              │  ⇌ icon  │               │
│              │  button  │               │
│              │  formula │               │
└──────────────┴──────────┴───────────────┘
```

- **Element Tray**: scrollable row of neutral element chips (symbol, name, atomic number). Secondary tab for polyatomic ions (OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻, NH₄⁺).
- **Cation Zone / Anion Zone**: drop targets. Expand inline during deduction. Mirror each other structurally.
- **Bridge Column**: centre column hosting the ⇌ icon, the "Cross Over" button (disabled until both zones ionised), and the final formula output.

**Visual theme:** Vibrant/gamified — dark purple base (`#1a0a2e`), neon green for cations (`#00ff88`), neon pink for anions (`#ff4080`), purple accents (`#7040ff`).

---

## 2. State Machine

### Phases

| Phase | Description |
|---|---|
| `SELECTING` | Both zones empty. Tray interactive. Crossover button disabled. |
| `DEDUCING_CHARGE` | One zone has a neutral element. That zone expanded inline. Other zone locked (40% opacity, no drop). |
| `READY_TO_CROSS` | Both zones `IONIZED`. Bridge column pulses. Crossover button enabled. |
| `ANIMATING_CROSSOVER` | 4-frame animation running. All interaction locked. |
| `COMPLETE` | Formula displayed in bridge. Reset button shown. |

`activeDeductionSide: 'cation' | 'anion' | null` tracks which zone is currently in deduction.

### TypeScript Schema

```typescript
interface IonicCanvasState {
  canvasPhase: 'SELECTING' | 'DEDUCING_CHARGE' | 'READY_TO_CROSS'
             | 'ANIMATING_CROSSOVER' | 'COMPLETE';
  activeDeductionSide: 'cation' | 'anion' | null;
  cation: ZoneState | null;
  anion:  ZoneState | null;
}

interface ZoneState {
  symbol:           string;
  isPolyatomic:     boolean;
  isTransition:     boolean;
  valenceElectrons: number;        // parsed from WASM electron_configuration
  oxidationStates:  number[];      // from WASM — used for transition metal picker
  derivedCharge:    number | null; // set after successful deduction
  wrongCount:       number;        // resets on correct answer; hint shown at >= 2
  status: 'NEUTRAL' | 'DEDUCING' | 'IONIZED';
}
```

### Reducer Actions

| Action | Payload | Effect |
|---|---|---|
| `DROP_ELEMENT` | `{ side, symbol }` | Sets zone to `NEUTRAL`, phase → `DEDUCING_CHARGE` |
| `SUBMIT_DEDUCTION` | `{ side, loseOrGain, count }` | Validates; correct → `IONIZED`; wrong → inc `wrongCount` in zone state |
| `PICK_TM_CHARGE` | `{ side, charge }` | Transition metal path: sets `derivedCharge`, → `IONIZED` |
| `CONFIRM_POLYATOMIC` | `{ side }` | Polyatomic "Got it" path → `IONIZED` |
| `TRIGGER_CROSSOVER` | — | Phase → `ANIMATING_CROSSOVER` |
| `CROSSOVER_COMPLETE` | — | Phase → `COMPLETE` |
| `RESET` | — | Full state reset to initial |

---

## 3. Deduction Phase (Inline Expansion)

When an element is dropped, its zone expands in-place. The other zone is locked. Three sub-paths:

### Regular elements (s/p block, non-transition)

1. Show lose/gain toggle (Lose / Gain buttons)
2. Show count selector (buttons: 1, 2, 3, 4 — electrons lost or gained)
3. Validate against expected charge from WASM `oxidation_states`
4. **Wrong answer**: shake animation + `wrongCount++`. At `wrongCount >= 2`: callout shows valence electron count as hint.
5. **Correct answer**: electron dot animation (dots float away for metals, float in for non-metals) → symbol transforms from neutral to ion (e.g. `Mg` → `Mg²⁺`). Zone status → `IONIZED`.

### Transition metals (group 3–12)

1. Inline expansion shows: "This is a transition metal — pick its charge:"
2. Buttons generated from `WasmElement.oxidation_states` (positive states only for cation zone)
3. Student picks charge → electron count auto-shown ("loses N electrons") → confirm → `IONIZED`
4. No wrong-answer path (it's a selection, not a deduction challenge)

### Polyatomic ions

1. Inline expansion shows read-only callout: e.g. "OH⁻ carries a −1 charge"
2. Student taps "Got it" → immediately `IONIZED`
3. No wrong-answer path

---

## 4. Cross-Over Animation (4 Frames)

Implemented as a `CrossoverAnimator` component. `animationStep: 0 | 1 | 2 | 3 | 4` is **local component state** (`useState`) — it is purely a UI sequencing detail, not part of the reducer. Each Framer Motion `onAnimationComplete` callback advances the step. Step 4 dispatches `CROSSOVER_COMPLETE` to the reducer.

### Frame ① — Isolate Valency (200ms)
- ± signs fade to `opacity: 0` on both ion superscripts
- Bare integer remains as plain superscript

### Frame ② — Criss-Cross Travel (600ms)
- Each integer is a `motion.span` with unique `layoutId`
- Cation integer animates diagonally to anion subscript position
- Anion integer animates diagonally to cation subscript position
- `transition: { type: 'spring', stiffness: 120, damping: 18 }`

### Frame ③ — Polyatomic Bracket Check (300ms, conditional)
- **Fires only if**: target element is polyatomic AND incoming subscript > 1
- Two `motion.span` brackets drop from `y: -20, opacity: 0` to resting position around polyatomic symbol
- **Skip** if subscript === 1

### Frame ④ — GCD Simplification (400ms, conditional)
- Compute `GCD(cation_subscript, anion_subscript)` in JS
- **Fires only if** GCD > 1
- ÷N badge fades in above formula → subscripts animate to simplified values (hidden if === 1) → badge fades out
- **Skip** if GCD === 1

### Step sequencer

```typescript
const STEPS = [
  'ISOLATE_VALENCY',  // 0
  'CRISS_CROSS',      // 1
  'BRACKET_CHECK',    // 2  — skipped if conditions not met
  'GCD_SIMPLIFY',     // 3  — skipped if GCD === 1
  'DONE',             // 4
];
```

---

## 5. Component Architecture

```
App
└── WasmProvider          // PeriodicTable.load() once; useWasm() + useElement(symbol) hooks
    └── IonicCanvasProvider  // useReducer(ionicReducer, initialState)
        └── IonicCanvas      // bridge layout root
            ├── ElementTray  // scrollable chips + polyatomic tab
            │   └── ElementToken × N  // draggable; symbol, name, atomic number
            ├── DropZone (side=cation)
            │   └── DeductionPanel
            │       ├── RegularDeduction    // lose/gain + count buttons
            │       ├── TransitionMetalPicker  // charge selector
            │       └── PolyatomicConfirm   // read-only callout + Got it
            ├── BridgeColumn               // ⇌, crossover button, formula + CrossoverAnimator
            └── DropZone (side=anion)
                └── DeductionPanel (mirror)
```

**Hooks:**
- `useWasm()` — returns `PeriodicTable` instance from context
- `useElement(symbol)` — returns `WasmElement | undefined`
- `useAllElements()` — returns all 118 elements for tray population
- `useIonicCanvas()` — returns `{ state, dispatch }` from `IonicCanvasContext`

**WASM path alias:** Vite config maps `@periodic-table` → `../../sam-periodic-table/pkg/pt-wasm/pt_wasm.js`

---

## 6. WASM Integration

`PeriodicTable.load()` is synchronous. Called once in `WasmProvider` on mount.

Valence electron count derived by parsing `electron_configuration`:
- Split on spaces, take last token (e.g. `3s2` → 2, `2p4` → 4)
- Fallback: `((element.group - 1) % 8) + 1` for s/p block if parse fails

Transition metal detection: `element.group >= 3 && element.group <= 12`

Polyatomic ions are a static constant (not from WASM):

```typescript
const POLYATOMIC_IONS = [
  { symbol: 'OH',  name: 'Hydroxide',  charge: -1 },
  { symbol: 'NO₃', name: 'Nitrate',    charge: -1 },
  { symbol: 'SO₄', name: 'Sulfate',    charge: -2 },
  { symbol: 'CO₃', name: 'Carbonate',  charge: -2 },
  { symbol: 'PO₄', name: 'Phosphate',  charge: -3 },
  { symbol: 'NH₄', name: 'Ammonium',   charge: +1 },  // cation — only draggable to cation zone
];
```

NH₄⁺ has a positive charge — the tray restricts it to the cation drop zone only. All other polyatomic ions in this list are anions.

---

## 7. Error Handling

| Scenario | Handling |
|---|---|
| WASM load failure | Error boundary at `WasmProvider` — full-page "Failed to load element data" message |
| `electron_configuration` parse failure | Fallback to group-based heuristic |
| Drag to wrong zone (e.g. two cations) | Tray disables drag to same-polarity zone once one side is filled |
| GCD of 0 (invalid state) | Guard: skip simplification if either subscript is 0 |

---

## 8. Testing

**Vitest + React Testing Library**

| Layer | Coverage |
|---|---|
| Reducer unit tests | Every action × every valid phase. Named cases: Mg+Cl → MgCl₂, Ca+O → CaO (GCD), Fe+O → Fe₂O₃ (transition metal). |
| Component integration | `DeductionPanel` for all three element types; correct-answer flow; hint trigger at `wrongCount >= 2`. |
| Animation sequencing | Mock `onAnimationComplete`; assert `animationStep` advances; assert bracket/GCD skips fire correctly. |

No E2E automation — drag-and-drop on touch targets is fragile in Playwright. Manual QA on iPad covers the drag flow.

---

## 9. QA Verification Cases (from spec)

| Elements | Deduction Steps | Mid-State | Expected Formula |
|---|---|---|---|
| Mg + Cl | Mg loses 2e⁻; Cl gains 1e⁻ | Mg²⁺ + Cl⁻ | MgCl₂ |
| Ca + O | Ca loses 2e⁻; O gains 2e⁻ | Ca²⁺ + O²⁻ | CaO (simplifies from Ca₂O₂) |
| Fe + O | Pick Fe³⁺ from TM picker | Fe³⁺ + O²⁻ | Fe₂O₃ |
