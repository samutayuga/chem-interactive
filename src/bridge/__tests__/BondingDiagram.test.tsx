import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BondingDiagram } from '../BondingDiagram';
import type { ZoneState } from '../../canvas/types';

function ion(
  symbol: string,
  derivedCharge: number,
  opts: Partial<ZoneState> = {},
): ZoneState {
  return {
    symbol,
    elementClass: 'Metal',
    isPolyatomic: false,
    isTransition: false,
    valenceElectrons: 0,
    oxidationStates: [],
    derivedCharge,
    wrongCount: 0,
    status: 'IONIZED',
    ...opts,
  };
}

function countCircles(container: HTMLElement): number {
  return container.querySelectorAll('svg circle').length;
}

describe('BondingDiagram - LewisTransferDiagram (both regular)', () => {
  it('renders Na+ + Cl- (1:1, charges ±, no coefficients)', () => {
    const cation = ion('Na', 1, { elementClass: 'Metal', valenceElectrons: 1 });
    const anion = ion('Cl', -1, { elementClass: 'NonMetal', valenceElectrons: 7 });
    const { container, getByText, getAllByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    expect(getByText('Before')).toBeInTheDocument();
    expect(getByText('After')).toBeInTheDocument();
    expect(getByText('Ionic Bond')).toBeInTheDocument();
    // electrons moved label
    expect(getByText('1e⁻')).toBeInTheDocument();
    // single charge symbols rendered (abs === 1 path)
    expect(getAllByText('+').length).toBeGreaterThan(0);
    expect(getByText('−')).toBeInTheDocument();
    expect(countCircles(container)).toBeGreaterThan(0);
  });

  it('renders Mg2+ + O2- (gcd reduces 2:2 -> 1:1, multi-digit charges)', () => {
    const cation = ion('Mg', 2, { elementClass: 'Metal', valenceElectrons: 2 });
    const anion = ion('O', -2, { elementClass: 'NonMetal', valenceElectrons: 6 });
    const { getByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    expect(getByText('2e⁻')).toBeInTheDocument();
    // supCharge with abs > 1 -> "2+" and "2−"
    expect(getByText('2+')).toBeInTheDocument();
    expect(getByText('2−')).toBeInTheDocument();
  });

  it('renders Mg2+ + Cl- (1:2 ratio -> anion coefficient shown)', () => {
    const cation = ion('Mg', 2, { elementClass: 'Metal', valenceElectrons: 2 });
    const anion = ion('Cl', -1, { elementClass: 'NonMetal', valenceElectrons: 7 });
    const { getByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    // aCount = |cc|/gcd(2,1)=2 -> Coeff renders "2"
    expect(getByText('2')).toBeInTheDocument();
  });

  it('renders Al3+ + O2- (2:3 ratio -> both coefficients shown)', () => {
    const cation = ion('Al', 3, { elementClass: 'Metal', valenceElectrons: 3 });
    const anion = ion('O', -2, { elementClass: 'NonMetal', valenceElectrons: 6 });
    const { getAllByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    // cCount=2, aCount=3 -> both Coeff render
    expect(getAllByText('2').length).toBeGreaterThan(0);
    expect(getAllByText('3').length).toBeGreaterThan(0);
  });
});

describe('BondingDiagram - SimpleIonDiagram (polyatomic present)', () => {
  it('renders simple ion diagram when anion is polyatomic', () => {
    const cation = ion('Na', 1, { elementClass: 'Metal', valenceElectrons: 1 });
    const anion = ion('SO4', -2, { isPolyatomic: true, elementClass: 'NonMetal' });
    const { getByText, queryByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    // Simple ion diagram has no Before/After labels
    expect(queryByText('Before')).toBeNull();
    expect(getByText('Ionic Bond')).toBeInTheDocument();
    expect(getByText('↔')).toBeInTheDocument();
    // cCount = |ac|/gcd(1,2)=2 -> coefficient on cation
    expect(getByText('2')).toBeInTheDocument();
  });

  it('renders simple ion diagram when cation is polyatomic', () => {
    const cation = ion('NH4', 1, { isPolyatomic: true, elementClass: 'NonMetal' });
    const anion = ion('Cl', -1, { elementClass: 'NonMetal', valenceElectrons: 7 });
    const { getByText, queryByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    expect(queryByText('After')).toBeNull();
    expect(getByText('↔')).toBeInTheDocument();
  });

  it('renders simple ion diagram when both ions are polyatomic', () => {
    const cation = ion('NH4', 1, { isPolyatomic: true, elementClass: 'NonMetal' });
    const anion = ion('SO4', -2, { isPolyatomic: true, elementClass: 'NonMetal' });
    const { getByText } = render(<BondingDiagram cation={cation} anion={anion} />);
    expect(getByText('↔')).toBeInTheDocument();
    // 2 NH4+ : 1 SO4 2-
    expect(getByText('2')).toBeInTheDocument();
  });
});
