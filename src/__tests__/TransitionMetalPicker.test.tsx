import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransitionMetalPicker } from '../zones/TransitionMetalPicker';
import type { ZoneState } from '../canvas/types';

const feZone: ZoneState = {
  symbol: 'Fe', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 2, group: 0, period: 0, oxidationStates: [2, 3],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

const osZone: ZoneState = {
  symbol: 'Os', elementClass: 'Metal', isPolyatomic: false, isTransition: true,
  valenceElectrons: 6, group: 0, period: 0, oxidationStates: [8],
  derivedCharge: null, wrongCount: 0, status: 'DEDUCING',
};

describe('TransitionMetalPicker', () => {
  it('renders a button per positive oxidation state', () => {
    render(<TransitionMetalPicker zone={feZone} onPick={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Fe²\+/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fe³\+/i })).toBeInTheDocument();
  });

  it('calls onPick with selected charge', () => {
    const onPick = vi.fn();
    render(<TransitionMetalPicker zone={feZone} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: /Fe³\+/i }));
    expect(onPick).toHaveBeenCalledWith(3);
  });

  it('falls back to numeric label for charge > 7', () => {
    render(<TransitionMetalPicker zone={osZone} onPick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Os8+' })).toBeInTheDocument();
  });
});
