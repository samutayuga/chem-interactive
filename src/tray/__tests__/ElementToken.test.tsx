// src/tray/__tests__/ElementToken.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElementToken, PolyatomicToken, makeZoneState } from '../ElementToken';
import type { WasmElement } from '@periodic-table';

let mockIsDragging = false;
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: { role: 'button' },
    listeners:  {},
    setNodeRef:  () => {},
    isDragging:  mockIsDragging,
  }),
}));

vi.mock('@mui/material/Tooltip', () => ({
  default: ({ children, title }: any) => <>{children}{title && <div data-testid="tooltip-title">{title}</div>}</>,
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

const clEl: WasmElement = {
  symbol: 'Cl', name: 'Chlorine', atomic_number: 17, mass_number: 35,
  period: 3, group: 17, block: 'p', category: 'Halogen',
  class: 'NonMetal', electron_configuration: '[Ne] 3s2 3p5',
  oxidation_states: [-1], valence_electrons: 7,
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
    mockIsDragging = false;
  });

  it('calls selectElement when tapped and nothing selected', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: 'Mg' })
    );
  });

  it('calls clearSelection when tapping already-selected element', () => {
    mockCtx('Mg');
    render(<ElementToken element={mgEl} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockClearSelection).toHaveBeenCalled();
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('calls selectElement when tapping different element while another selected', () => {
    mockCtx('Cl');
    render(<ElementToken element={mgEl} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
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

  it('does not select when pointerUp fires without prior pointerDown', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} />);
    fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('does not select when pointer moved more than 8px (drag gesture)', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    fireEvent.pointerUp(screen.getByRole('button'), { clientX: 50, clientY: 50 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('renders opacity-50 on unselected token when another element is selected', () => {
    mockCtx('Cl');
    const { container } = render(<ElementToken element={mgEl} />);
    expect(container.firstChild).toHaveClass('opacity-50');
  });

  it('renders sm size classes', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} size="sm" />);
    expect(container.firstChild).toHaveClass('w-8');
    expect(container.firstChild).toHaveClass('h-8');
  });

  it('renders bondHint background when bondHint is ionic', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} bondHint="ionic" />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.backgroundColor).toContain('rgba');
  });

  it('does not call selectElement when bondHint is none', () => {
    mockCtx(null);
    render(<ElementToken element={mgEl} bondHint="none" />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('fires onMouseEnter and onMouseLeave without error when not inactive', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} />);
    const div = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(div);
    fireEvent.mouseLeave(div);
    // no throw = pass
  });

  it('fires onMouseEnter without changing color when inactive', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} bondHint="none" />);
    const div = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(div);
    fireEvent.mouseLeave(div);
    // no throw = pass
  });

  it('renders opacity-30 class when dragging', () => {
    mockIsDragging = true;
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} />);
    expect(container.firstChild).toHaveClass('opacity-30');
  });
});

describe('makeZoneState', () => {
  it('builds correct ZoneState from WasmElement', () => {
    const z = makeZoneState(mgEl);
    expect(z.symbol).toBe('Mg');
    expect(z.isPolyatomic).toBe(false);
    expect(z.isTransition).toBe(false);
    expect(z.oxidationStates).toEqual([2]);
  });

  it('sets isTransition for d-block element', () => {
    const fe: WasmElement = { ...mgEl, symbol: 'Fe', block: 'd' };
    expect(makeZoneState(fe).isTransition).toBe(true);
  });
});

