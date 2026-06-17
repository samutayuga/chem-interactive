# Chem Interactive — Chemical Bonding Canvas

An interactive chemistry tool for Singapore O-Level students. Drag elements onto a canvas; the app auto-determines the bond type (Ionic, Covalent, or Metallic), resolves charges, and displays the correct formula and bonding diagram.

## Features

- **All 118 elements** — full periodic table tray; f-block (lanthanides + actinides) shown below main table per convention
- **Polyatomic ions** — OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻, NH₄⁺ as draggable pre-charged tokens
- **Auto bond detection** — bond type determined from element classes the moment the second element is dropped
- **Tray bonding hints** — after first drop, each element in the tray gets a background tint showing what bond it would form: blue = Ionic, green = Covalent, orange = Metallic; noble gases dimmed (incompatible)
- **Auto charge resolution** — ionic charges resolved immediately from `oxidationStates[0]`; transition metals prompt a charge picker inside the explanation modal
- **Explanation modal** — appears for all bond types; explains how the bond forms before showing the result
- **Replace any element** — `×` button on each zone clears that slot and resets the other; drag a new element onto a filled zone to restart automatically
- **Ionic bonding** — crossover animation → balanced formula following cation-first ordering; correct acid formula (H always first)
- **Covalent bonding** — Lewis diagram with shared electron pairs and lone pairs; IUPAC electronegativity ordering for formula (less EN element first); layouts for 1–4 peripheral atoms
- **Metallic bonding** — Electron Sea Model: orange cation lattice + animated yellow delocalised electrons; electron count derived from valence electrons; alloy shown as `A + B`
- **Hover tooltips** — group category on column hover; electron configuration on element hover

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI primitives | Material UI v6 |
| Animation | Framer Motion v12 |
| Drag-and-drop | dnd-kit |
| Element data | WebAssembly (Rust periodic table) |
| State | `useReducer` + Context |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## How to Use

1. **Pick an element** from the tray and drag it into either drop zone.
2. **Tray updates** — color tints appear on compatible elements showing predicted bond type.
3. **Pick a second element** — drag it into the other zone. Bond type is detected instantly.
4. **Explanation modal opens** — shows how the bond forms:
   - **Ionic**: charges auto-resolved; transition metals show a charge picker. Apply → crossover animation → balanced formula.
   - **Covalent**: shared electron count per atom explained. Apply → Lewis diagram.
   - **Metallic**: per-atom electron contribution explained. Apply → Electron Sea Model diagram.
5. **Replace an element** — click `×` on any zone to clear it and reset the other, or drag a new element onto a filled zone.
6. Click **Reset** to return to the start.

## Bond Type Rules

| Element A | Element B | Bond Type |
|-----------|-----------|-----------|
| Metal | Metal | Metallic |
| NonMetal | NonMetal | Covalent |
| Metalloid | NonMetal / Metalloid | Covalent |
| Metal / Metalloid | NonMetal / Metalloid | Ionic |
| Any | Polyatomic ion | Ionic |

Noble gases are incompatible with all elements.

## Formula Ordering Rules

### Ionic compounds
Cation (positive charge) always written first. H⁺ is treated as cation → acid formulas always lead with H (e.g., HCl, HNO₃, H₂SO₄).

### Covalent compounds
IUPAC electronegativity order — less electronegative element written first:

```
B < Si < C < Sb < As < P < N < H < Te < Se < S < O < I < Br < Cl < F
```

Examples: CO₂ (C before O), H₂O (H before O), NH₃ (N before H per IUPAC convention), HCl (H before Cl).

## Ionic Charge Resolution

```
if isTransition  → charge picker shown in modal (DEDUCING)
if oxidationStates is empty → charge picker shown (DEDUCING)
else             → derivedCharge = oxidationStates[0], status = IONIZED
```

For polyatomic ions: `derivedCharge = ion.charge` (fixed).

## Covalent Stoichiometry

Derived from valence electrons using the octet rule (H uses duet rule):

