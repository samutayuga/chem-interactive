# Chem Interactive — Chemical Bonding Canvas

An interactive chemistry tool for exploring chemical bonding. Students drag elements onto a canvas, and the app automatically determines the bond type (Ionic, Covalent, or Metallic) based on the element classes, then guides them through the appropriate visualization.

## Features

- **All 118 elements** — full periodic table tray, f-block (lanthanides + actinides) shown below main table per convention
- **Three-way class coloring** — tokens colored by Metal (amber), NonMetal (cyan), Metalloid (sage green)
- **Smart bond detection** — drop any two elements; bond type auto-determined from WASM `class` field
- **Tray highlighting** — after first drop, tray shows color rings: cyan=Ionic, emerald=Covalent, amber=Metallic; noble gases dimmed
- **Ionic bonding** — guided charge deduction (lose/gain electrons), transition metal charge picker, crossover animation, balanced formula
- **Covalent bonding** — Venn diagram (overlapping atom circles) with shared electron pairs and lone pairs calculated from octet rule; correct stoichiometry (H₂O, CO₂, NH₃, N₂…)
- **Metallic bonding** — metal ion lattice with animated sea of delocalised electrons, alloy formula
- **Polyatomic ions** — OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻, NH₄⁺ as pre-charged draggable tokens
- **Resizable tray** — drag handle between tray and bond zones to adjust split
- **Hover tooltips** — group category on column hover; electron config on element hover
- **Hover scaling** — element tokens scale up on hover with enlarged atomic/mass number text

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

