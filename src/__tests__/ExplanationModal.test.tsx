import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExplanationModal } from '../bridge/ExplanationModal';
import { INITIAL_STATE } from '../canvas/constants';
import type { CanvasState, ZoneState } from '../canvas/types';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../canvas/hooks', () => ({
  useIonicCanvas: vi.fn(),
}));

import { useIonicCanvas } from '../canvas/hooks';

const mockDispatch = vi.fn();

function mockState(overrides: Partial<CanvasState>) {
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: { ...INITIAL_STATE, ...overrides },
    dispatch: mockDispatch,
  });
}

const mgIonised: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: 2, wrongCount: 0, status: 'IONIZED',
};
const clIonised: ZoneState = {
  symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 7, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
const feDeducing: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, oxidationStates: [2, 3], derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};
const oNeutral: ZoneState = {
  symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 6, oxidationStates: [-2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
};

describe('ExplanationModal', () => {
  beforeEach(() => mockDispatch.mockClear());

  it('renders nothing when phase is not EXPLAINING', () => {
    mockState({ canvasPhase: 'SELECTING' });
    const { container } = render(<ExplanationModal />);
    expect(container.firstChild).toBeNull();
  });

  it('shows ionic charge explanation for Mg', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Mg has 2 valence electrons/)).toBeInTheDocument();
    expect(screen.getByText(/loses 2e/)).toBeInTheDocument();
  });

  it('shows ionic charge explanation for Cl', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Cl has 7 valence electrons/)).toBeInTheDocument();
    expect(screen.getByText(/gains 1e/)).toBeInTheDocument();
  });

  it('Apply button enabled when both IONIZED, dispatches DISMISS_EXPLANATION', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    const btn = screen.getByRole('button', { name: /Apply/ });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DISMISS_EXPLANATION' });
  });

  it('Apply button disabled when TM slot still DEDUCING', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feDeducing, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).toBeDisabled();
  });

  it('shows TransitionMetalPicker for DEDUCING slot', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feDeducing, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Transition metal/)).toBeInTheDocument();
  });

  it('Apply enabled for Covalent regardless of slot status', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Covalent',
      slotA: { ...oNeutral, symbol: 'Cl', valenceElectrons: 7 },
      slotB: oNeutral,
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });

  it('Apply enabled for Metallic regardless of slot status', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
      slotA: { ...oNeutral, symbol: 'Mg', elementClass: 'Metal', valenceElectrons: 2 },
      slotB: { ...oNeutral, symbol: 'Na', elementClass: 'Metal', valenceElectrons: 1 },
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });
});
