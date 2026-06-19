# Mobile Responsive + Touch Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add tap-to-select touch interaction and responsive mobile layout so the app is usable on iOS/Android phones without breaking existing mouse drag-and-drop.

**Architecture:** Selection state (`selectedElement`) lives as `useState` in `IonicCanvasProvider` and is exposed via the existing context. A document-level click listener clears selection when the user taps anywhere outside an element or drop zone. Responsive sizing is CSS-only via Tailwind breakpoint classes — no JS breakpoint detection needed. Drop zones stack vertically on mobile via Tailwind `flex-col md:flex-row`.

**Tech Stack:** React 18, Tailwind CSS v4 (with `md:` = 768px), `@dnd-kit/core` v6, Vitest + React Testing Library

## Global Constraints

- Coverage must stay ≥ 95% branch after each task (`npx vitest run --coverage --coverage.provider=istanbul`)
- No changes to `canvasReducer` or `CanvasAction` types
- Mouse drag-and-drop must work identically to before on desktop
- Tailwind breakpoint `md` = 768px (default)
- All `onClick` handlers on interactive elements must call `e.stopPropagation()` to prevent the document-level clear listener from firing

---

## File Map

| File | Change |
|------|--------|
| `src/canvas/IonicCanvasProvider.tsx` | Add `selectedElement` state + `selectElement` + `clearSelection` + document listener |
| `src/canvas/IonicCanvas.tsx` | Responsive drop zone row: `flex-col md:flex-row` |
| `src/tray/ElementToken.tsx` | `isSelected` ring, `onClick` tap handler, responsive `md:` sizing classes |
| `src/tray/ElementTray.tsx` | Hide period labels on mobile (`hidden md:flex`) |
| `src/zones/DropZone.tsx` | `onClick` tap-to-place, pulse border when selection active |

---

### Task 1: Extend IonicCanvasContext with selection state

**Files:**
- Modify: `src/canvas/IonicCanvasProvider.tsx`
- Test: `src/canvas/__tests__/IonicCanvasProvider.test.tsx` (create new)

**Interfaces:**
- Produces:
  - `selectedElement: ZoneState | null` — on `useIonicCanvas()` return value
  - `selectElement(z: ZoneState): void` — on `useIonicCanvas()` return value
  - `clearSelection(): void` — on `useIonicCanvas()` return value

- [ ] **Step 1: Create the test file**

```tsx
// src/canvas/__tests__/IonicCanvasProvider.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IonicCanvasProvider } from '../IonicCanvasProvider';
import { useIonicCanvas } from '../hooks';
import type { ZoneState } from '../types';

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};
const clZone: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

function TestConsumer() {
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
  return (
    <>
      <div data-testid="selected">{selectedElement?.symbol ?? 'none'}</div>
      <button onClick={(e) => { e.stopPropagation(); selectElement(mgZone); }}>select Mg</button>
      <button onClick={(e) => { e.stopPropagation(); selectElement(clZone); }}>select Cl</button>
      <button onClick={(e) => { e.stopPropagation(); clearSelection(); }}>clear</button>
    </>
  );
}

describe('IonicCanvasProvider selection', () => {
  it('selectedElement starts null', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });

  it('selectElement sets selectedElement', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    expect(screen.getByTestId('selected')).toHaveTextContent('Mg');
  });

  it('selectElement replaces previous selection', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(screen.getByText('select Cl'));
    expect(screen.getByTestId('selected')).toHaveTextContent('Cl');
  });

  it('clearSelection resets to null', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });

  it('document click clears selection', () => {
    render(<IonicCanvasProvider><TestConsumer /></IonicCanvasProvider>);
    fireEvent.click(screen.getByText('select Mg'));
    fireEvent.click(document.body);
    expect(screen.getByTestId('selected')).toHaveTextContent('none');
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/canvas/__tests__/IonicCanvasProvider.test.tsx
```

Expected: FAIL — `selectedElement is not a function` or property missing from context.

- [ ] **Step 3: Update IonicCanvasProvider**

