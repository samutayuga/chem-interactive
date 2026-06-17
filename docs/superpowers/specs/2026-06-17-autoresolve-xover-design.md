# Auto-Resolve Crossover + Tray Bonding Hints — Design Spec

**Date:** 2026-06-17  
**Branch:** feat/autoresolve-xover-method  
**Scope:** Ionic canvas UX overhaul — remove interactive deduction quiz, add auto-resolution, bonding-type tray coloring, explanation modal, element replacement.

---

## 1. Goals

1. Auto-resolve ionic charges on element drop (no more interactive quiz).
2. Show an explanation modal after both elements are placed, teaching the process.
3. Transition metals still require user oxidation-state input — inside the modal.
4. Tray colors each compatible element by the bonding type it would form with the first-dropped element.
5. User can replace either element at any time, resetting to a clean state.

---

## 2. State Machine

### 2.1 `CanvasPhase` — changes

| Phase | Status | Notes |
|---|---|---|
| `SELECTING` | keep | both slots empty |
| `SLOT_A_FILLED` | keep | one slot filled |
| `DEDUCING_CHARGE` | **remove** | replaced by auto-ionise |
| `READY_TO_CROSS` | **remove** | replaced by `EXPLAINING` |
| `EXPLAINING` | **new** | modal open; may include TM picker |
| `ANIMATING_CROSSOVER` | keep | |
| `SHOWING_COVALENT` | keep | |
| `SHOWING_METALLIC` | keep | |
| `COMPLETE` | keep | |

### 2.2 Actions — changes

**Add:**
```typescript
| { type: 'DISMISS_EXPLANATION' }
| { type: 'REPLACE_ELEMENT'; slot: Slot }
```

**Remove:**
```typescript
| { type: 'SUBMIT_DEDUCTION'; slot: Slot; loseOrGain: 'lose' | 'gain'; count: number }
| { type: 'TRIGGER_CROSSOVER' }
| { type: 'CONFIRM_POLYATOMIC'; slot: Slot }
```

**Keep unchanged:**
```typescript
| { type: 'DROP_ELEMENT'; slot: Slot; zone: ZoneState }
| { type: 'PICK_TM_CHARGE'; slot: Slot; charge: number }
| { type: 'CROSSOVER_COMPLETE' }
| { type: 'RESET' }
```

### 2.3 `DROP_ELEMENT` — new logic (both slots filled, ionic bonding)

Auto-ionise each slot immediately on second drop:

```
for each slot:
  if isTransition  → status = DEDUCING   (TM picker renders in modal)
  if isPolyatomic  → derivedCharge = oxidationStates[0], status = IONIZED
  else             → derivedCharge = oxidationStates[0], status = IONIZED

→ canvasPhase = EXPLAINING
```

For covalent / metallic: no charge derivation needed; slots are left as-is (status remains `NEUTRAL`). Reducer sets `bondingType` and goes to `EXPLAINING`. `DISMISS_EXPLANATION` routes to `SHOWING_COVALENT` / `SHOWING_METALLIC`. Apply button is enabled immediately (no ionisation precondition for these types).

### 2.4 `DISMISS_EXPLANATION`

```
bondingType === 'Ionic'    → ANIMATING_CROSSOVER
bondingType === 'Covalent' → SHOWING_COVALENT
bondingType === 'Metallic' → SHOWING_METALLIC
```

Precondition: both slots `IONIZED`. Button disabled otherwise.

### 2.5 `PICK_TM_CHARGE`

Unchanged logic. After dispatch, if both slots `IONIZED`, modal transitions from picker view to explanation view (dismiss button activates). Phase stays `EXPLAINING`.

### 2.6 `REPLACE_ELEMENT`

```
clear replaced slot → null
reset other slot   → status = NEUTRAL, derivedCharge = null
canvasPhase        → SLOT_A_FILLED  (if other slot non-null)
                   → SELECTING      (if other slot also null)
activeDeductionSlot → null
```

---

## 3. Tray Bonding-Type Coloring

### 3.1 Prediction rule (computed in `ElementTray`, per token)

| `slotA.elementClass` | Token class | `bondingHint` |
|---|---|---|
| `Metal` | `Metal` | `metallic` |
| `Metal` | `NonMetal` | `ionic` |
| `Metal` | `Metalloid` | `ionic` |
| `NonMetal` | `Metal` | `ionic` |
| `NonMetal` | `NonMetal` | `covalent` |
| `NonMetal` | `Metalloid` | `covalent` |
| `Metalloid` | `Metal` | `ionic` |
| `Metalloid` | `NonMetal` | `covalent` |
| `Metalloid` | `Metalloid` | `covalent` |
| any | Noble Gas | `incompatible` |