```
shellTarget(ve) = ve ≤ 2 ? 2 : 8
bondsNeeded(ve) = shellTarget(ve) − ve
g               = gcd(bondsNeeded(veA), bondsNeeded(veB))
nA              = bondsNeeded(veB) / g     ← atom count for A
nB              = bondsNeeded(veA) / g     ← atom count for B
bondOrder       = g                        ← 1=single, 2=double, 3=triple
```

| Compound | nA | nB | Bond order | Formula |
|----------|----|----|------------|---------|
| HCl | 1 | 1 | 1 | HCl |
| H₂O | 2 | 1 | 1 | H₂O |
| CO₂ | 1 | 2 | 2 | CO₂ |
| NH₃ | 1 | 3 | 1 | NH₃ |
| N₂  | 1 | 1 | 3 | N₂  |
| CH₄ | 1 | 4 | 1 | CH₄ |

## Covalent Lewis Diagram Layouts

The element with count = 1 is the **central** atom; the other is **peripheral**.

| nPeripheral | Layout |
|-------------|--------|
| 1 | Two overlapping circles (classic Venn) |
| 2 | Central flanked left + right (H₂O, CO₂) |
| 3 | Central with trigonal arrangement (NH₃, BF₃) |
| 4 | Central with cross arrangement — top/right/bottom/left (CH₄, CCl₄) |
| 5+ | Simplified two-circle view with ×n badge |

Shared pairs → coloured dots in the bond overlap (2 dots per bond order, one per atom colour).  
Lone pairs → dots placed in directions away from all bond angles.

## Metallic Bonding — Electron Sea Model

Diagram shows 6 metal cation sites (3×2 lattice, alternating A/B in alloys) with animated yellow delocalised electrons.

- Cation colour: orange family (A = `#f97316`, B = `#fb923c`)
- Electron colour: yellow (`#fde047`)
- Electron count = `3 × slotA.valenceElectrons + 3 × slotB.valenceElectrons` (capped at 12)
- Pure metal formula: `Na` (element symbol)
- Alloy formula: `Na + Mg` (components, no fixed ratio — alloys have variable composition)

## State Machine

```
SELECTING
  ↓ DROP_ELEMENT (slot A or B)
SLOT_A_FILLED  ← tray shows bonding hints
  ↓ DROP_ELEMENT (other slot) → bond type + auto-ionise
EXPLAINING     ← ExplanationModal open (all bond types)
  ↓ DISMISS_EXPLANATION
  ├── Ionic ──────────────→ ANIMATING_CROSSOVER
  │                              ↓ CROSSOVER_COMPLETE
  │                         COMPLETE
  ├── Covalent ──────────→ SHOWING_COVALENT
  └── Metallic ──────────→ SHOWING_METALLIC
        ↓ RESET (or drop new element onto a filled zone)
  SELECTING
```

### Actions

| Action | Trigger | Effect |
|--------|---------|--------|
| `DROP_ELEMENT { slot, zone }` | Drag to zone | Fill slot; if other slot filled → auto-ionise + `EXPLAINING`; if both were filled → reset other slot + `SLOT_A_FILLED` |
| `PICK_TM_CHARGE { slot, charge }` | TM picker in modal | Sets `derivedCharge` for that slot |
| `DISMISS_EXPLANATION` | Apply button in modal | Routes to `ANIMATING_CROSSOVER` / `SHOWING_COVALENT` / `SHOWING_METALLIC` |
| `REPLACE_ELEMENT { slot }` | `×` button on zone | Clears slot; resets other slot to NEUTRAL; `SLOT_A_FILLED` or `SELECTING` |
| `CROSSOVER_COMPLETE` | Animator callback | `COMPLETE` |
| `RESET` | Reset button | Back to `SELECTING` |

## Project Structure

