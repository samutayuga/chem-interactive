# Mobile Responsive + Touch Interaction Design

**Date:** 2026-06-19  
**Status:** Approved

---

## Problem

The app uses HTML5 drag-and-drop (`@dnd-kit/core` with no custom sensors) which does not
work on iOS touch screens. The periodic table tray is also 63rem wide — unusable on phone.

---

## Goals

1. Touch users (iOS/Android phone) can place elements without dragging
2. Mouse users (desktop/tablet) experience zero change
3. Phone layout fits the screen without horizontal overflow

---

## Breakpoints

| Width     | Name    | Token size | Interaction      | Drop zone layout  |
|-----------|---------|------------|------------------|-------------------|
| ≥ 768px   | desktop | 3.5rem sm  | drag-and-drop    | side-by-side      |
| < 768px   | mobile  | 2rem xs    | tap-to-select    | stacked vertically|

---

## Interaction Model: Tap-to-Select

### State machine

```
IDLE
  → tap element          → SELECTED (element highlighted)

SELECTED
  → tap same element     → IDLE (deselect)
  → tap diff element     → SELECTED (switch selection)
  → tap drop zone        → dispatch DROP_ELEMENT + IDLE
  → tap elsewhere        → IDLE (deselect via document-level click handler in IonicCanvasProvider)
```

### Visual feedback

- **Selected element:** white ring `ring-2 ring-white/80`
- **Drop zones (when selection active):** pulsing border `animate-pulse`
- **Unselected elements:** dimmed `opacity-60` when another is selected

---

## Architecture

### 1. Selection state — `IonicCanvasProvider`

Add to `CanvasContextValue`:

```ts
selectedElement: ZoneState | null;
selectElement: (z: ZoneState) => void;
clearSelection: () => void;
```

Implemented via `useState<ZoneState | null>` inside `IonicCanvasProvider` — ephemeral UI
state, not part of the reducer.

### 2. `ElementToken` changes

- Add `isSelected?: boolean` prop → renders white ring when true
- Add `onClick` handler:
  - if `bondHint === 'none'` or `disabled` → no-op
  - if same as `selectedElement` → `clearSelection()`
  - else → `selectElement(zoneState)`
- Add `xs` size variant (2rem × 2rem, text-xs symbol)
- `size` prop driven by parent (`ElementTray` passes `xs` on mobile)

### 3. `ElementTray` changes

- Token sizing is CSS-only via Tailwind responsive classes inside `ElementToken` — no JS
  breakpoint hook needed, no `size` prop change required
- Token dimensions: `w-8 h-8` (2rem) on mobile, `w-14 h-14` (3.5rem) on `md:`
- Token symbol font: `text-xs` on mobile, `text-sm` on `md:`
- Token grid gap: `2px` → `1px` on mobile (`gap-px md:gap-0.5`)
- Tray height: `38.2vh` → `45vh` on mobile
- Period labels: `hidden md:flex`
- Group label tooltips: disabled on mobile (no hover on touch) via `disableFocusListener disableHoverListener disableTouchListener` on `<Tooltip>`

### 4. `DropZone` changes

- Add `onClick` handler:
  - if `selectedElement !== null` AND not `dropDisabled` → `dispatch DROP_ELEMENT` + `clearSelection()`
- Add `animate-pulse` border class when `selectedElement !== null` AND zone is empty

### 5. `IonicCanvas` layout changes

- Drop zone row: `flex-row` → `flex-col` on mobile
- Tray height allocation: adjust for mobile viewport
- Slot A above BridgeColumn above Slot B on mobile

---

## Files Changed

| File | Change |
|------|--------|
| `src/canvas/IonicCanvasProvider.tsx` | Add selection state + context fields |
| `src/canvas/IonicCanvas.tsx` | Responsive drop zone layout (flex-col on mobile) |
| `src/tray/ElementToken.tsx` | `xs` size, `isSelected` ring, `onClick` tap handler |
| `src/tray/ElementTray.tsx` | Responsive token size, hide period labels on mobile |
| `src/zones/DropZone.tsx` | `onClick` tap-to-place, pulse border on selection |

No new files. No reducer changes. No dnd-kit sensor changes.

---

## What Does NOT Change

- `MouseSensor` / drag behavior — untouched
- Reducer and `CanvasAction` types — untouched
- Desktop layout — untouched below `md` breakpoint
- Existing tests — no behavioral change on desktop path

---

## Testing

- Desktop: existing drag-and-drop tests pass unchanged
- Mobile (manual): tap element → ring appears → tap zone → element placed
- Mobile (manual): tap another element → selection switches
- Mobile (manual): tap same element → deselects
- Mobile (manual): tap outside → deselects
- Responsive: layout at 375px (iPhone SE) and 390px (iPhone 14) shows stacked zones