When `slotA === null`: `bondingHint = null` (no special styling).

### 3.2 Visual treatment per hint

| `bondingHint` | Token style |
|---|---|
| `ionic` | blue/cyan ring `ring-2 ring-blue-400` |
| `covalent` | green ring `ring-2 ring-emerald-400` |
| `metallic` | amber ring `ring-2 ring-amber-400` |
| `incompatible` | `opacity-40 pointer-events-none` |
| `null` | default (no ring) |

### 3.3 `BondingLegend` component

Renders in tray header, visible only when `slotA` is filled.  
Three small color swatches with labels: Ionic · Covalent · Metallic.  
One-line, non-intrusive.

---

## 4. `ExplanationModal`

Centered modal with dark backdrop. Opens when `canvasPhase === 'EXPLAINING'`.

### 4.1 Structure

```
┌─────────────────────────────────────┐
│  How this bond forms                │
│─────────────────────────────────────│
│  [Slot A charge panel]              │
│  [Slot B charge panel]              │
│─────────────────────────────────────│
│  [Bonding summary]                  │
│─────────────────────────────────────│
│               [Apply →]             │
└─────────────────────────────────────┘
```

### 4.2 Charge panel (per slot)

| Case | Content |
|---|---|
| Regular metal | `"Na has 1 valence electron → loses 1e⁻ → Na⁺"` |
| Non-metal | `"Cl has 7 valence electrons → gains 1e⁻ → Cl⁻"` |
| Polyatomic | `"OH⁻ is a polyatomic ion with a fixed charge of −1"` |
| Transition metal (pending) | Renders `TransitionMetalPicker` inline |
| Transition metal (picked) | `"Fe loses 3e⁻ → Fe³⁺"` |

### 4.3 Bonding summary

| `bondingType` | Text |
|---|---|
| `Ionic` | `"Crossover method: each charge value becomes the other ion's subscript → [formula preview]"` |
| `Covalent` | `"[A] shares [n] electrons with [B] to achieve a stable octet"` |
| `Metallic` | `"[A] and [B] contribute [n] + [m] valence electrons to a delocalised electron sea"` |

### 4.4 Apply button

- Disabled until both slots `IONIZED`.
- On click: dispatches `DISMISS_EXPLANATION`.

---

## 5. `DropZone` Changes

- Remove `DeductionPanel` render entirely.
- Add `×` icon button (top-right corner of card) when:
  - zone is filled (`zone !== null`)
  - `canvasPhase !== 'ANIMATING_CROSSOVER'`
- Click dispatches `REPLACE_ELEMENT` for that slot.
- No other structural changes.

---

## 6. `BridgeColumn` Changes

- Remove `READY_TO_CROSS` branch (no "Cross Over →" button).
- Remove `DEDUCING_CHARGE` branch.
- Add `EXPLAINING` branch → renders `ExplanationModal`.
- `ANIMATING_CROSSOVER`, `COMPLETE`, `SHOWING_COVALENT`, `SHOWING_METALLIC` branches unchanged.

---

## 7. Components Deleted

| Component | Reason |
|---|---|
| `RegularDeduction` | Interactive quiz replaced by auto-ionise |
| `DeductionPanel` | Wrapper for above |
| `PolyatomicConfirm` | Polyatomic now auto-ionised |

`TransitionMetalPicker` is **kept** — rendered inside `ExplanationModal`.

---

## 8. New Components

| Component | File | Purpose |
|---|---|---|
| `ExplanationModal` | `src/bridge/ExplanationModal.tsx` | Explanation + TM picker modal |
| `BondingLegend` | `src/tray/BondingLegend.tsx` | Color-coded bonding type legend |

---

## 9. Test Coverage

| Test | File |
|---|---|
| `REPLACE_ELEMENT` resets both slots correctly | `reducer.test.ts` |
| `DISMISS_EXPLANATION` routes to correct phase per bonding type | `reducer.test.ts` |
| Auto-ionise on second drop (regular, polyatomic) | `reducer.test.ts` |
| TM slot stays `DEDUCING` until `PICK_TM_CHARGE` | `reducer.test.ts` |
| Apply button disabled while TM slot `DEDUCING` | `ExplanationModal.test.tsx` |
| Tray coloring: metal slotA → NonMetal token gets ionic hint | `ElementTray.test.tsx` |
| Noble gas always incompatible | `ElementTray.test.tsx` |

---

## 10. `CanvasState` Cleanup

`activeDeductionSlot: Slot | null` is no longer used (deduction is gone). Remove the field from `CanvasState` and all reducer branches that set it.

---

## 11. Out of Scope

- Multiple oxidation states for non-transition metals.
- Allowing user to override auto-determined bonding type.
- Saving / exporting compound history.