```tsx
// src/canvas/IonicCanvasProvider.tsx
import { createContext, useReducer, useState, useEffect, useCallback, type ReactNode } from 'react';
import { canvasReducer } from './reducer';
import { INITIAL_STATE } from './constants';
import type { CanvasState, CanvasAction, ZoneState } from './types';

interface CanvasContextValue {
  state:           CanvasState;
  dispatch:        React.Dispatch<CanvasAction>;
  selectedElement: ZoneState | null;
  selectElement:   (z: ZoneState) => void;
  clearSelection:  () => void;
}

export const IonicCanvasContext = createContext<CanvasContextValue | null>(null);

export function IonicCanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, INITIAL_STATE);
  const [selectedElement, setSelectedElement] = useState<ZoneState | null>(null);

  const selectElement  = useCallback((z: ZoneState) => setSelectedElement(z), []);
  const clearSelection = useCallback(() => setSelectedElement(null), []);

  useEffect(() => {
    document.addEventListener('click', clearSelection);
    return () => document.removeEventListener('click', clearSelection);
  }, [clearSelection]);

  return (
    <IonicCanvasContext.Provider value={{ state, dispatch, selectedElement, selectElement, clearSelection }}>
      {children}
    </IonicCanvasContext.Provider>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/canvas/__tests__/IonicCanvasProvider.test.tsx
```

Expected: 5 tests pass.

- [ ] **Step 5: Run full suite to verify no regressions**

```bash
npx vitest run --coverage --coverage.provider=istanbul
```

Expected: all tests pass, branch coverage ≥ 95%.

- [ ] **Step 6: Commit**

```bash
git add src/canvas/IonicCanvasProvider.tsx src/canvas/__tests__/IonicCanvasProvider.test.tsx
git commit -m "feat: add selection state to IonicCanvasContext with document clear handler"
```

---

### Task 2: Tap-to-select on ElementToken

**Files:**
- Modify: `src/tray/ElementToken.tsx`
- Test: `src/tray/__tests__/ElementToken.test.tsx` (create new)

**Interfaces:**
- Consumes:
  - `useIonicCanvas()` → `{ selectedElement, selectElement, clearSelection }`
  - `ZoneState` from `../canvas/types`
- Produces:
  - `ElementToken` renders `ring-2 ring-white/80` when `selectedElement?.symbol === element.symbol`
  - `ElementToken` `onClick`: calls `clearSelection()` if same symbol, else `selectElement(zoneState)`

- [ ] **Step 1: Create the test file**

```tsx
// src/tray/__tests__/ElementToken.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElementToken } from '../ElementToken';
import type { WasmElement } from '@periodic-table';

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: { role: 'button' },
    listeners:  {},
    setNodeRef:  () => {},
    isDragging:  false,
  }),
}));

vi.mock('@mui/material/Tooltip', () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../canvas/hooks', () => ({
  useIonicCanvas: vi.fn(),
}));

import { useIonicCanvas } from '../../canvas/hooks';

const mockSelectElement  = vi.fn();
const mockClearSelection = vi.fn();

const mgEl: WasmElement = {
  symbol: 'Mg', name: 'Magnesium', atomic_number: 12, mass_number: 24,
  period: 3, group: 2, block: 's', category: 'AlkalineEarthMetal',
  class: 'Metal', electron_configuration: '[Ne] 3s2',
  oxidation_states: [2], valence_electrons: 2,
};

function mockCtx(selectedSymbol: string | null) {
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: { canvasPhase: 'SELECTING', slotA: null, slotB: null, bondingType: null },
    dispatch: vi.fn(),
    selectedElement: selectedSymbol
      ? { symbol: selectedSymbol, elementClass: 'Metal', isPolyatomic: false, isTransition: false,
          valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL' }
      : null,
    selectElement:  mockSelectElement,
    clearSelection: mockClearSelection,
  });
}

describe('ElementToken tap interaction', () => {
  beforeEach(() => {
    mockSelectElement.mockClear();
    mockClearSelection.mockClear();
  });

  it('calls selectElement when tapped and nothing selected', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: 'Mg' })
    );
  });

  it('calls clearSelection when tapping already-selected element', () => {
    mockCtx('Mg');
    render(<ElementToken element={mgEl} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockClearSelection).toHaveBeenCalled();
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('calls selectElement when tapping different element while another selected', () => {
    mockCtx('Cl');
    render(<ElementToken element={mgEl} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: 'Mg' })
    );
  });

  it('does not call selectElement when disabled', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} disabled />);
    fireEvent.click(document.body); // disabled has pointer-events-none, click body instead
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('renders ring class when element is selected', () => {
    mockCtx('Mg');
    const { container } = render(<ElementToken element={mgEl} />);
    expect(container.firstChild).toHaveClass('ring-2');
  });

  it('does not render ring class when not selected', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} />);
    expect(container.firstChild).not.toHaveClass('ring-2');
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/tray/__tests__/ElementToken.test.tsx
```

