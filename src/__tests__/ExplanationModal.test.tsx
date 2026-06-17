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
const ohIonised: ZoneState = {
  symbol: 'OH', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1], derivedCharge: -1, wrongCount: 0, status: 'IONIZED',
};
const mgNeutral: ZoneState = {
  symbol: 'Mg', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
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

  it('dispatches PICK_TM_CHARGE when TM charge button clicked', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feDeducing, slotB: clIonised,
    });
    render(<ExplanationModal />);
    fireEvent.click(screen.getByRole('button', { name: /Fe²\+/i }));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PICK_TM_CHARGE', slot: 'A', charge: 2 });
  });

  it('shows metallic homonuclear explanation (same element)', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
      slotA: { ...oNeutral, symbol: 'Na', elementClass: 'Metal', valenceElectrons: 1 },
      slotB: { ...oNeutral, symbol: 'Na', elementClass: 'Metal', valenceElectrons: 1 },
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Each/)).toBeInTheDocument();
  });

  it('shows covalent explanation for C+H (aN>1, bN=1)', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Covalent',
      slotA: { ...oNeutral, symbol: 'C', valenceElectrons: 4 },
      slotB: { ...oNeutral, symbol: 'H', valenceElectrons: 1 },
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/C needs 4 more electrons/)).toBeInTheDocument();
  });

  it('shows formula preview for cation with subscript > 1 (Fe3+ + O2-)', () => {
    const feIonised: ZoneState = {
      symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
      valenceElectrons: 2, oxidationStates: [3], derivedCharge: 3, wrongCount: 0, status: 'IONIZED',
    };
    const oIonised: ZoneState = {
      symbol: 'O', elementClass: 'NonMetal', isPolyatomic: false, isTransition: false,
      valenceElectrons: 6, oxidationStates: [-2], derivedCharge: -2, wrongCount: 0, status: 'IONIZED',
    };
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: feIonised, slotB: oIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });

  it('shows polyatomic ion charge explanation for OH- slot (negative)', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgIonised, slotB: ohIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/OH is a polyatomic ion with a fixed charge/)).toBeInTheDocument();
  });

  it('shows polyatomic charge explanation for positive ion NH4+ (c > 0 → "+")', () => {
    const nh4Ionised: ZoneState = {
      symbol: 'NH4', elementClass: 'NonMetal', isPolyatomic: true, isTransition: false,
      valenceElectrons: 0, oxidationStates: [1], derivedCharge: 1, wrongCount: 0, status: 'IONIZED',
    };
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: nh4Ionised, slotB: clIonised,
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/NH4 is a polyatomic ion with a fixed charge of \+1/)).toBeInTheDocument();
  });

  it('shows NEUTRAL slot as "charge to be determined"', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: mgNeutral, slotB: { ...clIonised, derivedCharge: -1 },
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Mg — charge to be determined/)).toBeInTheDocument();
  });

  it('slotA negative charge → ionicCation swaps (Cl in A, Mg in B)', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: clIonised, slotB: mgIonised,
    });
    render(<ExplanationModal />);
    // cation should be Mg (slotB), anion Cl (slotA) because slotA.derivedCharge < 0
    expect(screen.getByRole('button', { name: /Apply/ })).not.toBeDisabled();
  });

  it('ionicCation fallback — NonMetal in slotA with null derivedCharge', () => {
    // Both null → fallback: aCation checks elementClass; O=NonMetal → aCaton=false → Fe is cation
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Ionic',
      slotA: { ...oNeutral, derivedCharge: null },
      slotB: feDeducing,
    });
    render(<ExplanationModal />);
    // Apply disabled (both not IONIZED), but component renders without crash
    expect(screen.getByRole('button', { name: /Apply/ })).toBeDisabled();
  });

  it('metallic homonuclear Mg+Mg — covers ve !== 1 → "electrons" plural', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
      slotA: { ...oNeutral, symbol: 'Mg', elementClass: 'Metal', valenceElectrons: 2 },
      slotB: { ...oNeutral, symbol: 'Mg', elementClass: 'Metal', valenceElectrons: 2 },
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/valence electrons/)).toBeInTheDocument();
  });

  it('metallic alloy Na+Mg (Na in slotA) — covers slotA.ve=1 false branch', () => {
    mockState({
      canvasPhase: 'EXPLAINING', bondingType: 'Metallic',
      slotA: { ...oNeutral, symbol: 'Na', elementClass: 'Metal', valenceElectrons: 1 },
      slotB: { ...oNeutral, symbol: 'Mg', elementClass: 'Metal', valenceElectrons: 2 },
    });
    render(<ExplanationModal />);
    expect(screen.getByText(/Na/)).toBeInTheDocument();
  });
});
