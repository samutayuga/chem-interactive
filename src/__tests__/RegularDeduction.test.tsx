import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegularDeduction } from '../zones/RegularDeduction';
import type { ZoneState } from '../canvas/types';

const mgZone: ZoneState = {
  symbol: 'Mg', isPolyatomic: false, isTransition: false,
  valenceElectrons: 2, oxidationStates: [2],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('RegularDeduction', () => {
  it('renders lose and gain buttons', () => {
    render(<RegularDeduction zone={mgZone} slot="A" onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /lose/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gain/i })).toBeInTheDocument();
  });

  it('renders count buttons 1-4', () => {
    render(<RegularDeduction zone={mgZone} slot="A" onSubmit={vi.fn()} />);
    ['1','2','3','4'].forEach(n => {
      expect(screen.getByRole('button', { name: n })).toBeInTheDocument();
    });
  });

  it('calls onSubmit with lose/2 when Lose then 2 clicked', () => {
    const onSubmit = vi.fn();
    render(<RegularDeduction zone={mgZone} slot="A" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /lose/i }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onSubmit).toHaveBeenCalledWith('lose', 2);
  });

  it('shows hint when wrongCount >= 2', () => {
    render(<RegularDeduction zone={{ ...mgZone, wrongCount: 2 }} slot="A" onSubmit={vi.fn()} />);
    expect(screen.getByText(/2 valence/i)).toBeInTheDocument();
  });

  it('does not show hint when wrongCount < 2', () => {
    render(<RegularDeduction zone={{ ...mgZone, wrongCount: 1 }} slot="A" onSubmit={vi.fn()} />);
    expect(screen.queryByText(/valence/i)).not.toBeInTheDocument();
  });

  it('uses anion accent class for slot B', () => {
    render(<RegularDeduction zone={mgZone} slot="B" onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /lose/i })).toBeInTheDocument();
  });

  it('shows singular "electron" in hint when valenceElectrons is 1', () => {
    const naZone = { ...mgZone, symbol: 'Na', valenceElectrons: 1, wrongCount: 2 };
    render(<RegularDeduction zone={naZone} slot="A" onSubmit={vi.fn()} />);
    expect(screen.getByText(/1 valence electron[^s]/i)).toBeInTheDocument();
  });
});