Expected: FAIL — ring class missing, selectElement not called.

- [ ] **Step 3: Update ElementToken**

Replace the `export function ElementToken(...)` implementation with:

```tsx
export function ElementToken({ element, disabled = false, size = 'md', bondHint }: Props) {
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `element-${element.symbol}`,
    data: { zoneState: makeZoneState(element) },
    disabled: disabled || bondHint === 'none',
  });

  const color = elementClassColor(element.class);
  const isSm = size === 'sm';
  const bgColor = bondHint && bondHint !== 'none' ? HINT_BG[bondHint] : undefined;
  const isSelected = selectedElement?.symbol === element.symbol;
  const isInactive = disabled || bondHint === 'none';

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isInactive) return;
    if (isSelected) {
      clearSelection();
    } else {
      selectElement(makeZoneState(element));
    }
  }

  return (
    <Tooltip title={<ElementTooltip element={element} />} placement="bottom" arrow enterDelay={300}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={[
          'group flex flex-col items-center justify-center',
          // responsive sizing: xs on mobile, sm on md+
          isSm
            ? 'w-8 h-8 md:w-14 md:h-14 rounded-md border cursor-grab select-none'
            : 'w-16 h-16 rounded-lg border cursor-grab select-none',
          'bg-surface transition-all duration-150',
          'hover:scale-110 hover:z-10',
          isDragging  ? 'opacity-30 scale-95' : 'opacity-100',
          isInactive  ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
          isSelected  ? 'ring-2 ring-white/80' : '',
          !isSelected && selectedElement ? 'opacity-50' : '',
        ].join(' ')}
        style={{
          borderColor: color + '55',
          backgroundColor: bgColor,
        }}
        onMouseEnter={e => { if (!isInactive) (e.currentTarget as HTMLDivElement).style.borderColor = color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color + '55'; }}
      >
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-end leading-none mr-0.5">
            <span className={`${isSm ? 'hidden md:block text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.mass_number}</span>
            <span className={`${isSm ? 'hidden md:block text-[7px] group-hover:text-[9px]' : 'text-[9px] group-hover:text-[11px]'} text-white/65 group-hover:text-white transition-all duration-150`}>{element.atomic_number}</span>
          </div>
          <span className={`${isSm ? 'text-[10px] md:text-sm' : 'text-xl'} font-bold leading-none transition-all duration-150`} style={{ color }}>{element.symbol}</span>
        </div>
      </div>
    </Tooltip>
  );
}
```

Also update `PolyatomicToken` to add `onClick` tap handler:

```tsx
export function PolyatomicToken({ ion, disabled = false }: PolyTokenProps) {
  const { selectedElement, selectElement, clearSelection } = useIonicCanvas();
  const zoneState: ZoneState = {
    symbol:           ion.symbol,
    elementClass:     'NonMetal',
    isPolyatomic:     true,
    isTransition:     false,
    valenceElectrons: 0,
    oxidationStates:  [ion.charge],
    derivedCharge:    null,
    wrongCount:       0,
    status:           'NEUTRAL',
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `poly-${ion.symbol}`,
    data: { zoneState },
    disabled,
  });

  const isSelected = selectedElement?.symbol === ion.symbol;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    if (isSelected) {
      clearSelection();
    } else {
      selectElement(zoneState);
    }
  }

  return (
    <Tooltip title={ion.name} placement="bottom" arrow enterDelay={300}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={[
          'flex flex-col items-center justify-center',
          'px-3 h-16 rounded-lg border cursor-grab select-none',
          'border-anion/40 bg-surface hover:border-anion',
          'transition-all duration-150',
          isDragging ? 'opacity-30' : 'opacity-100',
          disabled    ? 'opacity-20 cursor-not-allowed pointer-events-none' : '',
          isSelected  ? 'ring-2 ring-white/80' : '',
        ].join(' ')}
      >
        <span className="text-base font-bold text-white">{ion.formula}</span>
      </div>
    </Tooltip>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/tray/__tests__/ElementToken.test.tsx
```

Expected: 6 tests pass.

- [ ] **Step 5: Run full suite**

```bash
npx vitest run --coverage --coverage.provider=istanbul
```

Expected: all tests pass, branch coverage ≥ 95%.

- [ ] **Step 6: Commit**

```bash
git add src/tray/ElementToken.tsx src/tray/__tests__/ElementToken.test.tsx
git commit -m "feat: add tap-to-select and responsive sizing to ElementToken"
```

---

### Task 3: Tap-to-place on DropZone

**Files:**
- Modify: `src/zones/DropZone.tsx`
- Test: `src/zones/__tests__/DropZone.test.tsx` (create new)

**Interfaces:**
- Consumes:
  - `useIonicCanvas()` → `{ state, dispatch, selectedElement, clearSelection }`
- Produces:
  - `DropZone` `onClick`: dispatches `{ type: 'DROP_ELEMENT', slot, zone: selectedElement }` + `clearSelection()` when `selectedElement !== null` and not `dropDisabled`
  - `DropZone` renders `animate-pulse` border when `selectedElement !== null` and zone is empty

- [ ] **Step 1: Create the test file**

```tsx
// src/zones/__tests__/DropZone.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropZone } from '../DropZone';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...rest }: any) => <div {...rest}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
}));

