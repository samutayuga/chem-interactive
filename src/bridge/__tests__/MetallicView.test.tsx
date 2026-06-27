import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ZoneState } from '../../canvas/types';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }: any) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { MetallicView } from '../MetallicView';

function metal(symbol: string, valenceElectrons: number): ZoneState {
  return {
    symbol,
    elementClass: 'Metal',
    isPolyatomic: false,
    isTransition: false,
    valenceElectrons,
    oxidationStates: [valenceElectrons],
    derivedCharge: null,
    wrongCount: 0,
    status: 'NEUTRAL',
  };
}

function formulaText(container: HTMLElement): string {
  return (container.querySelector('.text-xl') as HTMLElement).textContent ?? '';
}

function electronCount(container: HTMLElement): number {
  return container.querySelectorAll('[fill="#fde047"]').length;
}

function ionSymbolCount(container: HTMLElement, symbol: string): number {
  return Array.from(container.querySelectorAll('svg text')).filter(
    (t) => t.textContent === symbol,
  ).length;
}

describe('MetallicView', () => {
  it('renders pure metal (homonuclear) Na+Na', () => {
    const { container, getByText } = render(
      <MetallicView slotA={metal('Na', 1)} slotB={metal('Na', 1)} />,
    );
    expect(formulaText(container)).toBe('Na');
    expect(getByText('Pure metal · metallic bond')).toBeInTheDocument();
    // 6 lattice sites all Na
    expect(ionSymbolCount(container, 'Na')).toBe(6);
    // electronCount = min(3*1 + 3*1, 12) = 6
    expect(electronCount(container)).toBe(6);
  });

  it('renders alloy (heteronuclear) Na+Mg with both ion colours/symbols', () => {
    const { container, getByText } = render(
      <MetallicView slotA={metal('Na', 1)} slotB={metal('Mg', 2)} />,
    );
    expect(formulaText(container)).toBe('Na + Mg');
    expect(getByText('Alloy · metallic bond')).toBeInTheDocument();
    // 3 of each symbol across the 6 lattice sites
    expect(ionSymbolCount(container, 'Na')).toBe(3);
    expect(ionSymbolCount(container, 'Mg')).toBe(3);
    // electronCount = min(3*1 + 3*2, 12) = 9
    expect(electronCount(container)).toBe(9);
  });

  it('caps the electron sea at the pool size (12)', () => {
    // 3*3 + 3*3 = 18, capped to ELECTRON_POOL.length = 12
    const { container } = render(<MetallicView slotA={metal('Al', 3)} slotB={metal('Al', 3)} />);
    expect(electronCount(container)).toBe(12);
  });
});
