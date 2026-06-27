import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PeriodicTable } from '@periodic-table';
import type { ZoneState } from '../../canvas/types';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../canvas/hooks', () => ({ useIonicCanvas: vi.fn() }));

const pt = PeriodicTable.load();
vi.mock('../../wasm/hooks', () => ({ useWasm: () => pt }));

// Stub the SVG child components to keep the test focused on BridgeColumn branches.
vi.mock('../CrossoverAnimator', () => ({
  CrossoverAnimator: ({ cation, anion, onComplete }: any) => (
    <button data-testid="crossover" data-cation={cation.symbol} data-anion={anion.symbol} onClick={onComplete}>
      crossover
    </button>
  ),
}));
vi.mock('../BondingDiagram', () => ({
  BondingDiagram: ({ cation, anion }: any) => (
    <div data-testid="bonding" data-cation={cation.symbol} data-anion={anion.symbol}>bonding</div>
  ),
}));
vi.mock('../CovalentView', () => ({ CovalentView: () => <div data-testid="covalent">covalent</div> }));
vi.mock('../MetallicView', () => ({ MetallicView: () => <div data-testid="metallic">metallic</div> }));
vi.mock('../ExplanationModal', () => ({ ExplanationModal: () => <div data-testid="explanation">explanation</div> }));

// Stoichiometry children — stub so we can drive the onChange/RESET dispatch arrows.
vi.mock('../../stoich/ReactantQuantityPopover', () => ({
  ReactantQuantityPopover: ({ symbol, onChange }: any) => (
    <button data-testid={`qty-${symbol}`} onClick={() => onChange({ value: 1, unit: 'mole' })}>{symbol}</button>
  ),
}));
vi.mock('../../stoich/StoichResultPanel', () => ({
  StoichResultPanel: ({ productFormula }: any) => <div data-testid="stoich-result">{productFormula}</div>,
}));
vi.mock('../../stoich/ProductStateBadge', () => ({
  ProductStateBadge: ({ state }: any) => <div data-testid="badge">{state}</div>,
}));

import { useIonicCanvas } from '../../canvas/hooks';
import { BridgeColumn } from '../BridgeColumn';

function zone(overrides: Partial<ZoneState>): ZoneState {
  return {
    symbol: 'X', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
    valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL',
    ...overrides,
  };
}

let dispatch: ReturnType<typeof vi.fn>;
function mockState(overrides: Record<string, unknown>) {
  dispatch = vi.fn();
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: {
      canvasPhase: 'SELECTING', bondingType: null,
      slotA: null, slotB: null, quantityA: null, quantityB: null, ...overrides,
    },
    dispatch,
  });
}

beforeEach(() => vi.clearAllMocks());

describe('BridgeColumn EXPLAINING phase', () => {
  it('renders the ExplanationModal', () => {
    mockState({ canvasPhase: 'EXPLAINING' });
    render(<BridgeColumn />);
    expect(screen.getByTestId('explanation')).toBeInTheDocument();
  });
});

describe('BridgeColumn ANIMATING_CROSSOVER phase (ionicPair fallback)', () => {
  it('renders CrossoverAnimator with cation = metal slotA (fallback branch)', () => {
    const slotA = zone({ symbol: 'Na', elementClass: 'Metal', derivedCharge: null });
    const slotB = zone({ symbol: 'Cl', elementClass: 'NonMetal', derivedCharge: null });
    mockState({ canvasPhase: 'ANIMATING_CROSSOVER', slotA, slotB });
    render(<BridgeColumn />);
    const node = screen.getByTestId('crossover');
    expect(node).toHaveAttribute('data-cation', 'Na');
    expect(node).toHaveAttribute('data-anion', 'Cl');
    // onComplete -> dispatch CROSSOVER_COMPLETE
    fireEvent.click(node);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CROSSOVER_COMPLETE' });
  });

  it('uses slotB as cation when slotA is not a metal (fallback else branch)', () => {
    const slotA = zone({ symbol: 'Cl', elementClass: 'NonMetal', derivedCharge: null });
    const slotB = zone({ symbol: 'Na', elementClass: 'Metal', derivedCharge: null });
    mockState({ canvasPhase: 'ANIMATING_CROSSOVER', slotA, slotB });
    render(<BridgeColumn />);
    const node = screen.getByTestId('crossover');
    expect(node).toHaveAttribute('data-cation', 'Na');
    expect(node).toHaveAttribute('data-anion', 'Cl');
  });
});