vi.mock('../../canvas/hooks', () => ({
  useIonicCanvas: vi.fn(),
}));

import { useIonicCanvas } from '../../canvas/hooks';
import { INITIAL_STATE } from '../../canvas/constants';
import type { ZoneState } from '../../canvas/types';

const mockDispatch      = vi.fn();
const mockClearSelection = vi.fn();

const mgZone: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

function mockCtx(selectedElement: ZoneState | null, overrides = {}) {
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: { ...INITIAL_STATE, ...overrides },
    dispatch: mockDispatch,
    selectedElement,
    selectElement: vi.fn(),
    clearSelection: mockClearSelection,
  });
}

describe('DropZone tap-to-place', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockClearSelection.mockClear();
  });

  it('dispatches DROP_ELEMENT and clears selection when tapped with selectedElement', () => {
    mockCtx(mgZone);
    render(<DropZone slot="A" />);
    fireEvent.click(screen.getByText(/Drop element here/));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DROP_ELEMENT', slot: 'A', zone: mgZone,
    });
    expect(mockClearSelection).toHaveBeenCalled();
  });

  it('does not dispatch when no selectedElement', () => {
    mockCtx(null);
    render(<DropZone slot="A" />);
    fireEvent.click(screen.getByText(/Drop element here/));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch when dropDisabled (ANIMATING_CROSSOVER)', () => {
    mockCtx(mgZone, { canvasPhase: 'ANIMATING_CROSSOVER' });
    render(<DropZone slot="A" />);
    fireEvent.click(document.body);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/zones/__tests__/DropZone.test.tsx
```

Expected: FAIL — DROP_ELEMENT not dispatched on click.

- [ ] **Step 3: Update DropZone**

```tsx
// src/zones/DropZone.tsx
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useIonicCanvas } from '../canvas/hooks';
import type { Slot } from '../canvas/types';

const SUPERSCRIPTS: Record<number, string> = {
  1:'¹', 2:'²', 3:'³', 4:'⁴', 5:'⁵', 6:'⁶', 7:'⁷',
};

function formatIon(symbol: string, charge: number): string {
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  const sup = abs === 1 ? sign : `${SUPERSCRIPTS[abs] ?? abs}${sign}`;
  return `${symbol}${sup}`;
}

interface Props {
  slot: Slot;
}

const SLOT_COLORS: Record<Slot, { border: string; glow: string; label: string; text: string }> = {
  A: { border: 'border-cation/40', glow: 'border-cation shadow-cation/20', label: 'text-cation/80', text: 'text-cation' },
  B: { border: 'border-anion/40',  glow: 'border-anion shadow-anion/20',   label: 'text-anion/80',  text: 'text-anion'  },
};

export function DropZone({ slot }: Props) {
  const { state, dispatch, selectedElement, clearSelection } = useIonicCanvas();
  const zone = slot === 'A' ? state.slotA : state.slotB;
  const { canvasPhase } = state;

  const dropDisabled = canvasPhase === 'ANIMATING_CROSSOVER' || canvasPhase === 'EXPLAINING';
  const showReplace  = zone !== null && canvasPhase !== 'ANIMATING_CROSSOVER';

  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${slot}`,
    disabled: dropDisabled,
  });

  const colors = SLOT_COLORS[slot];
  const hasPendingSelection = selectedElement !== null && !dropDisabled;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!selectedElement || dropDisabled) return;
    dispatch({ type: 'DROP_ELEMENT', slot, zone: selectedElement });
    clearSelection();
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={[
        'relative w-full rounded-xl border-2 min-h-32 transition-all duration-200',
        isOver
          ? `${colors.glow} shadow-lg`
          : hasPendingSelection
            ? `${colors.glow} animate-pulse cursor-pointer`
            : colors.border,
      ].join(' ')}
    >
      {showReplace && (
        <button
          onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REPLACE_ELEMENT', slot }); }}
          aria-label={`Replace ${slot === 'A' ? 'left' : 'right'} element`}
          className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/30 text-white/40 hover:text-red-400 text-xs flex items-center justify-center transition-colors"
        >
          ×
        </button>
      )}

      <AnimatePresence mode="wait">
        {!zone && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center py-4 ${colors.label} text-sm`}
          >
            {hasPendingSelection ? `Tap to place ${selectedElement.symbol} here` : 'Drop element here'}
          </motion.div>
        )}

        {zone && zone.status !== 'IONIZED' && (
          <motion.div
            key="filled"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={`text-center py-3 text-2xl font-bold ${colors.text}`}>
              {zone.symbol}
            </div>
          </motion.div>
        )}

        {zone && zone.status === 'IONIZED' && zone.derivedCharge !== null && (
          <motion.div
            key="ionized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center justify-center py-4 text-3xl font-bold ${colors.text}`}
          >
            {formatIon(zone.symbol, zone.derivedCharge)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npx vitest run src/zones/__tests__/DropZone.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Run full suite**

```bash
npx vitest run --coverage --coverage.provider=istanbul
```

Expected: all tests pass, branch coverage ≥ 95%.

- [ ] **Step 6: Commit**

```bash
git add src/zones/DropZone.tsx src/zones/__tests__/DropZone.test.tsx
git commit -m "feat: add tap-to-place and selection pulse to DropZone"
```

---

### Task 4: Responsive layout — ElementTray + IonicCanvas

**Files:**
- Modify: `src/tray/ElementTray.tsx`
- Modify: `src/canvas/IonicCanvas.tsx`

**Interfaces:**
- No new interfaces. Pure CSS/Tailwind changes. No new tests needed (layout not testable in jsdom).

- [ ] **Step 1: Update ElementTray — hide period labels on mobile**

In `src/tray/ElementTray.tsx`, find the period label div and add `hidden md:flex`:

```tsx
// Before:
<div
  className={[
    'flex items-center justify-center text-[9px] font-semibold cursor-default transition-colors duration-150 w-4',
    hoveredPeriod === p ? 'text-white/80' : 'text-white/30',
  ].join(' ')}
>

// After:
<div
  className={[
    'hidden md:flex items-center justify-center text-[9px] font-semibold cursor-default transition-colors duration-150 w-4',
    hoveredPeriod === p ? 'text-white/80' : 'text-white/30',
  ].join(' ')}
>
```

Also reduce the `mr-1` spacer div on mobile — wrap it in `hidden md:block`:

```tsx
// Before:
<div style={{ display: 'grid', gridTemplateRows: PERIOD_ROWS, gap: '2px' }} className="mr-1">

// After:
<div style={{ display: 'grid', gridTemplateRows: PERIOD_ROWS, gap: '2px' }} className="mr-0 md:mr-1 hidden md:grid">
```

- [ ] **Step 2: Update IonicCanvas — stack drop zones on mobile**

In `src/canvas/IonicCanvas.tsx`, change the drop zone row from `flex` (row) to `flex-col md:flex-row`:

```tsx
// Before:
<div className="flex items-start overflow-y-auto justify-center">
  <div className="flex w-full max-w-5xl">
    <div className="w-1/3 px-3">
      <DropZone slot="A" />
    </div>
    <div className="w-1/3 px-3">
      <BridgeColumn />
    </div>
    <div className="w-1/3 px-3">
      <DropZone slot="B" />
    </div>
  </div>
</div>

// After:
<div className="flex items-start overflow-y-auto justify-center">
  <div className="flex flex-col md:flex-row w-full max-w-5xl">
    <div className="w-full md:w-1/3 px-3 mb-2 md:mb-0">
      <DropZone slot="A" />
    </div>
    <div className="w-full md:w-1/3 px-3 order-last md:order-none">
      <BridgeColumn />
    </div>
    <div className="w-full md:w-1/3 px-3 mb-2 md:mb-0">
      <DropZone slot="B" />
    </div>
  </div>
</div>
```

- [ ] **Step 3: Adjust tray height on mobile**

In `src/canvas/IonicCanvas.tsx`, change the tray height div:

```tsx
// Before:
<div style={{ height: '38.2vh' }} className="shrink-0">

// After:
<div className="shrink-0 h-[45vh] md:h-[38.2vh]">
```

- [ ] **Step 4: Run full suite**

```bash
npx vitest run --coverage --coverage.provider=istanbul
```

Expected: all tests pass, branch coverage ≥ 95%.

- [ ] **Step 5: Manual verification on mobile viewport**

Open browser DevTools → device simulation → iPhone SE (375×667):
- Period labels hidden ✓
- Element tokens visibly smaller ✓
- Drop zones stacked vertically ✓
- Tap element → ring appears, drop zones pulse ✓
- Tap drop zone → element placed ✓
- Tap elsewhere → selection cleared ✓

On desktop (1280px):
- Drag-and-drop still works ✓
- Tokens back to 3.5rem ✓
- Drop zones side-by-side ✓

- [ ] **Step 6: Commit**

```bash
git add src/tray/ElementTray.tsx src/canvas/IonicCanvas.tsx
git commit -m "feat: responsive mobile layout — stack drop zones, hide period labels on small screens"
```

---

## Self-Review

**Spec coverage:**
- ✅ Tap-to-select state machine — Tasks 1, 2, 3
- ✅ `selectedElement` in context — Task 1
- ✅ Document-level clear on outside tap — Task 1
- ✅ Ring visual on selected element — Task 2
- ✅ Dimmed unselected when another active — Task 2
- ✅ Pulse border on drop zones when selection active — Task 3
- ✅ "Tap to place X here" label hint — Task 3
- ✅ Responsive token sizing (2rem mobile, 3.5rem desktop) — Task 2
- ✅ Period labels hidden on mobile — Task 4
- ✅ Drop zones stacked vertically on mobile — Task 4
- ✅ Mouse DnD unchanged — no sensor changes in any task

**Type consistency check:**
- `clearSelection` named consistently Tasks 1→2→3 ✓
- `selectElement(z: ZoneState)` signature consistent Tasks 1→2 ✓
- `selectedElement: ZoneState | null` consistent Tasks 1→2→3 ✓
- `DROP_ELEMENT` action shape matches `CanvasAction` type in `types.ts` ✓
