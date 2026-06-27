import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { WasmElement } from '@periodic-table';
import type { ZoneState } from '../../canvas/types';

vi.mock('@mui/material/Tooltip', () => ({ default: ({ children }: any) => children }));

vi.mock('../../wasm/hooks', () => ({
  useAllElements: vi.fn(),
  usePolyatomicIons: vi.fn(),
}));
vi.mock('../../canvas/hooks', () => ({ useIonicCanvas: vi.fn() }));

vi.mock('../ElementToken', () => ({
  ElementToken: ({ element, bondHint, disabled }: any) => (
    <div
      data-testid="el"
      data-symbol={element.symbol}
      data-hint={bondHint ?? 'null'}
      data-disabled={String(!!disabled)}
    >
      {element.symbol}
    </div>
  ),
  PolyatomicToken: ({ ion, disabled }: any) => (
    <div data-testid="poly" data-symbol={ion.symbol} data-disabled={String(!!disabled)}>{ion.symbol}</div>
  ),
}));

import { useAllElements, usePolyatomicIons } from '../../wasm/hooks';
import { useIonicCanvas } from '../../canvas/hooks';
import { ElementTray } from '../ElementTray';

function el(o: Partial<WasmElement>): WasmElement {
  return {
    symbol: 'X', name: 'X', atomic_number: 1, mass_number: 1,
    period: 1, group: 1, block: 's', category: 'ReactiveNonmetal',
    class: 'NonMetal', electron_configuration: '1s1',
    oxidation_states: [1], valence_electrons: 1, ...o,
  };
}

const Na  = el({ symbol: 'Na', atomic_number: 11, group: 1,  period: 3, category: 'AlkaliMetal',        class: 'Metal' });
const Mg  = el({ symbol: 'Mg', atomic_number: 12, group: 2,  period: 3, category: 'AlkalineEarthMetal', class: 'Metal' });
const B   = el({ symbol: 'B',  atomic_number: 5,  group: 13, period: 2, category: 'Metalloid',          class: 'Metalloid' });
const C   = el({ symbol: 'C',  atomic_number: 6,  group: 14, period: 2, category: 'ReactiveNonmetal',   class: 'NonMetal' });
const Cl  = el({ symbol: 'Cl', atomic_number: 17, group: 17, period: 3, category: 'Halogen',            class: 'NonMetal' });
const Ne  = el({ symbol: 'Ne', atomic_number: 10, group: 18, period: 2, category: 'NobleGas',           class: 'NonMetal' });
const La  = el({ symbol: 'La', atomic_number: 57, group: 3,  period: 6, category: 'Lanthanide',         class: 'Metal' });
const Ac  = el({ symbol: 'Ac', atomic_number: 89, group: 3,  period: 7, category: 'Actinide',           class: 'Metal' });

const FULL = [Na, Mg, B, C, Cl, Ne, La, Ac];

const IONS = [
  { symbol: 'OH',  name: 'Hydroxide', charge: -1, formula: 'OH⁻' },
  { symbol: 'NO₃', name: 'Nitrate',   charge: -1, formula: 'NO₃⁻' },
  { symbol: 'SO₄', name: 'Sulfate',   charge: -2, formula: 'SO₄²⁻' },
  { symbol: 'CO₃', name: 'Carbonate', charge: -2, formula: 'CO₃²⁻' },
  { symbol: 'PO₄', name: 'Phosphate', charge: -3, formula: 'PO₄³⁻' },
  { symbol: 'NH₄', name: 'Ammonium',  charge:  1, formula: 'NH₄⁺' },
];

function zone(o: Partial<ZoneState>): ZoneState {
  return {
    symbol: 'Z', elementClass: 'Metal', isPolyatomic: false, isTransition: false,
    valenceElectrons: 1, oxidationStates: [1], derivedCharge: null, wrongCount: 0, status: 'NEUTRAL', ...o,
  };
}

function mockTray(stateOverrides: Record<string, unknown> = {}, elements: WasmElement[] = FULL) {
  (useAllElements as ReturnType<typeof vi.fn>).mockReturnValue(elements);
  (usePolyatomicIons as ReturnType<typeof vi.fn>).mockReturnValue(IONS);
  (useIonicCanvas as ReturnType<typeof vi.fn>).mockReturnValue({
    state: { canvasPhase: 'SELECTING', slotA: null, slotB: null, ...stateOverrides },
    dispatch: vi.fn(),
  });
}

function hintFor(symbol: string): string | null {
  const node = [...document.querySelectorAll('[data-testid="el"]')]
    .find(n => n.getAttribute('data-symbol') === symbol);
  return node ? node.getAttribute('data-hint') : null;
}

beforeEach(() => vi.clearAllMocks());

