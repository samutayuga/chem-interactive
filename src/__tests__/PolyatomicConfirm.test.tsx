import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PolyatomicConfirm } from '../zones/PolyatomicConfirm';
import type { ZoneState } from '../canvas/types';

const ohZone: ZoneState = {
  symbol: 'OH', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-1],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

const so4Zone: ZoneState = {
  symbol: 'SO4', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [-2],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

const nh4Zone: ZoneState = {
  symbol: 'NH4', isPolyatomic: true, isTransition: false,
  valenceElectrons: 0, oxidationStates: [1],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('PolyatomicConfirm', () => {
  it('shows the charge callout', () => {
    render(<PolyatomicConfirm zone={ohZone} onConfirm={vi.fn()} />);
    expect(screen.getByText(/OH.*carries.*−1/i)).toBeInTheDocument();
  });

  it('calls onConfirm on Got it click', () => {
    const onConfirm = vi.fn();
    render(<PolyatomicConfirm zone={ohZone} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: /got it/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('formats negative charge other than -1 with minus prefix', () => {
    render(<PolyatomicConfirm zone={so4Zone} onConfirm={vi.fn()} />);
    expect(screen.getByText(/SO4.*carries.*−2/i)).toBeInTheDocument();
  });

  it('formats positive charge with plus prefix', () => {
    render(<PolyatomicConfirm zone={nh4Zone} onConfirm={vi.fn()} />);
    expect(screen.getByText(/NH4.*carries.*\+1/i)).toBeInTheDocument();
  });
});
