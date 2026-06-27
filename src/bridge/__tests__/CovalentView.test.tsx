import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CovalentView } from '../CovalentView';
import type { ZoneState } from '../../canvas/types';

function zone(symbol: string, valenceElectrons: number): ZoneState {
  return {
    symbol,
    elementClass: 'NonMetal',
    isPolyatomic: false,
    isTransition: false,
    valenceElectrons,
    oxidationStates: [],
    derivedCharge: null,
    wrongCount: 0,
    status: 'NEUTRAL',
  };
}

function formulaText(container: HTMLElement): string {
  return (container.querySelector('.text-xl') as HTMLElement).textContent ?? '';
}

function countCircles(container: HTMLElement): number {
  return container.querySelectorAll('svg circle').length;
}

describe('CovalentView', () => {
  it('renders homonuclear O2 with double bond (nPeripheral=1, rP=38)', () => {
    // O+O: bondsNeeded 2 each, gcd 2 -> nA=nB=1, bondOrder=2
    const { container, getByText } = render(<CovalentView slotA={zone('O', 6)} slotB={zone('O', 6)} />);
    expect(formulaText(container)).toBe('O2');
    expect(getByText(/Double covalent bond/)).toBeInTheDocument();
    expect(getByText(/2 shared pairs per bond/)).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders homonuclear N2 with triple bond', () => {
    // N+N: bondsNeeded 3 each, gcd 3 -> bondOrder=3
    const { container, getByText } = render(<CovalentView slotA={zone('N', 5)} slotB={zone('N', 5)} />);
    expect(formulaText(container)).toBe('N2');
    expect(getByText(/Triple covalent bond/)).toBeInTheDocument();
    expect(getByText(/3 shared pairs per bond/)).toBeInTheDocument();
  });

  it('renders H2O (2 peripheral, central is B, single bond, peripheral lone pairs = 0)', () => {
    // H ve=1 -> bondsNeeded 1; O ve=6 -> bondsNeeded 2; gcd 1 -> nA(H)=2, nB(O)=1
    // centralIsA = nA<=nB -> 2<=1 false => central=O (slotB)
    const { container, getByText } = render(<CovalentView slotA={zone('H', 1)} slotB={zone('O', 6)} />);
    // IUPAC: H(8) before O(12) -> H first with subscript 2
    expect(formulaText(container)).toBe('H2O');
    expect(getByText(/Single covalent bond/)).toBeInTheDocument();
    expect(getByText(/1 shared pair per bond/)).toBeInTheDocument();
  });

  it('renders NH3 (3 peripheral, central is A, central lone pairs > 0)', () => {
    // N ve=5 -> 3 bonds; H ve=1 -> 1 bond; gcd 1 -> nA(N)=1, nB(H)=3
    // centralIsA true => central=N
    const { container } = render(<CovalentView slotA={zone('N', 5)} slotB={zone('H', 1)} />);
    expect(formulaText(container)).toBe('NH3');
    // 3 peripheral atoms drawn
    expect(countCircles(container)).toBeGreaterThan(3);
  });

  it('renders CH4 (4 peripheral atoms)', () => {
    // C ve=4 -> 4 bonds; H ve=1 -> 1 bond; gcd 1 -> nA(C)=1, nB(H)=4
    const { container } = render(<CovalentView slotA={zone('C', 4)} slotB={zone('H', 1)} />);
    expect(formulaText(container)).toBe('CH4');
  });

  it('renders 5+ peripheral case with count badge (else branch)', () => {
    // B ve=3 -> 8-3=5 bonds; H ve=1 -> 1 bond; gcd 1 -> nA(B)=1, nB(H)=5
    const { container, getByText } = render(<CovalentView slotA={zone('B', 3)} slotB={zone('H', 1)} />);
    expect(formulaText(container)).toBe('BH5');
    // truncated count badge "×5"
    expect(getByText('×5')).toBeInTheDocument();
  });

  it('handles a saturated atom (bondsNeeded = 0) via calcStoich fallback', () => {
    // Ne ve=8 -> bondsNeeded 0 => calcStoich returns nA=nB=1, bondOrder=1
    const { container, getByText } = render(<CovalentView slotA={zone('Ne', 8)} slotB={zone('O', 6)} />);
    expect(getByText(/Single covalent bond/)).toBeInTheDocument();
    // Ne not in IUPAC order (?? 0) -> Ne first; both counts 1 so no subscripts
    expect(formulaText(container)).toBe('NeO');
  });

  it('orders heteronuclear formula by IUPAC electronegativity with both unknown symbols', () => {
    // Both symbols absent from IUPAC_ORDER -> both default to 0, aFirst true (pa<=pb)
    const { container } = render(<CovalentView slotA={zone('Xx', 4)} slotB={zone('Yy', 6)} />);
    // slotA written first
    expect(formulaText(container).startsWith('Xx')).toBe(true);
  });

  it('orders heteronuclear formula with slotB first when slotA is more electronegative (aFirst false)', () => {
    // slotA=O (IUPAC 12) > slotB=H (8) -> aFirst false => slotB (H) written first
    const { container } = render(<CovalentView slotA={zone('O', 6)} slotB={zone('H', 1)} />);
    expect(formulaText(container)).toBe('H2O');
  });

  it('renders SO with double bond and single peripheral (heteronuclear, S before O)', () => {
    // S ve=6, O ve=6 -> both bondsNeeded 2, gcd 2 -> bondOrder 2, nA=nB=1
    const { container, getByText } = render(<CovalentView slotA={zone('S', 6)} slotB={zone('O', 6)} />);
    expect(formulaText(container)).toBe('SO');
    expect(getByText(/Double covalent bond/)).toBeInTheDocument();
  });
});