describe('ElementTray rendering', () => {
  it('renders main-block elements and f-block lanthanides/actinides, no bond hints when both slots empty', () => {
    mockTray();
    render(<ElementTray />);
    expect(hintFor('Na')).toBe('null');
    expect(hintFor('La')).toBe('null');
    expect(hintFor('Ac')).toBe('null');
    // no legend when nothing dropped
    expect(screen.queryByText('Ionic')).toBeNull();
  });

  it('switches to the polyatomic tab and renders ions', () => {
    mockTray();
    render(<ElementTray />);
    fireEvent.click(screen.getByText('Polyatomic Ions'));
    const polys = screen.getAllByTestId('poly');
    expect(polys).toHaveLength(IONS.length);
  });

  it('fires group and element hover handlers (period/group highlight state)', () => {
    mockTray();
    render(<ElementTray />);
    const na = [...document.querySelectorAll('[data-testid="el"]')]
      .find(n => n.getAttribute('data-symbol') === 'Na') as HTMLElement;
    const elWrapper = na.parentElement as HTMLElement;        // onMouseEnter/Leave -> setHoveredPeriod
    const groupWrapper = elWrapper.parentElement as HTMLElement; // onMouseEnter/Leave -> setHoveredGroup
    fireEvent.mouseEnter(groupWrapper);
    fireEvent.mouseEnter(elWrapper);
    fireEvent.mouseLeave(elWrapper);
    fireEvent.mouseLeave(groupWrapper);
    // no throw and the token is still present
    expect(na).toBeInTheDocument();
  });

  it('disables tokens during ANIMATING_CROSSOVER', () => {
    mockTray({ canvasPhase: 'ANIMATING_CROSSOVER' });
    render(<ElementTray />);
    expect(hintFor('Na')).toBe('null');
    const na = [...document.querySelectorAll('[data-testid="el"]')]
      .find(n => n.getAttribute('data-symbol') === 'Na');
    expect(na).toHaveAttribute('data-disabled', 'true');
  });
});

describe('ElementTray bondHint branches', () => {
  it('firstClass Metal: metallic (metal+metal), ionic (metal+nonmetal/metalloid), none (noble gas)', () => {
    mockTray({ slotA: zone({ symbol: 'Na', elementClass: 'Metal' }) });
    render(<ElementTray />);
    expect(hintFor('Mg')).toBe('metallic'); // metal + metal
    expect(hintFor('C')).toBe('ionic');     // metal + nonmetal
    expect(hintFor('B')).toBe('ionic');     // metal + metalloid
    expect(hintFor('Ne')).toBe('none');     // noble gas
    expect(screen.getByText('Ionic')).toBeInTheDocument(); // legend shown
  });

  it('firstClass NonMetal: covalent (nonmetal+nonmetal / nonmetal+metalloid), ionic (nonmetal+metal)', () => {
    mockTray({ slotA: zone({ symbol: 'C', elementClass: 'NonMetal' }) });
    render(<ElementTray />);
    expect(hintFor('Cl')).toBe('covalent'); // nonmetal + nonmetal
    expect(hintFor('B')).toBe('covalent');  // nonmetal + metalloid
    expect(hintFor('Na')).toBe('ionic');    // nonmetal + metal
  });

  it('firstClass Metalloid: covalent for metalloid/nonmetal mixes, ionic for metals', () => {
    mockTray({ slotA: zone({ symbol: 'B', elementClass: 'Metalloid' }) });
    render(<ElementTray />);
    expect(hintFor('B')).toBe('covalent');  // metalloid + metalloid
    expect(hintFor('Cl')).toBe('covalent'); // metalloid + nonmetal
    expect(hintFor('Na')).toBe('ionic');    // metalloid + metal
  });

  it('firstIsPolyatomic always ionic (except noble gas)', () => {
    mockTray({ slotB: zone({ symbol: 'SO₄', elementClass: 'NonMetal', isPolyatomic: true }) });
    render(<ElementTray />);
    expect(hintFor('Na')).toBe('ionic');
    expect(hintFor('Cl')).toBe('ionic');
    expect(hintFor('Ne')).toBe('none'); // noble-gas guard still wins
  });

  it('uses slotB as the first slot when only B is filled', () => {
    mockTray({ slotB: zone({ symbol: 'Cl', elementClass: 'NonMetal' }) });
    render(<ElementTray />);
    expect(hintFor('C')).toBe('covalent');
  });

  it('shows no hints when both slots are filled', () => {
    mockTray({
      slotA: zone({ symbol: 'Na', elementClass: 'Metal' }),
      slotB: zone({ symbol: 'Cl', elementClass: 'NonMetal' }),
    });
    render(<ElementTray />);
    expect(hintFor('Mg')).toBe('null');
    expect(screen.queryByText('Ionic')).toBeNull();
  });
});

describe('ElementTray f-block presence branches', () => {
  it('omits the f-block section entirely when there are no lanthanides/actinides', () => {
    mockTray({}, [Na, Mg, C, Cl]);
    render(<ElementTray />);
    expect(screen.queryByText('6f')).toBeNull();
    expect(screen.queryByText('7f')).toBeNull();
  });

  it('renders only the lanthanide row when no actinides are present', () => {
    mockTray({}, [Na, La]);
    render(<ElementTray />);
    expect(screen.getByText('6f')).toBeInTheDocument();
    expect(screen.queryByText('7f')).toBeNull();
  });

  it('renders only the actinide row when no lanthanides are present', () => {
    mockTray({}, [Na, Ac]);
    render(<ElementTray />);
    expect(screen.queryByText('6f')).toBeNull();
    expect(screen.getByText('7f')).toBeInTheDocument();
  });
});