```
src/
  canvas/       # IonicCanvas root, reducer, types, context, constants
  tray/         # ElementTray, ElementToken (+ BondHint), PolyatomicToken
  zones/        # DropZone (with × replace button), TransitionMetalPicker
  bridge/       # BridgeColumn, ExplanationModal, CrossoverAnimator,
                #   BondingDiagram, CovalentView, MetallicView
  wasm/         # WasmProvider, element hooks
  utils/        # gcd, valence, elementColor helpers
```

## Architecture & Data Flow

### Component Tree

```
App
└── WasmProvider                       ← loads WASM, exposes WasmContext
    └── IonicCanvasProvider            ← useReducer state machine, exposes IonicCanvasContext
        └── IonicCanvas                ← DndContext + drag handler + resizable tray splitter
            ├── ElementTray            ← reads WasmContext + CanvasContext; hint coloring
            │   ├── ElementToken ×118  ← useDraggable; bondHint background fill
            │   └── PolyatomicToken ×6 ← useDraggable
            ├── DropZone (slot A)      ← useDroppable; × replace button
            ├── BridgeColumn           ← routes by bondingType + canvasPhase
            │   ├── ExplanationModal   ← EXPLAINING phase; TM picker inline
            │   ├── CrossoverAnimator  ← ANIMATING_CROSSOVER phase
            │   ├── BondingDiagram     ← COMPLETE phase (Ionic)
            │   ├── CovalentView       ← SHOWING_COVALENT
            │   └── MetallicView       ← SHOWING_METALLIC
            └── DropZone (slot B)
```

### WASM as Single Source of Domain Truth

All element data comes from the Rust/WASM module. The frontend holds no chemistry constants.

| Domain question | WASM field | Where used |
|-----------------|------------|------------|
| Period row | `el.period` | ElementTray grid placement |
| Group column | `el.group` | ElementTray column filter |
| Metal / NonMetal / Metalloid | `el.class` | Bond type; token color; hint coloring |
| Transition metal | `el.block === 'd'` | `makeZoneState` — enables TM picker |
| Valid ionic charges | `el.oxidation_states` | `autoIonize`; TM picker options |
| Valence electrons | `el.electron_configuration` | `parseValenceElectrons` — covalent stoichiometry; metallic electron count |
| Symbol / name / mass | `el.symbol`, `el.name`, `el.mass_number`, `el.atomic_number` | Token UI + tooltips |

**What the frontend owns (intentionally):**
- `GROUP_COLUMNS` — column render order (layout, not chemistry)
- Color palettes — visual design
- `POLYATOMIC_IONS` — curated pedagogical list
- `IUPAC_ORDER` — electronegativity ordering map for covalent formula display

### WASM Element Baked at Drag Time

`makeZoneState(WasmElement)` converts the WASM type to `ZoneState` at drag start. Once dropped, the zone is self-contained and never reads WASM again.

### Rebuilding WASM

```bash
# Run from ../sam-periodic-table/
wasm-pack build crates/pt-wasm --target bundler --out-dir pkg/pt-wasm
```

`--target bundler` is required for `vite-plugin-wasm` compatibility.

## QA Cases

| Compound | Slot A | Slot B | Bond | Formula |
|----------|--------|--------|------|---------|
| Magnesium chloride | Mg | Cl | Ionic | MgCl₂ |
| Calcium oxide | Ca | O | Ionic | CaO |
| Iron(III) oxide | Fe (pick +3) | O | Ionic | Fe₂O₃ |
| Sulfuric acid | H | SO₄²⁻ | Ionic | H₂SO₄ |
| Nitric acid | H | NO₃⁻ | Ionic | HNO₃ |
| Ammonium chloride | NH₄⁺ | Cl | Ionic | NH₄Cl |
| Water | H | O | Covalent | H₂O |
| Carbon dioxide | C | O | Covalent | CO₂ |
| Methane | C | H | Covalent | CH₄ |
| Nitrogen | N | N | Covalent | N₂ (triple bond) |
| Hydrogen chloride | H | Cl | Covalent | HCl |
| Iron (pure) | Fe | Fe | Metallic | Fe |
| Brass | Cu | Zn | Metallic | Cu + Zn |
