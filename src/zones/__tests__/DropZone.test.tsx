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

function mockCtx(selectedElement: ZoneState | null, overrides: Record<string, unknown> = {}) {
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
    fireEvent.click(screen.getByText(/Tap to place Mg here/));
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

  it('Replace button dispatches REPLACE_ELEMENT and stops propagation', () => {
    const naZone: ZoneState = {
      symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
    };
    mockCtx(null, { slotA: naZone });
    render(<DropZone slot="A" />);
    const replaceBtn = screen.getByRole('button', { name: /Replace left element/ });
    fireEvent.click(replaceBtn);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'REPLACE_ELEMENT', slot: 'A' });
  });

  it('renders ionized format with single-charge sign (abs === 1)', () => {
    const naIonized: ZoneState = {
      symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1], derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
    };
    mockCtx(null, { slotA: naIonized });
    render(<DropZone slot="A" />);
    expect(screen.getByText('Na⁺')).toBeDefined();
  });

  it('renders ionized format with multi-charge superscript (abs > 1)', () => {
    const mgIonized: ZoneState = {
      symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 2, oxidationStates: [2], derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
    };
    mockCtx(null, { slotA: mgIonized });
    render(<DropZone slot="A" />);
    expect(screen.getByText('Mg²⁺')).toBeDefined();
  });

  it('renders ionized format with negative charge', () => {
    const clIonized: ZoneState = {
      symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 7, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
    };
    mockCtx(null, { slotA: clIonized });
    render(<DropZone slot="A" />);
    expect(screen.getByText('Cl⁻')).toBeDefined();
  });

  it('renders slot B colors and replace right label', () => {
    const naZone: ZoneState = {
      symbol: 'Na', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
    };
    mockCtx(null, { slotB: naZone });
    render(<DropZone slot="B" />);
    expect(screen.getByRole('button', { name: /Replace right element/ })).toBeDefined();
  });
});