1. **Pick an element** from the tray and drag it into either zone (left or right — order doesn't matter).
2. **Pick a partner element** — the tray highlights compatible elements and shows what bond type would form.
3. **Bond determined automatically:**
   - **Ionic** (Metal + NonMetal, or Metal + Metalloid): deduce the charge for each element, then click Cross Over to see the balanced formula.
   - **Covalent** (NonMetal + NonMetal, or NonMetal + Metalloid): Venn diagram with shared electron pairs and lone pairs shown immediately.
   - **Metallic** (Metal + Metal): animated electron sea with formula shown immediately.
4. Click **Reset** to start over.

## Bond Type Rules

| Element A | Element B | Bond Type |
|-----------|-----------|-----------|
| Metal | Metal | Metallic |
| NonMetal | NonMetal | Covalent |
| Metalloid | NonMetal / Metalloid | Covalent |
| Metal | NonMetal | Ionic |
| Metal / Metalloid | Metalloid | Ionic |

## Covalent Stoichiometry

Stoichiometry and bond order are derived purely from valence electrons using the octet rule. No lookup tables.

```
shellTarget(ve) = ve ≤ 2 ? 2 : 8
bondsNeeded(ve) = shellTarget(ve) − ve
g               = gcd(bondsNeeded(veA), bondsNeeded(veB))
nA              = bondsNeeded(veB) / g   ← count of element A atoms
nB              = bondsNeeded(veA) / g   ← count of element B atoms
bondOrder       = g                      ← 1=single, 2=double, 3=triple
```

Lone pairs per atom = `(ve − bondOrder × bonds_from_that_atom) / 2`.

| Compound | veA | veB | nA | nB | Bond order | Formula |
|----------|-----|-----|----|----|------------|---------|
| HCl | 1 | 7 | 1 | 1 | 1 | HCl |
| H₂O | 1 | 6 | 2 | 1 | 1 | H₂O |
| CO₂ | 4 | 6 | 1 | 2 | 2 | CO₂ |
| NH₃ | 1 | 5 | 3 | 1 | 1 | NH₃ |
| N₂  | 5 | 5 | 1 | 1 | 3 | N₂  |

## Covalent Venn Diagram Layout

The element with count = 1 is the **central** atom; the other is **peripheral**.

| nPeripheral | Layout |
|-------------|--------|
| 1 | Two overlapping circles (classic Venn) |
| 2 | Central circle flanked by two peripheral circles (e.g., H₂O, CO₂) |
| 3 | Central circle with three peripheral circles (e.g., NH₃) |
| 4+ | Simplified: two-circle view with ×n badge |

Shared electron pairs → coloured dots in each overlap zone (2 dots per pair, one per atom colour).  
Lone pairs → coloured dots placed in directions away from all bond angles.

## QA Cases

| Compound | Slot A | Slot B | Bond | Formula |
|----------|--------|--------|------|---------|
| Magnesium chloride | Mg (lose 2) | Cl (gain 1) | Ionic | MgCl₂ |
| Calcium oxide | Ca (lose 2) | O (gain 2) | Ionic | CaO |
| Iron(III) oxide | Fe (TM: +3) | O (gain 2) | Ionic | Fe₂O₃ |
| Water | H | O | Covalent | H₂O (single bond, 2 lone pairs on O) |
| Carbon dioxide | C | O | Covalent | CO₂ (double bond, 2 lone pairs on each O) |
| Nitrogen | N | N | Covalent | N₂ (triple bond, 1 lone pair each) |
| Iron-copper alloy | Fe | Cu | Metallic | Fe-Cu |

## Project Structure

```
src/
  canvas/       # IonicCanvas root, reducer, types, context
  tray/         # ElementTray, ElementToken, PolyatomicToken
  zones/        # DropZone, DeductionPanel, RegularDeduction, TransitionMetalPicker, PolyatomicConfirm
  bridge/       # BridgeColumn, CrossoverAnimator, BondingDiagram, CovalentView, MetallicView
  wasm/         # WasmProvider, element hooks
  utils/        # gcd, valence, elementColor helpers
```

## Architecture & Data Flow

### Component Tree

```
App
├── WasmProvider                   ← loads WASM, exposes WasmContext
│   └── IonicCanvasProvider        ← useReducer state machine, exposes IonicCanvasContext
│       └── IonicCanvas            ← DndContext + drag handler + resizable tray splitter
│           ├── ElementTray        ← reads WasmContext + CanvasContext; tray highlight logic
│           │   ├── ElementToken (×118)    ← useDraggable; color from el.class; hover scale
│           │   └── PolyatomicToken (×6)   ← useDraggable
│           ├── DropZone (slot A)  ← useDroppable; generic (no cation/anion label)
│           │   └── DeductionPanel         ← Ionic only: RegularDeduction / TMPicker / PolyConfirm
│           ├── BridgeColumn       ← routes to correct visualization by bondingType
│           │   ├── BondingDiagram         ← Ionic: Lewis transfer + ion diagram
│           │   ├── CrossoverAnimator      ← Ionic: crossover animation
│           │   ├── CovalentView           ← Covalent: Venn diagram, shared + lone pair electrons
│           │   └── MetallicView           ← Metallic: ion lattice + animated electron sea
│           └── DropZone (slot B)
```

### WASM as the Single Source of Domain Truth

All element domain knowledge lives in the Rust/WASM module. The frontend holds **no chemistry constants** — it only reads `WasmElement` fields.

| Domain question | WASM field | Where used |
|-----------------|------------|------------|
| Which period row? | `el.period` | `ElementTray` grid row placement |
| Which group column? | `el.group` | `ElementTray` column filter |
| Metal / NonMetal / Metalloid? | `el.class` | Bond type determination; token color |
| Is transition metal? | `el.block === 'd'` | `makeZoneState` — enables TM charge picker |
| Token / border color | `el.class` | `elementClassColor(el.class)` |
| Group column background | `el.category` | `elementColor(el.category)` |
| Group label tooltip | `el.category` (first in group) | `ElementTray` tooltip |
| Valid ionic charges | `el.oxidation_states` | `SUBMIT_DEDUCTION` reducer validation |
| Valence electrons | `el.electron_configuration` | `parseValenceElectrons` — octet rule + Venn diagram |
| Bond pair count / stoichiometry | derived from `el.electron_configuration` | `CovalentView` shared pairs + atom count |
| Name / isotope display | `el.name`, `el.mass_number`, `el.atomic_number` | `ElementToken` UI + tooltip |

**What the frontend still owns (intentionally):**
- `GROUP_COLUMNS` — ordered list of group numbers to render as columns (layout, not chemistry).
- `CATEGORY_COLORS` / `CLASS_COLORS` — colour palette (visual design choice).
- `POLYATOMIC_IONS` — curated list of common polyatomic ions (pedagogical choice).

### State Machine

```
SELECTING
  ↓ DROP_ELEMENT (either slot)
SLOT_A_FILLED  ← first element in; tray highlights compatible partners
  ↓ DROP_ELEMENT (other slot) → bond type determined from class pair
  ├── Ionic ──────────────→ DEDUCING_CHARGE
  │                              ↓ both slots IONIZED
  │                         READY_TO_CROSS
  │                              ↓ TRIGGER_CROSSOVER
  │                         ANIMATING_CROSSOVER
  │                              ↓ CROSSOVER_COMPLETE
  │                         COMPLETE
  ├── Covalent ──────────→ SHOWING_COVALENT  (immediate, no deduction)
  └── Metallic ──────────→ SHOWING_METALLIC  (immediate, no deduction)
        ↓ RESET
  SELECTING
```

### Action → Reducer → UI

| User action | Action dispatched | State change |
|-------------|------------------|--------------|
| Drop token on zone | `DROP_ELEMENT { slot }` | zone filled; if second drop → bondingType set |
| Click Lose/Gain + count | `SUBMIT_DEDUCTION { slot }` | validates vs oxidationStates + class; sets derivedCharge |
| Click TM charge button | `PICK_TM_CHARGE { slot }` | sets derivedCharge directly |
| Confirm polyatomic | `CONFIRM_POLYATOMIC { slot }` | reads oxidationStates[0] |
| Click Cross Over | `TRIGGER_CROSSOVER` | phase → ANIMATING_CROSSOVER |
| Animation ends | `CROSSOVER_COMPLETE` | phase → COMPLETE |
| Reset | `RESET` | back to SELECTING |

### WebAssembly Data Flow

```
vite-plugin-wasm  (--target bundler build)
    ↓  (dynamic import at runtime)
@periodic-table  (Rust/WASM pkg, path alias)
    ↓
WasmProvider  (useEffect → import('@periodic-table'))
    ├─ PT.load()        → PeriodicTable instance
    ├─ pt.all()         → WasmElement[] (all 118 elements)
    └─ WasmContext.Provider  value={ pt, elements }
         ↓  (useAllElements hook)
    ElementTray
         ↓  maps all 118 elements → ElementToken or f-block row
    ElementToken
         └─ makeZoneState(WasmElement)
              reads: symbol, class, block, electron_configuration,
                     group, oxidation_states, atomic_number, name
              produces: ZoneState { symbol, elementClass (= class),
                         isTransition (= block==='d'),
                         valenceElectrons, oxidationStates, ... }
```

`WasmElement` data is **baked into `ZoneState` at drag time** — once a token is dropped the zone is fully self-contained and never reads WASM again.

### Rebuilding WASM

```bash
wasm-pack build crates/pt-wasm --target bundler --out-dir pkg/pt-wasm
```

Run from `../sam-periodic-table/`. The `--target bundler` flag is required for `vite-plugin-wasm` compatibility.
