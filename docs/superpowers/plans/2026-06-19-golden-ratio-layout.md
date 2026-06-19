# Golden Ratio + Rule of Thirds Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply golden ratio vertical split (38.2% tray / 61.8% workspace) and rule-of-thirds horizontal columns (33.3% each) to the chem-interactive canvas layout.

**Architecture:** Pure CSS/className changes across three files. No logic, state, or animation changes. IonicCanvas controls proportions via fixed vh heights; DropZone and BridgeColumn fill their parent column width. The drag-resize handle is removed — proportions are intentional and fixed.

**Tech Stack:** React 19, Tailwind CSS v4, Framer Motion (unchanged)

## Global Constraints

- Do not modify state machine, reducer, or any action types
- Do not modify drag-and-drop logic
- Do not modify bonding logic, animations, or bridge views
- Do not change element token sizes or the periodic table grid inside ElementTray
- Tailwind CSS v4 — arbitrary value syntax `h-[61.8vh]` and `pt-[20.6vh]` is valid

---

### Task 1: Remove resize handle, apply golden ratio heights in IonicCanvas

**Files:**
- Modify: `src/canvas/IonicCanvas.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: tray fixed at `38.2vh`, workspace `h-[61.8vh] pt-[20.6vh]`, three children each `w-1/3`

- [ ] **Step 1: Replace IonicCanvas.tsx with the new implementation**

Open `src/canvas/IonicCanvas.tsx` and replace the entire file content with:

```tsx
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useIonicCanvas } from './hooks';
import { ElementTray } from '../tray/ElementTray';
import { DropZone } from '../zones/DropZone';
import { BridgeColumn } from '../bridge/BridgeColumn';
import type { ZoneState, Slot } from './types';

export function IonicCanvas() {
  const { state, dispatch } = useIonicCanvas();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith('dropzone-')) return;

    const slot = overId.replace('dropzone-', '') as Slot;
    const zoneState = active.data.current?.zoneState as ZoneState | undefined;
    if (!zoneState) return;

    if (state.canvasPhase === 'ANIMATING_CROSSOVER') return;

    dispatch({ type: 'DROP_ELEMENT', slot, zone: zoneState });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">

        <div style={{ height: '38.2vh' }} className="shrink-0">
          <ElementTray />
        </div>

        <div className="flex h-[61.8vh] pt-[20.6vh] items-start overflow-y-auto">
          <div className="w-1/3 px-3">
            <DropZone slot="A" />
          </div>
          <div className="w-1/3 px-2">
            <BridgeColumn />
          </div>
          <div className="w-1/3 px-3">
            <DropZone slot="B" />
          </div>
        </div>

      </div>
    </DndContext>
  );
}
```

- [ ] **Step 2: Run existing tests to verify no regressions**

```bash
npm test -- --run
```

Expected: all existing tests pass (CrossoverAnimator, ExplanationModal, TransitionMetalPicker tests are unaffected by layout changes).

- [ ] **Step 3: Commit**

```bash
git add src/canvas/IonicCanvas.tsx
git commit -m "feat: apply golden ratio height split and remove resize handle"
```

---

### Task 2: Remove fixed width from DropZone, increase min-height

**Files:**
- Modify: `src/zones/DropZone.tsx:44-47`

**Interfaces:**
- Consumes: parent column is `w-1/3` with `px-3` padding (from Task 1)
- Produces: DropZone fills full column width, taller drop target

- [ ] **Step 1: Update the outer div className in DropZone**

In `src/zones/DropZone.tsx`, find the outer `<div ref={setNodeRef}` and change its `className`:

Old:
```tsx
<div
  ref={setNodeRef}
  className={[
    'relative w-72 rounded-xl border-2 min-h-16 transition-all duration-200',
    isOver ? `${colors.glow} shadow-lg` : colors.border,
  ].join(' ')}
>
```

New:
```tsx
<div
  ref={setNodeRef}
  className={[
    'relative w-full rounded-xl border-2 min-h-32 transition-all duration-200',
    isOver ? `${colors.glow} shadow-lg` : colors.border,
  ].join(' ')}
>
```

- [ ] **Step 2: Run existing tests**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/zones/DropZone.tsx
git commit -m "feat: drop zone fills column width, taller min-height"
```

---

### Task 3: Remove fixed width from BridgeColumn

**Files:**
- Modify: `src/bridge/BridgeColumn.tsx:60`

**Interfaces:**
- Consumes: parent column is `w-1/3` with `px-2` padding (from Task 1)
- Produces: BridgeColumn fills full column width, content top-aligned

- [ ] **Step 1: Update the outer div className in BridgeColumn**

In `src/bridge/BridgeColumn.tsx`, find the outer `<div` of the return statement (line 60) and change its `className`:

Old:
```tsx
<div className="flex flex-col items-center justify-center gap-4 px-2 min-w-52">
```

New:
```tsx
<div className="w-full flex flex-col items-center justify-start gap-4">
```

- [ ] **Step 2: Run existing tests**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 3: Visual verification**

```bash
npm run dev
```

Open `http://localhost:5173` and confirm:
- Periodic table fills the top 38.2% of the viewport with no resize handle
- Drop zones and bridge column appear at the upper-third focal line (~59vh from top)
- Three columns are equal width
- Drop zone borders span their column width (not a fixed 288px box)
- Drag an element into slot A — bond hints appear on tray correctly
- Drag a second element — explanation modal appears, bond result displays in bridge column
- Reset works

- [ ] **Step 4: Commit**

```bash
git add src/bridge/BridgeColumn.tsx
git commit -m "feat: bridge column fills column width, top-aligned content"
```
