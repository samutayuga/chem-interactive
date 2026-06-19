# Layout Redesign — Golden Ratio + Rule of Thirds

**Date:** 2026-06-19  
**Status:** Approved

## Goal

Apply the golden ratio (φ ≈ 1.618) and rule of thirds to the spatial layout of `chem-interactive` — improving visual hierarchy and focal point alignment without changing any functionality, state machine, or interaction logic.

## Principles Applied

| Principle | Where applied |
|-----------|--------------|
| Golden Ratio (38.2% / 61.8%) | Vertical split between ElementTray and workspace |
| Rule of Thirds (33.3% / 33.3% / 33.3%) | Horizontal columns within workspace |
| Rule of Thirds upper-third focal line | Vertical content placement within workspace |

## Layout Specification

### Vertical split

```
┌──────────────────────────────────────────────────────┐ ← 0vh
│                                                      │
│                  ElementTray                         │ 38.2vh
│                                                      │
├──────────────────────────────────────────────────────┤ ← golden cut (38.2vh)
│                  ↕ 20.6vh padding                    │
│                  (upper-third of workspace)          │
├────────────────┬─────────────────┬───────────────────┤ ← focal line (59.4vh)
│   DropZone A  │  BridgeColumn   │   DropZone B      │
│    33.3vw     │    33.3vw       │    33.3vw         │ 61.8vh total
└───────────────┴─────────────────┴───────────────────┘ ← 100vh
```

- `20.6vh` = one-third of `61.8vh` workspace height
- Focal line sits at `38.2 + 20.6 = 58.8vh` from top — the upper-third intersection point

### Horizontal columns

Three equal columns inside the workspace, each `w-1/3` of viewport width. No gaps between columns (padding inside each column handles spacing).

## File Changes

### `src/canvas/IonicCanvas.tsx`

**Remove:**
- `trayHeight` useState
- `dragRef` useRef
- `onHandleMouseDown` handler
- Drag handle `<div>` (the `h-2 cursor-row-resize` element)
- `window.addEventListener` calls for mousemove / mouseup

**Change:**
- Tray container: `style={{ height: '38.2vh' }}` (was `style={{ height: trayHeight }}`)
- Workspace container: `className="flex h-[61.8vh] pt-[20.6vh] items-start overflow-y-auto"`
  - Remove `flex-1`, `gap-3`, `p-4`
  - Add fixed height `h-[61.8vh]`, top padding `pt-[20.6vh]`, keep `items-start`

### `src/zones/DropZone.tsx`

**Change:**
- Remove `w-72` → replace with `w-full` (fills its `w-1/3` parent column)
- Change `min-h-16` → `min-h-32` (more vertical breathing room at focal point)

### `src/bridge/BridgeColumn.tsx`

**Change:**
- Remove `min-w-52 px-2` from outer div
- Replace with `w-full flex flex-col items-center justify-start`

### `src/tray/ElementTray.tsx`

No structural change. Height is controlled by parent (`38.2vh`). Existing `w-full h-full flex flex-col` already adapts correctly.

## What Does Not Change

- State machine (`IonicCanvasProvider`, reducer, all actions)
- Drag-and-drop logic (`DndContext`, `useDroppable`, `useDraggable`)
- Bond detection, charge resolution, formula calculation
- Animations (`Framer Motion`)
- All bridge views (`CrossoverAnimator`, `BondingDiagram`, `CovalentView`, `MetallicView`)
- `ExplanationModal`, `TransitionMetalPicker`
- Periodic table grid layout inside `ElementTray`
- Tailwind config, color tokens, CSS variables

## Out of Scope

- Typography scale
- Color palette
- Mobile / responsive breakpoints
- Element token size