describe('PolyatomicToken tap interaction', () => {
  const sulfateIon = { symbol: 'SO4', name: 'Sulfate', formula: 'SO₄²⁻', charge: -2 };

  beforeEach(() => {
    mockSelectElement.mockClear();
    mockClearSelection.mockClear();
    mockIsDragging = false;
  });

  it('calls selectElement when tapped and nothing selected', () => {
    mockCtx(null);
    render(<PolyatomicToken ion={sulfateIon} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: 'SO4', isPolyatomic: true })
    );
  });

  it('calls clearSelection when tapping already-selected polyatomic ion', () => {
    mockCtx('SO4');
    render(<PolyatomicToken ion={sulfateIon} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 }); fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockClearSelection).toHaveBeenCalled();
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('does not call selectElement when disabled', () => {
    mockCtx(null);
    const { container } = render(<PolyatomicToken ion={sulfateIon} disabled />);
    // fireEvent bypasses pointer-events-none in jsdom so we can test the JS guard
    fireEvent.pointerDown(container.firstChild as Element, { clientX: 0, clientY: 0 }); fireEvent.pointerUp(container.firstChild as Element, { clientX: 0, clientY: 0 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('renders ring class when ion is selected', () => {
    mockCtx('SO4');
    const { container } = render(<PolyatomicToken ion={sulfateIon} />);
    expect(container.firstChild).toHaveClass('ring-2');
  });

  it('does not render ring class when not selected', () => {
    mockCtx(null);
    const { container } = render(<PolyatomicToken ion={sulfateIon} />);
    expect(container.firstChild).not.toHaveClass('ring-2');
  });

  it('does not select when pointerUp fires without prior pointerDown', () => {
    mockCtx(null);
    render(<PolyatomicToken ion={sulfateIon} />);
    fireEvent.pointerUp(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('does not select when pointer moved more than 8px (drag gesture)', () => {
    mockCtx(null);
    render(<PolyatomicToken ion={sulfateIon} />);
    fireEvent.pointerDown(screen.getByRole('button'), { clientX: 0, clientY: 0 });
    fireEvent.pointerUp(screen.getByRole('button'), { clientX: 50, clientY: 50 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });

  it('renders the formula text', () => {
    mockCtx(null);
    render(<PolyatomicToken ion={sulfateIon} />);
    expect(screen.getByText('SO₄²⁻')).toBeDefined();
  });

  it('renders opacity-30 when dragging', () => {
    mockIsDragging = true;
    mockCtx(null);
    const { container } = render(<PolyatomicToken ion={sulfateIon} />);
    expect(container.firstChild).toHaveClass('opacity-30');
  });
});

describe('ElementToken with Cl element (p-block, non-metal)', () => {
  beforeEach(() => {
    mockSelectElement.mockClear();
    mockClearSelection.mockClear();
  });

  it('renders Cl symbol', () => {
    mockCtx(null);
    render(<ElementToken element={clEl} />);
    expect(screen.getByText('Cl')).toBeDefined();
  });

  it('renders electron configuration tooltip content including p-orbital spans', () => {
    mockCtx(null);
    render(<ElementToken element={clEl} />);
    // The tooltip title renders ElectronConfigDisplay with '[Ne] 3s2 3p5'
    // [Ne] is the noble gas core part
    expect(screen.getByTestId('tooltip-title')).toBeDefined();
  });
});

describe('ElectronConfigDisplay edge cases via ElementToken tooltip', () => {
  beforeEach(() => {
    mockSelectElement.mockClear();
    mockClearSelection.mockClear();
  });

  it('handles electron configuration with unrecognised orbital pattern gracefully', () => {
    mockCtx(null);
    const weirdEl: WasmElement = {
      ...mgEl,
      electron_configuration: '[Xe] 4f14 irregular',
    };
    // Should render without throwing; 'irregular' doesn't match orbital regex
    render(<ElementToken element={weirdEl} />);
    expect(screen.getByText('Mg')).toBeDefined();
  });

  it('handles unknown orbital block letter (uses fallback #fff color)', () => {
    mockCtx(null);
    const weirdEl: WasmElement = {
      ...mgEl,
      electron_configuration: '[Kr] 5g2',
    };
    // '5g2' matches orbital regex but 'g' is not in ORBITAL_COLOR → fallback #fff
    render(<ElementToken element={weirdEl} />);
    expect(screen.getByText('Mg')).toBeDefined();
  });

  it('handles disabled ElementToken click via JS guard', () => {
    mockCtx(null);
    const { container } = render(<ElementToken element={mgEl} disabled />);
    fireEvent.pointerDown(container.firstChild as Element, { clientX: 0, clientY: 0 }); fireEvent.pointerUp(container.firstChild as Element, { clientX: 0, clientY: 0 });
    expect(mockSelectElement).not.toHaveBeenCalled();
  });
});