describe('BridgeColumn COMPLETE + Ionic phase', () => {
  const formulaText = (c: HTMLElement) =>
    (c.querySelector('span.font-bold') as HTMLElement | null)?.textContent ?? '';

  it('renders 1:1 formula, diagram, and buttons dispatch (derivedCharge positive cation branch)', () => {
    const slotA = zone({ symbol: 'Na', elementClass: 'Metal', derivedCharge: 1 });
    const slotB = zone({ symbol: 'Cl', elementClass: 'NonMetal', derivedCharge: -1 });
    mockState({ canvasPhase: 'COMPLETE', bondingType: 'Ionic', slotA, slotB });
    const { container } = render(<BridgeColumn />);

    expect(screen.getByTestId('bonding')).toHaveAttribute('data-cation', 'Na');
    // formula NaCl: no subscripts
    expect(formulaText(container)).toBe('NaCl');

    fireEvent.click(screen.getByText('Stoichiometry →'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'ENTER_STOICH' });
    fireEvent.click(screen.getByText('Reset'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });

  it('renders subscript on anion (aSub > 1, non-polyatomic) MgCl2', () => {
    const slotA = zone({ symbol: 'Mg', elementClass: 'Metal', derivedCharge: 2 });
    const slotB = zone({ symbol: 'Cl', elementClass: 'NonMetal', derivedCharge: -1 });
    mockState({ canvasPhase: 'COMPLETE', bondingType: 'Ionic', slotA, slotB });
    const { container } = render(<BridgeColumn />);
    expect(formulaText(container)).toBe('MgCl2');
  });

  it('renders cation subscript (cSub > 1) with polyatomic anion not parenthesised (Na2SO4)', () => {
    const slotA = zone({ symbol: 'Na', elementClass: 'Metal', derivedCharge: 1 });
    const slotB = zone({ symbol: 'SO₄', elementClass: 'NonMetal', isPolyatomic: true, derivedCharge: -2 });
    mockState({ canvasPhase: 'COMPLETE', bondingType: 'Ionic', slotA, slotB });
    const { container } = render(<BridgeColumn />);
    expect(formulaText(container)).toBe('Na2SO₄');
  });

  it('parenthesises a polyatomic anion when aSub > 1 (Ca(NO3)2) and cation negative-charge branch', () => {
    // slotA is the anion (negative), slotB is the cation (positive) -> exercises derivedCharge<=0 else branch
    const slotA = zone({ symbol: 'NO₃', elementClass: 'NonMetal', isPolyatomic: true, derivedCharge: -1 });
    const slotB = zone({ symbol: 'Ca', elementClass: 'Metal', derivedCharge: 2 });
    mockState({ canvasPhase: 'COMPLETE', bondingType: 'Ionic', slotA, slotB });
    const { container } = render(<BridgeColumn />);
    expect(screen.getByTestId('bonding')).toHaveAttribute('data-cation', 'Ca');
    expect(formulaText(container)).toBe('Ca(NO₃)2');
  });
});

describe('BridgeColumn SHOWING_COVALENT phase', () => {
  it('renders CovalentView and buttons dispatch', () => {
    const slotA = zone({ symbol: 'H', elementClass: 'NonMetal' });
    const slotB = zone({ symbol: 'O', elementClass: 'NonMetal' });
    mockState({ canvasPhase: 'SHOWING_COVALENT', bondingType: 'Covalent', slotA, slotB });
    render(<BridgeColumn />);
    expect(screen.getByTestId('covalent')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Stoichiometry →'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'ENTER_STOICH' });
    fireEvent.click(screen.getByText('Reset'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });
});

describe('BridgeColumn SHOWING_METALLIC phase', () => {
  it('renders MetallicView and buttons dispatch', () => {
    const slotA = zone({ symbol: 'Fe', elementClass: 'Metal' });
    const slotB = zone({ symbol: 'Cu', elementClass: 'Metal' });
    mockState({ canvasPhase: 'SHOWING_METALLIC', bondingType: 'Metallic', slotA, slotB });
    render(<BridgeColumn />);
    expect(screen.getByTestId('metallic')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Stoichiometry →'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'ENTER_STOICH' });
    fireEvent.click(screen.getByText('Reset'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });
});

describe('BridgeColumn STOICHIOMETRY phase (productInfo branches + dispatch arrows)', () => {
  it('ionic product (NaCl): badge, popovers dispatch SET_QUANTITY, reset dispatches', () => {
    const slotA = zone({ symbol: 'Na', elementClass: 'Metal', derivedCharge: 1, oxidationStates: [1] });
    const slotB = zone({ symbol: 'Cl', elementClass: 'NonMetal', derivedCharge: -1, oxidationStates: [-1] });
    mockState({ canvasPhase: 'STOICHIOMETRY', bondingType: 'Ionic', slotA, slotB, quantityA: null, quantityB: null });
    render(<BridgeColumn />);
    expect(screen.getByTestId('badge')).toBeInTheDocument(); // reaction present -> ProductStateBadge

    fireEvent.click(screen.getByTestId('qty-Na'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_QUANTITY', slot: 'A', entry: { value: 1, unit: 'mole' } });
    fireEvent.click(screen.getByTestId('qty-Cl'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'SET_QUANTITY', slot: 'B', entry: { value: 1, unit: 'mole' } });
    fireEvent.click(screen.getByText('Reset'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });

  it('ionic product with polyatomic anion + subscript > 1, both quantities -> result panel', () => {
    // synthetic: Ca + Cl classified Ionic, but slotB flagged polyatomic so productInfo parenthesises it
    const slotA = zone({ symbol: 'Ca', elementClass: 'Metal', derivedCharge: 2, oxidationStates: [2] });
    const slotB = zone({ symbol: 'Cl', elementClass: 'NonMetal', isPolyatomic: true, derivedCharge: -1, oxidationStates: [-1] });
    mockState({
      canvasPhase: 'STOICHIOMETRY', bondingType: 'Ionic', slotA, slotB,
      quantityA: { value: 1, unit: 'mole' }, quantityB: { value: 1, unit: 'mole' },
    });
    render(<BridgeColumn />);
    const result = screen.getByTestId('stoich-result');
    expect(result).toBeInTheDocument();
    expect(result.textContent).toContain('(Cl)2'); // polyatomic parenthesised, subscript 2
  });

  it('non-ionic/non-covalent fallback with different symbols (Fe·Cu), badge shown', () => {
    const slotA = zone({ symbol: 'Fe', elementClass: 'Metal', derivedCharge: 2 });
    const slotB = zone({ symbol: 'Cu', elementClass: 'Metal', derivedCharge: 2 });
    mockState({ canvasPhase: 'STOICHIOMETRY', bondingType: 'Metallic', slotA, slotB });
    render(<BridgeColumn />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('fallback with identical symbols uses the bare symbol and shows no badge when reaction is undefined', () => {
    // polyatomic symbols -> pt.react returns undefined -> reaction falsy, fallback formula path
    const slotA = zone({ symbol: 'SO₄', elementClass: 'NonMetal', isPolyatomic: true, derivedCharge: -2 });
    const slotB = zone({ symbol: 'SO₄', elementClass: 'NonMetal', isPolyatomic: true, derivedCharge: -2 });
    mockState({ canvasPhase: 'STOICHIOMETRY', bondingType: 'Ionic', slotA, slotB });
    render(<BridgeColumn />);
    expect(screen.queryByTestId('badge')).toBeNull(); // reaction undefined -> no badge
  });
});
